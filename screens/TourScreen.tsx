
import React from 'react';
import type { Player, Song, Album } from '../types';

const TourScreen: React.FC<{ player: Player, setPlayer: any, tours: any[], setTours: any, gameDate: Date, songs: Song[], setAlbums: any, setSongs: any }> = () => {
    return (
        <div className="p-4 sm:p-12 space-y-8 sm:space-y-12 max-w-7xl mx-auto pb-40 font-sans min-h-screen bg-[#07070B] flex flex-col items-center justify-center text-center overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none animate-pulse"></div>
            
            <div className="relative z-10 space-y-8 animate-fade-in">
                <div className="relative inline-block">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/5 rounded-[2.5rem] border border-white/10 flex items-center justify-center mx-auto shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-transparent opacity-50"></div>
                        <svg className="w-12 h-12 sm:w-16 sm:h-16 text-indigo-500 drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                    </div>
                </div>

                <div className="max-w-md mx-auto space-y-6">
                    <div className="flex items-center justify-center gap-3">
                        <span className="h-[1px] w-6 bg-indigo-500/30"></span>
                        <p className="text-[10px] font-black uppercase tracking-[0.6em] text-indigo-500">Upcoming Expansion</p>
                        <span className="h-[1px] w-6 bg-indigo-500/30"></span>
                    </div>
                    <h1 className="text-5xl sm:text-7xl font-black italic uppercase tracking-tighter text-white leading-none">WORLD TOUR</h1>
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest leading-relaxed px-4">
                        The Global Performance Matrix is currently undergoing infrastructure sync. Touring operations will be authorized in a later update.
                    </p>
                    <div className="pt-4">
                        <div className="inline-block bg-white/5 border border-white/10 px-6 py-2 rounded-full backdrop-blur-md">
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest animate-pulse">Protocol: Coming Soon</span>
                        </div>
                    </div>
                </div>

                <div className="pt-8 opacity-20">
                    <p className="text-[8px] font-black text-gray-500 uppercase tracking-[1em]">OFFICIAL ROADMAP • RED MIC OPERATIONS</p>
                </div>
            </div>
        </div>
    );
};

export default TourScreen;
