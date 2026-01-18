
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
    if (interval > 1) return `${Math.floor(interval)}y ago`;
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)}mo ago`;
    interval = seconds / 604800; 
    if (interval > 1) return `${Math.floor(interval)}w ago`;
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)}d ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
};

const getYouTubeDescription = (song: Song, player: Player, albums: Album[]) => {
    const isMusicVideo = song.hasMusicVideo;
    const label = player.label || "Independent";
    const releaseDate = ensureDate(song.videoReleaseDate || song.releaseDate);
    const formattedDate = releaseDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    
    if (!isMusicVideo) {
        const parentAlbum = albums.find(a => a.id === song.albumId);
        const albumName = parentAlbum ? parentAlbum.title : song.title;
        return `Provided to YouTube by ${label} | ${song.title} | ${albumName} | Writers: ${player.realName}`;
    } else {
        return `VEVO, all rights go to ${player.artistName} & ${label} .. ${formattedDate}`;
    }
};

const EngagementButton: React.FC<{ icon: React.ReactNode; label?: string; active?: boolean; className?: string }> = ({ icon, label, active, className }) => (
    <button className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all active:scale-95 whitespace-nowrap ${className} ${active ? 'bg-white/20' : 'bg-white/10 hover:bg-white/15'}`}>
        {icon}
        {label && <span className="text-xs font-black uppercase tracking-tighter">{label}</span>}
    </button>
);

const YouTubeVideoDetailScreen: React.FC<{ 
    song: Song; 
    player: Player; 
    albums: Album[];
    onBack: () => void; 
    gameDate: Date; 
    allUploads: any[]; 
    onSelectRelated: (song: Song) => void; 
}> = ({ song, player, albums, onBack, gameDate, allUploads, onSelectRelated }) => {
    const isMusicVideo = song.hasMusicVideo;
    const views = isMusicVideo ? (song.youtubeVideoViews || 0) : (song.youtubeAudioViews || 0);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    
    const displayDate = isMusicVideo && song.videoReleaseDate ? song.videoReleaseDate : song.releaseDate;
    const thumbnailSrc = (isMusicVideo && song.youtubeThumbnail) ? song.youtubeThumbnail : song.coverArt;
    const artistPic = player.aboutImage || `https://source.unsplash.com/100x100/?portrait`;
    const relatedVideos = allUploads.filter(u => u.song.id !== song.id).slice(0, 15);
    const description = getYouTubeDescription(song, player, albums);

    return (
        <div className="bg-[#0f0f0f] text-white min-h-screen fixed inset-0 z-[70] overflow-y-auto pb-32">
            <header className="px-4 py-3 flex items-center gap-4 sticky top-0 bg-[#0f0f0f]/95 backdrop-blur-md z-40 border-b border-white/5">
                 <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                 </button>
                 <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate leading-none">{song.title}</p>
                 </div>
            </header>

            <main>
                <div className="relative w-full aspect-video bg-black group overflow-hidden">
                    <div className="absolute inset-0 blur-[100px] opacity-10 scale-110 pointer-events-none transition-all duration-1000"
                        style={{ background: `radial-gradient(circle, ${song.quality > 85 ? '#ff0033' : '#333'} 0%, transparent 70%)` }}
                    ></div>
                    <img src={thumbnailSrc!} alt={song.title} className="relative z-10 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.01]" />
                    <div className="absolute inset-0 bg-black/20 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-16 h-16 text-white fill-current drop-shadow-2xl" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/20 z-30">
                        <div className="h-full bg-[#ff0000] shadow-[0_0_10px_#f00]" style={{ width: '62%' }}></div>
                    </div>
                </div>

                <div className="p-4 space-y-4">
                    <div className="space-y-1">
                        <h1 className="text-xl font-black italic uppercase tracking-tighter leading-tight">{song.title} {isMusicVideo ? '(Official Music Video)' : '(Official Audio)'}</h1>
                        <div className="flex items-center gap-2 text-[12px] font-bold text-gray-400 uppercase tracking-widest">
                            <span>{formatNumber(views)} views</span>
                            <span className="opacity-30">•</span>
                            <span>{timeSince(displayDate, gameDate)}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between py-1">
                        <div className="flex items-center gap-3">
                            <img src={artistPic} className="w-10 h-10 rounded-full object-cover border border-white/10 shadow-lg" />
                            <div className="min-w-0">
                                <div className="flex items-center gap-1">
                                    <p className="font-black text-sm uppercase tracking-tight truncate">{player.artistName}</p>
                                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-gray-500 fill-current"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.9 14.7L6 12.6l1.5-1.5 2.6 2.6 6.1-6.1 1.5 1.5-7.6 7.6z"></path></svg>
                                </div>
                                <p className="text-[11px] text-gray-500 font-bold uppercase tracking-tighter">{formatNumber(player.subscribers)} subscribers</p>
                            </div>
                        </div>
                        <button className="bg-white text-black font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-full active:scale-95 transition-all">Subscribe</button>
                    </div>

                    <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                        <div className="flex bg-white/10 rounded-full overflow-hidden shrink-0 border border-white/5">
                             <button 
                                onClick={() => { setLiked(!liked); setDisliked(false); }}
                                className={`flex items-center gap-2 px-4 py-2 border-r border-white/5 transition-colors active:bg-white/20 ${liked ? 'text-[#3ea6ff]' : 'hover:bg-white/5'}`}
                             >
                                <svg className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2.2}><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                <span className="text-xs font-black tabular-nums">{formatNumber(Math.floor(views * 0.08) + (liked ? 1 : 0))}</span>
                             </button>
                             <button 
                                onClick={() => { setDisliked(!disliked); setLiked(false); }}
                                className={`flex items-center px-4 py-2 hover:bg-white/5 transition-colors active:bg-white/20 ${disliked ? 'text-[#ff4e4e]' : ''}`}
                             >
                                <svg className={`w-5 h-5 ${disliked ? 'fill-current' : ''}`} viewBox="0 0 24 24" fill={disliked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2.2}><path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                             </button>
                        </div>
                        <EngagementButton label="Share" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}><path d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0-10.628a2.25 2.25 0 102.246-3.817 2.25 2.25 0 00-2.246 3.817zm0 10.628a2.25 2.25 0 102.246 3.817 2.25 2.25 0 00-2.246-3.817z"/></svg>} />
                        <EngagementButton label="Remix" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}><path d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>} />
                        <EngagementButton label="Save" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}><path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/></svg>} />
                    </div>

                    <div 
                        onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                        className={`bg-white/5 rounded-2xl p-4 transition-all hover:bg-white/10 cursor-pointer border border-white/5 ${isDescriptionExpanded ? '' : 'max-h-28 overflow-hidden'}`}
                    >
                        <div className="flex items-center gap-2 mb-2">
                             <span className="font-black text-xs uppercase tracking-widest">{formatNumber(views)} views</span>
                             <span className="font-black text-xs uppercase tracking-widest text-gray-500">{timeSince(displayDate, gameDate)}</span>
                        </div>
                        <p className={`text-sm text-gray-300 leading-relaxed font-medium ${isDescriptionExpanded ? 'whitespace-pre-wrap' : 'line-clamp-2'}`}>
                            {description}
                        </p>
                        {!isDescriptionExpanded && (
                            <p className="text-gray-500 font-black text-[10px] mt-2 uppercase tracking-[0.2em]">...more</p>
                        )}
                        {isDescriptionExpanded && (
                            <p className="text-[#3ea6ff] font-black text-[10px] mt-4 uppercase tracking-[0.2em]">Show less</p>
                        )}
                    </div>
                </div>

                <div className="border-t border-white/5 mt-6 pb-20 bg-black/20">
                    <div className="px-4 py-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-6">Up Next</h3>
                        <div className="space-y-4">
                            {relatedVideos.map(({ song: s, type, date }) => {
                                const relViews = type === 'video' ? (s.youtubeVideoViews || 0) : (s.youtubeAudioViews || 0);
                                const thumbnail = (type === 'video' && s.youtubeThumbnail) ? s.youtubeThumbnail : s.coverArt;
                                return (
                                    <div key={`${s.id}-${type}`} className="flex gap-4 group cursor-pointer active:opacity-60 transition-all" onClick={() => onSelectRelated(s)}>
                                        <div className="relative w-40 aspect-video rounded-xl overflow-hidden flex-shrink-0 bg-gray-900 border border-white/5">
                                            <img src={thumbnail!} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                                            {s.vevoWatermark && type === 'video' && <div className="absolute bottom-1.5 left-1.5 bg-white/10 backdrop-blur-md px-1 py-0.2 rounded text-[7px] font-black text-white/60 border border-white/5 uppercase italic tracking-tighter">vevo</div>}
                                            <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] px-1 py-0.5 rounded font-black">{formatDuration(s.duration)}</span>
                                        </div>
                                        <div className="flex-grow min-w-0 flex flex-col justify-center">
                                            <h3 className="text-sm font-black italic uppercase leading-tight tracking-tight line-clamp-2 group-hover:text-red-500 transition-colors">{s.title} {type === 'video' ? '(Video)' : '(Audio)'}</h3>
                                            <div className="text-[11px] text-gray-500 font-bold uppercase tracking-tighter mt-1.5">
                                                <p className="truncate mb-0.5">{player.artistName}</p>
                                                <p>{formatNumber(relViews)} views • {timeSince(date, gameDate)}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
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

    if (viewingSong) return <YouTubeVideoDetailScreen song={viewingSong} player={player} albums={albums} onBack={() => setViewingSong(null)} gameDate={gameDate} allUploads={uploads} onSelectRelated={(s) => setViewingSong(s)} />;
    
    const profileImage = player.aboutImage || `https://source.unsplash.com/150x150/?portrait`;
    const bannerImage = player.headerImage || `https://source.unsplash.com/1200x300/?abstract,texture`;

    return (
        <div className="bg-[#0f0f0f] text-white min-h-screen fixed inset-0 z-[60] overflow-y-auto">
            <header className="sticky top-0 bg-[#0f0f0f]/95 backdrop-blur-xl z-30 flex items-center justify-between px-4 py-3 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-1 rounded-full hover:bg-white/10 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                    </button>
                    <div className="flex items-center gap-1.5">
                        <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#FF0000] fill-current"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                        <span className="font-black text-2xl tracking-tighter uppercase italic">YouTube</span>
                    </div>
                </div>
                <div className="flex items-center gap-5">
                    <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>
                    <img src={profileImage} className="w-8 h-8 rounded-full border border-white/10 object-cover" alt="Me" />
                </div>
            </header>

            <main className="pb-32">
                <div className="w-full">
                    <div className="h-32 sm:h-48 bg-gray-900 relative overflow-hidden">
                        <img src={bannerImage} className="w-full h-full object-cover opacity-40 blur-[2px] scale-105" alt="Channel Banner" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent"></div>
                    </div>
                    <div className="px-5 py-6 flex flex-col items-center sm:flex-row sm:items-start sm:gap-8 text-center sm:text-left relative z-10">
                        <img src={profileImage} className="w-24 h-24 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-[#0f0f0f] -mt-12 sm:-mt-24 shadow-2xl" alt="Profile" />
                        <div className="mt-4 sm:mt-0 flex-grow">
                            <h1 className="text-3xl sm:text-5xl font-black italic uppercase tracking-tighter leading-none">{player.artistName}</h1>
                            <p className="text-[13px] font-bold text-gray-500 mt-2 uppercase tracking-widest">@{player.artistName.toLowerCase().replace(/\s/g, '')} • {formatNumber(player.subscribers)} subscribers</p>
                            
                            <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center">
                                <button className="w-full sm:w-auto bg-white text-black font-black text-xs uppercase tracking-widest px-10 py-3 rounded-full hover:bg-gray-200 transition-all shadow-xl active:scale-95">Subscribe</button>
                                <p className="text-xs text-gray-500 font-bold max-w-lg line-clamp-2 italic px-4 sm:px-0 opacity-60">"{player.bio || `Official channel of ${player.artistName}. HQ visual assets.`}"</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-0 pt-4">
                    <div className="flex items-center gap-3 px-5 mb-8">
                        <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-500">Asset Stream</h2>
                        <div className="h-[1px] flex-grow bg-white/5"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 sm:gap-x-4">
                        {uploads.map(({ song, type, date }, i) => {
                            const views = type === 'video' ? (song.youtubeVideoViews || 0) : (song.youtubeAudioViews || 0);
                            const title = `${song.title} ${type === 'video' ? '(Official Video)' : '(Audio)'}`;
                            const thumbnail = (type === 'video' && song.youtubeThumbnail) ? song.youtubeThumbnail : song.coverArt;
                            return (
                                <div key={`${song.id}-${type}`} className="cursor-pointer group flex flex-col" onClick={() => setViewingSong(song)}>
                                    <div className="relative aspect-video bg-gray-900 overflow-hidden mb-4 shadow-xl">
                                        <img src={thumbnail!} alt={title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                                        {song.vevoWatermark && type === 'video' && (
                                            <div className="absolute bottom-3 left-4 bg-white/10 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] font-black text-white/60 border border-white/5 uppercase italic tracking-tighter">vevo</div>
                                        )}
                                        <span className="absolute bottom-3 right-3 bg-black/80 text-white text-[10px] px-2 py-0.5 rounded font-black tracking-tight">{formatDuration(song.duration)}</span>
                                    </div>
                                    <div className="flex gap-4 px-5">
                                        <img src={profileImage} className="w-10 h-10 rounded-full object-cover flex-shrink-0 border border-white/5" />
                                        <div className="min-w-0">
                                            <p className="font-black text-base leading-tight line-clamp-2 uppercase italic tracking-tighter group-hover:text-red-500 transition-colors">{title}</p>
                                            <div className="text-[12px] text-gray-500 mt-1.5 font-bold tracking-tight uppercase">
                                                <p className="truncate opacity-80">{player.artistName}</p>
                                                <p className="tabular-nums">{formatNumber(views)} views • {timeSince(date, gameDate)}</p>
                                            </div>
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
