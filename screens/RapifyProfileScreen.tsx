
import React, { useState, useMemo } from 'react';
import type { Player, Song, Playlist, NPCArtist, Album } from '../types';
import RapifySongDetailScreen from '../components/RapifySongDetailScreen';
import RapifyAlbumDetailScreen from '../components/RapifyAlbumDetailScreen';
import EditProfileModal from '../components/EditProfileModal';

interface RapifyProfileScreenProps {
  artist: Player | NPCArtist;
  player: Player;
  songs: Song[];
  albums: Album[];
  playlists: Playlist[];
  onBack: () => void;
  setPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
}

const VerifyBadge = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#4D96FF] fill-current" aria-hidden="true">
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.9 14.7L6 12.6l1.5-1.5 2.6 2.6 6.1-6.1 1.5 1.5-7.6 7.6z"></path>
    </svg>
);

const formatCompact = (num: number) => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
};

const RapifyProfileScreen: React.FC<RapifyProfileScreenProps> = ({ artist, player, songs, albums: artistAlbums, playlists, onBack, setPlayer }) => {
    const [viewingSong, setViewingSong] = useState<Song | null>(null);
    const [viewingAlbum, setViewingAlbum] = useState<Album | null>(null);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [showAllPopular, setShowAllPopular] = useState(false);

    const artistName = 'artistName' in artist ? artist.artistName : artist.name;
    const isPlayerProfile = 'money' in artist;

    const allArtistSongs = useMemo(() => songs.filter(s => s.artistName === artistName && s.isReleased), [songs, artistName]);
    const allArtistAlbums = useMemo(() => artistAlbums.filter(a => a.artistName === artistName && a.releaseDate), [artistAlbums, artistName]);

    const popularSongs = useMemo(() => {
        return [...allArtistSongs]
            .sort((a, b) => (b.weeklyStreams || 0) - (a.weeklyStreams || 0))
            .slice(0, showAllPopular ? 10 : 5);
    }, [allArtistSongs, showAllPopular]);

    const discographyAlbums = useMemo(() => 
        allArtistAlbums.filter(a => a.type === 'Album').sort((a,b) => new Date(b.releaseDate!).getTime() - new Date(a.releaseDate!).getTime())
    , [allArtistAlbums]);

    const discographySingles = useMemo(() => 
        allArtistSongs.filter(s => !s.albumId || s.releasedAsSingle).sort((a,b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
    , [allArtistSongs]);

    if (viewingSong) return <RapifySongDetailScreen song={viewingSong} player={player} onBack={() => setViewingSong(null)} />;
    if (viewingAlbum) return <RapifyAlbumDetailScreen album={viewingAlbum} player={player} onBack={() => setViewingAlbum(null)} onSongSelect={setViewingSong} />;

    const headerImage = isPlayerProfile ? (artist as Player).headerImage : null;
    const monthlyListeners = isPlayerProfile ? (artist as Player).monthlyListeners : Math.floor(allArtistSongs.reduce((acc, s) => acc + s.rapifyStreams, 0) * 1.2);
    const defaultHeader = popularSongs[0]?.coverArt || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000";

    return (
        <div className="h-full overflow-y-auto pb-32 bg-[#121212] font-sans text-white scrollbar-hide">
            {isEditingProfile && (
                <EditProfileModal 
                    player={player} 
                    onClose={() => setIsEditingProfile(false)} 
                    onSave={(updated) => { setPlayer(updated); setIsEditingProfile(false); }} 
                />
            )}
            <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-4 bg-[#121212]/90 backdrop-blur-xl border-b border-white/5">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                </button>
                {isPlayerProfile && <button onClick={() => setIsEditingProfile(true)} className="bg-white text-black px-6 py-2 rounded-full text-xs font-black uppercase shadow-xl hover:scale-105 active:scale-95 transition-all">Edit Profile</button>}
            </header>

            <div className="relative w-full h-[45vh] min-h-[350px] flex items-end">
                <img src={headerImage || defaultHeader} className="absolute inset-0 w-full h-full object-cover brightness-75" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent"></div>
                <div className="relative z-10 px-8 pb-10">
                  <div className="flex items-center gap-2 mb-2"><VerifyBadge /><span className="text-[10px] font-black uppercase tracking-widest">Verified Artist</span></div>
                  <h1 className="text-5xl md:text-9xl font-black italic uppercase tracking-tighter leading-none">{artistName}</h1>
                  <p className="text-base font-bold mt-4 tabular-nums">{monthlyListeners.toLocaleString()} monthly listeners</p>
                </div>
            </div>

            <div className="p-8 space-y-16">
                {/* 1. Popular Songs */}
                <section>
                    <div className="flex justify-between items-end mb-6 px-2">
                        <h2 className="text-2xl font-black italic uppercase tracking-tighter">Popular</h2>
                    </div>
                    <div className="space-y-1">
                        {popularSongs.map((song, index) => (
                            <div key={song.id} onClick={() => setViewingSong(song)} className="group flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-all">
                                <div className="flex items-center gap-5 flex-1 min-w-0">
                                    <span className="w-5 text-center text-gray-500 font-black italic">{index + 1}</span>
                                    <img src={song.coverArt || ''} className="w-12 h-12 object-cover rounded-lg shadow-lg" />
                                    <div className="min-w-0">
                                        <p className="font-black truncate text-base leading-none mb-1">{song.title}</p>
                                        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest tabular-nums">{formatCompact(song.rapifyStreams)} plays</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {allArtistSongs.length > 5 && (
                        <button 
                            onClick={() => setShowAllPopular(!showAllPopular)}
                            className="mt-6 ml-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
                        >
                            {showAllPopular ? 'Show Less' : 'Show More'}
                        </button>
                    )}
                </section>

                {/* 2. Albums */}
                {discographyAlbums.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8 px-2">Albums</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
                            {discographyAlbums.map((album) => (
                                <div key={album.id} onClick={() => setViewingAlbum(album)} className="cursor-pointer group">
                                    <div className="aspect-square w-full overflow-hidden rounded-xl mb-4 relative shadow-2xl">
                                        <img src={album.coverArt || ''} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                                    </div>
                                    <p className="font-black text-sm truncate uppercase italic tracking-tight">{album.title}</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase mt-1 tracking-widest">{new Date(album.releaseDate!).getFullYear()}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* 3. Singles & EPs */}
                {discographySingles.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8 px-2">Singles & EPs</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
                            {discographySingles.map((song) => (
                                <div key={song.id} onClick={() => setViewingSong(song)} className="cursor-pointer group">
                                    <div className="aspect-square w-full overflow-hidden rounded-xl mb-4 relative shadow-2xl">
                                        <img src={song.coverArt || ''} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                                    </div>
                                    <p className="font-black text-sm truncate uppercase italic tracking-tight">{song.title}</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase mt-1 tracking-widest">{new Date(song.releaseDate).getFullYear()}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* 4. Compilations */}
                <section>
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-4 px-2">Compilations</h2>
                    <div className="py-12 text-center bg-white/5 rounded-[2rem] border border-dashed border-white/5">
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-700 italic">Coming Soon to Ecosystem</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default RapifyProfileScreen;
