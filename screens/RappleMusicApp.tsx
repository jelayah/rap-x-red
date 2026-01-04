
import React, { useState } from 'react';
import type { Player, Song, Album, NPCArtist } from '../types';
import RappleMusicItemDetailScreen from './RappleMusicItemDetailScreen';
import RappleMusicProfileScreen from './RappleMusicProfileScreen';
import RappleChartsScreen from './RappleChartsScreen';
import PlaceholderScreen from './PlaceholderScreen';

type RappleTab = 'charts' | 'profile';

interface RappleMusicAppProps {
    player: Player;
    initialArtistForProfile: Player | NPCArtist;
    allSongs: Song[];
    allAlbums: Album[];
    onBack: () => void;
    setPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
}

const RappleBottomNav: React.FC<{ activeTab: RappleTab, setActiveTab: (tab: RappleTab) => void }> = ({ activeTab, setActiveTab }) => {
    const tabs: { id: RappleTab, label: string, icon: React.ReactNode }[] = [
        { id: 'charts', label: 'Charts', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg> },
        { id: 'profile', label: 'Profile', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" /></svg> },
    ];
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-md border-t border-gray-700 flex justify-around z-[70]">
            {tabs.map(tab => (
                 <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center justify-center p-2 w-full transition-colors duration-200 ${activeTab === tab.id ? 'text-pink-500' : 'text-gray-400 hover:text-white'}`}>
                    {tab.icon}
                    <span className="text-xs mt-1">{tab.label}</span>
                </button>
            ))}
        </nav>
    )
}

const RappleMusicApp: React.FC<RappleMusicAppProps> = ({ player, initialArtistForProfile, allSongs, allAlbums, onBack, setPlayer }) => {
    const [activeTab, setActiveTab] = useState<RappleTab>('charts');
    const [viewingItem, setViewingItem] = useState<Song | Album | null>(null);

    if (viewingItem) {
        return <RappleMusicItemDetailScreen 
            item={viewingItem}
            player={player}
            allAlbums={allAlbums}
            allSongs={allSongs.filter(s => s.isReleased)}
            onBack={() => setViewingItem(null)}
        />;
    }

    const artistNameForProfile = 'artistName' in initialArtistForProfile ? initialArtistForProfile.artistName : initialArtistForProfile.name;

    const renderContent = () => {
        switch (activeTab) {
            case 'charts':
                return <RappleChartsScreen allSongs={allSongs} allAlbums={allAlbums} onSelectItem={setViewingItem} />;
            case 'profile':
                return <RappleMusicProfileScreen
                    artist={initialArtistForProfile}
                    player={player}
                    songs={allSongs.filter(s => s.artistName === artistNameForProfile)}
                    albums={allAlbums.filter(a => a.artistName === artistNameForProfile)}
                    setPlayer={setPlayer}
                    onSelectItem={setViewingItem}
                    // Fix: Passed onBack down to RappleMusicProfileScreen to resolve error in its catch block
                    onBack={onBack}
                />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-black text-white min-h-screen font-sans fixed inset-0 z-[60] overflow-hidden flex flex-col">
             <button onClick={onBack} className="absolute top-4 left-4 z-20 bg-black/50 rounded-full p-2 hover:bg-black/80">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            </button>
            <main className="flex-grow overflow-hidden">
                {renderContent()}
            </main>
            <RappleBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
    );
};

export default RappleMusicApp;
