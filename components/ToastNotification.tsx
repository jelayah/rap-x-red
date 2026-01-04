
import React, { useEffect, useState } from 'react';
import type { Notification } from '../types';

interface ToastNotificationProps {
    notification: Notification;
    onClose: () => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ notification, onClose }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Trigger enter animation
        requestAnimationFrame(() => setVisible(true));

        const timer = setTimeout(() => {
            setVisible(false);
            // Wait for exit animation to finish before unmounting
            setTimeout(onClose, 300);
        }, 5000);

        return () => clearTimeout(timer);
    }, [notification, onClose]);

    const getStyles = () => {
        switch (notification.type) {
            case 'Record': return 'bg-yellow-500 text-black border-yellow-300';
            case 'Scandal': return 'bg-red-600 text-white border-red-400';
            case 'Debut': return 'bg-purple-600 text-white border-purple-400';
            case 'Chart': return 'bg-blue-600 text-white border-blue-400';
            case 'Sales': return 'bg-green-600 text-white border-green-400';
            default: return 'bg-[#222] text-white border-gray-600';
        }
    };

    const getIcon = () => {
        switch (notification.type) {
            case 'Record': return '🏆';
            case 'Scandal': return '🚨';
            case 'Debut': return '🚀';
            case 'Chart': return '📈';
            case 'Sales': return '💰';
            case 'Tour': return '🌍';
            default: return '🔔';
        }
    };

    return (
        <div 
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] w-[90%] max-w-md p-4 rounded-xl shadow-2xl border flex items-start gap-4 transition-all duration-300 ease-out ${getStyles()} ${visible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}`}
        >
            <div className="text-2xl">{getIcon()}</div>
            <div className="flex-1">
                <p className="font-bold text-sm uppercase opacity-90">{notification.type} Alert</p>
                <p className="font-semibold text-sm leading-tight mt-1">{notification.message}</p>
            </div>
            <button onClick={() => setVisible(false)} className="opacity-70 hover:opacity-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

export default ToastNotification;
