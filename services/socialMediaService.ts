
import type { Player, Song, Album, Tour, Tweet, ChartData, ChartId, ChartEntry } from '../types';
import { CHART_NAMES } from '../constants';

const IMAGES = {
    CHART_DATA: "https://thumbs2.imgbox.com/1a/e3/qAAxiSCB_t.jpg",
    POP_BASE: "https://thumbs2.imgbox.com/74/4c/6FGTX1JI_t.jpg", 
    SNAPSHOT_RAPIFY: "https://thumbs2.imgbox.com/44/79/9v4X33u3_t.jpg",
};

const toDate = (d: any) => (d instanceof Date ? d : new Date(d));

export interface DepartureInfo {
    title: string;
    artist: string;
    chartName: string;
    peakPosition: number;
    weeksOnChart: number;
    itemId: string;
    coverArt: string | null;
}

const formatCompact = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
};

export function generateWeeklyTweets(
    player: Player, 
    songs: Song[], 
    albums: Album[], 
    currentCharts: ChartData, 
    previousCharts: ChartData,
    gameDate: Date,
    departures: DepartureInfo[] = []
): any[] {
    const newPosts: any[] = [];
    const normalizedGameDate = toDate(gameDate);
    const normalizedGameTime = normalizedGameDate.getTime();

    // 1. CHART DATA: DEBUTS, RE-ENTRIES AND MOVEMENTS
    Object.entries(currentCharts).forEach(([id, entries]) => {
        const chartId = id as ChartId;
        const chartName = CHART_NAMES[chartId];
        if (chartId.includes('rapTunes') || chartId === 'departed') return;

        entries.forEach(entry => {
            // ONLY process the player's items
            if (entry.artist !== player.artistName) return;

            const prevEntry = previousCharts[chartId]?.find(p => p.itemId === entry.itemId);
            let caption = '';

            if (entry.status === 'new') {
                // DEBUT
                let units = 0;
                if (entry.itemType === 'song') {
                    const song = songs.find(s => s.id === entry.itemId);
                    if (song) {
                        units = Math.floor((song.weeklyStreams / 1500) + song.weeklySales);
                    }
                } else {
                    const album = albums.find(a => a.id === entry.itemId);
                    if (album) units = album.weeklyUnitSales;
                }
                caption = `‘${entry.title}’ by ${player.artistName} debuts at #${entry.position} on the ${chartName} with ${formatCompact(units)} units.`;
            } else if (entry.status === 're-entry') {
                // RE-ENTRY (requested: "'release' by 'artist' Re-enter's the x chart at spot x with x amount of units")
                let units = 0;
                if (entry.itemType === 'song') {
                    const song = songs.find(s => s.id === entry.itemId);
                    if (song) {
                        units = Math.floor((song.weeklyStreams / 1500) + song.weeklySales);
                    }
                } else {
                    const album = albums.find(a => a.id === entry.itemId);
                    if (album) units = album.weeklyUnitSales;
                }
                caption = `‘${entry.title}’ by ${player.artistName} Re-enter's the ${chartName} at spot ${entry.position} with ${formatCompact(units)} amount of units.`;
            } else if (entry.position < (prevEntry?.position || 999)) {
                // RISE
                const delta = (prevEntry?.position || 999) - entry.position;
                if (delta < 500) { 
                    caption = `‘${entry.title}’ by ${player.artistName} rises ${delta} spots to #${entry.position} on the ${chartName}.`;
                }
            } else if (entry.position > (prevEntry?.position || 0)) {
                // DROP
                const delta = entry.position - (prevEntry?.position || 0);
                if (prevEntry) {
                    caption = `‘${entry.title}’ by ${player.artistName} drops ${delta} spots to #${entry.position} on the ${chartName}.`;
                }
            }

            if (caption) {
                newPosts.push({
                    id: `cd_post_${entry.itemId}_${chartId}_${normalizedGameTime}`,
                    platform: 'X',
                    caption,
                    image: entry.coverArt || '',
                    date: new Date(normalizedGameTime),
                    likes: Math.floor(player.monthlyListeners * 0.05 + 1000),
                    comments: 200,
                    authorOverride: 'ChartData'
                });
            }
        });
    });

    // 2. CHART DATA: DEPARTURES
    departures.forEach(dep => {
        const caption = `‘${dep.title}’ by ${dep.artist} departs the ${dep.chartName} today, ‘${dep.title}’ peaked at #${dep.peakPosition} and charted for ${dep.weeksOnChart} week(s).`;
        
        newPosts.push({
            id: `cd_depart_${dep.itemId}_${dep.chartName}_${normalizedGameTime}`,
            platform: 'X',
            caption,
            image: dep.coverArt || '',
            date: new Date(normalizedGameTime),
            likes: Math.floor(player.monthlyListeners * 0.03 + 500),
            comments: 150,
            authorOverride: 'ChartData'
        });
    });

    // 3. POP BASE: PRE-ANNOUNCEMENT SCANNER (Limited to 1 per week)
    const playerItems = [...songs.filter(s => s.artistName === player.artistName), ...albums.filter(a => a.artistName === player.artistName)];
    for (const item of playerItems) {
        if (item.scheduledReleaseDate) {
            const sched = toDate(item.scheduledReleaseDate);
            const timeDiff = sched.getTime() - normalizedGameTime;
            const sevenDays = 7 * 24 * 60 * 60 * 1000;
            
            if (Math.abs(timeDiff - sevenDays) < (24 * 60 * 60 * 1000)) {
                newPosts.push({
                    id: `pb_anno_${item.id}_${normalizedGameTime}`,
                    platform: 'X',
                    caption: `Pop Base: ‘${item.title}’ by ${player.artistName} is said to be released on Friday ${sched.toLocaleDateString()}.`,
                    image: item.coverArt || '',
                    date: new Date(normalizedGameTime),
                    likes: Math.floor(player.monthlyListeners * 0.04 + 1500),
                    comments: 350,
                    authorOverride: 'PopBase'
                });
                break; // Just one teaser per week
            }
        }
    }

    return newPosts;
}

export function generateXFeed(player: Player, songs: Song[], albums: Album[], tours: Tour[], chartsData: ChartData, gameDateInput: Date): Tweet[] {
    const tweets: Tweet[] = [];
    const authors = {
        PopBase: { name: 'Pop Base', handle: 'PopBase', avatarSeed: IMAGES.POP_BASE, isVerified: true, type: 'Media' as const },
        ChartData: { name: 'chart data', handle: 'chartdata', avatarSeed: IMAGES.CHART_DATA, isVerified: true, type: 'Chart' as const },
        SnapshotRapify: { name: 'Rapify Snapshots', handle: 'SnapshotRapify', avatarSeed: IMAGES.SNAPSHOT_RAPIFY, isVerified: true, type: 'Media' as const }
    };

    if (player.socialPosts) {
        player.socialPosts.forEach(post => {
            if (post.platform !== 'X') return;

            const authorKey = (post as any).authorOverride as keyof typeof authors;
            const author = authors[authorKey] || { 
                name: player.artistName, 
                handle: player.artistName.replace(/\s/g, '').toLowerCase(), 
                avatarSeed: player.aboutImage || 'portrait', 
                isVerified: true, 
                type: 'Fan' 
            };

            tweets.push({
                id: `tweet_${post.id}`,
                author,
                content: post.caption,
                media: post.image,
                timestamp: toDate(post.date),
                views: Math.floor(post.likes * (30 + Math.random() * 40)),
                comments: post.comments,
                retweets: Math.floor(post.likes * 0.15),
                likes: post.likes,
                bookmarks: Math.floor(post.likes * 0.05),
                quotedTweet: post.quotedTweet,
                statsData: (post as any).platformSpecificData ? {
                    items: (post as any).platformSpecificData.items,
                    title: (post as any).platformSpecificData.title,
                    artistName: player.artistName,
                    coverArt: (post as any).platformSpecificData.coverArt
                } : undefined
            });
        });
    }

    return tweets.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}
