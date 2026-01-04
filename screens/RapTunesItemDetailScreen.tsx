
import React from 'react';
import type { Player, Song, Album } from '../types';

interface RapTunesItemDetailScreenProps {
  item: Album | Song;
  player: Player;
  onBack: () => void;
}

const RapTunesItemDetailScreen: React.FC<RapTunesItemDetailScreenProps> = ({ item, player, onBack }) => {
    const isSong = 'quality' in item;
    const isAlbum = 'songs' in item;
    
    const coverArt = item.coverArt;
    const artistName = item.artistName;
    const releaseDate = new Date(item.releaseDate);
    const releaseYear = releaseDate.getFullYear();
    const genre = 'genre' in item ? (item as Song).genre : 'Hip-Hop/Rap';

    const tracklist = isAlbum ? (item as Album).songs : [item as Song];

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-[#000000] text-white min-h-screen font-sans absolute inset-0 z-[40] overflow-y-auto">
             <header className="sticky top-0 z-50 bg-black/70 backdrop-blur-2xl border-b border-white/5 p-4 flex items-center justify-between">
                <button onClick={onBack} className="text-[#007AFF] flex items-center gap-1 font-black uppercase text-xs tracking-widest group">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 group-hover:-translate-x-1 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                    Store
                </button>
                <div className="flex gap-4 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 hover:text-white cursor-pointer transition-colors"><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0-10.628a2.25 2.25 0 102.246-3.817 2.25 2.25 0 00-2.246 3.817zm0 10.628a2.25 2.25 0 102.246 3.817 2.25 2.25 0 00-2.246-3.817z" /></svg>
                </div>
            </header>

            <main className="p-6 max-w-3xl mx-auto pb-32">
                <div className="flex flex-col md:flex-row gap-10 mb-12 mt-6">
                    <div className="w-full md:w-72 flex-shrink-0">
                        <img src={coverArt || ''} alt={item.title} className="w-full aspect-square object-cover rounded-[2rem] shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-white/10 mx-auto md:mx-0 group-hover:scale-[1.02] transition-transform duration-700" />
                    </div>
                    
                    <div className="flex-grow flex flex-col justify-center text-center md:text-left">
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-3 italic uppercase">{item.title}</h1>
                        <p className="text-2xl text-[#007AFF] font-black uppercase tracking-widest mb-6 hover:underline cursor-pointer">{artistName}</p>
                        
                        <div className="flex items-center justify-center md:justify-start gap-3 text-xs font-black uppercase tracking-[0.4em] text-gray-500 mb-10">
                            <span>{genre}</span>
                            <span className="text-gray-800">•</span>
                            <span>{releaseYear}</span>
                            {isAlbum && <span className="bg-[#1c1c1e] px-2 py-0.5 rounded text-[10px] text-white">Album</span>}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center">
                            <button className="w-full sm:w-auto bg-white text-black font-black py-4 px-12 rounded-2xl hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-[0.2em] shadow-2xl">
                                Buy ${item.price.toFixed(2)}
                            </button>
                            <button className="w-full sm:w-auto bg-[#1c1c1e] text-white font-black py-4 px-10 rounded-2xl hover:bg-[#2c2c2e] active:scale-95 transition-all text-sm uppercase tracking-[0.2em] border border-white/5">
                                Gift Item
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-10">
                    <div className="flex justify-between items-center mb-8 px-2">
                        <h3 className="font-black uppercase tracking-[0.4em] text-[11px] text-gray-500">Official Tracklist</h3>
                        {isAlbum && <p className="text-[11px] text-gray-500 font-black uppercase tracking-widest">{tracklist.length} Assets</p>}
                    </div>

                    <div className="space-y-1">
                        {tracklist.map((track, index) => (
                            <div key={track.id} className="flex items-center gap-6 py-4 border-b border-white/5 last:border-0 px-4 group hover:bg-white/5 transition-all rounded-[1.5rem] cursor-pointer">
                                <span className="w-6 text-center text-gray-600 font-black text-base group-hover:text-[#007AFF] transition-colors">{index + 1}</span>
                                <div className="flex-grow min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="font-black text-base truncate uppercase italic tracking-tight">{track.title}</p>
                                        {track.version === 'Explicit' && <span className="bg-[#1c1c1e] text-[#9ca3af] text-[8px] font-black px-1 rounded-sm border border-white/5">E</span>}
                                    </div>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1.5">{track.artistName}</p>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className="text-xs text-gray-500 font-mono hidden sm:block">{formatDuration(track.duration)}</span>
                                    <button className="text-gray-700 group-hover:text-[#007AFF] transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A.75.75 0 008.35 7.75v4.5a.75.75 0 001.205.582l3-2.25a.75.75 0 000-1.164l-3-2.25z" clipRule="evenodd" /></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-20 border-t border-white/5 pt-10 text-center">
                    <div className="max-w-md mx-auto space-y-2">
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.5em]">Metadata Release Info</p>
                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">Released: {releaseDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        <p className="text-[10px] text-gray-600 font-medium uppercase tracking-tighter italic">© {releaseYear} {artistName.toUpperCase()} / {player.label.toUpperCase()}. ALL RIGHTS RESERVED.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default RapTunesItemDetailScreen;
