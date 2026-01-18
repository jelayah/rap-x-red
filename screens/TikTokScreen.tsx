
import React, { useState, useMemo } from 'react';
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

const formatNumber = (num: number) => {
    if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`;
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 10_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toLocaleString();
};

const CreateVideoModal: React.FC<{ onClose: () => void; onPost: (caption: string, image: string) => void }> = ({ onClose, onPost }) => {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState<string | null>(null);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/95 z-[250] flex items-center justify-center p-4 backdrop-blur-2xl">
            <div className="bg-[#121212] w-full max-w-md rounded-[2.5rem] border border-white/10 p-6 shadow-2xl animate-fade-in-up">
                <h2 className="text-xl font-black italic uppercase tracking-tighter text-white mb-6">Create Byte</h2>
                <div className="space-y-6">
                    <div className="aspect-[3/4] bg-white/5 rounded-2xl border border-white/10 overflow-hidden relative cursor-pointer group">
                        {image ? <img src={image} className="w-full h-full object-cover" /> : <div className="absolute inset-0 flex items-center justify-center text-gray-700 text-xs font-black uppercase">Record / Upload</div>}
                        <input type="file" accept="image/*" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                    <textarea 
                        value={caption}
                        onChange={e => setCaption(e.target.value)}
                        placeholder="Add a trending hook..."
                        className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#FE2C55]"
                    />
                    <button 
                        onClick={() => image && onPost(caption, image)}
                        disabled={!image}
                        className="w-full bg-[#FE2C55] text-white font-black py-4 rounded-full uppercase tracking-widest shadow-xl disabled:opacity-30"
                    >
                        Deploy to FYP
                    </button>
                    <button onClick={onClose} className="w-full text-[10px] font-black text-gray-500 uppercase">Discard</button>
                </div>
            </div>
        </div>
    );
};

const PromoteModal: React.FC<{ 
    song: Song; 
    player: Player; 
    onClose: () => void; 
    onPromote: (cost: number, intensity: number) => void; 
}> = ({ song, player, onClose, onPromote }) => {
    const [selectedTier, setSelectedTier] = useState<string | null>(null);

    const tiers = [
        { id: 'organic', label: 'Sound Seeding', cost: 3500, intensity: 0.15, reach: '75K - 200K', icon: '🍃', desc: '50 micro-creators feature your audio in casual lifestyle content.' },
        { id: 'creator', label: 'Creator Synergy', cost: 25000, intensity: 0.85, reach: '2M - 4.5M', icon: '📽️', desc: 'Partner with 5 elite influencers for high-production viral hooks.' },
        { id: 'viral', label: 'Viral Propellant', cost: 95000, intensity: 2.8, reach: '12M - 35M', icon: '🚀', desc: 'Algorithm priority injection + top 1% creator challenge launch.' },
    ];

    const currentTier = tiers.find(t => t.id === selectedTier);

    return (
        <div className="fixed inset-0 bg-black/98 z-[200] flex flex-col font-sans animate-fade-in overflow-hidden">
            <header className="p-6 border-b border-white/5 flex items-center justify-between bg-[#0a0a0a] sticky top-0 z-10">
                <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-white/5 transition-colors text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                </button>
                <div className="text-center">
                    <p className="text-[10px] font-black text-[#FE2C55] uppercase tracking-[0.4em] mb-1">Viral Acquisition</p>
                    <h1 className="text-xl font-black italic uppercase tracking-tighter text-white">Campaign Suite</h1>
                </div>
                <div className="w-10"></div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 sm:p-10 max-w-5xl mx-auto w-full pb-40 space-y-12">
                <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/5 flex items-center gap-6 shadow-2xl">
                    <img src={song.coverArt || ''} className="w-24 h-24 rounded-2xl shadow-2xl object-cover" />
                    <div>
                        <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white leading-tight">{song.title}</h2>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Audit Score: {song.quality}% Quality Index</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                    <div className="lg:col-span-3 space-y-8">
                        <h3 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.4em] px-2">Deployment Strategy</h3>
                        <div className="grid grid-cols-1 gap-4">
                            {tiers.map(tier => (
                                <button 
                                    key={tier.id}
                                    onClick={() => setSelectedTier(tier.id)}
                                    className={`w-full p-8 rounded-[3rem] border-2 text-left flex justify-between items-center transition-all ${selectedTier === tier.id ? 'bg-white border-[#FE2C55] text-black shadow-2xl scale-[1.02]' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'}`}
                                >
                                    <div className="flex gap-6 items-center">
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${selectedTier === tier.id ? 'bg-black/5' : 'bg-black/40 text-gray-600'}`}>{tier.icon}</div>
                                        <div>
                                            <h4 className="font-black text-xl uppercase italic tracking-tighter mb-1 leading-none">{tier.label}</h4>
                                            <p className={`text-[10px] font-bold uppercase tracking-widest ${selectedTier === tier.id ? 'text-[#FE2C55]' : 'text-gray-500'}`}>{tier.reach} Exposure</p>
                                        </div>
                                    </div>
                                    <p className="font-black italic text-2xl">${tier.cost.toLocaleString()}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-[#111] p-10 rounded-[3.5rem] border border-white/5 shadow-2xl sticky top-32">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-10 border-b border-white/5 pb-4">Campaign Logic</h3>
                            
                            {currentTier ? (
                                <div className="space-y-10 animate-fade-in">
                                    <div className="flex justify-between items-end">
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Viral Coefficient</p>
                                        <p className="text-4xl font-black italic tracking-tighter leading-none text-white">+{currentTier.intensity}x</p>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Stream Sync (15%)</p>
                                        <p className="text-4xl font-black italic tracking-tighter leading-none text-[#25F4EE]">+{Math.round(currentTier.intensity * 15)}% <span className="text-xs uppercase italic opacity-40">Gain</span></p>
                                    </div>
                                    <p className="text-[9px] text-gray-600 font-bold uppercase italic leading-relaxed text-center">Protocol: 15% of campaign success converts to weekly platform streams.</p>

                                    <div className="pt-10 border-t border-white/10">
                                        <button 
                                            onClick={() => onPromote(currentTier.cost, currentTier.intensity)}
                                            disabled={player.money < currentTier.cost}
                                            className="w-full bg-[#FE2C55] text-white font-black py-6 rounded-full uppercase tracking-[0.2em] text-xs shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-30"
                                        >
                                            Initialize Protocol
                                        </button>
                                        {player.money < currentTier.cost && <p className="text-center text-[10px] font-black text-red-500 uppercase mt-4">Fiscal Insufficiency</p>}
                                    </div>
                                </div>
                            ) : (
                                <div className="py-20 text-center opacity-30 flex flex-col items-center">
                                    <svg className="w-12 h-12 mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 11V7m0 4v4m0-4h4m-4 0H8m13 1a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={1.5}/></svg>
                                    <p className="text-[10px] font-black uppercase tracking-widest">Select tier to simulate ROI</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

const TikTokScreen: React.FC<TikTokScreenProps> = ({ player, setPlayer, songs, setSongs, albums, onBack, gameDate }) => {
    const [activeTab, setActiveTab] = useState<'videos' | 'music'>('videos');
    const [promotingSong, setPromotingSong] = useState<Song | null>(null);
    const [isCreatingVideo, setIsCreatingVideo] = useState(false);

    const tiktokPosts = useMemo(() => (player.socialPosts || []).filter(p => p.platform === 'TikTok'), [player.socialPosts]);
    const musicList = useMemo(() => songs.filter(s => s.isReleased).sort((a,b) => b.rapifyStreams - a.rapifyStreams), [songs]);

    const followers = useMemo(() => {
        const catalogEffect = player.careerTotalUnits * 0.22;
        const repEffect = player.reputation * 8500;
        return Math.floor(catalogEffect + repEffect + player.subscribers * 0.4 + 500);
    }, [player.reputation, player.careerTotalUnits, player.subscribers]);

    const handlePromote = (cost: number, intensity: number) => {
        if (!promotingSong) return;
        setPlayer((p: Player) => ({ 
            ...p, 
            money: p.money - cost,
            transactions: [...(p.transactions || []), {
                id: `tt_ad_${Date.now()}`,
                amount: cost,
                description: `TikTok Viral Sync: ${promotingSong.title}`,
                type: 'Expense',
                date: new Date(gameDate)
            }]
        }));
        setSongs((prev: Song[]) => prev.map(s => s.id === promotingSong.id ? { 
            ...s, 
            pendingTikTokPromo: true, 
            tiktokPromoCooldown: 4, 
            tiktokPromoIntensity: intensity 
        } : s));
        setPromotingSong(null);
    };

    const handlePostVideo = (caption: string, image: string) => {
        const baseViews = Math.floor(followers * (0.05 + Math.random() * 0.15));
        const newPost: SocialPost = {
            id: `tt_${Date.now()}`,
            type: 'Manual',
            caption,
            image,
            date: new Date(gameDate),
            likes: Math.floor(baseViews * 0.1),
            views: baseViews,
            platform: 'TikTok',
            comments: Math.floor(baseViews * 0.005)
        };
        setPlayer(prev => prev ? { ...prev, socialPosts: [newPost, ...(prev.socialPosts || [])] } : null);
        setIsCreatingVideo(false);
    };

    return (
        <div className="bg-[#010101] text-white min-h-screen fixed inset-0 z-[60] flex flex-col font-sans overflow-hidden">
            {promotingSong && <PromoteModal song={promotingSong} player={player} onClose={() => setPromotingSong(null)} onPromote={handlePromote} />}
            {isCreatingVideo && <CreateVideoModal onClose={() => setIsCreatingVideo(false)} onPost={handlePostVideo} />}

            <div className="sticky top-0 bg-[#010101]/95 backdrop-blur-md z-20 flex justify-between items-center px-4 py-4 border-b border-white/5">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                </button>
                <div className="font-black flex items-center gap-1 text-lg italic tracking-tighter uppercase text-white">TikTok Central</div>
                <button onClick={() => setIsCreatingVideo(true)} className="bg-white text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">Post</button>
            </div>

            <main className="flex-1 overflow-y-auto scrollbar-hide pb-20">
                <div className="flex flex-col items-center pt-8 pb-6 bg-[#010101]">
                    <div className="relative">
                        <img src={player.aboutImage || `https://source.unsplash.com/200x200/?portrait`} className="w-24 h-24 rounded-full object-cover border-2 border-[#FE2C55]/50 shadow-[0_0_20px_rgba(254,44,85,0.3)]" />
                        <div className="absolute -bottom-1 -right-1 bg-[#FE2C55] rounded-full p-1 border-2 border-black">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                        </div>
                    </div>
                    <h1 className="mt-4 font-black text-lg tracking-widest uppercase text-white">@{player.artistName.toLowerCase().replace(/\s/g, '_')}</h1>
                    <div className="flex gap-8 mt-6 text-center">
                        <div><p className="font-black text-lg italic leading-none text-white">{formatNumber(followers)}</p><p className="text-gray-500 text-[9px] font-black uppercase mt-1 tracking-widest">Followers</p></div>
                        <div><p className="font-black text-lg italic leading-none text-white">{formatNumber(tiktokPosts.reduce((acc, p) => acc + p.likes, 0))}</p><p className="text-gray-500 text-[9px] font-black uppercase mt-1 tracking-widest">Likes</p></div>
                    </div>
                </div>
                
                <div className="flex border-b border-white/5 sticky top-0 bg-[#010101] z-10">
                    <button onClick={() => setActiveTab('videos')} className={`flex-1 py-4 font-black text-[10px] uppercase tracking-[0.2em] transition-all ${activeTab === 'videos' ? 'border-b-2 border-white text-white' : 'text-gray-600'}`}>Bytes</button>
                    <button onClick={() => setActiveTab('music')} className={`flex-1 py-4 font-black text-[10px] uppercase tracking-[0.2em] transition-all ${activeTab === 'music' ? 'border-b-2 border-white text-white' : 'text-gray-600'}`}>Ad Suite</button>
                </div>

                {activeTab === 'videos' ? (
                    <div className="p-1 grid grid-cols-3 gap-1">
                        {tiktokPosts.map(post => (
                            <div key={post.id} className="aspect-[3/4] bg-[#111] overflow-hidden relative group">
                                <img src={post.image} className="w-full h-full object-cover opacity-80" />
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
                            <div key={song.id} className="flex justify-between items-center bg-white/5 p-5 rounded-[2.5rem] border border-white/5">
                                <div className="flex items-center gap-4">
                                    <img src={song.coverArt || ''} className="w-16 h-16 rounded-2xl object-cover shadow-xl" />
                                    <div>
                                        <p className="font-black text-sm uppercase italic tracking-tighter text-white">{song.title}</p>
                                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">Growth Sync: {song.pendingTikTokPromo ? 'ACTIVE' : 'READY'}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => !song.pendingTikTokPromo && setPromotingSong(song)} 
                                    disabled={song.pendingTikTokPromo}
                                    className={`px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${song.pendingTikTokPromo ? 'bg-white/10 text-[#FE2C55]' : 'bg-[#FE2C55] text-white shadow-lg active:scale-95'}`}
                                >
                                    {song.pendingTikTokPromo ? `RUNNING (${song.tiktokPromoCooldown}W)` : 'Promote'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default TikTokScreen;
