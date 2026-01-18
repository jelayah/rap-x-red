
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import type { Player, Song, Playlist } from '../types';

// Lazy initialize to prevent boot crashes if environment variables are evaluated too early
let aiInstance: any = null;
const getAI = () => {
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return aiInstance;
};

const sanitizeJsonString = (str: string): string => {
    return str.replace(/```json\n?|```/g, '').trim();
};

export const generateSongTitle = async (genre: string, mood: string, topic: string): Promise<string> => {
  try {
    const ai = getAI();
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
    return `Session ${topic}`;
  } catch (error) {
    console.error("Error generating song title:", error);
    return `Session ${topic}`;
  }
};

export const generateBatchSongTitles = async (count: number): Promise<string[]> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a list of ${count} creative, realistic rap song titles. Return ONLY a valid JSON object with a single key "titles" containing an array of strings.`,
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
    throw new Error("Failed to parse titles.");
  } catch (error) {
    console.warn("Gemini batch failed, using fallbacks.");
    return Array.from({ length: count }, (_, i) => `Industry Session #${i + 1}`);
  }
};

export const generateMusicFact = async (): Promise<string> => {
    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: "Generate a single, interesting, and short fun fact about the music industry achievements. One sentence.",
             config: {
                temperature: 0.8,
                maxOutputTokens: 50,
             }
        });
        const text = response.text;
        return text ? text.trim() : "The record for most weeks at #1 is constantly being challenged.";
    } catch (error) {
        return "The Billboard charts have tracked hits for decades.";
    }
}

export const generateIndustryEvent = async (player: Player): Promise<{ title: string; description: string }> => {
  const events = [
    { title: "Static on the Airwaves", description: "Industry insiders are buzzing about a potential distributor shift. Expect minor market fluctuations." },
    { title: "Network Disruption", description: "A major streaming service is reporting server stress after a surprise legend drop. Data syncing might feel sluggish this week." },
    { title: "Corporate Reshuffle", description: "Rumors of a massive label merger are sending ripples through the boardroom. Contracts are being reviewed globally." },
    { title: "Global Consumption Surge", description: "Streaming platforms are seeing a massive spike in user engagement across European territories today." }
  ];
  return events[Math.floor(Math.random() * events.length)];
};

export const generatePlaylists = async (player: Player, songs: Song[]): Promise<Playlist[]> => {
    const mainGenre = songs.length > 0 ? songs[0].genre : 'Rap';
    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Generate 3 creative playlists for Rapify for ${player.artistName}. Return ONLY JSON.`,
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
          return parsed.playlists.map((p: any, index: number) => ({
                 id: `pl_${Date.now()}_${index}`,
                 name: p.name,
                 description: p.description,
                 type: (['Editorial', 'Algorithmic', 'Fanmade'].includes(p.type) ? p.type : 'Fanmade') as Playlist['type'],
                 coverArtPrompt: p.coverArtPrompt,
                 coverArt: `https://source.unsplash.com/400x400/?${encodeURIComponent(p.coverArtPrompt)}`,
                 coverArtSeed: p.name.replace(/\s/g, ''),
                 songIds: [],
          }));
        }
        throw new Error("Empty response");
    } catch (error) {
        return [
            { id: 'pl_err_1', name: "New Wave Rap", description: "The freshest tracks.", coverArtSeed: "NW", type: 'Editorial', coverArtPrompt: 'chrome', songIds: [], coverArt: 'https://source.unsplash.com/400x400/?chrome' },
            { id: 'pl_err_2', name: `${mainGenre} Essentials`, description: `The definitive collection.`, coverArtSeed: "ESS", type: 'Algorithmic', coverArtPrompt: 'soundwave', songIds: [], coverArt: 'https://source.unsplash.com/400x400/?soundwave' },
            { id: 'pl_err_3', name: "Lyrical Lemonade", description: "Curated by the culture.", coverArtSeed: "LYR", type: 'Editorial', coverArtPrompt: 'lemon', songIds: [], coverArt: 'https://source.unsplash.com/400x400/?lemon' }
        ];
    }
};
