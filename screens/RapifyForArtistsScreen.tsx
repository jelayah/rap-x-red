
import React, { useMemo, useState } from 'react';
import type { Player, Song, Playlist, Album } from '../types';
import StreamSnapshot from '../components/StreamSnapshot';

interface RapifyForArtistsScreenProps {
  player: Player;
  songs: Song[];
  playlists: Playlist[];
  albums: Album[];
  gameDate: Date;
  onBack: () => void;
}

const formatNumber = (num: number): string => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toLocaleString();
};

const StatCard: React.FC<{ label: string; value: string; delta?: string; color?: string }> = ({ label, value, delta, color = "text-white" }) => (
    <div className="bg-[#1e1e1e] p-5 sm:p-6 rounded-[2rem] border border-white/5 shadow-xl hover:border-green-500/20 transition-all">
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
        <p className={`text-3xl font-black tracking-tighter italic ${color}`}>{value}</p>
        {delta && <p className="text-[10px] font-bold text-green-500 mt-2 flex items-center gap-1">
            <span className="bg-green-500/10 px-1.5 py-0.5 rounded">▲ {delta}</span>
            <span className="text-gray-500 font-medium">vs last period</span>
        </p>}
    </div>
);

const TopItemRow: React.FC<{ item: { title: string, coverArt: string | null, streams: number }, rank: number, maxStreams: number, onClick: () => void }> = ({ item, rank, maxStreams, onClick }) => {
    const barWidth = maxStreams > 0 ? (item.streams / maxStreams) * 100 : 0;
    return (
        <div onClick={onClick} className="flex items-center gap-4 py-3 px-2 rounded-xl hover:bg-white/5 cursor-pointer group transition-all">
            <span className="text-gray-600 font-black w-4 text-center text-sm group-hover:text-green-500 transition-colors">{rank}</span>
            <img src={item.coverArt || ''} className="w-12 h-12 rounded-lg object-cover flex-shrink-0 shadow-lg" alt={item.title} />
            <div className="flex-grow min-w-0">
                <p className="font-bold text-sm truncate text-white">{item.title}</p>
                <div className="w-full bg-white/5 rounded-full h-1 mt-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-400 h-full transition-all duration-1000" style={{ width: `${barWidth}%` }}></div>
                </div>
            </div>
            <div className="text-right flex-shrink-0 pl-2">
                <p className="text-white font-mono text-xs font-bold">{formatNumber(item.streams)}</p>
                <p className="text-[9px] text-gray-500 font-bold uppercase">Streams</p>
            </div>
        </div>
    )
};

const RapifyForArtistsScreen: React.FC<RapifyForArtistsScreenProps> = ({ player, songs, playlists, onBack, albums, gameDate }) => {
    const [viewingAlbumSnapshot, setViewingAlbumSnapshot] = useState<Album | null>(null);
    const [viewingSongSnapshot, setViewingSongSnapshot] = useState<Song | null>(null);
    
    const releasedSongs = useMemo(() => songs.filter(s => s.isReleased), [songs]);

    const analytics = useMemo(() => {
        const totalStreams = releasedSongs.reduce((acc, song) => acc + song.rapifyStreams, 0);
        const topSongsByStreams = [...releasedSongs].sort((a, b) => b.rapifyStreams - a.rapifyStreams).slice(0, 8);
        
        const topAlbumsByStreams = albums
            .map(album => {
                const albumStreams = album.songs.reduce((acc, songInAlbum) => {
                    const fullSong = releasedSongs.find(s => s.id === songInAlbum.id);
                    return acc + (fullSong?.rapifyStreams || 0);
                }, 0);
                return { ...album, totalStreams: albumStreams };
            })
            .sort((a, b) => b.totalStreams - a.totalStreams)
            .slice(0, 5);

        const playlistPlacements = playlists.map(playlist => ({
            ...playlist,
            playerSongs: playlist.songIds.map(id => releasedSongs.find(s => s.id === id)).filter(Boolean) as Song[],
        })).filter(p => p.playerSongs.length > 0);

        return { totalStreams, topSongsByStreams, playlistPlacements, topAlbumsByStreams };
    }, [releasedSongs, playlists, albums]);

    const profileImage = player.aboutImage || `https://source.unsplash.com/200x200/?${encodeURIComponent(player.artistName + ' portrait')}`;
    
    const maxSongStreams = analytics.topSongsByStreams[0]?.rapifyStreams || 0;
    const maxAlbumStreams = analytics.topAlbumsByStreams[0]?.totalStreams || 0;

    if (viewingAlbumSnapshot) {
        return <StreamSnapshot items={viewingAlbumSnapshot.songs.map(s => songs.find(fs => fs.id === s.id) || s)} title={viewingAlbumSnapshot.title} artistName={player.artistName} coverArt={viewingAlbumSnapshot.coverArt || ''} gameDate={gameDate} onClose={() => setViewingAlbumSnapshot(null)} />
    }
    
    if (viewingSongSnapshot) {
        return <StreamSnapshot items={[viewingSongSnapshot]} title={viewingSongSnapshot.title} artistName={player.artistName} coverArt={viewingSongSnapshot.coverArt || ''} gameDate={gameDate} onClose={() => setViewingSongSnapshot(null)} />
    }

    return (
        <div className="bg-[#121212] text-white min-h-screen font-sans absolute inset-0 z-10 overflow-y-auto pb-32">
            <header className="sticky top-0 bg-[#121212]/95 backdrop-blur-xl z-20 border-b border-white/5">
                <div className="flex items-center justify-between p-4 max-w-5xl mx-auto">
                     <button onClick={onBack} className="text-[#1DB954] flex items-center gap-2 group p-2 hover:bg-white/5 rounded-full transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 group-hover:-translate-x-1 transition-transform">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                        <span className="font-black text-xs uppercase tracking-widest">Dashboard</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="font-black text-sm uppercase leading-none">{player.artistName}</p>
                            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">Artist Admin</p>
                        </div>
                        <img src={profileImage} alt="profile" className="w-9 h-9 rounded-full object-cover border border-white/10" />
                    </div>
                </div>
            </header>

            <main className="p-4 sm:p-8 space-y-10 max-w-5xl mx-auto">
                
                {/* Realtime Stats Bar */}
                <div className="bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-green-600/10 border border-white/5 rounded-[2.5rem] p-6 flex flex-col sm:flex-row justify-between items-center gap-4 animate-fade-in shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="relative">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                            <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-xs font-black uppercase tracking-[0.3em] text-green-400">Live Active Listeners</span>
                    </div>
                    <div className="text-center sm:text-right relative z-10">
                        <span className="text-4xl font-black italic tracking-tighter tabular-nums">{Math.floor(Math.random() * 5000 + 500).toLocaleString()}</span>
                        <span className="text-gray-500 text-xs font-bold ml-2 uppercase">Streaming Now</span>
                    </div>
                </div>

                <section className="animate-fade-in-up">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 mb-6 flex items-center gap-4">
                        Key Performance Metrics
                        <div className="h-[1px] flex-grow bg-white/5"></div>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <StatCard label="Monthly Listeners" value={formatNumber(player.monthlyListeners)} delta="12.4%" />
                        <StatCard label="Total Catalog Plays" value={formatNumber(analytics.totalStreams)} color="text-green-400" />
                        <StatCard label="Fan Followers" value={formatNumber(Math.floor(player.monthlyListeners * 0.18))} delta="5.2%" />
                    </div>
                </section>
                
                <section className="animate-fade-in-up delay-100">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 mb-6 flex items-center gap-4">
                                Highest Velocity Tracks
                                <div className="h-[1px] flex-grow bg-white/5"></div>
                            </h3>
                            <div className="bg-[#1e1e1e]/50 rounded-[2.5rem] p-4 border border-white/5 shadow-2xl">
                                {analytics.topSongsByStreams.length > 0 ? analytics.topSongsByStreams.map((song, i) => (
                                    <TopItemRow 
                                        key={song.id} 
                                        item={{ title: song.title, coverArt: song.coverArt, streams: song.rapifyStreams }}
                                        rank={i+1}
                                        maxStreams={maxSongStreams}
                                        onClick={() => setViewingSongSnapshot(song)}
                                    />
                                )) : <div className="text-center py-20 text-gray-700 font-bold uppercase italic text-xs">No track data synced.</div>}
                            </div>
                        </div>
                        <div>
                             <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 mb-6 flex items-center gap-4">
                                Album Performance
                                <div className="h-[1px] flex-grow bg-white/5"></div>
                             </h3>
                             <div className="bg-[#1e1e1e]/50 rounded-[2.5rem] p-4 border border-white/5 shadow-2xl">
                                {analytics.topAlbumsByStreams.length > 0 ? analytics.topAlbumsByStreams.map((album, i) => (
                                    <TopItemRow 
                                        key={album.id}
                                        item={{ title: album.title, coverArt: album.coverArt, streams: album.totalStreams }}
                                        rank={i+1}
                                        maxStreams={maxAlbumStreams}
                                        onClick={() => setViewingAlbumSnapshot(album)}
                                    />
                                )) : <div className="text-center py-20 text-gray-700 font-bold uppercase italic text-xs">No project data synced.</div>}
                            </div>
                        </div>
                    </div>
                </section>
                
                <section className="animate-fade-in-up delay-200">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 mb-6 flex items-center gap-4">
                        Curated Editorial Placement
                        <div className="h-[1px] flex-grow bg-white/5"></div>
                    </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {analytics.playlistPlacements.length > 0 ? analytics.playlistPlacements.map(playlist => (
                            <div key={playlist.id} className="flex items-center gap-5 p-5 bg-[#1e1e1e] rounded-[2rem] border border-white/5 hover:border-green-500/30 transition-all shadow-xl group">
                                <img src={playlist.coverArt || ''} alt={playlist.name} className="w-16 h-16 rounded-2xl object-cover shadow-2xl group-hover:scale-105 transition-transform" />
                                <div className="min-w-0">
                                    <p className="font-black text-sm uppercase italic text-white tracking-tight">{playlist.name}</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase mt-1 truncate">Tracks: {playlist.playerSongs.map(s => s.title).join(', ')}</p>
                                    <span className="text-[8px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full font-black mt-3 inline-block uppercase tracking-widest">Editorial</span>
                                </div>
                            </div>
                        )) : <div className="col-span-full bg-[#1e1e1e]/30 rounded-[2.5rem] p-20 text-center border-2 border-dashed border-white/5">
                                <p className="text-gray-700 font-black uppercase italic tracking-widest text-sm">No editorial placement detected.</p>
                            </div>}
                    </div>
                </section>
            </main>
            
            <footer className="py-20 text-center opacity-10">
                <p className="text-[9px] font-black uppercase tracking-[0.5em]">Rapify for Artists v4.2.0 • Data Restricted</p>
            </footer>
        </div>
    );
};

export default RapifyForArtistsScreen;
