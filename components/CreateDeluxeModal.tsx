import React, { useState } from 'react';
import type { Album, Song } from '../types';

interface CreateDeluxeModalProps {
    album: Album;
    availableSongs: Song[];
    onClose: () => void;
    onCreate: (originalAlbum: Album, newSongs: Song[], newCoverArt: string | null, deluxeTitle: string) => void;
}

const CreateDeluxeModal: React.FC<CreateDeluxeModalProps> = ({ album, availableSongs, onClose, onCreate }) => {
    const [selectedSongIds, setSelectedSongIds] = useState<Set<string>>(new Set());
    const [coverArt, setCoverArt] = useState<string | null>(null);
    const [coverArtPreview, setCoverArtPreview] = useState<string | null>(null);
    const [deluxeTitle, setDeluxeTitle] = useState(`${album.title} (Deluxe)`);
    const [titleMode, setTitleMode] = useState<'preset' | 'custom'>('preset');

    const presets = [
        `${album.title} (Deluxe)`,
        `${album.title} (Bonus Track Version)`,
        `${album.title} (Sped Up Version)`,
        `${album.title} (Slowed + Reverb Version)`,
    ];

    const toggleSong = (songId: string) => {
        setSelectedSongIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(songId)) newSet.delete(songId);
            else newSet.add(songId);
            return newSet;
        });
    };
    
    const handleCoverArtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setCoverArt(base64String);
                setCoverArtPreview(URL.createObjectURL(file));
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSubmit = () => {
        const isSpecialVersion = deluxeTitle.toLowerCase().includes('sped up') || deluxeTitle.toLowerCase().includes('slowed');
        if (selectedSongIds.size === 0 && !isSpecialVersion) {
            alert('You must add at least one new song to create a standard deluxe version.');
            return;
        }
        if (!coverArt) {
            alert('A new cover art is required for the deluxe edition.');
            return;
        }
        const newSongs = availableSongs.filter(s => selectedSongIds.has(s.id));
        onCreate(album, newSongs, coverArt, deluxeTitle);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-brand-dialog w-full max-w-3xl rounded-xl p-6 shadow-2xl border border-brand-surface max-h-[90vh] flex flex-col">
                <h2 className="text-2xl font-bold mb-2">Create Deluxe Edition</h2>
                <p className="text-brand-text-muted mb-4">Adding to: {album.title}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow overflow-y-auto pr-2">
                    {/* Left Column: Config */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold mb-2">Deluxe Title</h3>
                             <div className="flex gap-2 mb-2">
                                <button onClick={() => setTitleMode('preset')} className={`flex-1 py-2 text-sm rounded-md ${titleMode === 'preset' ? 'bg-brand-primary-end' : 'bg-brand-surface'}`}>Presets</button>
                                <button onClick={() => setTitleMode('custom')} className={`flex-1 py-2 text-sm rounded-md ${titleMode === 'custom' ? 'bg-brand-primary-end' : 'bg-brand-surface'}`}>Custom</button>
                             </div>
                             {titleMode === 'preset' ? (
                                <select value={deluxeTitle} onChange={e => setDeluxeTitle(e.target.value)} className="w-full bg-brand-surface p-2 rounded-md">
                                    {presets.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                             ) : (
                                <input type="text" value={deluxeTitle} onChange={e => setDeluxeTitle(e.target.value)} className="w-full bg-brand-surface p-2 rounded-md"/>
                             )}
                        </div>
                         <div>
                            <h3 className="font-semibold mb-2">New Cover Art</h3>
                            <div className="aspect-square bg-brand-surface rounded-md flex items-center justify-center overflow-hidden mb-2">
                                 {coverArtPreview ? <img src={coverArtPreview} alt="Cover art preview" className="w-full h-full object-cover" /> : <span className="text-sm text-brand-text-muted">Upload New Art</span>}
                            </div>
                            <input type="file" accept="image/png, image/jpeg" onChange={handleCoverArtChange} className="block w-full text-sm text-brand-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-primary-start file:text-white hover:file:bg-brand-primary-end" required />
                        </div>
                    </div>
                     {/* Right Column: Songs */}
                    <div>
                        <h3 className="font-semibold mb-2">Add Bonus Tracks</h3>
                        <div className="space-y-2 max-h-96 overflow-y-auto bg-brand-surface p-2 rounded-md">
                            {availableSongs.length > 0 ? availableSongs.map(song => (
                                <div key={song.id} onClick={() => toggleSong(song.id)} className={`p-2 rounded-md cursor-pointer ${selectedSongIds.has(song.id) ? 'bg-brand-primary-end/50' : 'bg-brand-dialog hover:bg-opacity-70'}`}>
                                    <p className="font-semibold">{song.title} {song.isReleased && <span className="text-xs text-brand-accent-start">(Released)</span>}</p>
                                    <p className="text-xs text-brand-text-muted">Quality: {song.quality}</p>
                                </div>
                            )) : <p className="text-sm text-brand-text-muted text-center p-4">No unreleased or standalone songs available.</p>}
                        </div>
                        <p className="text-xs text-brand-text-muted mt-2">Note: Special versions (Sped Up, etc.) do not require adding bonus tracks.</p>
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-brand-surface">
                    <button onClick={onClose} className="bg-brand-surface text-white py-2 px-6 rounded-md hover:opacity-80">Cancel</button>
                    <button onClick={handleSubmit} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-2 px-6 rounded-md hover:opacity-90">Release Deluxe</button>
                </div>
            </div>
        </div>
    );
};

export default CreateDeluxeModal;