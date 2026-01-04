import React from 'react';
import type { YearlySummaryData, Notification } from '../types';

interface YearlySummaryModalProps {
    summary: YearlySummaryData;
    onClose: () => void;
}

const StatCard: React.FC<{ label: string, value: string, delta?: number, isMoney?: boolean }> = ({ label, value, delta, isMoney }) => {
    const deltaColor = delta === undefined ? '' : delta >= 0 ? 'text-green-400' : 'text-red-400';
    const formatDelta = () => {
        if (delta === undefined) return '';
        const sign = delta >= 0 ? '+' : '';
        return `(${sign}${isMoney ? '$' : ''}${delta.toLocaleString()})`;
    }
    return (
        <div className="bg-brand-surface p-3 rounded-lg text-center">
            <p className="text-sm text-brand-text-muted">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
            {delta !== undefined && <p className={`text-sm font-semibold ${deltaColor}`}>{formatDelta()}</p>}
        </div>
    );
};

const RecordItem: React.FC<{ notification: Notification }> = ({ notification }) => (
    <div className="border-l-4 border-yellow-400 pl-3 py-1">
        <p className="text-sm">{notification.message}</p>
        <p className="text-xs text-brand-text-muted">{new Date(notification.date).toLocaleDateString()}</p>
    </div>
);

const YearlySummaryModal: React.FC<YearlySummaryModalProps> = ({ summary, onClose }) => {
    const { year, initialPlayerState, finalPlayerState, topSongsByStreams, topAlbumByUnits, newRecords } = summary;
    const netWorthChange = finalPlayerState.money - initialPlayerState.money;
    const reputationChange = finalPlayerState.reputation - initialPlayerState.reputation;
    const listenersChange = finalPlayerState.monthlyListeners - initialPlayerState.monthlyListeners;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50" onClick={onClose}>
            <div className="bg-brand-dialog w-full max-w-2xl rounded-xl p-6 shadow-2xl border border-brand-accent-start/30 animate-fade-in-up max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold">Yearly Rewind</h2>
                    <p className="text-xl font-semibold text-brand-text-muted">{year}</p>
                </div>

                <div className="space-y-6">
                    {/* Section: Overall Progress */}
                    <section>
                        <h3 className="text-xl font-semibold mb-3 border-b border-brand-surface pb-2">Overall Progress</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <StatCard label="Net Worth" value={`$${finalPlayerState.money.toLocaleString()}`} delta={netWorthChange} isMoney />
                            <StatCard label="Reputation" value={`${finalPlayerState.reputation}/100`} delta={reputationChange} />
                            <StatCard label="Monthly Listeners" value={finalPlayerState.monthlyListeners.toLocaleString()} delta={listenersChange} />
                        </div>
                    </section>

                    {/* Section: Top Performers */}
                    <section>
                        <h3 className="text-xl font-semibold mb-3 border-b border-brand-surface pb-2">Top Performers</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-bold text-center text-brand-text-muted mb-2">Top Songs (by Streams Gained)</h4>
                                <div className="space-y-2">
                                    {topSongsByStreams.map(song => (
                                        <div key={song.title} className="bg-brand-surface p-2 rounded-lg flex items-center gap-3">
                                            <img src={song.coverArt || `https://source.unsplash.com/100x100/?${encodeURIComponent(song.title)}`} alt={song.title} className="w-12 h-12 rounded-md object-cover"/>
                                            <div>
                                                <p className="font-bold truncate">{song.title}</p>
                                                <p className="text-sm text-green-400">+{song.streamsGained.toLocaleString()} streams</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                             <div>
                                <h4 className="font-bold text-center text-brand-text-muted mb-2">Top Album (by Units Gained)</h4>
                                {topAlbumByUnits ? (
                                    <div className="bg-brand-surface p-2 rounded-lg flex items-center gap-3">
                                        <img src={topAlbumByUnits.coverArt || `https://source.unsplash.com/100x100/?${encodeURIComponent(topAlbumByUnits.title)}`} alt={topAlbumByUnits.title} className="w-12 h-12 rounded-md object-cover"/>
                                        <div>
                                            <p className="font-bold truncate">{topAlbumByUnits.title}</p>
                                            <p className="text-sm text-green-400">+{topAlbumByUnits.unitsGained.toLocaleString()} units</p>
                                        </div>
                                    </div>
                                ) : <p className="text-sm text-center text-brand-text-muted">No new album sales.</p>}
                            </div>
                        </div>
                    </section>

                    {/* Section: Records & Achievements */}
                    {newRecords.length > 0 && (
                        <section>
                            <h3 className="text-xl font-semibold mb-3 border-b border-brand-surface pb-2">Records & Achievements</h3>
                            <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                                {newRecords.map(record => <RecordItem key={record.id} notification={record} />)}
                            </div>
                        </section>
                    )}
                </div>

                <div className="flex justify-end mt-8">
                    <button onClick={onClose} className="bg-gradient-to-r from-brand-accent-start to-brand-accent-end text-white font-bold py-2 px-6 rounded-md hover:opacity-90">
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default YearlySummaryModal;