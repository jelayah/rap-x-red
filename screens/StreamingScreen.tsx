
import React from 'react';
import type { Player, Song, Playlist, Album, NPCArtist } from '../types';
import RapifyApp from './RapifyApp';
import RappleMusicForArtistsScreen from './RappleMusicForArtistsScreen';
import RapTunesStoreScreen from './RapTunesStoreScreen';
import RapifyForArtistsScreen from './RapifyForArtistsScreen';
import RappleMusicApp from './RappleMusicApp';
import RapCloudApp from './RapCloudApp';

interface StreamingScreenProps {
  player: Player;
  songs: Song[];
  setPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
  playlists: Playlist[];
  albums: Album[];
  gameDate: Date;
  activeApp: { app: string, artist?: NPCArtist } | { app: 'none' };
  setActiveApp: React.Dispatch<React.SetStateAction<{ app: string, artist?: NPCArtist } | { app: 'none' }>>;
  npcSongs: Song[];
  npcAlbums: Album[];
}

const AppLauncher: React.FC<{ 
    name: string; 
    icon: React.ReactNode; 
    onClick: () => void; 
    bgColor: string; 
    subtitle?: string;
    isLarge?: boolean;
}> = ({ name, icon, onClick, bgColor, subtitle, isLarge }) => (
    <button 
        onClick={onClick}
        className={`group relative flex flex-col items-center gap-3 transition-all duration-500 active:scale-95 ${isLarge ? 'col-span-2' : ''}`}
    >
        <div className={`relative ${isLarge ? 'w-24 h-24' : 'w-16 h-16'} ${bgColor} rounded-[1.5rem] flex items-center justify-center shadow-2xl overflow-hidden transform group-hover:scale-110 group-hover:-translate-y-1 transition-transform`}>
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50"></div>
            <div className="relative z-10 drop-shadow-lg">{icon}</div>
        </div>
        <div className="text-center">
            <p className={`font-black uppercase tracking-widest text-white leading-none ${isLarge ? 'text-xs' : 'text-[10px]'}`}>{name}</p>
            {subtitle && <p className="text-[8px] text-gray-500 font-bold uppercase tracking-tighter mt-1 opacity-0 group-hover:opacity-100 transition-opacity">{subtitle}</p>}
        </div>
    </button>
);

const StreamingScreen: React.FC<StreamingScreenProps> = ({ 
    player, songs, setPlayer, playlists, albums, gameDate, activeApp, setActiveApp, npcSongs, npcAlbums 
}) => {
    
    const openApp = (appName: string) => setActiveApp({ app: appName });
    const closeApp = () => setActiveApp({ app: 'none' });

    const allSongs = [...songs, ...npcSongs];
    const allAlbums = [...albums, ...npcAlbums];

    if (activeApp.app === 'rapify') {
        const artistToView = activeApp.artist ? activeApp.artist : player;
        return (
            <RapifyApp 
                player={player}
                initialArtistForProfile={artistToView}
                allSongs={allSongs}
                allAlbums={allAlbums}
                playlists={playlists}
                onBack={closeApp}
                setPlayer={setPlayer}
            />
        );
    }
    
    if (activeApp.app === 'rapple') {
        const artistToView = activeApp.artist ? activeApp.artist : player;
        return <RappleMusicApp
            player={player}
            initialArtistForProfile={artistToView}
            allSongs={allSongs}
            allAlbums={allAlbums}
            onBack={closeApp}
            setPlayer={setPlayer}
        />;
    }

    if (activeApp.app === 'rapple_artists') {
        return <RappleMusicForArtistsScreen player={player} songs={songs} onBack={closeApp} gameDate={gameDate} />;
    }
    
    if (activeApp.app === 'rapify_artists') {
        return <RapifyForArtistsScreen player={player} songs={songs} playlists={playlists} onBack={closeApp} albums={albums} gameDate={gameDate} />;
    }

    if (activeApp.app === 'raptunes') {
        return <RapTunesStoreScreen 
            player={player} 
            songs={songs} 
            albums={albums} 
            npcSongs={npcSongs}
            npcAlbums={npcAlbums}
            onBack={closeApp} 
        />;
    }

    if (activeApp.app === 'rapcloud') {
        return <RapCloudApp player={player} songs={songs} onBack={closeApp} gameDate={gameDate} />;
    }

    return (
        <div className="min-h-screen bg-[#07070B] relative overflow-hidden font-sans">
            {/* Background Aesthetic */}
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/5 blur-[120px] rounded-full animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-red-600/5 blur-[120px] rounded-full"></div>

            <main className="relative z-10 p-6 sm:p-12 space-y-12 max-w-4xl mx-auto pb-40">
                <header className="border-b border-white/10 pb-8 animate-fade-in">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500">Distribution Terminal</p>
                    </div>
                    <h1 className="text-5xl sm:text-7xl font-black tracking-tighter italic uppercase text-white leading-none">Marketplace</h1>
                </header>

                <div className="space-y-16">
                    {/* Primary Platforms Section */}
                    <section className="animate-fade-in-up">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-8 border-l-2 border-white/20 pl-4">Consumer Ecosystems</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 sm:gap-8">
                            <AppLauncher 
                                name="Rapify" 
                                subtitle="Streaming Hub"
                                bgColor="bg-gradient-to-br from-[#1DB954] to-[#14833b]"
                                icon={
                                    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-white fill-current">
                                        <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm5.508 17.304c-.216.336-.672.456-1.008.24-2.736-1.68-6.192-2.04-10.248-.888-.384.108-.78-.132-.888-.516s.132-.78.516-.888c4.464-1.272 8.304-.864 11.388 1.032.336.216.444.672.24 1.008zm1.464-3.264c-.276.432-.84.576-1.272.3-3.132-1.92-7.896-2.472-11.592-1.356-.48.144-.996-.132-1.14-.612-.144-.48.132-.996.612-1.14 4.224-1.284 9.48-.672 13.104 1.548.432.264.576.828.288 1.26zm.132-3.384C15.84 8.76 10.14 8.568 6.42 9.696c-.576.18-1.188-.132-1.368-.708s.132-1.188.708-1.368c4.212-1.284 10.488-1.056 15.3 1.8.516.3.684.972.384 1.488-.3.516-.972.672-1.488.372z"/>
                                    </svg>
                                }
                                onClick={() => openApp('rapify')}
                            />
                            <AppLauncher 
                                name="Rapple" 
                                subtitle="High Fidelity"
                                bgColor="bg-gradient-to-br from-[#FA2D48] to-[#921828]"
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" className="w-10 h-10 text-white"><path d="M9 13c0 1.105-1.12 2-2.5 2S4 14.105 4 13s1.12-2 2.5-2 2.5.895 2.5 2z"/><path fillRule="evenodd" d="M9 3v10H8V3h1z"/><path d="M8 2.5a.5.5 0 0 1 .5.5v10a.5.5 0 0 1-1 0v-10A.5.5 0 0 1 8 2.5z"/></svg>
                                }
                                onClick={() => openApp('rapple')}
                            />
                            <AppLauncher 
                                name="Rap Cloud" 
                                subtitle="Underground"
                                bgColor="bg-gradient-to-br from-[#FF5500] to-[#FF2200]"
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-10 h-10 text-white"><path d="M22.5 15.5c0 1.93-1.57 3.5-3.5 3.5H7c-2.76 0-5-2.24-5-5s2.24-5 5-5c.34 0 .67.03 1 .1C9.07 6.13 11.36 4 14 4c3.31 0 6 2.69 6 6 0 .34-.03.67-.1 1 1.57.54 2.6 2.03 2.6 3.5z"/></svg>
                                }
                                onClick={() => openApp('rapcloud')}
                            />
                            <AppLauncher 
                                name="RapTunes" 
                                subtitle="Digital Store"
                                bgColor="bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500"
                                icon={
                                    <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 16 16" className="w-8 h-8"><path d="M9 13c0 1.105-1.12 2-2.5 2S4 14.105 4 13s1.12-2 2.5-2 2.5.895 2.5 2z" /><path fillRule="evenodd" d="M9 3v10H8V3h1z" /><path d="M8 2.5a.5.5 0 0 1 .5.5v10a.5.5 0 0 1 -1 0v-10A.5.5 0 0 1 8 2.5z" /></svg>
                                    </div>
                                }
                                onClick={() => openApp('raptunes')}
                            />
                        </div>
                    </section>

                    {/* Analytics Section */}
                    <section className="animate-fade-in-up delay-200">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-8 border-l-2 border-white/20 pl-4">Creator Intelligence</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                             <AppLauncher 
                                name="Rapify 4A" 
                                subtitle="Analytics"
                                bgColor="bg-[#004d26] border border-white/5"
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-green-400">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                                    </svg>
                                }
                                onClick={() => openApp('rapify_artists')}
                            />
                             <AppLauncher 
                                name="Rapple 4A" 
                                subtitle="Dashboard"
                                bgColor="bg-[#1c1c1e] border border-white/10 shadow-xl"
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-red-500">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                                    </svg>
                                }
                                onClick={() => openApp('rapple_artists')}
                            />
                        </div>
                    </section>
                </div>

                <div className="bg-gradient-to-r from-blue-900/10 to-transparent border-l-4 border-blue-600 p-8 rounded-r-[2.5rem] mt-20 animate-fade-in-up delay-300">
                    <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Network Status</p>
                    <p className="text-sm text-gray-400 font-medium leading-relaxed">
                        All distribution endpoints are active. Consumption data is syncing in real-time across <span className="text-white font-bold">142 global territories</span>.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default StreamingScreen;
