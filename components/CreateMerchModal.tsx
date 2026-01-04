
import React, { useState, useMemo } from 'react';
import type { MerchItem, MerchType, Song, Album } from '../types';

interface CreateMerchModalProps {
    onClose: () => void;
    onCreate: (newItem: MerchItem) => void;
    playerSongs: Song[];
    playerAlbums: Album[];
}

const merchConfig: Record<MerchType, { baseCost: number, designPrompt: string, category: 'Music' | 'Apparel', desc: string }> = {
    'Vinyl': { baseCost: 15, designPrompt: '12-inch vinyl record', category: 'Music', desc: 'Premium 180g heavyweight wax.' },
    'CD': { baseCost: 4, designPrompt: 'CD jewel case', category: 'Music', desc: 'Classic digital physical format.' },
    'Box Set': { baseCost: 40, designPrompt: 'luxury album box set', category: 'Music', desc: 'The ultimate collector experience.' },
    'T-Shirt': { baseCost: 8, designPrompt: 'vintage t-shirt', category: 'Apparel', desc: 'Heavyweight cotton streetwear.' },
    'Hoodie': { baseCost: 20, designPrompt: 'oversized hoodie', category: 'Apparel', desc: 'Premium fleece-lined outerwear.' },
    'Hat': { baseCost: 5, designPrompt: 'distressed cap', category: 'Apparel', desc: 'Embroidered brand identity.' },
    'Poster': { baseCost: 2, designPrompt: 'satin poster', category: 'Apparel', desc: 'High-gloss visual asset.' },
};

const CreateMerchModal: React.FC<CreateMerchModalProps> = ({ onClose, onCreate, playerSongs, playerAlbums }) => {
    const [step, setStep] = useState(1);
    const [type, setType] = useState<MerchType | null>(null);
    const [fulfillment, setFulfillment] = useState<'Stock' | 'Dropship'>('Stock');
    const [associatedReleaseId, setAssociatedReleaseId] = useState('');
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(100);
    const [designImage, setDesignImage] = useState<string | null>(null);
    const [designImagePreview, setDesignImagePreview] = useState<string | null>(null);
    const [itemName, setItemName] = useState('');

    const availableReleases = useMemo(() => {
        const songs = playerSongs.filter(s => s.isReleased).map(s => ({ id: s.id, title: s.title, type: 'Song', art: s.coverArt }));
        const albums = playerAlbums.map(a => ({ id: a.id, title: a.title, type: a.type, art: a.coverArt }));
        return [...albums, ...songs];
    }, [playerSongs, playerAlbums]);

    const selectedFullRelease = useMemo(() => {
        if (!associatedReleaseId) return null;
        return availableReleases.find(r => r.id === associatedReleaseId);
    }, [associatedReleaseId, availableReleases]);

    const handleTypeSelect = (selectedType: MerchType) => {
        setType(selectedType);
        const config = merchConfig[selectedType];
        const costPerItem = fulfillment === 'Dropship' ? config.baseCost * 1.4 : config.baseCost;
        setPrice(Math.ceil(costPerItem * 2.5));
        setStep(2);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setDesignImage(reader.result as string);
                setDesignImagePreview(URL.createObjectURL(file));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        if (!type || !itemName) return;
        const config = merchConfig[type];
        const costPerItem = fulfillment === 'Dropship' ? config.baseCost * 1.4 : config.baseCost;
        const finalDesignImage = (config.category === 'Music' && selectedFullRelease && !designImage) 
            ? selectedFullRelease.art 
            : designImage;

        const newItem: MerchItem = {
            id: `merch_${Date.now()}`,
            name: itemName,
            type,
            fulfillment,
            associatedReleaseId: config.category === 'Music' ? associatedReleaseId : undefined,
            associatedReleaseTitle: config.category === 'Music' ? selectedFullRelease?.title : undefined,
            designPrompt: `${itemName} ${config.designPrompt}`,
            designImage: finalDesignImage,
            price,
            cost: costPerItem,
            stock: fulfillment === 'Stock' ? stock : undefined,
            unitsSold: 0,
            releaseDate: new Date(),
            isDiscontinued: false
        };
        onCreate(newItem);
    };

    const costPerItem = type ? (fulfillment === 'Dropship' ? merchConfig[type].baseCost * 1.4 : merchConfig[type].baseCost) : 0;
    const totalUpfront = fulfillment === 'Dropship' ? 0 : costPerItem * stock;

    // Determine the active display art for the preview
    const activeDisplayArt = useMemo(() => {
        if (designImagePreview) return designImagePreview;
        if (type && merchConfig[type].category === 'Music' && selectedFullRelease) return selectedFullRelease.art;
        return null;
    }, [designImagePreview, type, selectedFullRelease]);

    const isUsingSyncedArt = !designImagePreview && !!(type && merchConfig[type].category === 'Music' && selectedFullRelease?.art);

    return (
        <div className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-4 backdrop-blur-2xl">
            <div className="bg-[#0a0a0c] w-full max-w-4xl rounded-[3rem] border border-white/10 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-fade-in-up">
                
                {/* Protocol Header */}
                <header className="p-8 border-b border-white/5 flex justify-between items-center bg-black/50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-600/10 rounded-2xl border border-red-600/20">
                            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-black italic uppercase tracking-tighter">Manufacturing Suite</h2>
                            <div className="flex gap-2 mt-1">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className={`h-1 w-6 rounded-full transition-all duration-500 ${step >= i ? 'bg-red-600' : 'bg-white/10'}`}></div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full transition-colors"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth={3}/></svg></button>
                </header>

                <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                    {step === 1 && (
                        <div className="space-y-10 animate-fade-in">
                            <div className="text-center space-y-2">
                                <h3 className="text-3xl font-black italic uppercase tracking-tighter">Select Logistics Protocol</h3>
                                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Choose how your inventory is managed and fulfilled.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <button onClick={() => setFulfillment('Stock')} className={`relative group p-10 rounded-[3rem] border-2 text-left transition-all ${fulfillment === 'Stock' ? 'bg-white border-white text-black' : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'}`}>
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${fulfillment === 'Stock' ? 'bg-black text-white' : 'bg-white/10 text-gray-400'}`}>
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" strokeWidth={2}/></svg>
                                        </div>
                                        {fulfillment === 'Stock' && <span className="bg-red-600 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase">Selected</span>}
                                    </div>
                                    <h4 className="text-2xl font-black italic uppercase tracking-tighter mb-2">In-House Inventory</h4>
                                    <p className="text-xs font-medium opacity-70 leading-relaxed">Pay COGS upfront to secure physical stock. Highest profit margins and faster shipping logic.</p>
                                </button>
                                <button onClick={() => setFulfillment('Dropship')} className={`relative group p-10 rounded-[3rem] border-2 text-left transition-all ${fulfillment === 'Dropship' ? 'bg-white border-white text-black' : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'}`}>
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${fulfillment === 'Dropship' ? 'bg-black text-white' : 'bg-white/10 text-gray-400'}`}>
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth={2}/></svg>
                                        </div>
                                        {fulfillment === 'Dropship' && <span className="bg-red-600 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase">Selected</span>}
                                    </div>
                                    <h4 className="text-2xl font-black italic uppercase tracking-tighter mb-2">Digital Dropship</h4>
                                    <p className="text-xs font-medium opacity-70 leading-relaxed">No upfront capital required. Items produced upon purchase. Lower margins, zero risk.</p>
                                </button>
                            </div>
                            <button onClick={() => setStep(2)} className="w-full bg-white text-black font-black py-5 rounded-full text-xs uppercase tracking-widest shadow-xl hover:scale-[1.01] active:scale-95 transition-all">Proceed to Catalog</button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-12 animate-fade-in">
                            {/* CATEGORY: MUSIC */}
                            <section>
                                <div className="flex items-center gap-4 mb-8">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Physical Media Assets</h3>
                                    <div className="h-[1px] flex-grow bg-white/5"></div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {Object.entries(merchConfig).filter(([_, c]) => c.category === 'Music').map(([key, config]) => (
                                        <button key={key} onClick={() => handleTypeSelect(key as MerchType)} className="bg-white/5 hover:bg-white/10 border border-white/5 p-6 rounded-[2.5rem] text-left group transition-all">
                                            <p className="font-black text-white uppercase italic text-lg tracking-tighter mb-1">{key}</p>
                                            <p className="text-[9px] text-gray-500 font-bold uppercase">{config.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </section>
                            
                            {/* CATEGORY: APPAREL */}
                            <section>
                                <div className="flex items-center gap-4 mb-8">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Lifestyle & Apparel</h3>
                                    <div className="h-[1px] flex-grow bg-white/5"></div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                    {Object.entries(merchConfig).filter(([_, c]) => c.category === 'Apparel').map(([key, config]) => (
                                        <button key={key} onClick={() => handleTypeSelect(key as MerchType)} className="bg-white/5 hover:bg-white/10 border border-white/5 p-6 rounded-[2rem] text-left group transition-all">
                                            <p className="font-black text-white uppercase italic text-lg tracking-tighter mb-1">{key}</p>
                                            <p className="text-[9px] text-gray-500 font-bold uppercase">{config.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </section>
                            <button onClick={() => setStep(1)} className="text-[10px] font-black text-gray-600 hover:text-white uppercase tracking-widest block mx-auto">Go Back</button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-fade-in">
                            {/* Left: Design Config */}
                            <div className="space-y-10">
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Official Visual Proxy</label>
                                        {isUsingSyncedArt && (
                                            <span className="flex items-center gap-1.5 text-[8px] font-black uppercase text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-full border border-indigo-400/20">
                                                <div className="w-1 h-1 bg-indigo-400 rounded-full animate-pulse"></div>
                                                Synced from Catalog
                                            </span>
                                        )}
                                    </div>
                                    <div className="aspect-square bg-white/5 rounded-[3rem] border border-white/10 overflow-hidden relative group shadow-2xl">
                                        {activeDisplayArt ? (
                                            <img src={activeDisplayArt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-700">
                                                <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth={1.5}/></svg>
                                                <span className="text-[10px] font-black uppercase tracking-widest">Inject Visual Data</span>
                                            </div>
                                        )}
                                        <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white">Click to Override Art</p>
                                        </div>
                                    </div>
                                    <p className="text-[9px] text-gray-600 mt-4 uppercase italic font-bold">Standardized physical mockups will be generated from this source.</p>
                                </div>
                            </div>

                            {/* Right: Economic Config */}
                            <div className="space-y-8">
                                <div className="bg-white/5 p-8 rounded-[3rem] border border-white/5 space-y-8 shadow-inner">
                                    {type && merchConfig[type].category === 'Music' ? (
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-3">Sync Release</label>
                                            <select 
                                                value={associatedReleaseId} 
                                                onChange={e => { 
                                                    setAssociatedReleaseId(e.target.value); 
                                                    const rel = availableReleases.find(r => r.id === e.target.value);
                                                    if(rel) setItemName(`${rel.title} ${type}`);
                                                }} 
                                                className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white font-bold outline-none focus:border-red-600 transition-all"
                                            >
                                                <option value="">SELECT CATALOG ITEM...</option>
                                                {availableReleases.map(r => <option key={r.id} value={r.id}>{r.title} ({r.type})</option>)}
                                            </select>
                                            <p className="text-[8px] text-indigo-400 font-bold uppercase mt-3 tracking-widest italic">Note: Selection automatically syncs catalog visual assets.</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-3">Product Name</label>
                                            <input value={itemName} onChange={e => setItemName(e.target.value)} placeholder="ENTER LABEL..." className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white font-black italic uppercase tracking-tighter outline-none focus:border-red-600 transition-all" />
                                        </div>
                                    )}

                                    <div>
                                        <div className="flex justify-between items-center mb-4">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Market Price</label>
                                            <span className="text-xl font-black italic text-white">${price}</span>
                                        </div>
                                        <input type="range" min={Math.ceil(costPerItem)} max="500" step="5" value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full accent-red-600 h-1 bg-white/10 rounded-full appearance-none" />
                                    </div>

                                    {fulfillment === 'Stock' && (
                                        <div>
                                            <div className="flex justify-between items-center mb-4">
                                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Target Volume</label>
                                                <span className="text-xl font-black italic text-white">{stock} Units</span>
                                            </div>
                                            <input type="range" min="50" max="10000" step="50" value={stock} onChange={e => setStock(Number(e.target.value))} className="w-full accent-red-600 h-1 bg-white/10 rounded-full appearance-none" />
                                        </div>
                                    )}
                                </div>

                                <div className="bg-[#12121e] p-8 rounded-[3rem] border border-white/5 space-y-4">
                                    <div className="flex justify-between items-end"><p className="text-[9px] font-black text-gray-500 uppercase">Unit Margin</p><p className="text-2xl font-black text-green-400 italic tracking-tighter">${(price - costPerItem).toFixed(2)}</p></div>
                                    <div className="flex justify-between items-end"><p className="text-[9px] font-black text-gray-500 uppercase">Est. Market Value</p><p className="text-2xl font-black text-white italic tracking-tighter">${(price * stock).toLocaleString()}</p></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Economic Ledger Footer */}
                <footer className="p-8 bg-black/80 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 leading-none">Net Authorization Capital</p>
                        <p className="text-4xl font-black text-white italic tracking-tighter leading-none">${totalUpfront.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        {step === 3 && <button onClick={() => setStep(2)} className="flex-1 sm:flex-none text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest px-6">Catalog</button>}
                        <button 
                            disabled={step === 3 && (!itemName || (type && merchConfig[type].category === 'Music' && !associatedReleaseId))}
                            onClick={step < 3 ? () => setStep(step + 1) : handleSubmit} 
                            className="flex-[2] sm:flex-none bg-white text-black font-black py-5 px-12 rounded-full text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all disabled:opacity-30"
                        >
                            {step < 3 ? 'Initialize Configuration' : 'Confirm & Produce'}
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default CreateMerchModal;
