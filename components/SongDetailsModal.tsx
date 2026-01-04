import React from 'react';
import type { Song } from '../types';

interface SongDetailsModalProps {
  song: Song;
  onClose: () => void;
}

const SongDetailsModal: React.FC<SongDetailsModalProps> = ({ song, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-brand-dialog w-full max-w-lg rounded-xl p-6" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold">{song.title}</h2>
        <p className="text-brand-text-muted">{song.artistName}</p>
        <button onClick={onClose} className="mt-4 bg-brand-surface px-4 py-2 rounded-md">Close</button>
      </div>
    </div>
  );
};

export default SongDetailsModal;
