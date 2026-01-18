
import React, { useState, useMemo } from 'react';
import type { ChartData, ChartEntry, Song, Album, Player, ChartId } from '../types';
import ChartDetailsModal from '../components/ChartDetailsModal';

interface ChartsScreenProps {
    player: Player;
    chartsData: ChartData;
    gameDate: Date;
    allSongs: Song[];
    allAlbums: Album[];
}

type TabType = 'hot100' | 'bubbling' | 'albums200' | 'history';

const formatCompact = (num: number | undefined | null) => {
    const val = typeof num === 'number' ? num : 0;
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
    return Math.floor(val).toLocaleString();
};

const HistoryStatBox: React.FC<{ label: string; value: number; sub: string }> = ({ label, value, sub }) => (
    <div className="bg-[#0a0a0c] border border-white/10 p-4 sm:p-6 flex flex-col items-center justify-center text-center flex-1 min-w-[80px]">
        <p className="text-white font-black text-4xl sm:text-6xl italic tracking-tighter leading-none mb-4">{value}</p>
        <div className="w-full h-[1px] bg-white/10 mb-4"></div>
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-tight">{sub}</p>
    </div>
);

const ChartsScreen: React.FC<ChartsScreenProps> = ({ player, chartsData, gameDate, allSongs, allAlbums }) => {
    const [activeTab, setActiveTab] = useState<TabType>('hot100');
    const [historyChartId, setHistoryChartId] = useState<ChartId>('hot100');
    const [viewingItemId, setViewingItemId] = useState<string | null>(null);

    const activeChartEntries = useMemo(() => {
        if (activeTab === 'hot100') return chartsData.hot100 || [];
        if (activeTab === 'bubbling') return chartsData.bubblingUnderHot50 || [];
        if (activeTab === 'albums200') return chartsData.billboard200 || [];
        return [];
    }, [activeTab, chartsData]);

    const playerHistoryItems = useMemo(() => {
        return [...allSongs, ...allAlbums].filter(item => 
            item.artistName === player.artistName && 
            item.chartHistory && 
            item.chartHistory[historyChartId]
        ).sort((a,b) => {
            const dateA = a.chartHistory[historyChartId]?.peakDate || new Date(0);
            const dateB = b.chartHistory[historyChartId]?.peakDate || new Date(0);
            return new Date(dateB).getTime() - new Date(dateA).getTime();
        });
    }, [allSongs, allAlbums, player.artistName, historyChartId]);

    const stats = useMemo(() => {
        const items = [...allSongs, ...allAlbums].filter(i => i.artistName === player.artistName);
        const hot100Items = items.filter(i => i.chartHistory?.hot100);
        return {
            no1Hits: items.filter(i => Object.values(i.chartHistory).some((h: any) => h.peakPosition === 1)).length,
            totalSongs: hot100Items.length,
            top10Hits: hot100Items.filter(i => (i.chartHistory?.hot100?.peakPosition || 11) <= 10).length
        };
    }, [allSongs, allAlbums, player.artistName]);

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
                className="group flex items-center gap-4 py-4 px-2 border-b border-white/5 hover:bg-white/5 transition-all cursor-pointer relative"
            >
                <div className="w-10 text-center flex-shrink-0">
                    <span className={`text-2xl font-black italic tracking-tighter ${index < 3 ? 'text-white' : 'text-gray-800 group-hover:text-gray-600'}`}>
                        {entry.position}
                    </span>
                </div>
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-900 flex-shrink-0 shadow-2xl border border-white/5">
                    <img src={entry.coverArt || "https://thumbs2.imgbox.com/53/9d/TPyXhrMO_t.jpg"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={entry.title} />
                </div>
                <div className="flex-grow min-w-0">
                    <h3 className={`font-black text-base md:text-lg uppercase italic tracking-tighter truncate ${isPlayer ? 'text-red-500' : 'text-white'}`}>{entry.title}</h3>
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest truncate">{entry.artist}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0 pr-2">
                    <div className="flex items-center gap-2">
                        {entry.status === 'up' && <span className="text-green-500 text-[10px] font-black">▲</span>}
                        {entry.status === 'down' && <span className="text-red-500 text-[10px] font-black">▼</span>}
                        <span className="text-[9px] font-black text-gray-600 uppercase tabular-nums">Peak {entry.peakPosition}</span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter tabular-nums">{entry.weeksOnChart} WKS</span>
                </div>
            </div>
        );
    };

    const viewingItem = viewingItemId ? [...allSongs, ...allAlbums].find(item => item.id === viewingItemId) : null;

    return (
        <div className="min-h-screen bg-[#07070B] relative overflow-hidden font-sans">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-600/5 blur-[120px] rounded-full animate-pulse pointer-events-none"></div>
            
            {viewingItem && <ChartDetailsModal item={viewingItem} onClose={() => setViewingItemId(null)} />}

            <div className="relative z-10 p-4 sm:p-12 space-y-10 pb-40 max-w-6xl mx-auto">
                <header className="border-b-4 sm:border-b-8 border-white pb-8 sm:pb-12">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></div>
                        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.6em] text-red-500">Official Industry Rankings</p>
                    </div>
                    <h1 className="text-6xl sm:text-[10rem] font-black tracking-tighter uppercase leading-none italic drop-shadow-2xl text-white">CHARTS</h1>
                </header>

                <div className="sticky top-0 z-20 bg-[#07070B]/95 backdrop-blur-xl border-b border-white/5 -mx-4 px-4">
                    <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                        <TabButton id="hot100" label="Hot 100" />
                        <TabButton id="bubbling" label="Bubbling 50" />
                        <TabButton id="albums200" label="B200" />
                        <TabButton id="history" label="Archives" />
                    </div>
                </div>

                <main className="animate-fade-in">
                    {activeTab === 'history' ? (
                        <div className="space-y-12">
                            {/* Dashboard Row */}
                            <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                                <div className="bg-[#fa2d48] rounded-sm p-4 w-full sm:w-64 flex flex-col items-center justify-center shadow-xl">
                                    <p className="text-black font-black text-2xl uppercase tracking-tighter leading-none mb-1 text-center">BILLBOARD</p>
                                    <p className="text-black font-black text-2xl uppercase tracking-tighter leading-none text-center">
                                        {historyChartId === 'hot100' ? 'HOT 100™' : historyChartId === 'bubblingUnderHot50' ? 'BUBBLING UNDER HOT 50™' : '200™'}
                                    </p>
                                </div>
                                <div className="flex flex-1 gap-2 overflow-x-auto scrollbar-hide">
                                    <div className="bg-[#0a0a0c] border border-white/10 p-1 w-24 sm:w-32 flex-shrink-0 overflow-hidden">
                                        <img src={player.aboutImage || `https://source.unsplash.com/200x200/?portrait`} className="w-full h-full object-cover" alt="Artist Profile" />
                                    </div>
                                    <HistoryStatBox label="NO. 1 HITS" value={historyChartId === 'billboard200' ? allAlbums.filter(a => a.artistName === player.artistName && a.chartHistory?.billboard200?.peakPosition === 1).length : stats.no1Hits} sub="NO. 1 HITS" />
                                    <HistoryStatBox label="SONGS" value={historyChartId === 'billboard200' ? allAlbums.filter(a => a.artistName === player.artistName).length : stats.totalSongs} sub={historyChartId === 'billboard200' ? "TITLES" : "SONGS"} />
                                    <HistoryStatBox label="TOP 10 HITS" value={historyChartId === 'billboard200' ? allAlbums.filter(a => a.artistName === player.artistName && (a.chartHistory?.billboard200?.peakPosition || 11) <= 10).length : stats.top10Hits} sub="TOP 10 HITS" />
                                </div>
                            </div>

                            {/* Dropdown Selector */}
                            <div className="flex justify-between items-center bg-[#0a0a0c] border border-white/10 px-4 py-2 mt-8">
                                <div className="flex items-center gap-3 border border-[#fa2d48] px-4 py-2 min-w-[250px]">
                                    <select 
                                        value={historyChartId} 
                                        onChange={e => setHistoryChartId(e.target.value as ChartId)}
                                        className="bg-transparent text-[#fa2d48] font-black uppercase tracking-tighter text-sm outline-none cursor-pointer w-full"
                                    >
                                        <option value="hot100" className="bg-[#0a0a0c]">Billboard Hot 100™</option>
                                        <option value="bubblingUnderHot50" className="bg-[#0a0a0c]">Bubbling Under Hot 50™</option>
                                        <option value="billboard200" className="bg-[#0a0a0c]">Billboard 200™</option>
                                    </select>
                                    <svg className="w-4 h-4 text-[#fa2d48]" fill="currentColor" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                                </div>
                                <div className="hidden sm:flex gap-12 text-[10px] font-black uppercase text-[#fa2d48] tracking-tighter">
                                    <span className="w-24 text-center">DEBUT DATE</span>
                                    <span className="w-16 text-center">PEAK POS.</span>
                                    <span className="w-24 text-center">PEAK DATE</span>
                                    <span className="w-20 text-center">WKS. ON CHART</span>
                                </div>
                            </div>

                            {/* History Table */}
                            <div className="space-y-2">
                                {playerHistoryItems.map(item => {
                                    const h = item.chartHistory[historyChartId];
                                    if (!h) return null;
                                    return (
                                        <div key={item.id} className="bg-white p-4 flex flex-col sm:flex-row items-center border-b border-gray-200">
                                            <div className="flex items-center gap-4 flex-1 w-full min-w-0">
                                                <div className="min-w-0">
                                                    <h4 className="text-2xl font-black text-black leading-none mb-1 truncate">{item.title}</h4>
                                                    <p className="text-sm font-medium text-gray-500 truncate">{player.artistName}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 sm:gap-12 mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                                                <div className="w-24 text-center">
                                                    <p className="text-[7px] font-black text-gray-400 uppercase mb-1 sm:hidden">Debut</p>
                                                    <p className="text-xs font-black text-black underline decoration-black/20 underline-offset-4">{new Date(item.releaseDate).toLocaleDateString()}</p>
                                                </div>
                                                <div className="w-16 text-center border-x border-gray-100 px-2 flex flex-col items-center">
                                                    <p className="text-[7px] font-black text-gray-400 uppercase mb-1 sm:hidden">Peak</p>
                                                    <p className="text-3xl font-black text-black leading-none">{h.peakPosition}</p>
                                                    {h.peakPosition === 1 && <p className="text-[7px] font-black bg-[#fa2d48] text-white px-1 mt-1">1 WKS</p>}
                                                </div>
                                                <div className="w-24 text-center">
                                                    <p className="text-[7px] font-black text-gray-400 uppercase mb-1 sm:hidden">Peak Date</p>
                                                    <p className="text-xs font-black text-black underline decoration-black/20 underline-offset-4">{new Date(h.peakDate).toLocaleDateString()}</p>
                                                </div>
                                                <div className="w-20 text-center">
                                                    <p className="text-[7px] font-black text-gray-400 uppercase mb-1 sm:hidden">Weeks</p>
                                                    <p className="text-3xl font-black text-black leading-none tabular-nums">{h.weeksOnChart}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {playerHistoryItems.length === 0 && (
                                    <div className="py-20 text-center opacity-30">
                                        <p className="text-xs font-black uppercase tracking-widest italic text-white">No data records found.</p>
                                    </div>
                                )}
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
            </div>
        </div>
    );
};

export default ChartsScreen;
