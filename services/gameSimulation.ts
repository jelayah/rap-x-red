
import { Difficulty, Experience } from '../types';
import type { GameStateBundle, Song, Album, ChartData, ChartEntry, Notification, ChartId, Promotion, PitchforkReview } from '../types';
import { REVIEW_AUTHORS, PITCHFORK_REVIEWS, difficultySettings } from '../constants';
import { generateWeeklyTweets } from './socialMediaService';
import { NPC_ARTISTS } from '../data/artists';
import { updateCertifications } from './recordService';

const toDate = (d: any) => (d instanceof Date ? d : new Date(d));

const calculateSinglePoints = (sales: number, streams: number): number => {
    return (sales * 10) + (streams / 1000);
};

const calculateAlbumUnits = (sales: number, streams: number): number => {
    return sales + (streams / 1500);
};

const getVariance = (seed: string) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = ((hash << 5) - hash) + seed.charCodeAt(i);
        hash |= 0;
    }
    return (Math.abs(hash % 1000) / 1000) * 0.2 + 0.9; 
};

const generatePitchforkReview = (item: Song | Album): PitchforkReview => {
    const itemQuality = 'quality' in item ? item.quality : 75;
    const score = Math.max(1, Math.min(10, (itemQuality / 10) + (Math.random() * 2.0 - 1.0)));
    const author = REVIEW_AUTHORS[Math.floor(Math.random() * REVIEW_AUTHORS.length)];
    let summary = score < 4.0 ? PITCHFORK_REVIEWS.low[0] : score < 7.5 ? PITCHFORK_REVIEWS.mid[0] : PITCHFORK_REVIEWS.high[0];
    return { score: parseFloat(score.toFixed(1)), summary, author, date: new Date(), isBestNewMusic: score >= 8.5 && Math.random() > 0.7 };
};

export const simulateWeek = async (
    state: GameStateBundle, 
    options: { fast?: boolean } = {}
): Promise<{ newState: GameStateBundle; newNotificationsForWeek: Notification[]; weeklySummarySongs: Song[] }> => {
    const { player, songs, albums, promotions, gameDate, npcSongs, npcAlbums, chartsData } = state;
    const newDate = toDate(gameDate);
    newDate.setDate(newDate.getDate() + 7);
    
    const newNotifications: Notification[] = [];
    const prevCharts = chartsData;

    // 1. Decaying Promotions
    const activePromos = promotions.map(p => ({ ...p, weeksRemaining: p.weeksRemaining - 1 })).filter(p => p.weeksRemaining > 0);

    // 2. Generate NPC Influx (15 Singles split between charts, 12 Albums)
    const newNpcs: Song[] = [];
    const newNpcAlbums: Album[] = [];

    // Generate 15 New Singles
    for(let i=0; i<15; i++) {
        const artist = NPC_ARTISTS[Math.floor(Math.random() * NPC_ARTISTS.length)];
        // First 8 target Hot 100 (high performance), next 7 target Bubbling Under (mid performance)
        const isHot100Tier = i < 8;
        const raw = isHot100Tier 
            ? 3500000 + Math.random() * 45000000  // Hot 100 range: 3.5M - 48.5M
            : 500000 + Math.random() * 2500000;   // Bubbling range: 500K - 3M

        newNpcs.push({
            id: `npc_s_${newDate.getTime()}_${i}`, title: `NPC Single ${i + 1}`, artistName: artist.name, genre: 'Rap', mood: 'Hype', topic: 'Success', quality: 85,
            rapifyStreams: 0, rappleStreams: 0, rapTunesStreams: 0, sales: 0, weeklyStreams: 0, weeklySales: 0, rawPerformance: raw,
            releaseDate: new Date(newDate), duration: 180, coverArt: "https://thumbs2.imgbox.com/53/9d/TPyXhrMO_t.jpg", isReleased: true, version: 'Explicit', price: 1.29,
            charts: {}, chartHistory: {}, certifications: [], features: [], producers: [], writers: [], studio: '', copyright: '',
            shazams: 0, radioSpins: 0, weeklyRadioAudience: 0, weeklyRadioSpins: 0, submittedToRadio: true, payolaBudget: 0, regionalStreams: {},
            isLossless: false, isDolbyAtmos: false, dissTrack: null, youtubeAudioViews: 0, youtubeVideoViews: 0, hasMusicVideo: false, videoQuality: 0, youtubeViewHistory: []
        });
    }

    // Generate 12 New Albums
    for(let i=0; i<12; i++) {
        const artist = NPC_ARTISTS[Math.floor(Math.random() * NPC_ARTISTS.length)];
        const units = 45000 + Math.random() * 100000;
        newNpcAlbums.push({
            id: `npc_a_${newDate.getTime()}_${i}`, title: `NPC Project ${i + 1}`, artistName: artist.name, type: 'Album', songs: [],
            unitSales: 0, pureSales: units * 0.2, streamEquivalents: units * 0.8, weeklyUnitSales: units, debutWeekSales: units,
            releaseDate: new Date(newDate), coverArt: "https://thumbs2.imgbox.com/53/9d/TPyXhrMO_t.jpg", price: 9.99, chartHistory: {}, certifications: [], copyright: ''
        });
    }

    // 3. Update Player Albums & Release Sync
    const releasedAlbumIdsThisWeek = new Set<string>();
    const updatedPlayerAlbums = albums.map(a => {
        const isNewRelease = !a.releaseDate && a.scheduledReleaseDate && toDate(a.scheduledReleaseDate) <= newDate;
        let album = { ...a };
        if (isNewRelease) {
            album.releaseDate = new Date(newDate);
            album.pitchforkReview = generatePitchforkReview(album);
            releasedAlbumIdsThisWeek.add(album.id);
        }
        return album;
    });

    // 4. Update Player Songs
    const albumMap = new Map<string, Song[]>();
    songs.forEach(s => {
        if (s.albumId) {
            const list = albumMap.get(s.albumId) || [];
            list.push(s);
            albumMap.set(s.albumId, list);
        }
    });

    let ytSubsGained = 0;
    const updatedPlayerSongs = songs.map(s => {
        const albumReleasedForThisSong = s.albumId && releasedAlbumIdsThisWeek.has(s.albumId);
        const isNewRelease = (!s.isReleased && s.scheduledReleaseDate && toDate(s.scheduledReleaseDate) <= newDate) || albumReleasedForThisSong;
        
        let song = { ...s };
        if (isNewRelease) {
            song.isReleased = true;
            song.releaseDate = new Date(newDate);
            song.pitchforkReview = song.pitchforkReview || generatePitchforkReview(song);
        }
        
        if (!song.isReleased) return { ...song, weeklyStreams: 0, weeklySales: 0 };

        const weeksSince = Math.max(0, Math.floor((newDate.getTime() - toDate(song.releaseDate).getTime()) / (7 * 24 * 60 * 60 * 1000)));
        let decayFactor = 0.88; 
        if (player.experience === Experience.AList) {
            decayFactor = player.difficulty === Difficulty.Hard ? 0.90 : 0.96;
        }
        const decay = Math.pow(decayFactor + (song.quality / 1000), weeksSince);
        
        const promoBoost = activePromos.filter(p => p.targetId === song.id).length * 1.5;
        const difficultyMult = player.difficulty === Difficulty.Easy ? 1.4 : player.difficulty === Difficulty.Realistic ? 1.0 : 0.55;
        
        let legacyPower = (player.monthlyListeners * 0.35) + (player.reputation * 120000);
        let streamPotential = legacyPower * decay * (1 + promoBoost) * difficultyMult * getVariance(song.id + newDate.getTime());

        if (song.albumId && !song.releasedAsSingle) {
            const albumSongs = albumMap.get(song.albumId) || [];
            const trackIndex = albumSongs.findIndex(as => as.id === song.id);
            let weight = 1.0;
            if (trackIndex >= 0 && trackIndex < 3) weight = 0.85;
            else if (trackIndex >= 3 && trackIndex < 7) weight = 0.55;
            else weight = 0.35;
            streamPotential *= (weight * (0.85 + Math.random() * 0.3));
        }

        const streams = Math.floor(streamPotential);
        const sales = Math.floor(streams / (1600 + Math.random() * 500)); 
        
        const viralBonus = (song.quality > 85 ? 0.4 : 0);
        const audioViews = Math.floor(streams * (0.3 + Math.random() * (0.8 + viralBonus)));
        const videoViews = song.hasMusicVideo ? Math.floor(streams * 1.2 * (song.videoQuality / 100)) : 0;
        
        ytSubsGained += (audioViews + videoViews) * 0.004;

        return { 
            ...song, 
            weeklyStreams: streams, 
            weeklySales: sales,
            rapifyStreams: song.rapifyStreams + Math.floor(streams * 0.6),
            rappleStreams: song.rappleStreams + Math.floor(streams * 0.4),
            youtubeAudioViews: (song.youtubeAudioViews || 0) + audioViews,
            youtubeVideoViews: (song.youtubeVideoViews || 0) + videoViews,
            lastWeeklyStreams: song.weeklyStreams
        };
    });

    // 5. NPC Performance
    const combinedNpcSongs = [...npcSongs, ...newNpcs].map(s => {
        const weeks = Math.max(0, Math.floor((newDate.getTime() - toDate(s.releaseDate).getTime()) / (7 * 24 * 60 * 60 * 1000)));
        const decay = Math.pow(0.89, weeks);
        const streams = Math.floor(Math.min(65000000, (s.rawPerformance || 5000000) * decay * getVariance(s.id + newDate.getTime())));
        return { ...s, weeklyStreams: streams, weeklySales: Math.floor(streams/1800), lastWeeklyStreams: s.weeklyStreams };
    }).filter(s => s.weeklyStreams > 1000); // Filter out dead tracks to keep performance smooth

    const finalizedPlayerAlbums = updatedPlayerAlbums.map(a => {
        const albumSongs = updatedPlayerSongs.filter(s => s.albumId === a.id);
        const weeklyStreams = albumSongs.reduce((acc, s) => acc + s.weeklyStreams, 0);
        const pureSalesPotential = albumSongs.reduce((acc, s) => acc + Math.floor(s.weeklySales * 0.12), 0);
        const weeksSince = a.releaseDate ? Math.max(0, Math.floor((newDate.getTime() - toDate(a.releaseDate).getTime()) / (7 * 24 * 60 * 60 * 1000))) : 0;
        const stabilizedUnits = calculateAlbumUnits(pureSalesPotential, weeklyStreams) * Math.pow(0.98, weeksSince);
        if (releasedAlbumIdsThisWeek.has(a.id)) a.debutWeekSales = stabilizedUnits;
        return { ...a, weeklyUnitSales: stabilizedUnits, unitSales: a.unitSales + stabilizedUnits };
    });

    const combinedNpcAlbums = [...npcAlbums, ...newNpcAlbums].map(a => {
        const weeks = Math.max(0, Math.floor((newDate.getTime() - toDate(a.releaseDate!).getTime()) / (7 * 24 * 60 * 60 * 1000)));
        const decay = Math.pow(0.97, weeks);
        const units = (a.debutWeekSales || 50000) * decay * getVariance(a.id + newDate.getTime());
        return { ...a, weeklyUnitSales: units, unitSales: a.unitSales + units };
    }).filter(a => a.weeklyUnitSales > 100);

    // 6. Ranking Logic
    const allSongs = [...updatedPlayerSongs, ...combinedNpcSongs].sort((a, b) => calculateSinglePoints(b.weeklySales, b.weeklyStreams) - calculateSinglePoints(a.weeklySales, a.weeklyStreams));
    const hot100: ChartEntry[] = [];
    const bubbling: ChartEntry[] = [];

    allSongs.forEach((s, i) => {
        const pos = i + 1;
        const pts = calculateSinglePoints(s.weeklySales, s.weeklyStreams);
        const prevEntry = prevCharts.hot100?.find(p => p.itemId === s.id) || prevCharts.bubblingUnderHot50?.find(p => p.itemId === s.id);
        const weeksOnChart = (prevEntry?.weeksOnChart || 0) + 1;
        const peak = Math.min(prevEntry?.peakPosition || 200, pos);
        s.charts = { ...s.charts, [pos <= 100 ? 'hot100' : 'bubblingUnderHot50']: { position: pos <= 100 ? pos : pos - 100, lastWeekPosition: prevEntry?.position || null, peakPosition: peak, weeksOnChart } };
        s.chartHistory = { ...s.chartHistory, [pos <= 100 ? 'hot100' : 'bubblingUnderHot50']: { peakPosition: peak, peakDate: peak === pos ? new Date(newDate) : (s.chartHistory?.[pos <= 100 ? 'hot100' : 'bubblingUnderHot50']?.peakDate || new Date(newDate)), weeksOnChart } };
        const entry: ChartEntry = { position: pos <= 100 ? pos : pos - 100, lastWeekPosition: prevEntry?.position || null, peakPosition: peak, weeksOnChart, title: s.title, artist: s.artistName, coverArt: s.coverArt, itemId: s.id, itemType: 'song', chartId: pos <= 100 ? 'hot100' : 'bubblingUnderHot50', weeklyUnits: pts, weeklyStreams: s.weeklyStreams, status: !prevEntry ? 'new' : pos < (prevEntry.position || 0) ? 'up' : pos > (prevEntry.position || 0) ? 'down' : 'same' };
        if (pos <= 100) hot100.push(entry); else if (pos <= 150) bubbling.push(entry);
    });

    const billboard200: ChartEntry[] = [...finalizedPlayerAlbums, ...combinedNpcAlbums].sort((a, b) => b.weeklyUnitSales - a.weeklyUnitSales).slice(0, 200).map((a, i) => {
        const pos = i + 1;
        const prevEntry = prevCharts.billboard200?.find(p => p.itemId === a.id);
        const weeksOnChart = (prevEntry?.weeksOnChart || 0) + 1;
        const peak = Math.min(prevEntry?.peakPosition || 201, pos);
        a.charts = { ...a.charts, billboard200: { position: pos, lastWeekPosition: prevEntry?.position || null, peakPosition: peak, weeksOnChart } };
        a.chartHistory = { ...a.chartHistory, billboard200: { peakPosition: peak, peakDate: peak === pos ? new Date(newDate) : (a.chartHistory?.billboard200?.peakDate || new Date(newDate)), weeksOnChart } };
        return { position: pos, lastWeekPosition: prevEntry?.position || null, peakPosition: peak, weeksOnChart, title: a.title, artist: a.artistName, coverArt: a.coverArt, itemId: a.id, itemType: 'album', chartId: 'billboard200', weeklyUnits: a.weeklyUnitSales, status: !prevEntry ? 'new' : pos < (prevEntry.position || 0) ? 'up' : pos > (prevEntry.position || 0) ? 'down' : 'same' };
    });

    // 7. Job Processing
    let currentJob = player.currentJob ? { ...player.currentJob } : null;
    let jobIncome = 0;
    let jobEnergyCost = 0;
    if (currentJob) {
        currentJob.weeksLeft -= 1;
        jobEnergyCost = currentJob.weeklyEnergyCost;
        const weeksWorked = currentJob.totalWeeks - currentJob.weeksLeft;
        if (weeksWorked > 0 && weeksWorked % 2 === 0) {
            jobIncome += currentJob.biWeeklyPay;
            newNotifications.push({
                id: `job_pay_${Date.now()}`,
                message: `Paycheck: You received $${currentJob.biWeeklyPay.toLocaleString()} from ${currentJob.employer}.`,
                type: 'Sales',
                date: new Date(newDate)
            });
        }
        if (currentJob.weeksLeft <= 0) {
            newNotifications.push({
                id: `job_done_${Date.now()}`,
                message: `Contract Finished: Your tenure at ${currentJob.employer} has concluded successfully.`,
                type: 'Event',
                date: new Date(newDate)
            });
            currentJob = null;
        }
    }

    const { updatedSongs: certSongs, updatedAlbums: certAlbums, newNotifications: certNotifs } = updateCertifications({ ...state, songs: updatedPlayerSongs, albums: finalizedPlayerAlbums, gameDate: new Date(newDate) });
    const totalWeeklyStreams = updatedPlayerSongs.reduce((acc, s) => acc + s.weeklyStreams, 0);

    const newState: GameStateBundle = {
        ...state, gameDate: new Date(newDate), songs: certSongs, albums: certAlbums, npcSongs: combinedNpcSongs, npcAlbums: combinedNpcAlbums, chartsData: { hot100, bubblingUnderHot50: bubbling, billboard200 } as any, promotions: activePromos,
        player: {
            ...player,
            money: player.money + (totalWeeklyStreams * 0.0039) + jobIncome,
            energy: Math.max(0, Math.min(100, player.energy + 45 - jobEnergyCost)),
            currentJob: currentJob,
            subscribers: player.subscribers + Math.floor(ytSubsGained),
            monthlyListeners: Math.max(50, Math.floor((player.monthlyListeners * 0.82) + (totalWeeklyStreams * 0.22))),
            socialPosts: [...generateWeeklyTweets(player, certSongs, certAlbums, { hot100, bubblingUnderHot50: bubbling, billboard200 } as any, prevCharts, newDate), ...(player.socialPosts || [])].slice(0, 200)
        }
    };

    return { newState, newNotificationsForWeek: [...newNotifications, ...certNotifs], weeklySummarySongs: certSongs.filter(s => s.isReleased).slice(0, 5) };
};
