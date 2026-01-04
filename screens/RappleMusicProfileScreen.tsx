
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
  // Fix: Added onBack prop to the interface to resolve 'Cannot find name onBack' error
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

// Fix: Destructured onBack from props to fix error in catch block
const RappleMusicProfileScreen: React.FC<RappleMusicProfileScreenProps> = ({ artist, player, songs, albums, setPlayer, onSelectItem, onBack }) => {
    // Wrap in try-catch to prevent total game crash if data is corrupted
    try {
        const artistName = 'artistName' in artist ? artist.artistName : artist.name;
        const isPlayerProfile = 'money' in artist;

        const allArtistSongs = useMemo(() => songs.filter(s => s.artistName === artistName && s.isReleased), [songs, artistName]);
        const allArtistAlbums = useMemo(() => albums.filter(a => a.artistName === artistName && !a.scheduledReleaseDate), [albums, artistName]);

        // 1. TOP SONGS (Ranked 1-5 by weekly Rapple streams)
        const topSongs = useMemo(() => {
            return [...allArtistSongs]
                .sort((a, b) => (b.weeklyStreams * 0.4) - (a.weeklyStreams * 0.4))
                .slice(0, 5);
        }, [allArtistSongs]);
        
        // 2. ESSENTIAL ALBUMS (Pitchfork Score >= 7.5)
        const essentialAlbums = useMemo(() => 
            allArtistAlbums.filter(a => a.pitchforkReview && a.pitchforkReview.score >= 7.5), 
        [allArtistAlbums]);

        // 3. ALBUMS (Excluding EP/Mixtape types)
        const albumDiscography = useMemo(() => 
            allArtistAlbums.filter(a => a.type === 'Album'), 
        [allArtistAlbums]);

        // 4. SINGLES & EPs (Standalone singles + EPs/Mixtapes)
        const singlesAndEps = useMemo(() => {
            const eps = allArtistAlbums.filter(a => a.type !== 'Album');
            const standaloneSingles = allArtistSongs.filter(s => !s.albumId || s.releasedAsSingle);
            return [...eps, ...standaloneSingles].sort((a, b) => ensureDate(b.releaseDate).getTime() - ensureDate(a.releaseDate).getTime());
        }, [allArtistAlbums, allArtistSongs]);

        // 5. MUSIC VIDEOS (Only visual assets)
        const musicVideos = useMemo(() => 
            allArtistSongs.filter(s => s.hasMusicVideo).sort((a,b) => (ensureDate(b.videoReleaseDate || b.releaseDate).getTime()) - (ensureDate(a.videoReleaseDate || a.releaseDate).getTime())), 
        [allArtistSongs]);

        const profilePic = isPlayerProfile ? (artist as Player).aboutImage : (artist as NPCArtist).artistImage;
        const headerImage = isPlayerProfile ? (artist as Player).headerImage : (allArtistAlbums[0]?.coverArt || "https://source.unsplash.com/1600x900/?music");
        const artistBio = isPlayerProfile ? (artist as Player).bio : `Listen to ${artistName} on Rapple Music. High-fidelity audio from one of the industry's most compelling voices.`;

        return (
            <div className="bg-[#1c1c1e] text-white font-sans h-full overflow-y-auto pb-32 animate-fade-in">
                {/* Glossy Artist Banner */}
                <div className="relative w-full h-[45vh] max-h-[500px]">
                    <img src={headerImage || ''} alt="Artist Header" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1e] via-[#1c1c1e]/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-6 w-full">
                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-2 drop-shadow-2xl">{artistName}</h1>
                        <p className="text-gray-300 font-bold text-sm uppercase tracking-[0.2em] mb-6 drop-shadow-lg">Rapple Exclusive</p>
                    </div>
                </div>

                <main className="py-8 space-y-16">
                    {/* 1. TOP SONGS */}
                    <section>
                        <SectionHeader title="Top Songs" subtitle="Ranked by Playback" />
                        <div className="px-5 space-y-1">
                            {topSongs.map((song, i) => (
                                <div key={song.id} className="flex items-center gap-4 p-2 rounded-xl hover:bg-[#2c2c2e] cursor-pointer group" onClick={() => onSelectItem(song)}>
                                    <span className="text-gray-500 font-bold w-4 text-center group-hover:text-white transition-colors">{i + 1}</span>
                                    <img src={song.coverArt || ''} className="w-12 h-12 rounded-lg object-cover shadow-lg" alt={song.title} />
                                    <div className="flex-1 min-w-0 border-b border-white/5 pb-2">
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-base text-white truncate">{song.title}</p>
                                            {song.version === 'Explicit' && <span className="bg-[#3a3a3c] text-[#9ca3af] text-[9px] px-1 rounded-sm font-black">E</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 2. ESSENTIAL ALBUMS (Score 7.5+) */}
                    {essentialAlbums.length > 0 && (
                        <section>
                            <SectionHeader title="Essential Albums" subtitle="Must-Listen Critical Picks" />
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
                                        <p className="font-bold text-sm truncate">{album.title}</p>
                                        <p className="text-xs text-gray-500 font-bold mt-0.5">{ensureDate(album.releaseDate!).getFullYear()}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* 3. ALBUMS */}
                    {albumDiscography.length > 0 && (
                        <section>
                            <SectionHeader title="Albums" />
                            <div className="flex gap-4 overflow-x-auto pb-4 px-5 scrollbar-hide">
                                {albumDiscography.map(album => (
                                    <div key={album.id} className="flex-shrink-0 w-44 cursor-pointer group" onClick={() => onSelectItem(album)}>
                                        <div className="aspect-square rounded-xl overflow-hidden mb-3 shadow-lg group-hover:opacity-80 transition-opacity">
                                            <img src={album.coverArt || ''} className="w-full h-full object-cover" alt={album.title} />
                                        </div>
                                        <p className="font-bold text-sm truncate">{album.title}</p>
                                        <p className="text-xs text-gray-500 font-bold mt-0.5">{ensureDate(album.releaseDate!).getFullYear()}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* 4. SINGLES & EPS */}
                    {singlesAndEps.length > 0 && (
                        <section>
                            <SectionHeader title="Singles & EPs" />
                            <div className="flex gap-4 overflow-x-auto pb-4 px-5 scrollbar-hide">
                                {singlesAndEps.map(item => {
                                    const isAlbum = 'type' in item;
                                    return (
                                        <div key={item.id} className="flex-shrink-0 w-36 cursor-pointer group" onClick={() => onSelectItem(item)}>
                                            <div className="aspect-square rounded-xl overflow-hidden mb-3 shadow-md group-hover:opacity-80 transition-opacity">
                                                <img src={item.coverArt || ''} className="w-full h-full object-cover" alt={item.title} />
                                            </div>
                                            <p className="font-bold text-xs truncate">{item.title}</p>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase mt-0.5">{isAlbum ? item.type : 'Single'}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* 5. MUSIC VIDEOS */}
                    {musicVideos.length > 0 && (
                        <section>
                            <SectionHeader title="Music Videos" subtitle="Visual Components" />
                            <div className="flex gap-4 overflow-x-auto pb-4 px-5 scrollbar-hide">
                                {musicVideos.map(song => (
                                    <div key={song.id} className="flex-shrink-0 w-72 cursor-pointer group" onClick={() => onSelectItem(song)}>
                                        <div className="relative aspect-video rounded-xl overflow-hidden mb-2 bg-[#2c2c2e] shadow-lg group-hover:scale-[1.02] transition-all">
                                            <img src={song.youtubeThumbnail || song.coverArt || ''} className="w-full h-full object-cover" alt={song.title} />
                                            {song.vevoWatermark && (
                                                <div className="absolute bottom-2 left-2 bg-white/10 backdrop-blur-md px-1 py-0.2 rounded text-[7px] font-black text-white/60 border border-white/5 uppercase italic tracking-tighter leading-none">vevo</div>
                                            )}
                                        </div>
                                        <p className="font-bold text-sm truncate">{song.title}</p>
                                        <p className="text-xs text-gray-500 font-bold mt-0.5">Music Video</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* 6. ABOUT */}
                    <section className="px-5 pb-20">
                        <h2 className="text-2xl font-bold tracking-tight mb-6">About</h2>
                        <div className="bg-[#2c2c2e] rounded-[3rem] overflow-hidden relative group cursor-pointer shadow-2xl transition-all hover:bg-[#343436]">
                            <div className="aspect-video sm:aspect-[21/9] relative overflow-hidden">
                                 <img src={profilePic || ''} className="w-full h-full object-cover grayscale brightness-50 group-hover:scale-105 transition-transform duration-[5000ms]" alt="Artist Portrait" />
                                 <div className="absolute inset-0 bg-gradient-to-t from-[#2c2c2e] via-transparent to-transparent"></div>
                            </div>
                            <div className="p-8 space-y-6">
                                <p className="text-lg sm:text-2xl font-black italic tracking-tight text-white leading-relaxed line-clamp-3">
                                    {artistBio}
                                </p>
                                <div className="flex items-center gap-10 pt-6 border-t border-white/5">
                                    <div>
                                        <p className="text-3xl font-black text-[#fa2d48] italic tabular-nums">{formatNumber(player.monthlyListeners)}</p>
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Monthly Listeners</p>
                                    </div>
                                    <div>
                                        <p className="text-3xl font-black text-white italic tabular-nums">{player.globalRank > 0 ? `#${player.globalRank}` : '-'}</p>
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Global Rank</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        );
    } catch (e) {
        return (
            <div className="h-full bg-black flex flex-col items-center justify-center p-8 text-center">
                <p className="text-red-500 font-black mb-4">PROFILE DATA SYNC ERROR</p>
                <p className="text-gray-400 text-sm mb-8">An error occurred while building this high-fidelity profile. This usually happens after an era transition.</p>
                <button onClick={onBack} className="bg-white text-black px-12 py-4 rounded-full font-black uppercase tracking-widest text-xs">Emergency Back</button>
            </div>
        );
    }
};

export default RappleMusicProfileScreen;
