
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import type { Player, Song, Playlist } from '../types';

// Access the API key via a safer check to prevent "process is not defined" crashes on some deployment platforms
const getApiKey = () => {
    try {
        return process.env.API_KEY || '';
    } catch (e) {
        return '';
    }
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

/**
 * Sanitizes a string that might contain Markdown code blocks.
 */
const sanitizeJsonString = (str: string): string => {
    // Remove markdown code blocks if present
    return str.replace(/```json\n?|```/g, '').trim();
};

export const generateSongTitle = async (genre: string, mood: string, topic: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a short, catchy, and creative rap song title. The song's genre is ${genre}, the mood is ${mood}, and the topic is ${topic}. Only return the title, nothing else.`,
      config: {
        maxOutputTokens: 20,
        temperature: 0.9,
      }
    });
    const text = response.text;
    if (text) {
      return text.replace(/"/g, '').trim();
    }
    return `Ode to ${topic}`;
  } catch (error) {
    console.error("Error generating song title:", error);
    return `Ode to ${topic}`;
  }
};

export const generateBatchSongTitles = async (count: number): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a list of ${count} creative, realistic rap song titles. The topics can range from love, life, struggles, to success and money. Return ONLY a valid JSON object with a single key "titles" containing an array of strings. Example: {"titles": ["Midnight Drive", "Lost & Found", "Crown Heavy"]}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            titles: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const jsonText = response.text;
    if (jsonText) {
      const sanitized = sanitizeJsonString(jsonText);
      const parsed = JSON.parse(sanitized);
      if (parsed.titles && parsed.titles.length > 0) {
        return parsed.titles;
      }
    }
    throw new Error("Failed to parse titles from API response.");
  } catch (error) {
    console.error("Error generating batch song titles:", error);
    return Array.from({ length: count }, (_, i) => `Fallback Title ${i + 1}`);
  }
};


export const generateMusicFact = async (): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: "Generate a single, interesting, and short fun fact about the music industry. Focus on record-breaking debuts, impressive awards, or incredible achievements by artists like Nicki Minaj, Drake, or Michael Jackson. The fact should be one sentence and ready for display on a loading screen.",
             config: {
                temperature: 0.8,
                maxOutputTokens: 50,
             }
        });
        const text = response.text;
        if (text) {
            return text.trim();
        }
        return "Music has the power to bring people together from all walks of life.";
    } catch (error) {
        console.error("Error generating music fact:", error);
        return "Music has the power to bring people together from all walks of life.";
    }
}

export const generateIndustryEvent = async (player: Player): Promise<{ title: string; description: string }> => {
  const events = [
    { title: "Static on the Airwaves", description: "Industry insiders are buzzing about a potential distributor shift. Expect minor market fluctuations." },
    { title: "Network Disruption", description: "A major streaming service is reporting server stress after a surprise legend drop. Data syncing might feel sluggish this week." },
    { title: "Corporate Reshuffle", description: "Rumors of a massive label merger are sending ripples through the boardroom. Contracts are being reviewed globally." },
    { title: "Global Consumption Surge", description: "Streaming platforms are seeing a massive spike in user engagement across European territories today." },
    { title: "Festival Season Approach", description: "Promoters are quietly drafting high-stakes contracts for the upcoming summer circuit. The big players are already moving." },
    { title: "Viral Algorithm Shift", description: "Social media engineers just pushed an update that favors short-form loops. The charts are starting to reflect the chaos." }
  ];
  return events[Math.floor(Math.random() * events.length)];
};

export const generateImage = async (prompt: string): Promise<string | null> => {
    return `https://source.unsplash.com/400x400/?${encodeURIComponent(prompt)}`;
}

export const generatePlaylists = async (player: Player, songs: Song[]): Promise<Playlist[]> => {
    const mainGenre = songs.length > 0 ? songs[0].genre : 'Rap';

    const prompt = `You are a creative director for a music streaming service called "Rapify".
    An artist named ${player.artistName} is gaining traction. Their main genre is ${mainGenre} and their reputation is currently ${player.reputation}/100.
    Generate 3 creative, authentic-sounding playlists where their music might be featured.
    For each playlist, provide:
    1. A 'name' (e.g., "Street Sermons", "Chrome & Concrete").
    2. A short, engaging one-sentence 'description'.
    3. A 'type': 'Editorial' (curated by Rapify editors, high impact), 'Algorithmic' (generated for users based on listening habits), or 'Fanmade' (created by a fan, lower impact). Base the type on the artist's reputation - higher rep artists get more editorial placements.
    4. A 'coverArtPrompt': a short, descriptive prompt for an AI image generator to create the cover art. The prompt should be aesthetic and match the playlist's vibe.
    Return ONLY JSON.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        playlists: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    description: { type: Type.STRING },
                                    type: { type: Type.STRING },
                                    coverArtPrompt: { type: Type.STRING }
                                }
                            }
                        }
                    }
                }
            },
        });
        
        const jsonText = response.text;
        if (jsonText) {
          const sanitized = sanitizeJsonString(jsonText);
          const parsed = JSON.parse(sanitized);
          const generatedPlaylists: Playlist[] = [];

          for (const [index, p] of parsed.playlists.entries()) {
             const coverArt = `https://source.unsplash.com/400x400/?${encodeURIComponent(p.coverArtPrompt)}`;
             generatedPlaylists.push({
                 id: `pl_${Date.now()}_${index}`,
                 name: p.name,
                 description: p.description,
                 type: (['Editorial', 'Algorithmic', 'Fanmade'].includes(p.type) ? p.type : 'Fanmade') as Playlist['type'],
                 coverArtPrompt: p.coverArtPrompt,
                 coverArt: coverArt,
                 coverArtSeed: p.name.replace(/\s/g, ''),
                 songIds: [],
             });
          }
          return generatedPlaylists;
        }

        throw new Error("API returned an empty response for playlists.");

    } catch (error) {
        console.error("Error generating playlists:", error);
        const defaultPlaylistsData: Omit<Playlist, 'coverArt'>[] = [
            { id: 'pl_err_1', name: "New Wave Rap", description: "The freshest tracks from rising stars.", coverArtSeed: "NewWave", type: 'Editorial', coverArtPrompt: 'ocean wave made of chrome', songIds: [] },
            { id: 'pl_err_2', name: `${mainGenre} Essentials`, description: `The definitive collection of ${mainGenre}.`, coverArtSeed: "Essentials", type: 'Algorithmic', coverArtPrompt: 'minimalist sound wave graphic', songIds: [] },
            { id: 'pl_err_3', name: "Lyrical Lemonade", description: "Curated by the culture.", coverArtSeed: "Lyrical", type: 'Editorial', coverArtPrompt: 'a lemon with headphones on', songIds: [] }
        ];
        
        const generatedDefaultPlaylists: Playlist[] = [];
        for (const p of defaultPlaylistsData) {
            const coverArt = `https://source.unsplash.com/400x400/?${encodeURIComponent(p.coverArtPrompt)}`;
            generatedDefaultPlaylists.push({
                ...p,
                coverArt,
            });
        }

        return generatedDefaultPlaylists;
    }
};
