
import React, { useMemo } from 'react';
// Fix: Import Experience as a value instead of type to allow access to its enum members
import { Experience } from '../types';
import type { Player, JobOpening, PlayerJob } from '../types';

interface JobsAppProps {
    player: Player;
    setPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
    onBack: () => void;
}

const JOB_OPENINGS: JobOpening[] = [
    {
        id: 'job_retail',
        role: 'Floor Associate',
        employer: 'Aura Wear',
        description: 'Manage inventory and handle retail customers. Low stress but high hours.',
        durationWeeks: 12,
        totalPay: 3600,
        biWeeklyPay: 600,
        weeklyEnergyCost: 12,
        minReputation: 0,
        minExperience: Experience.Underground
    },
    {
        id: 'job_food',
        role: 'Shift Lead',
        employer: 'Macro Burger',
        description: 'Oversee the kitchen during night shifts. Drains energy fast.',
        durationWeeks: 8,
        totalPay: 3200,
        biWeeklyPay: 800,
        weeklyEnergyCost: 20,
        minReputation: 0,
        minExperience: Experience.Underground
    },
    {
        id: 'job_intern',
        role: 'Studio Intern',
        employer: 'Westlake Recording',
        description: 'Clean up after sessions and organize mics. Essential for production growth.',
        durationWeeks: 16,
        totalPay: 3200,
        biWeeklyPay: 400,
        weeklyEnergyCost: 8,
        minReputation: 5,
        minExperience: Experience.New,
        minSkills: { production: 30 }
    },
    {
        id: 'job_ghostwriter_1',
        role: 'Reference Vocalist',
        employer: 'Top Dawg Ent',
        description: 'Provide vocal references and hooks for A-List projects. High stakes.',
        durationWeeks: 4,
        totalPay: 12000,
        biWeeklyPay: 6000,
        weeklyEnergyCost: 15,
        minReputation: 40,
        minExperience: Experience.Experienced,
        minSkills: { flow: 60 }
    },
    {
        id: 'job_mastering',
        role: 'Session Engineer',
        employer: 'Jungle City',
        description: 'Finish professional mixes for high-profile clients.',
        durationWeeks: 6,
        totalPay: 18000,
        biWeeklyPay: 6000,
        weeklyEnergyCost: 18,
        minReputation: 55,
        minExperience: Experience.Experienced,
        minSkills: { mixing: 70 }
    },
    {
        id: 'job_elite_ghost',
        role: 'Lead Ghostwriter',
        employer: 'OVO Sound',
        description: 'Write charting verses for international stars.',
        durationWeeks: 4,
        totalPay: 40000,
        biWeeklyPay: 20000,
        weeklyEnergyCost: 22,
        minReputation: 70,
        minExperience: Experience.AList,
        minSkills: { flow: 85 }
    }
];

const JobsApp: React.FC<JobsAppProps> = ({ player, setPlayer, onBack }) => {
    
    const availableJobs = useMemo(() => {
        return JOB_OPENINGS.filter(job => 
            player.reputation >= job.minReputation && 
            !player.currentJob
        );
    }, [player.reputation, player.currentJob]);

    const checkSkillMet = (job: JobOpening) => {
        if (!job.minSkills) return true;
        return Object.entries(job.minSkills).every(([skill, value]) => {
            const playerSkill = player.skills[skill as keyof Player['skills']] || 0;
            return playerSkill >= (value || 0);
        });
    };

    const handleApply = (job: JobOpening) => {
        if (!checkSkillMet(job)) {
            alert("Your skills are currently below the required technical threshold for this role.");
            return;
        }
        
        const newJob: PlayerJob = {
            id: job.id,
            role: job.role,
            employer: job.employer,
            weeksLeft: job.durationWeeks,
            totalWeeks: job.durationWeeks,
            biWeeklyPay: job.biWeeklyPay,
            weeklyEnergyCost: job.weeklyEnergyCost
        };

        setPlayer(prev => {
            if (!prev) return null;
            return {
                ...prev,
                currentJob: newJob
            };
        });
    };

    const handleQuit = () => {
        if (window.confirm("Terminating your contract early will decrease your industry reputation. Proceed?")) {
            setPlayer(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    currentJob: null,
                    reputation: Math.max(0, prev.reputation - 5)
                };
            });
        }
    };

    return (
        <div className="bg-[#07070B] text-white min-h-screen fixed inset-0 z-[100] flex flex-col font-sans overflow-hidden">
            <header className="bg-black/90 backdrop-blur-xl border-b border-white/10 p-5 flex items-center justify-between shadow-2xl relative z-10">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-all text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                        <h1 className="font-black text-xl tracking-tighter uppercase italic">CAREER PROTOCOL</h1>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden sm:block text-right">
                        <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest leading-none">Global Reputation</p>
                        <p className="text-sm font-black text-white italic mt-0.5">{player.reputation}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 sm:p-10 space-y-12 scrollbar-hide pb-40 relative">
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
                    <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-red-600/10 blur-[120px] rounded-full"></div>
                </div>

                {player.currentJob ? (
                    <section className="animate-fade-in relative z-10">
                        <div className="flex items-center gap-3 mb-6 px-2">
                             <h3 className="text-[10px] font-black text-red-500 uppercase tracking-[0.5em]">Active Deployment</h3>
                             <div className="h-[1px] flex-grow bg-red-600/20"></div>
                        </div>
                        <div className="bg-gradient-to-br from-[#12121e] to-[#07070B] border border-red-500/20 rounded-[3rem] shadow-2xl overflow-hidden group">
                            <div className="p-8 sm:p-12">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
                                    <div>
                                        <h2 className="text-4xl sm:text-6xl font-black text-white leading-none italic uppercase tracking-tighter">{player.currentJob.role}</h2>
                                        <p className="text-red-500 font-bold text-xl mt-3 uppercase tracking-widest">{player.currentJob.employer}</p>
                                    </div>
                                    <div className="text-left md:text-right bg-white/5 p-4 rounded-2xl border border-white/10 min-w-[150px]">
                                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Contract Status</p>
                                        <p className="text-2xl font-black text-white italic tabular-nums">{player.currentJob.weeksLeft} / {player.currentJob.totalWeeks} <span className="text-xs uppercase not-italic text-gray-600">Wks</span></p>
                                    </div>
                                </div>
                                
                                <div className="space-y-2 mb-10">
                                    <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-gray-500 px-1">
                                        <span>Inception</span>
                                        <span>Term Completion</span>
                                    </div>
                                    <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden border border-white/10 shadow-inner p-0.5">
                                        <div 
                                            className="bg-gradient-to-r from-red-600 to-red-400 h-full rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(220,38,38,0.4)]" 
                                            style={{ width: `${((player.currentJob.totalWeeks - player.currentJob.weeksLeft) / player.currentJob.totalWeeks) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                                    <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 hover:border-white/20 transition-all shadow-xl">
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Bi-Weekly Payout</p>
                                        <p className="text-5xl font-black text-green-500 italic tracking-tighter leading-none">${player.currentJob.biWeeklyPay.toLocaleString()}</p>
                                        <p className="text-[9px] font-bold text-gray-600 uppercase mt-4 italic">Salary is processed automatically in your weekly simulation.</p>
                                    </div>
                                    <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 hover:border-white/20 transition-all shadow-xl">
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">System Strain</p>
                                        <p className="text-5xl font-black text-red-600 italic tracking-tighter leading-none">-{player.currentJob.weeklyEnergyCost} <span className="text-lg not-italic opacity-40 uppercase">Nrg</span></p>
                                        <p className="text-[9px] font-bold text-gray-600 uppercase mt-4 italic">Cost is deducted from your weekly energy pool.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="px-10 py-6 bg-red-600/5 flex justify-end items-center border-t border-white/5 gap-4">
                                <button 
                                    onClick={handleQuit} 
                                    className="group flex items-center gap-3 text-[10px] font-black text-red-500 uppercase tracking-[0.3em] hover:text-white transition-all py-2 px-6 rounded-full hover:bg-red-600 shadow-xl"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 group-hover:rotate-90 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                    Terminate Contract
                                </button>
                            </div>
                        </div>
                    </section>
                ) : (
                    <div className="bg-white/5 p-16 rounded-[4rem] text-center border-2 border-dashed border-white/5 opacity-50 relative z-10">
                         <div className="w-20 h-20 bg-red-600/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-red-600/20">
                            <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                         </div>
                         <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Seeking New Protocols</h2>
                         <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mt-4 max-w-sm mx-auto leading-relaxed">Establish a secondary revenue matrix by signing a corporate deployment contract.</p>
                    </div>
                )}

                <section className="space-y-8 animate-fade-in-up relative z-10">
                    <div className="flex items-center gap-4 px-2">
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em] whitespace-nowrap">Market Openings</h3>
                        <div className="h-[1px] flex-grow bg-white/5"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-6">
                        {availableJobs.length > 0 ? availableJobs.map(job => {
                            const skillMet = checkSkillMet(job);
                            return (
                                <div key={job.id} className={`bg-[#0d0d15] border border-white/5 rounded-[3rem] p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 group transition-all shadow-2xl ${skillMet ? 'hover:border-red-600/30 hover:bg-[#12121e]' : 'opacity-70 grayscale'}`}>
                                    <div className="space-y-6 min-w-0 flex-1">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                                <h4 className="font-black text-3xl text-white uppercase italic tracking-tighter leading-none group-hover:text-red-500 transition-colors">{job.role}</h4>
                                                <span className="text-[9px] bg-red-600/10 text-red-500 px-3 py-1 rounded-full font-black uppercase tracking-widest border border-red-600/20">{job.durationWeeks} Wks</span>
                                            </div>
                                            <p className="text-gray-400 font-black text-base uppercase tracking-[0.2em]">{job.employer}</p>
                                        </div>
                                        <p className="text-sm text-gray-500 font-medium leading-relaxed italic max-w-2xl">"{job.description}"</p>
                                        
                                        {job.minSkills && (
                                            <div className="flex flex-wrap gap-2 pt-2">
                                                {Object.entries(job.minSkills).map(([skill, val]) => {
                                                    const current = player.skills[skill as keyof Player['skills']] || 0;
                                                    const met = current >= (val || 0);
                                                    return (
                                                        <div key={skill} className={`flex items-center gap-2 text-[9px] font-black uppercase px-4 py-2 rounded-xl border ${met ? 'bg-green-500/5 border-green-500/20 text-green-500' : 'bg-red-500/5 border-red-500/20 text-red-500'}`}>
                                                            <div className={`w-1.5 h-1.5 rounded-full ${met ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                                                            {skill}: {val}+ 
                                                            <span className="opacity-40 ml-1">({current})</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center gap-8 w-full lg:w-auto border-t lg:border-t-0 border-white/5 pt-8 lg:pt-0">
                                        <div className="text-left sm:text-right flex-grow sm:flex-grow-0 min-w-[180px]">
                                            <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Contract Value</p>
                                            <p className="text-4xl font-black text-green-400 italic leading-none tabular-nums">${job.totalPay.toLocaleString()}</p>
                                            <p className="text-[10px] font-bold text-gray-500 uppercase mt-2 tracking-widest">${job.biWeeklyPay} every 2 weeks</p>
                                        </div>
                                        <button 
                                            onClick={() => handleApply(job)}
                                            disabled={!!player.currentJob || !skillMet}
                                            className={`w-full sm:w-auto px-12 py-5 rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-95 group-hover:scale-105 ${!skillMet ? 'bg-white/5 text-gray-700 cursor-not-allowed border border-white/5' : 'bg-white text-black hover:bg-red-600 hover:text-white'}`}
                                        >
                                            {!skillMet ? 'Locked' : 'Sign'}
                                        </button>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="py-20 text-center">
                                <p className="text-gray-700 font-black italic uppercase text-xs tracking-widest">Scanning network for compatible deployment openings...</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <footer className="absolute bottom-10 left-0 right-0 text-center opacity-5 pointer-events-none">
                <p className="text-[8px] font-black text-gray-500 uppercase tracking-[1em]">SYSTEM CORE V2.0 • CAREER ANALYTICS • RED MIC OPS</p>
            </footer>
        </div>
    );
};

export default JobsApp;
