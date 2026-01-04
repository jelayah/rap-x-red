
import React, { useState, useMemo } from 'react';
import type { Player, Song, Album } from '../types';

const formatNumber = (num: number) => {
    if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`;
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toLocaleString();
};

const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const ensureDate = (d: any): Date => {
    if (d instanceof Date) return d;
    if (typeof d === 'string' || typeof d === 'number') return new Date(d);
    return new Date();
};

const timeSince = (date: Date, gameDate: Date) => {
    const postDate = ensureDate(date);
    const nowObj = ensureDate(gameDate);
    const seconds = Math.floor((nowObj.getTime() - postDate.getTime()) / 1000);
    if (seconds <= 0 || seconds < 60) return `just now`;
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)} year${Math.floor(interval) > 1 ? 's' : ''} ago`;
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)} month${Math.floor(interval) > 1 ? 's' : ''} ago`;
    interval = seconds / 604800; 
    if (interval > 1) return `${Math.floor(interval)} week${Math.floor(interval) > 1 ? 's' : ''} ago`;
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)} day${Math.floor(interval) > 1 ? 's' : ''} ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
};

const EngagementButton: React.FC<{ icon: React.ReactNode; label: string; active?: boolean }> = ({ icon, label, active }) => (
    <button className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${active ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'}`}>
        {icon}
        <span className="text-xs font-bold">{label}</span>
    </button>
);

const YouTubeVideoDetailScreen: React.FC<{ song: Song; player: Player; onBack: () => void; gameDate: Date; allUploads: any[]; onSelectRelated: (song: Song) => void; }> = ({ song, player, onBack, gameDate, allUploads, onSelectRelated }) => {
    const isMusicVideo = song.hasMusicVideo;
    const views = isMusicVideo ? (song.youtubeVideoViews || 0) : (song.youtubeAudioViews || 0);
    const likes = Math.floor(views / 25) + (song.quality * 10);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const displayDate = isMusicVideo && song.videoReleaseDate ? song.videoReleaseDate : song.releaseDate;
    const thumbnailSrc = (isMusicVideo && song.youtubeThumbnail) ? song.youtubeThumbnail : song.coverArt;
    const artistPic = player.aboutImage || `https://source.unsplash.com/100x100/?portrait`;
    const relatedVideos = allUploads.filter(u => u.song.id !== song.id).slice(0, 10);

    return (
        <div className="bg-[#0f0f0f] text-white min-h-screen fixed inset-0 z-[70] overflow-y-auto">
            <header className="p-2 flex items-center gap-4 sticky top-0 bg-[#0f0f0f]/90 backdrop-blur-md z-30">
                 <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                 </button>
            </header>
            <main>
                <div className="aspect-video bg-black sticky top-12 z-20 shadow-xl relative group">
                    <img src={thumbnailSrc!} alt={song.title} className="w-full h-full object-cover opacity-80" />
                    {song.vevoWatermark && isMusicVideo && (
                        <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-md px-2 py-0.5 rounded text-[12px] font-black italic tracking-tighter text-white/50 border border-white/5 uppercase">vevo</div>
                    )}
                </div>
                <div className="p-4">
                    <h1 className="text-xl font-bold leading-tight">{song.title} {isMusicVideo ? '(Official Music Video)' : '(Official Audio)'}</h1>
                    <div className="flex items-center gap-2 mt-1 text-xs font-semibold text-gray-400"><span>{formatNumber(views)} views</span><span>•</span><span>{timeSince(displayDate, gameDate)}</span></div>
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                            <img src={artistPic} className="w-10 h-10 rounded-full object-cover border border-white/5 shadow-md" />
                            <div>
                                <div className="flex items-center gap-1"><p className="font-bold text-[15px]">{player.artistName}</p></div>
                                <p className="text-xs text-gray-400 font-medium">{formatNumber(player.subscribers)} subscribers</p>
                            </div>
                        </div>
                        <button className="bg-white text-black font-bold text-sm px-4 py-2 rounded-full hover:bg-gray-200 transition-colors">Subscribe</button>
                    </div>
                </div>
                <div className="border-t border-white/10 mt-2">
                    {relatedVideos.map(({ song: s, type, date }, i) => {
                        const views = type === 'video' ? (s.youtubeVideoViews || 0) : (s.youtubeAudioViews || 0);
                        const thumbnail = (type === 'video' && s.youtubeThumbnail) ? s.youtubeThumbnail : s.coverArt;
                        return (
                            <div key={`${s.id}-${type}`} className="flex gap-3 p-3 hover:bg-white/5 cursor-pointer" onClick={() => onSelectRelated(s)}>
                                <div className="relative w-40 aspect-video rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                                    <img src={thumbnail!} className="w-full h-full object-cover" />
                                    {s.vevoWatermark && type === 'video' && <div className="absolute bottom-1.5 left-1.5 bg-white/10 backdrop-blur-md px-1 py-0.2 rounded text-[7px] font-black text-white/40 border border-white/5 uppercase italic tracking-tighter">vevo</div>}
                                    <span className="absolute bottom-1 right-1 bg-black/80 text-[10px] px-1 py-0.5 rounded font-bold">{formatDuration(s.duration)}</span>
                                </div>
                                <div className="flex-grow min-w-0">
                                    <h3 className="text-sm font-bold leading-tight line-clamp-2">{s.title}</h3>
                                    <p className="text-xs text-gray-400 mt-1">{player.artistName}</p>
                                    <p className="text-xs text-gray-400">{formatNumber(views)} views • {timeSince(date, gameDate)}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </main>
        </div>
    );
};

const YouTubeScreen: React.FC<{ player: Player; songs?: Song[]; albums?: Album[]; setPlayer: any; onBack: () => void; gameDate: Date; }> = ({ player, songs = [], albums = [], setPlayer, onBack, gameDate }) => {
    const [viewingSong, setViewingSong] = useState<Song | null>(null);
    const uploads = useMemo(() => {
        const releasedSongs = songs.filter(s => s.isReleased);
        const allUploads: any[] = [];
        releasedSongs.forEach(song => {
            allUploads.push({ song, type: 'audio', date: song.releaseDate });
            if (song.hasMusicVideo) allUploads.push({ song, type: 'video', date: song.videoReleaseDate || song.releaseDate });
        });
        return allUploads.sort((a, b) => ensureDate(b.date).getTime() - ensureDate(a.date).getTime());
    }, [songs]);

    if (viewingSong) return <YouTubeVideoDetailScreen song={viewingSong} player={player} onBack={() => setViewingSong(null)} gameDate={gameDate} allUploads={uploads} onSelectRelated={(s) => setViewingSong(s)} />;
    
    const profileImage = player.aboutImage || `https://source.unsplash.com/150x150/?portrait`;
    const bannerImage = player.headerImage || `https://source.unsplash.com/1200x300/?abstract,texture`;

    return (
        <div className="bg-[#0f0f0f] text-white min-h-screen fixed inset-0 z-[60] overflow-y-auto">
            <header className="sticky top-0 bg-[#0f0f0f]/95 backdrop-blur-md z-30 flex items-center justify-between p-3 border-b border-white/5">
                <button onClick={onBack} className="p-1 rounded-full hover:bg-white/10 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                </button>
                <div className="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#FF0000] fill-current"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    <span className="font-black text-xl tracking-tighter uppercase italic">YouTube</span>
                </div>
                <div className="w-10"></div>
            </header>

            <main className="pb-32">
                {/* Channel Header Section */}
                <div className="w-full">
                    <div className="h-24 sm:h-40 bg-gray-800 relative overflow-hidden">
                        <img src={bannerImage} className="w-full h-full object-cover opacity-50" alt="Channel Banner" />
                    </div>
                    <div className="px-4 py-6 flex flex-col items-center sm:flex-row sm:items-start sm:gap-6 text-center sm:text-left">
                        <img src={profileImage} className="w-20 h-20 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-[#0f0f0f] -mt-12 sm:-mt-16 shadow-2xl relative z-10" alt="Profile" />
                        <div className="mt-4 sm:mt-0 flex-grow">
                            <h1 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tighter leading-tight">{player.artistName}</h1>
                            <p className="text-sm font-medium text-gray-400 mt-1">@{player.artistName.toLowerCase().replace(/\s/g, '')} • {formatNumber(player.subscribers)} subscribers • {uploads.length} videos</p>
                            <div className="mt-4 flex flex-col sm:flex-row gap-4 items-center">
                                <p className="text-xs text-gray-500 font-medium max-w-lg line-clamp-2 italic">"{player.bio || `Official YouTube channel of ${player.artistName}. High-fidelity visual assets and official audio syncs.`}"</p>
                                <button className="bg-white text-black font-black text-xs uppercase tracking-widest px-8 py-2.5 rounded-full hover:bg-gray-200 transition-colors shadow-lg">Subscribe</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-4 border-t border-white/5 pt-8">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-6">Recent Uploads</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-6">
                        {uploads.map(({ song, type, date }) => {
                            const views = type === 'video' ? (song.youtubeVideoViews || 0) : (song.youtubeAudioViews || 0);
                            const title = `${song.title} ${type === 'video' ? '(Official Music Video)' : '(Official Audio)'}`;
                            const thumbnail = (type === 'video' && song.youtubeThumbnail) ? song.youtubeThumbnail : song.coverArt;
                            return (
                                <div key={`${song.id}-${type}`} className="cursor-pointer group flex flex-col" onClick={() => setViewingSong(song)}>
                                    <div className="relative aspect-video bg-gray-800 rounded-2xl overflow-hidden mb-4 shadow-lg border border-white/5">
                                        <img src={thumbnail!} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        {song.vevoWatermark && type === 'video' && <div className="absolute bottom-2 left-3 bg-white/10 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] font-black text-white/40 border border-white/5 uppercase italic tracking-tighter">vevo</div>}
                                        <span className="absolute bottom-3 right-3 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded font-black">{formatDuration(song.duration)}</span>
                                    </div>
                                    <div className="flex gap-4 px-1">
                                        <img src={profileImage} className="w-10 h-10 rounded-full object-cover flex-shrink-0 border border-white/5" />
                                        <div className="min-w-0">
                                            <p className="font-black text-base leading-tight line-clamp-2 uppercase tracking-tighter group-hover:text-red-500 transition-colors">{title}</p>
                                            <p className="text-[13px] text-gray-400 mt-1 font-medium">{player.artistName} • {formatNumber(views)} views • {timeSince(date, gameDate)}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default YouTubeScreen;
