
import React, { useState, useMemo } from 'react';
import type { Player, Tour, TourStop, Venue, Song, Album } from '../types';
import { VENUES } from '../data/venues';

const formatMoney = (amount: number) => `$${amount.toLocaleString()}`;

const generateAutoPoster = (tourName: string, artistName: string): string => {
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1400;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    const grad = ctx.createRadialGradient(500, 700, 0, 500, 700, 1000);
    grad.addColorStop(0, '#7F00FF');
    grad.addColorStop(0.5, '#5533FF');
    grad.addColorStop(1, '#000000');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1000, 1400);

    ctx.textAlign = 'center';
    ctx.font = '900 120px Inter, sans-serif';
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 4;
    ctx.strokeText(artistName.toUpperCase(), 500, 200);

    ctx.font = '900 160px Inter, sans-serif';
    ctx.fillStyle = 'white';
    tourName.toUpperCase().split(' ').forEach((word, i) => ctx.fillText(word, 500, 600 + i * 180));

    ctx.font = '700 30px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fillText("L I V E   N A T I O N   P R E S E N T S", 500, 1300);

    return canvas.toDataURL('image/jpeg', 0.9);
};

const CreateTourModal: React.FC<{ onClose: () => void; onCreate: (name: string) => void }> = ({ onClose, onCreate }) => {
    const [name, setName] = useState('');
    return (
        <div className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-4 backdrop-blur-2xl">
            <div className="bg-[#0a0a0c] w-full max-w-sm rounded-[2.5rem] border border-white/10 p-6 sm:p-8 shadow-2xl animate-fade-in-up">
                <header className="mb-6 sm:mb-8 text-center sm:text-left">
                    <p className="text-[#fa2d48] font-black uppercase tracking-[0.4em] text-[8px] mb-2">New Era Initialized</p>
                    <h2 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tighter text-white">Tour Identity</h2>
                </header>
                <div className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-3">Era Designation</label>
                        <input 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                            placeholder="e.g. Utopia World Tour" 
                            className="w-full bg-white/5 border border-white/10 p-4 sm:p-5 rounded-2xl text-white font-black italic uppercase tracking-tighter focus:border-indigo-600 outline-none transition-all"
                            autoFocus
                        />
                    </div>
                    <button 
                        disabled={!name.trim()}
                        onClick={() => onCreate(name)}
                        className="w-full bg-white text-black font-black py-4 rounded-full text-xs uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30"
                    >
                        Initialize Era
                    </button>
                    <button onClick={onClose} className="w-full py-2 text-[10px] font-black uppercase text-gray-600 hover:text-white transition-colors">Abort</button>
                </div>
            </div>
        </div>
    );
};

const SetlistModal: React.FC<{ 
    songs: Song[]; 
    currentSetlist: string[]; 
    onClose: () => void; 
    onSave: (songIds: string[]) => void 
}> = ({ songs, currentSetlist, onClose, onSave }) => {
    const [selectedIds, setSelectedIds] = useState<string[]>(currentSetlist);
    const releasedSongs = useMemo(() => songs.filter(s => s.isReleased), [songs]);

    const toggleSong = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    return (
        <div className="fixed inset-0 bg-black/95 z-[150] flex items-center justify-center p-4 backdrop-blur-2xl">
            <div className="bg-[#0a0a0c] w-full max-w-lg rounded-[2.5rem] border border-white/10 flex flex-col max-h-[85vh] shadow-2xl overflow-hidden animate-fade-in-up">
                <header className="p-6 border-b border-white/5 flex justify-between items-center bg-black/50">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black italic uppercase tracking-tighter">Setlist Control</h2>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{selectedIds.length} Tracks Locked</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth={3}/></svg></button>
                </header>
                <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
                    {releasedSongs.length > 0 ? releasedSongs.map(song => (
                        <button 
                            key={song.id} 
                            onClick={() => toggleSong(song.id)}
                            className={`w-full p-4 rounded-2xl border text-left flex items-center gap-4 transition-all ${selectedIds.includes(song.id) ? 'bg-indigo-600 border-white text-white' : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'}`}
                        >
                            <img src={song.coverArt || ''} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                            <div className="min-w-0">
                                <p className="font-black text-sm uppercase italic tracking-tighter truncate">{song.title}</p>
                                <p className="text-[8px] font-bold uppercase opacity-60">Quality: {song.quality}</p>
                            </div>
                            <div className="ml-auto">
                                {selectedIds.includes(song.id) ? (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                ) : (
                                    <span className="text-[8px] font-black uppercase opacity-40">Add</span>
                                )}
                            </div>
                        </button>
                    )) : (
                        <div className="text-center py-20 text-gray-700 font-black uppercase italic tracking-widest text-[10px]">No authorized tracks available.</div>
                    )}
                </div>
                <div className="p-6 bg-black/80 border-t border-white/5">
                    <button 
                        onClick={() => onSave(selectedIds)}
                        className="w-full py-4 rounded-full bg-white text-black font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all"
                    >
                        Save Configuration
                    </button>
                </div>
            </div>
        </div>
    );
};

const AddStopModal: React.FC<{ 
    player: Player; 
    onClose: () => void; 
    onAdd: (venue: Venue, price: number) => void;
    currentStops: TourStop[];
}> = ({ player, onClose, onAdd, currentStops }) => {
    const [regionFilter, setRegionFilter] = useState<Venue['region']>('North America');
    const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
    const [price, setPrice] = useState(45);

    const filteredVenues = useMemo(() => 
        VENUES.filter(v => v.region === regionFilter && !currentStops.some(s => s.venue.id === v.id)),
    [regionFilter, currentStops]);

    return (
        <div className="fixed inset-0 bg-black/95 z-[150] flex items-center justify-center p-4 backdrop-blur-2xl">
            <div className="bg-[#0a0a0c] w-full max-w-2xl rounded-[3rem] border border-white/10 flex flex-col max-h-[90vh] shadow-2xl overflow-hidden animate-fade-in-up">
                <header className="p-6 sm:p-8 border-b border-white/5 flex justify-between items-center bg-black/50">
                    <h2 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tighter">Plan Route</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M6 18L18 6M6 6l12 12" /></svg></button>
                </header>
                
                <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 sm:space-y-8 scrollbar-hide">
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {(['North America', 'Europe', 'Asia', 'Africa', 'South America', 'Oceania'] as const).map(r => (
                            <button key={r} onClick={() => setRegionFilter(r)} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap border transition-all ${regionFilter === r ? 'bg-white text-black border-white' : 'bg-white/5 text-gray-500 border-white/5 hover:border-white/20'}`}>{r}</button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {filteredVenues.map(venue => {
                            const isLocked = player.monthlyListeners < venue.listenerRequirement;
                            return (
                                <button 
                                    key={venue.id} 
                                    disabled={isLocked}
                                    onClick={() => setSelectedVenue(venue)}
                                    className={`p-5 sm:p-6 rounded-[2rem] border text-left flex flex-col justify-between transition-all ${selectedVenue?.id === venue.id ? 'bg-indigo-600 border-white text-white' : isLocked ? 'bg-black opacity-40 cursor-not-allowed border-white/5' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                                >
                                    <div>
                                        <p className="font-black text-base sm:text-lg uppercase italic tracking-tighter truncate">{venue.name}</p>
                                        <p className="text-[9px] sm:text-[10px] font-bold uppercase opacity-60 mt-1">{venue.city}, {venue.type}</p>
                                    </div>
                                    <div className="mt-4 flex justify-between items-end">
                                        <div>
                                            <p className="text-[7px] sm:text-[8px] font-black uppercase opacity-60">Capacity</p>
                                            <p className="text-xs sm:text-sm font-black">{venue.capacity.toLocaleString()}</p>
                                        </div>
                                        {isLocked && <p className="text-[7px] sm:text-[8px] font-black text-red-500 uppercase">Req: {venue.listenerRequirement.toLocaleString()} Listeners</p>}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {selectedVenue && (
                        <div className="bg-[#12121e] p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-indigo-600/30 animate-fade-in">
                            <h3 className="text-[9px] sm:text-[10px] font-black uppercase text-gray-500 tracking-widest mb-4 px-1">Pricing Strategy</h3>
                            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                                <div className="flex-1 w-full">
                                    <input type="range" min="10" max="1000" step="5" value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full accent-indigo-500 h-1 bg-white/10 rounded-full appearance-none" />
                                    <div className="flex justify-between mt-3 text-[9px] font-black uppercase text-gray-600"><span>Budget ($10)</span><span>Premium ($1000)</span></div>
                                </div>
                                <div className="text-center sm:text-right shrink-0">
                                    <p className="text-4xl font-black text-indigo-400 italic leading-none">${price}</p>
                                    <p className="text-[8px] font-bold text-gray-500 uppercase mt-1">Retail Unit</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 sm:p-8 bg-black/80 border-t border-white/5">
                    <button 
                        disabled={!selectedVenue}
                        onClick={() => selectedVenue && onAdd(selectedVenue, price)}
                        className={`w-full py-5 rounded-full font-black uppercase tracking-widest transition-all ${selectedVenue ? 'bg-white text-black shadow-xl' : 'bg-white/5 text-gray-700'}`}
                    >
                        Confirm Route Stop
                    </button>
                </div>
            </div>
        </div>
    );
}

const TourScreen: React.FC<{ player: Player, setPlayer: any, tours: Tour[], setTours: any, gameDate: Date, songs: Song[], setAlbums: any, setSongs: any }> = ({ player, setPlayer, tours, setTours, gameDate, songs, setAlbums, setSongs }) => {
    const [selectedTourId, setSelectedTourId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isAddingStop, setIsAddingStop] = useState(false);
    const [isSettingList, setIsSettingList] = useState(false);
    const [activeTab, setActiveTab] = useState<'Active' | 'History'>('Active');

    const selectedTour = useMemo(() => tours.find(t => t.id === selectedTourId), [tours, selectedTourId]);

    const handleCreateTour = (name: string) => {
        const poster = generateAutoPoster(name, player.artistName);
        const newTour: Tour = { 
            id: `tour_${Date.now()}`, 
            name, 
            artistName: player.artistName, 
            stops: [], 
            legs: [], 
            deals: [], 
            status: 'Planning', 
            totalRevenue: 0, 
            totalProfit: 0, 
            setlist: [], 
            promoImage: poster, 
            generatedPromoPoster: poster, 
            announcementDate: gameDate 
        };
        setTours([newTour, ...tours]);
        setSelectedTourId(newTour.id);
        setIsCreating(false);
    };

    const handleAddStop = (venue: Venue, price: number) => {
        if (!selectedTour) return;
        const newStop: TourStop = {
            id: `stop_${Date.now()}`,
            venue,
            date: new Date(gameDate),
            ticketPrice: price,
            ticketsSold: 0,
            presaleTicketsSold: 0,
            attendance: 0,
            revenue: 0,
            profit: 0,
            status: 'Planned'
        };
        const updatedTour = { ...selectedTour, stops: [...selectedTour.stops, newStop] };
        setTours(tours.map(t => t.id === selectedTour.id ? updatedTour : t));
        setIsAddingStop(false);
    };

    const handleSaveSetlist = (songIds: string[]) => {
        if (!selectedTour) return;
        const updatedTour = { ...selectedTour, setlist: songIds };
        setTours(tours.map(t => t.id === selectedTour.id ? updatedTour : t));
        setIsSettingList(false);
    };

    const handleAnnounce = () => {
        if (!selectedTour || selectedTour.stops.length === 0) return;
        if (selectedTour.setlist.length === 0) {
            alert("You must configure a setlist before launching the tour.");
            return;
        }
        const updatedTour = { 
            ...selectedTour, 
            status: 'Presale' as const,
            stops: selectedTour.stops.map(s => ({ ...s, status: 'Presale' as const }))
        };
        setTours(tours.map(t => t.id === selectedTour.id ? updatedTour : t));
        alert("Global tour announced! Presales are live.");
    };

    return (
        <div className="p-4 sm:p-12 space-y-8 sm:space-y-12 max-w-7xl mx-auto pb-40 font-sans min-h-screen bg-[#07070B] overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none animate-pulse"></div>

            {isCreating && <CreateTourModal onClose={() => setIsCreating(false)} onCreate={handleCreateTour} />}
            {isAddingStop && selectedTour && (
                <AddStopModal 
                    player={player} 
                    currentStops={selectedTour.stops} 
                    onClose={() => setIsAddingStop(false)} 
                    onAdd={handleAddStop} 
                />
            )}
            {isSettingList && selectedTour && (
                <SetlistModal 
                    songs={songs} 
                    currentSetlist={selectedTour.setlist} 
                    onClose={() => setIsSettingList(false)} 
                    onSave={handleSaveSetlist} 
                />
            )}

            {selectedTour ? (
                <div className="animate-fade-in space-y-8 sm:space-y-12">
                    <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-10 sm:pb-12 relative z-10">
                        <div className="flex items-center gap-6 sm:gap-8">
                            <button onClick={() => setSelectedTourId(null)} className="p-3 sm:p-4 bg-white/5 rounded-full hover:bg-white/10 text-white transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                            </button>
                            <div className="min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                                    <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400">{selectedTour.status}</p>
                                </div>
                                <h1 className="text-4xl sm:text-7xl md:text-[7rem] font-black italic tracking-tighter uppercase leading-none truncate max-w-[80vw] sm:max-w-2xl">{selectedTour.name}</h1>
                            </div>
                        </div>
                        {selectedTour.status === 'Planning' && (
                             <button onClick={handleAnnounce} className="w-full md:w-auto bg-white text-black font-black py-5 sm:py-6 px-12 rounded-full text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">Launch Global Presale</button>
                        )}
                    </header>

                    <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 relative z-10">
                        {/* Summary & Actions */}
                        <div className="lg:col-span-1 space-y-8">
                             <div className="aspect-[3/4] rounded-[2.5rem] sm:rounded-[3.5rem] bg-black border border-white/10 shadow-2xl overflow-hidden relative group">
                                <img src={selectedTour.generatedPromoPoster || ''} className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110 opacity-70" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                                <div className="absolute bottom-8 left-8 right-8">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2">Aggregate Metrics</p>
                                    <p className="text-3xl sm:text-4xl font-black text-white italic tracking-tighter">${selectedTour.totalRevenue.toLocaleString()}</p>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Tour Gross (Est.)</p>
                                </div>
                             </div>

                             <section className="bg-white/5 p-6 sm:p-8 rounded-[2.5rem] sm:rounded-[3rem] border border-white/5 space-y-4 sm:space-y-6">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 px-2">Era Strategy</h3>
                                {selectedTour.status === 'Planning' ? (
                                    <div className="space-y-3">
                                        <button 
                                            onClick={() => setIsAddingStop(true)}
                                            className="w-full bg-indigo-600 text-white font-black py-4 sm:py-5 rounded-full text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-500 transition-all"
                                        >
                                            Add Route Stop
                                        </button>
                                        <button 
                                            onClick={() => setIsSettingList(true)}
                                            className="w-full border border-indigo-600/40 text-indigo-400 font-black py-4 sm:py-5 rounded-full text-xs uppercase tracking-widest hover:bg-indigo-600/10 transition-all"
                                        >
                                            Configure Setlist
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <p className="text-[10px] font-black text-green-500 uppercase tracking-[0.2em] mb-2">Live Lifecycle Active</p>
                                        <p className="text-xs text-gray-500 font-medium">Planning logic restricted while presales are active.</p>
                                    </div>
                                )}
                                
                                <div className="bg-black/30 rounded-2xl p-4 sm:p-6 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <p className="text-[9px] font-black text-gray-500 uppercase">Setlist Depth</p>
                                        <p className="text-white font-black italic">{selectedTour.setlist.length} Tracks</p>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1 scrollbar-hide">
                                        {selectedTour.setlist.map(id => {
                                            const song = songs.find(s => s.id === id);
                                            return (
                                                <span key={id} className="bg-white/5 px-2.5 py-1 rounded text-[8px] font-black text-indigo-300 uppercase italic truncate max-w-[120px]">
                                                    {song?.title || 'Unknown Asset'}
                                                </span>
                                            );
                                        })}
                                        {selectedTour.setlist.length === 0 && <p className="text-[8px] font-black text-gray-700 uppercase italic">Setlist Void</p>}
                                    </div>
                                </div>
                             </section>
                        </div>

                        {/* Itinerary */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="flex justify-between items-center px-4">
                                <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-gray-500">Global Manifest ({selectedTour.stops.length} Cities)</h2>
                            </div>
                            <div className="space-y-3 sm:space-y-4 pb-12">
                                {selectedTour.stops.length > 0 ? selectedTour.stops.map((stop, i) => (
                                    <div key={stop.id} className="bg-[#12121e] p-6 sm:p-8 rounded-[2.5rem] sm:rounded-[3rem] border border-white/5 hover:border-indigo-600/30 transition-all flex flex-col sm:flex-row justify-between items-center gap-6 group">
                                        <div className="flex items-center gap-6 sm:gap-8 min-w-0 w-full sm:w-auto">
                                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-indigo-600/10 flex items-center justify-center font-black italic text-indigo-400 border border-indigo-600/20 shadow-inner flex-shrink-0 text-sm sm:text-base">{i + 1}</div>
                                            <div className="min-w-0">
                                                <h4 className="text-xl sm:text-2xl font-black text-white italic uppercase tracking-tighter truncate">{stop.venue.city}</h4>
                                                <p className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1 truncate">{stop.venue.name} &bull; {stop.venue.region}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-10 w-full sm:w-auto border-t sm:border-t-0 border-white/5 pt-4 sm:pt-0">
                                            <div className="text-left sm:text-right">
                                                <p className="text-lg sm:text-xl font-black text-indigo-400 tabular-nums">${stop.ticketPrice}</p>
                                                <p className="text-[8px] font-black text-gray-600 uppercase tracking-tighter">Retail Unit</p>
                                            </div>
                                            <div className="text-left sm:text-right">
                                                <p className="text-lg sm:text-xl font-black text-white tabular-nums">{stop.venue.capacity.toLocaleString()}</p>
                                                <p className="text-[8px] font-black text-gray-600 uppercase tracking-tighter">Inventory</p>
                                            </div>
                                            <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${stop.status === 'Completed' ? 'bg-green-500 text-black border-green-500' : 'bg-white/5 text-gray-500 border-white/10'}`}>{stop.status}</span>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="py-24 sm:py-40 bg-white/5 rounded-[3rem] sm:rounded-[4rem] border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-center opacity-30">
                                        <svg className="w-12 h-12 sm:w-16 sm:h-16 mb-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" strokeWidth={1.5} /></svg>
                                        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.5em] text-gray-500">No Routes Configured</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            ) : (
                <div className="animate-fade-in space-y-12">
                    <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b-4 sm:border-b-8 border-white pb-8 sm:pb-12 relative z-10">
                        <div>
                             <h1 className="text-6xl sm:text-8xl md:text-[10rem] font-black tracking-tighter uppercase leading-none italic drop-shadow-2xl">LIFESTYLE</h1>
                             <p className="text-brand-text-muted text-[10px] sm:text-xs font-black uppercase tracking-[0.5em] mt-6 sm:mt-8 border-l-2 sm:border-l-4 border-indigo-600 pl-4">Authorized Live Performance Ecosystem</p>
                        </div>
                        <button onClick={() => setIsCreating(true)} className="w-full md:w-auto bg-white text-black font-black py-5 sm:py-6 px-12 rounded-full text-xs sm:text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">Launch New Era</button>
                    </header>

                    <div className="flex bg-[#12121e] rounded-full sm:rounded-[2rem] p-1 gap-1 border border-white/5 shadow-inner sticky top-0 z-20 backdrop-blur-xl">
                        {['Active', 'History'].map(t => (
                            <button key={t} onClick={() => setActiveTab(t as any)} className={`flex-1 py-3 sm:py-4 text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-full sm:rounded-2xl transition-all ${activeTab === t ? 'bg-white text-black shadow-xl' : 'text-gray-600'}`}>{t} Operations</button>
                        ))}
                    </div>

                    <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pb-32 relative z-10">
                        {tours.filter(t => activeTab === 'Active' ? t.status !== 'Completed' : t.status === 'Completed').map(tour => (
                            <div key={tour.id} onClick={() => setSelectedTourId(tour.id)} className="bg-[#1e1e2d] rounded-[3rem] sm:rounded-[3.5rem] border border-white/5 overflow-hidden group cursor-pointer hover:border-indigo-600/40 hover:-translate-y-2 transition-all shadow-2xl">
                                <div className="aspect-square relative bg-gray-900 overflow-hidden">
                                    <img src={tour.generatedPromoPoster || ''} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-[2000ms] group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e2d] to-transparent"></div>
                                    <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10">
                                        <span className="text-white text-[7px] sm:text-[8px] font-black px-3 py-1 sm:px-4 sm:py-1.5 bg-indigo-600 rounded-full uppercase tracking-widest mb-3 sm:mb-4 inline-block shadow-xl">{tour.status}</span>
                                        <h3 className="text-3xl sm:text-4xl font-black italic uppercase tracking-tighter text-white leading-none">{tour.name}</h3>
                                        <p className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2">{tour.stops.length} Authorized Stops</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {tours.filter(t => activeTab === 'Active' ? t.status !== 'Completed' : t.status === 'Completed').length === 0 && (
                            <div className="col-span-full py-24 sm:py-40 flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 sm:w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10 mb-6 sm:mb-8 animate-pulse">
                                     <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" strokeWidth={1.5} /></svg>
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tighter text-white">Archives Vacant</h2>
                                <p className="text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-[0.4em] mt-2 px-6">Initialize your first world tour era to begin live operations.</p>
                            </div>
                        )}
                    </main>
                </div>
            )}

            <footer className="fixed bottom-10 left-0 right-0 text-center opacity-10 pointer-events-none hidden sm:block">
                <p className="text-[8px] font-black uppercase tracking-[1em]">Global Live Sync Node 4 • build_02_2025</p>
            </footer>
        </div>
    );
};

export default TourScreen;
