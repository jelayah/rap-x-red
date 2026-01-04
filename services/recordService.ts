
import type { Player, Song, Album, ChartData, Notification, GameStateBundle, Certification } from '../types';
import { RECORDS } from '../constants';

const STREAM_UNIT_DIVISOR = 1500;

const CERTIFICATION_TIERS = [
    { threshold: 10000000, level: 'Diamond', id: 'diamond' },
    { threshold: 9000000, level: 'Multi-Platinum', multiplier: 9, id: '9x_platinum' },
    { threshold: 8000000, level: 'Multi-Platinum', multiplier: 8, id: '8x_platinum' },
    { threshold: 7000000, level: 'Multi-Platinum', multiplier: 7, id: '7x_platinum' },
    { threshold: 6000000, level: 'Multi-Platinum', multiplier: 6, id: '6x_platinum' },
    { threshold: 5000000, level: 'Multi-Platinum', multiplier: 5, id: '5x_platinum' },
    { threshold: 4000000, level: 'Multi-Platinum', multiplier: 4, id: '4x_platinum' },
    { threshold: 3000000, level: 'Multi-Platinum', multiplier: 3, id: '3x_platinum' },
    { threshold: 2000000, level: 'Multi-Platinum', multiplier: 2, id: '2x_platinum' },
    { threshold: 1000000, level: 'Platinum', id: 'platinum' },
    { threshold: 500000, level: 'Gold', id: 'gold' },
];

const getRecordMessage = (level: string, multiplier: number | undefined, title: string, itemType: 'Single' | 'Album'): string => {
    const messageTemplate = level === 'Diamond' ? RECORDS.diamondSingle :
                            level === 'Multi-Platinum' ? RECORDS.multiPlatinumSingle :
                            level === 'Platinum' ? RECORDS.firstPlatinumSingle :
                            RECORDS.firstGoldSingle;
    
    let message = messageTemplate.message(title, multiplier?.toString());
    
    if (!message.toLowerCase().includes('album') && !message.toLowerCase().includes('single')) {
         message = message.replace('units.', `units as a ${itemType.toLowerCase()}.`);
    } else {
        message = message.replace(/single|album/i, itemType.toLowerCase());
    }

    return message;
}

export const updateCertifications = (
    state: GameStateBundle,
): { updatedSongs: Song[], updatedAlbums: Album[], newNotifications: Notification[] } => {
    const newNotifications: Notification[] = [];
    const updatedSongs: Song[] = JSON.parse(JSON.stringify(state.songs));
    const updatedAlbums: Album[] = JSON.parse(JSON.stringify(state.albums));

    const processItem = (item: Song | Album) => {
        const isSong = 'quality' in item;
        let totalUnits: number;

        if (isSong) {
            const song = item as Song;
            const totalStreams = song.rapifyStreams + song.rappleStreams;
            totalUnits = song.sales + Math.floor(totalStreams / STREAM_UNIT_DIVISOR);
        } else {
            const album = item as Album;
            const albumSongs = updatedSongs.filter(s => s.albumId === album.id);
            const totalStreams = albumSongs.reduce((acc, s) => acc + s.rapifyStreams + s.rappleStreams, 0);
            const streamUnits = Math.floor(totalStreams / STREAM_UNIT_DIVISOR);
            const teaUnits = Math.floor(albumSongs.reduce((acc, s) => acc + s.sales, 0) / 10);
            totalUnits = album.pureSales + streamUnits + teaUnits;
        }

        const existingCerts = new Set(item.certifications.map(c => c.units));

        for (const tier of CERTIFICATION_TIERS) {
            if (totalUnits >= tier.threshold && !existingCerts.has(tier.threshold)) {
                
                const newCert: Certification = {
                    level: tier.level as any,
                    units: tier.threshold,
                    date: new Date(state.gameDate),
                    multiplier: tier.multiplier
                };
                
                item.certifications.push(newCert);
                existingCerts.add(tier.threshold);

                const message = getRecordMessage(tier.level, tier.multiplier, item.title, isSong ? 'Single' : 'Album');
                newNotifications.push({
                    id: `cert_${tier.id}_${item.id}`,
                    message: message,
                    type: 'Record',
                    date: new Date(state.gameDate),
                });
            }
        }
        item.certifications.sort((a,b) => a.units - b.units);
    };

    updatedSongs.forEach(processItem);
    updatedAlbums.forEach(processItem);

    return { updatedSongs, updatedAlbums, newNotifications };
};
