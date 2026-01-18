
import React, { useState, useMemo } from 'react';
import type { Song, Album, Player, MerchItem, Certification } from '../types';
import CertificationDetails from '../components/CertificationDetails';

const formatMetric = (num: number) => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
};

const ReleaseAssetEditor: React.FC<{ 
    title: string; 
    coverArt: string | null; 
    nameChanged?: boolean; 
    onUpdate: (data: { title?: string, coverArt?: string }) => void;
}> = ({ title, coverArt, nameChanged, onUpdate }) => {
    const [newTitle, setNewTitle] = useState(title);

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onUpdate({ coverArt: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/5 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Identity Sync</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-[8px] font-black text-gray-600 uppercase mb-2">Display Name (One-time change only)</label>
                    <div className="flex gap-2">
                        <input 
                            value={newTitle} 
                            onChange={e => setNewTitle(e.target.value)} 
                            disabled={nameChanged}
                            className="flex-grow bg-white/5 border border-white/10 p-3 rounded-xl text-white font-bold disabled:opacity-30 outline-none focus:border-red-600"
                        />
                        {!nameChanged && (
                            <button 
                                onClick={() => { if(confirm("This is a one-time change. Proceed?")) onUpdate({ title: newTitle }); }}
                                className="bg-red-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase"
                            >
                                Sync
                            </button>
                        )}
                    </div>
                </div>
                <div>
                    <label className="block text-[8px] font-black text-gray-600 uppercase mb-2">Visual ID Override</label>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-black border border-white/10">
                            <img src={coverArt || ''} className="w-full h-full object-cover" />
                        </div>
                        <label className="flex-grow">
                            <div className="bg-white/5 border border-white/10 p-3 rounded-xl text-center text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-white/10 transition-all">Upload New Asset</div>
                            <input type="file" onChange={handleCoverChange} className="hidden" accept="image/*" />
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AlbumManagementModal: React.FC<{
    album: Album;
    onClose: () => void;
    onUpdate: (updatedAlbum: Album) => void;
    player: Player;
}> = ({ album, onClose, onUpdate, player }) => {
    const [view, setView] = useState<'overview' | 'assets'>('overview');

    return (
        <div className="fixed inset-0 bg-black/98 z-[200] flex items-center justify-center p-0 sm:p-4 backdrop-blur-3xl" onClick={onClose}>
            <div className="bg-[#0a0a0c] w-full max-w-2xl sm:rounded-[3rem] border-x sm:border border-white/5 overflow-hidden animate-fade-in-up flex flex-col h-full sm:h-auto max-h-[95vh]" onClick={e => e.stopPropagation()}>
                <header className="p-8 border-b border-white/5 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <img src={album.coverArt || ''} className="w-16 h-16 rounded-xl object-cover border border-white/10 shadow-2xl" />
                        <div>
                            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">{album.title}</h2>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Project Management Terminal</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-colors">✕</button>
                </header>

                <div className="flex bg-[#12121e] border-b border-white/5 flex-shrink-0">
                    <button onClick={() => setView('overview')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${view === 'overview' ? 'text-red-500 border-b-2 border-red-500 bg-white/5' : 'text-gray-500'}`}>Overview</button>
                    <button onClick={() => setView('assets')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${view === 'assets' ? 'text-red-500 border-b-2 border-red-500 bg-white/5' : 'text-gray-500'}`}>Assets</button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 scrollbar-hide">
                    {view === 'overview' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/5"><p className="text-[8px] font-black text-gray-500 uppercase mb-1">Lifetime Units</p><p className="text-2xl font-black text-white italic">{album.unitSales.toLocaleString()}</p></div>
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/5"><p className="text-[8px] font-black text-gray-500 uppercase mb-1">Chart Rank</p><p className="text-2xl font-black text-red-500 italic">#{album.charts?.billboard200?.position || 'N/A'}</p></div>
                        </div>
                    )}
                    {view === 'assets' && (
                        <ReleaseAssetEditor 
                            title={album.title} 
                            coverArt={album.coverArt} 
                            nameChanged={album.nameChanged} 
                            onUpdate={(data) => onUpdate({ 
                                ...album, 
                                ...(data.title && { title: data.title, nameChanged: true }),
                                ...(data.coverArt && { coverArt: data.coverArt })
                            })} 
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

const SongManagementModal: React.FC<{ 
    song: Song; 
    onClose: () => void; 
    onUpdate: (updatedSong: Song) => void; 
    player: Player;
    setPlayer: any;
}> = ({ song, onClose, onUpdate, player, setPlayer }) => {
    const [view, setView] = useState<'overview' | 'management' | 'assets' | 'demographics' | 'mv_setup'>('overview');
    
    const [mvThumbnail, setMvThumbnail] = useState<string | null>(null);
    const [mvThumbnailPreview, setMvThumbnailPreview] = useState<string | null>(null);
    const [useVevo, setUseVevo] = useState(true);

    const handleDiscount = (price: number) => {
        onUpdate({ ...song, price });
        alert(`Song price updated to $${price}`);
    };

    const handleCreateMV = () => {
        const budget = 50000;
        if (player.money < budget) return alert("You need $50,000 for a professional video budget.");
        
        setPlayer((p: Player) => ({ 
            ...p, 
            money: p.money - budget,
            reputation: p.reputation + (useVevo ? 5 : 2)
        }));

        onUpdate({ 
            ...song, 
            hasMusicVideo: true, 
            videoQuality: player.reputation + 15, 
            videoReleaseDate: new Date(),
            youtubeThumbnail: mvThumbnail || song.coverArt,
            vevoWatermark: useVevo
        });
        
        alert(`Music video production completed! Uploaded to YouTube and Rapple Music${useVevo ? ' with VEVO branding' : ''}.`);
        onClose();
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setMvThumbnail(reader.result as string);
                setMvThumbnailPreview(URL.createObjectURL(file));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/98 z-[200] flex items-center justify-center p-0 sm:p-4 backdrop-blur-3xl" onClick={onClose}>
            <div className="bg-[#0a0a0c] w-full max-w-2xl sm:rounded-[3rem] border-x sm:border border-white/5 overflow-hidden animate-fade-in-up flex flex-col h-full sm:h-auto max-h-[95vh]" onClick={e => e.stopPropagation()}>
                <header className="p-8 border-b border-white/5 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <img src={song.coverArt || ''} className="w-16 h-16 rounded-xl object-cover border border-white/10 shadow-2xl" />
                        <div>
                            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">{song.title}</h2>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{song.genre} • Management Terminal</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-colors">✕</button>
                </header>

                <div className="flex bg-[#12121e] border-b border-white/5 flex-shrink-0 overflow-x-auto no-scrollbar">
                    {['overview', 'management', 'assets', 'demographics'].map(v => (
                        <button 
                            key={v} 
                            onClick={() => setView(v as any)} 
                            className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all min-w-[120px] ${view === v ? 'text-red-500 border-b-2 border-red-500 bg-white/5' : 'text-gray-500'}`}
                        >
                            {v}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 scrollbar-hide">
                    {view === 'overview' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/5"><p className="text-[8px] font-black text-gray-500 uppercase mb-1">Lifetime Streams</p><p className="text-2xl font-black text-white italic">{(song.rapifyStreams + song.rappleStreams).toLocaleString()}</p></div>
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/5"><p className="text-[8px] font-black text-gray-500 uppercase mb-1">Chart Rank</p><p className="text-2xl font-black text-red-500 italic">#{song.charts.hot100?.position || 'N/A'}</p></div>
                            </div>
                        </div>
                    )}

                    {view === 'management' && (
                        <div className="space-y-6">
                            <button 
                                onClick={() => setView('mv_setup')} 
                                disabled={song.hasMusicVideo} 
                                className="w-full bg-red-600 text-white p-6 rounded-[2rem] font-black uppercase tracking-widest flex justify-between items-center disabled:opacity-30 group"
                            >
                                <div className="text-left">
                                    <p className="leading-none mb-1">Create Professional MV</p>
                                    <p className="text-[8px] opacity-70 group-hover:opacity-100 transition-opacity">Deploy to YouTube & Rapple</p>
                                </div>
                                <span className="text-lg italic tracking-tighter">$50,000</span>
                            </button>
                            <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 space-y-4">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Price Management</p>
                                <div className="flex gap-2">
                                    {[0.99, 0.69, 0.29].map(p => (
                                        <button key={p} onClick={() => handleDiscount(p)} className={`flex-1 py-3 rounded-xl font-black transition-all ${song.price === p ? 'bg-white text-black scale-105 shadow-xl' : 'bg-white/5 text-white border border-white/10'}`}>${p}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {view === 'assets' && (
                        <ReleaseAssetEditor 
                            title={song.title} 
                            coverArt={song.coverArt} 
                            nameChanged={song.nameChanged} 
                            onUpdate={(data) => onUpdate({ 
                                ...song, 
                                ...(data.title && { title: data.title, nameChanged: true }),
                                ...(data.coverArt && { coverArt: data.coverArt })
                            })} 
                        />
                    )}

                    {view === 'mv_setup' && (
                        <div className="space-y-8 animate-fade-in">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">Visual Deployment</h3>
                                <button onClick={() => setView('management')} className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest">Back</button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-4">Official Thumbnail</label>
                                    <div className="aspect-video bg-white/5 rounded-2xl border border-white/10 overflow-hidden relative group cursor-pointer">
                                        {mvThumbnailPreview ? (
                                            <img src={mvThumbnailPreview} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-700">
                                                <svg className="w-10 h-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth={1.5}/></svg>
                                                <span className="text-[8px] font-black uppercase tracking-widest">Upload Keyframe</span>
                                            </div>
                                        )}
                                        <input type="file" onChange={handleThumbnailChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                        <label className="flex items-center justify-between cursor-pointer group">
                                            <div>
                                                <p className="text-sm font-black italic uppercase text-white group-hover:text-red-500 transition-colors">VEVO Branding</p>
                                                <p className="text-[8px] text-gray-500 uppercase mt-1">Add official watermark (+Reputation)</p>
                                            </div>
                                            <input 
                                                type="checkbox" 
                                                checked={useVevo} 
                                                onChange={e => setUseVevo(e.target.checked)} 
                                                className="w-5 h-5 accent-red-600 rounded-lg" 
                                            />
                                        </label>
                                    </div>

                                    <div className="p-6 bg-black/40 rounded-2xl border border-white/5">
                                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3">Deployment Logic</p>
                                        <ul className="text-[10px] text-gray-400 space-y-2 font-medium">
                                            <li className="flex gap-2"><span className="text-red-600">•</span> Auto-sync to Official Artist Channel</li>
                                            <li className="flex gap-2"><span className="text-red-600">•</span> Visual Asset index for Rapple Music</li>
                                            <li className="flex gap-2"><span className="text-red-600">•</span> Global consumption multiplier enabled</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={handleCreateMV}
                                className="w-full bg-white text-black font-black py-5 rounded-full text-xs uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all"
                            >
                                Finalize & Launch MV
                            </button>
                        </div>
                    )}

                    {view === 'demographics' && (
                        <div className="space-y-4">
                             {['USA', 'Canada', 'UK', 'Global'].map(loc => (
                                <div key={loc} className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                                    <span className="text-sm font-black text-white uppercase italic">{loc}</span>
                                    <span className="text-sm font-mono text-gray-400">{Math.floor(Math.random() * 40 + 10)}% Affinity</span>
                                </div>
                             ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
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
    return { total: album.pureSales + streamUnits + teaUnits };
};

const CertificationBadge: React.FC<{ certs: Certification[]; onClick: () => void }> = ({ certs, onClick }) => {
    if (!certs || certs.length === 0) return null;
    const highest = [...certs].sort((a,b) => b.units - a.units)[0];
    const label = highest.level === 'Multi-Platinum' ? `${highest.multiplier}X PLATINUM` : highest.level.toUpperCase();
    return (
        <button onClick={(e) => { e.stopPropagation(); onClick(); }} className="px-3 py-1 rounded-full border text-[8px] font-black tracking-widest text-red-500 border-red-500/20 bg-red-500/5">
            {label}
        </button>
    );
};

const CatalogueScreen: React.FC<{ 
    player: Player, songs: Song[], setSongs: any, albums: Album[], setAlbums: any, setPlayer: any, gameDate: Date, merch: MerchItem[], setMerch: any 
}> = ({ player, songs, setSongs, albums, setAlbums, setPlayer }) => {
    const [view, setView] = useState<'albums' | 'songs' | 'certs'>('albums');
    const [certItem, setCertItem] = useState<Song | Album | null>(null);
    const [managingSong, setManagingSong] = useState<Song | null>(null);
    const [managingAlbum, setManagingAlbum] = useState<Album | null>(null);

    const releasedSongs = useMemo(() => songs.filter(s => s.isReleased).sort((a,b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()), [songs]);

    return (
        <div className="p-4 sm:p-12 space-y-12 pb-40 max-w-7xl mx-auto font-sans min-h-screen bg-[#07070B] overflow-x-hidden">
            {certItem && <CertificationDetails item={certItem} onClose={() => setCertItem(null)} />}
            {managingSong && (
                <SongManagementModal 
                    song={managingSong} 
                    onClose={() => setManagingSong(null)} 
                    onUpdate={(s) => setSongs(songs.map(prev => prev.id === s.id ? s : prev))} 
                    player={player} 
                    setPlayer={setPlayer} 
                />
            )}
            {managingAlbum && (
                <AlbumManagementModal
                    album={managingAlbum}
                    onClose={() => setManagingAlbum(null)}
                    onUpdate={(a) => setAlbums(albums.map(prev => prev.id === a.id ? a : prev))}
                    player={player}
                />
            )}

            <header className="border-b-8 border-white pb-12">
                <h1 className="text-6xl sm:text-8xl md:text-[10rem] font-black tracking-tighter uppercase leading-none italic drop-shadow-2xl text-white">CATALOG</h1>
            </header>

            <div className="flex bg-[#12121e] rounded-[2rem] p-1 gap-1 border border-white/5 overflow-x-auto no-scrollbar">
                {['albums', 'songs', 'certs'].map((v) => (
                    <button key={v} onClick={() => setView(v as any)} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all min-w-[100px] ${view === v ? 'bg-white text-black shadow-xl' : 'text-gray-600'}`}>{v}</button>
                ))}
            </div>

            {view === 'albums' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {albums.map(album => {
                        const units = calculateAlbumUnits(album, songs);
                        return (
                            <div key={album.id} onClick={() => setManagingAlbum(album)} className="bg-[#1e1e2d] rounded-[3.5rem] border overflow-hidden shadow-2xl border-white/5 hover:border-red-600/30 transition-all cursor-pointer">
                                <div className="aspect-square relative bg-gray-900 overflow-hidden">
                                    <img src={album.coverArt || ''} className="w-full h-full object-cover opacity-70" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e2d] to-transparent"></div>
                                    <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                                        <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white leading-none">{album.title}</h3>
                                        <CertificationBadge certs={album.certifications} onClick={() => setCertItem(album)} />
                                    </div>
                                </div>
                                <div className="p-8 flex justify-between items-center bg-black/20">
                                    <div className="flex flex-col"><p className="text-[10px] font-black text-white tracking-tighter">{formatMetric(units.total)}</p><p className="text-[7px] font-bold text-gray-500 uppercase">Total Units</p></div>
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
                        return (
                            <div key={song.id} onClick={() => setManagingSong(song)} className="bg-[#1e1e2d] p-6 rounded-[2.5rem] border border-white/5 flex items-center justify-between group shadow-xl hover:border-red-600/20 cursor-pointer transition-all">
                                <div className="flex items-center gap-6 min-w-0">
                                    <img src={song.coverArt || ''} className="w-16 h-16 rounded-2xl object-cover" />
                                    <div className="min-w-0">
                                        <h3 className="text-xl font-black uppercase italic tracking-tighter text-white truncate">{song.title}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            {song.hasMusicVideo && <span className="bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-sm">MV</span>}
                                            <CertificationBadge certs={song.certifications} onClick={() => setCertItem(song)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end"><p className="text-xl font-black italic text-red-600 leading-none">{formatMetric(units)}</p><p className="text-[8px] text-gray-600 font-black uppercase mt-1">Units</p></div>
                            </div>
                        )
                    })}
                </div>
            )}

            {view === 'certs' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...albums, ...releasedSongs].filter(i => i.certifications.length > 0).map(item => (
                        <div key={item.id} onClick={() => setCertItem(item)} className="bg-[#1e1e2d] p-6 rounded-[2.5rem] border border-white/5 flex items-center justify-between group shadow-xl hover:border-red-600/20 cursor-pointer transition-all">
                             <div className="flex items-center gap-4">
                                <img src={item.coverArt || ''} className="w-16 h-16 rounded-2xl object-cover" />
                                <div>
                                    <h3 className="text-xl font-black uppercase italic tracking-tighter text-white truncate max-w-[150px]">{item.title}</h3>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase">{item.artistName}</p>
                                </div>
                             </div>
                             <CertificationBadge certs={item.certifications} onClick={() => setCertItem(item)} />
                        </div>
                    ))}
                    {[...albums, ...releasedSongs].filter(i => i.certifications.length > 0).length === 0 && (
                        <div className="col-span-full py-32 text-center opacity-30">
                            <p className="font-black uppercase tracking-[0.5em] text-xs italic text-white">No industry certifications authenticated.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CatalogueScreen;
