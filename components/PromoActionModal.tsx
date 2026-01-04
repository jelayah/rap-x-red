
import React, { useState, useMemo } from 'react';
import type { Player, Song, Album, Promotion, PromoInfo } from '../types';

interface PromoActionModalProps {
    promo: PromoInfo;
    player: Player;
    songs: Song[];
    albums: Album[];
    onClose: () => void;
    onLaunch: (newPromo: Promotion) => void;
}

const PromoActionModal: React.FC<PromoActionModalProps> = ({ promo, player, songs, albums, onClose, onLaunch }) => {
    const [targetId, setTargetId] = useState('');
    const [budgetMultiplier, setBudgetMultiplier] = useState(1);

    const availableTargets = useMemo(() => {
        if (promo.target === 'Song') {
            return songs.map(s => ({ id: s.id, title: s.title }));
        }
        if (promo.target === 'Album') {
            return albums.map(a => ({ id: a.id, title: a.title }));
        }
        return [...albums.map(a => ({id: a.id, title: `${a.title} (Album)`})), ...songs.map(s => ({ id: s.id, title: s.title }))];
    }, [promo.target, songs, albums]);

    const totalCost = promo.baseCost * budgetMultiplier;

    const handleLaunch = () => {
        if (availableTargets.length > 0 && !targetId && promo.target !== 'Any') {
            alert('Please select a target for this deployment.');
            return;
        }
        if (player.money < totalCost) {
            alert('Insufficient funds for this operation.');
            return;
        }

        const newPromo: Promotion = {
            id: `promo_${Date.now()}`,
            type: promo.type,
            targetId: targetId || 'player',
            budget: totalCost,
            weeksRemaining: promo.durationWeeks,
            data: {},
        };
        
        onLaunch(newPromo);
    };

    return (
        <div className="fixed inset-0 bg-black/95 z-[150] flex items-center justify-center p-4 backdrop-blur-2xl" onClick={onClose}>
            <div 
                className="bg-[#0a0a0c] w-full max-w-lg rounded-[3rem] shadow-[0_0_80px_rgba(220,38,38,0.15)] border border-white/5 overflow-hidden animate-fade-in-up" 
                onClick={e => e.stopPropagation()}
            >
                <div className="p-8 border-b border-white/5 bg-gradient-to-br from-white/5 to-transparent">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></div>
                        <p className="text-[9px] font-black uppercase tracking-[0.6em] text-red-500">Operation Briefing</p>
                    </div>
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">{promo.title}</h2>
                    <p className="text-gray-500 text-sm font-medium mt-2 leading-relaxed">{promo.description}</p>
                </div>

                <div className="p-8 space-y-8">
                    {promo.target !== 'Any' && availableTargets.length > 0 && (
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-4 px-2">Sync Target Asset</label>
                            <select 
                                value={targetId} 
                                onChange={e => setTargetId(e.target.value)} 
                                className="w-full bg-white/5 text-white p-5 rounded-3xl border border-white/10 outline-none appearance-none font-bold focus:border-red-600 transition-all"
                            >
                                <option value="">SELECT TARGET...</option>
                                {availableTargets.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                            </select>
                        </div>
                    )}

                    <div>
                        <div className="flex justify-between items-end mb-4 px-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Intensity Matrix</label>
                            <span className="text-red-500 font-black italic text-sm">{budgetMultiplier}X PUSH</span>
                        </div>
                        <div className="flex gap-2">
                            {[1, 2, 3, 5, 10].map(m => (
                                <button 
                                    key={m}
                                    onClick={() => setBudgetMultiplier(m)}
                                    className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${budgetMultiplier === m ? 'bg-white text-black border-white shadow-lg scale-105' : 'bg-white/5 text-gray-500 border-white/5 hover:border-white/20'}`}
                                >
                                    {m}x
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[3rem] shadow-2xl flex flex-col items-center">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] mb-2 leading-none text-center">Net Expenditure</p>
                        <p className="text-6xl font-black text-black italic tracking-tighter leading-none">${totalCost.toLocaleString()}</p>
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-6 italic">Term Duration: {promo.durationWeeks} Deployment Cycle(s)</p>
                    </div>

                    <div className="space-y-4">
                        <button 
                            onClick={handleLaunch}
                            className="w-full bg-red-600 text-white font-black py-5 rounded-2xl uppercase tracking-[0.3em] text-[11px] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-red-900/20"
                        >
                            Authorize Campaign
                        </button>
                        <button 
                            onClick={onClose}
                            className="w-full py-2 text-[9px] font-black uppercase text-gray-700 hover:text-white transition-colors"
                        >
                            Abort Briefing
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PromoActionModal;
