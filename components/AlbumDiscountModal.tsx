
import React, { useState } from 'react';
import type { Album } from '../types';

interface AlbumDiscountModalProps {
    album: Album;
    onClose: () => void;
    onDiscount: (album: Album, newPrice: number) => void;
}

const AlbumDiscountModal: React.FC<AlbumDiscountModalProps> = ({ album, onClose, onDiscount }) => {
    const [selectedTier, setSelectedTier] = useState<number>(0.10);

    const strategies = [
        { label: 'Market Correction', value: 0.10, desc: 'Subtle adjustment to stimulate catalog movement.', risk: 'Minimal Margin Impact' },
        { label: 'Strategic Push', value: 0.20, desc: 'Aggressive pricing to secure higher chart positioning.', risk: 'Moderate Margin Impact' },
        { label: 'Flash Liquidation', value: 0.40, desc: 'Massive volume surge to break records or clear inventory.', risk: 'High Margin Impact' }
    ];

    const currentPrice = album.price;
    const calculateNewPrice = (discount: number) => parseFloat((currentPrice * (1 - discount)).toFixed(2));

    return (
        <div className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-4 backdrop-blur-2xl" onClick={onClose}>
            <div className="bg-[#0D0C1D] w-full max-w-xl rounded-[3rem] border border-white/10 p-10 shadow-2xl animate-fade-in-up" onClick={e => e.stopPropagation()}>
                <header className="mb-10 text-center">
                    <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 bg-yellow-500/10 rounded-full border border-yellow-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-yellow-500">Retail Pricing Strategy</p>
                    </div>
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">RE-PRICE ASSET</h2>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em] mt-2">"{album.title}"</p>
                </header>

                <div className="space-y-4">
                    {strategies.map((strat) => {
                        const newPrice = calculateNewPrice(strat.value);
                        const isSelected = selectedTier === strat.value;
                        return (
                            <button
                                key={strat.value}
                                onClick={() => setSelectedTier(strat.value)}
                                className={`w-full p-6 rounded-[2rem] border text-left transition-all group relative overflow-hidden ${
                                    isSelected 
                                    ? 'bg-white border-white text-black shadow-2xl scale-[1.02]' 
                                    : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-2 relative z-10">
                                    <div>
                                        <p className="font-black text-lg uppercase italic tracking-tighter">{strat.label}</p>
                                        <p className={`text-[10px] font-bold uppercase ${isSelected ? 'text-gray-600' : 'text-gray-500'}`}>{strat.desc}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-black italic leading-none">${newPrice}</p>
                                        <p className="text-[9px] font-black uppercase opacity-60 mt-1">-{strat.value * 100}%</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-4 relative z-10">
                                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${isSelected ? 'bg-black/10 text-black' : 'bg-white/5 text-gray-500'}`}>
                                        {strat.risk}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="mt-10 bg-white/5 p-8 rounded-[2.5rem] border border-white/5 text-center">
                    <p className="text-[10px] font-bold text-yellow-500/80 uppercase tracking-widest leading-relaxed">
                        Applying this strategy will initiate a <span className="text-white font-black italic">2-week consumption multiplier</span>. Profits per unit will decrease, but aggregate volume velocity is projected to increase.
                    </p>
                </div>

                <div className="mt-10 flex gap-4">
                    <button onClick={onClose} className="flex-1 py-4 text-[11px] font-black uppercase text-gray-600 hover:text-white transition-colors">Abort Logic</button>
                    <button 
                        onClick={() => onDiscount(album, calculateNewPrice(selectedTier))}
                        className="flex-[2] bg-white text-black font-black py-5 rounded-full text-[11px] uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
                    >
                        Execute Deployment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlbumDiscountModal;
