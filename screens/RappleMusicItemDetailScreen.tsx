
import React from 'react';
import type { Player, Song, Album } from '../types';
import { getDisplayGenre } from '../constants';

interface RappleMusicItemDetailScreenProps {
    item: Album | Song;
    player: Player;
    allAlbums: Album[];
    allSongs: Song[];
    onBack: () => void;
}

const RappleMusicItemDetailScreen: React.FC<RappleMusicItemDetailScreenProps> = ({ item, player, allAlbums, allSongs, onBack }) => {
    const isAlbum = (item: Album | Song): item is Album => 'songs' in item;
    const album = isAlbum(item) ? item : null;
    const song = isAlbum(item) ? null : item;

    // Fixed: Prioritize actual item cover art
    const coverArt = item.coverArt || `https://source.unsplash.com/600x600/?${encodeURIComponent(item.title + ' music cover art')}`;
    const itemTitle = item.title;
    const itemType = album ? album.type : 'Single';
    const releaseDate = item.releaseDate;
    const tracklist = album ? album.songs : [song!];
    const totalDuration = tracklist.reduce((acc, s) => acc + s.duration, 0);
    
    // Corrected Playlist Data with specific cover art
    const rapplePlaylists = [
        { id: 'rp1', name: 'Viral Hip-Hop', curator: 'Rapple Music', img: 'https://thumbs2.imgbox.com/ab/4d/q4T4odyI_t.png' },
        { id: 'rp2', name: 'Street Politics', curator: 'Rapple Music', img: 'https://thumbs2.imgbox.com/eb/4a/Ec0041mV_t.png' },
        { id: 'rp3', name: 'New Music Daily', curator: 'Rapple Music', img: 'https://thumbs2.imgbox.com/6a/29/rFeAiP5x_t.jpeg' },
        { id: 'rp4', name: 'Rap Life', curator: 'Rapple Music Hip-Hop', img: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=400' },
        { id: 'rp5', name: 'The A-List: Rap', curator: 'Rapple Music', img: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb1?q=80&w=400' }
    ];

    const featuredOn = rapplePlaylists.sort(() => 0.5 - Math.random()).slice(0, 3);
    const youMightLike = [...allAlbums, ...allSongs.filter(s => !s.albumId)]
        .filter(i => i.id !== item.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 5);

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        return `${minutes} minutes`;
    };

    const Section: React.FC<{ title: string; children: React.ReactNode;}> = ({ title, children }) => (
        <section>
            <div className="flex justify-between items-center mb-4 px-1">
                <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
                <button className="text-sm font-semibold text-[#fa2d48] hover:opacity-70">See All</button>
            </div>
            {children}
        </section>
    );

    return (
        <div className="bg-black text-white min-h-screen font-sans absolute inset-0 z-[80] overflow-y-auto pb-32">
            <header className="sticky top-0 z-30 flex items-center h-16 px-4 bg-black/60 backdrop-blur-xl border-b border-white/5">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-[#fa2d48]"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                </button>
            </header>

            <main className="p-6 pt-4 space-y-8">
                <header className="flex flex-col md:flex-row items-center text-center md:text-left gap-8">
                    <img src={coverArt} alt={itemTitle} className="w-56 h-56 md:w-64 md:h-64 object-cover rounded-xl shadow-2xl flex-shrink-0" />
                    <div className="flex flex-col justify-center">
                        <h1 className="text-2xl font-bold tracking-tight mb-1">{itemTitle}</h1>
                        <p className="text-xl text-[#fa2d48] font-semibold">{player.artistName}</p>
                        <p className="text-sm text-gray-400 mt-2 font-bold uppercase tracking-widest">
                            {song ? getDisplayGenre(song.genre) : 'Hip-Hop/Rap'} &bull; {new Date(releaseDate).getFullYear()} &bull;  Lossless
                        </p>
                        <div className="flex items-center justify-center md:justify-start gap-4 mt-6">
                            <button className="flex-1 md:flex-none bg-white text-black font-black py-3 px-10 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 active:scale-95 transition-all text-sm uppercase tracking-tighter">
                               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.748 1.295 2.535 0 3.284L7.279 20.99c-1.25.72-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" /></svg>
                                Play
                            </button>
                             <button className="flex-1 md:flex-none bg-white/10 text-white font-black py-3 px-10 rounded-xl hover:bg-white/20 active:scale-95 transition-all text-sm uppercase tracking-tighter">Shuffle</button>
                        </div>
                    </div>
                </header>
                
                <div className="bg-gradient-to-r from-[#fa2d48]/10 to-transparent border-l-4 border-[#fa2d48] p-4 rounded-r-xl flex items-center justify-between">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#fa2d48] mb-1">Rapple Music One</p>
                        <p className="text-sm font-bold">Listen with your subscription.</p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-500"><path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" /></svg>
                </div>

                <div className="border-t border-white/5">
                    {tracklist.map((track, index) => {
                        const acceptedFeatures = track.features?.filter(f => f.status === 'accepted').map(f => f.artist.name);
                        const titleWithFeatures = acceptedFeatures && acceptedFeatures.length > 0
                            ? `${track.title} (feat. ${acceptedFeatures.join(', ')})`
                            : track.title;

                        return (
                             <div key={track.id} className="grid grid-cols-[30px,1fr,auto] items-center gap-4 py-4 border-b border-white/5 last:border-b-0 group">
                                <span className="text-gray-500 font-bold text-center">{index + 1}</span>
                                <div className="flex items-center gap-3 min-w-0">
                                    <p className="font-bold text-base truncate">{titleWithFeatures}</p>
                                    {track.version === 'Explicit' && <span className="text-[10px] bg-[#3a3a3c] text-[#9ca3af] px-1 rounded-sm font-black">E</span>}
                                </div>
                                <button className="text-[#fa2d48] p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" /></svg>
                                </button>
                            </div>
                        );
                    })}
                </div>

                <div className="text-xs text-gray-500 font-semibold space-y-1">
                    <p>{new Date(releaseDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}</p>
                    <p>{tracklist.length} SONG, {formatDuration(totalDuration).toUpperCase()}</p>
                    <p className="opacity-50 font-medium">© {new Date(releaseDate).getFullYear()} {player.artistName.toUpperCase()} / {player.label.toUpperCase()}</p>
                </div>

                <Section title="Featured On">
                    <div className="flex overflow-x-auto space-x-4 pb-4 -mx-6 px-6 scrollbar-hide">
                        {featuredOn.map(pl => (
                            <div key={pl.id} className="flex-shrink-0 w-40 group cursor-pointer">
                                <div className="aspect-square rounded-xl overflow-hidden mb-3 shadow-lg group-hover:scale-[1.02] transition-transform">
                                    <img src={pl.img} alt={pl.name} className="w-full h-full object-cover" />
                                </div>
                                <p className="font-bold truncate text-sm">{pl.name}</p>
                                <p className="text-xs text-gray-500 font-semibold">{pl.curator}</p>
                            </div>
                        ))}
                    </div>
                </Section>
                
                 <Section title="You Might Also Like">
                    <div className="flex overflow-x-auto space-x-4 pb-4 -mx-6 px-6 scrollbar-hide">
                        {youMightLike.map(i => {
                             const parentAlbum = isAlbum(i) ? null : allAlbums.find(a => a.id === (i as Song).albumId);
                             const type = isAlbum(i) ? (i as Album).type : parentAlbum ? parentAlbum.type : 'Single';
                             return (
                                <div key={i.id} className="flex-shrink-0 w-36 group cursor-pointer">
                                    <div className="aspect-square rounded-lg overflow-hidden mb-3 shadow-md group-hover:opacity-80 transition-opacity">
                                        <img src={i.coverArt || ''} alt={i.title} className="w-full h-full object-cover" />
                                    </div>
                                    <p className="font-bold truncate text-xs">{i.title}</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter mt-0.5">{type}</p>
                                </div>
                             )
                        })}
                    </div>
                </Section>

            </main>
        </div>
    );
};

export default RappleMusicItemDetailScreen;
