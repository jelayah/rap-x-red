
import React, { useState, useEffect } from 'react';
import { generateMusicFact } from '../services/geminiService';

const LoadingScreen: React.FC = () => {
    const [fact, setFact] = useState<string>('Syncing industry protocols...');

    useEffect(() => {
        generateMusicFact().then(setFact);
    }, []);

    return (
        <div className="min-h-screen bg-[#07070B] flex flex-col items-center justify-center p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(220,38,38,0.05),transparent_70%)]"></div>
            
            <div className="relative">
                <div className="w-24 h-24 border-[3px] border-red-600/20 border-t-red-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-red-600 font-black text-xl italic tracking-tighter">RED</span>
                </div>
            </div>

            <div className="mt-12 text-center z-10">
                <h1 className="flex items-center justify-center gap-3 text-4xl md:text-5xl font-black italic tracking-tighter">
                    <span className="text-white">RAP</span>
                    <span className="text-red-600 not-italic scale-110">X</span>
                    <span className="bg-gradient-to-b from-red-500 to-red-800 bg-clip-text text-transparent">RED</span>
                </h1>
                <p className="text-[10px] font-black uppercase tracking-[0.6em] text-brand-text-muted mt-2 opacity-50">The Industry Collaboration</p>
            </div>

            <div className="mt-16 max-w-sm text-center">
                <p className="text-xs font-black uppercase tracking-widest text-red-500 mb-2 opacity-80 animate-pulse">Internal Data Sync</p>
                <p className="text-sm text-brand-text-muted font-medium italic leading-relaxed">
                    "{fact}"
                </p>
            </div>

            <footer className="absolute bottom-8 text-[8px] font-black text-gray-700 uppercase tracking-[0.5em]">
                Proprietary Logic Engine v2.0
            </footer>
        </div>
    );
};

export default LoadingScreen;
