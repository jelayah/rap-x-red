
import type { Player, Song, Album, Tour, Tweet, ChartData, ChartId, ChartEntry, SocialPost } from '../types';
import { CHART_NAMES } from '../constants';

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
    gameDate: Date
): SocialPost[] {
    const newPosts: SocialPost[] = [];
    const normalizedGameTime = new Date(gameDate).getTime();
    const chartDataAvatar = "https://thumbs2.imgbox.com/1a/e3/qAAxiSCB_t.jpg";

    const handledIds = new Set<string>();

    Object.entries(currentCharts).forEach(([id, entries]) => {
        const chartId = id as ChartId;
        const chartName = CHART_NAMES[chartId];
        if (chartId.includes('rapTunes') || chartId === 'departed') return;

        entries.forEach(entry => {
            if (entry.artist !== player.artistName) return;
            handledIds.add(entry.itemId);

            const prevEntry = previousCharts[chartId]?.find(p => p.itemId === entry.itemId);
            let caption = '';

            if (!prevEntry) {
                const item = songs.find(s => s.id === entry.itemId) || albums.find(a => a.id === entry.itemId);
                const releaseDate = item ? new Date(item.releaseDate!) : new Date();
                const diffWeeks = Math.floor((new Date(normalizedGameTime).getTime() - releaseDate.getTime()) / (7 * 24 * 60 * 60 * 1000));

                if (diffWeeks > 1) {
                    caption = `‘${entry.title}’ by ${player.artistName} Debuts on ${chartName} at #${entry.position}, this is the first appearance of ‘${entry.title}’ despite it being released ${diffWeeks} weeks ago [${releaseDate.toLocaleDateString()}].`;
                } else {
                    caption = `‘${entry.title}’ by ${player.artistName} debuts at #${entry.position} on the ${chartName}.`;
                }
            } else if (entry.position < prevEntry.peakPosition) {
                caption = `‘${entry.title}’ by ${player.artistName} hits a new peak of #${entry.position} on the ${chartName}.`;
            }

            if (caption) {
                newPosts.push({
                    id: `cd_post_${entry.itemId}_${chartId}_${normalizedGameTime}`,
                    platform: 'X', caption, image: entry.coverArt || '', date: new Date(normalizedGameTime),
                    likes: Math.floor(player.monthlyListeners * 0.05 + 1000), comments: Math.floor(player.monthlyListeners * 0.005 + 50),
                    authorOverride: 'ChartData', type: 'System'
                });
            }
        });
    });

    // Check for "Fails to Debut"
    songs.filter(s => s.isReleased).forEach(s => {
        const releaseDate = new Date(s.releaseDate);
        const isNewRelease = Math.abs(new Date(normalizedGameTime).getTime() - releaseDate.getTime()) < (7 * 24 * 60 * 60 * 1000);
        if (isNewRelease && !handledIds.has(s.id)) {
            newPosts.push({
                id: `cd_fail_${s.id}_${normalizedGameTime}`,
                platform: 'X',
                caption: `‘${s.title}’ by ${player.artistName} fails to debut on any chart this week.`,
                image: s.coverArt || '',
                date: new Date(normalizedGameTime),
                likes: Math.floor(player.monthlyListeners * 0.01),
                comments: 100,
                authorOverride: 'ChartData',
                type: 'System'
            });
        }
    });

    return newPosts;
}

export function generateXFeed(player: Player, songs: Song[], albums: Album[], tours: Tour[], chartsData: ChartData, gameDateInput: Date): Tweet[] {
    const tweets: Tweet[] = [];
    const authors = {
        PopBase: { name: 'Pop Base', handle: 'PopBase', avatarSeed: "https://thumbs2.imgbox.com/74/4c/6FGTX1JI_t.jpg", isVerified: true, type: 'Media' as const },
        ChartData: { name: 'chart data', handle: 'chartdata', avatarSeed: "https://thumbs2.imgbox.com/1a/e3/qAAxiSCB_t.jpg", isVerified: true, type: 'Chart' as const },
    };

    if (player.socialPosts) {
        player.socialPosts.forEach(post => {
            if (post.platform !== 'X') return;
            const authorKey = (post as any).authorOverride as keyof typeof authors;
            const author = authors[authorKey] || { name: player.artistName, handle: player.artistName.replace(/\s/g, '').toLowerCase(), avatarSeed: player.aboutImage || 'portrait', isVerified: true, type: 'Fan' };
            tweets.push({ id: `tweet_${post.id}`, author, content: post.caption, media: post.image, timestamp: new Date(post.date), views: Math.floor(post.likes * 50), comments: post.comments, retweets: Math.floor(post.likes * 0.15), likes: post.likes, bookmarks: Math.floor(post.likes * 0.05), quotedTweet: post.quotedTweet });
        });
    }
    return tweets.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}
