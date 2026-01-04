
import React, { useState, useMemo } from 'react';
import type { Song, Album, Player, NPCArtist } from '../types';
import { getDisplayGenre } from '../constants';

interface RapifyChartsScreenProps {
    allSongs: Song[];
    allAlbums: Album[];
    player: Player;
}

const formatNumber = (num: number) => {
    return num.toLocaleString();
};

const getArtistDisplayName = (song: Song) => {
    const acceptedFeatures = song.features?.filter(f => f.status === 'accepted').map(f => f.artist.name);
    return acceptedFeatures && acceptedFeatures.length > 0 
        ? `${song.artistName}, ${acceptedFeatures.join(', ')}` 
        : song.artistName;
};

const RapifyChartsScreen: React.FC<RapifyChartsScreenProps> = ({ allSongs, allAlbums, player }) => {
    const [chartType, setChartType] = useState<'singles' | 'albums'>('singles');

    const topSongs = useMemo(() => {
        return [...allSongs]
            .filter(s => s.isReleased)
            .map(s => ({
                ...s,
                weeklyRapifyStreams: Math.floor(s.weeklyStreams * 0.6)
            }))
            .sort((a, b) => b.weeklyRapifyStreams - a.weeklyRapifyStreams)
            .slice(0, 50);
    }, [allSongs]);

    const topAlbums = useMemo(() => {
        return allAlbums
            .filter(a => !a.scheduledReleaseDate)
            .map(album => {
                const weeklyRapify = album.songs.reduce((acc, songInAlbum) => {
                    const fullSong = allSongs.find(s => s.id === songInAlbum.id);
                    return acc + (fullSong ? Math.floor(fullSong.weeklyStreams * 0.6) : 0);
                }, 0);
                return { ...album, weeklyRapify };
            })
            .sort((a, b) => b.weeklyRapify - a.weeklyRapify)
            .slice(0, 50);
    }, [allAlbums, allSongs]);

    return (
        <div className="h-full bg-[#121212] overflow-y-auto pb-32 font-sans text-white">
            {/* Spotify-style Header */}
            <header className="px-5 pt-16 pb-8 bg-gradient-to-b from-[#1DB954]/20 to-[#121212]">
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-end">
                    <div className="w-48 h-48 sm:w-60 sm:h-60 bg-[#282828] shadow-2xl flex-shrink-0 relative rounded-md overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-700 flex items-center justify-center p-6 text-center">
                             <h2 className="text-white font-black text-4xl leading-none tracking-tighter uppercase italic">
                                {chartType === 'singles' ? 'Global Top 50' : 'Top Albums Global'}
                             </h2>
                        </div>
                    </div>
                    <div className="flex-grow text-center md:text-left">
                        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-2">Playlist</p>
                        <h1 className="text-4xl sm:text-7xl font-black tracking-tight mb-4">
                            {chartType === 'singles' ? 'Global Top 50' : 'Top Albums Global'}
                        </h1>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-sm font-semibold">
                            <span className="text-white">Rapify</span>
                            <span className="text-gray-400 text-xs">•</span>
                            <span className="text-gray-300">Updated weekly</span>
                            <span className="text-gray-400 text-xs">•</span>
                            <span className="text-gray-400 font-medium">50 items</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="px-5 mb-6 sticky top-0 bg-[#121212] z-20 py-4 flex gap-4 border-b border-white/5">
                <button 
                    onClick={() => setChartType('singles')}
                    className={`text-sm font-bold transition-all px-4 py-2 rounded-full ${chartType === 'singles' ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                    Songs
                </button>
                <button 
                    onClick={() => setChartType('albums')}
                    className={`text-sm font-bold transition-all px-4 py-2 rounded-full ${chartType === 'albums' ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                    Albums
                </button>
            </div>

            <div className="px-5">
                <div className="grid grid-cols-[30px_1fr_auto] gap-4 text-gray-400 text-xs font-bold uppercase tracking-wider px-3 mb-4 border-b border-white/5 pb-2">
                    <span>#</span>
                    <span>Title</span>
                    <span>Plays</span>
                </div>
                
                <div className="space-y-0.5">
                    {chartType === 'singles' ? (
                        topSongs.map((song, i) => (
                            <div key={song.id} className="group grid grid-cols-[30px_1fr_auto] items-center gap-4 py-2 px-3 hover:bg-white/10 rounded-md transition-colors cursor-pointer">
                                <span className={`text-center font-semibold text-sm ${i < 3 ? 'text-[#1DB954]' : 'text-gray-400'}`}>{i + 1}</span>
                                <div className="flex items-center gap-3 min-w-0">
                                    <img src={song.coverArt || 'https://thumbs2.imgbox.com/53/9d/TPyXhrMO_t.jpg'} className="w-10 h-10 object-cover rounded shadow-md" alt={song.title} />
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className={`font-bold truncate text-[15px] ${song.artistName === player.artistName ? 'text-[#1DB954]' : 'text-white'}`}>{song.title}</p>
                                            {song.version === 'Explicit' && <span className="bg-[#3e3e3e] text-[#9ca3af] text-[8px] px-1 rounded-[2px] h-3.5 flex items-center justify-center font-black">E</span>}
                                        </div>
                                        <p className="text-xs text-gray-400 truncate mt-0.5 font-medium">{getArtistDisplayName(song)} • {getDisplayGenre(song.genre)}</p>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400 font-medium tabular-nums">{formatNumber(song.weeklyRapifyStreams)}</span>
                            </div>
                        ))
                    ) : (
                        topAlbums.map((album, i) => (
                            <div key={album.id} className="group grid grid-cols-[30px_1fr_auto] items-center gap-4 py-2 px-3 hover:bg-white/10 rounded-md transition-colors cursor-pointer">
                                <span className={`text-center font-semibold text-sm ${i < 3 ? 'text-[#1DB954]' : 'text-gray-400'}`}>{i + 1}</span>
                                <div className="flex items-center gap-3 min-w-0">
                                    <img src={album.coverArt || 'https://thumbs2.imgbox.com/53/9d/TPyXhrMO_t.jpg'} className="w-10 h-10 object-cover rounded shadow-md" alt={album.title} />
                                    <div className="min-w-0">
                                        <p className={`font-bold truncate text-[15px] ${album.artistName === player.artistName ? 'text-[#1DB954]' : 'text-white'}`}>{album.title}</p>
                                        <p className="text-xs text-gray-400 truncate mt-0.5 font-medium">{album.artistName}</p>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400 font-medium tabular-nums">{formatNumber(album.weeklyRapify)}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
            
            <div className="p-8 pb-32 text-center opacity-30">
                <p className="text-[10px] font-bold uppercase tracking-widest">Algorithm generated charts based on Rapify usage.</p>
            </div>
        </div>
    );
};

export default RapifyChartsScreen;
