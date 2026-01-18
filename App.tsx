
import React, { useState, useCallback, useEffect } from 'react';
import type { Player, Screen, Song, Album, Notification, Playlist, ChartData, MerchItem, NPCArtist, Promotion, Tour, GameEvent } from './types';
import { GameState, Experience, Difficulty } from './types';
import { NPC_ARTISTS } from './data/artists';
import { generateBatchSongTitles } from './services/geminiService';

import LoadingScreen from './components/LoadingScreen';
import HomeScreen from './components/HomeScreen';
import CharacterCreation from './components/CharacterCreation';
import BottomNav from './components/BottomNav';
import ProgressScreen from './screens/ProgressScreen';
import StudioScreen from './screens/StudioScreen';
import StreamingScreen from './screens/StreamingScreen';
import ChartsScreen from './screens/ChartsScreen';
import PromotionsScreen from './screens/PromotionsScreen';
import MerchScreen from './screens/MerchScreen';
import CatalogueScreen from './screens/CatalogueScreen';
import TourScreen from './screens/TourScreen';
import SocialScreen from './screens/SocialScreen';
import AppsScreen from './screens/AppsScreen';

const DEFAULT_NPC_COVER = "https://thumbs2.imgbox.com/53/9d/TPyXhrMO_t.jpg";

const initializeGameWorld = async (startYear: number) => {
    try {
        let npcSongs: Song[] = [];
        let npcAlbums: Album[] = [];
        const firstFriday = new Date(startYear, 0, 1);
        while (firstFriday.getDay() !== 5) firstFriday.setDate(firstFriday.getDate() + 1);

        const npcTitles = await generateBatchSongTitles(200);

        for (let i = 0; i < 150; i++) {
            const artist = NPC_ARTISTS[i % NPC_ARTISTS.length];
            const rank = i + 1;
            let streams = 0;
            let sales = 0;

            if (rank === 1) { 
                streams = 55000000 + Math.random() * 10000000; 
                sales = 22000 + Math.random() * 13000;
            } else if (rank <= 5) {
                streams = 38000000 + Math.random() * 20000000;
                sales = 14000 + Math.random() * 14000;
            } else if (rank <= 10) {
                streams = 26000000 + Math.random() * 14000000;
                sales = 8000 + Math.random() * 8000;
            } else if (rank <= 100) {
                streams = 1500000 + Math.random() * 25000000;
                sales = 200 + Math.random() * 9000;
            } else {
                streams = 150000 + Math.random() * 1000000;
                sales = 10 + Math.random() * 100;
            }

            npcSongs.push({
                id: `npc_s_${i}`, title: npcTitles[i], artistName: artist.name, genre: 'Rap', mood: 'Hype', topic: 'Success', quality: 80,
                rapifyStreams: streams * 10, rappleStreams: streams * 5, rapTunesStreams: streams * 2, sales: sales * 15, weeklyStreams: streams, weeklySales: sales, rawPerformance: streams,
                releaseDate: firstFriday, duration: 180, coverArt: DEFAULT_NPC_COVER, isReleased: true, version: 'Explicit', price: 1.29,
                charts: {}, chartHistory: {}, certifications: [], features: [], producers: [], writers: [], studio: '', copyright: '',
                shazams: 0, radioSpins: 0, weeklyRadioAudience: 0, weeklyRadioSpins: 0, submittedToRadio: true, payolaBudget: 0, regionalStreams: {},
                isLossless: false, isDolbyAtmos: false, dissTrack: null, youtubeAudioViews: streams, youtubeVideoViews: 0, hasMusicVideo: false, videoQuality: 0, youtubeViewHistory: []
            });
        }

        for (let i = 0; i < 200; i++) {
            const artist = NPC_ARTISTS[Math.floor(Math.random() * NPC_ARTISTS.length)];
            const rank = i + 1;
            let units = 0;
            if (rank === 1) units = 90000 + Math.random() * 50000;
            else if (rank <= 10) units = 25000 + Math.random() * 70000;
            else if (rank <= 50) units = 6000 + Math.random() * 19000;
            else units = 1000 + Math.random() * 5000;

            npcAlbums.push({
                id: `npc_a_${i}`, title: `Project ${i + 1}`, artistName: artist.name, type: 'Album', songs: [],
                unitSales: units * 10, pureSales: units * 0.2, streamEquivalents: units * 0.8, weeklyUnitSales: units, debutWeekSales: units,
                releaseDate: firstFriday, coverArt: DEFAULT_NPC_COVER, price: 9.99, chartHistory: {}, certifications: [], copyright: ''
            });
        }

        return { npcSongs, npcAlbums };
    } catch (e) {
        return { npcSongs: [], npcAlbums: [] };
    }
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.HOME);
  const [activeScreen, setActiveScreen] = useState<Screen>('progress');
  const [player, setPlayer] = useState<Player | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [merch, setMerch] = useState<MerchItem[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [gameDate, setGameDate] = useState<Date>(new Date());
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [npcSongs, setNpcSongs] = useState<Song[]>([]);
  const [npcAlbums, setNpcAlbums] = useState<Album[]>([]);
  const [chartsData, setChartsData] = useState<ChartData>({ hot100: [], bubblingUnderHot50: [], billboard200: [] } as any);
  const [loading, setLoading] = useState(false);
  const [activeApp, setActiveApp] = useState<{ app: string, artist?: NPCArtist } | { app: 'none' }>({ app: 'none' });

  const handleStartGame = async (playerData: any, startYear: number) => {
    setLoading(true);
    const world = await initializeGameWorld(startYear);
    
    const isAList = playerData.experience === Experience.AList;
    
    const initialPlayer: Player = {
        ...playerData, energy: 100, 
        money: isAList ? 2500000 : 500, 
        careerTotalUnits: isAList ? 5000000 : 0,
        skills: { flow: isAList ? 90 : 50, production: isAList ? 85 : 50, mixing: isAList ? 80 : 50, mastering: isAList ? 80 : 50 }, 
        reputation: isAList ? 95 : 10, 
        monthlyListeners: isAList ? 35000000 : 100, 
        subscribers: isAList ? 12000000 : 0,
        globalRank: isAList ? 12 : 1000, 
        bio: '', headerImage: null, aboutImage: null, records: {}, socialPosts: [], transactions: [], 
        chartStreak: 0, bestChartStreak: 0, currentJob: null, grammyHistory: [], grammySubmissions: [],
        contract: { id: '1', labelName: playerData.label, royaltyRate: 0.15, advance: 0, albumsLeft: 3, singlesLeft: 5, description: '' },
        settings: { showSystemNotifs: true, showToasts: true }, pendingRoyalties: 0, label: playerData.label
    };
    setPlayer(initialPlayer);
    setNpcSongs(world.npcSongs);
    setNpcAlbums(world.npcAlbums);
    setGameDate(new Date(startYear, 0, 1));
    setGameState(GameState.IN_GAME);
    setLoading(false);
  };

  const handleSaveGame = useCallback(() => {
    if (!player) return;
    const saveData = {
        player, songs, albums, merch, promotions, schedule, gameDate, npcSongs, npcAlbums, chartsData, notifications
    };
    const blob = new Blob([JSON.stringify(saveData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `red_mic_save_${player.artistName.toLowerCase().replace(/\s/g, '_')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [player, songs, albums, merch, promotions, schedule, gameDate, npcSongs, npcAlbums, chartsData, notifications]);

  if (loading) return <LoadingScreen />;
  if (gameState === GameState.HOME) return <HomeScreen onStartNewGame={() => setGameState(GameState.CHARACTER_CREATION)} onLoadGame={(d) => { setPlayer(d.player); setSongs(d.songs); setAlbums(d.albums); setNpcSongs(d.npcSongs); setNpcAlbums(d.npcAlbums); setChartsData(d.chartsData); setGameDate(new Date(d.gameDate)); setGameState(GameState.IN_GAME); }} />;
  if (gameState === GameState.CHARACTER_CREATION) return <CharacterCreation onStartGame={handleStartGame} />;

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text pb-20 font-sans">
      <main className="max-w-7xl mx-auto">
        {activeScreen === 'progress' && <ProgressScreen player={player!} setPlayer={setPlayer} songs={songs} setSongs={setSongs} albums={albums} setAlbums={setAlbums} merch={merch} setMerch={setMerch} promotions={promotions} setPromotions={setPromotions} schedule={schedule} setSchedule={setSchedule} gameDate={gameDate} setGameDate={setGameDate} notifications={notifications} setNotifications={setNotifications} npcSongs={npcSongs} setNpcSongs={setNpcSongs} npcAlbums={npcAlbums} setNpcAlbums={setNpcAlbums} chartsData={chartsData} setChartsData={setChartsData} playlists={[]} setPlaylists={() => {}} tours={[]} setTours={() => {}} events={[]} setEvents={() => {}} onSaveGame={handleSaveGame} />}
        {activeScreen === 'studio' && <StudioScreen player={player!} setPlayer={setPlayer} songs={songs} setSongs={setSongs} albums={albums} setAlbums={setAlbums} gameDate={gameDate} playlists={[]} />}
        {activeScreen === 'charts' && <ChartsScreen player={player!} chartsData={chartsData} gameDate={gameDate} allSongs={[...songs, ...npcSongs]} allAlbums={[...albums, ...npcAlbums]} />}
        {activeScreen === 'streaming' && <StreamingScreen player={player!} songs={songs} setPlayer={setPlayer} playlists={[]} albums={albums} gameDate={gameDate} activeApp={activeApp} setActiveApp={setActiveApp} npcSongs={npcSongs} npcAlbums={npcAlbums} />}
        {activeScreen === 'promotions' && <PromotionsScreen player={player!} setPlayer={setPlayer} songs={songs} albums={albums} promotions={promotions} setPromotions={setPromotions} gameDate={gameDate} setNotifications={setNotifications} />}
        {activeScreen === 'merch' && <MerchScreen player={player!} setPlayer={setPlayer} merchItems={merch} setMerchItems={setMerch} playerSongs={songs} playerAlbums={albums} />}
        {activeScreen === 'social' && <SocialScreen player={player!} setPlayer={setPlayer} songs={songs} setSongs={setSongs} albums={albums} tours={[]} chartsData={chartsData} gameDate={gameDate} />}
        {activeScreen === 'misc' && <AppsScreen player={player!} setPlayer={setPlayer} songs={songs} setSongs={setSongs} albums={albums} setAlbums={setAlbums} notifications={notifications} gameDate={gameDate} />}
        {activeScreen === 'catalogue' && <CatalogueScreen player={player!} songs={songs} setSongs={setSongs} albums={albums} setAlbums={setAlbums} setPlayer={setPlayer} gameDate={gameDate} merch={merch} setMerch={setMerch} />}
        {activeScreen === 'tour' && <TourScreen player={player!} setPlayer={setPlayer} tours={[]} setTours={() => {}} gameDate={gameDate} setSchedule={setSchedule} songs={songs} setAlbums={setAlbums} setSongs={setSongs} />}
      </main>
      <BottomNav activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
    </div>
  );
};

export default App;
