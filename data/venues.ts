
import type { Venue } from '../types';

export const VENUES: Venue[] = [
    // --- North America ---
    { id: 'v_na_1', type: 'Bar', name: 'The Viper Room', city: 'Los Angeles', region: 'North America', capacity: 250, bookingCost: 500, listenerRequirement: 0 },
    { id: 'v_na_2', type: 'Bar', name: 'Knitting Factory', city: 'New York', region: 'North America', capacity: 300, bookingCost: 700, listenerRequirement: 0 },
    { id: 'v_na_3', type: 'Theater', name: 'The Fillmore', city: 'San Francisco', region: 'North America', capacity: 1315, bookingCost: 5000, listenerRequirement: 50000 },
    { id: 'v_na_4', type: 'Theater', name: 'Apollo Theater', city: 'New York', region: 'North America', capacity: 1506, bookingCost: 8000, listenerRequirement: 75000 },
    { id: 'v_na_5', type: 'Theater', name: 'Tabernacle', city: 'Atlanta', region: 'North America', capacity: 2600, bookingCost: 12000, listenerRequirement: 100000 },
    { id: 'v_na_6', type: 'Theater', name: 'House of Blues', city: 'Houston', region: 'North America', capacity: 1800, bookingCost: 9000, listenerRequirement: 80000 },
    { id: 'v_na_7', type: 'Arena', name: 'Madison Square Garden', city: 'New York', region: 'North America', capacity: 20789, bookingCost: 150000, listenerRequirement: 1000000 },
    { id: 'v_na_8', type: 'Arena', name: 'Crypto.com Arena', city: 'Los Angeles', region: 'North America', capacity: 20000, bookingCost: 140000, listenerRequirement: 1000000 },
    { id: 'v_na_9', type: 'Arena', name: 'United Center', city: 'Chicago', region: 'North America', capacity: 23500, bookingCost: 155000, listenerRequirement: 1200000 },
    { id: 'v_na_10', type: 'Stadium', name: 'SoFi Stadium', city: 'Los Angeles', region: 'North America', capacity: 70240, bookingCost: 1000000, listenerRequirement: 10000000 },
    { id: 'v_na_11', type: 'Stadium', name: 'MetLife Stadium', city: 'New York', region: 'North America', capacity: 82500, bookingCost: 1200000, listenerRequirement: 12000000 },
    { id: 'v_na_12', type: 'Theater', name: 'Sony Centre', city: 'Toronto', region: 'North America', capacity: 3191, bookingCost: 15000, listenerRequirement: 150000 },
    { id: 'v_na_13', type: 'Arena', name: 'Scotiabank Arena', city: 'Toronto', region: 'North America', capacity: 19800, bookingCost: 120000, listenerRequirement: 1100000 },
    { id: 'v_na_14', type: 'Theater', name: 'The Jackie Gleason', city: 'Miami', region: 'North America', capacity: 2713, bookingCost: 13000, listenerRequirement: 120000 },

    // --- Europe ---
    { id: 'v_eu_1', type: 'Bar', name: 'Supersonic', city: 'Paris', region: 'Europe', capacity: 200, bookingCost: 600, listenerRequirement: 10000 },
    { id: 'v_eu_2', type: 'Theater', name: 'Bataclan', city: 'Paris', region: 'Europe', capacity: 1500, bookingCost: 10000, listenerRequirement: 150000 },
    { id: 'v_eu_3', type: 'Arena', name: 'The O2 Arena', city: 'London', region: 'Europe', capacity: 20000, bookingCost: 160000, listenerRequirement: 1500000 },
    { id: 'v_eu_4', type: 'Stadium', name: 'Wembley Stadium', city: 'London', region: 'Europe', capacity: 90000, bookingCost: 1500000, listenerRequirement: 15000000 },
    { id: 'v_eu_5', type: 'Arena', name: 'Accor Arena', city: 'Paris', region: 'Europe', capacity: 20300, bookingCost: 170000, listenerRequirement: 1800000 },
    { id: 'v_eu_6', type: 'Theater', name: 'Victoria Warehouse', city: 'Manchester', region: 'Europe', capacity: 3500, bookingCost: 18000, listenerRequirement: 200000 },
    { id: 'v_eu_7', type: 'Theater', name: 'Huxleys Neue Welt', city: 'Berlin', region: 'Europe', capacity: 1600, bookingCost: 9500, listenerRequirement: 100000 },
    { id: 'v_eu_8', type: 'Bar', name: 'Pacha Ibiza', city: 'Ibiza', region: 'Europe', capacity: 3000, bookingCost: 25000, listenerRequirement: 300000 },

    // --- Asia ---
    { id: 'v_as_1', type: 'Bar', name: 'Shibuya Understage', city: 'Tokyo', region: 'Asia', capacity: 150, bookingCost: 900, listenerRequirement: 20000 },
    { id: 'v_as_2', type: 'Stadium', name: 'Tokyo Dome', city: 'Tokyo', region: 'Asia', capacity: 55000, bookingCost: 1800000, listenerRequirement: 20000000 },
    { id: 'v_as_3', type: 'Arena', name: 'KSPO Dome', city: 'Seoul', region: 'Asia', capacity: 15000, bookingCost: 95000, listenerRequirement: 900000 },
    { id: 'v_as_4', type: 'Arena', name: 'AsiaWorld-Expo', city: 'Hong Kong', region: 'Asia', capacity: 14000, bookingCost: 85000, listenerRequirement: 850000 },

    // --- Africa ---
    { id: 'v_af_1', type: 'Bar', name: 'The Shrine', city: 'Lagos', region: 'Africa', capacity: 500, bookingCost: 400, listenerRequirement: 15000 },
    { id: 'v_af_2', type: 'Stadium', name: 'FNB Stadium', city: 'Johannesburg', region: 'Africa', capacity: 94736, bookingCost: 1200000, listenerRequirement: 5000000 },
    { id: 'v_af_3', type: 'Theater', name: 'Terra Kulture', city: 'Lagos', region: 'Africa', capacity: 400, bookingCost: 5000, listenerRequirement: 40000 },
    { id: 'v_af_4', type: 'Arena', name: 'Eko Arena', city: 'Lagos', region: 'Africa', capacity: 6000, bookingCost: 45000, listenerRequirement: 500000 },

    // --- South America ---
    { id: 'v_sa_1', type: 'Arena', name: 'Allianz Parque', city: 'Sao Paulo', region: 'South America', capacity: 45000, bookingCost: 350000, listenerRequirement: 3000000 },
    { id: 'v_sa_2', type: 'Stadium', name: 'Estadio Azteca', city: 'Mexico City', region: 'South America', capacity: 87523, bookingCost: 1100000, listenerRequirement: 8000000 },
    { id: 'v_sa_3', type: 'Theater', name: 'Teatro Gran Rex', city: 'Buenos Aires', region: 'South America', capacity: 3262, bookingCost: 20000, listenerRequirement: 250000 },

    // --- Oceania ---
    { id: 'v_oc_1', type: 'Theater', name: 'Enmore Theatre', city: 'Sydney', region: 'Oceania', capacity: 2500, bookingCost: 11000, listenerRequirement: 120000 },
    { id: 'v_oc_2', type: 'Arena', name: 'Rod Laver Arena', city: 'Melbourne', region: 'Oceania', capacity: 14820, bookingCost: 90000, listenerRequirement: 800000 },
];
