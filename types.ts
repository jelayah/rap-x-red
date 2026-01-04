
export enum GameState {
  HOME,
  CHARACTER_CREATION,
  IN_GAME,
}

export enum Difficulty {
  Easy = 'Easy',
  Realistic = 'Realistic',
  Hard = 'Hard',
}

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  NonBinary = 'Non-binary',
}

export enum Experience {
  Underground = 'Underground / Flop',
  New = 'New Artist',
  Experienced = 'Experienced Artist',
  AList = 'A-List Star',
}

export interface PitchforkReview {
    score: number;
    summary: string;
    isBestNewMusic: boolean;
    author: string;
    date: Date;
}

export interface NPCArtist {
    name: string;
    fameTier: 'Legend' | 'Superstar' | 'Star' | 'Established' | 'Rising';
    artistImage: string; 
}

export interface Transaction {
    id: string;
    amount: number;
    description: string;
    type: 'Income' | 'Expense';
    date: Date;
}

export interface SocialPost {
    id: string;
    type: 'Manual';
    image?: string; 
    images?: string[]; 
    caption: string;
    date: Date;
    likes: number; 
    comments: number;
    views?: number; 
    shares?: number; 
    baseLikes?: number; 
    peakLikes?: number; 
    platform: 'Instagram' | 'X' | 'Both' | 'TikTok'; 
    quotedTweet?: { 
        author: string;
        handle: string;
        content: string;
        avatar?: string;
        verified: boolean;
    };
    songId?: string; 
}

export interface Contract {
    id: string;
    labelName: string;
    royaltyRate: number; 
    advance: number;
    albumsLeft: number;
    singlesLeft: number;
    description: string;
}

export interface Player {
  artistName: string;
  realName: string;
  age: number;
  gender: Gender;
  difficulty: Difficulty;
  experience: Experience;
  energy: number;
  money: number;
  pendingRoyalties: number; 
  contract: Contract; 
  careerTotalUnits: number; 
  skills: {
    flow: number;
    production: number;
    mixing: number;
    mastering: number;
  };
  reputation: number;
  monthlyListeners: number;
  subscribers: number;
  globalRank: number; 
  bio: string;
  headerImage: string | null;
  aboutImage: string | null;
  label: string;
  records: Record<string, { achieved: boolean; date: Date; message: string; }>;
  socialPosts: SocialPost[];
  transactions: Transaction[];
  startingExperience?: Experience;
  awards?: string[];
  chartStreak: number; 
  bestChartStreak: number;
  settings: {
    showSystemNotifs: boolean;
    showToasts: boolean;
  };
}

export interface Certification {
    level: 'Gold' | 'Platinum' | 'Multi-Platinum' | 'Diamond';
    units: number;
    date: Date;
    multiplier?: number; 
}

export interface Song {
  id: string;
  title: string;
  artistName: string;
  genre: string;
  mood: string;
  topic: string;
  quality: number; 
  rapifyStreams: number;
  rappleStreams: number;
  rapTunesStreams: number;
  sales: number;
  weeklyStreams: number;
  lastWeeklyStreams?: number;
  weeklySales: number;
  releaseDate: Date;
  scheduledReleaseDate?: Date; 
  duration: number; 
  coverArt: string | null; 
  isReleased: boolean;
  version: 'Explicit' | 'Clean';
  price: number; 
  charts: Record<string, {
    position: number;
    lastWeekPosition: number | null;
    peakPosition: number;
    weeksOnChart: number;
  } | null>;
  chartHistory: Partial<Record<ChartId, {
    peakPosition: number;
    peakDate: Date;
    weeksOnChart: number;
  }>>;
  albumId?: string;
  releasedAsSingle?: boolean; 
  shazams: number;
  radioSpins: number;
  weeklyRadioAudience: number;
  weeklyRadioSpins: number;
  submittedToRadio: boolean;
  payolaBudget: number;
  weeksOnRadio?: number;
  regionalStreams: Record<string, number>;
  certifications: Certification[];
  features: { artist: NPCArtist; status: 'pending' | 'accepted' | 'declined' }[];
  producers: string[];
  writers: string[];
  studio: string;
  copyright: string;
  isLossless: boolean;
  isDolbyAtmos: boolean;
  dissTrack: { target: NPCArtist } | null;
  isFocusSingle?: boolean;
  focusSingleWeeks?: number;
  originalSongId?: string;
  youtubeAudioViews: number;
  youtubeVideoViews: number;
  hasMusicVideo: boolean;
  videoReleaseDate?: Date;
  videoQuality: number; 
  videoBudget?: number;
  youtubeViewHistory: { week: number; audioViews: number; videoViews: number }[];
  youtubeThumbnail?: string | null;
  pendingTikTokPromo?: boolean;
  tiktokPromoCooldown?: number; 
  vevoWatermark?: boolean;
  pitchforkReview?: PitchforkReview;
  rawPerformance?: number;
  updatedThisCycle?: boolean;
}

export interface Album {
  id: string;
  title: string;
  artistName: string;
  type: 'Album' | 'EP' | 'Mixtape';
  songs: Song[];
  unitSales: number;
  pureSales: number;
  weeklyPureSales?: number;
  streamEquivalents: number;
  weeklyUnitSales: number;
  lastWeeklyUnitSales?: number;
  releaseDate?: Date;
  scheduledReleaseDate?: Date; 
  presaleWeeks?: number;
  coverArt: string | null;
  price: number;
  chartHistory: Partial<Record<ChartId, {
    peakPosition: number;
    peakDate: Date;
    weeksOnChart: number;
  }>>;
  charts?: Record<string, {
    position: number;
    lastWeekPosition: number | null;
    peakPosition: number;
    weeksOnChart: number;
  } | null>;
  certifications: Certification[];
  copyright: string; 
  isLive?: boolean; 
  deluxeTitle?: string; 
  deluxeCount?: number; 
  isDeluxe?: boolean;
  originalAlbumId?: string;
  discountWeeksRemaining?: number;
  preReleaseUnits?: number;
  debutWeekSales?: number;
  rolloutProgress?: {
      festival: boolean;
      interview: boolean;
      photoshoot: boolean;
      teaser: boolean;
      tracklist: boolean;
      announced: boolean;
  };
  pitchforkReview?: PitchforkReview; 
  firstWeekGoal?: number;
  isExplicit?: boolean;
  presaleLinkPosted?: boolean;
  rawPerformance?: number;
  updatedThisCycle?: boolean;
}

export interface ScheduleItem {
  id:string;
  type: 'Release' | 'Feature' | 'Show' | 'Interview' | 'Radio';
  title: string;
  date: Date;
}

export interface Notification {
    id: string;
    message: string;
    type: 'Chart' | 'Debut' | 'Event' | 'System' | 'Playlist' | 'Sales' | 'Merch' | 'Record' | 'Scandal' | 'Tour';
    date: Date;
    partnershipData?: {
        id: string;
        targetAlbumId: string;
        title: string;
        brand: string;
        payout: number;
        unitBoost: number;
        cost?: number;
    };
    actionTaken?: boolean; 
}

export interface Playlist {
    id: string;
    name: string;
    description: string;
    coverArtSeed: string; 
    type: 'Editorial' | 'Algorithmic' | 'Fanmade';
    coverArtPrompt: string;
    coverArt: string | null; 
    songIds: string[];
}

export type Screen = 'progress' | 'studio' | 'streaming' | 'charts' | 'promotions' | 'merch' | 'social' | 'misc' | 'tour' | 'catalogue';

export type ChartId = 'hot100' | 'bubblingUnderHot50' | 'billboard200' | 'global200' | 'hotRnbHipHopSongs' | 'hotRnbSongs' | 'hotRapSongs' | 'rnbHipHopAirplay' | 'topRnbHipHopAlbums' | 'rnbAlbums' | 'rapAlbums' | 'rapTunesTopSongs' | 'rapTunesTopAlbums' | 'departed';

export interface ChartEntry {
    position: number;
    lastWeekPosition: number | null;
    peakPosition: number;
    weeksOnChart: number;
    title: string;
    artist: string;
    coverArt: string | null;
    artistImage?: string; 
    itemId: string;
    itemType: 'song' | 'album';
    status?: 'new' | 're-entry' | 'up' | 'down' | 'same' | 'departed' | null;
    chartId?: ChartId; 
}

export type ChartData = Record<ChartId, ChartEntry[]>;

export type MerchType = 'Vinyl' | 'CD' | 'Box Set' | 'T-Shirt' | 'Hoodie' | 'Hat' | 'Poster';

export interface MerchItem {
    id: string;
    name: string;
    type: MerchType;
    associatedReleaseId?: string; 
    associatedReleaseTitle?: string; 
    designPrompt: string; 
    designImage: string | null; 
    price: number;
    cost: number;
    stock?: number;
    unitsSold: number;
    releaseDate: Date;
    fulfillment: 'Stock' | 'Dropship';
    isDiscontinued?: boolean; 
}

export interface GameEvent {
  id: string;
  type: 'collab' | 'write' | 'diss_response' | 'feature_request' | 'platform_exclusive';
  artist: NPCArtist;
  songDetails?: {
      title: string;
      genre: string;
      mood: string;
  };
  offer: {
    title: string;
    description: string;
    payout: number;
    reputationGain: number;
  };
  status: 'pending' | 'accepted' | 'declined';
  data?: any; 
}

export interface Achievement {
    id: string;
    message: string;
}

export type PromotionType = 
    | 'BottledStreams'
    | 'StreamingParty'
    | 'BuyingParty'
    | 'RadioPayola'
    | 'PlaylistBribe'
    | 'PRScandal'
    | 'PromoBots'
    | 'StreetTeam'
    | 'Sponsorship'
    | 'ExclusiveDrop'
    | 'ListeningParty'
    | 'MagazineCover'
    | 'PopUpStore'
    | 'FanContest'
    | 'FeatureRun'
    | 'TalkShowCircuit';

export interface Promotion {
    id: string;
    type: PromotionType;
    targetId: string; 
    budget: number;
    weeksRemaining: number;
    data?: any; 
}

export type PromoCategory = 'boosts' | 'industry' | 'organic';

export interface PromoInfo {
    type: PromotionType;
    title: string;
    description: string;
    iconPath: string;
    category: PromoCategory;
    risk: 'None' | 'Low' | 'Medium' | 'High' | 'Extreme';
    baseCost: number;
    durationWeeks: number;
    target: 'Song' | 'Album' | 'Any';
}

export interface Venue {
    id: string;
    type: 'Bar' | 'Theater' | 'Arena' | 'Stadium';
    name: string;
    city: string;
    region: 'North America' | 'Europe' | 'Asia' | 'Oceania' | 'Global' | 'Africa' | 'South America'; 
    capacity: number;
    bookingCost: number;
    listenerRequirement: number;
}

export interface TourStop {
    id: string;
    venue: Venue;
    date: Date;
    ticketPrice: number;
    ticketsSold: number;
    presaleTicketsSold: number; 
    attendance: number;
    revenue: number;
    profit: number;
    status: 'Planned' | 'Presale' | 'Completed' | 'Cancelled';
    legId?: string; 
    liveRelease?: {
        type: 'Album' | 'EP' | 'Single';
        albumId: string;
    }
}

export interface TourDeal {
    id: string;
    name: string;
    description: string;
    type: 'Sponsorship' | 'Promoter';
    upfrontPayment: number;
    revenueShare: number; 
    costCoverage: number; 
    reputationEffect: number;
    isSigned: boolean;
}

export interface TourLeg {
    id: string;
    name: string; 
    region: Venue['region'];
    startDate: Date;
    endDate: Date;
}

export interface Tour {
    id: string;
    name: string;
    artistName: string;
    stops: TourStop[];
    legs: TourLeg[]; 
    deals: TourDeal[]; 
    status: 'Planning' | 'Announced' | 'Presale' | 'Active' | 'Completed' | 'Cancelled';
    totalRevenue: number;
    totalProfit: number;
    projectedProfit?: number; 
    setlist: string[]; 
    promoImage: string | null; 
    generatedPromoPoster: string | null; 
    announcementDate: Date;
    lastPromoDate?: Date; 
}

export interface GameStateBundle {
    player: Player;
    songs: Song[];
    albums: Album[];
    merch: MerchItem[];
    promotions: Promotion[];
    schedule: ScheduleItem[];
    gameDate: Date;
    events: { title: string; description: string }[];
    notifications: Notification[];
    playlists: Playlist[];
    npcSongs: Song[];
    npcAlbums: Album[];
    chartsData: ChartData;
    gameEvents: GameEvent[];
    tours: Tour[];
}

export interface YearlySummaryData {
    year: number;
    initialPlayerState: Player;
    finalPlayerState: Player;
    topSongsByStreams: { title: string; coverArt: string | null; streamsGained: number; }[];
    topAlbumByUnits: { title: string; coverArt: string | null; unitsGained: number; } | null;
    newRecords: Notification[];
    income: {
        music: number;
        merch: number;
        events: number;
    };
    expenses: {
        features: number;
        production: number;
        promotions: number;
        merch: number;
    };
}

export interface Tweet {
    id: string;
    author: {
        name: string;
        handle: string;
        avatarSeed: string; 
        isVerified: boolean;
        type: 'Chart' | 'Fan' | 'Media' | 'Venue' | 'HipHop';
    };
    content: string;
    media?: string; 
    timestamp: Date;
    views: number;
    comments: number;
    retweets: number;
    likes: number;
    bookmarks: number;
    quotedTweet?: { 
        author: string;
        handle: string;
        content: string;
        avatar?: string;
        verified: boolean;
    };
    statsData?: {
        items: Song[];
        title: string;
        artistName: string;
        coverArt: string;
    };
}
