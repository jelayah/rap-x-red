
import React, { useMemo } from 'react';
import type { Player, Song } from '../types';

interface RappleMusicForArtistsScreenProps {
  player: Player;
  songs: Song[];
  onBack: () => void;
  gameDate: Date;
}

const formatNumber = (num: number): string => {
    if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`;
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toLocaleString();
};

const MetricTile: React.FC<{ label: string; value: string; sub: string; color?: string }> = ({ label, value, sub, color = "text-black" }) => (
    <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col justify-between group hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all">
        <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">{label}</p>
            <p className={`text-4xl sm:text-5xl font-black tracking-tighter ${color} leading-none mb-2`}>{value}</p>
        </div>
        <p className="text-xs font-bold text-gray-500 mt-4">{sub}</p>
    </div>
);

const RappleMusicForArtistsScreen: React.FC<RappleMusicForArtistsScreenProps> = ({ player, songs, onBack }) => {
    const releasedSongs = useMemo(() => songs.filter(s => s.isReleased), [songs]);

    const analytics = useMemo(() => {
        const totalPlays = releasedSongs.reduce((acc, song) => acc + song.rappleStreams, 0);
        const totalShazams = releasedSongs.reduce((acc, song) => acc + song.shazams, 0);
        const dailyListeners = Math.floor(player.monthlyListeners / 28);
        
        const topSongs = [...releasedSongs]
            .sort((a, b) => b.rappleStreams - a.rappleStreams)
            .slice(0, 15);

        const streamsByCountry: Record<string, number> = {};
        releasedSongs.forEach(song => {
            if (song.regionalStreams) {
                Object.entries(song.regionalStreams).forEach(([region, streams]) => {
                    if (region !== 'Global') {
                        streamsByCountry[region] = (streamsByCountry[region] || 0) + (streams as number);
                    }
                });
            }
        });
        
        const topCountries = Object.entries(streamsByCountry)
                                .sort(([, a], [, b]) => b - a)
                                .slice(0, 5);

        return { totalPlays, totalShazams, dailyListeners, topSongs, topCountries };
    }, [releasedSongs, player.monthlyListeners]);

    const profileImage = player.aboutImage || `https://source.unsplash.com/200x200/?${encodeURIComponent(player.artistName + ', portrait')}`;

    return (
        <div className="bg-[#FBFBFD] text-black min-h-screen font-sans absolute inset-0 z-50 flex flex-col overflow-hidden">
            {/* Minimalist Apple Header */}
            <header className="sticky top-0 bg-white/80 backdrop-blur-xl z-20 border-b border-gray-100 p-4 sm:p-6 flex items-center justify-between">
                <button onClick={onBack} className="text-[#fa2d48] font-bold flex items-center gap-1 group py-1 px-3 rounded-full hover:bg-gray-50 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 group-hover:-translate-x-1 transition-transform">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    <span className="text-sm font-black uppercase tracking-tighter">Exit</span>
                </button>
                <div className="flex items-center gap-2">
                    <span className="font-black tracking-tighter text-2xl"> Artists</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-black uppercase text-gray-400 hidden sm:block">Season 2025</span>
                    <img src={profileImage} alt="profile" className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm" />
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-6 sm:p-12 space-y-16 max-w-6xl mx-auto w-full scrollbar-hide pb-32">
                {/* Clean Section Header */}
                <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                    <div>
                        <p className="text-[#fa2d48] font-black uppercase tracking-[0.3em] text-[10px] mb-2">Performance Intelligence</p>
                        <h1 className="text-6xl sm:text-8xl font-black tracking-tighter leading-none">{player.artistName}</h1>
                        <p className="text-gray-400 font-bold text-lg mt-3 uppercase tracking-widest">{player.label}</p>
                    </div>
                    <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex items-center gap-4">
                         <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
                         <p className="text-xs font-black uppercase tracking-widest text-gray-500">System Live & Current</p>
                    </div>
                </section>

                {/* Key Metrics Grid */}
                <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                    <MetricTile label="Lifetime High-Fidelity Plays" value={formatNumber(analytics.totalPlays)} sub="Accumulated since debut" />
                    <MetricTile label="Active Daily Listeners" value={formatNumber(analytics.dailyListeners)} sub="Rolling 24hr average" color="text-[#fa2d48]" />
                    <MetricTile label="Global Shazam Hits" value={formatNumber(analytics.totalShazams)} sub="Viral discovery index" />
                </section>

                {/* Performance Analytics */}
                <section className="grid grid-cols-1 lg:grid-cols-5 gap-12 pt-4">
                    <div className="lg:col-span-3 space-y-8">
                        <div className="flex justify-between items-end border-b border-gray-100 pb-4">
                            <h2 className="text-2xl font-black tracking-tight">Top Performance</h2>
                            <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest"> Music Metrics</span>
                        </div>
                        <div className="space-y-1">
                            {analytics.topSongs.map((song, i) => (
                                <div key={song.id} className="flex items-center gap-5 py-4 px-4 rounded-2xl hover:bg-white hover:shadow-xl transition-all group active:scale-[0.98]">
                                    <span className="text-gray-200 font-black text-3xl w-10 text-center tabular-nums group-hover:text-black transition-colors">{i + 1}</span>
                                    <img src={song.coverArt || ''} className="w-14 h-14 rounded-xl object-cover shadow-md group-hover:scale-105 transition-transform" alt={song.title} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-lg leading-tight truncate text-black">{song.title}</p>
                                            {song.version === 'Explicit' && <span className="text-[8px] bg-gray-100 text-gray-500 px-1 rounded-sm font-black">E</span>}
                                        </div>
                                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.1em] mt-1">{song.genre}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-xl tracking-tighter tabular-nums text-black">{formatNumber(song.rappleStreams)}</p>
                                        <p className="text-[9px] text-[#fa2d48] font-black uppercase tracking-widest">Plays</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-12">
                        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                            <h3 className="text-xs font-black uppercase tracking-widest mb-10 text-gray-400 border-b border-gray-50 pb-4">Regional Clout</h3>
                            <div className="space-y-8">
                                {analytics.topCountries.length > 0 ? analytics.topCountries.map(([region, streams], i) => (
                                    <div key={region} className="flex justify-between items-center group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-xs font-black group-hover:bg-[#fa2d48] group-hover:text-white transition-colors">{i + 1}</div>
                                            <span className="font-bold text-base text-gray-800">{region}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-black text-lg tabular-nums text-black">{formatNumber(streams)}</span>
                                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-none">Plays</p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="py-20 text-center">
                                        <p className="text-gray-300 font-black uppercase italic tracking-widest text-[10px]">Territory Data Pending...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="bg-black text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                            <div className="absolute -top-12 -right-12 opacity-10 transform rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                                <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 16 16"><path d="M9 13c0 1.105-1.12 2-2.5 2S4 14.105 4 13s1.12-2 2.5-2 2.5.895 2.5 2z"/><path fillRule="evenodd" d="M9 3v10H8V3h1z"/><path d="M8 2.5a.5.5 0 0 1 .5.5v10a.5.5 0 0 1-1 0v-10A.5.5 0 0 1 8 2.5z"/></svg>
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-3xl font-black tracking-tight mb-4 italic uppercase">Artist Trends</h3>
                                <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                                    Analyze listener behavior, geographic hotspots, and track retention through Rapple Music's proprietary high-fidelity reporting.
                                </p>
                                <button className="mt-10 bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] px-8 py-3 rounded-full hover:bg-gray-200 transition-all active:scale-95 shadow-xl">
                                    Deep Dive
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <footer className="pt-20 border-t border-gray-100 text-center opacity-30">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.6em]"> Music Intelligence Terminal • build_02_2025</p>
                </footer>
            </main>
        </div>
    );
};

export default RappleMusicForArtistsScreen;
