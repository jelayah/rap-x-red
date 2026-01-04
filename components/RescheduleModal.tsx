import React, { useState, useMemo } from 'react';
import type { Song, Album } from '../types';

const getFridaysForYear = (year: number, gameDate: Date): Date[] => {
    const fridays: Date[] = [];
    const date = new Date(gameDate); // Start from the current game date
    
    // Find the next Friday
    while (date.getDay() !== 5) {
        date.setDate(date.getDate() + 1);
    }

    const endDate = new Date(year + 1, 0, 1); // Go until the end of the current year

    while (date < endDate) {
        fridays.push(new Date(date));
        date.setDate(date.getDate() + 7);
    }
    return fridays;
};

interface RescheduleModalProps {
    item: Song | Album;
    onClose: () => void;
    onReschedule: (item: Song | Album, newDate: Date) => void;
    gameDate: Date;
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({ item, onClose, onReschedule, gameDate }) => {
    const [newDate, setNewDate] = useState<Date | null>(null);
    const fridays = useMemo(() => getFridaysForYear(gameDate.getFullYear(), gameDate), [gameDate]);

    const handleConfirm = () => {
        if (newDate) {
            onReschedule(item, newDate);
        } else {
            alert('Please select a new release date.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-brand-dialog w-full max-w-2xl rounded-xl p-6 shadow-2xl border border-brand-surface">
                <h2 className="text-2xl font-bold mb-4">Reschedule Release</h2>
                <p>Item: <span className="font-semibold">{item.title}</span></p>
                <p className="text-sm text-brand-text-muted mb-4">Current Date: {new Date(item.scheduledReleaseDate!).toLocaleDateString()}</p>

                <h3 className="font-semibold mb-2">Select a new Friday release date:</h3>
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 max-h-60 overflow-y-auto pr-2">
                    {fridays.map((friday) => (
                        <button
                            key={friday.toISOString()}
                            onClick={() => setNewDate(friday)}
                            className={`p-2 rounded-md text-center transition-colors ${newDate?.getTime() === friday.getTime() ? 'bg-brand-primary-end' : 'bg-brand-surface hover:bg-brand-dialog'}`}
                        >
                            <p className="text-xs font-semibold">{friday.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                        </button>
                    ))}
                </div>

                <div className="flex justify-end gap-4 mt-6">
                    <button onClick={onClose} className="bg-brand-surface text-white py-2 px-6 rounded-md hover:opacity-80">Cancel</button>
                    <button onClick={handleConfirm} disabled={!newDate} className="bg-green-600 text-white font-bold py-2 px-6 rounded-md hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed">Confirm New Date</button>
                </div>
            </div>
        </div>
    );
};

export default RescheduleModal;
