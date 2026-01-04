import React from 'react';
import type { GameEvent } from '../types';

interface EventModalProps {
    event: GameEvent;
    onResponse: (event: GameEvent, accepted: boolean) => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, onResponse }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-brand-dialog w-full max-w-md rounded-xl p-6 shadow-2xl border border-brand-accent-start/30 animate-fade-in-up">
                <h2 className="text-2xl font-bold text-brand-accent-start mb-2">{event.offer.title}</h2>
                <p className="text-lg font-semibold text-brand-text-muted mb-4">From: {event.artist.name}</p>

                {event.songDetails && (
                    <div className="mb-4 text-sm bg-brand-surface p-3 rounded-lg">
                        <p><span className="font-bold text-brand-text-muted">Track:</span> {event.songDetails.title}</p>
                        <p><span className="font-bold text-brand-text-muted">Genre:</span> {event.songDetails.genre}</p>
                    </div>
                )}
                
                <p className="mb-4">{event.offer.description}</p>
                
                <div className="bg-brand-surface p-4 rounded-lg space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-brand-text-muted">Payout:</span>
                        <span className="font-bold text-green-400 text-lg">${event.offer.payout.toLocaleString()}</span>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="font-semibold text-brand-text-muted">Reputation:</span>
                        <span className="font-bold text-blue-400">+{event.offer.reputationGain}</span>
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                    <button 
                        onClick={() => onResponse(event, false)} 
                        className="bg-brand-surface text-white py-2 px-6 rounded-md hover:opacity-80"
                    >
                        Decline
                    </button>
                    <button 
                        onClick={() => onResponse(event, true)} 
                        className="bg-gradient-to-r from-brand-accent-start to-brand-accent-end text-white font-bold py-2 px-6 rounded-md hover:opacity-90"
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventModal;