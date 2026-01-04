
import React, { useState, useRef, useEffect } from 'react';
import type { Player } from '../types';
import { Difficulty, Gender, Experience } from '../types';
import { LABELS } from '../constants';

interface CharacterCreationProps {
    onStartGame: (playerData: Omit<Player, 'energy' | 'money' | 'skills' | 'reputation' | 'monthlyListeners' | 'globalRank' | 'bio' | 'headerImage' | 'aboutImage' | 'records'>, startYear: number) => Promise<void>;
}

const TrajectoryIcon = ({ type }: { type: Experience }) => {
    const common = "w-6 h-6 mb-2";
    switch (type) {
        case Experience.Underground:
            return <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>;
        case Experience.New:
            return <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 00-2.433 2.47.822.822 0 01-.938.425A7.455 7.455 0 015.25 6.105a8.25 8.25 0 00-2.26 2.47a1.125 1.125 0 01-1.004 1.004l-2.47-.26a8.25 8.25 0 015.214-5.556z" /></svg>;
        case Experience.Experienced:
            return <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" /></svg>;
        case Experience.AList:
            return <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>;
    }
};

const WarningModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-[200]">
        <div className="bg-[#121212] w-full max-w-md rounded-3xl p-8 shadow-2xl border border-red-600/30 animate-fade-in-up">
            <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center mb-6 border border-red-600/20 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-red-600"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
            </div>
            <h2 className="text-3xl font-black italic tracking-tighter text-white mb-4 text-center">IDENTITY ALERT</h2>
            <p className="text-gray-400 text-sm leading-relaxed text-center mb-8">
                Using the name of a real-life artist may merge your data with their existing world profiles. For maximum immersion in the <span className="text-red-500 font-bold">RAP X RED</span> industry, a unique persona is highly recommended.
            </p>
            <button onClick={onClose} className="w-full bg-red-600 text-white font-black py-4 rounded-full text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-900/20">
                Acknowledge Protocol
            </button>
        </div>
    </div>
);

const CharacterCreation: React.FC<CharacterCreationProps> = ({ onStartGame }) => {
    const [step, setStep] = useState(1);
    const [artistName, setArtistName] = useState('');
    const [realName, setRealName] = useState('');
    const [age, setAge] = useState(18);
    const [gender, setGender] = useState<Gender>(Gender.Male);
    const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Realistic);
    const [experience, setExperience] = useState<Experience>(Experience.New);
    const [label, setLabel] = useState<string>(LABELS[0]);
    const [startYear, setStartYear] = useState(new Date().getFullYear());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [isGenderPickerOpen, setIsGenderPickerOpen] = useState(false);
    const genderPickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (genderPickerRef.current && !genderPickerRef.current.contains(event.target as Node)) {
                setIsGenderPickerOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleNext = async (e: React.FormEvent) => {
        e.preventDefault();
        if (step === 1) {
            if (artistName.trim() === '' || realName.trim() === '') {
                alert('Artist Name and Real Name are required.');
                return;
            }
            setShowWarning(true);
            return;
        }

        if (step < 4) {
            setStep(step + 1);
        } else {
            setIsSubmitting(true);
            await onStartGame({ artistName, realName, age, gender, difficulty, experience, label }, startYear);
        }
    };
    
    const proceedFromWarning = () => {
        setShowWarning(false);
        setStep(2);
    }

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };
    
    const inputClasses = "w-full bg-white/5 p-4 rounded-2xl border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 focus:bg-white/10 transition-all font-bold";

    const experienceConfig: Record<Experience, { desc: string, color: string, textColor: string }> = {
        [Experience.Underground]: { desc: 'The ultimate grind. Start with 50 local fans and $250.', color: 'border-gray-700', textColor: 'text-gray-500' },
        [Experience.New]: { desc: 'Fresh talent with $500. Ready to make global noise.', color: 'border-blue-600/30', textColor: 'text-blue-500' },
        [Experience.Experienced]: { desc: 'Regional clout with $12,000 and growing momentum.', color: 'border-purple-600/30', textColor: 'text-purple-500' },
        [Experience.AList]: { desc: 'Household name with $100,000. Control the game.', color: 'border-red-600/30', textColor: 'text-red-500' },
    };
    
    return (
        <div className="min-h-screen bg-[#07070B] flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background elements with animations */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/5 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-primary-start/5 blur-[120px] rounded-full"></div>

            {showWarning && <WarningModal onClose={proceedFromWarning} />}

            <div className="w-full max-w-2xl bg-black/40 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-white/5 relative z-10">
                <header className="mb-10 text-center">
                    <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 bg-red-600/10 rounded-full border border-red-600/20">
                        <span className="w-1 h-1 rounded-full bg-red-600 animate-pulse"></span>
                        <p className="text-[8px] font-black uppercase tracking-[0.4em] text-red-500">Contract Negotiation</p>
                    </div>
                    <h1 className="text-4xl font-black italic tracking-tighter uppercase text-white leading-none">
                        {step === 1 ? 'IDENTITY' : step === 2 ? 'TRAJECTORY' : step === 3 ? 'AFFILIATION' : 'CONFIRMATION'}
                    </h1>
                </header>

                <form onSubmit={handleNext}>
                    {step === 1 && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Stage Name</label>
                                    <input type="text" value={artistName} onChange={(e) => setArtistName(e.target.value)} className={inputClasses} placeholder="e.g. Young Mic" required />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Government Name</label>
                                    <input type="text" value={realName} onChange={(e) => setRealName(e.target.value)} className={inputClasses} placeholder="Full Legal Name" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Age: <span className="text-white">{age}</span></label>
                                    <input type="range" value={age} onChange={(e) => setAge(parseInt(e.target.value))} min="16" max="60" className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-red-600 mt-4" />
                                </div>
                                <div className="relative" ref={genderPickerRef}>
                                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Gender</label>
                                    <button
                                        type="button"
                                        onClick={() => setIsGenderPickerOpen(!isGenderPickerOpen)}
                                        className={`${inputClasses} flex justify-between items-center text-left`}
                                    >
                                        <span>{gender}</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    {isGenderPickerOpen && (
                                        <div className="absolute mt-2 w-full rounded-2xl shadow-2xl bg-[#121212] z-20 border border-white/10 overflow-hidden">
                                            {Object.values(Gender).map(g => (
                                                <button
                                                    key={g}
                                                    type="button"
                                                    onClick={() => { setGender(g); setIsGenderPickerOpen(false); }}
                                                    className={`w-full px-4 py-3 text-left text-sm font-bold hover:bg-white/5 transition-colors ${gender === g ? 'text-red-500' : 'text-gray-400'}`}
                                                >
                                                    {g}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-8 animate-fade-in">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-4">Baseline Difficulty</label>
                                <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
                                    {Object.values(Difficulty).map(d => (
                                        <button 
                                            key={d} type="button" 
                                            onClick={() => setDifficulty(d)}
                                            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${difficulty === d ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                                        >
                                            {d}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-4">Starting Path</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.values(Experience).map(e => {
                                        const config = experienceConfig[e];
                                        return (
                                            <button 
                                                key={e} type="button" 
                                                onClick={() => setExperience(e)}
                                                className={`p-5 rounded-[2rem] text-left border transition-all relative overflow-hidden group ${experience === e ? `bg-white/5 ${config.color} border-2` : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                                            >
                                                <div className={`flex justify-between items-center ${experience === e ? config.textColor : 'text-gray-500'}`}>
                                                    <TrajectoryIcon type={e} />
                                                    {experience === e && <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></div>}
                                                </div>
                                                <p className="font-black text-xs uppercase italic text-white mb-1">{e}</p>
                                                <p className="text-[10px] text-gray-500 font-bold leading-tight opacity-70">{config.desc}</p>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-8 animate-fade-in">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-4">Industry Affiliation</label>
                                <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2 scrollbar-hide">
                                    {LABELS.map(l => (
                                        <button 
                                            key={l} type="button" 
                                            onClick={() => setLabel(l)}
                                            className={`p-4 rounded-2xl text-left border transition-all text-[11px] font-black uppercase tracking-widest ${label === l ? 'bg-red-600 text-white border-red-600 shadow-xl shadow-red-900/20' : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'}`}
                                        >
                                            {l}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-4 text-center italic">Label choice defines your corporate ecosystem and starting resources.</p>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Era Start: <span className="text-white">{startYear}</span></label>
                                <input type="range" value={startYear} onChange={(e) => setStartYear(parseInt(e.target.value))} min="1990" max={new Date().getFullYear()} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-red-600 mt-4" />
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="bg-white/5 p-8 rounded-[3rem] border border-white/5 space-y-4">
                                <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Artist Designation</p>
                                        <p className="text-4xl font-black italic uppercase tracking-tighter text-white">{artistName}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Legal</p>
                                        <p className="font-bold text-white uppercase">{realName}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-y-6 gap-x-12 py-4">
                                    <div><p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Affiliation</p><p className="font-black text-xs uppercase text-red-500">{label}</p></div>
                                    <div><p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Era</p><p className="font-black text-xs uppercase text-white">{startYear}</p></div>
                                    <div><p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Risk Profile</p><p className="font-black text-xs uppercase text-white">{difficulty}</p></div>
                                    <div><p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Baseline</p><p className="font-black text-xs uppercase text-white">{experience}</p></div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between items-center mt-12 gap-4">
                         {step > 1 ? (
                            <button type="button" onClick={handleBack} className="px-10 py-4 rounded-full text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all">
                                Back
                            </button>
                         ) : <div />}
                         <button 
                            type="submit" 
                            disabled={isSubmitting} 
                            className="flex-1 bg-white text-black font-black py-4 px-8 rounded-full text-xs uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50"
                        >
                            {isSubmitting ? 'Syncing...' : (step === 4 ? 'INITIALIZE CAREER' : 'CONTINUE')}
                         </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CharacterCreation;
