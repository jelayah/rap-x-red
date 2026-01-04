
import React, { useCallback, useEffect, useState } from 'react';
import type { Player, ScheduleItem, Song, Notification, Playlist, Album, ChartData, MerchItem, GameEvent, Promotion, YearlySummaryData, GameStateBundle, Tour, ChartId, ChartEntry } from '../types';
import ProgressBar from '../components/ProgressBar';
import { MAX_ENERGY, CHART_NAMES } from '../constants';
import { generateIndustryEvent, generatePlaylists } from '../services/geminiService';
import EventModal from '../components/EventModal';
import WeeklyRewind from '../components/WeeklySummarySnap';
import { simulateWeek } from '../services/gameSimulation';
import YearlySummaryModal from '../components/YearlySummaryModal';

type GodModeTab = 'Stats' | 'Skills';

const toDate = (d: any) => (d instanceof Date ? d : new Date(d));

interface GodModeModalProps {
    player: Player;
    setPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
    onClose: () => void;
}

const GodModeModal: React.FC<GodModeModalProps> = ({ player, setPlayer, onClose }) => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [password, setPassword] = useState('');
    const [money, setMoney] = useState(player.money);
    const [reputation, setReputation] = useState(player.reputation);
    const [listeners, setListeners] = useState(player.monthlyListeners);
    const [skills, setSkills] = useState(player.skills);
    const [activeTab, setActiveTab] = useState<GodModeTab>('Stats');

    const handleAuth = (e: React.FormEvent) => {
        e.preventDefault();
        if (password.toLowerCase() === '2025redx!') {
            setIsAuthorized(true);
        } else {
            alert("ACCESS DENIED: Unauthorized Protocol.");
            onClose();
        }
    };

    const handleSave = () => {
        setPlayer(p => p ? { ...p, money, reputation, monthlyListeners: listeners, skills } : null);
        onClose();
    };
    
    const handleSkillChange = (skill: keyof Player['skills'], value: number) => {
        setSkills(s => ({ ...s, [skill]: value }));
    };

    if (!isAuthorized) {
        return (
            <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 z-[200]">
                <div className="bg-[#0D0C1D] w-full max-w-sm rounded-[2.5rem] border border-red-600/30 p-10 shadow-2xl animate-fade-in-up">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-600/20">
                            <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7a5 5 0 00-5-5zM9 7a3 3 0 016 0v3H9V7zm3 11a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"/></svg>
                        </div>
                        <h2 className="text-2xl font-black italic tracking-tighter text-white uppercase">Access Gated</h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mt-1">Admin Authorization Required</p>
                    </div>
                    <form onSubmit={handleAuth} className="space-y-4">
                        <input 
                            type="password" 
                            placeholder="PROTOCOL CODE" 
                            className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-center text-white font-black tracking-[0.4em] outline-none focus:border-red-600 transition-all"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            autoFocus
                        />
                        <button type="submit" className="w-full bg-red-600 text-white font-black py-4 rounded-full text-xs uppercase tracking-widest shadow-xl">Verify Protocol</button>
                        <button type="button" onClick={onClose} className="w-full py-2 text-[10px] font-black uppercase text-gray-600 hover:text-white">Cancel</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-[200]">
            <div className="bg-[#0D0C1D] w-full max-w-md rounded-[3rem] shadow-2xl border border-yellow-500/20 overflow-hidden animate-fade-in-up">
                <div className="p-8">
                    <h2 className="text-3xl font-black italic tracking-tighter text-yellow-400 mb-6 uppercase">System Override</h2>
                    <div className="flex bg-white/5 p-1 rounded-2xl mb-8">
                        <button onClick={() => setActiveTab('Stats')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'Stats' ? 'bg-white text-black shadow-lg' : 'text-gray-500'}`}>Core Stats</button>
                        <button onClick={() => setActiveTab('Skills')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'Skills' ? 'bg-white text-black shadow-lg' : 'text-gray-500'}`}>Skill matrix</button>
                    </div>
                    
                    <div className="space-y-8">
                        {activeTab === 'Stats' ? (
                            <div className="space-y-8 animate-fade-in">
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Liquidity</label>
                                        <span className="text-white font-black font-mono text-sm">${money.toLocaleString()}</span>
                                    </div>
                                    <input type="range" min="0" max="10000000" step="10000" value={money} onChange={e => setMoney(Number(e.target.value))} className="w-full accent-yellow-400 h-1 bg-white/10 rounded-full appearance-none" />
                                </div>
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Industry Rep</label>
                                        <span className="text-white font-black font-mono text-sm">{reputation}</span>
                                    </div>
                                    <input type="range" min="0" max="100" value={reputation} onChange={e => setReputation(Number(e.target.value))} className="w-full accent-yellow-400 h-1 bg-white/10 rounded-full appearance-none" />
                                </div>
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Active Listeners</label>
                                        <span className="text-white font-black font-mono text-sm">{listeners.toLocaleString()}</span>
                                    </div>
                                    <input type="range" min="0" max="50000000" step="100000" value={listeners} onChange={e => setListeners(Number(e.target.value))} className="w-full accent-yellow-400 h-1 bg-white/10 rounded-full appearance-none" />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-fade-in max-h-[300px] overflow-y-auto pr-3 scrollbar-hide">
                                {Object.entries(skills).map(([skill, value]) => (
                                    <div key={skill} className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <div className="flex justify-between mb-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 capitalize">{skill}</label>
                                            <span className="text-white font-black text-sm">{value}</span>
                                        </div>
                                        <input type="range" min="0" max="100" value={value} onChange={e => handleSkillChange(skill as keyof Player['skills'], Number(e.target.value))} className="w-full accent-yellow-400 h-1 bg-white/10 rounded-full appearance-none" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4 mt-12">
                        <button onClick={onClose} className="flex-1 py-4 text-[10px] font-black uppercase text-gray-500 hover:text-white transition-colors">Discard</button>
                        <button onClick={handleSave} className="flex-[2] bg-yellow-400 text-black font-black py-4 rounded-full text-[10px] uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all">Write System Data</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SimulatingLoader: React.FC<{ isYear: boolean }> = ({ isYear }) => (
    <div className="fixed inset-0 bg-[#07070B]/98 flex flex-col items-center justify-center z-[200] text-center p-8 backdrop-blur-xl">
        <div className="relative mb-12">
            <div className="w-24 h-24 border-[3px] border-red-600/10 border-t-red-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-red-600 font-black text-xl italic tracking-tighter">RED</span>
            </div>
        </div>
        <h2 className="text-4xl sm:text-5xl font-black italic tracking-tighter text-white uppercase leading-none">
            {isYear ? "Simulating Era" : "Syncing Week"}
        </h2>
        <div className="mt-4 flex items-center gap-3 animate-pulse">
            <span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-red-500"></span>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-red-500">{isYear ? "FISCAL YEAR DATA SYNC" : "MARKET INTELLIGENCE CACHING"}</p>
            <span className="h-[1px] w-8 bg-gradient-to-l from-transparent to-red-500"></span>
        </div>
    </div>
)

interface WeeklySummary {
    totalStreams: number;
    topSongs: Song[];
    topAlbums: Album[];
}

interface ProgressScreenProps {
    player: Player;
    setPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
    songs: Song[];
    setSongs: React.Dispatch<React.SetStateAction<Song[]>>;
    albums: Album[];
    setAlbums: React.Dispatch<React.SetStateAction<Album[]>>;
    merch: MerchItem[];
    setMerch: React.Dispatch<React.SetStateAction<MerchItem[]>>;
    promotions: Promotion[];
    setPromotions: React.Dispatch<React.SetStateAction<Promotion[]>>;
    schedule: ScheduleItem[];
    setSchedule: React.Dispatch<React.SetStateAction<ScheduleItem[]>>;
    tours: Tour[];
    setTours: React.Dispatch<React.SetStateAction<Tour[]>>;
    gameDate: Date;
    setGameDate: React.Dispatch<React.SetStateAction<Date>>;
    events: { title: string; description: string }[];
    setEvents: React.Dispatch<React.SetStateAction<{ title: string; description: string }[]>>;
    notifications: Notification[];
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
    playlists: Playlist[];
    setPlaylists: React.Dispatch<React.SetStateAction<Playlist[]>>;
    npcSongs: Song[];
    setNpcSongs: React.Dispatch<React.SetStateAction<Song[]>>;
    npcAlbums: Album[];
    setNpcAlbums: React.Dispatch<React.SetStateAction<Album[]>>;
    chartsData: ChartData;
    setChartsData: React.Dispatch<React.SetStateAction<ChartData>>;
    onSaveGame?: () => void;
}

const restoreDatesFromBundle = (state: GameStateBundle): void => {
    state.gameDate = toDate(state.gameDate);
    const restoreItemDates = (item: any) => {
        if (item.releaseDate) item.releaseDate = toDate(item.releaseDate);
        if (item.scheduledReleaseDate) item.scheduledReleaseDate = toDate(item.scheduledReleaseDate);
        if (item.videoReleaseDate) item.videoReleaseDate = toDate(item.videoReleaseDate);
        if (item.chartHistory) {
            for (const chartId in item.chartHistory) {
                const history = item.chartHistory[chartId as ChartId];
                if (history && history.peakDate) {
                    history.peakDate = toDate(history.peakDate);
                }
            }
        }
        if (item.date) item.date = toDate(item.date);
        if (item.announcementDate) item.announcementDate = toDate(item.announcementDate);
        if (item.certifications) {
            item.certifications.forEach((c: any) => c.date = toDate(c.date));
        }
    };
    state.songs.forEach(restoreItemDates);
    state.albums.forEach(restoreItemDates);
    state.npcSongs.forEach(restoreItemDates);
    state.npcAlbums.forEach(restoreItemDates);
    state.tours.forEach(tour => {
        restoreItemDates(tour);
        tour.stops.forEach(restoreItemDates);
    });
    state.notifications.forEach(n => n.date = toDate(n.date));
};


const ProgressScreen: React.FC<ProgressScreenProps> = ({ player, setPlayer, songs, setSongs, albums, setAlbums, merch, setMerch, promotions, setPromotions, schedule, setSchedule, tours, setTours, gameDate, setGameDate, events, setEvents, notifications, setNotifications, playlists, setPlaylists, npcSongs, setNpcSongs, npcAlbums, setNpcAlbums, chartsData, setChartsData, onSaveGame }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'notifications' | 'settings'>('overview');
    const [isGodMode, setIsGodMode] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false);
    const [isSimulatingYear, setIsSimulatingYear] = useState(false);
    const [gameEvents, setGameEvents] = useState<GameEvent[]>([]);
    const [weeklySummary, setWeeklySummary] = useState<WeeklySummary | null>(null);
    const [yearlySummaryData, setYearlySummaryData] = useState<YearlySummaryData | null>(null);

    const handleEventResponse = (event: GameEvent, accepted: boolean) => {
        if (accepted) {
            setPlayer(p => p ? { ...p, money: p.money + event.offer.payout, reputation: p.reputation + event.offer.reputationGain } : p);
            let message = `You accepted the offer from ${event.artist.name} and earned $${event.offer.payout.toLocaleString()}.`;
            
            if (event.type === 'feature_request') {
                message = `You've agreed to feature on "${event.songDetails?.title}" with ${event.artist.name}. They'll let you know when it's ready for release.`;
            }

            setNotifications(n => [{
                id: `event_accepted_${Date.now()}`,
                message: message,
                type: 'Event',
                date: new Date()
            }, ...n]);
        }
        setGameEvents(events => events.filter(e => e.id !== event.id));
    };

    const advanceWeek = useCallback(async () => {
        if (!player) return;
        setIsSimulating(true);

        const currentState: GameStateBundle = { player, songs, albums, merch, promotions, schedule, gameDate, events, notifications, playlists, npcSongs, npcAlbums, chartsData, gameEvents, tours };
        const { newState, newNotificationsForWeek, weeklySummarySongs } = await simulateWeek(currentState);

        setPlayer(newState.player);
        setSongs(newState.songs);
        setAlbums(newState.albums);
        setMerch(newState.merch);
        setPromotions(newState.promotions);
        setSchedule(newState.schedule);
        setTours(newState.tours);
        setGameDate(newState.gameDate);
        setEvents(newState.events);
        setNotifications(prev => [...newNotificationsForWeek, ...prev].slice(0, 50));
        setPlaylists(newState.playlists);
        setNpcSongs(newState.npcSongs);
        setNpcAlbums(newState.npcAlbums);
        setChartsData(newState.chartsData);
        setGameEvents(newState.gameEvents);
        
        const totalStreamsThisWeek = newState.songs.reduce((acc, s) => acc + (s.weeklyStreams || 0), 0);
        const top3AlbumsThisWeek = [...newState.albums]
            .filter(a => (a.weeklyUnitSales || 0) > 0)
            .sort((a,b) => (b.weeklyUnitSales || 0) - (a.weeklyUnitSales || 0))
            .slice(0, 3);

        setWeeklySummary({ 
            totalStreams: totalStreamsThisWeek,
            topSongs: weeklySummarySongs, // top 5
            topAlbums: top3AlbumsThisWeek // top 3
        });
        setIsSimulating(false);
    }, [player, songs, albums, merch, promotions, schedule, gameDate, events, notifications, playlists, npcSongs, npcAlbums, chartsData, gameEvents, tours]);

    const advanceYear = useCallback(async () => {
        if (!player) return;
        setIsSimulatingYear(true);

        const initialState: GameStateBundle = JSON.parse(JSON.stringify({ player, songs, albums, merch, promotions, schedule, gameDate, events, notifications, playlists, npcSongs, npcAlbums, chartsData, gameEvents, tours }));
        restoreDatesFromBundle(initialState);
        let currentGameState = { ...initialState };
        let yearlyNotifications: Notification[] = [];

        for (let i = 0; i < 51; i++) {
            const { newState, newNotificationsForWeek } = await simulateWeek(currentGameState, { fast: true });
            currentGameState = newState;
            yearlyNotifications.push(...newNotificationsForWeek);
        }

        const { newState: finalState, newNotificationsForWeek: finalWeekNotifications } = await simulateWeek(currentGameState);
        currentGameState = finalState;
        yearlyNotifications.push(...finalWeekNotifications);

        setPlayer(currentGameState.player);
        setSongs(currentGameState.songs);
        setAlbums(currentGameState.albums);
        setMerch(currentGameState.merch);
        setPromotions(currentGameState.promotions);
        setSchedule(currentGameState.schedule);
        setTours(currentGameState.tours);
        setGameDate(currentGameState.gameDate);
        setEvents(currentGameState.events);
        setNotifications(prev => [...yearlyNotifications, ...prev].slice(0, 100));
        setPlaylists(currentGameState.playlists);
        setNpcSongs(currentGameState.npcSongs);
        setNpcAlbums(currentGameState.npcAlbums);
        setChartsData(currentGameState.chartsData);
        setGameEvents(currentGameState.gameEvents);
        
        const summary = (initial: any, final: any, notifs: any[]) => {
             const songGrowth = final.songs.map((fs:any) => {
                const isong = initial.songs.find((s:any) => s.id === fs.id);
                return { title: fs.title, coverArt: fs.coverArt, streamsGained: (fs.rapifyStreams + fs.rappleStreams) - (isong ? (isong.rapifyStreams + isong.rappleStreams) : 0) };
             }).filter((s:any) => s.streamsGained > 0).sort((a:any, b:any) => b.streamsGained - a.streamsGained).slice(0, 5);
             const albumGrowth = final.albums.map((fa:any) => {
                const ialbum = initial.albums.find((a:any) => a.id === fa.id);
                return { title: fa.title, coverArt: fa.coverArt, unitsGained: fa.unitSales - (ialbum ? ialbum.unitSales : 0) };
             }).filter((a:any) => a.unitsGained > 0).sort((a:any, b:any) => b.unitsGained - a.unitsGained);
             return { year: final.gameDate.getFullYear() - 1, initialPlayerState: initial.player, finalPlayerState: final.player, topSongsByStreams: songGrowth, topAlbumByUnits: albumGrowth[0] || null, newRecords: notifs.filter(n => n.type === 'Record'), income: { music: 0, merch: 0, events: 0 }, expenses: { features: 0, production: 0, promotions: 0, merch: 0 } };
        };
        setYearlySummaryData(summary(initialState, currentGameState, yearlyNotifications));
        setIsSimulatingYear(false);
    }, [player, songs, albums, merch, promotions, schedule, gameDate, events, notifications, playlists, npcSongs, npcAlbums, chartsData, gameEvents, tours]);

    useEffect(() => {
        if (player && events.length === 0) generateIndustryEvent(player).then(event => setEvents([event]));
        if(player && playlists.length === 0) generatePlaylists(player, songs).then(setPlaylists);
    }, [player, events, setEvents, playlists.length, setPlaylists, songs]);

    if (!player) return <div>Loading...</div>;

    const pendingEvent = gameEvents.length > 0 ? gameEvents[0] : null;

    return (
        <div className="min-h-screen bg-[#07070B] relative overflow-hidden font-sans">
            {/* Background elements consistent with Home */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-600/5 blur-[120px] rounded-full animate-pulse pointer-events-none"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-10 pointer-events-none"></div>

            <div className="relative z-10 p-4 sm:p-12 space-y-8 sm:space-y-10 pb-40">
                {(isSimulating || isSimulatingYear) && <SimulatingLoader isYear={isSimulatingYear} />}
                {weeklySummary && <WeeklyRewind summary={weeklySummary} onClose={() => setWeeklySummary(null)} />}
                {yearlySummaryData && <YearlySummaryModal summary={yearlySummaryData} onClose={() => setYearlySummaryData(null)} />}
                {isGodMode && <GodModeModal player={player} setPlayer={setPlayer} onClose={() => setIsGodMode(false)} />}
                {pendingEvent && <EventModal event={pendingEvent} onResponse={handleEventResponse} />}

                <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-4 sm:border-b-8 border-white pb-6 sm:pb-10 gap-6">
                    <div className="animate-fade-in w-full">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></div>
                            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.6em] text-red-500">Live Executive Feed</p>
                        </div>
                        <h1 className="text-6xl sm:text-9xl font-black tracking-tighter uppercase leading-none italic drop-shadow-2xl">
                            DASHBOARD
                        </h1>
                    </div>
                    <div className="flex items-center gap-3 animate-fade-in delay-200">
                        <button onClick={onSaveGame} className="group relative p-4 bg-white/5 rounded-2xl border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all shadow-xl active:scale-95 flex items-center gap-2">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-.53 14.03a.75.75 0 001.06 0l3-3a.75.75 0 10-1.06-1.06l-1.72 1.72V8.25a.75.75 0 00-1.5 0v5.69l-1.72-1.72a.75.75 0 00-1.06 1.06l3 3z"/></svg>
                            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline group-hover:inline">Save Game</span>
                        </button>
                        <button onClick={() => setIsGodMode(true)} className="p-4 bg-white/5 rounded-2xl border border-white/5 text-yellow-500/30 hover:text-yellow-400 hover:bg-yellow-400/5 transition-all shadow-xl active:scale-95">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.963 2.286a.75.75 0 00-1.071 1.071L12.963 2.286zM21.75 12c0 .414.336.75.75.75s.75-.336.75-.75h-1.5zM12 21.75a.75.75 0 01-.75.75.75.75 0 010-1.5 1.5 1.5 0 001.5 1.5.75.75 0 010 1.5zM2.25 12a.75.75 0 01-.75-.75c0-.414.336.75.75-.75v1.5zm9.687-8.642a.75.75 0 00-1.071-1.071l1.07 1.07zM12 2.25A9.75 9.75 0 0121.75 12h1.5A11.25 11.25 0 0012 .75v1.5zM21.75 12A9.75 9.75 0 0112 21.75v1.5A11.25 11.25 0 0023.25 12h-1.5zM12 21.75A9.75 9.75 0 012.25 12v-1.5A11.25 11.25 0 0012 23.25v-1.5zM2.25 12A9.75 9.75 0 0111.963 2.286l-1.07-1.071A11.25 11.25 0 00.75 12v1.5z"/></svg>
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
                    <div className="bg-white/5 p-6 sm:p-8 rounded-[2.5rem] sm:rounded-[3rem] border border-white/10 shadow-2xl md:col-span-2 group hover:border-red-600/30 transition-all duration-500">
                        <div className="flex items-center gap-2 mb-2">
                             <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest leading-none">Net Liquidity</span>
                             <div className="h-[1px] flex-grow bg-white/5"></div>
                        </div>
                        <p className="text-5xl sm:text-8xl font-black text-white italic tracking-tighter leading-none shadow-[0_0_20px_rgba(255,255,255,0.05)]">${player.money.toLocaleString()}</p>
                    </div>
                    <div className="bg-[#12121e] p-6 sm:p-8 rounded-[2.5rem] sm:rounded-[3rem] border border-white/10 shadow-2xl flex flex-col justify-center">
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2 leading-none">Fiscal Period</p>
                        <p className="text-2xl sm:text-3xl font-black text-red-500 italic tracking-tighter uppercase leading-none">{toDate(gameDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up delay-100">
                    <div className="bg-white/5 p-6 sm:p-8 rounded-[3rem] sm:rounded-[3.5rem] border border-white/5 space-y-8 sm:space-y-10">
                        <ProgressBar label="Bio-Energy" value={player.energy} max={MAX_ENERGY} colorClass="bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
                        <ProgressBar label="Industry Clout" value={player.reputation} max={100} colorClass="bg-white shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
                    </div>
                    <div className="bg-white/5 p-6 sm:p-8 rounded-[3rem] sm:rounded-[3.5rem] border border-white/5 flex flex-col justify-center items-center gap-4">
                        <button onClick={advanceWeek} disabled={isSimulatingYear} className="w-full py-5 sm:py-6 bg-white text-black font-black uppercase tracking-[0.3em] rounded-full shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30">Advance Week</button>
                        <button onClick={advanceYear} disabled={isSimulating} className="w-full py-3 bg-red-600/10 text-red-500 text-[10px] font-black uppercase tracking-[0.4em] rounded-full hover:bg-red-600 hover:text-white transition-all disabled:opacity-20 border border-red-600/20">Jump Fiscal Year</button>
                    </div>
                </div>

                <div className="bg-[#12121e] p-8 sm:p-10 rounded-[3rem] sm:rounded-[4rem] border border-white/5 shadow-2xl relative overflow-hidden animate-fade-in-up delay-200">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] scale-150 rotate-12 pointer-events-none">
                        <svg className="w-64 h-64" fill="white" viewBox="0 0 24 24"><path d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"/></svg>
                    </div>
                    <div className="flex items-center gap-3 mb-8 sm:mb-10">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></div>
                        <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-gray-500">Market Intelligence Briefing</h2>
                    </div>
                    <div className="space-y-6 sm:space-y-8 relative z-10">
                        {events.length > 0 ? events.map((event, index) => (
                            <div key={index} className="border-l-4 border-red-600/30 pl-6 sm:pl-8 group">
                                <h3 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tighter text-white group-hover:text-red-500 transition-all duration-300">{event.title}</h3>
                                <p className="text-sm text-gray-500 font-medium leading-relaxed mt-3 max-w-2xl">{event.description}</p>
                            </div>
                        )) : <p className="text-gray-700 italic text-sm font-black uppercase tracking-widest">Scanning network for fresh data...</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in-up delay-300">
                     <button onClick={() => setActiveTab('notifications')} className={`p-6 sm:p-8 rounded-[2.5rem] sm:rounded-[3rem] border transition-all duration-500 ${activeTab === 'notifications' ? 'bg-white text-black border-white shadow-2xl scale-[1.02]' : 'bg-white/5 text-gray-600 border-white/5 hover:bg-white/10'}`}>
                        <p className="text-xs font-black uppercase tracking-[0.3em]">Communication</p>
                        <p className={`text-[10px] font-bold mt-2 uppercase tracking-widest ${activeTab === 'notifications' ? 'opacity-40' : 'opacity-60'}`}>{notifications.length} Unread Alerts</p>
                     </button>
                     <button onClick={() => setActiveTab('settings')} className={`p-6 sm:p-8 rounded-[2.5rem] sm:rounded-[3rem] border transition-all duration-500 ${activeTab === 'settings' ? 'bg-white text-black border-white shadow-2xl scale-[1.02]' : 'bg-white/5 text-gray-600 border-white/5 hover:bg-white/10'}`}>
                        <p className="text-xs font-black uppercase tracking-[0.3em]">Preferences</p>
                        <p className={`text-[10px] font-bold mt-2 uppercase tracking-widest ${activeTab === 'settings' ? 'opacity-40' : 'opacity-60'}`}>System Logic</p>
                     </button>
                </div>

                {activeTab === 'notifications' && (
                    <div className="bg-[#12121e] p-6 sm:p-10 rounded-[3rem] sm:rounded-[3.5rem] border border-white/5 animate-fade-in-up">
                        <div className="space-y-4 max-h-[400px] sm:max-h-[500px] overflow-y-auto pr-4 scrollbar-hide">
                            {notifications.length > 0 ? notifications.map((notif) => (
                                <div key={notif.id} className="bg-black/30 p-5 sm:p-6 rounded-3xl border border-white/5 group hover:border-red-600/20 transition-all duration-500">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">{notif.type} • {toDate(notif.date).toLocaleDateString()}</p>
                                    </div>
                                    <p className="text-sm font-medium leading-relaxed text-gray-300">{notif.message}</p>
                                </div>
                            )) : <p className="text-center text-gray-800 py-20 font-black uppercase italic tracking-widest text-xs">Inbox clear. Focus on production.</p>}
                        </div>
                    </div>
                )}
            </div>
            
            <footer className="absolute bottom-8 left-0 right-0 text-center opacity-10 pointer-events-none hidden sm:block">
                <p className="text-[8px] font-black text-gray-500 uppercase tracking-[0.8em]">SECURE CHANNEL • RAP X RED OPERATIONS</p>
            </footer>
        </div>
    );
};

export default ProgressScreen;
