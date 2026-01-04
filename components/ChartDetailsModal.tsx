
import React from 'react';
import type { Song, Album } from '../types';

interface ChartDetailsModalProps {
    item: Song | Album;
    onClose: () => void;
}

const formatMetric = (num: number | undefined) => {
    if (num === undefined || num === null) return '0';
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toLocaleString();
};

const StatRow: React.FC<{ label: string; value: string; subtext: string; colorClass?: string }> = ({ label, value, subtext, colorClass = "text-white" }) => (
    <div className="flex items-center justify-between py-5 border-b border-white/5 last:border-0 group">
        <div className="flex flex-col">
            <span className="text-[9px] uppercase font-black tracking-[0.2em] text-gray-500 mb-1 group-hover:text-gray-300 transition-colors">{label}</span>
            <span className="text-[11px] text-gray-600 font-medium italic">{subtext}</span>
        </div>
        <div className="text-right">
            <span className={`text-3xl font-black italic tracking-tighter tabular-nums ${colorClass}`}>{value}</span>
        </div>
    </div>
);

const ChartDetailsModal: React.FC<ChartDetailsModalProps> = ({ item, onClose }) => {
    const isSong = 'weeklyStreams' in item;
    
    // Determine the relevant peak/weeks based on the most active chart record
    const historyEntries = Object.entries(item.chartHistory || {});
    const primaryChart = historyEntries.find(([id]) => id === 'hot100') || 
                         historyEntries.find(([id]) => id === 'billboard200') ||
                         historyEntries.find(([id]) => id === 'bubblingUnderHot50') ||
                         [null, null];
    
    const history = primaryChart[1] as any;

    return (
        <div className="fixed inset-0 bg-[#07070B]/98 z-[200] flex items-center justify-center p-4 backdrop-blur-3xl" onClick={onClose}>
            <div 
                className="bg-[#0a0a0c] w-full max-w-lg rounded-[3rem] shadow-[0_0_80px_rgba(220,38,38,0.15)] border border-white/5 overflow-hidden animate-fade-in-up" 
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="relative h-56 flex items-end p-8 overflow-hidden">
                    <div 
                        className="absolute inset-0 bg-cover bg-center opacity-30 blur-2xl scale-125"
                        style={{ backgroundImage: `url(${item.coverArt || "https://thumbs2.imgbox.com/9f/53/9siJdUVY_t.jpg"})` }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/60 to-transparent"></div>
                    
                    <div className="relative flex items-center gap-6 w-full">
                        <div className="w-28 h-28 rounded-2xl shadow-2xl border border-white/10 overflow-hidden flex-shrink-0 -rotate-2">
                             <img 
                                src={item.coverArt || "https://thumbs2.imgbox.com/9f/53/9siJdUVY_t.jpg"} 
                                alt={item.title} 
                                className="w-full h-full object-cover" 
                            />
                        </div>
                        <div className="min-w-0 flex-grow pb-2">
                            <p className="text-[#fa2d48] font-black uppercase tracking-[0.5em] text-[8px] mb-2">Performance Audit</p>
                            <h2 className="text-4xl font-black text-white italic leading-none tracking-tighter truncate mb-1">{item.title}</h2>
                            <p className="text-gray-400 font-bold text-lg uppercase tracking-widest truncate">{item.artistName}</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 pt-0">
                    <div className="mb-10">
                        <div className="flex items-center gap-4 mb-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 whitespace-nowrap">Market Intelligence</h3>
                            <div className="h-[1px] flex-grow bg-white/5"></div>
                        </div>

                        <div className="bg-white/5 rounded-[2rem] p-6 border border-white/5 shadow-inner">
                            {isSong ? (
                                <>
                                    <StatRow 
                                        label="Consumption" 
                                        value={`${formatMetric((item as Song).weeklyStreams)}`} 
                                        subtext="Weekly Platform Data Stream"
                                        colorClass="text-white"
                                    />
                                    <StatRow 
                                        label="Digital Sales" 
                                        value={`${formatMetric((item as Song).weeklySales)}`} 
                                        subtext="Weekly Direct Single Purchases"
                                        colorClass="text-[#fa2d48]"
                                    />
                                </>
                            ) : (
                                <>
                                    <StatRow 
                                        label="Aggregate Units" 
                                        value={`${formatMetric((item as Album).weeklyUnitSales)}`} 
                                        subtext="Weekly Total Consumption Units"
                                        colorClass="text-white"
                                    />
                                    <StatRow 
                                        label="Pure Sales" 
                                        value={`${formatMetric((item as Album).weeklyPureSales || 0)}`} 
                                        subtext="Weekly Direct Project Sales"
                                        colorClass="text-[#fa2d48]"
                                    />
                                </>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-[#12121e] rounded-[1.5rem] p-5 border border-white/5 text-center">
                            <p className="text-[8px] uppercase font-black tracking-widest text-gray-500 mb-1">Peak Position</p>
                            <p className="text-3xl font-black italic tracking-tighter text-white tabular-nums">#{history?.peakPosition || '-'}</p>
                        </div>
                        <div className="bg-[#12121e] rounded-[1.5rem] p-5 border border-white/5 text-center">
                            <p className="text-[8px] uppercase font-black tracking-widest text-gray-500 mb-1">Chart Tenure</p>
                            <p className="text-3xl font-black italic tracking-tighter text-white tabular-nums">{history?.weeksOnChart || '1'} <span className="text-sm uppercase tracking-widest not-italic text-gray-600">Wks</span></p>
                        </div>
                    </div>

                    <button 
                        onClick={onClose}
                        className="w-full bg-white text-black font-black py-5 rounded-2xl uppercase tracking-[0.3em] text-[10px] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl"
                    >
                        Close Audit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChartDetailsModal;
