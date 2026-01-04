import React, { useState } from 'react';
import type { Song } from '../types';

interface DiscountModalProps {
    song: Song;
    onClose: () => void;
    onDiscount: (song: Song, newPrice: number) => void;
}

const DiscountModal: React.FC<DiscountModalProps> = ({ song, onClose, onDiscount }) => {
    const [newPrice, setNewPrice] = useState(0.99);
    const priceOptions = [0.99, 0.69, 0.29];

    const handleConfirm = () => {
        onDiscount(song, newPrice);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-brand-dialog w-full max-w-md rounded-xl p-6 shadow-2xl border border-brand-surface">
                <h2 className="text-2xl font-bold mb-2">Discount Single</h2>
                <p className="text-brand-text-muted mb-4">Current Price: ${song.price.toFixed(2)}</p>

                <div className="space-y-2">
                    {priceOptions.map(price => (
                        <button 
                            key={price}
                            onClick={() => setNewPrice(price)}
                            className={`w-full p-3 rounded-md text-left transition-colors text-white ${newPrice === price ? 'bg-gradient-to-r from-brand-primary-start to-brand-primary-end font-bold' : 'bg-brand-surface hover:bg-brand-dialog'}`}
                        >
                            Set price to ${price.toFixed(2)}
                        </button>
                    ))}
                </div>
                
                <p className="text-xs text-yellow-400 mt-4">
                    Discounting a single can provide a temporary boost to sales units, which may help with chart positions.
                </p>

                <div className="flex justify-end gap-4 mt-6">
                    <button onClick={onClose} className="bg-brand-surface text-white py-2 px-6 rounded-md hover:opacity-80">Cancel</button>
                    <button onClick={handleConfirm} className="bg-green-600 text-white font-bold py-2 px-6 rounded-md hover:bg-green-500">Confirm Discount</button>
                </div>
            </div>
        </div>
    );
};

export default DiscountModal;
