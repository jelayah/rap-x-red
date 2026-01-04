
import React, { useMemo, useState, useRef } from 'react';
import type { Player, Song, Album, Tour, SocialPost } from '../types';

interface InstagramScreenProps {
    player: Player;
    setPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
    songs: Song[];
    albums: Album[];
    tours: Tour[];
    onBack: () => void;
    gameDate: Date;
}

const formatNumber = (num: number | undefined | null) => {
    const val = typeof num === 'number' ? num : 0;
    if (val >= 1_000_000_000) return `${(val / 1_000_000_000).toFixed(1)}B`;
    if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 10_000) return `${(val / 1_000).toFixed(1)}K`;
    return val.toLocaleString();
};

const timeSince = (date: Date, gameDate: Date) => {
    if (!date) return "N/A";
    const postDate = new Date(date);
    const currentGameDate = new Date(gameDate);
    const diffTime = Math.abs(currentGameDate.getTime() - postDate.getTime());
    const diffSeconds = Math.floor(diffTime / 1000);
    
    if (diffSeconds < 60) return "Just Now";
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h`;
    
    const diffDays = Math.floor(diffSeconds / 86400);
    if (diffDays < 7) return `${diffDays}d`;
    return `${Math.floor(diffDays / 7)}w`;
}

const ImageCarousel: React.FC<{ images: string[] }> = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (containerRef.current) {
            const scrollLeft = containerRef.current.scrollLeft;
            const width = containerRef.current.offsetWidth;
            const index = Math.round(scrollLeft / width);
            setCurrentIndex(index);
        }
    };

    if (!images || images.length === 0) return null;

    if (images.length === 1) {
        return (
            <div className="w-full aspect-square bg-[#121212] overflow-hidden">
                <img src={images[0]} alt="Post" className="w-full h-full object-cover" />
            </div>
        );
    }

    return (
        <div className="relative w-full aspect-square bg-[#121212]">
            <div 
                ref={containerRef}
                className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                onScroll={handleScroll}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {images.map((src, idx) => (
                    <div key={idx} className="w-full h-full flex-shrink-0 snap-center">
                        <img src={src} alt={`Slide ${idx}`} className="w-full h-full object-cover" />
                    </div>
                ))}
            </div>
            <div className="absolute top-4 right-4 flex gap-1.5 bg-black/50 px-2 py-1 rounded-full backdrop-blur-sm">
                <span className="text-xs font-semibold text-white">{currentIndex + 1}/{images.length}</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1.5 pb-4 pointer-events-none">
                {images.map((_, idx) => (
                    <div 
                        key={idx} 
                        className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentIndex ? 'bg-blue-500' : 'bg-white/50'}`}
                    />
                ))}
            </div>
        </div>
    );
};

const PostDetailModal: React.FC<{ post: any; onClose: () => void; username: string; profilePic: string; gameDate: Date }> = ({ post, onClose, username, profilePic, gameDate }) => {
    if (!post) return null;
    const images = post.images && post.images.length > 0 ? post.images : (post.image ? [post.image] : []);

    return (
        <div className="fixed inset-0 bg-black z-[120] flex flex-col animate-fade-in-up text-white">
            <div className="flex items-center justify-between p-3 border-b border-[#262626] bg-black">
                <div className="flex items-center gap-3">
                    <button onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                    </button>
                    <span className="font-bold text-white text-sm uppercase">Posts</span>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto bg-black">
                <div className="pb-4">
                    <div className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-2">
                            <img src={profilePic} alt={username} className="w-8 h-8 rounded-full object-cover border border-white/10" />
                            <span className="font-bold text-sm text-white">{username}</span>
                        </div>
                        <svg aria-label="More options" color="white" fill="white" height="24" role="img" viewBox="0 0 24 24" width="24"><circle cx="12" cy="12" r="1.5"></circle><circle cx="6" cy="12" r="1.5"></circle><circle cx="18" cy="12" r="1.5"></circle></svg>
                    </div>
                    {images.length > 0 && <ImageCarousel images={images} />}
                    <div className="p-3">
                        <div className="flex justify-between mb-3">
                            <div className="flex gap-4">
                                <svg aria-label="Like" color="white" fill="white" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path></svg>
                                <svg aria-label="Comment" color="white" fill="white" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path></svg>
                                <svg aria-label="Share Post" color="white" fill="white" height="24" role="img" viewBox="0 0 24 24" width="24"><line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"></line><polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></polygon></svg>
                            </div>
                            <svg aria-label="Save" color="white" fill="white" height="24" role="img" viewBox="0 0 24 24" width="24"><polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon></svg>
                        </div>
                        <p className="font-bold text-sm mb-2">{formatNumber(post.likes)} likes</p>
                        <div className="mb-2">
                            <p className="text-sm whitespace-pre-wrap"><span className="font-bold mr-2">{username}</span>{post.caption}</p>
                        </div>
                        <p className="text-gray-500 text-sm mb-2 cursor-pointer">View all {formatNumber(post.comments)} comments</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                            {timeSince(post.date, gameDate)} ago
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

const CreatePostModal: React.FC<{ onClose: () => void; onPost: (caption: string, images: string[]) => void }> = ({ onClose, onPost }) => {
    const [caption, setCaption] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [selectedPreset, setSelectedPreset] = useState<string>('lifestyle');

    const presets = [
        { id: 'lifestyle', label: 'Lifestyle', query: 'luxury rich lifestyle rapper' },
        { id: 'studio', label: 'Studio', query: 'recording studio music equipment' },
        { id: 'concert', label: 'Concert', query: 'rap concert stage lighting' },
        { id: 'outfit', label: 'Outfit', query: 'designer fashion streetwear' },
    ];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const filesToProcess = Array.from(files).slice(0, 4 - images.length);
            filesToProcess.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (reader.result) {
                        setImages(prev => [...prev, reader.result as string]);
                    }
                };
                reader.readAsDataURL(file as Blob);
            });
            setSelectedPreset('');
        }
    };

    const handleAddPreset = () => {
        if (images.length >= 4) return;
        const newImage = `https://source.unsplash.com/400x400/?${encodeURIComponent(presets.find(p => p.id === selectedPreset)?.query || 'music')}&sig=${Date.now()}`;
        setImages(prev => [...prev, newImage]);
    };

    const handlePost = () => {
        if (images.length === 0) {
            alert("Add at least one photo.");
            return;
        }
        onPost(caption, images);
    };

    return (
        <div className="fixed inset-0 bg-black/95 z-[150] flex items-center justify-center p-4 backdrop-blur-xl">
            <div className="bg-[#121212] w-full max-w-md rounded-[2.5rem] overflow-hidden border border-white/10 flex flex-col max-h-[90vh] shadow-2xl">
                <div className="flex justify-between items-center p-5 border-b border-white/5">
                    <button onClick={onClose} className="text-white font-bold text-sm">Cancel</button>
                    <span className="font-black uppercase tracking-widest text-xs text-white">New Content</span>
                    <button onClick={handlePost} className="text-blue-500 font-black text-sm">Share</button>
                </div>
                <div className="p-6 overflow-y-auto space-y-6">
                    <div className="flex gap-4">
                        <div className="w-24 h-24 bg-white/5 rounded-2xl overflow-hidden flex-shrink-0 relative border border-white/10">
                            {images.length > 0 ? (
                                <>
                                    <img src={images[0]} className="w-full h-full object-cover" />
                                    {images.length > 1 && (
                                        <div className="absolute top-1 right-1 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                                            +{images.length - 1}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-700 text-[10px] font-black uppercase text-center p-2 tracking-tighter leading-none">Void Image</div>
                            )}
                        </div>
                        <textarea 
                            value={caption}
                            onChange={e => setCaption(e.target.value)}
                            placeholder="Write a caption..."
                            className="bg-transparent text-white w-full resize-none focus:outline-none h-24 text-sm font-medium"
                        />
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black uppercase text-gray-500 tracking-widest px-1">Gallery Matrix (Max 4)</h3>
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            {images.map((img, idx) => (
                                <div key={idx} className="relative w-16 h-16 flex-shrink-0">
                                    <img src={img} className="w-full h-full object-cover rounded-xl border border-white/10" />
                                    <button 
                                        onClick={() => setImages(images.filter((_, i) => i !== idx))}
                                        className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-lg"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            {images.length < 4 && (
                                <label className="w-16 h-16 bg-white/5 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-colors border border-dashed border-white/20 flex-shrink-0">
                                    <span className="text-xl text-gray-400 font-light">+</span>
                                    <input type="file" onChange={handleFileChange} className="hidden" multiple accept="image/*" />
                                </label>
                            )}
                        </div>
                        <div className="pt-2">
                            <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-3">Sync Asset Source</p>
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                {presets.map(p => (
                                    <button 
                                        key={p.id}
                                        onClick={() => setSelectedPreset(p.id)}
                                        className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${selectedPreset === p.id ? 'bg-white text-black scale-105' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                                <button 
                                    onClick={handleAddPreset} 
                                    disabled={images.length >= 4}
                                    className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-30 transition-all"
                                >
                                    Inject
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const InstagramScreen: React.FC<InstagramScreenProps> = ({ player, setPlayer, songs, albums, tours, onBack, gameDate }) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [viewingPost, setViewingPost] = useState<any | null>(null);

    // PERSISTENT FOLLOWER LOGIC: Dampened monthly listener effect + High Reputation/Catalog Floor
    const followers = useMemo(() => {
        const mlFloor = player.monthlyListeners * 0.15; // Only 15% depends on current monthly listeners
        const repBonus = player.reputation * 15000; // Primary stable driver
        const catalogFloor = player.careerTotalUnits * 0.2; // Secondary stable driver
        return Math.floor(mlFloor + repBonus + catalogFloor + player.subscribers + 120);
    }, [player.monthlyListeners, player.reputation, player.careerTotalUnits, player.subscribers]);

    const following = 24 + Math.floor(player.reputation / 5);

    const latestSingle = useMemo(() => {
        return songs
            .filter(s => s.isReleased)
            .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())[0];
    }, [songs]);

    const handleCreatePost = (caption: string, images: string[]) => {
        const timestamp = Date.now();
        const baseRate = 0.04 + (Math.random() * 0.02);
        const peakRate = 0.08 + (Math.random() * 0.04);
        const instaBaseLikes = Math.floor(followers * baseRate);
        const instaPeakLikes = Math.floor(followers * peakRate);
        
        const instaPost: SocialPost = {
            id: `post_ig_${timestamp}`,
            type: 'Manual',
            image: images[0],
            images: images,
            caption,
            date: new Date(gameDate),
            likes: instaBaseLikes,
            baseLikes: instaBaseLikes,
            peakLikes: instaPeakLikes,
            comments: Math.floor(instaBaseLikes * 0.02),
            platform: 'Instagram'
        };

        setPlayer(prev => prev ? { ...prev, socialPosts: [instaPost, ...(prev.socialPosts || [])] } : null);
        setShowCreateModal(false);
    };
    
    const feedItems = useMemo(() => {
        const items = [];
        // Only include released albums
        albums.filter(a => a.releaseDate && new Date(a.releaseDate) <= gameDate).forEach(a => {
            items.push({
                id: a.id,
                type: 'Album',
                image: a.coverArt || '',
                images: [a.coverArt || ''],
                date: new Date(a.releaseDate),
                caption: `Official Release: "${a.title}" is now globally available. Link in bio.`,
                likes: Math.floor(a.unitSales * 0.2),
                comments: Math.floor(a.unitSales * 0.01)
            });
        });
        if (player.socialPosts) {
            const manualItems = player.socialPosts
                .filter(p => p.platform === 'Instagram' || p.platform === 'Both')
                .map(post => {
                    const postImages = post.images && post.images.length > 0 ? post.images : [post.image || ''];
                    return {
                        ...post,
                        image: postImages[0],
                        images: postImages
                    }
                });
            items.push(...manualItems);
        }
        return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [songs, albums, player.socialPosts, gameDate]);

    const username = player.artistName.toLowerCase().replace(/\s/g, '_');
    const profilePic = player.aboutImage || `https://source.unsplash.com/150x150/?portrait`;
    
    return (
        <div className="bg-black text-white min-h-screen fixed inset-0 z-[100] flex flex-col font-sans overflow-hidden">
            {showCreateModal && <CreatePostModal onClose={() => setShowCreateModal(false)} onPost={handleCreatePost} />}
            {viewingPost && <PostDetailModal post={viewingPost} onClose={() => setViewingPost(null)} username={username} profilePic={profilePic} gameDate={gameDate} />}
            
            <header className="sticky top-0 bg-black z-30 flex items-center justify-between p-4 border-b border-white/5">
                <button onClick={onBack} className="p-1 -ml-1 hover:opacity-50 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                </button>
                <div className="flex items-center gap-1.5 font-bold text-lg">
                    <span>{username}</span>
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-blue-500 fill-current"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.9 14.7L6 12.6l1.5-1.5 2.6 2.6 6.1-6.1 1.5 1.5-7.6 7.6z"></path></svg>
                </div>
                <div className="flex items-center gap-4">
                    {/* VISIBLE POST BUTTON FOR MOBILE PLAYERS */}
                    <button 
                        onClick={() => setShowCreateModal(true)} 
                        className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
                    >
                        Post
                    </button>
                    <button className="hover:opacity-60 transition-opacity">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2.2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
                    </button>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto scrollbar-hide pb-20">
                <div className="px-5 pt-5 pb-8 space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="relative group">
                            <div className="w-[88px] h-[88px] rounded-full p-[3px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 animate-pulse-slow">
                                <img src={profilePic} alt="Profile" className="w-full h-full rounded-full object-cover border-2 border-black" />
                            </div>
                            <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full w-6 h-6 border-2 border-black flex items-center justify-center text-white text-lg font-bold shadow-lg">+</div>
                        </div>
                        <div className="flex flex-1 justify-around text-center ml-4">
                            <div className="group cursor-pointer">
                                <p className="font-bold text-lg leading-none text-white">{feedItems.length}</p>
                                <p className="text-[11px] text-gray-400 font-medium mt-1">Posts</p>
                            </div>
                            <div className="group cursor-pointer">
                                <p className="font-bold text-lg leading-none text-white">{formatNumber(followers)}</p>
                                <p className="text-[11px] text-gray-400 font-medium mt-1">Followers</p>
                            </div>
                            <div className="group cursor-pointer">
                                <p className="font-bold text-lg leading-none text-white">{following}</p>
                                <p className="text-[11px] text-gray-400 font-medium mt-1">Following</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-0.5">
                        <p className="font-black text-[15px] italic tracking-tight text-white">{player.artistName}</p>
                        <p className="text-sm text-gray-400 font-bold uppercase tracking-widest text-[10px]">Digital Creator • Industry Peer</p>
                        {player.bio && <p className="text-sm text-gray-200 mt-2 leading-relaxed">{player.bio}</p>}
                    </div>

                    <div className="flex gap-2">
                         <button className="flex-1 bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors py-2.5 rounded-lg font-black text-xs uppercase tracking-widest italic text-white">Edit Profile</button>
                         <button className="flex-1 bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors py-2.5 rounded-lg font-black text-xs uppercase tracking-widest italic text-white">Share Profile</button>
                    </div>

                    <div className="flex gap-4 overflow-x-auto scrollbar-hide py-2">
                        <div className="flex flex-col items-center gap-1 flex-shrink-0">
                            <div className="w-16 h-16 rounded-full border-2 border-[#1DB954] p-[2px]">
                                <div className="w-full h-full rounded-full bg-white/5 overflow-hidden">
                                    <img src={latestSingle?.coverArt || `https://source.unsplash.com/100x100/?music`} className="w-full h-full object-cover" alt="Music" />
                                </div>
                            </div>
                            <span className="text-[10px] text-white font-bold uppercase tracking-tighter">Music</span>
                        </div>

                        {['Highlights', 'Studio', 'Tours'].map(label => (
                             <div key={label} className="flex flex-col items-center gap-1 flex-shrink-0">
                                <div className="w-16 h-16 rounded-full border-2 border-white/10 p-[2px]">
                                    <div className="w-full h-full rounded-full bg-white/5 overflow-hidden">
                                        <img src={`https://source.unsplash.com/100x100/?${label}`} className="w-full h-full object-cover grayscale opacity-40" />
                                    </div>
                                </div>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex border-t border-white/5 sticky top-0 bg-black z-20">
                    <button className="flex-1 py-4 flex justify-center border-b-2 border-white text-white">
                        <svg aria-label="" color="currentColor" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><rect fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" width="18" x="3" y="3"></rect><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="9.015" x2="9.015" y1="3" y2="21"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="14.985" x2="14.985" y1="3" y2="21"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="9.015" y2="9.015"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="14.985" y2="14.985"></line></svg>
                    </button>
                    <button className="flex-1 py-4 flex justify-center text-gray-600 hover:text-white transition-colors">
                        <svg aria-label="" color="currentColor" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M10.201 3.797L12 1.997l1.799 1.8a1.59 1.59 0 0 0 1.124.465h5.259A1.818 1.818 0 0 1 22 6.08v5.258a1.59 1.59 0 0 0 .466 1.123L24.266 14.266l-1.8 1.799a1.59 1.59 0 0 0-.465 1.124v5.259A1.818 1.818 0 0 1 20.182 24h-5.259a1.59 1.59 0 0 0-1.123.466L12 26.266l-1.799-1.8a1.59 1.59 0 0 0-1.124-.465H3.818A1.818 1.818 0 0 1 2 22.182v-5.259a1.59 1.59 0 0 0-.466-1.123L-0.266 14.001l1.8-1.799a1.59 1.59 0 0 0 .465-1.124V5.818A1.818 1.818 0 0 1 3.818 4h5.259a1.59 1.59 0 0 0 1.124-.203z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path></svg>
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-0.5 mt-0.5">
                    {feedItems.length > 0 ? feedItems.map((item) => (
                        <div key={item.id} onClick={() => setViewingPost(item)} className="relative aspect-square bg-white/5 group cursor-pointer overflow-hidden shadow-inner">
                            <img src={item.image} alt={item.type} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            {item.images && item.images.length > 1 && (
                                <div className="absolute top-2 right-2"><svg className="w-4 h-4 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 24 24"><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg></div>
                            )}
                        </div>
                    )) : (
                        <div className="col-span-3 py-32 text-center opacity-20">
                            <p className="font-black uppercase tracking-[0.5em] text-xs italic text-white">Asset Vault Empty</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default InstagramScreen;
