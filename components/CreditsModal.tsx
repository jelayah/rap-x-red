import React from 'react';
import type { Song, Player } from '../types';

interface CreditsModalProps {
    song: Song;
    player: Player;
    onClose: () => void;
}

const CreditsModal: React.FC<CreditsModalProps> = ({ song, player, onClose }) => {
    const allPerformers = [player.artistName, ...song.features.map(f => f.artist.name), ...song.producers];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50" onClick={onClose}>
            <div 
                className="bg-[#282828] text-white w-full max-w-lg rounded-xl p-6 shadow-2xl border border-gray-700 animate-fade-in-up"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                    <h2 className="text-3xl font-bold">Credits</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <h3 className="text-xl font-semibold mb-4">{song.title}</h3>

                <div className="space-y-4">
                    <div>
                        <p className="font-bold text-gray-400">Performed by</p>
                        <p>{allPerformers.join(', ')}</p>
                    </div>
                    <div>
                        <p className="font-bold text-gray-400">Written by</p>
                        <p>{song.writers.join(', ')}</p>
                    </div>
                    <div>
                        <p className="font-bold text-gray-400">Produced by</p>
                        <p>{song.producers.join(', ')}</p>
                    </div>
                    <div>
                        <p className="font-bold text-gray-400">Source</p>
                        <p>{player.label}</p>
                    </div>
                     <div>
                        <p className="font-bold text-gray-400">Recorded At</p>
                        <p>{song.studio}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreditsModal;
