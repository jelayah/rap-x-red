
import { Experience } from '../types';
import type { GameStateBundle, Song, Album, Player, ChartData, ChartEntry, Notification, GameEvent, Tour, ChartId, Promotion, PitchforkReview, NPCArtist, SocialPost, MerchItem, Transaction, TourStop } from '../types';
import { CHART_IDS, CHART_NAMES, PITCHFORK_REVIEWS, REVIEW_AUTHORS, FAME_STATS, GENRES, MOODS, TOPICS, difficultySettings } from '../constants';
import { updateCertifications } from './recordService';
import { NPC_ARTISTS } from '../data/artists';
import { generateWeeklyTweets, DepartureInfo } from './socialMediaService';

const toDate = (d: any) => (d instanceof Date ? d : new Date(d));

const getVariance = (seed: string) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = ((hash << 5) - hash) + seed.charCodeAt(i);
        hash |= 0;
    }
    return (Math.abs(hash % 100) / 100) * 0.15 + 0.92; 
};

/**
 * Generates a realistic target for NPC items based on chart position.
 * This is used to fill the world with competitive items.
 */
const getTargetSongStreams = (pos: number, chartId: ChartId) => {
    if (chartId === 'bubblingUnderHot50') {
        return 5_800_000 - ((pos - 1) * (3_200_000 / 49));
    }
    if (pos === 1) return 65_000_000;
    if (pos <= 15) return 65_000_000 - ((pos - 1) * (30_000_000 / 14));
    if (pos <= 50) return 35_000_000 - ((pos - 15) * (17_000_000 / 35));
    return 18_000_000 - ((pos - 50) * (12_000_000 / 50));
};

const getTargetAlbumUnits = (pos: number) => {
    if (pos === 1) return 350_000;
    if (pos <= 4) return 350_000 - ((pos - 1) * (230_000 / 3));
    if (pos <= 50) return 120_000 - ((pos - 4) * (90_000 / 46));
    return 30_000 - ((pos - 50) * (26_000 / 150)); 
};

const handleNPCReleases = (npcSongs: Song[], npcAlbums: Album[], gameDate: Date) => {
    const newSongs: Song[] = [];
    const newAlbums: Album[] = [];
    const releaseDate = toDate(gameDate);
    const TWENTY_WEEKS_MS = 20 * 7 * 24 * 60 * 60 * 1000;

    const songCount = 17;
    for (let i = 0; i < songCount; i++) {
        const artist = NPC_ARTISTS[Math.floor(Math.random() * NPC_ARTISTS.length)];
        const stats = FAME_STATS[artist.fameTier as keyof typeof FAME_STATS];
        const quality = Math.floor(Math.random() * 30) + 65;
        
        const npcSong: Song = {
            id: `npc_drop_${artist.name}_${Date.now()}_${i}`,
            title: `${TOPICS[Math.floor(Math.random() * TOPICS.length)]} ${MOODS[Math.floor(Math.random() * MOODS.length)]}`,
            artistName: artist.name, genre: GENRES[Math.floor(Math.random() * GENRES.length)], mood: 'Standard', topic: 'Standard', quality,
            rapifyStreams: 0, rappleStreams: 0, rapTunesStreams: 0, sales: 0, weeklyStreams: 0, weeklySales: 0, releaseDate,
            isReleased: true, version: 'Explicit', price: 1.29, charts: {}, chartHistory: {}, shazams: 0, radioSpins: 0,
            weeklyRadioAudience: 0, weeklyRadioSpins: 0, duration: 180, coverArt: "https://thumbs2.imgbox.com/53/9d/TPyXhrMO_t.jpg",
            certifications: [], features: [], producers: ['Industry AI'], writers: [artist.name], studio: 'Studio',
            copyright: 'NPC Records', submittedToRadio: true, payolaBudget: 0, isLossless: true, isDolbyAtmos: false,
            dissTrack: null, youtubeAudioViews: 0, youtubeVideoViews: 0, hasMusicVideo: Math.random() > 0.4, videoQuality: quality, youtubeViewHistory: [],
            regionalStreams: {}
        };
        
        const fameMultiplier = stats.power / 100;
        const isHot100Candidate = i < 10;
        // Seed initial raw performance
        const baseTarget = isHot100Candidate ? 45_000_000 : 5_000_000;
        npcSong.rawPerformance = baseTarget * fameMultiplier * (quality / 100) * (Math.random() * 0.5 + 0.5);
        newSongs.push(npcSong);
    }

    const weekNumber = Math.ceil(releaseDate.getDate() / 7) + (releaseDate.getMonth() * 4);
    const isSurgeWeek = weekNumber % 12 === 0;
    const albumLimit = isSurgeWeek ? 10 : 6;
    
    let albumsCreated = 0;
    const shuffledArtists = [...NPC_ARTISTS].sort(() => Math.random() - 0.5);
    for (const artist of shuffledArtists) {
        if (albumsCreated >= albumLimit) break;
        const artistHistory = npcAlbums.filter(a => a.artistName === artist.name);
        if (artistHistory.length > 0 && (releaseDate.getTime() - toDate(artistHistory[artistHistory.length-1].releaseDate).getTime()) < TWENTY_WEEKS_MS) continue;

        const stats = FAME_STATS[artist.fameTier as keyof typeof FAME_STATS];
        const npcAlbum: Album = {
            id: `npc_album_${artist.name}_${Date.now()}_${albumsCreated}`,
            title: `The ${artist.name} Tape`, 
            artistName: artist.name, type: 'Album', songs: [], unitSales: 0, pureSales: 0, streamEquivalents: 0, weeklyUnitSales: 0, 
            releaseDate: new Date(releaseDate), coverArt: "https://thumbs2.imgbox.com/53/9d/TPyXhrMO_t.jpg", price: 9.99, 
            chartHistory: {}, certifications: [], copyright: 'NPC', updatedThisCycle: false
        };
        const fameMultiplier = stats.power / 100;
        npcAlbum.rawPerformance = 350_000 * fameMultiplier * (Math.random() * 0.4 + 0.6) * 1500; 
        newAlbums.push(npcAlbum);
        albumsCreated++;
    }
    return { newSongs, newAlbums };
};

const calculateRawPerformance = (song: Song, ml: number, rep: number, isNPC: boolean, promotions: Promotion[], currentDate: Date, tIndex: number = 0, isAlb: boolean = false) => {
    if (isNPC && song.rawPerformance) return song.rawPerformance;
    const releaseDate = toDate(song.releaseDate);
    const weeksSinceRelease = Math.max(0, Math.floor((currentDate.getTime() - releaseDate.getTime()) / (7 * 24 * 60 * 60 * 1000)));
    
    // Softened longevity logic:
    // Higher quality tracks stick around much better.
    const stability = song.quality > 90 ? 0.992 : (song.quality > 80 ? 0.985 : (song.quality > 65 ? 0.96 : 0.92));
    
    let power = (ml * 0.25) + (rep * 4000);
    const qualityWeight = Math.pow(song.quality / 60, 4.5);
    let base = (power * 0.1) + (power * 0.9 * qualityWeight);
    
    // softer debut multiplier (was 15/35, now 6/12) to prevent massive "drop off a cliff"
    if (weeksSinceRelease < 1) {
        base *= (rep < 10 ? 6 : 12); 
    } else {
        base *= Math.pow(stability, weeksSinceRelease);
    }
    
    // Minimum catalog floor based on artist clout (Monthly Listeners)
    const catalogFloor = ml * 0.005;
    base = Math.max(base, catalogFloor);

    if (isAlb) {
        let trackWeight = 1.0;
        if (song.releasedAsSingle) trackWeight = 2.2; else if (tIndex < 3) trackWeight = 1.35; else if (tIndex > 10) trackWeight = Math.pow(0.82, tIndex - 10);
        base *= trackWeight;
    }

    let promoMultiplier = 1;
    if (!isNPC) promotions.filter(p => p.targetId === song.id).forEach(p => promoMultiplier += 1.0 + Math.log10((p.budget / 1000) + 1) * 1.5);
    
    return base * promoMultiplier * getVariance(song.id + currentDate.getTime());
};

const generatePitchforkReview = (quality: number, date: Date, isAlbum: boolean): PitchforkReview => {
    const score = Math.max(0, Math.min(10, (quality / 10) + (Math.random() * 2 - 1)));
    let pool = score >= 8.0 ? PITCHFORK_REVIEWS.high : score <= 4.0 ? PITCHFORK_REVIEWS.low : PITCHFORK_REVIEWS.mid;
    return { score, summary: pool[Math.floor(Math.random() * pool.length)], author: REVIEW_AUTHORS[Math.floor(Math.random() * REVIEW_AUTHORS.length)], date: new Date(date), isBestNewMusic: score >= 8.2 && isAlbum };
};

export const simulateWeek = async (state: GameStateBundle, options: { fast?: boolean } = {}): Promise<{ newState: GameStateBundle; newNotificationsForWeek: Notification[]; weeklySummarySongs: Song[] }> => {
    const { player, songs, albums, merch, promotions, schedule, gameDate, notifications, playlists, npcSongs, npcAlbums, chartsData, gameEvents, tours } = state;
    const diffSettings = difficultySettings[player.difficulty];
    const newDate = toDate(gameDate);
    newDate.setDate(newDate.getDate() + 7);
    const newNotificationsForWeek: Notification[] = [];
    
    let updatedPlayer = { ...player, transactions: player.transactions || [] };
    updatedPlayer.energy = Math.min(100, updatedPlayer.energy + 35);

    const nextPromos = promotions.map(p => ({ ...p, weeksRemaining: p.weeksRemaining - 1 })).filter(p => p.weeksRemaining > 0);
    const { newSongs: npcS, newAlbums: npcA } = handleNPCReleases(npcSongs, npcAlbums, newDate);
    let updatedNpcSongs = [...npcSongs, ...npcS];
    let updatedNpcAlbums = [...npcAlbums, ...npcA];

    // --- PRE-CALCULATION PHASE ---
    // Update performance metrics for ALL songs and albums before they hit the chart ranker.
    
    let songsToProcess = songs.map(s => {
        const sched = s.scheduledReleaseDate ? toDate(s.scheduledReleaseDate) : null;
        if (!s.isReleased && sched && sched <= newDate) return { ...s, isReleased: true, releaseDate: new Date(newDate), weeklyStreams: 0, scheduledReleaseDate: undefined, pitchforkReview: generatePitchforkReview(s.quality, newDate, false) };
        return s;
    });

    let albumsToProcess = albums.map(a => {
        const sched = a.scheduledReleaseDate ? toDate(a.scheduledReleaseDate) : null;
        if (sched && sched <= newDate) {
            const albumQual = a.songs.length > 0 ? a.songs.reduce((acc, s) => acc + s.quality, 0) / a.songs.length : 50;
            const updatedAlbum = { ...a, releaseDate: new Date(newDate), scheduledReleaseDate: undefined, pitchforkReview: generatePitchforkReview(albumQual, newDate, true), unitSales: 0 };
            songsToProcess = songsToProcess.map(s => s.albumId === a.id ? { ...s, isReleased: true, releaseDate: s.releasedAsSingle ? s.releaseDate : new Date(newDate), scheduledReleaseDate: undefined } : s);
            return updatedAlbum;
        }
        return a;
    });

    // Update Player Song Performance
    songsToProcess = songsToProcess.map(s => {
        const album = s.albumId ? albumsToProcess.find(a => a.id === s.albumId) : null;
        const tIdx = album ? album.songs.findIndex(as => as.id === s.id) : 0;
        const raw = calculateRawPerformance(s, updatedPlayer.monthlyListeners, updatedPlayer.reputation, false, promotions, newDate, tIdx, !!s.albumId) * diffSettings.stream;
        return { ...s, rawPerformance: raw, weeklyStreams: Math.floor(raw), weeklySales: Math.floor(raw / 2500) };
    });

    // Update NPC Song Performance (Simulate a range of performance for NPCs)
    updatedNpcSongs = updatedNpcSongs.map(s => {
        const fameArtist = NPC_ARTISTS.find(a => a.name === s.artistName);
        const fame = fameArtist ? FAME_STATS[fameArtist.fameTier as keyof typeof FAME_STATS].power : 10;
        const weeks = Math.max(0, Math.floor((newDate.getTime() - toDate(s.releaseDate).getTime()) / (7 * 24 * 60 * 60 * 1000)));
        
        // Dynamic NPC decay based on quality tier
        const npcStability = s.quality > 85 ? 0.985 : (s.quality > 70 ? 0.96 : 0.93);
        const decay = Math.pow(npcStability, weeks);
        
        const raw = (s.rawPerformance || 0) * decay * getVariance(s.id + newDate.getTime());
        return { ...s, weeklyStreams: Math.floor(raw), weeklySales: Math.floor(raw / 2500) };
    });

    // Update Player Album Performance
    albumsToProcess = albumsToProcess.map(a => {
        const albumSongs = songsToProcess.filter(s => s.albumId === a.id);
        const streams = albumSongs.reduce((acc, s) => acc + (s.weeklyStreams || 0), 0);
        const streamUnits = Math.floor(streams / 1500);
        const teaUnits = Math.floor(albumSongs.reduce((acc, s) => acc + (s.weeklySales || 0), 0) / 10);
        // Base pure sales on reputation and position potential
        const pureSales = Math.floor((updatedPlayer.reputation * 50) + (streamUnits * 0.1)); 
        return { ...a, weeklyUnitSales: streamUnits + teaUnits + pureSales, weeklyPureSales: pureSales };
    });

    // Update NPC Album Performance
    updatedNpcAlbums = updatedNpcAlbums.map(a => {
        const weeks = Math.max(0, Math.floor((newDate.getTime() - toDate(a.releaseDate).getTime()) / (7 * 24 * 60 * 60 * 1000)));
        // Album decay softening (was 0.88, now 0.95) to make projects stay on chart for many months
        const decay = Math.pow(0.95, weeks);
        const units = Math.floor(((a.rawPerformance || 0) / 1500) * decay * getVariance(a.id + newDate.getTime()));
        return { ...a, weeklyUnitSales: units, weeklyPureSales: Math.floor(units * 0.15) };
    });

    const rankChart = (items: any[], chartId: ChartId, limit: number, itemType: 'song' | 'album', excludeIds: Set<string> = new Set()): ChartEntry[] => {
        const previousPositions = new Map<string, number>();
        items.forEach(i => { if (i.charts?.[chartId]) previousPositions.set(i.id, i.charts[chartId].position); });

        const sorted = [...items]
            .filter(i => {
                if (excludeIds.has(i.id)) return false;
                if (chartId === 'bubblingUnderHot50' && i.chartHistory?.hot100) return false;
                const released = itemType === 'album' ? (i.releaseDate && toDate(i.releaseDate) <= newDate) : i.isReleased;
                if (!released) return false;
                
                const weeks = i.charts?.[chartId]?.weeksOnChart || 0;
                const units = itemType === 'song' ? (i.weeklyStreams / 1500) + i.weeklySales : i.weeklyUnitSales;

                if (itemType === 'song') {
                    // softer chart exit rules to allow high quality tracks to linger longer in the lower ranks
                    if (weeks > 20 && units < 1200) return false; 
                    if (weeks > 52 && units < 3500) return false; 
                } else {
                    if (weeks > 52 && units < 800) return false; 
                    if (units < 250) return false; 
                }
                return true;
            })
            // STRICT SORTING BY CALCULATED UNITS
            .sort((a, b) => {
                const aUnits = itemType === 'song' ? (a.weeklyStreams / 1500) + a.weeklySales : a.weeklyUnitSales;
                const bUnits = itemType === 'song' ? (b.weeklyStreams / 1500) + b.weeklySales : b.weeklyUnitSales;
                return bUnits - aUnits;
            });
            
        const topItems = sorted.slice(0, limit);
        topItems.forEach((item, i) => {
            const pos = i + 1;
            if (!item.charts) item.charts = {};
            const prevPos = previousPositions.get(item.id) || null;
            const weeksOnChart = (item.charts[chartId]?.weeksOnChart || 0) + 1;
            const peakPosition = (item.charts[chartId]?.peakPosition && item.charts[chartId].peakPosition < pos) ? item.charts[chartId].peakPosition : pos;

            if (!item.chartHistory) item.chartHistory = {};
            if (!item.chartHistory[chartId] || pos < item.chartHistory[chartId].peakPosition) {
                item.chartHistory[chartId] = { peakPosition: pos, peakDate: new Date(newDate), weeksOnChart };
            } else {
                item.chartHistory[chartId].weeksOnChart = weeksOnChart;
            }

            item.charts[chartId] = { position: pos, lastWeekPosition: prevPos, peakPosition, weeksOnChart };
        });

        // Fallback for items that fell off
        const topIds = new Set(topItems.map(ti => ti.id));
        items.forEach(i => { if (!topIds.has(i.id) && i.charts) i.charts[chartId] = null; });

        return topItems.map(s => {
            const chartInfo = s.charts[chartId];
            let status: ChartEntry['status'] = !chartInfo.lastWeekPosition ? 'new' : chartInfo.position < chartInfo.lastWeekPosition ? 'up' : chartInfo.position > chartInfo.lastWeekPosition ? 'down' : 'same';
            if (status === 'new' && s.chartHistory?.[chartId] && s.chartHistory[chartId].weeksOnChart > 1) status = 're-entry';
            return { position: chartInfo.position, lastWeekPosition: chartInfo.lastWeekPosition, peakPosition: chartInfo.peakPosition, weeksOnChart: chartInfo.weeksOnChart, title: s.title, artist: s.artistName, coverArt: s.coverArt, itemId: s.id, itemType, status, chartId };
        });
    };

    // --- CHARTING PHASE ---
    const rankedH100 = rankChart([...songsToProcess, ...updatedNpcSongs], 'hot100', 100, 'song');
    const h100Ids = new Set(rankedH100.map(e => e.itemId));
    const rankedBubbling = rankChart([...songsToProcess, ...updatedNpcSongs], 'bubblingUnderHot50', 50, 'song', h100Ids);
    const rankedB200 = rankChart([...albumsToProcess, ...updatedNpcAlbums], 'billboard200', 200, 'album');

    const newChartsData: ChartData = {
        hot100: rankedH100,
        bubblingUnderHot50: rankedBubbling,
        billboard200: rankedB200,
        global200: [], hotRnbHipHopSongs: [], hotRnbSongs: [], hotRapSongs: [], rnbHipHopAirplay: [],
        topRnbHipHopAlbums: [], rnbAlbums: [], rapAlbums: [], rapTunesTopSongs: [], rapTunesTopAlbums: [], departed: []
    };

    // --- DEPARTURES & WRAP-UP ---
    const departedInfo: DepartureInfo[] = [];
    const findDepartures = (prevChart: ChartEntry[], currentChart: ChartEntry[], chartName: string, itemsPool: any[]) => {
        if (!prevChart) return;
        prevChart.forEach(prev => {
            if (prev.artist !== player.artistName) return;
            if (!currentChart.some(curr => curr.itemId === prev.itemId)) {
                const item = itemsPool.find(i => i.id === prev.itemId);
                if (item && item.chartHistory?.[prev.chartId || 'hot100']) {
                    const history = item.chartHistory[prev.chartId || 'hot100'];
                    departedInfo.push({ title: item.title, artist: item.artistName, chartName: chartName, peakPosition: history.peakPosition, weeksOnChart: history.weeksOnChart, itemId: item.id, coverArt: item.coverArt });
                }
            }
        });
    };

    findDepartures(chartsData.hot100, rankedH100, 'Billboard Hot 100', [...songsToProcess, ...updatedNpcSongs]);
    findDepartures(chartsData.bubblingUnderHot50, rankedBubbling, 'Bubbling Under Hot 50', [...songsToProcess, ...updatedNpcSongs]);
    findDepartures(chartsData.billboard200, rankedB200, 'Billboard 200', [...albumsToProcess, ...updatedNpcAlbums]);

    songsToProcess.forEach(s => {
        if (!s.isReleased) return;
        const rapifyShare = Math.floor(s.weeklyStreams * 0.6);
        s.rapifyStreams += rapifyShare;
        s.rappleStreams += Math.floor(s.weeklyStreams * 0.4);
        s.sales += s.weeklySales;

        // UPDATED YOUTUBE LOGIC
        // Audio: 20-45% of Rapify Streams
        const audioRatio = 0.20 + (Math.random() * 0.25);
        const audioViews = Math.floor(rapifyShare * audioRatio);
        s.youtubeAudioViews = (s.youtubeAudioViews || 0) + audioViews;

        // Music Video: 60-150% of Rapify Streams based on Quality
        if (s.hasMusicVideo) {
            const videoBase = 0.6 + (s.videoQuality / 100) * 0.9;
            const videoViews = Math.floor(rapifyShare * videoBase * (0.8 + Math.random() * 0.4));
            s.youtubeVideoViews = (s.youtubeVideoViews || 0) + videoViews;
        }
    });

    albumsToProcess.forEach(a => {
        if (a.releaseDate && toDate(a.releaseDate) <= newDate) {
            a.unitSales += a.weeklyUnitSales; 
            a.pureSales += (a.weeklyPureSales || 0); 
        }
    });

    const playerOnChart = rankedH100.some(e => e.artist === player.artistName) || rankedB200.some(e => e.artist === player.artistName);
    updatedPlayer.chartStreak = playerOnChart ? (updatedPlayer.chartStreak || 0) + 1 : 0;
    updatedPlayer.bestChartStreak = Math.max(updatedPlayer.bestChartStreak || 0, updatedPlayer.chartStreak);

    const { updatedSongs, updatedAlbums, newNotifications: certNotifications } = updateCertifications({
        ...state, player: updatedPlayer, songs: songsToProcess, albums: albumsToProcess, gameDate: new Date(newDate)
    });
    
    songsToProcess = updatedSongs;
    albumsToProcess = updatedAlbums;
    newNotificationsForWeek.push(...certNotifications);

    const streamingRoyalties = songsToProcess.reduce((acc, s) => acc + (s.weeklyStreams * 0.0038), 0);
    const newWeeklyTweets = generateWeeklyTweets(updatedPlayer, songsToProcess, albumsToProcess, newChartsData, chartsData, newDate, departedInfo);

    updatedPlayer = { 
        ...updatedPlayer, money: updatedPlayer.money + streamingRoyalties,
        monthlyListeners: Math.max(50, Math.floor((updatedPlayer.monthlyListeners * (1 - diffSettings.hypeDecay)) + (songsToProcess.reduce((acc,s)=>acc+s.weeklyStreams, 0) * diffSettings.mlRatio))),
        socialPosts: [...newWeeklyTweets, ...(updatedPlayer.socialPosts || [])] 
    };

    const newState: GameStateBundle = { ...state, player: updatedPlayer, songs: songsToProcess, albums: albumsToProcess, promotions: nextPromos, gameDate: new Date(newDate), npcSongs: updatedNpcSongs, npcAlbums: updatedNpcAlbums, chartsData: newChartsData };
    return { newState, newNotificationsForWeek, weeklySummarySongs: songsToProcess.filter(s => s.isReleased).sort((a,b) => b.weeklyStreams - a.weeklyStreams).slice(0, 5) };
};
