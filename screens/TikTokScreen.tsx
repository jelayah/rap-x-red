import React, { useState, useMemo, useEffect } from 'react';
import type { Player, Song, Album, SocialPost } from '../types';

interface TikTokScreenProps {
    player: Player;
    setPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
    songs: Song[];
    setSongs: React.Dispatch<React.SetStateAction<Song[]>>;
    albums: Album[];
    onBack: () => void;
    gameDate: Date;
}

// Fix: Renamed formatMetric to formatNumber and corrected 'val' to 'num'.
// Added alias formatMetric for compatibility and handled undefined 'val' error.
const formatNumber = (num: number) => {
    if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`;
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 10_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toLocaleString();
};

const formatMetric = formatNumber;

const UploadTikTokModal: React.FC<{ 
    songs: Song[]; 
    onClose: () => void; 
    onPost: (caption: string, song: Song | null, image: string) => void; 
}> = ({ songs, onClose, onPost }) => {
    const [caption, setCaption] = useState('');
    const [selectedSongId, setSelectedSongId] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const releasedSongs = songs.filter(s => s.isReleased);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        if (!imagePreview) {
            alert("Please upload a video first.");
            return;
        }
        const song = releasedSongs.find(s => s.id === selectedSongId) || null;
        onPost(caption, song, imagePreview);
    };

    return (
        <div className="fixed inset-0 bg-black/95 z-[150] flex items-center justify-center p-4 animate-fade-in backdrop-blur-xl">
            <div className="bg-white text-black w-full max-w-sm rounded-[2rem] overflow-hidden flex flex-col max-h-[90vh] shadow-2xl">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                    <button onClick={onClose} className="text-sm font-bold text-gray-500">Cancel</button>
                    <h2 className="font-black uppercase tracking-tighter">Share</h2>
                    <button onClick={handleSubmit} className="text-sm font-black text-[#FE2C55]">POST</button>
                </div>
                <div className="p-6 overflow-y-auto space-y-6">
                    <div className="aspect-[9/16] bg-gray-50 rounded-2xl flex items-center justify-center relative overflow-hidden border-2 border-dashed border-gray-200">
                        {imagePreview ? (
                            <img src={imagePreview} className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-center text-gray-400">
                                <svg className="w-12 h-12 mx-auto mb-2 opacity-20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.5 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                                <p className="text-[10px] font-black uppercase tracking-widest">Select Video</p>
                                <input type="file" accept="video/*,image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
                            </div>
                        )}
                        {imagePreview && (
                             <input type="file" accept="video/*,image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
                        )}
                    </div>
                    <textarea 
                        className="w-full border-b border-gray-100 p-2 focus:outline-none resize-none font-medium text-sm" 
                        placeholder="Add hashtags..." 
                        rows={3}
                        value={caption}
                        onChange={e => setCaption(e.target.value)}
                    />
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Sync Sound</label>
                        <select 
                            className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm font-bold outline-none"
                            value={selectedSongId}
                            onChange={e => setSelectedSongId(e.target.value)}
                        >
                            <option value="">Original Sound</option>
                            {releasedSongs.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    )
}

const TikTokVideoModal: React.FC<{ 
    post: SocialPost; 
    player: Player; 
    songs: Song[]; 
    onClose: () => void 
}> = ({ post, player, songs, onClose }) => {
    const linkedSong = songs.find(s => s.id === post.songId);
    const soundName = linkedSong ? `${linkedSong.title} - ${linkedSong.artistName}` : `Original Sound - ${player.artistName}`;
    const artistPic = player.aboutImage || `https://source.unsplash.com/100x100/?portrait`;

    return (
        <div className="fixed inset-0 bg-black z-[110] flex flex-col justify-center items-center">
            <div className="relative w-full max-w-md h-full bg-black overflow-hidden flex items-center justify-center">
                <button onClick={onClose} className="absolute top-6 left-6 z-20 text-white drop-shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <img src={post.image} className="w-full h-full object-cover opacity-90" alt="Video Content" />
                <div className="absolute right-3 bottom-32 flex flex-col items-center gap-6 text-white z-10">
                    <div className="relative">
                        <img src={artistPic} className="w-12 h-12 rounded-full border-2 border-white shadow-2xl" />
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#FE2C55] rounded-full w-5 h-5 flex items-center justify-center text-white text-[15px] font-bold">+</div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 drop-shadow-md"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                        <span className="text-[10px] font-black uppercase drop-shadow-md">{formatMetric(post.likes)}</span>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 to-transparent pt-20">
                    <p className="font-black text-white text-base tracking-tight mb-1">@{player.artistName.toLowerCase().replace(/\s/g, '_')}</p>
                    <p className="text-sm text-white/90 line-clamp-2 mt-1 mb-4 font-medium">{post.caption}</p>
                    <div className="flex items-center gap-2 overflow-hidden w-2/3 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white animate-spin-slow"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                        <div className="whitespace-nowrap text-xs text-white font-black uppercase tracking-widest overflow-hidden relative">
                             <div className="animate-marquee">{soundName}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const PromoteModal: React.FC<{ 
    song: Song; 
    player: Player; 
    onClose: () => void; 
    onPromote: (cost: number, method: string) => void; 
}> = ({ song, player, onClose, onPromote }) => {
    const options = [
        { id: 'micro', label: 'Micro-Influencer Seed', cost: 2500, estReach: '50K - 150K', icon: '🌱', desc: 'Seed 50 creators to use your sound.' },
        { id: 'macro', label: 'Elite Creator Feature', cost: 25000, estReach: '500K - 2M', icon: '⭐', desc: 'Top-tier viral influencers use your sound.' },
        { id: 'challenge', label: 'Hashtag Challenge', cost: 75000, estReach: '5M - 20M', icon: '🔥', desc: 'Paid trend with custom hashtag page.' },
    ];
    const [selectedId, setSelectedId] = useState<string | null>(null);

    return (
        <div className="fixed inset-0 bg-black/95 z-[150] flex flex-col font-sans animate-fade-in overflow-y-auto backdrop-blur-2xl">
            <div className="p-4 flex items-center justify-between border-b border-white/5 bg-[#0f0f0f] sticky top-0 z-10">
                <button onClick={onClose} className="text-white p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <h1 className="text-sm font-black uppercase tracking-widest text-white">Ad Campaign</h1>
                <div className="w-10"></div>
            </div>
            <main className="p-6 max-w-lg mx-auto w-full space-y-8 pb-32">
                <div className="text-center">
                    <img src={song.coverArt || ''} className="w-32 h-32 mx-auto rounded-3xl shadow-2xl border-2 border-white/10 mb-4" />
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter">{song.title}</h2>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    {options.map(opt => (
                        <button key={opt.id} onClick={() => setSelectedId(opt.id)} className={`w-full text-left rounded-[2rem] p-6 border transition-all ${selectedId === opt.id ? 'bg-[#FE2C55] border-white' : 'bg-white/5 border-white/10'}`}>
                            <div className="flex justify-between items-start mb-2"><div className="flex items-center gap-3"><span>{opt.icon}</span><p className="font-black text-white uppercase tracking-tighter">{opt.label}</p></div><p className={`font-black ${selectedId === opt.id ? 'text-white' : 'text-[#FE2C55]'}`}>${opt.cost.toLocaleString()}</p></div>
                            <p className={`text-xs ${selectedId === opt.id ? 'text-white/80' : 'text-gray-500'} font-medium`}>{opt.desc}</p>
                        </button>
                    ))}
                </div>
            </main>
            <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black to-transparent z-20">
                <button disabled={!selectedId} onClick={() => onPromote(options.find(o => o.id === selectedId)!.cost, selectedId!)} className={`w-full max-w-lg mx-auto block py-5 rounded-full font-black uppercase tracking-widest transition-all ${selectedId ? 'bg-[#FE2C55] text-white shadow-[0_0_30px_rgba(254,44,85,0.4)]' : 'bg-white/5 text-gray-600'}`}>Authorize Campaign</button>
            </div>
        </div>
    );
};

const TikTokScreen: React.FC<TikTokScreenProps> = ({ player, setPlayer, songs, setSongs, albums, onBack, gameDate }) => {
    const [activeTab, setActiveTab] = useState<'videos' | 'music'>('videos');
    const [isUploading, setIsUploading] = useState(false);
    const [viewingPost, setViewingPost] = useState<SocialPost | null>(null);
    const [promotingSong, setPromotingSong] = useState<Song | null>(null);

    const tiktokPosts = useMemo(() => (player.socialPosts || []).filter(p => p.platform === 'TikTok'), [player.socialPosts]);
    const musicList = useMemo(() => songs.filter(s => s.isReleased).sort((a,b) => b.rapifyStreams - a.rapifyStreams), [songs]);

    // PERSISTENT FOLLOWER LOGIC: Dampened monthly listener effect + High Reputation/Catalog Floor
    const followers = useMemo(() => {
        const mlFloor = player.monthlyListeners * 0.1; 
        const repBonus = player.reputation * 25000; 
        const catalogFloor = player.careerTotalUnits * 0.35; 
        return Math.floor(mlFloor + repBonus + catalogFloor + 300);
    }, [player.monthlyListeners, player.reputation, player.careerTotalUnits]);

    const totalLikes = tiktokPosts.reduce((acc, p) => acc + p.likes, 0);

    const handlePost = (caption: string, song: Song | null, image: string) => {
        const viralPotential = song ? (song.quality / 100) : 0.5;
        const totalViews = Math.floor(followers * (0.05 + Math.random() * 0.2) * (0.5 + viralPotential) + 100);
        const totalLikesCount = Math.floor(totalViews * (0.08 + Math.random() * 0.15)); 
        
        const newPost: SocialPost = { id: `tiktok_${Date.now()}`, type: 'Manual', caption, image, images: [image], date: new Date(gameDate), likes: totalLikesCount, comments: Math.floor(totalLikesCount * 0.05), views: totalViews, shares: 0, platform: 'TikTok', songId: song?.id };
        setPlayer(prev => prev ? { ...prev, socialPosts: [newPost, ...prev.socialPosts] } : null);
        setIsUploading(false);
    };

    const handlePromote = (cost: number, method: string) => {
        if (!promotingSong) return;
        setPlayer((p: Player) => ({ ...p, money: p.money - cost }));
        // Set 4 week promotion cycle
        setSongs((prev: Song[]) => prev.map(s => s.id === promotingSong.id ? { ...s, pendingTikTokPromo: true, tiktokPromoCooldown: 4 } : s));
        setPromotingSong(null);
    };

    return (
        <div className="bg-[#010101] text-white min-h-screen fixed inset-0 z-[60] flex flex-col font-sans overflow-hidden">
            {isUploading && <UploadTikTokModal songs={songs} onClose={() => setIsUploading(false)} onPost={handlePost} />}
            {viewingPost && <TikTokVideoModal post={viewingPost} player={player} songs={songs} onClose={() => setViewingPost(null)} />}
            {promotingSong && <PromoteModal song={promotingSong} player={player} onClose={() => setPromotingSong(null)} onPromote={handlePromote} />}

            <div className="sticky top-0 bg-black/80 backdrop-blur-md z-20 flex justify-between items-center px-4 py-4 border-b border-white/5">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-white/5 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                </button>
                <div className="font-black flex items-center gap-1 text-lg italic tracking-tighter">{player.artistName.toUpperCase()}</div>
                <div className="w-10"></div>
            </div>

            <main className="flex-1 overflow-y-auto scrollbar-hide pb-20">
                <div className="flex flex-col items-center pt-8 pb-6">
                    <div className="relative">
                        <img src={player.aboutImage || `https://source.unsplash.com/200x200/?portrait`} className="w-24 h-24 rounded-full object-cover border-2 border-white/10" />
                        <div className="absolute -bottom-1 -right-1 bg-[#FE2C55] rounded-full p-1 border-2 border-black">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                        </div>
                    </div>
                    <h1 className="mt-4 font-black text-base tracking-widest uppercase">@{player.artistName.toLowerCase().replace(/\s/g, '_')}</h1>
                    <div className="flex gap-8 mt-6 text-center">
                        <div><p className="font-black text-lg italic leading-none">{formatNumber(followers)}</p><p className="text-gray-500 text-[9px] font-black uppercase mt-1 tracking-widest">Followers</p></div>
                        <div><p className="font-black text-lg italic leading-none">{formatNumber(totalLikes)}</p><p className="text-gray-500 text-[9px] font-black uppercase mt-1 tracking-widest">Likes</p></div>
                    </div>
                </div>
                
                <div className="flex border-b border-white/5 sticky top-0 bg-black/80 backdrop-blur-md z-10">
                    <button onClick={() => setActiveTab('videos')} className={`flex-1 py-4 font-black text-[10px] uppercase tracking-[0.2em] transition-all ${activeTab === 'videos' ? 'border-b-2 border-white text-white' : 'text-gray-600'}`}>Bytes</button>
                    <button onClick={() => setActiveTab('music')} className={`flex-1 py-4 font-black text-[10px] uppercase tracking-[0.2em] transition-all ${activeTab === 'music' ? 'border-b-2 border-white text-white' : 'text-gray-600'}`}>Official Music</button>
                </div>

                {activeTab === 'videos' ? (
                    <div className="p-1 grid grid-cols-3 gap-1">
                        <button onClick={() => setIsUploading(true)} className="aspect-[3/4] bg-white/5 border border-white/10 flex flex-col items-center justify-center text-gray-600 hover:bg-white/10 group transition-all">
                            <span className="text-4xl font-light mb-2 group-hover:text-white">+</span>
                            <span className="text-[8px] font-black uppercase tracking-widest">Post</span>
                        </button>
                        {tiktokPosts.map(post => (
                            <div key={post.id} onClick={() => setViewingPost(post)} className="aspect-[3/4] bg-gray-900 cursor-pointer overflow-hidden relative group shadow-xl">
                                <img src={post.image} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute bottom-2 left-2 flex items-center gap-1">
                                    <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3"><path d="M8 5v14l11-7z"/></svg>
                                    <span className="text-[10px] font-black text-white">{formatNumber(post.views || 0)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-4 space-y-4">
                        {musicList.map(song => (
                            <div key={song.id} className="flex justify-between items-center bg-white/5 p-4 rounded-3xl border border-white/5 transition-all">
                                <div className="flex items-center gap-4">
                                    <img src={song.coverArt || ''} className="w-16 h-16 rounded-2xl shadow-xl object-cover" />
                                    <div>
                                        <p className="font-black text-sm uppercase italic tracking-tighter">{song.title}</p>
                                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                                            {/* REALISTIC USES RATIO: roughly 1 use per 850 streams */}
                                            {formatMetric(Math.floor(song.rapifyStreams / 850))} Uses
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <button 
                                        onClick={() => !song.pendingTikTokPromo && setPromotingSong(song)} 
                                        disabled={song.pendingTikTokPromo}
                                        className={`px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${song.pendingTikTokPromo ? 'bg-white/10 text-gray-500 cursor-default' : 'bg-[#FE2C55] text-white shadow-lg active:scale-95'}`}
                                    >
                                        {song.pendingTikTokPromo ? (
                                            <span className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                                Ad Running
                                            </span>
                                        ) : 'Promote'}
                                    </button>
                                    {song.pendingTikTokPromo && (
                                        <p className="text-[8px] font-black text-gray-600 uppercase tracking-tighter">
                                            Ends in {song.tiktokPromoCooldown} week(s)
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default TikTokScreen;