
import React, { useState, useMemo } from 'react';
import type { Song, Album } from '../types';

interface ReleaseSetupProps {
    item: Song | Album;
    onRelease: (item: Song | Album, releaseDate: Date, presaleWeeks: number, extras?: { instrumental: boolean, acapella: boolean }) => void;
    onCancel: () => void;
    gameDate: Date;
}

const getFridaysForYear = (year: number, gameDate: Date): Date[] => {
    const fridays: Date[] = [];
    const date = new Date(year, 0, 1);
    while (date.getDay() !== 5) {
        date.setDate(date.getDate() + 1);
    }
    while (date.getFullYear() === year) {
        if (date >= gameDate) {
            fridays.push(new Date(date));
        }
        date.setDate(date.getDate() + 7);
    }
    return fridays;
};

const WeekSelectorModal: React.FC<{
    gameDate: Date;
    onSelect: (date: Date) => void;
    onClose: () => void;
}> = ({ gameDate, onSelect, onClose }) => {
    const fridays = useMemo(() => getFridaysForYear(gameDate.getFullYear(), gameDate), [gameDate]);

    return (
        <div className="fixed inset-0 bg-black/90 z-[110] flex items-center justify-center p-4 backdrop-blur-xl">
            <div className="bg-[#0D0C1D] w-full max-w-xl rounded-[3rem] p-10 border border-white/10 shadow-2xl animate-fade-in-up">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white">Select Drop</h3>
                    <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-colors">✕</button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-2 scrollbar-hide">
                    {fridays.map((friday, index) => {
                        const weekNumber = 52 - (fridays.length - 1) + index;
                        return (
                            <button
                                key={friday.toISOString()}
                                onClick={() => { onSelect(friday); onClose(); }}
                                className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-brand-accent-start/50 text-left transition-all group"
                            >
                                <p className="text-[10px] font-black uppercase text-gray-500 group-hover:text-brand-accent-start">Week {weekNumber}</p>
                                <p className="font-black text-white italic">{friday.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const ReleaseSetup: React.FC<ReleaseSetupProps> = ({ item, onRelease, onCancel, gameDate }) => {
    const isSong = 'quality' in item;
    const album = !isSong ? item as Album : null;
    
    const isExplicitProject = useMemo(() => {
        if (isSong) return false;
        return album?.songs.some(s => s.version === 'Explicit');
    }, [isSong, album]);

    const [version, setVersion] = useState<'Explicit' | 'Clean'>(isSong ? (item as Song).version : (isExplicitProject ? 'Explicit' : 'Clean'));
    const [price, setPrice] = useState(isSong ? 0.99 : 9.99);
    const [coverArt, setCoverArt] = useState<string | null>(item.coverArt);
    const [coverArtPreview, setCoverArtPreview] = useState<string | null>(item.coverArt);
    const [releaseDate, setReleaseDate] = useState<Date | null>(null);
    const [isPickingDate, setIsPickingDate] = useState(false);
    
    const [isLossless, setIsLossless] = useState(false);
    const [isDolbyAtmos, setIsDolbyAtmos] = useState(false);

    const handleCoverArtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverArt(reader.result as string);
                setCoverArtPreview(URL.createObjectURL(file));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFinalRelease = () => {
        if (!coverArt) return alert("Visual identification (Cover Art) required.");
        if (!releaseDate) return alert("Target launch date required.");

        const presaleWeeks = Math.ceil((releaseDate.getTime() - gameDate.getTime()) / (1000 * 60 * 60 * 24 * 7));
        const finalItem = { 
            ...item, version: isSong ? version : (isExplicitProject ? 'Explicit' : 'Clean'), 
            price, coverArt: coverArt!,
            isLossless, isDolbyAtmos,
            ...(!isSong && { isExplicit: isExplicitProject, preReleaseUnits: 0 })
        };
        onRelease(finalItem, releaseDate, presaleWeeks);
    };

    const priceOptions = isSong ? [0.69, 0.99, 1.29] : [7.99, 9.99, 12.99];
    const totalCost = (isSong ? 50 : 250);

    return (
        <div className="fixed inset-0 bg-black/95 z-[90] flex items-center justify-center p-4 backdrop-blur-2xl">
            {isPickingDate && <WeekSelectorModal gameDate={gameDate} onClose={() => setIsPickingDate(false)} onSelect={setReleaseDate} />}
            
            <div className="w-full max-w-4xl bg-[#0D0C1D] rounded-[4rem] border border-white/10 shadow-2xl p-8 md:p-12 animate-fade-in-up overflow-y-auto max-h-[95vh] scrollbar-hide">
                <header className="mb-12 border-b border-white/5 pb-8 flex justify-between items-start">
                    <div>
                        <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 bg-red-600/10 rounded-full border border-red-600/20">
                            <span className="w-1 h-1 rounded-full bg-red-600 animate-pulse"></span>
                            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-red-500">Authorization Portal</p>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white">Upload Sync</h2>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Target Assets</p>
                        <p className="text-xl font-black text-white italic truncate max-w-[200px]">{item.title.toUpperCase()}</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-4">Official Visual ID</label>
                            <div className="aspect-square w-full bg-white/5 rounded-[3rem] border border-white/10 overflow-hidden relative group shadow-2xl">
                                {coverArtPreview ? (
                                    <img src={coverArtPreview} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600">
                                        <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                        <span className="text-xs font-black uppercase tracking-widest">Drop Image</span>
                                    </div>
                                )}
                                <input type="file" onChange={handleCoverArtChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>
                        </div>

                        <div className="bg-white/5 p-8 rounded-[3rem] border border-white/5 space-y-6">
                            <div>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Retail Price</p>
                                <div className="flex gap-2">
                                    {priceOptions.map(p => (
                                        <button key={p} type="button" onClick={() => setPrice(p)} className={`flex-1 py-4 rounded-2xl text-sm font-black italic tracking-tighter transition-all ${price === p ? 'bg-white text-black shadow-xl' : 'bg-white/5 text-gray-400'}`}>${p.toFixed(2)}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 space-y-4">
                                 <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2 text-center">Output Encoders</p>
                                 <label className="flex items-center justify-between group cursor-pointer p-1">
                                     <span className="text-[11px] sm:text-sm font-black text-gray-400 group-hover:text-white uppercase tracking-tighter">Lossless Matrix</span>
                                     <input type="checkbox" checked={isLossless} onChange={e => setIsLossless(e.target.checked)} className="w-5 h-5 accent-red-600 rounded-lg" />
                                 </label>
                                 <label className="flex items-center justify-between group cursor-pointer p-1">
                                     <span className="text-[11px] sm:text-sm font-black text-gray-400 group-hover:text-white uppercase tracking-tighter">Atmos Decoder</span>
                                     <input type="checkbox" checked={isDolbyAtmos} onChange={e => setIsDolbyAtmos(e.target.checked)} className="w-5 h-5 accent-red-600 rounded-lg" />
                                 </label>
                             </div>
                        </div>
                    </div>

                    <div className="space-y-8 flex flex-col justify-between">
                        <div className="space-y-8">
                            <div className="bg-white/5 p-8 rounded-[3rem] border border-white/5">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Launch Date (Friday)</p>
                                <button type="button" onClick={() => setIsPickingDate(true)} className="w-full bg-white/5 border border-white/10 p-6 rounded-3xl text-xl font-black italic uppercase tracking-tighter text-white text-left flex justify-between items-center group">
                                    <span>{releaseDate ? releaseDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : 'SELECT DATE'}</span>
                                    <svg className="w-5 h-5 text-red-600 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                                </button>
                                <p className="text-[9px] text-gray-600 mt-4 px-2 italic">Industry standard dictates all major assets sync on the global release cycle (Friday).</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 leading-none">Authorization Cost</p>
                                    <p className="text-5xl font-black text-black italic tracking-tighter leading-none">${totalCost.toLocaleString()}</p>
                                </div>
                                <button type="button" onClick={handleFinalRelease} className="bg-black text-white font-black px-10 py-5 rounded-full text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">Confirm & Upload</button>
                            </div>
                            <div className="flex justify-center">
                                <button type="button" onClick={onCancel} className="text-[10px] font-black uppercase text-gray-500 hover:text-white tracking-widest transition-colors">Discard Draft</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReleaseSetup;
