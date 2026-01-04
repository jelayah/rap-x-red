
import React from 'react';
import type { Player, Album, Song } from '../types';

interface RapifyAlbumDetailScreenProps {
    album: Album;
    player: Player;
    onBack: () => void;
    onSongSelect: (song: Song) => void;
}

const RapifyAlbumDetailScreen: React.FC<RapifyAlbumDetailScreenProps> = ({ album, player, onBack, onSongSelect }) => {

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes} min ${remainingSeconds} sec`;
    };
    
    const formatTrackDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const totalDuration = album.songs.reduce((acc, s) => acc + s.duration, 0);
    const releaseYear = new Date(album.releaseDate).getFullYear();

    return (
        <div className="bg-[#121212] text-white min-h-screen font-sans absolute inset-0 z-[80] overflow-y-auto scrollbar-hide">
            <header className="sticky top-0 z-30 flex items-center h-16 px-4 bg-[#121212]/80 backdrop-blur-md border-b border-white/5">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                </button>
            </header>

            <div className="bg-gradient-to-b from-[#282828] to-[#121212] p-6 pt-4">
                <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                    <img src={album.coverArt!} alt={album.title} className="w-48 h-48 md:w-60 md:h-60 object-cover shadow-2xl rounded flex-shrink-0" />
                    <div className="flex flex-col gap-2 text-center md:text-left">
                        <span className="text-xs font-bold uppercase tracking-widest">{album.type}</span>
                        <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-none">{album.title}</h1>
                        <div className="flex items-center justify-center md:justify-start gap-1.5 text-sm font-bold mt-4 text-gray-300">
                            <span className="text-white hover:underline cursor-pointer">{album.artistName}</span>
                            <span>•</span>
                            <span>{releaseYear}</span>
                            <span>•</span>
                            <span>{album.songs.length} songs</span>
                            <span className="text-gray-400 font-medium">, {formatDuration(totalDuration)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 pb-32">
                <div className="flex items-center gap-8 mb-8">
                    <button className="bg-[#1ED760] rounded-full p-4 hover:scale-105 transition-transform flex items-center justify-center shadow-xl">
                        <svg role="img" height="24" width="24" viewBox="0 0 24 24" aria-hidden="true" className="text-black fill-current">
                            <path d="M7.05 3.606l13.49 7.79a.7.7 0 010 1.212L7.05 20.398a.7.7 0 01-1.05-.606V4.212a.7.7 0 011.05-.606z"></path>
                        </svg>
                    </button>
                    <button className="text-gray-400 hover:text-white transition-colors">
                        <svg role="img" height="32" width="32" viewBox="0 0 24 24" className="fill-current"><path d="M11.999 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm-11 9c0-6.075 4.925-11 11-11s11 4.925 11 11-4.925 11-11 11-11-4.925-11-11z"></path><path d="M17.999 12a1 1 0 0 1-1 1h-4v4a1 1 0 1 1-2 0v-4h-4a1 1 0 1 1 0-2h4V7a1 1 0 1 1 2 0v4h4a1 1 0 0 1 1 1z"></path></svg>
                    </button>
                </div>

                <div className="grid grid-cols-[30px_1fr_auto] gap-4 text-gray-400 text-xs font-bold uppercase tracking-wider border-b border-white/5 pb-2 mb-4 px-3">
                    <span>#</span>
                    <span>Title</span>
                    <svg role="img" height="16" width="16" viewBox="0 0 16 16" className="fill-current"><path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"></path><path d="M8 3.25a.75.75 0 0 1 .75.75v3.25H11a.75.75 0 0 1 0 1.5H7.25V4A.75.75 0 0 1 8 3.25z"></path></svg>
                </div>

                <div className="space-y-0.5">
                    {album.songs.map((song, index) => (
                        <div key={song.id} onClick={() => onSongSelect(song)} className="group grid grid-cols-[30px_1fr_auto] items-center gap-4 p-2 rounded-md hover:bg-white/10 transition-colors cursor-pointer">
                            <div className="w-full flex justify-center">
                                <span className="group-hover:hidden text-gray-400 text-sm font-medium">{index + 1}</span>
                                <span className="hidden group-hover:block text-white">
                                    <svg role="img" height="14" width="14" viewBox="0 0 24 24" className="fill-current"><path d="M7.05 3.606l13.49 7.79a.7.7 0 010 1.212L7.05 20.398a.7.7 0 01-1.05-.606V4.212a.7.7 0 011.05-.606z"></path></svg>
                                </span>
                            </div>
                            <div className="flex flex-col min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-white font-bold text-[15px] truncate">{song.title}</span>
                                    {song.version === 'Explicit' && <span className="bg-[#3e3e3e] text-[#9ca3af] text-[8px] px-1 rounded-[1px] h-3.5 flex items-center justify-center font-black">E</span>}
                                </div>
                                <span className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors">{album.artistName}</span>
                            </div>
                            <span className="text-sm font-medium text-gray-400 tabular-nums">{formatTrackDuration(song.duration)}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-xs text-gray-500 space-y-1 px-2 font-medium">
                    <p>{new Date(album.releaseDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    <p className="mt-4">{album.copyright}</p>
                </div>
            </div>
        </div>
    );
};

export default RapifyAlbumDetailScreen;
