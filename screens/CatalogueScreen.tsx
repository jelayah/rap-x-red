
import React, { useState, useMemo } from 'react';
import type { Song, Album, Player, SocialPost, MerchItem, MerchType, Certification } from '../types';
import DiscountModal from '../components/DiscountModal';
import AlbumDiscountModal from '../components/AlbumDiscountModal';
import CertificationDetails from '../components/CertificationDetails';

const formatMetric = (num: number) => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
};

const STREAM_UNIT_DIVISOR = 1500; 

const calculateSongUnits = (song: Song) => {
    const totalStreams = song.rapifyStreams + song.rappleStreams;
    const streamUnits = Math.floor(totalStreams / STREAM_UNIT_DIVISOR);
    return song.sales + streamUnits;
};

const calculateAlbumUnits = (album: Album, songs: Song[]) => {
    const albumSongs = songs.filter(s => s.albumId === album.id);
    const totalStreams = albumSongs.reduce((acc, s) => acc + s.rapifyStreams + s.rappleStreams, 0);
    const streamUnits = Math.floor(totalStreams / STREAM_UNIT_DIVISOR);
    const teaUnits = Math.floor(albumSongs.reduce((acc, s) => acc + s.sales, 0) / 10);
    const totalUnits = album.pureSales + streamUnits + teaUnits;
    
    return {
        total: totalUnits,
        pure: album.pureSales,
        sea: streamUnits,
        tea: teaUnits
    };
};

const MetricIcon: React.FC<{ icon: React.ReactNode; value: number | string; label: string }> = ({ icon, value, label }) => (
    <div className="flex flex-col items-center gap-1 group/icon">
        <div className="text-gray-500 group-hover/icon:text-white transition-colors">{icon}</div>
        <span className="text-[10px] font-black text-white tabular-nums leading-none">{value}</span>
        <span className="text-[7px] font-bold text-gray-600 uppercase tracking-tighter">{label}</span>
    </div>
);

const VideoMakerModal: React.FC<{ 
    song: Song; 
    player: Player; 
    onClose: () => void; 
    onFilm: (budget: number, useVevo: boolean, thumbnail: string | null) => void 
}> = ({ song, player, onClose, onFilm }) => {
    const [budget, setBudget] = useState(15000);
    const [useVevo, setUseVevo] = useState(false);
    const [thumbnail, setThumbnail] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnail(reader.result as string);
                setPreview(URL.createObjectURL(file));
            };
            reader.readAsDataURL(file);
        }
    };

    const totalCost = budget + (useVevo ? 2500 : 0);

    return (
        <div className="fixed inset-0 bg-black/95 z-[150] flex items-center justify-center p-4 backdrop-blur-2xl">
            <div className="bg-[#0a0a0c] w-full max-w-xl rounded-[3rem] border border-white/10 p-8 shadow-2xl animate-fade-in-up">
                <header className="mb-10 text-center">
                    <p className="text-red-500 font-black uppercase tracking-[0.4em] text-[8px] mb-2">Video Production Protocol</p>
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">Director's Cut</h2>
                    <p className="text-gray-500 text-[10px] font-bold uppercase mt-2">"{song.title}"</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-4">Production Budget</label>
                            <input type="range" min="5000" max="250000" step="5000" value={budget} onChange={e => setBudget(Number(e.target.value))} className="w-full accent-red-600 h-1 bg-white/10 rounded-full appearance-none mb-2" />
                            <p className="text-white font-black italic text-xl">${budget.toLocaleString()}</p>
                        </div>

                        <button 
                            onClick={() => setUseVevo(!useVevo)}
                            className={`w-full p-6 rounded-[2rem] border text-left transition-all flex justify-between items-center ${useVevo ? 'bg-white border-white text-black' : 'bg-white/5 border-white/5 text-gray-500'}`}
                        >
                            <div>
                                <p className="font-black text-sm uppercase italic">Vevo Network</p>
                                <p className="text-[9px] font-bold uppercase mt-1">Overlay Protocol (+ $2,500)</p>
                            </div>
                            {useVevo && <span className="bg-red-600 text-white text-[8px] font-black px-2 py-1 rounded shadow-lg">ACTIVE</span>}
                        </button>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Thumbnail Asset</label>
                        <div className="relative aspect-video bg-white/5 rounded-2xl overflow-hidden border border-white/10 group shadow-inner">
                            {preview ? (
                                <img src={preview} className="w-full h-full object-cover" />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-700">
                                    <svg className="w-8 h-8 mb-2 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth={1.5}/></svg>
                                    <span className="text-[8px] font-black uppercase tracking-widest">Select HQ Still</span>
                                </div>
                            )}
                            <input type="file" accept="image/*" onChange={handleThumbnailChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                            
                            {useVevo && (
                                <div className="absolute bottom-2 left-2 bg-white/10 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] font-black italic tracking-tighter text-white/50 border border-white/5 uppercase">vevo</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/10 text-center mb-8">
                     <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2 leading-none">Net Authorization Capital</p>
                     <p className="text-4xl font-black text-white italic tracking-tighter">${totalCost.toLocaleString()}</p>
                </div>

                <div className="flex gap-4">
                    <button onClick={onClose} className="flex-1 py-4 text-[10px] font-black uppercase text-gray-700">Abort</button>
                    <button 
                        disabled={player.money < totalCost}
                        onClick={() => onFilm(budget, useVevo, thumbnail)}
                        className="flex-[2] bg-white text-black font-black py-4 rounded-full text-[10px] uppercase tracking-widest shadow-xl disabled:opacity-30"
                    >
                        Authorize Production
                    </button>
                </div>
            </div>
        </div>
    );
};

const CertificationBadge: React.FC<{ certs: Certification[]; onClick: () => void }> = ({ certs, onClick }) => {
    if (!certs || certs.length === 0) return null;
    const highest = [...certs].sort((a,b) => b.units - a.units)[0];
    const label = highest.level === 'Multi-Platinum' ? `${highest.multiplier}X PLATINUM` : highest.level.toUpperCase();
    
    const colorClass = highest.level === 'Gold' ? 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5' : 
                      highest.level === 'Platinum' ? 'text-gray-300 border-gray-300/20 bg-gray-300/5' :
                      highest.level === 'Diamond' ? 'text-cyan-400 border-cyan-400/20 bg-cyan-400/5 shadow-[0_0_15px_rgba(34,211,238,0.2)]' :
                      'text-indigo-400 border-indigo-400/20 bg-indigo-400/5';

    return (
        <button 
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className={`px-3 py-1 rounded-full border text-[8px] font-black tracking-widest transition-all hover:scale-105 active:scale-95 ${colorClass}`}
        >
            {label}
        </button>
    );
};

const AssetIntelligenceModal: React.FC<{ item: Song | Album; songs: Song[]; onClose: () => void }> = ({ item, songs, onClose }) => {
    const isSong = 'quality' in item;
    const displayStats = useMemo(() => {
        if (isSong) {
            const song = item as Song;
            return { rapify: song.rapifyStreams, rapple: song.rappleStreams, units: calculateSongUnits(song) };
        } else {
            const album = item as Album;
            const albumUnits = calculateAlbumUnits(album, songs);
            const totalStreams = songs.filter(s => s.albumId === album.id).reduce((acc, s) => acc + s.rapifyStreams + s.rappleStreams, 0);
            return { rapify: Math.floor(totalStreams * 0.6), rapple: Math.floor(totalStreams * 0.4), units: albumUnits.total };
        }
    }, [item, isSong, songs]);

    return (
        <div className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-4 backdrop-blur-3xl" onClick={onClose}>
            <div className="bg-[#0a0a0c] w-full max-w-sm rounded-[3rem] border border-white/10 p-8 shadow-2xl animate-fade-in-up" onClick={e => e.stopPropagation()}>
                <header className="mb-8 text-center">
                    <p className="text-[#fa2d48] font-black uppercase tracking-[0.5em] text-[8px] mb-2">Internal Performance Audit</p>
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white truncate px-2">{item.title}</h2>
                </header>
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
                            <p className="text-[8px] font-black text-gray-500 uppercase mb-1">Rapify Hub</p>
                            <p className="text-xl font-black italic text-white">{formatMetric(displayStats.rapify)}</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
                            <p className="text-[8px] font-black text-gray-500 uppercase mb-1">Rapple Cloud</p>
                            <p className="text-xl font-black italic text-white">{formatMetric(displayStats.rapple)}</p>
                        </div>
                    </div>
                    <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/5 space-y-4 shadow-inner">
                        <div className="flex justify-between items-end border-b border-white/5 pb-3">
                            <div><p className="text-[9px] font-black text-gray-500 uppercase mb-1">Total Unit Index</p><p className="text-4xl font-black italic text-white leading-none">{formatMetric(displayStats.units)}</p></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-1">
                            <div><p className="text-[8px] font-black text-gray-500 uppercase">Retail Price</p><p className="text-sm font-black text-green-400">${item.price.toFixed(2)}</p></div>
                            <div><p className="text-[8px] font-black text-gray-500 uppercase">Catalog Rank</p><p className="text-sm font-black text-white">#{(item as any).globalRank || '-'}</p></div>
                        </div>
                    </div>
                </div>
                <button onClick={onClose} className="w-full mt-8 bg-white text-black font-black py-4 rounded-full text-[10px] uppercase tracking-widest shadow-xl">Close Intelligence</button>
            </div>
        </div>
    );
};

const SongDashboard: React.FC<{
    song: Song;
    player: Player;
    onBack: () => void;
    setPlayer: any;
    setSongs: any;
    gameDate: Date;
    onOpenCert: (item: Song) => void;
    onFilmVideo: (song: Song) => void;
}> = ({ song, player, onBack, setPlayer, setSongs, gameDate, onOpenCert, onFilmVideo }) => {
    const [isDiscounting, setIsDiscounting] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    
    return (
        <div className="fixed inset-0 bg-[#0a0a0c] z-[90] flex flex-col font-sans overflow-hidden">
            <header className="p-4 border-b border-white/5 flex items-center justify-between bg-black/50 backdrop-blur-xl">
                <button onClick={onBack} className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                    Catalogue
                </button>
                <div className="flex gap-4">
                     {!song.hasMusicVideo && <button onClick={() => onFilmVideo(song)} className="text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-400 transition-colors">Production</button>}
                     <button onClick={() => setShowInfo(true)} className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-colors">Audit</button>
                     <button onClick={() => setIsDiscounting(true)} className="text-[10px] font-black uppercase tracking-widest text-yellow-500 hover:text-yellow-400 transition-colors">Repricing</button>
                </div>
            </header>

            {showInfo && <AssetIntelligenceModal item={song} songs={[song]} onClose={() => setShowInfo(false)} />}
            
            <main className="flex-1 overflow-y-auto p-6 md:p-12 space-y-12 pb-32 scrollbar-hide">
                <section className="flex flex-col md:flex-row gap-12 items-start max-w-6xl mx-auto">
                    <div className="w-full md:w-96 flex-shrink-0">
                        <div className="relative group">
                            <img src={song.coverArt || ''} className="w-full aspect-square rounded-[3rem] shadow-2xl object-cover border border-white/5" />
                            {song.hasMusicVideo && (
                                <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] font-black text-white/50 border border-white/5 uppercase italic tracking-tighter">vevo</div>
                            )}
                        </div>
                        <div className="mt-8 bg-white/5 p-8 rounded-[2.5rem] border border-white/5 shadow-xl grid grid-cols-4 gap-2">
                             <MetricIcon label="Units" value={formatMetric(calculateSongUnits(song))} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path d="M15 9l-6 6M9 9l6 6" /></svg>} />
                             <MetricIcon label="Rapify" value={formatMetric(song.rapifyStreams)} icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.5 17.3c-.2.3-.7.4-1 .2-2.8-1.7-6.2-2-10.3-.9-.4.1-.8-.1-.9-.5s.1-.8.5-.9c4.5-1.3 8.3-.9 11.4 1 .3.2.4.7.3 1.1z"/></svg>} />
                             <MetricIcon label="Rapple" value={formatMetric(song.rappleStreams)} icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16"><path d="M9 13c0 1.105-1.12 2-2.5 2S4 14.105 4 13s1.12-2 2.5-2 2.5.895 2.5 2z"/><path d="M9 3v10H8V3h1z"/></svg>} />
                             <MetricIcon label="Peak" value={`#${song.chartHistory?.hot100?.peakPosition || '-'}`} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>} />
                        </div>
                        <div className="mt-4 flex justify-center"><CertificationBadge certs={song.certifications} onClick={() => onOpenCert(song)} /></div>
                    </div>
                    <div className="flex-grow space-y-10 min-w-0 w-full">
                        <div>
                            <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-none mb-2 break-words">{song.title}</h1>
                            <p className="text-2xl text-gray-500 font-bold uppercase tracking-[0.2em]">Single • {player.artistName}</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

const CatalogueScreen: React.FC<{ 
    player: Player, songs: Song[], setSongs: any, albums: Album[], setAlbums: any, setPlayer: any, gameDate: Date, merch: MerchItem[], setMerch: any 
}> = ({ player, songs, setSongs, albums, setAlbums, setPlayer, gameDate, merch, setMerch }) => {
    const [view, setView] = useState<'albums' | 'songs' | 'certs'>('albums');
    const [viewingAlbumDashboard, setViewingAlbumDashboard] = useState<Album | null>(null);
    const [viewingSongDashboard, setViewingSongDashboard] = useState<Song | null>(null);
    const [certItem, setCertItem] = useState<Song | Album | null>(null);
    const [filmingVideo, setFilmingVideo] = useState<Song | null>(null);

    const releasedSongs = useMemo(() => songs.filter(s => s.isReleased).sort((a,b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()), [songs]);

    const handleFilmVideo = (budget: number, useVevo: boolean, thumbnail: string | null) => {
        if (!filmingVideo) return;
        const cost = budget + (useVevo ? 2500 : 0);
        setSongs((prev: Song[]) => prev.map(s => s.id === filmingVideo.id ? { 
            ...s, hasMusicVideo: true, vevoWatermark: useVevo, videoBudget: budget, 
            videoQuality: Math.min(100, s.quality + Math.floor(budget / 1000)),
            videoReleaseDate: new Date(gameDate), youtubeThumbnail: thumbnail
        } : s));
        setPlayer((p: Player) => p ? { ...p, money: p.money - cost } : null);
        setFilmingVideo(null);
    };

    if (viewingAlbumDashboard) return <AlbumDashboard album={viewingAlbumDashboard} player={player} onBack={() => setViewingAlbumDashboard(null)} gameDate={gameDate} songs={songs} onOpenCert={setCertItem} onDiscount={() => {}} />;
    if (viewingSongDashboard) return <SongDashboard song={viewingSongDashboard} player={player} onBack={() => setViewingSongDashboard(null)} setPlayer={setPlayer} setSongs={setSongs} gameDate={gameDate} onOpenCert={setCertItem} onFilmVideo={(s) => setFilmingVideo(s)} />;

    return (
        <div className="p-4 sm:p-12 space-y-12 pb-40 max-w-7xl mx-auto font-sans min-h-screen bg-[#07070B]">
            {certItem && <CertificationDetails item={certItem} onClose={() => setCertItem(null)} />}
            {filmingVideo && <VideoMakerModal song={filmingVideo} player={player} onClose={() => setFilmingVideo(null)} onFilm={handleFilmVideo} />}

            <header className="border-b-8 border-white pb-12">
                <h1 className="text-8xl md:text-[10rem] font-black tracking-tighter uppercase leading-none italic drop-shadow-2xl text-white">CATALOG</h1>
                <p className="text-brand-text-muted text-xs font-black uppercase tracking-[0.5em] mt-8 border-l-4 border-red-600 pl-4">Asset Management & Era Control</p>
            </header>

            <div className="flex bg-[#12121e] rounded-[2rem] p-1 gap-1 border border-white/5">
                {['albums', 'songs', 'certs'].map((v) => (
                    <button key={v} onClick={() => setView(v as any)} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all ${view === v ? 'bg-white text-black shadow-xl' : 'text-gray-600'}`}>{v}</button>
                ))}
            </div>

            {view === 'albums' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {albums.map(album => {
                        const units = calculateAlbumUnits(album, songs);
                        return (
                            <div key={album.id} onClick={() => setViewingAlbumDashboard(album)} className="bg-[#1e1e2d] rounded-[3.5rem] border overflow-hidden group cursor-pointer hover:-translate-y-2 transition-all shadow-2xl border-white/5 hover:border-brand-accent-start/40">
                                <div className="aspect-square relative bg-gray-900 overflow-hidden">
                                    <img src={album.coverArt || ''} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-1000" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e2d] to-transparent"></div>
                                    <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                                        <div>
                                            <span className="text-white text-[8px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-3 inline-block shadow-xl bg-red-600">{album.type}</span>
                                            <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white leading-none">{album.title}</h3>
                                        </div>
                                        <CertificationBadge certs={album.certifications} onClick={() => setCertItem(album)} />
                                    </div>
                                </div>
                                <div className="p-8 flex justify-between items-center bg-black/20">
                                    <div className="flex gap-4">
                                        <div className="flex flex-col"><p className="text-[10px] font-black text-white tracking-tighter">{formatMetric(units.total)}</p><p className="text-[7px] font-bold text-gray-500 uppercase">Units</p></div>
                                    </div>
                                    <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">{album.songs.length} Tracks</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {view === 'songs' && (
                <div className="space-y-4">
                    {releasedSongs.map(song => {
                        const units = calculateSongUnits(song);
                        const aggregateStreams = song.rapifyStreams + song.rappleStreams;
                        return (
                            <div key={song.id} onClick={() => setViewingSongDashboard(song)} className="bg-[#1e1e2d] p-6 rounded-[2.5rem] border border-white/5 flex items-center justify-between group shadow-xl hover:border-red-600/20 cursor-pointer transition-all">
                                <div className="flex items-center gap-6 min-w-0">
                                    <div className="relative">
                                        <img src={song.coverArt || ''} className="w-16 h-16 rounded-2xl object-cover shadow-lg group-hover:scale-105 transition-transform" />
                                        {song.hasMusicVideo && <div className="absolute bottom-1 left-1 bg-white/10 backdrop-blur-md px-1 py-0.5 rounded-[4px] text-[6px] font-black text-white/50 border border-white/5 uppercase italic tracking-tighter">vevo</div>}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-xl font-black uppercase italic tracking-tighter text-white truncate">{song.title}</h3>
                                        <div className="flex items-center gap-3 mt-1">
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Released {new Date(song.releaseDate).toLocaleDateString()}</p>
                                            <CertificationBadge certs={song.certifications} onClick={() => setCertItem(song)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8 flex-shrink-0">
                                    <div className="flex flex-col items-end"><p className="text-xl font-black italic text-white leading-none">{formatMetric(aggregateStreams)}</p><p className="text-[8px] text-gray-600 font-black uppercase tracking-tighter mt-1">Plays</p></div>
                                    <div className="flex flex-col items-end"><p className="text-xl font-black italic text-red-600 leading-none">{formatMetric(units)}</p><p className="text-[8px] text-gray-600 font-black uppercase tracking-tighter mt-1">Units</p></div>
                                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} className="w-5 h-5"><path d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {view === 'certs' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
                    {[...albums, ...songs].filter(i => i.certifications?.length > 0).map(item => (
                        <div key={item.id} onClick={() => setCertItem(item)} className="bg-[#12121e] p-8 rounded-[3rem] border border-white/5 flex items-center gap-8 shadow-xl hover:border-white/20 transition-all cursor-pointer group">
                            <img src={item.coverArt || ''} className="w-24 h-24 rounded-[2rem] object-cover group-hover:rotate-6 transition-transform" />
                            <div><h3 className="text-2xl font-black italic uppercase tracking-tighter text-white leading-none mb-3">{item.title}</h3><CertificationBadge certs={item.certifications} onClick={() => setCertItem(item)} /></div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const AlbumDashboard: React.FC<{ 
    album: Album, player: Player, onBack: () => void, gameDate: Date, songs: Song[], onOpenCert: (item: Album) => void; onDiscount: (album: Album, newPrice: number) => void;
}> = ({ album, player, onBack, gameDate, songs, onOpenCert, onDiscount }) => {
    const [showInfo, setShowInfo] = useState(false);
    const [isDiscounting, setIsDiscounting] = useState(false);
    const units = calculateAlbumUnits(album, songs);

    return (
        <div className="fixed inset-0 bg-[#0a0a0c] z-[90] flex flex-col font-sans overflow-hidden">
             {isDiscounting && <AlbumDiscountModal album={album} onClose={() => setIsDiscounting(false)} onDiscount={onDiscount} />}
             <header className="p-4 border-b border-white/5 flex items-center justify-between bg-black/50 backdrop-blur-xl">
                <button onClick={onBack} className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>Catalogue</button>
                <div className="flex gap-4">
                     <button onClick={() => setShowInfo(true)} className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-colors">Audit</button>
                     <button onClick={() => setIsDiscounting(true)} className="text-[10px] font-black uppercase tracking-widest text-yellow-500 hover:text-yellow-400 transition-colors">Strategy</button>
                </div>
            </header>
            {showInfo && <AssetIntelligenceModal item={album} songs={songs} onClose={() => setShowInfo(false)} />}
            <main className="flex-1 overflow-y-auto p-6 md:p-12 space-y-12 pb-32 scrollbar-hide">
                <section className="flex flex-col md:flex-row gap-12 items-start max-w-6xl mx-auto">
                    <div className="w-full md:w-96 flex-shrink-0">
                        <img src={album.coverArt || ''} className="w-full aspect-square rounded-[3rem] shadow-2xl object-cover border border-white/5" />
                        <div className="mt-8 bg-white/5 p-8 rounded-[2.5rem] border border-white/5 shadow-xl grid grid-cols-4 gap-2">
                             <MetricIcon label="Units" value={formatMetric(units.total)} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path d="M15 9l-6 6M9 9l6 6" /></svg>} />
                             <MetricIcon label="Peak" value={`#${album.chartHistory?.billboard200?.peakPosition || '-'}`} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>} />
                        </div>
                        <div className="mt-4 flex justify-center"><CertificationBadge certs={album.certifications} onClick={() => onOpenCert(album)} /></div>
                    </div>
                    <div className="flex-grow space-y-10 min-w-0 w-full">
                        <div>
                            <h1 className="text-6xl md:text-[8rem] font-black italic uppercase tracking-tighter leading-none mb-2 break-words">{album.title}</h1>
                            <p className="text-2xl text-gray-500 font-bold uppercase tracking-[0.2em]">{album.type} • {player.artistName}</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default CatalogueScreen;
