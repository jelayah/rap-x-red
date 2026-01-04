import React from 'react';
import type { Song } from '../types';

interface SongStreamSnapshotProps {
    song: Song;
    artistName: string;
    gameDate: Date;
    onClose: () => void;
}

const RapifyIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#1DB954]"><title>Spotify</title><path fill="currentColor" d="M12 2.02c-5.514 0-9.98 4.465-9.98 9.98s4.466 9.98 9.98 9.98 9.98-4.465 9.98-9.98S17.514 2.02 12 2.02zm4.885 13.15c-.232.36-.697.47-1.056.24-2.98-1.82-6.75-2.22-11.04-.97-.41.12-.82-.16-.94-.56-.12-.41.16-.82.56-.94C9.28 11.13 13.52 11.5 16.88 13.5c.36.22.47.68.24 1.05zM5.5 10.3c-.28.43.08.98.52 1.1l8.74 2.22c.4.1.84-.17.94-.58.1-.4-.17-.84-.58-.94l-8.74-2.22c-.44-.12-.98.08-1.1.52zm.1-2.68C5.32 8.04 5.76 7.5 6.2 7.38l7.8-2.02c.4-.1.82.15.92.56.1.4-.15.82-.56.92l-7.8 2.02c-.44.1-.96-.13-1.06-.58z"></path></svg>
);

const StatCard: React.FC<{ label: string; value: string; }> = ({ label, value }) => (
    <div className="bg-white/10 p-3 rounded-lg text-center backdrop-blur-sm">
        <p className="text-xs uppercase text-white/70 font-semibold">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
    </div>
);


const SongStreamSnapshot: React.FC<SongStreamSnapshotProps> = ({ song, artistName, gameDate, onClose }) => {
    const totalStreams = song.rapifyStreams + song.rappleStreams;
    
    // Dummy data for visual appeal
    const streamSources = [
        { source: 'Your Playlists', percentage: 45 },
        { source: 'Algorithmic', percentage: 30 },
        { source: 'User Libraries', percentage: 15 },
        { source: 'Other', percentage: 10 },
    ].sort((a,b) => b.percentage - a.percentage);

    return (
        <div className="fixed inset-0 bg-black/80 z-40 flex items-center justify-center p-4 font-sans" onClick={onClose}>
             <div 
                className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl animate-fade-in-up border border-white/10" 
                onClick={e => e.stopPropagation()}
                style={{
                    backgroundImage: `url(${song.coverArt})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="absolute inset-0 bg-black/70 backdrop-blur-xl"></div>

                <div className="relative p-6 text-white">
                    <header className="flex items-start gap-4 mb-4">
                        <img src={song.coverArt!} alt={song.title} className="w-24 h-24 rounded-lg shadow-lg flex-shrink-0" />
                        <div>
                            <div className="flex items-center gap-2">
                                <RapifyIcon />
                                <span className="font-black text-white text-2xl tracking-tight">Snapshot</span>
                            </div>
                            <h1 className="text-4xl font-black tracking-tighter mt-1">{song.title}</h1>
                            <p className="text-lg text-white/80">{artistName}</p>
                        </div>
                    </header>

                     <div className="grid grid-cols-2 gap-3 mb-4">
                        <StatCard label="Total Streams" value={totalStreams.toLocaleString()} />
                        <StatCard label="This Week" value={`+${song.weeklyStreams.toLocaleString()}`} />
                    </div>
                    
                    <div>
                        <h2 className="font-bold mb-2 text-white/80">Source of Streams</h2>
                        <div className="space-y-2">
                            {streamSources.map(source => (
                                <div key={source.source}>
                                    <div className="flex justify-between text-sm mb-0.5">
                                        <span className="font-semibold">{source.source}</span>
                                        <span className="text-white/70">{source.percentage}%</span>
                                    </div>
                                    <div className="w-full bg-white/10 rounded-full h-2">
                                        <div className="bg-[#1DB954] h-2 rounded-full" style={{ width: `${source.percentage}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <footer className="text-center mt-6 text-xs text-white/50">
                        Snapshot from {gameDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default SongStreamSnapshot;
