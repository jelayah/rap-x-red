import React, { useState } from 'react';
import type { Player } from '../types';

interface EditProfileModalProps {
    player: Player;
    onSave: (updatedPlayer: Player) => void;
    onClose: () => void;
}

const ImageInput: React.FC<{ label: string; currentImage: string | null; onImageChange: (base64: string | null) => void; unsplashQuery: string; }> = ({ label, currentImage, onImageChange, unsplashQuery }) => {
    const [preview, setPreview] = useState<string | null>(currentImage);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                onImageChange(base64String);
                setPreview(URL.createObjectURL(file));
            };
            reader.readAsDataURL(file);
        }
    };

    const displayImage = preview || `https://source.unsplash.com/800x450/?${encodeURIComponent(unsplashQuery)}`;

    return (
        <div>
            <label className="block text-brand-text-muted mb-2 font-semibold">{label}</label>
            <div className="aspect-video bg-brand-surface rounded-md flex items-center justify-center overflow-hidden mb-2">
                <img src={displayImage} alt={`${label} preview`} className="w-full h-full object-cover" />
            </div>
            <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
                className="block w-full text-sm text-brand-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-primary-start file:text-white hover:file:bg-brand-primary-end"
            />
        </div>
    );
};


const EditProfileModal: React.FC<EditProfileModalProps> = ({ player, onSave, onClose }) => {
    const [artistName, setArtistName] = useState(player.artistName);
    const [bio, setBio] = useState(player.bio);
    const [headerImage, setHeaderImage] = useState<string | null>(player.headerImage);
    const [aboutImage, setAboutImage] = useState<string | null>(player.aboutImage);


    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (artistName.trim() === '') {
            alert('Artist Name cannot be empty.');
            return;
        }
        onSave({
            ...player,
            artistName,
            bio,
            headerImage,
            aboutImage,
        });
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-brand-dialog w-full max-w-2xl rounded-xl p-6 shadow-2xl border border-brand-surface animate-fade-in-up max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSave}>
                    <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="artistName" className="block text-brand-text-muted mb-1">Artist Name</label>
                                <input 
                                    type="text" 
                                    id="artistName" 
                                    value={artistName} 
                                    onChange={(e) => setArtistName(e.target.value)} 
                                    className="w-full bg-brand-surface p-3 rounded-md border border-brand-surface focus:outline-none focus:ring-2 focus:ring-brand-primary-end"
                                    required 
                                />
                            </div>

                            <div>
                                <label htmlFor="bio" className="block text-brand-text-muted mb-1">Bio</label>
                                <textarea 
                                    id="bio" 
                                    value={bio} 
                                    onChange={(e) => setBio(e.target.value)} 
                                    className="w-full bg-brand-surface p-3 rounded-md border border-brand-surface focus:outline-none focus:ring-2 focus:ring-brand-primary-end h-32 resize-none"
                                    placeholder="Tell the world about yourself..."
                                    maxLength={300}
                                />
                                 <p className="text-right text-xs text-brand-text-muted mt-1">{bio.length} / 300</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <ImageInput label="Header Image" currentImage={player.headerImage} onImageChange={setHeaderImage} unsplashQuery={`${player.artistName}, music artist`} />
                            <ImageInput label="About Image" currentImage={player.aboutImage} onImageChange={setAboutImage} unsplashQuery={`${player.artistName}, portrait`} />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-8">
                        <button type="button" onClick={onClose} className="bg-brand-surface text-white py-2 px-6 rounded-md hover:opacity-80">Cancel</button>
                        <button type="submit" className="bg-gradient-to-r from-brand-primary-start to-brand-primary-end text-white font-bold py-2 px-6 rounded-md hover:opacity-90">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;
