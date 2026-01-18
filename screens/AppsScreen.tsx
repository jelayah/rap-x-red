
import React, { useState, useMemo } from 'react';
import type { Player, Song, Notification, Album, PitchforkReview, Transaction, GrammyNomination } from '../types';
import PlaceholderScreen from './PlaceholderScreen';
import JobsApp from './JobsApp';

interface AppsScreenProps {
    player: Player;
    setPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
    songs: Song[];
    setSongs: React.Dispatch<React.SetStateAction<Song[]>>;
    albums: Album[];
    setAlbums: React.Dispatch<React.SetStateAction<Album[]>>;
    notifications: Notification[];
    gameDate: Date;
}

type AppId = 'home' | 'email' | 'radio' | 'career' | 'wiki' | 'bank' | 'label' | 'pitchfork' | 'awards' | 'jobs';

const toDate = (d: any) => (d instanceof Date ? d : new Date(d));

const CommandTile: React.FC<{ label: string; sub: string; color: string; icon: React.ReactNode; onClick: () => void; badge?: number; disabled?: boolean }> = ({ label, sub, color, icon, onClick, badge, disabled }) => (
    <button onClick={onClick} disabled={disabled} className={`relative group bg-white/5 border border-white/5 p-5 rounded-[2.5rem] flex flex-col items-start gap-4 transition-all ${disabled ? 'opacity-40' : 'hover:bg-white/10 hover:border-white/20 active:scale-95'} text-left shadow-2xl`}>
        {badge ? (
            <div className="absolute top-4 right-4 bg-red-600 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center shadow-lg animate-pulse">{badge}</div>
        ) : null}
        <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center text-white shadow-xl`}>
            {icon}
        </div>
        <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white leading-none mb-1">{label}</p>
            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">{disabled ? "COMING SOON" : sub}</p>
        </div>
    </button>
);

const BackButton: React.FC<{ onClick: () => void; title: string }> = ({ onClick, title }) => (
    <div className="flex items-center gap-4 mb-8 pb-4 border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-20">
        <button onClick={onClick} className="p-2 hover:bg-white/10 rounded-full transition-colors text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        </button>
        <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">{title}</h2>
    </div>
);

const WikiApp: React.FC<{ player: Player; songs: Song[]; albums: Album[]; gameDate: Date; onBack: () => void }> = ({ player, songs, albums, gameDate, onBack }) => {
    const activeSince = songs.length > 0 ? new Date(songs[songs.length - 1].releaseDate).getFullYear() : gameDate.getFullYear();

    return (
        <div className="h-full bg-white text-[#101418] font-serif overflow-y-auto animate-fade-in pb-32">
             <header className="p-4 bg-[#f8f9fa] border-b border-gray-300 sticky top-0 z-40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="p-1 text-gray-600">✕</button>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-serif">W</span>
                        <span className="text-sm font-sans font-bold uppercase tracking-widest text-gray-500">Wikipedia</span>
                    </div>
                </div>
                <button className="p-2 text-blue-600"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></button>
            </header>
            <main className="p-5 md:p-8 space-y-6 max-w-4xl mx-auto">
                <h1 className="text-4xl font-serif border-b border-gray-300 pb-2 leading-tight">{player.artistName}</h1>
                
                <div className="bg-[#f8f9fa] border border-gray-300 p-1 mb-6 w-full md:w-80 md:float-right md:ml-6 shadow-sm">
                    <div className="text-center font-sans font-black text-[11px] uppercase p-2 border-b border-gray-300 bg-[#eaecf0] mb-2">{player.artistName}</div>
                    <img src={player.aboutImage || ''} className="w-full h-auto" alt={player.artistName} />
                    <table className="w-full text-xs font-sans mt-2">
                        <tbody>
                            <tr className="border-b border-gray-200"><th className="text-left py-2 px-2 bg-[#f2f2f2] w-24">Born</th><td className="py-2 px-2">{player.realName}</td></tr>
                            <tr className="border-b border-gray-200"><th className="text-left py-2 px-2 bg-[#f2f2f2]">Origin</th><td className="py-2 px-2">United States</td></tr>
                            <tr className="border-b border-gray-200"><th className="text-left py-2 px-2 bg-[#f2f2f2]">Occupation</th><td className="py-2 px-2">Rapper, executive</td></tr>
                            <tr className="border-b border-gray-200"><th className="text-left py-2 px-2 bg-[#f2f2f2]">Years Active</th><td className="py-2 px-2">{activeSince}–present</td></tr>
                            <tr><th className="text-left py-2 px-2 bg-[#f2f2f2]">Labels</th><td className="py-2 px-2 font-bold text-blue-600">{player.label}</td></tr>
                        </tbody>
                    </table>
                </div>

                <p className="leading-relaxed text-[15px]">
                    <span className="font-bold">{player.artistName}</span> (born <span className="font-bold">{player.realName}</span>) is an American rapper and recording artist currently signed to <span className="text-blue-600 underline cursor-pointer">{player.label}</span>. They have reached a career peak rank of <span className="font-bold">#{player.globalRank}</span>.
                </p>
                
                <h2 className="text-2xl border-b border-gray-300 pb-1 mt-8 mb-4">Career</h2>
                <p className="leading-relaxed text-[15px]">
                    {player.artistName}'s professional trajectory began in {activeSince}. As of {gameDate.getFullYear()}, they maintain a monthly active listener base of <span className="font-bold">{player.monthlyListeners.toLocaleString()}</span>. 
                </p>

                <h2 className="text-2xl border-b border-gray-300 pb-1 mt-8 mb-4">Discography</h2>
                <div className="space-y-4 font-sans">
                    <table className="w-full border-collapse border border-gray-300 text-sm">
                        <thead className="bg-[#eaecf0]">
                            <tr>
                                <th className="border border-gray-300 p-2 text-left">Title</th>
                                <th className="border border-gray-300 p-2 text-left">Year</th>
                                <th className="border border-gray-300 p-2 text-center">Peak</th>
                            </tr>
                        </thead>
                        <tbody>
                            {albums.length > 0 ? albums.map(a => (
                                <tr key={a.id}>
                                    <td className="border border-gray-300 p-2 italic font-bold">"{a.title}"</td>
                                    <td className="border border-gray-300 p-2 text-xs">{toDate(a.releaseDate!).getFullYear()}</td>
                                    <td className="border border-gray-300 p-2 text-center font-bold">{a.chartHistory?.billboard200?.peakPosition || "—"}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan={3} className="border border-gray-300 p-4 text-center italic text-gray-500">No studio records found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

const PitchforkApp: React.FC<{ songs: Song[]; albums: Album[]; onBack: () => void }> = ({ songs, albums, onBack }) => {
    const reviews = useMemo(() => {
        const r: any[] = [];
        // Map all released items that have reviews
        songs.forEach(s => s.pitchforkReview && r.push({ item: s, review: s.pitchforkReview, type: 'Single' }));
        albums.forEach(a => a.pitchforkReview && r.push({ item: a, review: a.pitchforkReview, type: a.type }));
        return r.sort((a,b) => toDate(b.review.date).getTime() - toDate(a.review.date).getTime());
    }, [songs, albums]);

    return (
        <div className="h-full bg-white text-black overflow-y-auto animate-fade-in pb-32">
             <header className="p-6 bg-black text-white sticky top-0 z-50 flex items-center justify-between border-b-[10px] border-red-600">
                <button onClick={onBack} className="text-white hover:text-red-500 transition-colors">✕</button>
                <h1 className="font-serif italic font-black text-4xl tracking-tighter">Pitchfork</h1>
                <div className="w-6"></div>
            </header>
            <main className="p-6 md:p-12 space-y-16">
                <h2 className="text-xs font-black uppercase tracking-[0.5em] text-gray-400 border-b border-gray-100 pb-4">Artist Discography Reviews</h2>
                {reviews.length > 0 ? reviews.map((r, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row gap-10 items-start border-b border-gray-100 pb-16 last:border-0">
                        <div className="relative group w-full md:w-64 flex-shrink-0">
                            <div className="aspect-square bg-gray-100 overflow-hidden shadow-2xl">
                                <img src={r.item.coverArt || ''} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                            </div>
                            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-red-600 flex items-center justify-center rounded-full border-4 border-white shadow-2xl">
                                <span className="text-white font-black text-4xl italic tracking-tighter">{r.review.score.toFixed(1)}</span>
                            </div>
                            {r.review.isBestNewMusic && (
                                <div className="absolute -top-4 -left-4 bg-red-600 text-white px-4 py-2 font-black text-[10px] uppercase tracking-widest shadow-xl rotate-[-5deg]">Best New Music</div>
                            )}
                        </div>
                        <div className="flex-1 space-y-4">
                            <div className="space-y-1">
                                <p className="text-[11px] font-black uppercase text-red-600 tracking-[0.4em]">{r.type} REVIEW</p>
                                <h2 className="text-2xl font-bold tracking-tight">{r.item.artistName}</h2>
                                <h3 className="text-5xl font-black italic uppercase tracking-tighter leading-none">{r.item.title}</h3>
                            </div>
                            <p className="text-lg text-gray-800 leading-relaxed italic border-l-4 border-gray-200 pl-6">"{r.review.summary}"</p>
                            <div className="pt-6 flex items-center justify-between text-[10px] font-black uppercase text-gray-400 tracking-widest">
                                <span>By {r.review.author}</span>
                                <span>{toDate(r.review.date).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                            </div>
                        </div>
                    </div>
                )) : <div className="text-center py-32 space-y-6">
                    <div className="w-20 h-1 bg-red-600 mx-auto"></div>
                    <p className="text-gray-400 font-serif italic text-xl">Waiting for cultural significance...</p>
                </div>}
            </main>
        </div>
    );
};

const LabelApp: React.FC<{ player: Player; songs: Song[]; onBack: () => void }> = ({ player, songs, onBack }) => {
    const totalStreams = useMemo(() => songs.reduce((acc, s) => acc + s.rapifyStreams + s.rappleStreams, 0), [songs]);
    const artistValue = (player.monthlyListeners * 0.4) + (totalStreams * 0.01) + (player.reputation * 12000);

    return (
        <div className="h-full bg-[#050505] text-white p-6 md:p-10 animate-fade-in overflow-y-auto pb-32">
            <BackButton onClick={onBack} title="Executive Dashboard" />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <section className="lg:col-span-2 space-y-8">
                    <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                            <h4 className="text-9xl font-black italic">{player.label.charAt(0)}</h4>
                        </div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-12">
                                <div>
                                    <p className="text-[#fa2d48] font-black uppercase tracking-[0.4em] text-[10px] mb-2">Personnel Profile</p>
                                    <h2 className="text-5xl font-black italic uppercase tracking-tighter leading-none">{player.artistName}</h2>
                                    <p className="text-gray-500 font-bold text-lg mt-1 uppercase tracking-widest">RANK #{player.globalRank}</p>
                                </div>
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-black font-black text-2xl italic shadow-2xl">L</div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                                <div><p className="text-[9px] font-black text-gray-600 uppercase mb-1">Contract</p><p className="text-xl font-black text-green-500 italic">ACTIVE</p></div>
                                <div><p className="text-[9px] font-black text-gray-600 uppercase mb-1">Points</p><p className="text-xl font-black text-white italic">{player.contract.royaltyRate * 100}%</p></div>
                                <div><p className="text-[9px] font-black text-gray-600 uppercase mb-1">Balance</p><p className="text-xl font-black text-red-500 italic">${player.contract.advance.toLocaleString()}</p></div>
                                <div><p className="text-[9px] font-black text-gray-600 uppercase mb-1">Quota</p><p className="text-xl font-black text-white italic">{player.contract.albumsLeft} LPs</p></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] shadow-xl">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 mb-8 px-2">Label Portfolio</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
                                <p className="text-[9px] font-black text-gray-600 uppercase mb-3">Market Value Estimate</p>
                                <p className="text-4xl font-black italic text-white leading-none">${Math.floor(artistValue).toLocaleString()}</p>
                                <p className="text-[8px] font-bold text-gray-700 uppercase mt-4">BASED ON CATALOG VELOCITY & CLOUT</p>
                            </div>
                            <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
                                <p className="text-[9px] font-black text-gray-600 uppercase mb-3">Audience Retention</p>
                                <p className="text-4xl font-black italic text-indigo-400 leading-none">{((player.monthlyListeners / 10000000) * 100).toFixed(2)}%</p>
                                <p className="text-[8px] font-bold text-gray-700 uppercase mt-4">SHARE OF GLOBAL MARKET</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-white text-black p-10 rounded-[3rem] shadow-2xl flex flex-col justify-between">
                    <div className="space-y-10">
                        <header className="border-b border-black/10 pb-6">
                            <p className="font-black text-xs uppercase tracking-widest mb-1 text-red-600">Confidential Report</p>
                            <h3 className="text-3xl font-black italic tracking-tighter uppercase">{player.label}</h3>
                        </header>
                        
                        <div className="space-y-6">
                            <div className="group cursor-pointer">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Corporate Mandate</p>
                                <p className="text-lg font-bold leading-tight">Artist must maintain positive chart momentum to secure secondary advances.</p>
                            </div>
                            <div className="group cursor-pointer">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Marketing Priority</p>
                                <p className="text-lg font-bold leading-tight">Digital streaming platforms remain the core focus of the current fiscal period.</p>
                            </div>
                        </div>
                    </div>
                    
                    <footer className="pt-10 opacity-40">
                         <p className="text-[8px] font-black uppercase tracking-widest text-center">PROPERTY OF {player.label.toUpperCase()} ENT.</p>
                    </footer>
                </section>
            </div>
        </div>
    );
};

const EmailApp: React.FC<{ notifications: Notification[]; onBack: () => void }> = ({ notifications, onBack }) => {
    const emails = notifications.filter(n => n.type !== 'Chart' && n.type !== 'Debut');
    return (
        <div className="h-full bg-black text-white p-6 md:p-10 animate-fade-in overflow-y-auto pb-32">
            <BackButton onClick={onBack} title="Encrypted Inbox" />
            <div className="space-y-4">
                {emails.length > 0 ? emails.map(email => (
                    <div key={email.id} className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-all cursor-pointer">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">{email.type}</span>
                            <span className="text-[10px] font-bold text-gray-500">{toDate(email.date).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed">{email.message}</p>
                    </div>
                )) : <div className="text-center py-20 text-gray-700 font-black uppercase italic text-xs">Inbox clear.</div>}
            </div>
        </div>
    );
};

const BankApp: React.FC<{ player: Player; onBack: () => void }> = ({ player, onBack }) => {
    return (
        <div className="h-full bg-[#050505] text-white p-6 md:p-10 animate-fade-in overflow-y-auto pb-32">
            <BackButton onClick={onBack} title="Capital Hub" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] shadow-2xl">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Liquid Assets</p>
                    <p className="text-6xl font-black text-green-500 italic tracking-tighter leading-none">${player.money.toLocaleString()}</p>
                    <p className="text-[9px] font-bold text-gray-600 uppercase mt-8 italic">Synchronized across all accounts.</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] shadow-xl space-y-6">
                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em] mb-4">Ledger</h3>
                    <div className="space-y-4 max-h-60 overflow-y-auto pr-2 scrollbar-hide">
                         {(player.transactions || []).length > 0 ? player.transactions.map((t: Transaction) => (
                             <div key={t.id} className="flex justify-between items-center border-b border-white/5 pb-4">
                                 <div>
                                     <p className="text-sm font-bold text-white">{t.description}</p>
                                     <p className="text-[9px] text-gray-500 uppercase">{toDate(t.date).toLocaleDateString()}</p>
                                 </div>
                                 <p className={`font-black italic ${t.type === 'Income' ? 'text-green-500' : 'text-red-500'}`}>
                                     {t.type === 'Income' ? '+' : '-'}${t.amount.toLocaleString()}
                                 </p>
                             </div>
                         )) : <p className="text-center py-10 text-gray-700 font-bold uppercase italic text-[10px]">No recent traffic.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

const AwardsApp: React.FC<{ player: Player; onBack: () => void }> = ({ player, onBack }) => {
    return (
        <div className="h-full bg-[#050505] text-white p-6 md:p-10 animate-fade-in overflow-y-auto pb-32">
            <BackButton onClick={onBack} title="Awards & Accolades" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] shadow-2xl">
                    <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center text-black mb-8 shadow-xl">
                        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    </div>
                    <h3 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-2">Hall of Fame</h3>
                    <div className="mt-10 space-y-4">
                        {(player.grammyHistory || []).length > 0 ? player.grammyHistory.map((nom, i) => (
                            <div key={i} className={`flex justify-between items-center p-4 rounded-2xl border ${nom.isWin ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-white/5 border-white/10'}`}>
                                <div>
                                    <p className={`font-black text-xs uppercase italic ${nom.isWin ? 'text-yellow-500' : 'text-gray-400'}`}>{nom.isWin ? 'WINNER' : 'NOMINEE'}</p>
                                    <p className="text-sm font-bold text-white mt-0.5">{nom.category}</p>
                                </div>
                                <span className="text-xs font-black text-gray-500">{nom.year}</span>
                            </div>
                        )) : <p className="text-gray-700 font-bold uppercase italic text-xs py-10">Empty archive.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

const AppsScreen: React.FC<AppsScreenProps> = ({ player, setPlayer, songs, setSongs, albums, setAlbums, notifications, gameDate }) => {
    const [activeTab, setActiveTab] = useState<AppId>('home');
    
    const unreadEmails = notifications.filter(n => (n.type !== 'Chart' && n.type !== 'Debut')).length;

    const closeApp = () => setActiveTab('home');

    if (activeTab === 'email') return <EmailApp notifications={notifications} onBack={closeApp} />;
    if (activeTab === 'wiki') return <WikiApp player={player} songs={songs} albums={albums} gameDate={gameDate} onBack={closeApp} />;
    if (activeTab === 'label') return <LabelApp player={player} songs={songs} onBack={closeApp} />;
    if (activeTab === 'pitchfork') return <PitchforkApp songs={songs} albums={albums} onBack={closeApp} />;
    if (activeTab === 'bank') return <BankApp player={player} onBack={closeApp} />;
    if (activeTab === 'awards') return <AwardsApp player={player} onBack={closeApp} />;
    if (activeTab === 'jobs') return <JobsApp player={player} setPlayer={setPlayer} onBack={closeApp} />;

    return (
        <div className="min-h-screen bg-[#07070B] relative overflow-hidden font-sans p-6 sm:p-12 pb-40">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-primary-start/5 blur-[120px] rounded-full pointer-events-none"></div>

            <header className="relative z-10 mb-12 animate-fade-in">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-red-500">Industry Protocol Sync</p>
                </div>
                <h1 className="text-6xl sm:text-9xl font-black italic tracking-tighter uppercase text-white leading-none drop-shadow-2xl">COMMAND</h1>
                
                <div className="grid grid-cols-3 gap-3 mt-10">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                        <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Fiscal Year</p>
                        <p className="text-sm font-black text-white italic">{gameDate.getFullYear()}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                        <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Global Status</p>
                        <p className="text-sm font-black text-white italic">#{player.globalRank}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                        <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Logic Node</p>
                        <p className="text-sm font-black text-green-500 italic">SECURE</p>
                    </div>
                </div>
            </header>

            <main className="relative z-10 space-y-12 animate-fade-in-up">
                <section>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-6 px-2">Communications</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <CommandTile label="Encryption" sub="Direct Messages" color="bg-blue-600" badge={unreadEmails} icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2.5}><path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75" /></svg>} onClick={() => setActiveTab('email')} />
                         <CommandTile label="Labor" sub="Market Roles" color="bg-[#0073b1]" icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2.5}><path d="M20.25 14.15v4.25H3.75V14.15m16.5 0a2.25 2.25 0 00-2.25-2.25H16.5" /></svg>} onClick={() => setActiveTab('jobs')} />
                    </div>
                </section>

                <section>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-6 px-2">Industry Operations</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <CommandTile label="Executive" sub={player.label} color="bg-red-700" icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2.5}><path d="M12 21h-1.5V9.75a.75.75 0 00-1.5 0V21H7.5" /></svg>} onClick={() => setActiveTab('label')} />
                        <ReviewTile label="Critical" sub="Pitchfork" color="bg-black" icon={<span className="font-serif font-black text-xl italic">Pf</span>} onClick={() => setActiveTab('pitchfork')} />
                    </div>
                </section>

                <section>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-6 px-2">Intelligence</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <CommandTile label="Public Ledger" sub="Wikipedia" color="bg-gray-200 text-black" icon={<span className="font-serif font-black text-2xl text-black">W</span>} onClick={() => setActiveTab('wiki')} />
                        <CommandTile label="Accolades" sub="Hall of Fame" color="bg-yellow-500" icon={<svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88" /></svg>} onClick={() => setActiveTab('awards')} />
                        <CommandTile label="Fiscal" sub="Bank Vault" color="bg-emerald-700" icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2.5}><path d="M12 6v12m-3-2.818" /></svg>} onClick={() => setActiveTab('bank')} />
                    </div>
                </section>
            </main>

            <footer className="absolute bottom-10 left-0 right-0 text-center opacity-10 pointer-events-none">
                <p className="text-[8px] font-black text-gray-500 uppercase tracking-[1em]">SYSTEM CORE V2.5 • RED MIC OPS</p>
            </footer>
        </div>
    );
};

const ReviewTile = CommandTile;
export default AppsScreen;
