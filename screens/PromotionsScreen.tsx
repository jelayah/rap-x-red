
import React from 'react';
import type { Player, Song, Album, Promotion, Notification } from '../types';

interface PromotionsScreenProps {
    player: Player;
    setPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
    songs: Song[];
    albums: Album[];
    promotions: Promotion[];
    setPromotions: React.Dispatch<React.SetStateAction<Promotion[]>>;
    gameDate: Date;
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const PromotionsScreen: React.FC<PromotionsScreenProps> = () => {
    return (
        <div className="min-h-screen bg-[#07070B] relative overflow-hidden font-sans flex flex-col items-center justify-center p-6 text-center">
            {/* Background Aesthetic */}
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-red-600/5 blur-[120px] rounded-full animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-primary-start/5 blur-[120px] rounded-full"></div>

            <div className="relative z-10 space-y-8 animate-fade-in max-w-md">
                <div className="relative inline-block">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/5 rounded-[2.5rem] border border-white/10 flex items-center justify-center mx-auto shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent opacity-50"></div>
                        <svg className="w-12 h-12 sm:w-16 sm:h-16 text-red-600 drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.007.51.011.77.011h3.39c.26 0 .517-.004.77-.011m-5.02-9.18c.253-.007.51-.011.77-.011h3.39c.26 0 .517.004.77.011m0 9.18c.688.06 1.386.09 2.09.09H16.5a4.5 4.5 0 100-9h-.75c-.704 0-1.402.03-2.09.09M10.34 6.66l.044-.247a3.502 3.502 0 00-5.111-3.618m5.067 3.865l-.044.247m5.02 9.18l.044.247a3.502 3.502 0 01-5.111 3.618m5.067-3.865l-.044-.247" />
                        </svg>
                    </div>
                    {/* Warning Indicator */}
                    <div className="absolute -top-1 -right-1 bg-red-600 w-8 h-8 rounded-full flex items-center justify-center border-4 border-[#07070B] shadow-xl">
                        <span className="text-white font-black text-sm">!</span>
                    </div>
                </div>

                <div className="max-w-sm mx-auto space-y-4">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <span className="h-[1px] w-6 bg-red-600/30"></span>
                        <p className="text-[10px] font-black uppercase tracking-[0.6em] text-red-500">System Restriction</p>
                        <span className="h-[1px] w-6 bg-red-600/30"></span>
                    </div>
                    <h1 className="text-5xl sm:text-7xl font-black italic uppercase tracking-tighter text-white leading-none">PROMO OFFLINE</h1>
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest leading-relaxed px-4">
                        There are a lot of bugs with promotions so that will be worked on in the future updates. The agency is currently closed for maintenance.
                    </p>
                </div>

                <div className="pt-8 opacity-20">
                    <p className="text-[8px] font-black text-gray-500 uppercase tracking-[1em]">SYSTEM_STABILITY_PROTOCOL • RED MIC OPS</p>
                </div>
            </div>
        </div>
    );
};

export default PromotionsScreen;
