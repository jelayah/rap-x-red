
import React, { useState, useMemo } from 'react';
import type { Song, Album } from '../types';
import { getDisplayGenre } from '../constants';

interface RappleChartsScreenProps {
    allSongs: Song[];
    allAlbums: Album[];
    onSelectItem: (item: Song | Album) => void;
}

const getArtistDisplayName = (song: Song) => {
    const acceptedFeatures = song.features?.filter(f => f.status === 'accepted').map(f => f.artist.name);
    return acceptedFeatures && acceptedFeatures.length > 0 
        ? `${song.artistName} (feat. ${acceptedFeatures.join(', ')})` 
        : song.artistName;
};

const RappleChartsScreen: React.FC<RappleChartsScreenProps> = ({ allSongs, allAlbums, onSelectItem }) => {
    const [chartType, setChartType] = useState<'albums' | 'songs'>('songs');

    const topSongs = useMemo(() => {
        return [...allSongs]
            .filter(s => s.isReleased)
            // Sort strictly by Rapple platform streams (40% of total)
            .sort((a, b) => (b.weeklyStreams * 0.4) - (a.weeklyStreams * 0.4))
            .slice(0, 100);
    }, [allSongs]);

    const topAlbums = useMemo(() => {
        return [...allAlbums]
            .filter(a => !a.scheduledReleaseDate)
            .map(album => {
                const rapplePerformance = album.songs.reduce((acc, s) => {
                    const fullSong = allSongs.find(fs => fs.id === s.id);
                    return acc + (fullSong ? fullSong.weeklyStreams * 0.4 : 0);
                }, 0);
                return { ...album, rapplePerformance };
            })
            .sort((a, b) => b.rapplePerformance - a.rapplePerformance)
            .slice(0, 100);
    }, [allAlbums, allSongs]);
    
    return (
        <div className="h-full bg-black text-white overflow-y-auto pb-32 font-sans">
            <header className="px-5 pt-12 pb-6 border-b border-white/5">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight italic">Browse</h1>
                        <p className="text-sm font-semibold text-[#fa2d48] uppercase tracking-wider mt-1">Top 100: Global</p>
                    </div>
                </div>
            </header>

            <div className="px-5 py-4 sticky top-0 bg-black/80 backdrop-blur-xl z-20 border-b border-white/5">
                <div className="flex bg-[#1c1c1e] rounded-lg p-0.5 max-w-sm mx-auto">
                    <button 
                        onClick={() => setChartType('songs')} 
                        className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${chartType === 'songs' ? 'bg-[#3a3a3c] text-white shadow-sm' : 'text-gray-400'}`}
                    >
                        Top Songs
                    </button>
                    <button 
                        onClick={() => setChartType('albums')} 
                        className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${chartType === 'albums' ? 'bg-[#3a3a3c] text-white shadow-sm' : 'text-gray-400'}`}
                    >
                        Top Albums
                    </button>
                </div>
            </div>

            <div className="px-5 mt-4">
                <div className="space-y-1">
                    {chartType === 'songs' ? (
                        topSongs.map((song, index) => (
                            <div 
                                key={song.id} 
                                className="group flex items-center gap-4 py-3 border-b border-white/5 last:border-0 cursor-pointer active:opacity-60 transition-opacity" 
                                onClick={() => onSelectItem(song)}
                            >
                                <span className={`w-8 text-center font-bold text-lg ${index < 3 ? 'text-white' : 'text-gray-500'}`}>
                                    {index + 1}
                                </span>
                                <img src={song.coverArt || 'https://thumbs2.imgbox.com/53/9d/TPyXhrMO_t.jpg'} className="w-12 h-12 rounded-lg object-cover shadow-lg flex-shrink-0" alt={song.title} />
                                <div className="flex-grow min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-base truncate">{song.title}</p>
                                        {song.version === 'Explicit' && <span className="bg-[#3a3a3c] text-[#9ca3af] text-[9px] px-1 rounded-[3px] h-3.5 flex items-center justify-center font-black">E</span>}
                                    </div>
                                    <p className="text-sm text-gray-400 truncate mt-0.5">{getArtistDisplayName(song)} • {getDisplayGenre(song.genre)}</p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-700">
                                        <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        ))
                    ) : (
                        topAlbums.map((album, index) => (
                            <div 
                                key={album.id} 
                                className="group flex items-center gap-4 py-3 border-b border-white/5 last:border-0 cursor-pointer active:opacity-60 transition-opacity" 
                                onClick={() => onSelectItem(album)}
                            >
                                <span className={`w-8 text-center font-bold text-lg ${index < 3 ? 'text-white' : 'text-gray-500'}`}>
                                    {index + 1}
                                </span>
                                <img src={album.coverArt || 'https://thumbs2.imgbox.com/53/9d/TPyXhrMO_t.jpg'} className="w-14 h-14 rounded-lg object-cover shadow-lg flex-shrink-0" alt={album.title} />
                                <div className="flex-grow min-w-0">
                                    <p className="font-bold text-base truncate">{album.title}</p>
                                    <p className="text-sm text-gray-400 truncate mt-0.5">{album.artistName}</p>
                                </div>
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest bg-white/5 px-2 py-1 rounded">Album</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
            
            <div className="p-12 text-center opacity-20">
                <p className="text-[8px] font-black uppercase tracking-[0.5em]">Rapple Music High-Fidelity Data Stream</p>
            </div>
        </div>
    );
};

export default RappleChartsScreen;
