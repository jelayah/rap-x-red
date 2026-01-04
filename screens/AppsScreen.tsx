
import React, { useState, useMemo } from 'react';
import type { Player, Song, Notification, Album, PitchforkReview, Transaction } from '../types';
import PlaceholderScreen from './PlaceholderScreen';

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

type AppId = 'home' | 'email' | 'radio' | 'career' | 'wiki' | 'bank' | 'label' | 'pitchfork' | 'awards';

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

// --- APP: EMAIL ---
const EmailApp: React.FC<{ notifications: Notification[]; onBack: () => void }> = ({ notifications, onBack }) => {
    const [selectedEmail, setSelectedEmail] = useState<Notification | null>(null);
    const emails = notifications.filter(n => n.type !== 'Chart' && n.type !== 'Debut');

    if (selectedEmail) {
        return (
            <div className="h-full bg-black text-white p-6 animate-fade-in">
                <BackButton onClick={() => setSelectedEmail(null)} title="Message Detail" />
                <div className="space-y-6">
                    <div className="flex justify-between items-end">
                         <h3 className="text-2xl font-black italic uppercase text-white">{selectedEmail.type}</h3>
                         <span className="text-[10px] font-mono text-gray-600 uppercase">{toDate(selectedEmail.date).toLocaleDateString()}</span>
                    </div>
                    <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 leading-relaxed text-gray-300 italic text-lg shadow-inner">
                        "{selectedEmail.message}"
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full bg-black text-white p-6 animate-fade-in">
            <BackButton onClick={onBack} title="Encryption Hub" />
            <div className="space-y-2">
                {emails.map(email => (
                    <button key={email.id} onClick={() => setSelectedEmail(email)} className="w-full bg-white/5 p-5 rounded-[2rem] border border-transparent hover:border-red-600/30 transition-all flex items-center justify-between group">
                        <div className="text-left min-w-0 pr-4">
                            <p className="text-[9px] font-black uppercase text-red-500 mb-1 tracking-widest">{email.type}</p>
                            <p className="font-bold text-white truncate text-sm uppercase tracking-tighter">{email.message.substring(0, 40)}...</p>
                        </div>
                        <svg className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                    </button>
                ))}
                {emails.length === 0 && <p className="text-center py-20 text-gray-700 font-black italic uppercase tracking-widest">Inbox Secure. No new traffic.</p>}
            </div>
        </div>
    );
};

// --- APP: LABEL ---
const LabelApp: React.FC<{ player: Player; onBack: () => void }> = ({ player, onBack }) => (
    <div className="h-full bg-black text-white p-6 animate-fade-in">
        <BackButton onClick={onBack} title="The Office" />
        <div className="relative">
            <div className="bg-white p-10 rounded-sm shadow-2xl text-black space-y-10 border-b-[12px] border-gray-200">
                <header className="flex justify-between items-start border-b-2 border-black pb-6">
                    <div className="flex flex-col">
                         <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.5em] leading-none">Internal Personnel File</span>
                         <span className="text-3xl font-black italic uppercase tracking-tighter mt-1">{player.label}</span>
                    </div>
                    <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-black italic text-xl">L</div>
                </header>
                <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-8">
                        <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Artist Name</p><p className="text-xl font-black italic uppercase">{player.artistName}</p></div>
                        <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contract Status</p><p className="text-xl font-black italic text-green-600 uppercase">Active</p></div>
                    </div>
                    <div className="bg-gray-50 p-6 border-l-4 border-black">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Contract Breakdown</p>
                        <div className="grid grid-cols-2 gap-6">
                            <div><p className="text-[8px] font-black uppercase text-gray-500">Points (%)</p><p className="text-2xl font-black">{player.contract.royaltyRate * 100}%</p></div>
                            <div><p className="text-[8px] font-black uppercase text-gray-500">Advance Balance</p><p className="text-2xl font-black">${player.contract.advance.toLocaleString()}</p></div>
                            <div><p className="text-[8px] font-black uppercase text-gray-500">LPs Remaining</p><p className="text-2xl font-black">{player.contract.albumsLeft}</p></div>
                            <div><p className="text-[8px] font-black uppercase text-gray-500">Singles Left</p><p className="text-2xl font-black">{player.contract.singlesLeft}</p></div>
                        </div>
                    </div>
                </div>
                <footer className="text-[8px] font-bold text-gray-400 uppercase tracking-widest text-center pt-6 border-t border-gray-100">
                    Confidential Industry Document • Do Not Share
                </footer>
            </div>
        </div>
    </div>
);

// --- APP: WIKIPEDIA ---
const WikiApp: React.FC<{ player: Player; songs: Song[]; albums: Album[]; gameDate: Date; onBack: () => void }> = ({ player, songs, albums, gameDate, onBack }) => {
    const activeSince = songs.length > 0 ? new Date(songs[songs.length - 1].releaseDate).getFullYear() : gameDate.getFullYear();
    const releasedCount = songs.filter(s => s.isReleased).length;

    return (
        <div className="h-full bg-white text-black font-serif overflow-y-auto animate-fade-in">
             <header className="p-4 bg-[#f6f6f6] border-b border-gray-300 sticky top-0 z-10 flex items-center gap-4">
                <button onClick={onBack} className="p-1 text-blue-600">✕</button>
                <div className="flex items-center gap-2">
                    <span className="text-xl font-bold font-serif italic">W</span>
                    <span className="text-lg font-bold">Wikipedia</span>
                </div>
            </header>
            <main className="p-4 pb-32">
                <h1 className="text-4xl font-sans font-black italic tracking-tighter border-b border-gray-300 pb-2 mb-6">{player.artistName}</h1>
                
                <div className="bg-[#f8f9fa] border border-gray-300 p-2 mb-8 float-right w-full sm:w-64 ml-0 sm:ml-4 shadow-sm">
                    <div className="text-center bg-[#eaecf0] p-1 text-[11px] font-sans font-bold uppercase mb-2">Artist Profile</div>
                    <img src={player.aboutImage || `https://source.unsplash.com/200x200/?portrait`} className="w-full h-auto mb-4 grayscale" alt={player.artistName} />
                    <table className="w-full text-xs font-sans">
                        <tbody>
                            <tr className="border-b border-gray-200"><th className="text-left py-2 pr-2">Born</th><td className="py-2">{player.realName}</td></tr>
                            <tr className="border-b border-gray-200"><th className="text-left py-2 pr-2">Origin</th><td className="py-2">USA</td></tr>
                            <tr className="border-b border-gray-200"><th className="text-left py-2 pr-2">Active</th><td className="py-2">{activeSince}–present</td></tr>
                            <tr className="border-b border-gray-200"><th className="text-left py-2 pr-2">Labels</th><td className="py-2">{player.label}</td></tr>
                            <tr><th className="text-left py-2 pr-2">Rank</th><td className="py-2 font-black">#{player.globalRank}</td></tr>
                        </tbody>
                    </table>
                </div>

                <p className="mb-4 leading-relaxed">
                    <span className="font-bold">{player.artistName}</span> (born <span className="font-bold">{player.realName}</span>) is an American rapper and industry peer who rose to prominence within the <span className="italic">Red Mic System</span>. As of {gameDate.getFullYear()}, they are currently ranked <span className="font-bold">#{player.globalRank}</span> globally.
                </p>
                
                <h3 className="text-xl font-sans font-bold border-b border-gray-300 pb-1 mt-8 mb-4">Career</h3>
                <p className="mb-4 leading-relaxed">
                    With over <span className="font-bold">{player.monthlyListeners.toLocaleString()}</span> monthly listeners, {player.artistName} has released {releasedCount} authorized studio tracks and {albums.length} physical projects. Their reputation in the industry is categorized as "{player.experience}".
                </p>

                <h3 className="text-xl font-sans font-bold border-b border-gray-300 pb-1 mt-8 mb-4">Studio albums</h3>
                <div className="space-y-4">
                    {albums.length > 0 ? (
                        <ul className="list-disc pl-6 space-y-2">
                            {albums.map(a => {
                                const peak = a.chartHistory?.billboard200?.peakPosition;
                                return (
                                    <li key={a.id} className="leading-relaxed">
                                        <span className="font-bold italic">"{a.title}"</span> ({new Date(a.releaseDate!).getFullYear()})
                                        {peak && (
                                            <span className="text-xs text-gray-500 font-sans ml-2 uppercase font-bold tracking-tight">
                                                (Peak: #{peak} on B200)
                                            </span>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p className="italic text-gray-500 text-sm">No albums documented.</p>
                    )}
                </div>
                
                <h3 className="text-xl font-sans font-bold border-b border-gray-300 pb-1 mt-8 mb-4">Selected singles</h3>
                <ul className="list-disc pl-6 space-y-1">
                    {songs.filter(s => s.isReleased).slice(0, 8).map(s => {
                         const peak = s.chartHistory?.hot100?.peakPosition;
                         return (
                            <li key={s.id} className="text-blue-600 underline cursor-pointer">
                                <span className="text-black no-underline">"{s.title}" ({new Date(s.releaseDate).getFullYear()})</span>
                                {peak && <span className="text-gray-500 no-underline text-[10px] ml-2 font-sans font-bold">Peak: #{peak}</span>}
                            </li>
                         );
                    })}
                </ul>
            </main>
        </div>
    );
};

// --- APP: PITCHFORK ---
const PitchforkApp: React.FC<{ songs: Song[]; albums: Album[]; onBack: () => void }> = ({ songs, albums, onBack }) => {
    const reviews = useMemo(() => {
        const r: any[] = [];
        songs.forEach(s => s.pitchforkReview && r.push({ item: s, review: s.pitchforkReview, type: 'Single' }));
        albums.forEach(a => a.pitchforkReview && r.push({ item: a, review: a.pitchforkReview, type: a.type }));
        return r.sort((a,b) => toDate(b.review.date).getTime() - toDate(a.review.date).getTime());
    }, [songs, albums]);

    return (
        <div className="h-full bg-white text-black overflow-y-auto animate-fade-in pb-32">
             <header className="p-6 bg-black text-white sticky top-0 z-10 flex items-center justify-between">
                <button onClick={onBack} className="text-white hover:text-red-500 transition-colors">✕</button>
                <h1 className="font-serif italic font-black text-3xl">Pitchfork</h1>
                <div className="w-6"></div>
            </header>
            <main className="p-6 space-y-12">
                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 border-b border-gray-100 pb-2">Latest Reviews</h2>
                {reviews.length > 0 ? reviews.map((r, idx) => (
                    <div key={idx} className="flex gap-6 items-start">
                        <div className="w-24 h-24 flex-shrink-0 bg-gray-100 relative shadow-lg">
                            <img src={r.item.coverArt || ''} className="w-full h-full object-cover" />
                            <div className="absolute -bottom-2 -right-2 bg-red-600 text-white w-10 h-10 flex items-center justify-center font-black text-lg border-2 border-white shadow-xl">{r.review.score.toFixed(1)}</div>
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-black uppercase text-red-600 mb-1 tracking-widest">{r.type}</p>
                            <h3 className="text-xl font-bold leading-none mb-1">{r.item.artistName}</h3>
                            <h4 className="text-2xl font-black italic uppercase tracking-tighter mb-3 leading-none truncate">{r.item.title}</h4>
                            <p className="text-xs text-gray-500 line-clamp-2 italic">"{r.review.summary}"</p>
                            <p className="text-[9px] font-black text-gray-400 uppercase mt-4">By {r.review.author} &bull; {toDate(r.review.date).toLocaleDateString()}</p>
                        </div>
                    </div>
                )) : <div className="text-center py-20 text-gray-300 font-black italic uppercase text-xs tracking-widest">The critics are silent. Awaiting releases.</div>}
            </main>
        </div>
    );
};

// --- APP: BANK ---
const BankApp: React.FC<{ player: Player; gameDate: Date; onBack: () => void }> = ({ player, gameDate, onBack }) => {
    const transactions = useMemo(() => {
        const now = toDate(gameDate);
        const oneMonthAgo = new Date(now);
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        
        return (player.transactions || [])
            .filter(t => toDate(t.date) >= oneMonthAgo)
            .sort((a,b) => toDate(b.date).getTime() - toDate(a.date).getTime());
    }, [player.transactions, gameDate]);

    return (
        <div className="h-full bg-[#07070B] text-white p-6 animate-fade-in overflow-y-auto pb-32">
            <BackButton onClick={onBack} title="Liquid Vault" />
            
            <section className="bg-white p-10 rounded-[3.5rem] shadow-2xl text-black mb-10">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-3 leading-none">Net Liquidity</p>
                <h2 className="text-6xl font-black italic tracking-tighter leading-none mb-8">${player.money.toLocaleString()}</h2>
                
                <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-8">
                    <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Pending Royalties</p>
                        <p className="text-xl font-black text-blue-600 italic tracking-tighter">${player.pendingRoyalties.toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Fiscal Status</p>
                        <p className="text-xl font-black text-green-600 italic tracking-tighter uppercase">SECURE</p>
                    </div>
                </div>
            </section>

            <section className="space-y-6">
                <div className="flex justify-between items-end border-b border-white/5 pb-2">
                     <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500">Transaction Matrix</h3>
                     <span className="text-[9px] font-black text-gray-700 uppercase">PAST 30 DAYS</span>
                </div>
                <div className="space-y-1">
                    {transactions.map(t => (
                        <div key={t.id} className="bg-white/5 p-5 rounded-[1.5rem] flex justify-between items-center group hover:bg-white/10 transition-all">
                            <div className="min-w-0">
                                <p className="font-bold text-sm truncate uppercase tracking-tighter">{t.description}</p>
                                <p className="text-[9px] font-black text-gray-500 uppercase mt-1">{toDate(t.date).toLocaleDateString()}</p>
                            </div>
                            <p className={`text-lg font-black italic ${t.type === 'Income' ? 'text-green-400' : 'text-red-500'}`}>
                                {t.type === 'Income' ? '+' : '-'}${t.amount.toLocaleString()}
                            </p>
                        </div>
                    ))}
                    {transactions.length === 0 && (
                        <div className="py-20 text-center">
                            <p className="text-gray-700 font-black italic uppercase text-xs tracking-widest">No ledger entries for this period.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

// --- APP: AWARDS ---
const AwardsApp: React.FC<{ player: Player; onBack: () => void }> = ({ player, onBack }) => {
    const awards = player.awards || [];
    
    return (
        <div className="h-full bg-black text-white p-6 animate-fade-in overflow-y-auto pb-32">
            <BackButton onClick={onBack} title="The Vault" />
            
            <section className="text-center mb-12">
                <div className="w-24 h-24 bg-gradient-to-tr from-yellow-600 to-yellow-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(234,179,8,0.3)]">
                    <svg className="w-12 h-12 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </div>
                <h2 className="text-4xl font-black italic uppercase tracking-tighter">Accolades</h2>
                <p className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.4em] mt-2">Industry Recognition Index</p>
            </section>

            <div className="space-y-6">
                {awards.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {awards.map((award, i) => (
                            <div key={i} className="bg-white/5 border border-yellow-500/20 p-6 rounded-[2rem] flex items-center gap-6">
                                <div className="text-3xl">🏆</div>
                                <div>
                                    <p className="font-black italic uppercase text-white text-lg tracking-tight">{award}</p>
                                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">Official Accolade</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white/5 border border-white/5 p-10 rounded-[3rem] text-center space-y-6">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10 opacity-30">
                            <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeWidth={2}/></svg>
                        </div>
                        <p className="text-gray-500 font-bold uppercase italic text-sm leading-relaxed">
                            Accolade logic is pending major season events. Win awards by dominating the charts and sustaining critical acclaim.
                        </p>
                        <div className="pt-4 flex flex-col gap-2">
                             {['The Grammys', 'BET Awards', 'MTV VMAs', 'Billboard Awards'].map(a => (
                                 <div key={a} className="flex justify-between items-center opacity-20">
                                     <span className="text-[10px] font-black uppercase tracking-widest">{a}</span>
                                     <span className="text-[8px] font-bold uppercase tracking-tighter">Locked</span>
                                 </div>
                             ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const AppsScreen: React.FC<AppsScreenProps> = ({ player, setPlayer, songs, setSongs, albums, setAlbums, notifications, gameDate }) => {
    const [activeApp, setActiveApp] = useState<AppId>('home');
    
    const unreadEmails = notifications.filter(n => (n.type !== 'Chart' && n.type !== 'Debut')).length;

    const closeApp = () => setActiveApp('home');

    if (activeApp === 'email') return <EmailApp notifications={notifications} onBack={closeApp} />;
    if (activeApp === 'wiki') return <WikiApp player={player} songs={songs} albums={albums} gameDate={gameDate} onBack={closeApp} />;
    if (activeApp === 'label') return <LabelApp player={player} onBack={closeApp} />;
    if (activeApp === 'pitchfork') return <PitchforkApp player={player} songs={songs} albums={albums} onBack={closeApp} />;
    if (activeApp === 'bank') return <BankApp player={player} gameDate={gameDate} onBack={closeApp} />;
    if (activeApp === 'awards') return <AwardsApp player={player} onBack={closeApp} />;

    return (
        <div className="min-h-screen bg-[#07070B] relative overflow-hidden font-sans p-6 sm:p-12 pb-40">
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-primary-start/5 blur-[120px] rounded-full pointer-events-none"></div>

            <header className="relative z-10 mb-12 animate-fade-in">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-red-500">Authorized Terminal</p>
                </div>
                <h1 className="text-6xl sm:text-9xl font-black italic tracking-tighter uppercase text-white leading-none drop-shadow-2xl">COMMAND</h1>
                
                {/* System Status Bar */}
                <div className="grid grid-cols-3 gap-3 mt-10">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">System Time</p>
                        <p className="text-sm font-black text-white italic">{gameDate.getFullYear()}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Global Status</p>
                        <p className="text-sm font-black text-white italic">#{player.globalRank}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Network Hub</p>
                        <p className="text-sm font-black text-green-500 italic">SECURE</p>
                    </div>
                </div>
            </header>

            <main className="relative z-10 space-y-12 animate-fade-in-up">
                {/* Communications */}
                <section>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-6 px-2">Communications</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <CommandTile 
                            label="Encryption" 
                            sub="Secure Messaging" 
                            color="bg-blue-600" 
                            badge={unreadEmails}
                            icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2.5}><path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>} 
                            onClick={() => setActiveApp('email')} 
                        />
                    </div>
                </section>

                {/* Industry Tools */}
                <section>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-6 px-2">Industry Protocols</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <CommandTile 
                            label="Radio" 
                            sub="Coming Soon" 
                            color="bg-indigo-900" 
                            disabled={true}
                            icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2.5}><path d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>} 
                            onClick={() => {}} 
                        />
                        <CommandTile 
                            label="The Label" 
                            sub={player.label} 
                            color="bg-red-700" 
                            icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2.5}><path d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0112 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18" /></svg>} 
                            onClick={() => setActiveApp('label')} 
                        />
                        <CommandTile 
                            label="Critical" 
                            sub="Market Reviews" 
                            color="bg-black" 
                            icon={<span className="font-black text-xl italic font-serif">Pf</span>} 
                            onClick={() => setActiveApp('pitchfork')} 
                        />
                    </div>
                </section>

                {/* Intelligence & Data */}
                <section>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-6 px-2">Intelligence Matrix</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <CommandTile 
                            label="Wikipedia" 
                            sub="Public Ledger" 
                            color="bg-gray-200 text-black" 
                            icon={<span className="font-serif font-black text-2xl text-black">W</span>} 
                            onClick={() => setActiveApp('wiki')} 
                        />
                        <CommandTile 
                            label="Accolades" 
                            sub="Industry Awards" 
                            color="bg-yellow-500" 
                            icon={<svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>} 
                            onClick={() => setActiveApp('awards')} 
                        />
                        <CommandTile 
                            label="Bank" 
                            sub="Capital Hub" 
                            color="bg-emerald-700" 
                            icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2.5}><path d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182" /></svg>} 
                            onClick={() => setActiveApp('bank')} 
                        />
                    </div>
                </section>
            </main>

            <footer className="absolute bottom-10 left-0 right-0 text-center opacity-10 pointer-events-none">
                <p className="text-[8px] font-black text-gray-500 uppercase tracking-[1em]">SYSTEM CORE V2.25 • RED MIC OPS</p>
            </footer>
        </div>
    );
};

export default AppsScreen;
