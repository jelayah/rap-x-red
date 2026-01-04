
import React, { useMemo, useState } from 'react';
import type { Player, Song } from '../types';
import { Experience } from '../types';

interface RapCloudAppProps {
    player: Player;
    songs: Song[];
    onBack: () => void;
    gameDate: Date;
}

const formatNumber = (num: number) => {
    if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(2)}B`;
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toLocaleString();
};

const timeSince = (date: Date, gameDate: Date) => {
    const postDate = new Date(date);
    const now = new Date(gameDate);
    const diffInMs = now.getTime() - postDate.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays < 1) return 'Today';
    if (diffInDays < 7) return `${diffInDays}d`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)}mo`;
    return `${Math.floor(diffInDays / 365)}y`;
};

const Waveform: React.FC<{ progress: number; mobile?: boolean }> = ({ progress, mobile }) => {
    const bars = mobile ? 30 : 60;
    return (
        <div className="flex items-end gap-[2px] h-10 sm:h-12 w-full opacity-60">
            {Array.from({ length: bars }).map((_, i) => {
                const height = 20 + Math.random() * 80;
                const isPlayed = (i / bars) * 100 < progress;
                return (
                    <div 
                        key={i} 
                        className={`flex-1 rounded-t-sm transition-colors ${isPlayed ? 'bg-[#FF5500]' : 'bg-gray-600'}`} 
                        style={{ height: `${height}%` }}
                    />
                );
            })}
        </div>
    );
};

const RapCloudApp: React.FC<RapCloudAppProps> = ({ player, songs, onBack, gameDate }) => {
    const [activeTab, setActiveTab] = useState('All');
    const artistName = player.artistName;
    
    const playerSongs = useMemo(() => 
        songs.filter(s => s.artistName === artistName && s.isReleased),
    [songs, artistName]);

    // REALISTIC RAP CLOUD ANALYTICS
    const analytics = useMemo(() => {
        let streamMultiplier = 0.04; 
        let followerBase = 0.015;    
        
        switch(player.experience) {
            case Experience.Underground:
                streamMultiplier = 0.70; 
                followerBase = 0.22;    
                break;
            case Experience.New:
                streamMultiplier = 0.35; 
                followerBase = 0.10;    
                break;
            case Experience.Experienced:
                streamMultiplier = 0.12; 
                followerBase = 0.04;    
                break;
        }

        const rcFollowers = Math.floor((player.monthlyListeners * followerBase) + (player.reputation * 80)) + 30;
        
        const tracksWithRCData = playerSongs.map(s => {
            const viralPotential = 0.8 + (s.quality / 100) * 0.4; 
            const rcStreams = Math.floor(s.rapifyStreams * streamMultiplier * viralPotential) + Math.floor(Math.random() * 50);
            
            const likes = Math.floor(rcStreams * 0.025); 
            const reposts = Math.floor(rcStreams * 0.006); 
            
            return {
                ...s,
                rcStreams,
                rcLikes: likes,
                rcReposts: reposts
            };
        }).sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()); // Sorted by latest released

        return { rcFollowers, tracksWithRCData };
    }, [player, playerSongs]);

    const headerImage = player.headerImage || `https://images.unsplash.com/photo-1514525253361-bee8d41e7655?q=80&w=1600`;
    const profilePic = player.aboutImage || `https://source.unsplash.com/200x200/?portrait`;

    return (
        <div className="bg-[#0a0a0a] text-white min-h-screen font-sans fixed inset-0 z-[70] overflow-y-auto flex flex-col animate-fade-in scrollbar-hide">
            {/* Top Navigation Bar */}
            <header className="flex items-center justify-between px-4 sm:px-6 py-3 bg-[#111] border-b border-white/5 sticky top-0 z-50">
                <div className="flex items-center gap-4 sm:gap-6">
                    <button onClick={onBack} className="p-1 -ml-1 hover:bg-white/10 rounded-full transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                    </button>
                    <div className="flex items-center gap-2">
                        <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#FF5500] fill-current"><path d="M22.5 15.5c0 1.93-1.57 3.5-3.5 3.5H7c-2.76 0-5-2.24-5-5s2.24-5 5-5c.34 0 .67.03 1 .1C9.07 6.13 11.36 4 14 4c3.31 0 6 2.69 6 6 0 .34-.03.67-.1 1 1.57.54 2.6 2.03 2.6 3.5z"/></svg>
                    </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                    <button className="p-2 text-gray-400 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                    </button>
                    <button className="text-[10px] font-black uppercase text-[#FF5500] hover:text-white transition-colors px-2">Upload</button>
                    <img src={profilePic} className="w-7 h-7 rounded-full border border-white/10 object-cover" alt="Me" />
                </div>
            </header>

            <main className="flex-1 w-full pb-32">
                {/* Profile Header */}
                <div className="relative w-full h-[220px] sm:h-[300px] bg-gradient-to-r from-[#333] to-[#111] overflow-hidden flex items-end sm:items-center px-4 sm:px-10 pb-6 sm:pb-0">
                    <img src={headerImage} className="absolute inset-0 w-full h-full object-cover opacity-40 blur-[1px]" alt="Banner" />
                    <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/80 sm:from-black/60 via-transparent to-transparent"></div>
                    
                    <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-8 w-full text-center sm:text-left">
                        <div className="w-24 h-24 sm:w-44 sm:h-44 rounded-full border-[3px] sm:border-4 border-[#FF5500]/20 shadow-2xl overflow-hidden shrink-0">
                            <img src={profilePic} className="w-full h-full object-cover" alt="Profile" />
                        </div>
                        <div className="flex flex-col items-center sm:items-start">
                            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 w-fit mb-3 border border-white/5 shadow-xl rounded-sm">
                                <h1 className="text-xl sm:text-4xl font-black text-white italic uppercase tracking-tighter leading-none">{artistName}</h1>
                                <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 fill-current"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.9 14.7L6 12.6l1.5-1.5 2.6 2.6 6.1-6.1 1.5 1.5-7.6 7.6z"></path></svg>
                            </div>
                            <div className="flex gap-2">
                                <span className="bg-[#FF5500] text-white text-[8px] sm:text-[9px] font-black uppercase px-2 py-1 flex items-center gap-1 shadow-lg rounded-sm">
                                    ARTIST PRO
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sub-nav Tab Bar */}
                <div className="flex justify-between items-center border-b border-white/5 bg-[#0a0a0a] sticky top-[53px] z-40 overflow-x-auto no-scrollbar">
                    <div className="flex px-4 sm:px-10">
                        {['All', 'Tracks', 'Albums', 'Playlists', 'Reposts'].map((tab) => (
                            <button 
                                key={tab} 
                                onClick={() => setActiveTab(tab)}
                                className={`py-4 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${activeTab === tab ? 'text-[#FF5500] border-[#FF5500]' : 'text-gray-500 hover:text-white border-transparent'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col lg:grid lg:grid-cols-4 gap-8 sm:gap-12 p-4 sm:p-10">
                    {/* Main Content Area: The Feed */}
                    <div className="lg:col-span-3 space-y-8 sm:space-y-12 order-2 lg:order-1">
                        
                        {/* Mobile Stats Row */}
                        <div className="lg:hidden flex justify-between items-center bg-white/5 rounded-2xl p-6 border border-white/5">
                            <div className="text-center flex-1">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Followers</p>
                                <p className="text-xl font-black italic text-white">{formatNumber(analytics.rcFollowers)}</p>
                            </div>
                            <div className="h-8 w-[1px] bg-white/10 mx-2"></div>
                            <div className="text-center flex-1">
                                <p className="text-[10px] font-black uppercase tracking-widest mb-1">Following</p>
                                <p className="text-xl font-black italic text-white">24</p>
                            </div>
                            <div className="h-8 w-[1px] bg-white/10 mx-2"></div>
                            <div className="text-center flex-1">
                                <p className="text-[10px] font-black uppercase tracking-widest mb-1">Tracks</p>
                                <p className="text-xl font-black italic text-white">{playerSongs.length}</p>
                            </div>
                        </div>

                        <section className="animate-fade-in-up">
                             <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4 px-1">
                                <h2 className="text-lg sm:text-xl font-black italic uppercase tracking-tighter text-white">The Pulse Stream</h2>
                                <p className="text-[9px] font-black text-[#FF5500] uppercase tracking-widest hidden sm:block">Latest Uploads First</p>
                             </div>
                             
                             <div className="space-y-8 sm:space-y-12">
                                {analytics.tracksWithRCData.length > 0 ? analytics.tracksWithRCData.map((track) => (
                                    <div key={track.id} className="flex gap-4 sm:gap-6 group hover:bg-white/[0.02] p-3 -mx-2 sm:-mx-4 rounded-2xl transition-colors">
                                        <div className="w-24 h-24 sm:w-40 sm:h-40 flex-shrink-0 relative rounded-lg overflow-hidden border border-white/5 bg-black">
                                            <img src={track.coverArt || ''} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={track.title} />
                                        </div>
                                        <div className="flex-grow space-y-3 sm:space-y-4 pt-1 min-w-0">
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2 sm:gap-4 mb-1">
                                                         <button className="w-7 h-7 sm:w-9 sm:h-9 bg-[#FF5500] rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform shrink-0">
                                                            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-5 sm:h-5 fill-white ml-0.5"><path d="M8 5v14l11-7z"/></svg>
                                                         </button>
                                                         <div className="min-w-0">
                                                             <p className="text-gray-500 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest truncate leading-none mb-1">{artistName}</p>
                                                             <h4 className="text-base sm:text-xl font-black italic uppercase tracking-tighter text-white truncate">{track.title}</h4>
                                                         </div>
                                                    </div>
                                                </div>
                                                <span className="text-[8px] sm:text-[9px] font-bold text-gray-600 uppercase tracking-widest whitespace-nowrap pt-1">
                                                    {timeSince(track.releaseDate, gameDate)}
                                                </span>
                                            </div>
                                            
                                            <Waveform progress={Math.random() * 40} mobile={true} />
                                            
                                            <div className="flex items-center justify-between text-[#777] text-[9px] sm:text-[11px] font-bold uppercase tracking-tighter pt-1">
                                                <div className="flex gap-4 sm:gap-8">
                                                     <button className="flex items-center gap-1.5 hover:text-[#FF5500] transition-colors">
                                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> 
                                                        {formatNumber(track.rcLikes)}
                                                     </button>
                                                     <button className="flex items-center gap-1.5 hover:text-green-500 transition-colors">
                                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0020 12c0-4.42-3.58-8-8-8zm-1.46 12.14L9.08 14.68A5.94 5.94 0 016 12c0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 004 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3c-3.31 0-6-2.69-6-6 0-.25.02-.48.06-.71z"/></svg> 
                                                        {formatNumber(track.rcReposts)}
                                                     </button>
                                                     <span className="flex items-center gap-1.5 hidden sm:flex">
                                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M21 6h-1.3l-1.4-1.4C18 4.2 17.5 4 17 4H7c-.5 0-1 .2-1.4.6L4.2 6H3c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-9 11c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"/></svg>
                                                        {formatNumber(Math.floor(track.rcStreams * 0.003))}
                                                     </span>
                                                </div>
                                                <span className="flex items-center gap-1.5 text-white/40"><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg> {formatNumber(track.rcStreams)}</span>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="py-32 text-center bg-white/5 rounded-[3rem] border border-dashed border-white/5 opacity-30">
                                        <p className="font-black italic uppercase tracking-widest text-[10px]">No transmission detected.</p>
                                    </div>
                                )}
                             </div>
                        </section>
                    </div>

                    {/* Sidebar: Stats & Underground Clout */}
                    <div className="lg:col-span-1 space-y-10 sm:space-y-12 order-1 lg:order-2">
                        <section className="hidden lg:block bg-black/30 p-8 rounded-[2.5rem] border border-white/5 space-y-8 shadow-2xl">
                            <div className="flex justify-between items-center text-center">
                                <div>
                                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Followers</p>
                                    <p className="text-2xl font-black italic text-white tracking-tighter leading-none">{formatNumber(analytics.rcFollowers)}</p>
                                </div>
                                <div className="h-8 w-[1px] bg-white/5"></div>
                                <div>
                                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Following</p>
                                    <p className="text-2xl font-black italic text-white tracking-tighter leading-none">24</p>
                                </div>
                                <div className="h-8 w-[1px] bg-white/5"></div>
                                <div>
                                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Tracks</p>
                                    <p className="text-2xl font-black italic text-white tracking-tighter leading-none">{playerSongs.length}</p>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] animate-pulse"></span>
                                    Supporter Node
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {Array.from({ length: 12 }).map((_, i) => (
                                        <div key={i} className="w-10 h-10 rounded-full bg-[#222] border border-white/5 overflow-hidden transition-transform hover:scale-110 cursor-pointer">
                                            <img src={`https://source.unsplash.com/100x100/?portrait&sig=${i + 200}`} className="w-full h-full object-cover" alt="fan" />
                                        </div>
                                    ))}
                                    <div className="w-10 h-10 rounded-full bg-[#FF5500]/10 flex items-center justify-center text-[10px] font-black text-[#FF5500] border border-[#FF5500]/20 cursor-pointer hover:bg-[#FF5500]/20 transition-all">+23</div>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h3 className="text-[10px] font-black uppercase text-gray-600 tracking-[0.5em] px-2">System Notice</h3>
                            <div className="bg-black/30 p-6 rounded-[2rem] border border-white/5 group cursor-pointer hover:border-[#FF5500]/20 transition-all shadow-xl">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-[#FF5500]/10 rounded-2xl border border-[#FF5500]/20">
                                        <svg className="w-6 h-6 text-[#FF5500]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.9 14.7L6 12.6l1.5-1.5 2.6 2.6 6.1-6.1 1.5 1.5-7.6 7.6z"></path></svg>
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white">Underground Sync</p>
                                </div>
                                <p className="text-[11px] text-gray-500 font-medium leading-relaxed group-hover:text-gray-400 transition-colors">Rap Cloud data exits outside Billboard weighting protocols. Consumption reflects raw cultural impact without commercial interference.</p>
                            </div>
                        </section>

                        <div className="pt-10 sm:pt-20 opacity-20 text-center space-y-4">
                            <p className="text-[8px] font-black uppercase tracking-[0.8em]">Rap Cloud Infrastructure • Restricted Build</p>
                            <div className="flex justify-center gap-4">
                                <div className="w-10 h-10 border border-white/20 rounded flex items-center justify-center grayscale"><img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" className="w-8" alt="appstore" /></div>
                                <div className="w-10 h-10 border border-white/20 rounded flex items-center justify-center grayscale"><img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" className="w-8" alt="playstore" /></div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default RapCloudApp;
