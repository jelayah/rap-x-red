
import React, { useState } from 'react';
import type { Player, Song, NPCArtist } from '../types';
import CreditsModal from './CreditsModal';
import { NPC_ARTISTS } from '../data/artists';
import { getDisplayGenre } from '../constants';

interface RapifySongDetailScreenProps {
    song: Song;
    player: Player;
    onBack: () => void;
}

const RapifySongDetailScreen: React.FC<RapifySongDetailScreenProps> = ({ song, player, onBack }) => {
    const [showCredits, setShowCredits] = useState(false);

    const isPlayerSong = song.artistName === player.artistName;
    const artistForImage: Player | NPCArtist | undefined = isPlayerSong
        ? player
        : NPC_ARTISTS.find(a => a.name === song.artistName);

    // Fixed: Prioritize actual song cover art over fallbacks
    const coverArtSrc = song.coverArt || `https://source.unsplash.com/600x600/?${encodeURIComponent(song.title + ' music cover art')}`;
    
    let artistImageSrc = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=100";
    if (artistForImage) {
        const isPlayerProfile = 'money' in artistForImage;
        artistImageSrc = isPlayerProfile
            ? (artistForImage as Player).aboutImage || artistImageSrc
            : `https://source.unsplash.com/100x100/?portrait`;
    }

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const releaseYear = new Date(song.releaseDate).getFullYear();
    const acceptedFeatures = song.features?.filter(f => f.status === 'accepted').map(f => f.artist.name);
    const artistDisplayName = acceptedFeatures && acceptedFeatures.length > 0 
        ? `${song.artistName}, ${acceptedFeatures.join(', ')}` 
        : song.artistName;

    return (
        <>
            {showCredits && <CreditsModal song={song} player={player} onClose={() => setShowCredits(false)} />}
            <div className="bg-[#121212] text-white min-h-screen font-sans absolute inset-0 z-[80] overflow-y-auto scrollbar-hide pb-32">
                <header className="sticky top-0 z-30 flex items-center h-16 px-4 bg-[#121212]/80 backdrop-blur-md border-b border-white/5">
                    <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                    </button>
                </header>

                <div className="bg-gradient-to-b from-[#404040] to-[#121212] p-6 pt-4">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                        <img src={coverArtSrc} alt={song.title} className="w-48 h-48 md:w-60 md:h-60 object-cover shadow-2xl rounded flex-shrink-0" />
                        <div className="flex flex-col items-center md:items-start text-center md:text-left">
                            <p className="font-bold text-xs uppercase tracking-widest">Single</p>
                            <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-tight">{song.title}</h1>
                            <div className="flex items-center flex-wrap justify-center md:justify-start gap-x-2 mt-4 text-sm font-bold">
                                <img src={artistImageSrc} alt={song.artistName} className="w-6 h-6 rounded-full object-cover"/>
                                <span className="hover:underline cursor-pointer">{artistDisplayName}</span>
                                <span className="text-gray-400">•</span>
                                <span className="text-gray-300">{releaseYear}</span>
                                <span className="text-gray-400">•</span>
                                <span className="text-gray-400 font-medium">{formatDuration(song.duration)}</span>
                                <span className="text-gray-400">•</span>
                                <span className="text-gray-400 font-medium">{getDisplayGenre(song.genre)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex items-center gap-8 mb-10">
                        <button className="bg-[#1DB954] rounded-full p-4 hover:scale-105 transition-transform flex items-center justify-center shadow-xl">
                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-black"><path fillRule="evenodd" d="M7.05 3.606l13.49 7.79a.7.7 0 010 1.212L7.05 20.398a.7.7 0 01-1.05-.606V4.212a.7.7 0 011.05-.606z" clipRule="evenodd" /></svg>
                        </button>
                        <button onClick={() => setShowCredits(true)} className="text-gray-400 hover:text-white border border-gray-600 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-all">View Credits</button>
                    </div>

                    <div className="grid grid-cols-[30px_1fr_auto] gap-4 text-gray-400 text-xs font-bold uppercase tracking-wider border-b border-white/5 pb-2 mb-4 px-3">
                        <span>#</span>
                        <span>Title</span>
                        <svg role="img" height="16" width="16" viewBox="0 0 16 16" className="fill-current"><path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"></path><path d="M8 3.25a.75.75 0 0 1 .75.75v3.25H11a.75.75 0 0 1 0 1.5H7.25V4A.75.75 0 0 1 8 3.25z"></path></svg>
                    </div>

                    <div className="group grid grid-cols-[30px_1fr_auto] items-center gap-4 p-2 rounded-md hover:bg-white/10 transition-colors cursor-pointer">
                        <span className="text-center font-semibold text-[#1DB954] text-sm">1</span>
                        <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="text-white font-bold text-[15px] truncate">{song.title}</span>
                                {song.version === 'Explicit' && <span className="bg-[#3e3e3e] text-[#9ca3af] text-[8px] px-1 rounded-[1px] h-3.5 flex items-center justify-center font-black">E</span>}
                            </div>
                            <span className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors">{artistDisplayName}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-400 tabular-nums">{formatDuration(song.duration)}</span>
                    </div>

                    <div className="mt-12 text-xs text-gray-500 space-y-1 px-2 font-medium">
                        <p>{new Date(song.releaseDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        <p className="mt-4">{song.copyright}</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RapifySongDetailScreen;
