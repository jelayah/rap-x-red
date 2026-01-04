import React from 'react';
import type { Album, Song } from '../types';

interface AlbumStreamSnapshotProps {
    album: Album;
    artistName: string;
    gameDate: Date;
    onClose: () => void;
}

const RapifyIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#1DB954]"><title>Spotify</title><path fill="currentColor" d="M12 2.02c-5.514 0-9.98 4.465-9.98 9.98s4.466 9.98 9.98 9.98 9.98-4.465 9.98-9.98S17.514 2.02 12 2.02zm4.885 13.15c-.232.36-.697.47-1.056.24-2.98-1.82-6.75-2.22-11.04-.97-.41.12-.82-.16-.94-.56-.12-.41.16-.82.56-.94C9.28 11.13 13.52 11.5 16.88 13.5c.36.22.47.68.24 1.05zM5.5 10.3c-.28.43.08.98.52 1.1l8.74 2.22c.4.1.84-.17.94-.58.1-.4-.17-.84-.58-.94l-8.74-2.22c-.44-.12-.98.08-1.1.52zm.1-2.68C5.32 8.04 5.76 7.5 6.2 7.38l7.8-2.02c.4-.1.82.15.92.56.1.4-.15.82-.56.92l-7.8 2.02c-.44.1-.96-.13-1.06-.58z"></path></svg>
);


const AlbumStreamSnapshot: React.FC<AlbumStreamSnapshotProps> = ({ album, artistName, gameDate, onClose }) => {
    
    const songData = album.songs.map(song => {
        const totalStreams = song.rapifyStreams + song.rappleStreams;
        return { ...song, totalStreams };
    }).sort((a,b) => b.totalStreams - a.totalStreams);

    const totalStreams = songData.reduce((sum, s) => sum + s.totalStreams, 0);
    const weeklyStreams = album.songs.reduce((sum, s) => sum + s.weeklyStreams, 0);

    return (
        <div className="fixed inset-0 bg-black/80 z-40 flex items-center justify-center p-4 font-sans" onClick={onClose}>
            <div 
                className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl animate-fade-in-up border border-white/10" 
                onClick={e => e.stopPropagation()}
                style={{
                    backgroundImage: `url(${album.coverArt})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="absolute inset-0 bg-black/70 backdrop-blur-xl"></div>

                <div className="relative p-6 text-white">
                    <header className="flex items-start gap-4 mb-4">
                        <img src={album.coverArt!} alt={album.title} className="w-28 h-28 rounded-lg shadow-lg flex-shrink-0" />
                        <div>
                            <div className="flex items-center gap-2">
                                <RapifyIcon />
                                <span className="font-black text-white text-2xl tracking-tight">Snapshot</span>
                            </div>
                            <h1 className="text-4xl font-black tracking-tighter mt-1">{album.title}</h1>
                            <p className="text-lg text-white/80">{artistName}</p>
                        </div>
                    </header>

                     <div className="bg-white/10 p-4 rounded-xl mb-4">
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                                <p className="text-sm uppercase text-white/60 font-semibold">Total Streams</p>
                                <p className="text-4xl font-bold">{totalStreams.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm uppercase text-white/60 font-semibold">This Week</p>
                                <p className="text-4xl font-bold text-green-400">+{weeklyStreams.toLocaleString()}</p>
                            </div>
                        </div>
                     </div>
                    
                    <div>
                        <h2 className="font-bold mb-2 text-white/80">Track Performance</h2>
                        <div className="bg-white/10 rounded-xl max-h-56 overflow-y-auto">
                            <div className="sticky top-0 grid grid-cols-[1fr,auto] bg-black/50 text-xs uppercase text-white/60 p-2 font-semibold">
                                <span>Song</span>
                                <span className="text-right">Streams</span>
                            </div>
                            <div className="p-2 space-y-1">
                                {songData.map((song) => (
                                    <div key={song.id} className="grid grid-cols-[1fr,auto] items-center text-sm">
                                        <p className="font-semibold truncate">{song.title}</p>
                                        <p className="font-mono text-right">{song.totalStreams.toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <footer className="text-center mt-4 text-xs text-white/50">
                        Snapshot from {gameDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default AlbumStreamSnapshot;
