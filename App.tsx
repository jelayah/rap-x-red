
import React, { useState, useCallback, useEffect } from 'react';
import type { Player, Screen, GameState as GameStateType, Song, Album, ScheduleItem, Notification, Playlist, ChartData, ChartEntry, MerchItem, NPCArtist, Promotion, Tour, GameEvent } from './types';
import { GameState, Experience, Difficulty } from './types';
import { MAX_ENERGY, NEW_ARTIST_MONEY, EXPERIENCED_ARTIST_MONEY, A_LIST_ARTIST_MONEY, GENRES, MOODS, TOPICS, CHART_IDS, CHART_NAMES } from './constants';
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

const fameTierPower = {
    'Legend': 100,
    'Superstar': 80,
    'Star': 60,
    'Established': 40,
    'Rising': 20,
};

const DEFAULT_SETTINGS = {
    showSystemNotifs: true,
    showToasts: true,
};

const getStreamsForRank = (rank: number): number => {
    const randomInRange = (min: number, max: number) => Math.floor(min + Math.random() * (max - min));

    // Recalibrated to 70M top / 5M bottom
    if (rank >= 1 && rank <= 3) return randomInRange(55_000_000, 75_000_000);
    if (rank >= 4 && rank <= 10) return randomInRange(40_000_000, 54_000_000);
    if (rank >= 11 && rank <= 20) return randomInRange(28_000_000, 39_000_000);
    if (rank >= 21 && rank <= 40) return randomInRange(18_000_000, 27_000_000);
    if (rank >= 41 && rank <= 70) return randomInRange(10_000_000, 17_000_000);
    if (rank >= 71 && rank <= 100) return randomInRange(5_000_000, 9_900_000);
    if (rank >= 101 && rank <= 150) return randomInRange(1_500_000, 4_900_000);
    return randomInRange(100_000, 1_499_999);
};

const getFirstFridayOfYear = (year: number): Date => {
    const date = new Date(year, 0, 1);
    while (date.getDay() !== 5) {
        date.setDate(date.getDate() + 1);
    }
    return date;
};

const initializeGameWorld = async (startYear: number) => {
    let npcSongs: Song[] = [];
    let npcAlbums: Album[] = [];
    const npcSongTitles = await generateBatchSongTitles(300);
    const firstFriday = getFirstFridayOfYear(startYear);

    for (let i = 0; i < 300; i++) {
        const artist = NPC_ARTISTS[Math.floor(Math.random() * NPC_ARTISTS.length)];
        const stats = fameTierPower[artist.fameTier];
        const hasFeature = Math.random() < 0.2;
        let features: Song['features'] = [];
        if (hasFeature) {
            const featureArtist = NPC_ARTISTS[Math.floor(Math.random() * NPC_ARTISTS.length)];
            if (featureArtist.name !== artist.name) {
                features.push({ artist: featureArtist, status: 'accepted' });
            }
        }
        
        npcSongs.push({
            id: `npc_song_init_${i}`,
            title: npcSongTitles[i] || `Hit Song #${i}`,
            artistName: artist.name,
            genre: GENRES[Math.floor(Math.random() * GENRES.length)],
            mood: MOODS[Math.floor(Math.random() * MOODS.length)],
            topic: TOPICS[Math.floor(Math.random() * TOPICS.length)],
            quality: (stats * 0.8) - 5 + Math.floor(Math.random() * 20),
            rapifyStreams: 0,
            rappleStreams: 0,
            rapTunesStreams: 0,
            sales: 0,
            radioSpins: 0,
            weeklyRadioAudience: 0,
            weeklyStreams: 0, 
            weeklySales: 0,
            weeklyRadioSpins: 0,
            releaseDate: firstFriday,
            duration: 180, 
            coverArt: DEFAULT_NPC_COVER, 
            isReleased: true, version: 'Explicit', price: 1.29,
            charts: {}, chartHistory: {},
            shazams: 0, regionalStreams: {},
            certifications: [],
            features: features,
            producers: ['NPC Producer'],
            writers: [artist.name],
            studio: 'NPC Studio',
            copyright: `© ${startYear} NPC Records`,
            submittedToRadio: true, payolaBudget: 0, isLossless: false, isDolbyAtmos: false,
            dissTrack: null,
            youtubeAudioViews: 0, youtubeVideoViews: 0, hasMusicVideo: false, videoQuality: 0, youtubeViewHistory: [],
        });
    }
    
    const rankedSongs = npcSongs
        .map(s => {
            const artist = NPC_ARTISTS.find(a => a.name === s.artistName);
            const fame = artist ? fameTierPower[artist.fameTier] : 10;
            const weeksOnChart = Math.floor(Math.random() * 40);
            const decay = Math.max(0.05, 1 - (weeksOnChart / 52));
            const powerScore = (fame * s.quality) * decay * (Math.random() * 0.5 + 0.75);
            return { ...s, powerScore };
        })
        .sort((a, b) => b.powerScore - a.powerScore);

    rankedSongs.forEach((song, index) => {
        const rank = index + 1;
        song.weeklyStreams = getStreamsForRank(rank);
        song.weeklySales = Math.floor(song.weeklyStreams / 2500);
        song.weeklyRadioAudience = song.weeklyStreams * (Math.random() * 10 + 5);
        const lifetimeMultiplier = Math.floor(Math.random() * 30 + 5);
        song.rapifyStreams = song.weeklyStreams * lifetimeMultiplier * 0.55;
        song.rappleStreams = song.weeklyStreams * lifetimeMultiplier * 0.35;
        song.sales = song.weeklySales * lifetimeMultiplier;
    });

    const unassignedSongIds = new Set(rankedSongs.map(s => s.id));

    // Ensure Hot 200 is fully populated with 200 albums
    for(let i=0; i < 200; i++) {
        const artist = NPC_ARTISTS[Math.floor(Math.random() * NPC_ARTISTS.length)];
        let albumTitle = `Project ${artist.name.split(' ')[0]} ${i}`;
        const units = (fameTierPower[artist.fameTier] * 1800) * (Math.random() * 5 + 1);
        const albumSongs: Song[] = [];
        
        const trackCount = Math.floor(Math.random() * 8) + 8;
        const availableSongs = rankedSongs.filter(s => unassignedSongIds.has(s.id) && s.artistName === artist.name);
        for (let j = 0; j < trackCount && j < availableSongs.length; j++) {
            const song = availableSongs[j];
            albumSongs.push(song);
            unassignedSongIds.delete(song.id);
        }

        npcAlbums.push({
            id: `npc_album_init_${i}`,
            title: albumTitle,
            artistName: artist.name,
            type: 'Album', 
            songs: albumSongs,
            unitSales: units * 10,
            pureSales: (units * 10) / 10,
            streamEquivalents: 0,
            weeklyUnitSales: 0,
            releaseDate: firstFriday, 
            coverArt: DEFAULT_NPC_COVER, 
            price: 9.99,
            chartHistory: {},
            certifications: [],
            copyright: `© ${startYear} NPC Records`,
        });
    }

    npcAlbums.forEach(album => {
        const tea = Math.floor(album.songs.reduce((sum, s) => sum + s.weeklySales, 0) / 10);
        const sea = Math.floor(album.songs.reduce((sum, s) => sum + s.weeklyStreams, 0) / 1250);
        album.weeklyUnitSales = tea + sea;
    });

    const chartsData: ChartData = {} as ChartData;
    
    const rankedHot100 = rankedSongs.slice(0, 100).map((s, i) => ({
        position: i + 1,
        lastWeekPosition: i + 2,
        peakPosition: i + 1,
        weeksOnChart: 1,
        title: s.title,
        artist: s.artistName,
        coverArt: s.coverArt,
        itemId: s.id,
        itemType: 'song' as const
    }));

    const rankedBubbling = rankedSongs.slice(100, 150).map((s, i) => ({
        position: i + 1,
        lastWeekPosition: null,
        peakPosition: i + 1,
        weeksOnChart: 1,
        title: s.title,
        artist: s.artistName,
        coverArt: s.coverArt,
        itemId: s.id,
        itemType: 'song' as const
    }));

    const rankedB200 = npcAlbums.slice(0, 200).map((a, i) => ({
        position: i + 1,
        lastWeekPosition: i + 2,
        peakPosition: i + 1,
        weeksOnChart: 1,
        title: a.title,
        artist: a.artistName,
        coverArt: a.coverArt,
        itemId: a.id,
        itemType: 'album' as const
    }));

    CHART_IDS.forEach(id => {
        if (id === 'hot100') chartsData.hot100 = rankedHot100;
        else if (id === 'bubblingUnderHot50') chartsData.bubblingUnderHot50 = rankedBubbling;
        else if (id === 'billboard200') chartsData.billboard200 = rankedB200;
        else (chartsData as any)[id] = [];
    });

    return { npcSongs: rankedSongs, npcAlbums, chartsData };
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.HOME);
  const [activeScreen, setActiveScreen] = useState<Screen>('progress');
  const [player, setPlayer] = useState<Player | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [merch, setMerch] = useState<MerchItem[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [gameDate, setGameDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<{ title: string; description: string }[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [npcSongs, setNpcSongs] = useState<Song[]>([]);
  const [npcAlbums, setNpcAlbums] = useState<Album[]>([]);
  const [chartsData, setChartsData] = useState<ChartData>({} as ChartData);
  const [gameEvents, setGameEvents] = useState<GameEvent[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeApp, setActiveApp] = useState<{ app: string, artist?: NPCArtist } | { app: 'none' }>({ app: 'none' });

  const handleStartGame = async (playerData: any, startYear: number) => {
    setLoading(true);
    const world = await initializeGameWorld(startYear);
    
    const startingMoney = 
      playerData.experience === Experience.AList ? A_LIST_ARTIST_MONEY :
      playerData.experience === Experience.Experienced ? EXPERIENCED_ARTIST_MONEY :
      playerData.experience === Experience.Underground ? 250 : NEW_ARTIST_MONEY;

    const initialPlayer: Player = {
      ...playerData,
      energy: MAX_ENERGY,
      money: startingMoney,
      pendingRoyalties: 0,
      careerTotalUnits: 0,
      skills: {
        flow: playerData.experience === Experience.AList ? 85 : playerData.experience === Experience.Experienced ? 60 : 30,
        production: playerData.experience === Experience.AList ? 80 : playerData.experience === Experience.Experienced ? 50 : 25,
        mixing: playerData.experience === Experience.AList ? 75 : playerData.experience === Experience.Experienced ? 45 : 20,
        mastering: playerData.experience === Experience.AList ? 70 : playerData.experience === Experience.Experienced ? 40 : 15,
      },
      reputation: playerData.experience === Experience.AList ? 80 : playerData.experience === Experience.Experienced ? 50 : 5,
      monthlyListeners: playerData.experience === Experience.Underground ? 50 : 0,
      subscribers: 0,
      globalRank: 1000,
      bio: '',
      headerImage: null,
      aboutImage: null,
      records: {},
      socialPosts: [],
      transactions: [],
      chartStreak: 0,
      bestChartStreak: 0,
      contract: {
          id: 'initial',
          labelName: playerData.label,
          royaltyRate: 0.15,
          advance: 0,
          albumsLeft: 3,
          singlesLeft: 5,
          description: 'Your initial recording contract.'
      },
      settings: { ...DEFAULT_SETTINGS }
    };

    setPlayer(initialPlayer);
    setNpcSongs(world.npcSongs);
    setNpcAlbums(world.npcAlbums);
    setChartsData(world.chartsData);
    setGameDate(new Date(startYear, 0, 1));
    setGameState(GameState.IN_GAME);
    setLoading(false);
  };

  const handleSaveGame = () => {
    const saveData = { player, songs, albums, merch, promotions, schedule, gameDate, events, notifications, playlists, npcSongs, npcAlbums, chartsData, gameEvents, tours };
    const blob = new Blob([JSON.stringify(saveData)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rap-life-save-${player?.artistName}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleLoadGame = (data: any) => {
    if (data.player && !data.player.settings) {
        data.player.settings = { ...DEFAULT_SETTINGS };
    }
    if (data.player && !data.player.transactions) {
        data.player.transactions = [];
    }
    setPlayer(data.player);
    setSongs(data.songs);
    setAlbums(data.albums);
    setMerch(data.merch || []);
    setPromotions(data.promotions);
    setSchedule(data.schedule);
    setGameDate(new Date(data.gameDate));
    setEvents(data.events);
    setNotifications(data.notifications);
    setPlaylists(data.playlists);
    setNpcSongs(data.npcSongs);
    setNpcAlbums(data.npcAlbums);
    setChartsData(data.chartsData);
    setGameEvents(data.gameEvents);
    setTours(data.tours || []);
    setGameState(GameState.IN_GAME);
  };

  if (loading) return <LoadingScreen />;

  if (gameState === GameState.HOME) return <HomeScreen onStartNewGame={() => setGameState(GameState.CHARACTER_CREATION)} onLoadGame={handleLoadGame} />;
  if (gameState === GameState.CHARACTER_CREATION) return <CharacterCreation onStartGame={handleStartGame} />;

  const renderScreen = () => {
    if (!player) return null;
    switch (activeScreen) {
      case 'progress': return <ProgressScreen player={player} setPlayer={setPlayer} songs={songs} setSongs={setSongs} albums={albums} setAlbums={setAlbums} merch={merch} setMerch={setMerch} promotions={promotions} setPromotions={setPromotions} schedule={schedule} setSchedule={setSchedule} gameDate={gameDate} setGameDate={setGameDate} events={events} setEvents={setEvents} notifications={notifications} setNotifications={setNotifications} playlists={playlists} setPlaylists={setPlaylists} npcSongs={npcSongs} setNpcSongs={setNpcSongs} npcAlbums={npcAlbums} setNpcAlbums={setNpcAlbums} chartsData={chartsData} setChartsData={setChartsData} onSaveGame={handleSaveGame} tours={tours} setTours={setTours} />;
      case 'studio': return <StudioScreen player={player} setPlayer={setPlayer} songs={songs} setSongs={setSongs} albums={albums} setAlbums={setAlbums} playlists={playlists} gameDate={gameDate} />;
      case 'streaming': return <StreamingScreen player={player} songs={songs} setPlayer={setPlayer} playlists={playlists} albums={albums} gameDate={gameDate} activeApp={activeApp} setActiveApp={setActiveApp} npcSongs={npcSongs} npcAlbums={npcAlbums} />;
      case 'charts': return <ChartsScreen player={player} chartsData={chartsData} gameDate={gameDate} allSongs={[...songs, ...npcSongs]} allAlbums={[...albums, ...npcAlbums]} />;
      case 'promotions': return <PromotionsScreen player={player} setPlayer={setPlayer} songs={songs} albums={albums} promotions={promotions} setPromotions={setPromotions} gameDate={gameDate} setNotifications={setNotifications} />;
      case 'merch': return <MerchScreen player={player} setPlayer={setPlayer} merchItems={merch} setMerchItems={setMerch} playerSongs={songs} playerAlbums={albums} />;
      case 'social': return <SocialScreen player={player} setPlayer={setPlayer} songs={songs} setSongs={setSongs} albums={albums} tours={tours} chartsData={chartsData} gameDate={gameDate} />;
      case 'misc': return <AppsScreen player={player} setPlayer={setPlayer} songs={songs} setSongs={setSongs} albums={albums} setAlbums={setAlbums} notifications={notifications} gameDate={gameDate} />;
      case 'tour': return <TourScreen player={player} setPlayer={setPlayer} tours={tours} setTours={setTours} gameDate={gameDate} setSchedule={setSchedule} songs={songs} setAlbums={setAlbums} setSongs={setSongs} />;
      case 'catalogue': return <CatalogueScreen player={player} songs={songs} setSongs={setSongs} albums={albums} setAlbums={setAlbums} setPlayer={setPlayer} gameDate={gameDate} merch={merch} setMerch={setMerch} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text pb-20 font-sans selection:bg-brand-accent-start selection:text-white">
      <main className="max-w-7xl mx-auto">{renderScreen()}</main>
      <BottomNav activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
    </div>
  );
};

export default App;
