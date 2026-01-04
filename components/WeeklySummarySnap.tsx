
import React from 'react';
import type { Song, Album } from '../types';

interface WeeklyRewindProps {
    summary: {
        totalStreams: number;
        topSongs: Song[];
        topAlbums: Album[];
    };
    onClose: () => void;
}

const formatMetric = (num: number) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toLocaleString();
};

const WeeklyRewind: React.FC<WeeklyRewindProps> = ({ summary, onClose }) => {
    const { totalStreams, topSongs, topAlbums } = summary;

    return (
        <div className="fixed inset-0 bg-[#07070B]/98 z-[200] flex items-center justify-center p-4 backdrop-blur-3xl" onClick={onClose}>
            <div 
                className="bg-[#0a0a0c] w-full max-w-2xl rounded-[3rem] shadow-[0_0_80px_rgba(220,38,38,0.15)] border border-white/5 overflow-hidden animate-fade-in-up max-h-[90vh] flex flex-col" 
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-8 pb-4 flex justify-between items-start border-b border-white/5">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></div>
                            <p className="text-[9px] font-black uppercase tracking-[0.6em] text-red-500">Fiscal Period Summary</p>
                        </div>
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">WEEKLY REWIND</h2>
                    </div>
                    <button onClick={onClose} className="p-3 bg-white/5 rounded-full hover:bg-white/10 text-gray-500 hover:text-white transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto p-8 space-y-12 scrollbar-hide">
                    {/* Big Total Streams Metric */}
                    <section className="text-center bg-gradient-to-br from-white/5 to-transparent p-10 rounded-[3rem] border border-white/5 shadow-inner">
                        <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.5em] mb-3">Aggregate Catalog Consumption</p>
                        <div className="flex items-baseline justify-center gap-3">
                            <p className="text-7xl sm:text-9xl font-black text-white italic tracking-tighter leading-none">{formatMetric(totalStreams)}</p>
                            <span className="text-2xl font-black text-red-600 italic tracking-tighter">Plays</span>
                        </div>
                        <p className="text-xs text-gray-600 font-bold uppercase tracking-widest mt-6 italic">Synchronized across all global distribution endpoints.</p>
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Top 5 Songs */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Top 5 Sessions</h3>
                                <div className="h-[1px] flex-grow bg-white/5"></div>
                            </div>
                            <div className="space-y-3">
                                {topSongs.length > 0 ? topSongs.map((song, idx) => (
                                    <div key={song.id} className="flex items-center gap-4 group">
                                        <span className="text-lg font-black text-gray-700 w-4 tabular-nums italic">{idx + 1}</span>
                                        <img src={song.coverArt || "https://thumbs2.imgbox.com/9f/53/9siJdUVY_t.jpg"} className="w-12 h-12 rounded-xl object-cover shadow-lg border border-white/5" />
                                        <div className="min-w-0 flex-grow">
                                            <p className="text-sm font-black text-white uppercase italic tracking-tight truncate leading-none mb-1">{song.title}</p>
                                            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">+{formatMetric(song.weeklyStreams)} Plays</p>
                                        </div>
                                    </div>
                                )) : <p className="text-center text-gray-800 font-bold uppercase italic text-[10px] py-10">Data set incomplete.</p>}
                            </div>
                        </section>

                        {/* Top 3 Albums */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Top 3 Projects</h3>
                                <div className="h-[1px] flex-grow bg-white/5"></div>
                            </div>
                            <div className="space-y-4">
                                {topAlbums.length > 0 ? topAlbums.map((album, idx) => (
                                    <div key={album.id} className="flex items-center gap-4 group">
                                        <span className="text-lg font-black text-red-600 w-4 tabular-nums italic">{idx + 1}</span>
                                        <img src={album.coverArt || "https://thumbs2.imgbox.com/9f/53/9siJdUVY_t.jpg"} className="w-14 h-14 rounded-[1.2rem] object-cover shadow-2xl border border-white/5" />
                                        <div className="min-w-0 flex-grow">
                                            <p className="text-base font-black text-white uppercase italic tracking-tighter truncate leading-none mb-1">{album.title}</p>
                                            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">+{formatMetric(album.weeklyUnitSales || 0)} Units</p>
                                        </div>
                                    </div>
                                )) : <p className="text-center text-gray-800 font-bold uppercase italic text-[10px] py-10">Data set incomplete.</p>}
                            </div>
                        </section>
                    </div>
                </div>

                <div className="p-8 bg-white/5 border-t border-white/5">
                    <button 
                        onClick={onClose}
                        className="w-full bg-white text-black font-black py-5 rounded-2xl uppercase tracking-[0.3em] text-[11px] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl"
                    >
                        Sync New Cycle Data
                    </button>
                    <p className="text-center text-[7px] text-gray-700 font-black uppercase tracking-[1em] mt-8">PROTOCOL ALPHA • RED MIC SYSTEMS</p>
                </div>
            </div>
        </div>
    );
};

export default WeeklyRewind;
