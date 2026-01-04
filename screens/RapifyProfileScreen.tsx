
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

const RapifyProfileScreen: React.FC<RapifyProfileScreenProps> = ({ artist, player, songs, albums: artistAlbums, playlists, onBack, setPlayer }) => {
    const [viewingSong, setViewingSong] = useState<Song | null>(null);
    const [viewingAlbum, setViewingAlbum] = useState<Album | null>(null);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [discographyFilter, setDiscographyFilter] = useState<'all' | 'album' | 'single'>('all');

    const artistName = 'artistName' in artist ? artist.artistName : artist.name;
    const isPlayerProfile = 'money' in artist;

    const allArtistSongs = useMemo(() => songs.filter(s => s.artistName === artistName && s.isReleased), [songs, artistName]);
    const allArtistAlbums = useMemo(() => artistAlbums.filter(a => a.artistName === artistName && !a.scheduledReleaseDate), [artistAlbums, artistName]);

    const popularSongs = useMemo(() => {
        return [...allArtistSongs]
            .sort((a, b) => (b.weeklyStreams * 0.6) - (a.weeklyStreams * 0.6))
            .slice(0, 5);
    }, [allArtistSongs]);

    const discographyItems = useMemo(() => {
        const albums = [...allArtistAlbums].sort((a,b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
        const singles = allArtistSongs.filter(s => (!s.albumId && !s.originalSongId) || s.releasedAsSingle)
            .sort((a,b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());

        if (discographyFilter === 'album') return albums;
        if (discographyFilter === 'single') return singles;
        return [...albums, ...singles].sort((a,b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
    }, [allArtistAlbums, allArtistSongs, discographyFilter]);

    const handleSaveProfile = (updatedPlayer: Player) => {
        setPlayer(updatedPlayer);
        setIsEditingProfile(false);
    };

    if (viewingSong) return <RapifySongDetailScreen song={viewingSong} player={player} onBack={() => setViewingSong(null)} />;
    if (viewingAlbum) return <RapifyAlbumDetailScreen album={viewingAlbum} player={player} onBack={() => setViewingAlbum(null)} onSongSelect={setViewingSong} />

    const headerImage = isPlayerProfile ? (artist as Player).headerImage : null;
    const profileImage = isPlayerProfile ? (artist as Player).aboutImage : (artist as NPCArtist).artistImage;
    const bio = isPlayerProfile ? (artist as Player).bio : `Listen to ${artistName} on Rapify. The official profile for ${artistName}.`;
    const monthlyListeners = isPlayerProfile ? (artist as Player).monthlyListeners : Math.floor(allArtistSongs.reduce((acc, s) => acc + s.weeklyStreams, 0) * 0.4);
    
    const defaultHeader = popularSongs[0]?.coverArt || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000";

    return (
        <div className="h-full overflow-y-auto pb-32 bg-[#121212] font-sans text-white scroll-smooth">
            {isEditingProfile && isPlayerProfile && (
                <EditProfileModal player={artist as Player} onSave={handleSaveProfile} onClose={() => setIsEditingProfile(false)} />
            )}
            
            <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-4 bg-[#121212]/90 backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center">
                    <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                    </button>
                    <span className="ml-4 font-black text-sm tracking-tight truncate uppercase italic">{artistName}</span>
                </div>
                {isPlayerProfile && (
                    <button onClick={() => setIsEditingProfile(true)} className="bg-white text-black px-4 py-1.5 rounded-full hover:scale-105 active:scale-95 transition-all text-xs font-black uppercase tracking-widest shadow-lg">
                        Edit Profile
                    </button>
                )}
            </header>

            <div className="relative w-full h-[45vh] min-h-[350px] flex items-end">
                <img src={headerImage || defaultHeader} alt="Artist banner" className="absolute inset-0 w-full h-full object-cover brightness-75" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/40 to-transparent"></div>
                <div className="relative z-10 px-8 pb-10 space-y-3">
                  <div className="flex items-center gap-2">
                    <VerifyBadge />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] drop-shadow-md">Verified Artist</span>
                  </div>
                  <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-none italic uppercase drop-shadow-2xl">{artistName}</h1>
                  <p className="text-base font-bold text-gray-200 drop-shadow-lg">{monthlyListeners.toLocaleString()} monthly listeners</p>
                </div>
            </div>

            <div className="bg-gradient-to-b from-[#181818] to-[#121212] p-8 space-y-12">
                <section className="animate-fade-in-up">
                    <div className="flex items-center gap-6 mb-8">
                        <button className="bg-[#1DB954] rounded-full p-4 hover:scale-105 transition-transform flex items-center justify-center shadow-xl shadow-green-900/20">
                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-black"><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.748 1.295 2.535 0 3.284L7.279 20.99c-1.25.72-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" /></svg>
                        </button>
                        <button className="text-gray-400 hover:text-white border-2 border-gray-600 rounded-full px-6 py-2 text-xs font-black uppercase tracking-widest transition-all hover:border-white">Follow</button>
                        <svg viewBox="0 0 24 24" className="w-8 h-8 text-gray-400 hover:text-white transition-colors cursor-pointer" fill="currentColor"><path d="M4.5 10.5c1.2 0 2.2 1 2.2 2.3s-1 2.3-2.2 2.3-2.2-1-2.2-2.3 1-2.3 2.2-2.3zm15 0c1.2 0 2.2 1 2.2 2.3s-1 2.3-2.2 2.3-2.2-1-2.2-2.3 1-2.3 2.2-2.3zm-7.5 0c1.2 0 2.2 1 2.2 2.3s-1 2.3-2.2 2.3-2.2-1-2.2-2.3 1-2.3 2.2-2.3z"></path></svg>
                    </div>

                    <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-6">Popular</h2>
                    <div className="space-y-1">
                        {popularSongs.map((song, index) => (
                            <div key={song.id} onClick={() => setViewingSong(song)} className="group flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-all active:scale-[0.99]">
                                <div className="flex items-center gap-5 flex-1 min-w-0">
                                    <span className="w-5 text-center text-gray-500 font-black text-sm group-hover:hidden">{index + 1}</span>
                                    <div className="w-5 hidden group-hover:flex items-center justify-center">
                                         <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-white"><path d="M3 22v-20l18 10-18 10z"></path></svg>
                                    </div>
                                    <img src={song.coverArt || ''} className="w-12 h-12 object-cover rounded-lg shadow-xl" />
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-black truncate text-base tracking-tight">{song.title}</span>
                                            {song.version === 'Explicit' && <span className="bg-[#3e3e3e] text-[#9ca3af] text-[9px] px-1.5 rounded-sm h-4 flex items-center justify-center font-black">E</span>}
                                        </div>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">{(Math.floor(song.rapifyStreams)).toLocaleString()} streams</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 text-gray-500 pr-2">
                                    <span className="text-xs font-mono group-hover:text-white transition-colors">{Math.floor(song.duration / 60)}:{Math.floor(song.duration % 60).toString().padStart(2, '0')}</span>
                                    <svg viewBox="0 0 24 24" className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity hover:text-white" fill="currentColor"><path d="M4.5 10.5c1.2 0 2.2 1 2.2 2.3s-1 2.3-2.2 2.3-2.2-1-2.2-2.3 1-2.3 2.2-2.3zm15 0c1.2 0 2.2 1 2.2 2.3s-1 2.3-2.2 2.3-2.2-1-2.2-2.3 1-2.3 2.2-2.3zm-7.5 0c1.2 0 2.2 1 2.2 2.3s-1 2.3-2.2 2.3-2.2-1-2.2-2.3 1-2.3 2.2-2.3z"></path></svg>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="animate-fade-in-up delay-100">
                    <div className="flex justify-between items-end mb-8">
                         <h2 className="text-2xl font-black italic uppercase tracking-tighter">Discography</h2>
                         <button className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">See all</button>
                    </div>
                    <div className="flex gap-2 mb-8 bg-white/5 p-1 rounded-full w-fit border border-white/5">
                        <button onClick={() => setDiscographyFilter('all')} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${discographyFilter === 'all' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}>All</button>
                        <button onClick={() => setDiscographyFilter('album')} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${discographyFilter === 'album' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}>Albums</button>
                        <button onClick={() => setDiscographyFilter('single')} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${discographyFilter === 'single' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}>Singles</button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {discographyItems.slice(0, 12).map((item) => (
                            <div key={item.id} onClick={() => 'songs' in item ? setViewingAlbum(item as Album) : setViewingSong(item as Song)} className="bg-[#181818] p-4 rounded-2xl hover:bg-[#282828] transition-all cursor-pointer group shadow-xl border border-transparent hover:border-white/10">
                                <div className="relative aspect-square mb-4 shadow-2xl overflow-hidden rounded-xl">
                                    <img src={item.coverArt || ''} className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute bottom-2 right-2 w-10 h-10 bg-[#1DB954] rounded-full flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all shadow-xl">
                                         <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-black"><path d="M3 22v-20l18 10-18 10z"></path></svg>
                                    </div>
                                </div>
                                <p className="font-black text-sm truncate uppercase italic tracking-tight">{item.title}</p>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{new Date(item.releaseDate).getFullYear()} • {'songs' in item ? 'Album' : 'Single'}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="pb-24 animate-fade-in-up delay-200">
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8">About</h2>
                    <div 
                        className="relative w-full aspect-video md:aspect-[21/9] rounded-[3rem] overflow-hidden group cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5"
                        onClick={() => isPlayerProfile && setIsEditingProfile(true)}
                    >
                        <img src={profileImage || defaultHeader} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[5000ms] group-hover:scale-110 brightness-50" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        <div className="absolute inset-0 p-10 flex flex-col justify-end">
                            {isPlayerProfile && (
                                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="bg-white text-black px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">Update Portrait</span>
                                </div>
                            )}
                            <p className="text-lg md:text-3xl font-black italic tracking-tight text-white leading-tight line-clamp-3 md:line-clamp-4 max-w-3xl drop-shadow-2xl">
                                {bio}
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default RapifyProfileScreen;
