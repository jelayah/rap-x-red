
import React, { useState } from 'react';
import type { Player } from '../types';

interface EditProfileModalProps {
    player: Player;
    onSave: (updatedPlayer: Player) => void;
    onClose: () => void;
}

const ImageBox: React.FC<{ label: string; sub: string; current: string | null; onUpdate: (b: string) => void }> = ({ label, sub, current, onUpdate }) => {
    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => onUpdate(reader.result as string);
            reader.readAsDataURL(file);
        }
    };
    return (
        <div className="space-y-4">
            <div>
                <p className="text-xs font-black uppercase text-white tracking-widest">{label}</p>
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">{sub}</p>
            </div>
            <div className="aspect-video bg-white/5 rounded-2xl border border-white/10 overflow-hidden relative group shadow-2xl">
                {current ? <img src={current} className="w-full h-full object-cover" /> : <div className="absolute inset-0 flex items-center justify-center text-gray-700 text-[10px] font-black uppercase">No Media</div>}
                <input type="file" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white bg-red-600 px-4 py-2 rounded-full shadow-xl">Update Asset</span>
                </div>
            </div>
        </div>
    );
};

const EditProfileModal: React.FC<EditProfileModalProps> = ({ player, onSave, onClose }) => {
    const [name, setName] = useState(player.artistName);
    const [bio, setBio] = useState(player.bio || '');
    const [header, setHeader] = useState(player.headerImage);
    const [about, setAbout] = useState(player.aboutImage);

    return (
        <div className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-4 backdrop-blur-2xl overflow-y-auto">
            <div className="bg-[#0a0a0c] w-full max-w-4xl rounded-[3rem] border border-white/10 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-fade-in-up">
                <header className="p-8 border-b border-white/5 flex justify-between items-center">
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Visual Identity</h2>
                    <button onClick={onClose} className="p-3 bg-white/5 rounded-full hover:bg-white/10 text-gray-500 hover:text-white transition-all"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6"><path d="M6 18L18 6M6 6l12 12" /></svg></button>
                </header>

                <div className="flex-1 overflow-y-auto p-8 sm:p-12 space-y-12 scrollbar-hide">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-3">Artist Designation</label>
                                <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white font-black italic text-2xl uppercase tracking-tighter outline-none focus:border-red-600 transition-all" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-3">Public Biography</label>
                                <textarea value={bio} onChange={e => setBio(e.target.value)} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white font-medium text-sm h-40 outline-none focus:border-red-600 transition-all resize-none" placeholder="Enter artist narrative..." />
                            </div>
                        </div>
                        <div className="space-y-8">
                             <ImageBox label="Header Asset" sub="Main Page Banner (Syncs to X / YouTube)" current={header} onUpdate={setHeader} />
                             <ImageBox label="Portrait Asset" sub="System PFP (Syncs to all Profile Circles)" current={about} onUpdate={setAbout} />
                        </div>
                    </div>
                </div>

                <footer className="p-8 bg-black border-t border-white/5 flex justify-end">
                    <button 
                        onClick={() => onSave({ ...player, artistName: name, bio, headerImage: header, aboutImage: about })}
                        className="bg-white text-black font-black py-4 px-12 rounded-full text-xs uppercase tracking-widest hover:scale-105 active:scale-95 shadow-2xl transition-all"
                    >
                        Save Protocol
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default EditProfileModal;
