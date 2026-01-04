
import React from 'react';
import type { Player, MerchItem, Song, Album } from '../types';

interface MerchScreenProps {
    player: Player;
    setPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
    merchItems: MerchItem[];
    setMerchItems: React.Dispatch<React.SetStateAction<MerchItem[]>>;
    playerSongs: Song[];
    playerAlbums: Album[];
}

const MerchScreen: React.FC<MerchScreenProps> = ({ player }) => {
    return (
        <div className="min-h-screen bg-[#07070B] relative overflow-hidden font-sans flex flex-col items-center justify-center p-6 text-center">
            {/* Background Aesthetic */}
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-red-600/5 blur-[120px] rounded-full animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-primary-start/5 blur-[120px] rounded-full"></div>

            <div className="relative z-10 space-y-8 animate-fade-in">
                <div className="relative inline-block">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/5 rounded-[2.5rem] border border-white/10 flex items-center justify-center mx-auto shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent opacity-50"></div>
                        <svg className="w-12 h-12 sm:w-16 sm:h-16 text-red-600 drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.658-.463 1.243-1.117 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.117 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                    </div>
                    {/* Warning Indicator */}
                    <div className="absolute -bottom-2 -right-2 bg-red-600 w-8 h-8 rounded-full flex items-center justify-center border-4 border-[#07070B] shadow-xl">
                        <span className="text-white font-black text-sm">!</span>
                    </div>
                </div>

                <div className="max-w-md mx-auto space-y-4">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <span className="h-[1px] w-6 bg-red-600/30"></span>
                        <p className="text-[10px] font-black uppercase tracking-[0.6em] text-red-500">System Interruption</p>
                        <span className="h-[1px] w-6 bg-red-600/30"></span>
                    </div>
                    <h1 className="text-5xl sm:text-7xl font-black italic uppercase tracking-tighter text-white leading-none">Commerce Offline</h1>
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest leading-relaxed px-4">
                        The Merch Production Suite is currently undergoing infrastructure upgrades. Retail operations will be back soon.
                    </p>
                </div>

                <div className="pt-8 opacity-20">
                    <p className="text-[8px] font-black text-gray-500 uppercase tracking-[1em]">PENDING DEPLOYMENT • RAP X RED OPERATIONS</p>
                </div>
            </div>
        </div>
    );
};

export default MerchScreen;
