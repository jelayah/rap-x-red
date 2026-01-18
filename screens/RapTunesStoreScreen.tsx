
import React, { useState, useMemo } from 'react';
import type { Player, Song, Album } from '../types';
import RapTunesItemDetailScreen from './RapTunesItemDetailScreen';

interface RapTunesStoreScreenProps {
  player: Player;
  songs: Song[];
  albums: Album[];
  npcSongs: Song[];
  npcAlbums: Album[];
  onBack: () => void;
}

type StoreTab = 'Featured' | 'Charts' | 'Search';

const RapTunesStoreScreen: React.FC<RapTunesStoreScreenProps> = ({ player, songs, albums, npcSongs, npcAlbums, onBack }) => {
    const [activeTab, setActiveTab] = useState<StoreTab>('Featured');
    const [chartType, setChartType] = useState<'Singles' | 'Albums'>('Singles');
    const [viewingItem, setViewingItem] = useState<Song | Album | null>(null);

    const allReleasedSongs = useMemo(() => {
        const s = Array.isArray(songs) ? songs : [];
        const ns = Array.isArray(npcSongs) ? npcSongs : [];
        return [...s, ...ns].filter(item => item.isReleased);
    }, [songs, npcSongs]);

    const allReleasedAlbums = useMemo(() => {
        const a = Array.isArray(albums) ? albums : [];
        const na = Array.isArray(npcAlbums) ? npcAlbums : [];
        return [...a, ...na].filter(item => item.releaseDate); // Fixed: Filter by releaseDate presence
    }, [albums, npcAlbums]);

    const recentReleases = useMemo(() => {
        return [...allReleasedAlbums, ...allReleasedSongs.filter(s => !s.albumId)]
            .sort((a, b) => new Date(b.releaseDate!).getTime() - new Date(a.releaseDate!).getTime())
            .slice(0, 18);
    }, [allReleasedSongs, allReleasedAlbums]);

    const topSingles = useMemo(() => {
        return [...allReleasedSongs]
            .sort((a, b) => b.weeklySales - a.weeklySales)
            .slice(0, 50);
    }, [allReleasedSongs]);

    const topAlbums = useMemo(() => {
        return [...allReleasedAlbums]
            .sort((a, b) => (b.weeklyPureSales || 0) - (a.weeklyPureSales || 0))
            .slice(0, 50);
    }, [allReleasedAlbums]);

    if (viewingItem) {
        return <RapTunesItemDetailScreen item={viewingItem} player={player} onBack={() => setViewingItem(null)} />;
    }

    return (
        <div className="bg-[#000000] text-white min-h-screen font-sans absolute inset-0 z-20 flex flex-col">
            {/* Ultra-Modern iOS Glass Header */}
            <header className="sticky top-0 bg-black/60 backdrop-blur-2xl z-30 border-b border-white/5 px-4 pt-4 pb-3">
                <div className="flex items-center justify-between mb-4">
                    <button onClick={onBack} className="text-[#007AFF] font-bold text-sm flex items-center gap-1 group">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 group-hover:-translate-x-1 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                        Hub
                    </button>
                    <div className="flex items-center gap-1">
                        <span className="font-black tracking-tighter text-xl italic uppercase">RapTunes</span>
                    </div>
                    <div className="w-12"></div>
                </div>

                <div className="flex bg-[#1c1c1e]/80 rounded-xl p-1 max-w-md mx-auto w-full border border-white/5">
                    {(['Featured', 'Charts', 'Search'] as StoreTab[]).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-1.5 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === tab ? 'bg-[#3a3a3c] text-white shadow-xl' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </header>

            <main className="flex-1 overflow-y-auto pb-32 scrollbar-hide">
                {activeTab === 'Featured' && (
                    <div className="animate-fade-in space-y-12 py-6">
                        {/* High-Fidelity Hero Slider Mockup */}
                        <section className="px-4">
                            <div className="relative aspect-[4/5] sm:aspect-[21/9] rounded-[2rem] overflow-hidden cursor-pointer group shadow-2xl" onClick={() => recentReleases[0] && setViewingItem(recentReleases[0])}>
                                <img src={recentReleases[0]?.coverArt || ''} className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110" alt="Hero" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                                <div className="absolute bottom-10 left-10 right-10">
                                    <span className="bg-[#007AFF] text-white text-[8px] font-black uppercase tracking-[0.4em] px-3 py-1 rounded-full mb-4 inline-block">Global Spotlight</span>
                                    <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-2 drop-shadow-2xl">{recentReleases[0]?.title}</h2>
                                    <p className="text-gray-300 font-bold text-xl md:text-2xl uppercase tracking-widest opacity-80">{recentReleases[0]?.artistName}</p>
                                </div>
                            </div>
                        </section>

                        {/* Store Collections */}
                        <section className="px-6">
                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <p className="text-[#007AFF] text-[10px] font-black uppercase tracking-widest mb-1">New & Notable</p>
                                    <h2 className="text-3xl font-black tracking-tighter italic uppercase">Fresh Droplets</h2>
                                </div>
                                <button className="text-[#007AFF] text-sm font-black uppercase tracking-widest hover:underline">See All</button>
                            </div>
                            <div className="flex overflow-x-auto gap-5 pb-6 scrollbar-hide -mx-6 px-6">
                                {recentReleases.slice(1, 10).map(item => (
                                    <div key={item.id} className="cursor-pointer group flex-shrink-0 w-36 sm:w-44" onClick={() => setViewingItem(item)}>
                                        <div className="relative aspect-square mb-3 shadow-xl rounded-2xl overflow-hidden border border-white/5">
                                            <img src={item.coverArt || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.title} />
                                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                                        </div>
                                        <p className="text-sm font-black uppercase italic truncate tracking-tight">{item.title}</p>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase truncate mt-0.5">{item.artistName}</p>
                                        <p className="text-[#007AFF] text-[11px] font-black mt-2">${item.price.toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Essential Hits Mini Section */}
                        <section className="px-6 pb-10">
                            <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-6 border-l-4 border-[#007AFF] pl-4">Essential Hits</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {topSingles.slice(0, 6).map((song, i) => (
                                    <div key={song.id} className="flex items-center gap-4 bg-[#1c1c1e]/40 p-4 rounded-2xl border border-white/5 cursor-pointer hover:bg-[#2c2c2e] transition-all group" onClick={() => setViewingItem(song)}>
                                        <span className="text-gray-700 font-black text-2xl w-8 text-center group-hover:text-[#007AFF] transition-colors">{i + 1}</span>
                                        <img src={song.coverArt || ''} className="w-16 h-16 rounded-xl object-cover shadow-lg border border-white/10" alt={song.title} />
                                        <div className="flex-grow min-w-0">
                                            <p className="font-black text-sm truncate uppercase italic tracking-tight">{song.title}</p>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase truncate tracking-tighter mt-1">{song.artistName}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className="bg-[#007AFF] text-white text-[9px] font-black px-4 py-1.5 rounded-full shadow-lg group-hover:scale-105 transition-all">
                                                ${song.price.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'Charts' && (
                    <div className="animate-fade-in py-4">
                        <div className="px-6 sticky top-0 bg-black z-20 pb-6 border-b border-white/5">
                            <div className="flex bg-[#1c1c1e] rounded-xl p-1 border border-white/5 mb-6 shadow-2xl max-w-sm mx-auto">
                                <button 
                                    onClick={() => setChartType('Singles')} 
                                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${chartType === 'Singles' ? 'bg-white text-black shadow-xl' : 'text-gray-500'}`}
                                >
                                    Top Singles
                                </button>
                                <button 
                                    onClick={() => setChartType('Albums')} 
                                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${chartType === 'Albums' ? 'bg-white text-black shadow-xl' : 'text-gray-500'}`}
                                >
                                    Top Albums
                                </button>
                            </div>
                            <div className="text-center">
                                <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-1">Official Top 50</h2>
                                <p className="text-[10px] text-[#007AFF] font-black uppercase tracking-[0.5em] opacity-80">Store Consumption Index</p>
                            </div>
                        </div>

                        <div className="px-2 space-y-1 mt-4 max-w-2xl mx-auto">
                            {(chartType === 'Singles' ? topSingles : topAlbums).map((item, i) => (
                                <div key={item.id} className="flex items-center gap-5 py-4 px-4 hover:bg-white/5 transition-all cursor-pointer group rounded-[1.5rem]" onClick={() => setViewingItem(item)}>
                                    <div className="w-8 text-center flex-shrink-0">
                                        <span className={`text-2xl font-black italic ${i < 3 ? 'text-[#007AFF]' : 'text-gray-800 group-hover:text-gray-400'}`}>{i + 1}</span>
                                    </div>
                                    <img src={item.coverArt || ''} className="w-16 h-16 rounded-xl object-cover shadow-2xl border border-white/5 group-hover:scale-105 transition-transform duration-500" alt={item.title} />
                                    <div className="flex-grow min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-black text-base truncate leading-none uppercase italic tracking-tight">{item.title}</p>
                                            {'version' in item && (item as Song).version === 'Explicit' && <span className="bg-[#3a3a3c] text-[#9ca3af] text-[8px] px-1 rounded-sm font-black">E</span>}
                                        </div>
                                        <p className="text-[11px] text-gray-500 font-bold uppercase truncate tracking-tighter mt-1.5">{item.artistName}</p>
                                        <div className="mt-2 flex items-center gap-1.5">
                                            <span className="text-[9px] bg-[#007AFF]/10 text-[#007AFF] px-2 py-0.5 rounded font-black tracking-widest uppercase">
                                                {chartType === 'Singles' ? (item as Song).weeklySales.toLocaleString() : (item as Album).weeklyPureSales?.toLocaleString() || '0'} Sold
                                            </span>
                                        </div>
                                    </div>
                                    <button className="bg-[#1c1c1e] text-[#007AFF] group-hover:bg-[#007AFF] group-hover:text-white transition-all text-[11px] font-black px-5 py-2.5 rounded-xl border border-[#007AFF]/20 shadow-lg">
                                        ${item.price.toFixed(2)}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'Search' && (
                    <div className="p-8 animate-fade-in max-w-xl mx-auto w-full">
                        <div className="bg-[#1c1c1e]/80 backdrop-blur-md rounded-[1.5rem] p-5 flex items-center gap-4 mb-10 shadow-2xl border border-white/5">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6 text-[#007AFF]"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                            <input type="text" placeholder="Explore Millions of Tracks" className="bg-transparent border-none outline-none text-lg w-full placeholder:text-gray-700 font-black italic uppercase tracking-tighter" />
                        </div>
                        
                        <div className="space-y-10">
                            <section>
                                <h3 className="text-gray-500 font-black text-[10px] uppercase tracking-[0.4em] mb-6 border-b border-white/5 pb-3">Popular Genres</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Hip-Hop/Rap', 'R&B/Soul', 'Alternative', 'Indie', 'Pop', 'Dance'].map(g => (
                                        <button key={g} className="bg-[#1c1c1e] p-5 rounded-2xl text-left font-black uppercase italic tracking-tighter border border-white/5 hover:bg-[#2c2c2e] transition-colors">{g}</button>
                                    ))}
                                </div>
                            </section>
                            
                            <section>
                                <h3 className="text-gray-500 font-black text-[10px] uppercase tracking-[0.4em] mb-6 border-b border-white/5 pb-3">Trending Searches</h3>
                                <div className="space-y-4">
                                    {['New Music Friday', 'Top 50 Albums', 'Summer Hits 2025', 'Underground Vault'].map(q => (
                                        <div key={q} className="text-white text-lg font-black tracking-tight border-b border-white/5 pb-4 cursor-pointer hover:text-[#007AFF] transition-colors flex justify-between items-center group">
                                            {q}
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default RapTunesStoreScreen;
