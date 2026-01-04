
import React, { useState, useMemo } from 'react';
import type { ChartData, ChartEntry, Song, Album, Player, ChartId } from '../types';
import { CHART_NAMES } from '../constants';
import ChartDetailsModal from '../components/ChartDetailsModal';

interface ChartsScreenProps {
    player: Player;
    chartsData: ChartData;
    gameDate: Date;
    allSongs: Song[];
    allAlbums: Album[];
}

type TabType = 'hot100' | 'bubbling' | 'albums200' | 'history';
type HistoryFilter = 'all' | 'hot100' | 'bubbling' | 'albums200';

const ChartsScreen: React.FC<ChartsScreenProps> = ({ player, chartsData, gameDate, allSongs, allAlbums }) => {
    const [activeTab, setActiveTab] = useState<TabType>('hot100');
    const [historyFilter, setHistoryFilter] = useState<HistoryFilter>('all');
    const [viewingItemId, setViewingItemId] = useState<string | null>(null);

    const playerItemsOnCharts = useMemo(() => {
        // Collect all songs and albums that have ranked at least once
        const items = [...allSongs, ...allAlbums].filter(item => 
            item.artistName === player.artistName && 
            item.chartHistory && 
            Object.keys(item.chartHistory).length > 0
        );
        // Sort by most recent peak date if available, otherwise by title
        return items.sort((a,b) => {
            const historyA = Object.values(a.chartHistory || {}) as Array<{ peakDate: Date }>;
            const historyB = Object.values(b.chartHistory || {}) as Array<{ peakDate: Date }>;
            const dateA = historyA[0]?.peakDate || 0;
            const dateB = historyB[0]?.peakDate || 0;
            return new Date(dateB).getTime() - new Date(dateA).getTime();
        });
    }, [allSongs, allAlbums, player.artistName]);

    const activeChartEntries = useMemo(() => {
        if (activeTab === 'hot100') return chartsData.hot100 || [];
        if (activeTab === 'bubbling') return chartsData.bubblingUnderHot50 || [];
        if (activeTab === 'albums200') return chartsData.billboard200 || [];
        return [];
    }, [activeTab, chartsData]);

    const filteredHistory = useMemo(() => {
        if (historyFilter === 'all') return playerItemsOnCharts;
        return playerItemsOnCharts.filter(item => {
            const historyKeys = Object.keys(item.chartHistory);
            if (historyFilter === 'hot100') return historyKeys.includes('hot100');
            if (historyFilter === 'bubbling') return historyKeys.includes('bubblingUnderHot50');
            if (historyFilter === 'albums200') return historyKeys.includes('billboard200');
            return true;
        });
    }, [playerItemsOnCharts, historyFilter]);

    const stats = useMemo(() => {
        let ones = 0;
        let tens = 0;
        playerItemsOnCharts.forEach(item => {
            const histories = Object.entries(item.chartHistory);
            const overallPeak = Math.min(...histories.map(([_, h]: [any, any]) => h.peakPosition));
            if (overallPeak === 1) ones++;
            if (overallPeak <= 10) tens++;
        });
        return { ones, tens, total: playerItemsOnCharts.length };
    }, [playerItemsOnCharts]);

    const viewingItem = viewingItemId 
        ? [...allSongs, ...allAlbums].find(item => item.id === viewingItemId)
        : null;

    const TabButton: React.FC<{ id: TabType; label: string }> = ({ id, label }) => (
        <button 
            onClick={() => setActiveTab(id)}
            className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 ${activeTab === id ? 'text-white border-red-600' : 'text-gray-600 border-transparent hover:text-gray-400'}`}
        >
            {label}
        </button>
    );

    const ChartRow: React.FC<{ entry: ChartEntry; index: number }> = ({ entry, index }) => {
        const isPlayer = entry.artist === player.artistName;
        return (
            <div 
                onClick={() => setViewingItemId(entry.itemId)}
                className="group flex items-center gap-4 py-4 px-2 border-b border-white/5 hover:bg-white/5 transition-all cursor-pointer relative overflow-hidden"
            >
                {isPlayer && <div className="absolute inset-y-0 left-0 w-1 bg-red-600"></div>}
                <div className="w-12 text-center flex-shrink-0">
                    <span className={`text-2xl font-black italic tracking-tighter ${index < 3 ? 'text-white' : 'text-gray-800 group-hover:text-gray-600'}`}>
                        {entry.position}
                    </span>
                </div>
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-900 flex-shrink-0 shadow-2xl border border-white/5">
                    <img src={entry.coverArt || "https://thumbs2.imgbox.com/53/9d/TPyXhrMO_t.jpg"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={entry.title} />
                </div>
                <div className="flex-grow min-w-0">
                    <h3 className={`font-black text-base md:text-lg uppercase italic tracking-tighter truncate ${isPlayer ? 'text-red-500' : 'text-white'}`}>{entry.title}</h3>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate mt-0.5">{entry.artist}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        {entry.status === 'up' && <span className="text-green-500 text-[10px] font-black">▲</span>}
                        {entry.status === 'down' && <span className="text-red-500 text-[10px] font-black">▼</span>}
                        {entry.status === 'new' && <span className="bg-blue-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-lg">NEW</span>}
                        <span className="text-[10px] font-black text-gray-600 uppercase tabular-nums">Peak {entry.peakPosition}</span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">{entry.weeksOnChart} WKS</span>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#07070B] relative overflow-hidden font-sans">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-600/5 blur-[120px] rounded-full animate-pulse pointer-events-none"></div>
            
            {viewingItem && <ChartDetailsModal item={viewingItem} onClose={() => setViewingItemId(null)} />}

            <div className="relative z-10 p-4 sm:p-12 space-y-10 pb-40 max-w-5xl mx-auto">
                <header className="border-b-4 sm:border-b-8 border-white pb-8 sm:pb-12">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></div>
                        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.6em] text-red-500">Official Industry Rankings</p>
                    </div>
                    <h1 className="text-6xl sm:text-[10rem] font-black tracking-tighter uppercase leading-none italic drop-shadow-2xl text-white">CHARTS</h1>
                    <p className="text-gray-500 font-bold text-xs sm:text-sm tracking-widest uppercase mt-4">Week of {gameDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </header>

                <div className="sticky top-0 z-20 bg-[#07070B]/95 backdrop-blur-xl border-b border-white/5 -mx-4 px-4">
                    <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                        <TabButton id="hot100" label="Hot 100" />
                        <TabButton id="bubbling" label="Bubbling" />
                        <TabButton id="albums200" label="B200" />
                        <TabButton id="history" label="My History" />
                    </div>
                </div>

                <main className="animate-fade-in">
                    {activeTab === 'history' ? (
                        <div className="space-y-12">
                            <section className="flex flex-col md:flex-row gap-8 items-center bg-white/5 p-8 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                                     <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                </div>
                                <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-2 border-red-600/30 flex-shrink-0 shadow-2xl rotate-2">
                                    <img src={player.aboutImage || `https://source.unsplash.com/400x400/?${encodeURIComponent(player.artistName + ' portrait')}`} className="w-full h-full object-cover" alt={player.artistName} />
                                </div>
                                <div className="flex-grow text-center md:text-left space-y-6">
                                    <div>
                                        <p className="text-[#fa2d48] font-black uppercase tracking-[0.3em] text-[10px] mb-1">Career Catalog Resume</p>
                                        <h2 className="text-4xl sm:text-5xl font-black italic uppercase tracking-tighter leading-none text-white">{player.artistName}</h2>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        <div className="text-center md:text-left">
                                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Total Hits</p>
                                            <p className="text-3xl font-black italic text-white leading-none tabular-nums">{stats.total}</p>
                                        </div>
                                        <div className="text-center md:text-left">
                                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Top 10s</p>
                                            <p className="text-3xl font-black italic text-red-500 leading-none tabular-nums">{stats.tens}</p>
                                        </div>
                                        <div className="text-center md:text-left">
                                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Number 1s</p>
                                            <p className="text-3xl font-black italic text-white leading-none tabular-nums">{stats.ones}</p>
                                        </div>
                                        <div className="text-center md:text-left">
                                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Consecutive</p>
                                            <p className="text-3xl font-black italic text-red-500 leading-none tabular-nums">{player.chartStreak}</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Historical Breakdown</h3>
                                    <div className="h-[1px] flex-grow bg-white/5"></div>
                                    <div className="flex bg-[#12121e] rounded-full p-1 border border-white/10">
                                        {(['all', 'hot100', 'bubbling', 'albums200'] as HistoryFilter[]).map(f => (
                                            <button 
                                                key={f} 
                                                onClick={() => setHistoryFilter(f)}
                                                className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${historyFilter === f ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                                            >
                                                {f === 'albums200' ? 'B200' : f}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {filteredHistory.length > 0 ? filteredHistory.map((item) => (
                                        <div 
                                            key={item.id} 
                                            onClick={() => setViewingItemId(item.id)}
                                            className="flex items-center gap-5 p-5 bg-[#12121e] rounded-[2.5rem] border border-white/5 hover:border-red-600/30 transition-all cursor-pointer group shadow-xl"
                                        >
                                            <img src={item.coverArt || "https://thumbs2.imgbox.com/53/9d/TPyXhrMO_t.jpg"} className="w-16 h-16 rounded-2xl object-cover shadow-lg group-hover:scale-105 transition-transform" alt={item.title} />
                                            <div className="flex-grow min-w-0">
                                                <h4 className="font-black text-lg uppercase italic text-white tracking-tighter leading-none truncate group-hover:text-red-500 transition-colors">{item.title}</h4>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {Object.entries(item.chartHistory).map(([cId, history]: [string, any]) => (
                                                        <span key={cId} className={`text-[8px] font-black uppercase whitespace-nowrap bg-black/40 px-2.5 py-1 rounded-full border ${history.peakPosition === 1 ? 'border-red-500/50 text-red-500' : 'border-white/5 text-gray-500'}`}>
                                                            {cId === 'hot100' ? 'H100' : cId === 'billboard200' ? 'B200' : 'BU50'} • Peak #{history.peakPosition} • {history.weeksOnChart} WKS
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 text-gray-800 group-hover:text-white group-hover:translate-x-1 transition-all"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                                        </div>
                                    )) : (
                                        <div className="col-span-2 py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
                                            <p className="text-gray-700 font-black uppercase italic tracking-widest text-xs">No entries found. Release music to build your history.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {activeChartEntries.length > 0 ? activeChartEntries.map((entry, i) => (
                                <ChartRow key={`${entry.itemId}-${i}`} entry={entry} index={i} />
                            )) : (
                                <div className="py-32 text-center">
                                    <p className="text-gray-700 font-black uppercase italic tracking-[0.5em] text-xs">Fetching Realtime Data Stream...</p>
                                </div>
                            )}
                        </div>
                    )}
                </main>

                <footer className="py-20 text-center opacity-10">
                    <p className="text-[9px] font-black uppercase tracking-[0.8em]">Proprietary Data Ingest • RED MIC OPERATIONS</p>
                </footer>
            </div>
        </div>
    );
};

export default ChartsScreen;
