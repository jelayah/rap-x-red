
import React, { useState, useMemo } from 'react';
import type { Player, Song, Album, Promotion, PromoCategory, PromoInfo, SocialPost, Notification } from '../types';
import PromoActionModal from '../components/PromoActionModal';
import { PROMO_DATA } from '../constants';
import { PROMO_ICONS } from '../components/uiConstants';

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

const PromotionsScreen: React.FC<PromotionsScreenProps> = ({ player, setPlayer, songs, albums, promotions, setPromotions, gameDate, setNotifications }) => {
    const [activeTab, setActiveTab] = useState<'agency' | 'media'>('agency');
    const [selectedPromo, setSelectedPromo] = useState<PromoInfo | null>(null);

    const handleLaunchPromo = (newPromo: Promotion) => {
        setPlayer(p => p ? { ...p, money: p.money - newPromo.budget } : p);
        setPromotions(prev => [...prev, newPromo]);
        setSelectedPromo(null);
    };

    return (
        <div className="min-h-screen bg-[#07070B] relative overflow-hidden font-sans">
            {selectedPromo && (
                <PromoActionModal
                    promo={selectedPromo}
                    player={player}
                    songs={songs.filter(s => s.isReleased)}
                    albums={albums.filter(a => !a.scheduledReleaseDate)}
                    onClose={() => setSelectedPromo(null)}
                    onLaunch={handleLaunchPromo}
                />
            )}

            <div className="relative z-10 p-4 sm:p-12 space-y-10 pb-40 max-w-5xl mx-auto">
                <header className="border-b-4 sm:border-b-8 border-white pb-8 sm:pb-12">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></div>
                        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.6em] text-red-500">Global Hype Agency</p>
                    </div>
                    <h1 className="text-6xl sm:text-[10rem] font-black tracking-tighter uppercase leading-none italic drop-shadow-2xl">PROMO</h1>
                </header>

                <div className="flex bg-[#12121e] rounded-[2rem] p-1 gap-1 border border-white/5 shadow-inner">
                    <button onClick={() => setActiveTab('agency')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all ${activeTab === 'agency' ? 'bg-white text-black shadow-2xl' : 'text-gray-600'}`}>Agency Dashboard</button>
                    <button onClick={() => setActiveTab('media')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all ${activeTab === 'media' ? 'bg-white text-black shadow-2xl' : 'text-gray-600'}`}>Media Circuit</button>
                </div>

                <main className="animate-fade-in">
                    {activeTab === 'agency' ? (
                        <div className="space-y-12">
                            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5">
                                    <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Active Runs</p>
                                    <p className="text-2xl font-black text-white italic">{promotions.length}</p>
                                </div>
                                <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5">
                                    <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Agency Rep</p>
                                    <p className="text-2xl font-black text-red-500 italic">{player.reputation}</p>
                                </div>
                                <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 col-span-2">
                                    <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">PR Capital</p>
                                    <p className="text-2xl font-black text-green-400 italic">${player.money.toLocaleString()}</p>
                                </div>
                            </section>

                            {promotions.length > 0 && (
                                <section className="space-y-4">
                                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 px-2">Deployment Status</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {promotions.map(p => {
                                            const info = PROMO_DATA.find(pd => pd.type === p.type);
                                            return (
                                                <div key={p.id} className="bg-[#1e1e2d] p-5 rounded-3xl border border-white/5 flex justify-between items-center group">
                                                    <div>
                                                        <p className="font-black text-sm uppercase italic text-white">{info?.title}</p>
                                                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter mt-1">{p.weeksRemaining} Cycle(s) Remaining</p>
                                                    </div>
                                                    <div className="w-12 h-12 bg-black/40 rounded-2xl flex items-center justify-center border border-white/10">
                                                        <span className="text-red-500 font-black text-xs">{Math.round((p.weeksRemaining / (info?.durationWeeks || 1)) * 100)}%</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>
                            )}

                            <div className="space-y-10">
                                {(['industry', 'boosts', 'organic'] as PromoCategory[]).map(cat => (
                                    <section key={cat} className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500">{cat} Operations</h3>
                                            <div className="h-[1px] flex-grow bg-white/5"></div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {PROMO_DATA.filter(p => p.category === cat).map(promo => {
                                                const Icon = PROMO_ICONS[promo.type];
                                                const isActive = promotions.some(p => p.type === promo.type);
                                                return (
                                                    <button 
                                                        key={promo.type}
                                                        onClick={() => !isActive && setSelectedPromo(promo)}
                                                        disabled={isActive}
                                                        className={`p-6 rounded-[2.5rem] border text-left flex items-start gap-5 transition-all group ${isActive ? 'bg-black/40 border-white/5 opacity-50 cursor-not-allowed' : 'bg-[#12121e] border-white/5 hover:border-red-600/40 hover:bg-[#181828]'}`}
                                                    >
                                                        <div className="p-4 bg-black/50 rounded-2xl border border-white/5 group-hover:border-red-600/30 transition-colors">
                                                            <Icon className="w-8 h-8 text-gray-400 group-hover:text-red-500 transition-colors" />
                                                        </div>
                                                        <div className="min-w-0 flex-grow">
                                                            <div className="flex justify-between items-start mb-1">
                                                                <h4 className="font-black text-base uppercase italic tracking-tighter text-white truncate">{promo.title}</h4>
                                                                <span className="text-green-400 font-bold text-xs tabular-nums">${promo.baseCost.toLocaleString()}</span>
                                                            </div>
                                                            <p className="text-[10px] text-gray-500 font-medium leading-relaxed line-clamp-2">{promo.description}</p>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </section>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="py-20 flex flex-col items-center justify-center text-center space-y-6 animate-pulse">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-600"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                            </div>
                            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">ACCESS RESTRICTED</h2>
                            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest max-w-sm">The Global Media Circuit protocols are currently under reconstruction. Await further sync.</p>
                            <div className="h-[2px] w-20 bg-red-600/30 rounded-full mt-4"></div>
                        </div>
                    )}
                </main>

                <footer className="py-20 text-center opacity-10">
                    <p className="text-[9px] font-black uppercase tracking-[0.8em]">PR Matrix 2.0 • Data Restricted Access</p>
                </footer>
            </div>
        </div>
    );
};

export default PromotionsScreen;
