
import React, { useState } from 'react';
import type { Player, Song, Album, Tour, ChartData } from '../types';
import XScreen from './XScreen';
import YouTubeScreen from './YouTubeScreen';
import InstagramScreen from './InstagramScreen';
import TikTokScreen from './TikTokScreen';

interface SocialScreenProps {
  player: Player;
  setPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
  songs: Song[];
  setSongs: React.Dispatch<React.SetStateAction<Song[]>>;
  albums: Album[];
  tours: Tour[];
  chartsData: ChartData;
  gameDate: Date;
}

const XIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white"><title>X</title><path fill="currentColor" d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
);
const InstagramIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white"><title>Instagram</title><path fill="currentColor" d="M12 0C8.74 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.74 0 12s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.267.058 1.67.072 4.947.072s3.68-.014 4.947-.072c4.357-.2 6.78-2.618 6.979-6.98.059-1.28.073-1.67.073-4.947s-.014-3.667-.072-4.947C21.302 2.69 18.88.273 14.948.072 13.667.014 13.26 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"/></svg>
);
const TikTokIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white"><title>TikTok</title><path fill="currentColor" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.05-4.84-.9-6.66-2.47-1.52-1.32-2.5-3.05-2.71-4.96-.25-2.28.67-4.57 2.3-6.15.02-.01.03-.02.05-.03 1.48-1.49 3.38-2.52 5.38-2.56v4.86c-1.14.02-2.28-.02-3.42-.01-1.01.01-2.02.38-2.85 1.15-.81.79-1.28 1.76-1.33 2.8-.09 1.9.83 3.82 2.53 4.72 1.05.57 2.22.78 3.36.71.95-.06 1.88-.34 2.74-.81.92-.49 1.72-1.18 2.32-2.05.58-.84.91-1.83.99-2.82.03-2.9.01-5.8-.01-8.7.01-1.33-.3-2.63-.89-3.8-.59-1.18-1.48-2.18-2.56-2.95A4.444 4.444 0 0012.525.02"/></svg>
);
const YouTubeIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white">
        <title>YouTube</title>
        <path fill="currentColor" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
);

const AppButton: React.FC<{ name: string; icon: React.ReactNode; onClick: () => void; bgColor?: string; border?: string }> = ({ name, icon, onClick, bgColor = 'bg-brand-surface', border = 'border-white/5' }) => (
    <button
        onClick={onClick}
        className="flex flex-col items-center justify-center gap-3 group transition-all"
        aria-label={`Open ${name}`}
    >
        <div className={`w-20 h-20 sm:w-24 sm:h-24 ${bgColor} rounded-[2rem] flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-active:scale-95 transition-all relative overflow-hidden border-2 ${border}`}>
             {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
            <div className="relative z-10 drop-shadow-lg">{icon}</div>
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white opacity-40 group-hover:opacity-100 transition-opacity">{name}</span>
    </button>
);

const SocialScreen: React.FC<SocialScreenProps> = (props) => {
    const { player, songs, albums, tours, chartsData, gameDate, setPlayer, setSongs } = props;
    const [activeApp, setActiveApp] = useState<'none' | 'x' | 'instagram' | 'tiktok' | 'youtube'>('none');

    const openApp = (appName: 'x' | 'instagram' | 'tiktok' | 'youtube') => setActiveApp(appName);
    const closeApp = () => setActiveApp('none');

    if (activeApp === 'x') {
        return <XScreen player={player} setPlayer={setPlayer} songs={songs} albums={albums} tours={tours} chartsData={chartsData} gameDate={gameDate} onBack={closeApp} />;
    }
    if (activeApp === 'youtube') {
        return <YouTubeScreen player={player} songs={songs} albums={albums} setPlayer={setPlayer} onBack={closeApp} gameDate={gameDate} />;
    }
    if (activeApp === 'instagram') {
        return <InstagramScreen player={player} setPlayer={setPlayer} songs={songs} albums={albums} tours={tours} onBack={closeApp} gameDate={gameDate} />;
    }
    if (activeApp === 'tiktok') {
        return <TikTokScreen player={player} setPlayer={setPlayer} songs={songs} setSongs={setSongs} albums={albums} onBack={closeApp} gameDate={gameDate} />;
    }

    return (
        <div className="min-h-screen bg-[#07070B] relative overflow-hidden font-sans flex flex-col items-center justify-center">
             <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-brand-primary-start/5 blur-[120px] rounded-full"></div>
             
             <div className="relative z-10 text-center mb-16 animate-fade-in">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                    <p className="text-[9px] font-black uppercase tracking-[0.6em] text-gray-500">Industry Outreach Hub</p>
                </div>
                <h1 className="text-5xl sm:text-7xl font-black italic tracking-tighter uppercase leading-none text-white drop-shadow-2xl">Connect</h1>
             </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-12 sm:gap-16 relative z-10 animate-fade-in-up">
                <AppButton name="X / Pulse" icon={<XIcon />} onClick={() => openApp('x')} bgColor="bg-black" border="border-white/10" />
                <AppButton name="Insta / Feed" icon={<InstagramIcon />} onClick={() => openApp('instagram')} bgColor="bg-gradient-to-br from-yellow-400 via-red-500 to-purple-600" border="border-white/20" />
                <AppButton name="TikTok / Viral" icon={<TikTokIcon />} onClick={() => openApp('tiktok')} bgColor="bg-[#010101]" border="border-[#FE2C55]/20" />
                <AppButton name="YouTube / HQ" icon={<YouTubeIcon />} onClick={() => openApp('youtube')} bgColor="bg-[#FF0000]" border="border-white/20" />
            </div>

            <footer className="absolute bottom-20 left-0 right-0 text-center opacity-10">
                <p className="text-[8px] font-black uppercase tracking-[0.8em]">GLOBAL NETWORK SYNC • RAP X RED OPERATIONS</p>
            </footer>
        </div>
    );
};

export default SocialScreen;
