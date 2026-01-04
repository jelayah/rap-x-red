
import React from 'react';
import type { Song, Album } from '../types';

interface CertificationDetailsProps {
    item: Song | Album;
    onClose: () => void;
}

const CertificationDetails: React.FC<CertificationDetailsProps> = ({ item, onClose }) => {
    const latestCert = item.certifications?.[item.certifications.length - 1];
    if (!latestCert) return null;

    const getCertMultiplier = (cert: typeof latestCert) => {
        if (cert.level === 'Multi-Platinum') return `${cert.multiplier}X`;
        if (cert.level === 'Platinum') return '1X';
        return '';
    };

    const getPlaqueColors = (level: string) => {
        switch (level) {
            case 'Gold': return { bg: 'bg-gradient-to-br from-[#C5A059] to-[#8B7355]', shadow: 'shadow-yellow-900/50', border: 'border-[#FFD700]', text: 'text-[#5C4033]', icon: 'bg-[#FFD700]', label: 'GOLD' };
            case 'Platinum': return { bg: 'bg-gradient-to-br from-[#B4B4B4] to-[#707070]', shadow: 'shadow-gray-900/50', border: 'border-[#E5E4E2]', text: 'text-[#1A1A1A]', icon: 'bg-[#E5E4E2]', label: 'PLATINUM' };
            case 'Multi-Platinum': return { bg: 'bg-gradient-to-br from-[#E5E4E2] to-[#404040]', shadow: 'shadow-slate-900/50', border: 'border-white', text: 'text-black', icon: 'bg-white', label: 'MULTI-PLATINUM' };
            case 'Diamond': return { bg: 'bg-gradient-to-br from-[#E0F7FA] via-[#B2EBF2] to-[#BDBDBD]', shadow: 'shadow-cyan-900/50', border: 'border-white', text: 'text-[#006064]', icon: 'bg-white', label: 'DIAMOND' };
            default: return { bg: 'bg-gray-200', shadow: 'shadow-black/50', border: 'border-gray-400', text: 'text-black', icon: 'bg-white', label: 'CERTIFIED' };
        }
    };

    const colors = getPlaqueColors(latestCert.level);

    return (
        <div className="fixed inset-0 bg-[#07070B]/98 z-[250] flex items-center justify-center p-0 sm:p-4 backdrop-blur-3xl overflow-y-auto" onClick={onClose}>
            <div 
                className="w-full max-w-xl bg-[#0a0a0c] sm:rounded-[3.5rem] border-x border-b sm:border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col min-h-screen sm:min-h-0"
                onClick={e => e.stopPropagation()}
            >
                {/* Plaque Visual Section */}
                <div className={`h-[280px] sm:h-[320px] relative ${colors.bg} flex flex-col items-center justify-center p-8 sm:p-12 overflow-hidden flex-shrink-0`}>
                    {/* Top Back Button for Mobile */}
                    <button 
                        onClick={onClose}
                        className="absolute top-6 left-6 z-30 p-2 bg-black/20 rounded-full backdrop-blur-md border border-white/10 text-white hover:bg-black/40 transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>

                    {/* Simulated Professional Glass Reflections */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-black/30 pointer-events-none"></div>
                    
                    <div className="relative z-10 flex flex-col items-center">
                        <div className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full ${colors.icon} shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-[4px] sm:border-[6px] ${colors.border} mb-6 sm:mb-8 flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-700`}>
                            <p className={`font-black text-4xl sm:text-6xl tracking-tighter ${colors.text}`}>{getCertMultiplier(latestCert) || colors.label.charAt(0)}</p>
                            <div className="flex gap-1 mt-2">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${colors.text} opacity-30`}></div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="text-center space-y-1 sm:space-y-2">
                            <h2 className={`text-2xl sm:text-4xl font-black tracking-tighter leading-none uppercase ${colors.text}`}>
                                {latestCert.level === 'Multi-Platinum' ? `${latestCert.multiplier}X PLATINUM` : colors.label}
                            </h2>
                            <div className="flex items-center gap-3 justify-center">
                                <div className={`h-[1px] w-8 sm:w-12 ${colors.text} opacity-20`}></div>
                                <p className={`text-[8px] sm:text-[10px] font-black uppercase tracking-[0.5em] ${colors.text} opacity-60`}>OFFICIAL AUDIT</p>
                                <div className={`h-[1px] w-8 sm:w-12 ${colors.text} opacity-20`}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Section */}
                <div className="p-6 sm:p-10 flex-grow space-y-8 sm:space-y-10">
                    <div className="flex flex-row items-center justify-between gap-4">
                        <div className="text-left flex-grow min-w-0">
                            <p className="text-[#fa2d48] font-black uppercase tracking-[0.4em] text-[8px] mb-1.5 leading-none">Catalog Designation</p>
                            <h3 className="text-white text-2xl sm:text-4xl font-black italic uppercase tracking-tighter leading-none truncate mb-1">{item.title}</h3>
                            <p className="text-gray-400 font-bold text-base sm:text-xl uppercase tracking-widest truncate">{item.artistName}</p>
                        </div>
                        <img src={item.coverArt || ''} className="w-16 h-16 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl object-cover shadow-2xl border border-white/10 -rotate-3 flex-shrink-0" />
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div className="bg-white/5 border border-white/5 rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 text-center">
                            <p className="text-[8px] sm:text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Authenticated</p>
                            <p className="text-sm sm:text-lg font-black text-white italic">{new Date(latestCert.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                        <div className="bg-white/5 border border-white/5 rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 text-center">
                            <p className="text-[8px] sm:text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Unit Threshold</p>
                            <p className="text-sm sm:text-lg font-black text-green-400 italic">{(latestCert.units / 1000000).toFixed(1)}M Units</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.4em] text-gray-700">Audit History</h3>
                            <div className="h-[1px] flex-grow mx-4 sm:mx-6 bg-white/5"></div>
                        </div>
                        <div className="grid grid-cols-1 gap-2 max-h-32 sm:max-h-40 overflow-y-auto pr-1 scrollbar-hide">
                            {item.certifications?.slice().reverse().map((cert, idx) => {
                                const label = cert.level === 'Multi-Platinum' ? `${cert.multiplier}X PLATINUM` : cert.level.toUpperCase();
                                return (
                                    <div key={idx} className="flex justify-between items-center bg-white/5 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/5">
                                        <p className="font-black text-[10px] sm:text-[11px] text-white uppercase italic tracking-tighter">{label}</p>
                                        <p className="text-[9px] sm:text-[10px] text-gray-500 font-bold tabular-nums">{new Date(cert.date).toLocaleDateString()}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="p-6 sm:p-10 pt-0 mt-auto">
                    <button 
                        onClick={onClose}
                        className="w-full bg-white text-black font-black py-4 sm:py-5 rounded-full text-[10px] sm:text-[11px] uppercase tracking-[0.3em] shadow-xl active:scale-95 transition-all"
                    >
                        Close Plaque
                    </button>
                    <p className="text-center text-[6px] sm:text-[7px] text-gray-800 font-black uppercase tracking-[0.8em] sm:tracking-[1em] mt-6 sm:mt-8 mb-4">PROPERTY OF RED MIC SYSTEMS • RIAA CERTIFIED 2025</p>
                </div>
            </div>
        </div>
    );
};

export default CertificationDetails;
