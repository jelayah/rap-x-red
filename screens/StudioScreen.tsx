
import React, { useState } from 'react';
import type { Player, Song, Playlist, Album, NPCArtist, SocialPost } from '../types';
import { Difficulty } from '../types';
import { GENRES, MOODS, TOPICS, PRODUCERS, WRITERS, STUDIOS, difficultySettings, FAME_STATS } from '../constants';
import { NPC_ARTISTS } from '../data/artists';
import ProgressBar from '../components/ProgressBar';
import { generateSongTitle } from '../services/geminiService';
import ReleaseSetup from '../components/ReleaseSetup';

const toDate = (d: any) => (d instanceof Date ? d : new Date(d));

interface StudioScreenProps {
  player: Player;
  setPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
  songs: Song[];
  setSongs: React.Dispatch<React.SetStateAction<Song[]>>;
  playlists: Playlist[];
  albums: Album[];
  setAlbums: React.Dispatch<React.SetStateAction<Album[]>>;
  gameDate: Date;
}

type Skill = keyof Player['skills'];

const SkillLevel: React.FC<{ label: string; value: number; onTrain: () => void; cost: number }> = ({ label, value, onTrain, cost }) => (
    <div className="bg-white/5 border border-white/5 p-4 sm:p-5 rounded-[2rem] flex flex-col justify-between group hover:border-red-600/40 transition-all duration-500">
        <div className="flex justify-between items-start mb-2 sm:mb-3">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 group-hover:text-red-500 transition-colors">{label}</span>
            <span className="text-lg sm:text-xl font-black italic text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">{value}</span>
        </div>
        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mb-4 sm:mb-6">
            <div className="bg-red-600 h-full rounded-full shadow-[0_0_15px_rgba(220,38,38,0.6)] transition-all duration-1000" style={{ width: `${value}%` }}></div>
        </div>
        <button onClick={onTrain} className="w-full py-2.5 sm:py-3 bg-white/5 hover:bg-white text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-black rounded-xl transition-all active:scale-95">
            Optimize <span className="text-red-500 group-hover:text-red-600 ml-0.5">${cost}</span>
        </button>
    </div>
);

const SongActionModal: React.FC<{ song: Song; player: Player; onClose: () => void; onAction: (action: 'delete' | 'feature' | 'polish', data?: any) => void }> = ({ song, player, onClose, onAction }) => {
    const [actionView, setActionView] = useState<'menu' | 'feature'>('menu');
    const [selectedFeature, setSelectedFeature] = useState<NPCArtist | null>(null);

    const polishCost = 500;
    const polishEnergy = 10;

    const handlePolish = () => {
        if (player.money < polishCost || player.energy < polishEnergy) {
            alert("Insufficient funds or energy.");
            return;
        }
        onAction('polish');
    };

    const handleAddFeature = () => {
        if (!selectedFeature) return;
        const tierData = FAME_STATS[selectedFeature.fameTier];
        if (player.money < tierData.cost) {
            alert(`Insufficient funds. Fee: $${tierData.cost.toLocaleString()}`);
            return;
        }
        onAction('feature', selectedFeature);
    };

    return (
        <div className="fixed inset-0 bg-[#07070B]/95 z-[100] flex items-center justify-center p-4 backdrop-blur-2xl">
            <div className="bg-[#0D0C1D] w-full max-w-sm rounded-[3rem] border border-white/10 shadow-2xl p-8 sm:p-10 animate-fade-in-up">
                <div className="text-center mb-8 sm:mb-10">
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter">Session Edit</h2>
                    <div className="h-[2px] w-8 bg-red-600 mx-auto mt-2 mb-2"></div>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em]">"{song.title}"</p>
                </div>

                {actionView === 'menu' ? (
                    <div className="space-y-3 sm:space-y-4">
                        <button onClick={() => setActionView('feature')} className="w-full bg-white/5 hover:bg-white/10 p-5 sm:p-6 rounded-[2rem] border border-white/5 text-left flex items-center justify-between group transition-all">
                            <div>
                                <p className="font-black text-sm uppercase tracking-widest text-white group-hover:text-red-500 transition-colors">Guest Verse</p>
                                <p className="text-[10px] text-gray-500 uppercase font-bold mt-1">Collab Network</p>
                            </div>
                            <svg className="w-5 h-5 text-red-600 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                        </button>
                        <button onClick={handlePolish} className="w-full bg-white/5 hover:bg-white/10 p-5 sm:p-6 rounded-[2rem] border border-white/5 text-left flex items-center justify-between group transition-all">
                            <div>
                                <p className="font-black text-sm uppercase tracking-widest text-white group-hover:text-blue-500 transition-colors">Master Polish</p>
                                <p className="text-[10px] text-gray-500 uppercase font-bold mt-1">+Gain Quality (-$500)</p>
                            </div>
                            <svg className="w-5 h-5 text-blue-500 group-hover:scale-125 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z"/></svg>
                        </button>
                        <button onClick={() => confirm(`Scrap this session?`) && onAction('delete')} className="w-full bg-red-600/5 hover:bg-red-600 p-5 sm:p-6 rounded-[2rem] border border-red-600/20 text-left flex items-center justify-between group transition-all mt-6 sm:mt-8">
                            <p className="font-black text-sm uppercase tracking-widest text-red-500 group-hover:text-white">Delete Track</p>
                            <svg className="w-5 h-5 text-red-500 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                        <button onClick={onClose} className="w-full py-4 text-[10px] font-black uppercase text-gray-700 hover:text-white transition-colors">Discard Menu</button>
                    </div>
                ) : (
                    <div className="space-y-6 sm:space-y-8">
                        <div className="relative">
                            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-3">Talent Registry</label>
                            <select 
                                className="w-full bg-white/5 text-white p-5 rounded-3xl border border-white/10 outline-none appearance-none font-bold focus:border-red-600 transition-all"
                                onChange={(e) => setSelectedFeature(NPC_ARTISTS.find(a => a.name === e.target.value) || null)}
                            >
                                <option value="">Select Artist...</option>
                                {NPC_ARTISTS.filter(a => a.name !== player.artistName && !song.features.some(f => f.artist.name === a.name)).map(a => (
                                    <option key={a.name} value={a.name}>{a.name} ({a.fameTier})</option>
                                ))}
                            </select>
                        </div>
                        {selectedFeature && (
                            <div className="bg-white/5 p-5 sm:p-6 rounded-[2.5rem] border border-white/10 space-y-3">
                                <div className="flex justify-between items-center"><span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Industry Fee</span><span className="text-green-400 font-black italic tracking-tighter text-lg">${FAME_STATS[selectedFeature.fameTier].cost.toLocaleString()}</span></div>
                                <div className="flex justify-between items-center"><span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Proj. Quality</span><span className="text-blue-400 font-black italic tracking-tighter text-lg">+{FAME_STATS[selectedFeature.fameTier].qualityBoost}pt</span></div>
                            </div>
                        )}
                        <button onClick={handleAddFeature} disabled={!selectedFeature} className="w-full bg-white text-black font-black py-5 rounded-full text-xs uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl disabled:opacity-30">Deploy Offer</button>
                        <button onClick={() => setActionView('menu')} className="w-full py-2 text-[10px] font-black uppercase text-gray-600 hover:text-white">Return</button>
                    </div>
                )}
            </div>
        </div>
    );
};

const StudioScreen: React.FC<StudioScreenProps> = ({ player, setPlayer, songs, setSongs, albums, setAlbums, gameDate }) => {
  const [view, setView] = useState<'songs' | 'projects'>('songs');
  const [isCreating, setIsCreating] = useState(false);
  const [itemToRelease, setItemToRelease] = useState<Song | Album | null>(null);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [creationStep, setCreationStep] = useState(1);
  const [genre, setGenre] = useState(GENRES[0]);
  const [mood, setMood] = useState(MOODS[0]);
  const [topic, setTopic] = useState(TOPICS[0]);
  const [songTitle, setSongTitle] = useState('');
  const [isLoadingTitle, setIsLoadingTitle] = useState(false);
  const [requestedFeatures, setRequestedFeatures] = useState<NPCArtist[]>([]);
  const [isLossless, setIsLossless] = useState(false);
  const [isDolbyAtmos, setIsDolbyAtmos] = useState(false);
  const [songVersion, setSongVersion] = useState<'Explicit' | 'Clean'>('Explicit');
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectType, setProjectType] = useState<'Album' | 'EP' | 'Mixtape'>('Album');
  const [projectCoverArt, setProjectCoverArt] = useState<string | null>(null);
  const [selectedSongsForProject, setSelectedSongsForProject] = useState<string[]>([]);

  const handleTrainSkill = (skill: Skill) => {
    const settings = difficultySettings[player.difficulty];
    const cost = Math.round((250 + player.skills[skill] * 8) * settings.cost);
    if(player.money < cost) return alert("Insufficient funds.");
    if(player.energy < 20) return alert("Exhausted. Need rest.");

    setPlayer(p => {
        if (!p) return null;
        const currentSkill = p.skills[skill];
        const gain = currentSkill < 40 ? 4 : currentSkill < 75 ? 2 : 1;
        return { ...p, money: p.money - cost, energy: p.energy - 20, skills: { ...p.skills, [skill]: Math.min(100, currentSkill + gain) } };
    });
  };

  const handleCreateSong = () => {
    const cost = 1000;
    if (player.money < cost) return alert("Insufficient funds for studio time.");
    if (player.energy < 30) return alert("Not enough energy to record.");

    const quality = Math.min(100, Math.floor(
      (player.skills.flow * 0.4) + (player.skills.production * 0.3) + (player.skills.mixing * 0.2) + (Math.random() * 10)
    ));

    const newSong: Song = {
      id: `song_${Date.now()}`,
      title: songTitle || `${mood} ${genre} Session`,
      artistName: player.artistName, genre, mood, topic, quality,
      rapifyStreams: 0, rappleStreams: 0, rapTunesStreams: 0, sales: 0, releaseDate: toDate(gameDate),
      weeklyStreams: 0, weeklySales: 0, weeklyRadioSpins: 0, weeklyRadioAudience: 0, duration: 180,
      coverArt: null, isReleased: false, version: songVersion, price: 0.99,
      charts: {}, chartHistory: {}, radioSpins: 0, shazams: 0, regionalStreams: {},
      certifications: [], features: requestedFeatures.map(artist => ({ artist, status: 'accepted' })),
      producers: ['RAP X RED AI'], writers: [player.artistName], studio: 'Red Mic Executive Studio',
      copyright: `© ${toDate(gameDate).getFullYear()} ${player.artistName}`,
      submittedToRadio: false, payolaBudget: 0, isLossless, isDolbyAtmos, dissTrack: null,
      youtubeAudioViews: 0, youtubeVideoViews: 0, hasMusicVideo: false, videoQuality: 0, youtubeViewHistory: [],
    };

    setSongs(prev => [newSong, ...prev]);
    setPlayer(p => p ? { ...p, money: p.money - cost, energy: p.energy - 30 } : null);
    setIsCreating(false); setCreationStep(1); setSongTitle(''); setRequestedFeatures([]);
  };

  const handleScheduleProject = () => {
    if (!projectTitle.trim() || !projectCoverArt || selectedSongsForProject.length === 0) return alert("Incomplete project data.");
    const newAlbumId = `album_${Date.now()}`;
    const projectSongs = selectedSongsForProject.map(id => songs.find(s => s.id === id)).filter(Boolean) as Song[];

    const newAlbum: Album = { 
        id: newAlbumId, title: projectTitle, artistName: player.artistName, type: projectType, 
        songs: projectSongs.map(s => ({...s, albumId: newAlbumId, coverArt: s.releasedAsSingle ? s.coverArt : projectCoverArt })),
        unitSales: 0, pureSales: 0, streamEquivalents: 0, weeklyUnitSales: 0,
        coverArt: projectCoverArt, price: 9.99, chartHistory: {}, certifications: [],
        copyright: `© ${toDate(gameDate).getFullYear()} ${player.artistName}`,
        rolloutProgress: { festival: false, interview: false, photoshoot: false, teaser: false, tracklist: false, announced: false },
        isExplicit: projectSongs.some(s => s.version === 'Explicit')
    };

    setSongs(prev => prev.map(s => selectedSongsForProject.includes(s.id) ? { ...s, albumId: newAlbumId, coverArt: s.releasedAsSingle ? s.coverArt : projectCoverArt } : s));
    setAlbums(prev => [...prev, newAlbum]);
    setIsCreatingProject(false);
    setItemToRelease(newAlbum);
  };

  const eligibleSongsForAlbum = songs.filter(s => (!s.albumId) || (s.isReleased && !s.albumId));

  return (
    <div className="min-h-screen bg-[#07070B] relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-600/5 blur-[120px] rounded-full animate-pulse pointer-events-none"></div>

      <div className="relative z-10 p-4 sm:p-12 space-y-8 sm:space-y-12 pb-40">
        {editingSong && <SongActionModal song={editingSong} player={player} onClose={() => setEditingSong(null)} onAction={(action, data) => {
            if (action === 'delete') setSongs(prev => prev.filter(s => s.id !== editingSong.id));
            else if (action === 'feature') setSongs(prev => prev.map(s => s.id === editingSong.id ? { ...s, features: [...s.features, { artist: data, status: 'accepted' }], quality: Math.min(100, s.quality + 5) } : s));
            else if (action === 'polish') setSongs(prev => prev.map(s => s.id === editingSong.id ? { ...s, quality: Math.min(100, s.quality + 2) } : s));
            setEditingSong(null);
        }} />}
        
        {itemToRelease && <ReleaseSetup item={itemToRelease} onRelease={(r, date, pre) => {
            if ('quality' in r) setSongs(prev => prev.map(s => s.id === r.id ? { ...(r as Song), scheduledReleaseDate: date, releasedAsSingle: true } : s));
            else setAlbums(prev => prev.map(a => a.id === r.id ? { ...(r as Album), scheduledReleaseDate: date, presaleWeeks: pre, firstWeekGoal: 5000 } : a));
            setItemToRelease(null);
        }} onCancel={() => setItemToRelease(null)} gameDate={toDate(gameDate)} />}

        <header className="border-b-4 sm:border-b-8 border-white pb-8 sm:pb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="animate-fade-in w-full">
              <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></div>
                  <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.6em] text-red-500">Authorized Recording Facility</p>
              </div>
              <h1 className="text-6xl sm:text-[10rem] font-black tracking-tighter uppercase leading-none italic drop-shadow-2xl">STUDIO</h1>
          </div>
          <div className="flex gap-3 animate-fade-in delay-200">
               <div className="bg-white/5 p-5 sm:p-6 rounded-[2.5rem] border border-white/5 text-center min-w-[140px] sm:min-w-[160px] shadow-2xl">
                  <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1 leading-none">Capital Reserve</p>
                  <p className="text-2xl sm:text-3xl font-black text-green-400 italic tracking-tighter leading-none">${player.money.toLocaleString()}</p>
               </div>
          </div>
        </header>

        <section className="animate-fade-in delay-300">
            <div className="flex items-center gap-4 mb-8 sm:mb-10">
                <h2 className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.5em] text-gray-500 whitespace-nowrap">Mixing Console</h2>
                <div className="h-[1px] flex-grow bg-white/5"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <SkillLevel label="Flow Engine" value={player.skills.flow} cost={Math.round(250 + player.skills.flow * 8)} onTrain={() => handleTrainSkill('flow')} />
                <SkillLevel label="Architecture" value={player.skills.production} cost={Math.round(250 + player.skills.production * 8)} onTrain={() => handleTrainSkill('production')} />
                <SkillLevel label="Signal Mix" value={player.skills.mixing} cost={Math.round(250 + player.skills.mixing * 8)} onTrain={() => handleTrainSkill('mixing')} />
                <SkillLevel label="Mastering" value={player.skills.mastering} cost={Math.round(250 + player.skills.mastering * 8)} onTrain={() => handleTrainSkill('mastering')} />
            </div>
        </section>

        <div className="flex bg-[#12121e] rounded-[2rem] sm:rounded-[2.5rem] p-1 gap-1 border border-white/5 shadow-inner overflow-hidden">
            <button onClick={() => setView('songs')} className={`flex-1 py-4 sm:py-5 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl sm:rounded-3xl transition-all duration-500 ${view === 'songs' ? 'bg-white text-black shadow-2xl scale-[1.02]' : 'text-gray-600 hover:text-white hover:bg-white/5'}`}>Authorized Sessions</button>
            <button onClick={() => setView('projects')} className={`flex-1 py-4 sm:py-5 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl sm:rounded-3xl transition-all duration-500 ${view === 'projects' ? 'bg-white text-black shadow-2xl scale-[1.02]' : 'text-gray-600 hover:text-white hover:bg-white/5'}`}>Compilations</button>
        </div>

        {view === 'songs' ? (
            <div className="space-y-10 sm:space-y-12 animate-fade-in">
                <button onClick={() => setIsCreating(true)} className="w-full group relative py-10 sm:py-12 bg-red-600 rounded-[3rem] sm:rounded-[3.5rem] text-white font-black uppercase tracking-[0.4em] italic text-xl sm:text-2xl shadow-2xl shadow-red-900/40 hover:scale-[1.01] active:scale-95 transition-all overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-800 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative flex flex-col items-center">
                        <span>Initialize Session</span>
                        <span className="text-[9px] sm:text-[10px] opacity-70 tracking-[0.6em] mt-2 italic font-bold">DEBIT: $1,000 & 30 ENERGY</span>
                    </div>
                </button>

                <div className="space-y-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 px-4 sm:px-6">Production Queue</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {songs.filter(s => (!s.albumId || s.releasedAsSingle) && !s.isReleased).map(song => (
                            <div key={song.id} className="bg-[#1e1e2d] p-6 sm:p-8 rounded-[3rem] sm:rounded-[3.5rem] border border-white/5 flex flex-col sm:flex-row items-center justify-between group hover:border-white/20 transition-all shadow-2xl gap-6">
                                <div className="flex items-center gap-6 sm:gap-8 w-full">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black rounded-[1.5rem] flex items-center justify-center flex-shrink-0 font-black italic text-red-600 text-2xl sm:text-3xl shadow-inner border border-white/5 group-hover:border-red-600/40 transition-colors">
                                        {song.coverArt ? <img src={song.coverArt} className="w-full h-full object-cover rounded-[1.5rem]" /> : (song.version === 'Explicit' ? 'E' : 'C')}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xl sm:text-2xl font-black italic uppercase tracking-tighter text-white truncate">{song.title}</p>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <span className="text-[8px] sm:text-[9px] text-gray-500 font-black uppercase tracking-widest">{song.genre}</span>
                                            <span className="text-[8px] sm:text-[9px] text-red-500 font-black uppercase tracking-widest">Quality: {song.quality}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3 w-full sm:w-auto">
                                    <button onClick={() => setEditingSong(song)} className="flex-1 sm:flex-none p-4 sm:p-5 bg-white/5 rounded-full hover:bg-white/10 text-gray-500 hover:text-white transition-all"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg></button>
                                    {!song.isReleased && <button onClick={() => setItemToRelease(song)} className="flex-[2] sm:flex-none px-6 sm:px-8 py-3 sm:py-4 bg-white text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-full hover:scale-105 transition-all shadow-2xl active:scale-95">Schedule</button>}
                                </div>
                            </div>
                        ))}
                    </div>
                    {songs.filter(s => (!s.albumId || s.releasedAsSingle) && !s.isReleased).length === 0 && (
                        <div className="py-20 text-center bg-white/5 rounded-[3rem] border border-dashed border-white/5 opacity-30">
                            <p className="font-black italic uppercase tracking-widest text-[10px]">Production floor empty. Initialize a new session.</p>
                        </div>
                    )}
                </div>
            </div>
        ) : (
            <div className="space-y-12 animate-fade-in">
                {!isCreatingProject ? (
                    <button onClick={() => setIsCreatingProject(true)} className="w-full group relative py-12 bg-white/5 rounded-[3.5rem] text-white font-black uppercase tracking-[0.4em] italic text-2xl border border-white/5 shadow-2xl hover:bg-white hover:text-black transition-all active:scale-95 overflow-hidden">
                         <div className="relative flex flex-col items-center">
                            <span>Assemble Project</span>
                            <span className="text-[10px] opacity-40 tracking-[0.6em] mt-2 italic font-bold">MULTIPLE ASSETS • FISCAL ERA</span>
                        </div>
                    </button>
                ) : (
                    <div className="bg-[#1e1e2d] p-6 sm:p-10 rounded-[3rem] sm:rounded-[4rem] border border-white/10 space-y-10 sm:space-y-12 animate-fade-in shadow-2xl relative">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
                            <div className="space-y-8 sm:space-y-10">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-4 px-2">Era Designation</label>
                                    <input value={projectTitle} onChange={e => setProjectTitle(e.target.value)} placeholder="ENTER TITLE..." className="w-full bg-white/5 border border-white/10 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] text-2xl sm:text-4xl font-black italic uppercase tracking-tighter focus:border-red-600 transition-all outline-none" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-4 px-2">Era Format</label>
                                    <div className="flex gap-2 sm:gap-3">
                                        {['Album', 'EP', 'Mixtape'].map(type => (
                                            <button key={type} onClick={() => setProjectType(type as any)} className={`flex-1 py-4 sm:py-5 rounded-2xl sm:rounded-3xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all duration-500 border ${projectType === type ? 'bg-white text-black border-white shadow-xl' : 'bg-white/5 text-gray-500 border-white/5 hover:border-white/20'}`}>
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.4em] px-2 text-center block">Visual core</label>
                                    <div className="aspect-square w-full max-w-[240px] sm:max-w-[300px] mx-auto bg-black rounded-[3rem] sm:rounded-[3.5rem] border-2 border-white/5 overflow-hidden relative group shadow-2xl">
                                        {projectCoverArt ? <img src={projectCoverArt} className="w-full h-full object-cover" /> : <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-700 text-center p-4"><svg className="w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg><span className="text-[8px] font-black uppercase tracking-widest leading-tight">Sync Visual Assets</span></div>}
                                        <input type="file" onChange={e => { const file = e.target.files?.[0]; if(file) { const r = new FileReader(); r.onloadend = () => setProjectCoverArt(r.result as string); r.readAsDataURL(file); } }} className="absolute inset-0 opacity-0 cursor-pointer" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6 sm:space-y-8">
                                <h3 className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.4em] text-gray-500 px-4">Authorized Tracks ({selectedSongsForProject.length})</h3>
                                <div className="bg-black/30 p-4 rounded-[2.5rem] sm:rounded-[3.5rem] border border-white/5 space-y-2 max-h-[400px] sm:max-h-[550px] overflow-y-auto scrollbar-hide shadow-inner">
                                    {eligibleSongsForAlbum.map(song => (
                                        <button key={song.id} onClick={() => setSelectedSongsForProject(prev => prev.includes(song.id) ? prev.filter(id => id !== song.id) : [...prev, song.id])} className={`w-full p-4 sm:p-5 rounded-2xl sm:rounded-3xl flex items-center justify-between border transition-all duration-500 ${selectedSongsForProject.includes(song.id) ? 'bg-white text-black border-white shadow-xl scale-[1.02]' : 'bg-white/5 text-gray-500 border-white/5 hover:bg-white/10 hover:text-white'}`}>
                                            <div className="flex items-center gap-4 sm:gap-5 text-left min-w-0">
                                                <img src={song.coverArt || ''} className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover shadow-lg" />
                                                <p className="font-black text-xs sm:text-sm uppercase italic truncate tracking-tighter">{song.title}</p>
                                            </div>
                                            <span className="text-[8px] font-black uppercase tracking-widest flex-shrink-0 ml-2">{selectedSongsForProject.includes(song.id) ? 'Locked' : 'Add'}</span>
                                        </button>
                                    ))}
                                </div>
                                <div className="pt-4 sm:pt-6 flex gap-3 sm:gap-4">
                                    <button onClick={() => setIsCreatingProject(false)} className="flex-1 py-4 sm:py-5 text-[9px] sm:text-[10px] font-black uppercase text-gray-700 hover:text-white transition-colors">Discard</button>
                                    <button onClick={handleScheduleProject} className="flex-[2] bg-white text-black font-black py-4 sm:py-5 rounded-full text-[9px] sm:text-[10px] uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-2xl active:scale-95">Verify deployment</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {albums.filter(a => !!a.scheduledReleaseDate).map(album => (
                        <div key={album.id} className="bg-[#1e1e2d] rounded-[3rem] sm:rounded-[3.5rem] border border-white/5 overflow-hidden group hover:border-red-600/30 transition-all duration-500 shadow-2xl">
                            <div className="aspect-square relative overflow-hidden bg-black">
                                <img src={album.coverArt!} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e2d] to-transparent"></div>
                                <div className="absolute bottom-8 sm:bottom-10 left-8 sm:left-10 right-8 sm:right-10">
                                    <span className="text-white text-[8px] font-black px-4 py-1.5 bg-red-600 rounded-full uppercase mb-3 sm:mb-4 inline-block tracking-widest shadow-xl">{album.type}</span>
                                    <h4 className="text-3xl sm:text-4xl font-black italic uppercase tracking-tighter text-white drop-shadow-2xl leading-tight">{album.title}</h4>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
        
        {isCreating && (
            <div className="fixed inset-0 bg-[#07070B]/98 z-[100] flex items-center justify-center p-4 backdrop-blur-3xl overflow-y-auto">
                <div className="w-full max-w-xl bg-[#0D0C1D] rounded-[3.5rem] sm:rounded-[4rem] border border-white/10 shadow-2xl p-8 sm:p-12 animate-fade-in-up relative overflow-hidden my-auto">
                    <div className="absolute -top-32 -right-32 w-80 h-80 bg-red-600/10 blur-[120px] rounded-full"></div>
                    
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-4xl sm:text-5xl font-black italic uppercase tracking-tighter leading-none">Session Init</h2>
                        <div className="h-[2px] w-12 bg-red-600 mx-auto mt-3 mb-3"></div>
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em]">Proprietary Mix Engine</p>
                    </div>

                    <div className="space-y-6 sm:space-y-8">
                        {creationStep === 1 && (
                            <div className="space-y-6 sm:space-y-8 animate-fade-in">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                                    <div className="space-y-2 sm:space-y-3">
                                        <label className="text-[10px] font-black uppercase text-gray-600 tracking-[0.2em] ml-2">Genre</label>
                                        <select value={genre} onChange={e => setGenre(e.target.value)} className="w-full bg-white/5 p-4 sm:p-5 rounded-2xl border border-white/10 text-white font-bold outline-none focus:border-red-600 transition-all text-sm">{GENRES.map(g => <option key={g} value={g}>{g}</option>)}</select>
                                    </div>
                                    <div className="space-y-2 sm:space-y-3">
                                        <label className="text-[10px] font-black uppercase text-gray-600 tracking-[0.2em] ml-2">Mood</label>
                                        <select value={mood} onChange={e => setMood(e.target.value)} className="w-full bg-white/5 p-4 sm:p-5 rounded-2xl border border-white/10 text-white font-bold outline-none focus:border-red-600 transition-all text-sm">{MOODS.map(m => <option key={m} value={m}>{m}</option>)}</select>
                                    </div>
                                    <div className="space-y-2 sm:space-y-3">
                                        <label className="text-[10px] font-black uppercase text-gray-600 tracking-[0.2em] ml-2">Subject</label>
                                        <select value={topic} onChange={e => setTopic(e.target.value)} className="w-full bg-white/5 p-4 sm:p-5 rounded-2xl border border-white/10 text-white font-bold outline-none focus:border-red-600 transition-all text-sm">{TOPICS.map(t => <option key={t} value={t}>{t}</option>)}</select>
                                    </div>
                                </div>
                                <button onClick={() => setCreationStep(2)} className="w-full bg-white text-black font-black py-5 sm:py-6 rounded-full text-[11px] sm:text-xs uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.02] transition-all mt-6">Continue</button>
                            </div>
                        )}
                        {creationStep === 2 && (
                            <div className="space-y-6 sm:space-y-8 animate-fade-in">
                                 <div className="bg-white/5 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-white/10">
                                     <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6 px-2 text-center">Version Designation</p>
                                     <div className="flex gap-2 sm:gap-3">
                                         <button onClick={() => setSongVersion('Explicit')} className={`flex-1 py-4 sm:py-5 rounded-2xl sm:rounded-3xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${songVersion === 'Explicit' ? 'bg-red-600 text-white shadow-xl scale-105' : 'bg-white/5 text-gray-600 border border-white/5'}`}>Explicit (E)</button>
                                         <button onClick={() => setSongVersion('Clean')} className={`flex-1 py-4 sm:py-5 rounded-2xl sm:rounded-3xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${songVersion === 'Clean' ? 'bg-green-600 text-white shadow-xl scale-105' : 'bg-white/5 text-gray-600 border border-white/5'}`}>Clean</button>
                                     </div>
                                 </div>
                                 <div className="bg-white/5 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-white/10 space-y-4 sm:space-y-6">
                                     <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2 text-center">Encoders</p>
                                     <label className="flex items-center justify-between group cursor-pointer p-1">
                                         <span className="text-[11px] sm:text-sm font-black text-gray-400 group-hover:text-white uppercase tracking-tighter">Lossless Logic</span>
                                         <input type="checkbox" checked={isLossless} onChange={e => setIsLossless(e.target.checked)} className="w-5 h-5 sm:w-6 sm:h-6 accent-red-600 rounded-lg" />
                                     </label>
                                     <label className="flex items-center justify-between group cursor-pointer p-1">
                                         <span className="text-[11px] sm:text-sm font-black text-gray-400 group-hover:text-white uppercase tracking-tighter">Spatial Decoder</span>
                                         <input type="checkbox" checked={isDolbyAtmos} onChange={e => setIsDolbyAtmos(e.target.checked)} className="w-5 h-5 sm:w-6 sm:h-6 accent-red-600 rounded-lg" />
                                     </label>
                                 </div>
                                 <button onClick={() => setCreationStep(3)} className="w-full bg-white text-black font-black py-5 sm:py-6 rounded-full text-[11px] sm:text-xs uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.02] transition-all">Verify logic</button>
                            </div>
                        )}
                        {creationStep === 3 && (
                            <div className="space-y-8 sm:space-y-10 animate-fade-in">
                                <div className="relative">
                                    <label className="text-[10px] font-black uppercase text-gray-600 tracking-[0.4em] ml-4 mb-4 block">Session Designation</label>
                                    <div className="flex gap-2 sm:gap-3">
                                        <input value={songTitle} onChange={e => setSongTitle(e.target.value)} placeholder="ENTER TITLE..." className="flex-grow bg-white/5 border border-white/10 p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] text-white font-black italic uppercase tracking-tighter outline-none focus:border-red-600 transition-all text-lg sm:text-xl" />
                                        <button onClick={async () => { setIsLoadingTitle(true); setSongTitle(await generateSongTitle(genre, mood, topic)); setIsLoadingTitle(false); }} disabled={isLoadingTitle} className="bg-red-600 px-6 sm:px-8 rounded-[1.5rem] sm:rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl disabled:opacity-30">{isLoadingTitle ? '...' : 'AI'}</button>
                                    </div>
                                </div>
                                <button onClick={handleCreateSong} className="w-full bg-white text-black font-black py-6 sm:py-8 rounded-full text-[13px] sm:text-sm uppercase tracking-[0.4em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all mt-4 sm:mt-6">Authorized Sync ($1,000)</button>
                            </div>
                        )}
                        <button onClick={() => creationStep > 1 ? setCreationStep(creationStep - 1) : setIsCreating(false)} className="w-full py-2 text-[10px] font-black uppercase text-gray-700 hover:text-white transition-colors">{creationStep > 1 ? 'Back' : 'Abort'}</button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default StudioScreen;
