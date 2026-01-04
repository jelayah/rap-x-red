
import React, { useState } from 'react';
import type { Player, Song, Album, NPCArtist, Playlist } from '../types';
import RapifyProfileScreen from './RapifyProfileScreen';
import RapifyChartsScreen from './RapifyChartsScreen';

type RapifyTab = 'home' | 'search' | 'charts';

interface RapifyAppProps {
    player: Player;
    initialArtistForProfile: Player | NPCArtist;
    allSongs: Song[];
    allAlbums: Album[];
    playlists: Playlist[];
    onBack: () => void;
    setPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
}

const RapifyBottomNav: React.FC<{ activeTab: RapifyTab, setActiveTab: (tab: RapifyTab) => void }> = ({ activeTab, setActiveTab }) => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black to-black/90 backdrop-blur-md border-t border-white/5 flex justify-around items-center h-20 z-[70] px-6 pb-6">
            <button 
                onClick={() => setActiveTab('home')}
                className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'home' ? 'text-white scale-105' : 'text-gray-400 hover:text-gray-200'}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                    <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                    <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.725A1.875 1.875 0 013.85 19.875V13.68c.03-.028.06-.056.091-.086L12 5.432z" />
                </svg>
                <span className="text-[10px] font-bold">Home</span>
            </button>
            <button 
                onClick={() => setActiveTab('charts')}
                className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'charts' ? 'text-white scale-105' : 'text-gray-400 hover:text-gray-200'}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                    <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.035-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.035.84-1.875 1.875-1.875h.75c1.035 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.035.84-1.875 1.875-1.875h.75c1.035 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
                </svg>
                <span className="text-[10px] font-bold">Charts</span>
            </button>
        </nav>
    );
};

const RapifyApp: React.FC<RapifyAppProps> = ({ player, initialArtistForProfile, allSongs, allAlbums, playlists, onBack, setPlayer }) => {
    const [activeTab, setActiveTab] = useState<RapifyTab>('home');

    const renderContent = () => {
        switch (activeTab) {
            case 'home':
            case 'search': // Search logic not yet implemented, defaulting to home/profile
                return (
                    <RapifyProfileScreen 
                        artist={initialArtistForProfile} 
                        player={player} 
                        songs={allSongs} 
                        albums={allAlbums} 
                        playlists={playlists} 
                        onBack={onBack} 
                        setPlayer={setPlayer} 
                    />
                );
            case 'charts':
                return <RapifyChartsScreen allSongs={allSongs} allAlbums={allAlbums} player={player} />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-[#121212] text-white min-h-screen font-sans fixed inset-0 z-[60] overflow-hidden flex flex-col">
            <main className="flex-grow overflow-hidden relative">
                {renderContent()}
            </main>
            <RapifyBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
    );
};

export default RapifyApp;
