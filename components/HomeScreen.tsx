
import React, { useRef } from 'react';

interface HomeScreenProps {
    onStartNewGame: () => void;
    onLoadGame: (gameData: any) => void;
}

const Icon = ({ path, className = "w-5 h-5 mr-3" }: { path: string; className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

const HomeScreen: React.FC<HomeScreenProps> = ({ onStartNewGame, onLoadGame }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const json = JSON.parse(event.target?.result as string);
                    onLoadGame(json);
                } catch (error) {
                    console.error("Error parsing save file:", error);
                    alert("Invalid save file.");
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="min-h-screen bg-[#07070B] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Aesthetic Elements with animations */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-600/10 blur-[120px] rounded-full animate-pulse transition-all duration-[5000ms]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-primary-start/10 blur-[120px] rounded-full animate-pulse transition-all duration-[7000ms]"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20 pointer-events-none"></div>

            <header className="relative z-10 mb-12 text-center animate-fade-in">
                <div className="flex items-center justify-center gap-4 mb-4 animate-pulse">
                    <span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-red-500"></span>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-red-500">Official Remix Collaboration</p>
                    <span className="h-[1px] w-8 bg-gradient-to-l from-transparent to-red-500"></span>
                </div>
                
                <h1 className="flex flex-col items-center leading-none animate-[bounce_4s_infinite]">
                    <span className="text-7xl md:text-9xl font-black tracking-tighter italic flex items-center">
                        <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">RAP</span>
                        <span className="mx-4 text-red-600 not-italic scale-110 drop-shadow-[0_0_20px_rgba(220,38,38,0.6)] hover:rotate-12 transition-transform duration-500">X</span>
                        <span className="bg-gradient-to-b from-red-500 to-red-800 bg-clip-text text-transparent drop-shadow-lg">RED</span>
                    </span>
                    <span className="text-xl md:text-2xl text-brand-text-muted font-black uppercase tracking-[0.6em] mt-6 ml-2 border-t border-white/10 pt-4 w-full opacity-80">
                        THE INDUSTRY
                    </span>
                </h1>
                
                <div className="mt-8 flex items-center justify-center gap-3 opacity-60">
                    <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-gray-400">Rap Life</div>
                    <div className="text-red-500 font-black">×</div>
                    <div className="px-3 py-1 bg-red-600/10 rounded-full border border-red-500/20 text-[9px] font-black uppercase tracking-widest text-red-400">Red Mic</div>
                </div>
            </header>

            <div className="max-w-lg mb-12 relative z-10 px-4 animate-fade-in-up delay-200">
                <p className="text-sm md:text-base text-brand-text-muted leading-relaxed font-medium text-center">
                    The definitive music industry simulation. Build your empire, control the charts, and navigate the high-stakes politics of the rap world in this exclusive collaborative edition.
                </p>
            </div>

            <div className="w-full max-w-sm space-y-4 relative z-10 animate-fade-in-up delay-500">
                <button
                    onClick={onStartNewGame}
                    className="w-full group relative flex items-center justify-center text-sm font-black text-white bg-white/5 rounded-2xl py-6 px-6 border border-white/10 hover:bg-white hover:text-black transition-all duration-500 overflow-hidden shadow-[0_0_30px_rgba(220,38,38,0.2)] active:scale-95"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-brand-primary-start opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <span className="relative flex items-center gap-3 tracking-[0.3em]">
                        <Icon path="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" className="w-4 h-4" />
                        INITIALIZE CAREER
                    </span>
                </button>
                
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept=".json" 
                    className="hidden" 
                />
                
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center justify-center text-[10px] font-black text-gray-400 bg-white/5 rounded-2xl py-4 border border-white/5 hover:border-white/20 hover:text-white transition-all uppercase tracking-widest active:scale-95"
                    >
                        <Icon path="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" className="w-3 h-3 mr-2" />
                        LOAD CAREER
                    </button>
                    <button
                        disabled
                        className="flex items-center justify-center text-[10px] font-black text-gray-600 bg-white/5 rounded-2xl py-4 border border-white/5 opacity-40 cursor-not-allowed uppercase tracking-widest"
                    >
                         <Icon path="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" className="w-3 h-3 mr-2" />
                        SETUP
                    </button>
                </div>
            </div>

            <footer className="absolute bottom-8 left-0 right-0 text-center z-10 opacity-30">
                <p className="text-[8px] font-black text-gray-500 uppercase tracking-[0.4em]">
                    Proprietary Algorithm Engine • Build 2.0.25 • RED MIC ENT.
                </p>
            </footer>
        </div>
    );
};

export default HomeScreen;
