
import React, { useState, useMemo } from 'react';
import type { Player, Song, Album, NPCArtist } from '../types';
import { getDisplayGenre } from '../constants';

interface RappleMusicProfileScreenProps {
  artist: Player | NPCArtist;
  player: Player;
  songs: Song[];
  albums: Album[];
  setPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
  onSelectItem: (item: Song | Album) => void;
  onBack: () => void;
}

const formatNumber = (num: number): string => {
    if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`;
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toLocaleString();
};

const ensureDate = (d: any): Date => {
    if (d instanceof Date) return d;
    if (typeof d === 'string' || typeof d === 'number') return new Date(d);
    return new Date();
};

const SectionHeader: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
    <div className="flex justify-between items-end mb-4 px-5">
        <div>
            <h2 className="text-xl font-bold tracking-tight">{title}</h2>
            {subtitle && <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest mt-0.5">{subtitle}</p>}
        </div>
        <button className="text-sm font-bold text-[#fa2d48] hover:opacity-70 transition-opacity">See All</button>
    </div>
);

const RappleMusicProfileScreen: React.FC<RappleMusicProfileScreenProps> = ({ artist, player, songs, albums, setPlayer, onSelectItem, onBack }) => {
    const artistName = 'artistName' in artist ? artist.artistName : artist.name;
    const isPlayerProfile = 'money' in artist;

    // Filter released items for this artist
    const allArtistSongs = useMemo(() => 
        songs.filter(s => s.artistName === artistName && s.isReleased)
             .sort((a, b) => ensureDate(b.releaseDate).getTime() - ensureDate(a.releaseDate).getTime())
    , [songs, artistName]);

    const allArtistAlbums = useMemo(() => 
        albums.filter(a => a.artistName === artistName && a.releaseDate)
              .sort((a, b) => ensureDate(b.releaseDate).getTime() - ensureDate(a.releaseDate).getTime())
    , [albums, artistName]);

    const topSongs = useMemo(() => {
        return [...allArtistSongs]
            .sort((a, b) => (b.weeklyStreams * 0.4) - (a.weeklyStreams * 0.4))
            .slice(0, 5);
    }, [allArtistSongs]);
    
    // Essential Albums: Rated > 7.5 by Pitchfork
    const essentialAlbums = useMemo(() => 
        allArtistAlbums.filter(a => a.pitchforkReview && a.pitchforkReview.score > 7.5), 
    [allArtistAlbums]);

    // Main Album category: Includes all Albums (Mixtapes/Albums), sorted latest to oldest
    const albumDiscography = useMemo(() => 
        allArtistAlbums.filter(a => a.type === 'Album' || a.type === 'Mixtape'), 
    [allArtistAlbums]);

    // Singles & EPs: Standalone singles and EPs, sorted latest to oldest
    const singlesAndEps = useMemo(() => {
        const eps = allArtistAlbums.filter(a => a.type === 'EP');
        const standaloneSingles = allArtistSongs.filter(s => !s.albumId || s.releasedAsSingle);
        
        return [...eps, ...standaloneSingles].sort((a, b) => {
            const dateA = 'releaseDate' in a ? ensureDate(a.releaseDate) : ensureDate((a as Song).releaseDate);
            const dateB = 'releaseDate' in b ? ensureDate(b.releaseDate) : ensureDate((b as Song).releaseDate);
            return dateB.getTime() - dateA.getTime();
        });
    }, [allArtistAlbums, allArtistSongs]);

    const headerImage = isPlayerProfile ? (artist as Player).headerImage : (allArtistAlbums[0]?.coverArt || "https://images.unsplash.com/photo-1514525253361-bee8d41e7655?q=80&w=1600");
    const artistBio = isPlayerProfile ? (artist as Player).bio : `Listen to ${artistName} on Rapple Music. High-fidelity audio from one of the industry's most compelling voices.`;

    return (
        <div className="bg-[#1c1c1e] text-white font-sans h-full overflow-y-auto pb-32 animate-fade-in">
            <div className="relative w-full h-[45vh] max-h-[500px]">
                <img src={headerImage || ''} alt="Artist Header" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1e] via-[#1c1c1e]/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 w-full">
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-2 drop-shadow-2xl italic uppercase leading-none">{artistName}</h1>
                    <p className="text-gray-300 font-bold text-sm uppercase tracking-[0.2em] mb-6 drop-shadow-lg">Rapple Exclusive</p>
                </div>
            </div>

            <main className="py-8 space-y-16">
                {/* Popular Tracks */}
                <section>
                    <SectionHeader title="Top Songs" />
                    <div className="px-5 space-y-1">
                        {topSongs.length > 0 ? topSongs.map((song, i) => (
                            <div key={song.id} className="flex items-center gap-4 p-2 rounded-xl hover:bg-[#2c2c2e] cursor-pointer group" onClick={() => onSelectItem(song)}>
                                <span className="text-gray-500 font-bold w-4 text-center group-hover:text-white transition-colors">{i + 1}</span>
                                <img src={song.coverArt || ''} className="w-12 h-12 rounded-lg object-cover shadow-lg" alt={song.title} />
                                <div className="flex-1 min-w-0 border-b border-white/5 pb-2">
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-base text-white truncate">{song.title}</p>
                                        {song.version === 'Explicit' && <span className="bg-[#3a3a3c] text-[#9ca3af] text-[9px] px-1 rounded-sm font-black">E</span>}
                                    </div>
                                    <p className="text-xs text-gray-500 font-bold mt-0.5 truncate uppercase tracking-widest">{artistName}</p>
                                </div>
                            </div>
                        )) : <p className="px-5 text-gray-600 font-bold uppercase text-[10px] italic">No tracks found.</p>}
                    </div>
                </section>

                {/* Essential Albums Carousel */}
                {essentialAlbums.length > 0 && (
                    <section>
                        <SectionHeader title="Essential Albums" subtitle="Critics' Selection" />
                        <div className="flex gap-4 overflow-x-auto pb-4 px-5 scrollbar-hide">
                            {essentialAlbums.map(album => (
                                <div key={album.id} className="flex-shrink-0 w-44 cursor-pointer group" onClick={() => onSelectItem(album)}>
                                    <div className="relative aspect-square rounded-xl overflow-hidden mb-3 shadow-2xl group-hover:scale-105 transition-transform duration-500">
                                        <img src={album.coverArt || ''} className="w-full h-full object-cover" alt={album.title} />
                                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-black text-white border border-white/10 flex items-center gap-1">
                                            <span className="w-1 h-1 bg-[#fa2d48] rounded-full animate-pulse"></span>
                                            {album.pitchforkReview?.score.toFixed(1)}
                                        </div>
                                    </div>
                                    <p className="font-black text-sm truncate uppercase italic tracking-tight">{album.title}</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase mt-0.5">{ensureDate(album.releaseDate!).getFullYear()}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Albums Section (Latest to Oldest) */}
                {albumDiscography.length > 0 && (
                    <section>
                        <SectionHeader title="Albums" subtitle="Latest Releases" />
                        <div className="flex gap-4 overflow-x-auto pb-4 px-5 scrollbar-hide">
                            {albumDiscography.map(album => (
                                <div key={album.id} className="flex-shrink-0 w-44 cursor-pointer group" onClick={() => onSelectItem(album)}>
                                    <div className="aspect-square rounded-xl overflow-hidden mb-3 shadow-lg group-hover:opacity-80 transition-opacity">
                                        <img src={album.coverArt || ''} className="w-full h-full object-cover" alt={album.title} />
                                    </div>
                                    <p className="font-black text-sm truncate uppercase italic tracking-tight">{album.title}</p>
                                    <p className="text-[10px] text-gray-500 font-bold mt-0.5">{ensureDate(album.releaseDate!).getFullYear()}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Singles & EPs Section (Latest to Oldest) */}
                {singlesAndEps.length > 0 && (
                    <section>
                        <SectionHeader title="Singles & EPs" subtitle="Latest to Oldest" />
                        <div className="flex gap-4 overflow-x-auto pb-4 px-5 scrollbar-hide">
                            {singlesAndEps.map(item => {
                                const isAlbumItem = 'songs' in item;
                                const title = item.title;
                                const cover = item.coverArt;
                                const date = isAlbumItem ? (item as Album).releaseDate : (item as Song).releaseDate;
                                
                                return (
                                    <div key={item.id} className="flex-shrink-0 w-44 cursor-pointer group" onClick={() => onSelectItem(item)}>
                                        <div className="aspect-square rounded-xl overflow-hidden mb-3 shadow-lg group-hover:opacity-80 transition-opacity">
                                            <img src={cover || ''} className="w-full h-full object-cover" alt={title} />
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <p className="font-black text-sm truncate uppercase italic tracking-tight flex-1">{title}</p>
                                            {isAlbumItem && <span className="bg-[#3a3a3c] text-white text-[8px] px-1 rounded-sm font-black">EP</span>}
                                        </div>
                                        <p className="text-[10px] text-gray-500 font-bold mt-0.5">{ensureDate(date!).getFullYear()}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* About Section */}
                <section className="px-5 pb-20">
                    <h2 className="text-2xl font-bold tracking-tight mb-6">About</h2>
                    <div className="bg-[#2c2c2e] rounded-[3rem] overflow-hidden relative group cursor-pointer shadow-2xl transition-all hover:bg-[#343436]">
                        <div className="p-8 space-y-6">
                            <p className="text-lg sm:text-2xl font-black italic tracking-tight text-white leading-relaxed line-clamp-3">
                                {artistBio}
                            </p>
                            <div className="flex items-center gap-10 pt-6 border-t border-white/5">
                                <div>
                                    <p className="text-3xl font-black text-[#fa2d48] italic tabular-nums">{formatNumber(isPlayerProfile ? (artist as Player).monthlyListeners : topSongs.length * 12500)}</p>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Monthly Listeners</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default RappleMusicProfileScreen;
