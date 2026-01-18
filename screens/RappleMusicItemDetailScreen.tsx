import React, { useMemo } from 'react';
import type { Player, Song, Album } from '../types';
import { getDisplayGenre } from '../constants';

interface RappleMusicItemDetailScreenProps {
    item: Album | Song;
    player: Player;
    allAlbums: Album[];
    allSongs: Song[];
    onBack: () => void;
}

const RappleMusicItemDetailScreen: React.FC<RappleMusicItemDetailScreenProps> = ({ item, player, allAlbums, allSongs, onBack }) => {
    const isAlbum = (item: Album | Song): item is Album => 'songs' in item;
    const album = isAlbum(item) ? item : null;
    const song = isAlbum(item) ? null : item;

    const coverArt = item.coverArt || `https://source.unsplash.com/600x600/?${encodeURIComponent(item.title + ' cover')}`;
    const itemTitle = item.title;
    const releaseDate = item.releaseDate;
    const tracklist = album ? album.songs : [song!];
    const totalDuration = tracklist.reduce((acc, s) => acc + s.duration, 0);
    
    // Pitchfork Snippet Logic: First 10 words
    // Fix: Added useMemo from React import to resolve "Cannot find name 'useMemo'"
    const reviewSnippet = useMemo(() => {
        if (!item.pitchforkReview) return null;
        const words = item.pitchforkReview.summary.split(' ');
        if (words.length <= 10) return item.pitchforkReview.summary;
        return words.slice(0, 10).join(' ') + '...';
    }, [item.pitchforkReview]);

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        return `${minutes} minutes`;
    };

    return (
        <div className="bg-black text-white min-h-screen font-sans absolute inset-0 z-[80] overflow-y-auto pb-32">
            <header className="sticky top-0 z-30 flex items-center h-16 px-4 bg-black/60 backdrop-blur-xl border-b border-white/5">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-[#fa2d48]"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                </button>
            </header>

            <main className="p-6 pt-4 space-y-8 max-w-4xl mx-auto">
                <header className="flex flex-col md:flex-row items-center text-center md:text-left gap-8">
                    <img src={coverArt} alt={itemTitle} className="w-56 h-56 md:w-64 md:h-64 object-cover rounded-xl shadow-2xl flex-shrink-0" />
                    <div className="flex flex-col justify-center">
                        <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-1 leading-none">{itemTitle}</h1>
                        <p className="text-xl text-[#fa2d48] font-bold uppercase tracking-widest">{player.artistName}</p>
                        <p className="text-sm text-gray-500 mt-2 font-black uppercase tracking-widest">
                            {song ? getDisplayGenre(song.genre) : 'Hip-Hop/Rap'} &bull; {new Date(releaseDate).getFullYear()} &bull;  High Fidelity
                        </p>

                        {item.pitchforkReview && (
                            <div className="mt-6 bg-white/5 border border-white/10 p-5 rounded-2xl">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">Critical Consensus</span>
                                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-[10px] font-black italic">{item.pitchforkReview.score.toFixed(1)}</div>
                                </div>
                                <p className="text-sm italic text-gray-300 font-medium">"{reviewSnippet}"</p>
                            </div>
                        )}

                        <div className="flex items-center justify-center md:justify-start gap-4 mt-8">
                            <button className="flex-1 md:flex-none bg-white text-black font-black py-3 px-10 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 active:scale-95 transition-all text-sm uppercase tracking-widest">Play</button>
                             <button className="flex-1 md:flex-none bg-white/10 text-white font-black py-3 px-10 rounded-xl hover:bg-white/20 active:scale-95 transition-all text-sm uppercase tracking-widest">Shuffle</button>
                        </div>
                    </div>
                </header>
                
                <div className="border-t border-white/5 pt-10">
                    {tracklist.map((track, index) => (
                         <div key={track.id} className="grid grid-cols-[30px,1fr,auto] items-center gap-4 py-4 border-b border-white/5 last:border-b-0 group">
                            <span className="text-gray-500 font-bold text-center">{index + 1}</span>
                            <div className="flex items-center gap-3 min-w-0">
                                <p className="font-bold text-base truncate">{track.title}</p>
                                {track.version === 'Explicit' && <span className="text-[10px] bg-[#3a3a3c] text-[#9ca3af] px-1 rounded-sm font-black">E</span>}
                            </div>
                            <button className="text-[#fa2d48] p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" /></svg>
                            </button>
                        </div>
                    ))}
                </div>

                <div className="text-[10px] text-gray-600 font-black uppercase tracking-widest space-y-2 pt-10 text-center md:text-left">
                    <p>{new Date(releaseDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    <p>{tracklist.length} TRACKS &bull; {formatDuration(totalDuration)}</p>
                    <p className="opacity-40">© {new Date(releaseDate).getFullYear()} {player.artistName.toUpperCase()} • {player.label.toUpperCase()}</p>
                </div>
            </main>
        </div>
    );
};

export default RappleMusicItemDetailScreen;