
import React, { useState } from 'react';
import type { Player, Song, NPCArtist } from '../types';
import CreditsModal from './CreditsModal';
import { NPC_ARTISTS } from '../data/artists';

interface RapifySongDetailScreenProps {
    song: Song;
    player: Player;
    onBack: () => void;
}

const Icon = ({ path, className = 'w-8 h-8' }: { path: string; className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);


const RapifySongDetailScreen: React.FC<RapifySongDetailScreenProps> = ({ song, player, onBack }) => {
    const [showCredits, setShowCredits] = useState(false);

    const isPlayerSong = song.artistName === player.artistName;
    const artistForImage: Player | NPCArtist | undefined = isPlayerSong
        ? player
        : NPC_ARTISTS.find(a => a.name === song.artistName);

    const coverArtSrc = song.coverArt || `https://source.unsplash.com/400x400/?${encodeURIComponent(song.title + ' music')}`;
    
    let artistImageSrc = `https://source.unsplash.com/100x100/?${encodeURIComponent(song.artistName + ' portrait')}`;
    if (artistForImage) {
        const isPlayerProfile = 'money' in artistForImage;
        artistImageSrc = isPlayerProfile
            ? artistForImage.aboutImage || `https://source.unsplash.com/100x100/?${encodeURIComponent(artistForImage.artistName + ' portrait')}`
            : `https://source.unsplash.com/100x100/?${encodeURIComponent(artistForImage.artistImage)}`;
    }

    const rapifyStreams = song.rapifyStreams;

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
            <div className="bg-gradient-to-b from-[#501828] to-[#121212] text-white min-h-screen font-sans absolute inset-0 z-20 overflow-y-auto">
                <button onClick={onBack} className="absolute top-4 left-4 z-30 bg-black/50 rounded-full p-2 hover:bg-black/80">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>

                <main className="p-6 pt-20">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                        <img src={coverArtSrc} alt={song.title} className="w-48 h-48 md:w-60 md:h-60 object-cover rounded-md shadow-2xl flex-shrink-0" />
                        <div className="flex flex-col items-center md:items-start text-center md:text-left">
                            <p className="font-bold text-sm">Song</p>
                            <h1 className="text-5xl md:text-8xl font-black tracking-tighter break-words">{song.title}</h1>
                            <div className="flex items-center flex-wrap justify-center gap-x-2 mt-4 text-sm font-semibold">
                                <img src={artistImageSrc} alt={song.artistName} className="w-6 h-6 rounded-full object-cover"/>
                                <span>{artistDisplayName}</span>
                                <span className="text-gray-400">•</span>
                                <span>{releaseYear}</span>
                                <span className="text-gray-400">•</span>
                                <span>{formatDuration(song.duration)}</span>
                                <span className="text-gray-400">•</span>
                                <span className="text-[#1ED760] font-black">{rapifyStreams.toLocaleString()} Rapify plays</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 my-8">
                        <button className="bg-[#1DB954] rounded-full p-4 hover:scale-105 transition-transform flex items-center justify-center shadow-xl">
                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-black"><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.748 1.295 2.535 0 3.284L7.279 20.99c-1.25.72-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" /></svg>
                        </button>
                        <button onClick={() => setShowCredits(true)} className="text-gray-300 hover:text-white border-2 border-gray-600 rounded-full px-4 py-1 text-xs font-bold uppercase tracking-widest">View Credits</button>
                    </div>
                </main>
            </div>
        </>
    );
};

export default RapifySongDetailScreen;
