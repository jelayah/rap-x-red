
import React, { useMemo } from 'react';
import type { Song } from '../types';

interface StreamSnapshotProps {
    items: Song[]; 
    title: string; 
    artistName: string;
    coverArt: string;
    gameDate: Date;
    onClose?: () => void;
    embedMode?: boolean;
}

const formatPercent = (current: number, last: number) => {
    if (!last || last === 0) return "New";
    const change = ((current - last) / last) * 100;
    return change.toFixed(2);
};

const StreamSnapshot: React.FC<StreamSnapshotProps> = ({ items, title, artistName, coverArt, gameDate, onClose, embedMode = false }) => {
    
    const { rows, totalStreams, totalWeekly, totalChange } = useMemo(() => {
        const sortedItems = [...items].sort((a,b) => b.rapifyStreams - a.rapifyStreams);
        const totalStreamsCalc = sortedItems.reduce((acc, s) => acc + s.rapifyStreams, 0);

        const rowData = sortedItems.map(song => {
            const total = song.rapifyStreams;
            const weekly = Math.floor(song.weeklyStreams * 0.6); 
            const lastWeekly = Math.floor((song.lastWeeklyStreams || 0) * 0.6);
            
            const changeVal = formatPercent(weekly, lastWeekly);
            
            return { 
                ...song, 
                total, 
                weekly, 
                change: changeVal 
            };
        });

        const totalWeeklyCalc = rowData.reduce((acc, r) => acc + r.weekly, 0);
        const totalLastWeeklyCalc = rowData.reduce((acc, r) => acc + Math.floor((r.lastWeeklyStreams || 0) * 0.6), 0);
        const totalChangeCalc = formatPercent(totalWeeklyCalc, totalLastWeeklyCalc);

        return { 
            rows: rowData.slice(0, 8), 
            totalStreams: totalStreamsCalc, 
            totalWeekly: totalWeeklyCalc, 
            totalChange: totalChangeCalc 
        };
    }, [items, gameDate, title]);

    const Content = () => (
        <div 
            className={`w-full ${embedMode ? '' : 'max-w-[380px]'} bg-[#090909] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10 flex flex-col relative`}
            style={{ fontFamily: 'Inter, sans-serif' }}
            onClick={e => e.stopPropagation()}
        >
            {/* Glossy Header Area */}
            <div className="relative h-48 flex-shrink-0">
                <img src={coverArt} alt={title} className="absolute inset-0 w-full h-full object-cover brightness-[0.4] blur-sm scale-110" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-[#090909]"></div>
                
                <div className="absolute inset-0 p-6 flex flex-col justify-end items-center text-center">
                    <div className="w-20 h-20 rounded-xl shadow-2xl overflow-hidden border border-white/20 mb-4 transform -rotate-1">
                        <img src={coverArt} className="w-full h-full object-cover" />
                    </div>
                    <h2 className="text-white text-2xl font-black uppercase tracking-tighter italic leading-none truncate w-full">{title}</h2>
                    <p className="text-[#1DB954] text-[10px] font-black uppercase tracking-[0.3em] mt-1 opacity-80">{artistName}</p>
                </div>
                
                {/* Rapify Logo Floating */}
                <div className="absolute top-4 left-6 flex items-center gap-1.5">
                    <div className="w-5 h-5 bg-[#1DB954] rounded-full flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-3 h-3 text-black fill-current"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.5 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"></path></svg>
                    </div>
                    <span className="text-white text-[10px] font-black uppercase tracking-widest">Snapshot</span>
                </div>
            </div>

            {/* Date Badge */}
            <div className="px-6 py-2">
                <div className="bg-white/5 border border-white/5 rounded-full px-4 py-1 text-center">
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Week of {gameDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
            </div>

            {/* Data Rows */}
            <div className="flex-grow px-6 py-4 space-y-4">
                {rows.map((row, idx) => {
                    const isNew = row.change === "New";
                    const changeNum = isNew ? 0 : parseFloat(row.change);
                    return (
                        <div key={idx} className="flex items-center justify-between group">
                            <div className="min-w-0 flex-1 pr-4">
                                <p className="text-white font-black text-xs uppercase italic truncate tracking-tight">{row.title}</p>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">+{row.weekly.toLocaleString()} this week</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <p className="text-white font-mono text-xs font-black">{row.total.toLocaleString()}</p>
                                <p className={`text-[10px] font-black ${isNew ? 'text-blue-400' : changeNum >= 0 ? 'text-[#1DB954]' : 'text-red-500'}`}>
                                    {isNew ? 'NEW' : `${changeNum >= 0 ? '▲' : '▼'} ${Math.abs(changeNum)}%`}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {/* Grand Total Footer */}
            <div className="mt-auto bg-gradient-to-r from-[#1DB954] to-[#16a34a] p-6 text-black">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Catalog Performance</p>
                        <p className="text-3xl font-black italic tracking-tighter leading-none">{totalStreams.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xl font-black italic leading-none">+{totalWeekly.toLocaleString()}</p>
                        <p className="text-[9px] font-black uppercase tracking-tighter mt-1 opacity-80">
                            {totalChange === "New" ? "Initial Cycle" : `${parseFloat(totalChange) >= 0 ? '▲' : '▼'} ${Math.abs(parseFloat(totalChange))}% Gain`}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    if (embedMode) return <Content />;

    return (
        <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 backdrop-blur-xl" onClick={onClose}>
            <div className="animate-fade-in-up">
                <Content />
                <p className="text-center text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] mt-8">Secure Data Visualization • RAPIFY 2.0</p>
            </div>
        </div>
    );
};

export default StreamSnapshot;
