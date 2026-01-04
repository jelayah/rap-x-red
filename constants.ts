
import { Difficulty } from './types';
import type { Screen, ChartId, PromotionType, PromoCategory, PromoInfo } from './types';

export const MAX_ENERGY = 100;
export const NEW_ARTIST_MONEY = 500;
export const EXPERIENCED_ARTIST_MONEY = 12000;
export const A_LIST_ARTIST_MONEY = 100000;

export const SCREENS: Screen[] = ['progress', 'studio', 'streaming', 'charts', 'promotions', 'merch', 'social', 'misc', 'tour', 'catalogue'];

export const SCREEN_NAMES: Record<Screen, string> = {
  progress: 'Progress',
  studio: 'Studio',
  streaming: 'Streaming',
  charts: 'Charts',
  promotions: 'Promotions',
  merch: 'Merch',
  social: 'Social Media',
  misc: 'Apps',
  tour: 'Tour',
  catalogue: 'Catalogue',
};

export const GENRES = [
    'Pop', 
    'Hip-Hop/Rap', 
    'Trap', 
    'Drill', 
    'Boom Bap',
    'Afrobeats', 
    'Electronic', 
    'Rock', 
    'R&B', 
    'Country', 
    'Latin', 
    'Alternative',
    'Lo-Fi',
    'Jersey Club'
];

export const RAP_SUBGENRES = [
    'Trap', 
    'Drill', 
    'Boom Bap', 
    'Cloud Rap', 
    'Conscious Hip-Hop', 
    'Pop Rap', 
    'Alternative Hip-Hop', 
    'Jersey Club',
    'Hip-Hop/Rap'
];

export const getDisplayGenre = (genre: string) => {
    return RAP_SUBGENRES.includes(genre) ? 'Hip-Hop/Rap' : genre;
};

export const MOODS = ['Hype', 'Chill', 'Introspective', 'Aggressive', 'Melancholic', 'Party', 'Romantic', 'Confident', 'Dark', 'Trippy'];
export const TOPICS = ['Street Life', 'Relationships', 'Wealth', 'Social Commentary', 'Personal Struggles', 'Flexing', 'Heartbreak', 'Mental Health', 'Legacy', 'Betrayal'];
export const STUDIOS = ['Westlake Recording', 'Jungle City Studios', 'Electric Lady Studios', 'Criteria Studios', 'Hit Factory'];
export const PRODUCERS = ['Nova Beats', 'Cassius Ray', 'Metro Boomin', 'Tay Keith', 'Cardo', 'WondaGurl', 'The Alchemist', 'Hit-Boy'];
export const WRITERS = ['Aria Monroe', 'Dante Cruz', 'Kylah Kame', 'Olana Maraj', 'Saint John'];

export const FAME_STATS = {
    'Legend': { cost: 250000, power: 100, qualityBoost: 15 },
    'Superstar': { cost: 100000, power: 85, qualityBoost: 10 },
    'Star': { cost: 40000, power: 65, qualityBoost: 7 },
    'Established': { cost: 15000, power: 45, qualityBoost: 4 },
    'Rising': { cost: 3000, power: 25, qualityBoost: 2 },
};

export const CHART_REGIONS = ['Global', 'USA', 'Canada', 'UK'];

export const CHART_IDS: ChartId[] = ['hot100', 'bubblingUnderHot50', 'global200', 'hotRnbHipHopSongs', 'hotRnbSongs', 'hotRapSongs', 'rnbHipHopAirplay', 'rapTunesTopSongs', 'rapTunesTopAlbums', 'billboard200', 'topRnbHipHopAlbums', 'rnbAlbums', 'rapAlbums'];
export const CHART_NAMES: Record<ChartId, string> = {
    hot100: 'Billboard Hot 100',
    bubblingUnderHot50: 'Bubbling Under Hot 50',
    global200: 'Official Global 200',
    hotRnbHipHopSongs: 'Hot R&B/Hip-Hop Songs',
    hotRnbSongs: 'Hot R&B Songs',
    hotRapSongs: 'Hot Rap Songs',
    rnbHipHopAirplay: 'R&B/Hip-Hop Airplay',
    rapTunesTopSongs: 'RapTunes Top Songs',
    rapTunesTopAlbums: 'RapTunes Top Albums',
    billboard200: 'Billboard 200',
    topRnbHipHopAlbums: 'Top R&B/Hip-Hop Albums',
    rnbAlbums: 'R&B Albums',
    rapAlbums: 'Rap Albums',
    departed: 'Departed',
};

export const LABELS = [
    'Independent',
    'Roc Nation',
    'OVO Sound',
    'Dreamville Records',
    'Cactus Jack Records',
    'Top Dawg Entertainment (TDE)',
    'Aftermath Entertainment',
    'Quality Control Music',
    'Young Money Entertainment',
    'Def Jam Recordings',
    'Republic Records',
    'Atlantic Records',
    'Epic Records',
    'Columbia Records',
    'Warner Records',
    'A&M Records',
    'Interscope Records',
    'RCA Records',
    'Maybach Music Group (MMG)',
    'G.O.O.D. Music',
];

export const difficultySettings = {
    [Difficulty.Easy]: { stream: 1.25, cost: 0.75, hypeDecay: 0.04, mlRatio: 0.35 },
    [Difficulty.Realistic]: { stream: 1.0, cost: 1.0, hypeDecay: 0.08, mlRatio: 0.22 },
    [Difficulty.Hard]: { stream: 0.75, cost: 1.5, hypeDecay: 0.12, mlRatio: 0.15 },
};

export const RECORDS: Record<string, { message: (title: string, sales?: string) => string }> = {
    firstHot100Entry: { message: (title) => `Congratulations! Your song "${title}" has made its debut on the Official Hot 100 chart!` },
    firstTop10Hit: { message: (title) => `Major milestone! "${title}" has cracked the Top 10 of the Official Hot 100!` },
    firstNo1Hit: { message: (title) => `RECORD BREAKER! You've officially scored your first #1 single on the Official Hot 100 with "${title}"!` },
    firstAlbumEntry: { message: (title) => `Your project "${title}" has officially debuted on the Official Albums 200 chart!` },
    firstNo1Album: { message: (title) => `You're on top of the world! Your album "${title}" has debuted at #1 on the Official Albums 200!` },
    firstGoldSingle: { message: (title) => `Certified Gold! Your single "${title}" has sold over 500,000 units.` },
    firstPlatinumSingle: { message: (title) => `A true smash hit! "${title}" has been certified Platinum, selling over 1,000,000 units!` },
    multiPlatinumSingle: { message: (title, sales) => `Multi-Platinum! "${title}" continues to dominate, now certified ${sales}x Platinum!` },
    diamondSingle: { message: (title) => `A timeless classic! "${title}" has officially been certified DIAMOND, selling over 10,000,000 units!` },
};

export const PROMO_DATA: PromoInfo[] = [
    // Boosts
    { type: 'BottledStreams', title: 'Bottled Streams', description: "Purchase fake streams to boost numbers. High risk of chart removal.", iconPath: "...", category: 'boosts', risk: 'High', baseCost: 10000, durationWeeks: 1, target: 'Song' },
    { type: 'PRScandal', title: 'Fake PR Scandal', description: "Pay to create viral controversy. Drives massive attention but hurts brand image.", iconPath: "...", category: 'boosts', risk: 'Extreme', baseCost: 150000, durationWeeks: 2, target: 'Any' },
    { type: 'BuyingParty', title: 'Buying Party', description: "Organize mass-buy events to spike chart positions. Effective for debut week.", iconPath: "...", category: 'boosts', risk: 'Medium', baseCost: 45000, durationWeeks: 1, target: 'Any' },
    { type: 'PromoBots', title: 'Promo Bots', description: "Unleash bots to spam social media. Quick exposure, high risk of backlash.", iconPath: "...", category: 'boosts', risk: 'High', baseCost: 20000, durationWeeks: 2, target: 'Any' },
    
    // Industry
    { type: 'RadioPayola', title: 'National Radio Push', description: "Pay for national airplay rotation. Essential for Hot 100 dominance.", iconPath: "...", category: 'industry', risk: 'Medium', baseCost: 250000, durationWeeks: 4, target: 'Song' },
    { type: 'PlaylistBribe', title: 'Editorial Placement', description: "Bribe curators for top placement. Massive organic growth.", iconPath: "...", category: 'industry', risk: 'High', baseCost: 500000, durationWeeks: 2, target: 'Song' },
    { type: 'MagazineCover', title: 'Magazine Cover Story', description: "Secure a cover story on a major magazine like Billboard or Rolling Stone.", iconPath: "...", category: 'industry', risk: 'None', baseCost: 125000, durationWeeks: 3, target: 'Album' },
    { type: 'Sponsorship', title: 'Major Brand Deal', description: "Announce a multi-million dollar partnership with a global brand.", iconPath: "...", category: 'industry', risk: 'None', baseCost: 200000, durationWeeks: 4, target: 'Any' },
    { type: 'Sponsorship', title: 'Elite Feature Run', description: "Series of high-profile features on superstar tracks. Massive reputation gain.", iconPath: "...", category: 'industry', risk: 'Low', baseCost: 750000, durationWeeks: 4, target: 'Any' },

    // Organic
    { type: 'StreetTeam', title: 'Global Street Team', description: "Physical promo: flyers, billboards, and pop-up events worldwide.", iconPath: "...", category: 'organic', risk: 'Low', baseCost: 85000, durationWeeks: 6, target: 'Any' },
    { type: 'ListeningParty', title: 'Exclusive Listening', description: "Host a star-studded listening event for critics. Boosts first-week units.", iconPath: "...", category: 'organic', risk: 'Low', baseCost: 65000, durationWeeks: 1, target: 'Album' },
    { type: 'TalkShowCircuit', title: 'Talk Show Circuit', description: "Appear on Fallon, Kimmel, and top podcasts to promote your era.", iconPath: "...", category: 'organic', risk: 'None', baseCost: 110000, durationWeeks: 3, target: 'Album' }
];

export const TV_SHOWS = [
    "Power", "Empire", "Euphoria", "Snowfall", "Atlanta", "Insecure", "Dave", "The Chi", "BMF", "P-Valley", 
    "Bel-Air", "Abbott Elementary", "The Bear", "Succession", "Stranger Things", "The Boys", "Gen V", "Invincible", 
    "Reacher", "The Mandalorian", "Andor", "The Last of Us", "House of the Dragon", "Wednesday", "Yellowstone", 
    "Tulsa King", "Mayor of Kingstown", "Godfather of Harlem", "Wu-Tang: An American Saga", "All American", 
    "Grown-ish", "Black-ish", "Bridgerton", "Squid Game", "Money Heist", "Lupin", "Ted Lasso", "Severance", 
    "Silo", "Foundation", "The Morning Show", "For All Mankind", "Slow Horses", "Hijack", "The Witcher", "You", 
    "Black Mirror", "Outer Banks", "Cobra Kai", "Emily in Paris", "Ginny & Georgia", "The Night Agent", "FUBAR", 
    "Arnold", "One Piece", "Avatar: The Last Airbender", "3 Body Problem", "Fallout", "Shogun", "The Acolyte", 
    "X-Men '97", "Harley Quinn", "The Penguin", "Peacemaker", "The White Lotus", "True Detective", "Fargo", 
    "Hacks", "The Crown", "Heartstopper", "Sex Education", "Elite", "Riverdale", "The Vampire Diaries", 
    "Supernatural", "Grey's Anatomy", "Law & Order: SVU", "NCIS", "CSI: Vegas", "Chicago P.D.", "Chicago Fire", 
    "Blue Bloods", "9-1-1", "The Rookie", "S.W.A.T.", "FBI", "Young Sheldon", "Ghosts", "The Neighborhood", 
    "Bob's Burgers", "Family Guy", "The Simpsons", "Rick and Morty", "South Park", "American Dad!", "Archer", "Big Mouth"
];

export const MOVIES = [
    "Fast & Furious 11", "Bad Boys 5", "Black Panther 3", "Spider-Man: Beyond the Spider-Verse", 
    "Avengers: Secret Wars", "Batman Part II", "Superman: Legacy", "Mission: Impossible 8", 
    "Gladiator 2", "Wicked", "Moana 2", "Frozen 3", "Toy Story 5", "Shrek 5", "Avatar 3", 
    "Tron: Ares", "Minecraft", "Sonic the Hedgehog 3", "Deadpool 3", "Joker: Folie à Deux"
];

export const REVIEW_AUTHORS = [
    "Alphonse Pierre", "Sheldon Pearce", "Matthew Strauss", "Evan Minsker", "Jazz Monroe", 
    "Madison Bloom", "Noah Yoo", "Eric Torres", "Nina Corcoran", "Stephen Kearse"
];

export const PITCHFORK_REVIEWS = {
    low: [
        "A meandering, uninspired effort that fails to justify its existence.",
        "Lacks the focus and charisma that defined their earlier work.",
        "Repetitive beats and lazy lyricism make this a chore to sit through.",
        "A collection of half-baked ideas that never quite coalesce into a song.",
        "Feels like a parody of the genre rather than a contribution to it.",
        "Overproduced and underwhelming, devoid of any real emotion.",
        "Struggles to find a rhythm, stumbling through forgettable verses.",
        "A disappointing misstep in an otherwise promising career.",
        "Sounding tired and derivative, it offers nothing new to the conversation.",
        "Bloated with filler, this project collapses under its own weight.",
        "The production feels dated, and the vocals are uninspired at best.",
        "Attempts to be edgy but comes across as forced and immature.",
        "Lacks any cohesive vision, feeling more like a playlist than an album.",
        "The mixing is muddy, burying what little potential the tracks had.",
        "A forgettable entry that will likely be ignored by history."
    ],
    mid: [
        "A solid if unspectacular release that plays it safe.",
        "Shows flashes of brilliance but is bogged down by inconsistency.",
        "Competent production saves some otherwise lackluster songwriting.",
        "An enjoyable listen, though it lacks the spark of a true classic.",
        "Has its moments, but ultimately fails to leave a lasting impression.",
        "A decent effort that will satisfy fans but unlikely to win new ones.",
        "Production carries the weight here, with lyrics taking a backseat.",
        "Some tracks hit hard, while others feel filler material.",
        "A stepping stone project that shows growth but needs refinement.",
        "Catchy hooks make up for some questionable artistic choices.",
        "Solidly constructed, but missing that special something.",
        "A respectable addition to the discography, if not a standout.",
        "Serviceable background music that lacks depth upon closer listening.",
        "Balances commercial appeal with artistic integrity, with mixed results.",
        "Good for a few spins, but lacks the replay value of their best work."
    ],
    high: [
        "A triumphant return to form, bursting with creativity and energy.",
        "Pushing boundaries and defying expectations, a true masterpiece.",
        "Impeccable production meets razor-sharp lyricism in this instant classic.",
        "A genre-defining record that will influence artists for years to come.",
        "Raw, honest, and beautifully crafted from start to finish.",
        "Captures the zeitgeist perfectly, a soundtrack for the moment.",
        "An ambitious project that succeeds on every level imaginable.",
        "Showcases an artist at the absolute peak of their powers.",
        "Complex, layered, and endlessly rewarding upon repeat listens.",
        "A bold statement piece that demands and commands attention.",
        "Flawless execution of a singular, cohesive artistic vision.",
        "Emotionally resonant and sonically adventurous.",
        "Sets a new standard for what is possible in the genre.",
        "A dazzling display of talent, charisma, and technical skill.",
        "Undeniably brilliant, cementing their legacy as a great.",
        "The sonic palette is lush and expansive, a feast for the ears.",
        "Every track serves a purpose, creating a perfect, skip-free experience.",
        "Daring and innovative, taking risks that pay off spectacularly.",
        "A stunning achievement that resonates on a profound level.",
        "Proof that they are one of the most vital voices in music today."
    ]
};
