
import React, { useState, useEffect, useMemo } from 'react';
import type { Player, Song, Album, Tour, Tweet, ChartData, SocialPost } from '../types';
import { generateXFeed } from '../services/socialMediaService';
import StreamSnapshot from '../components/StreamSnapshot';

interface XScreenProps {
    player: Player;
    setPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
    songs: Song[];
    albums: Album[];
    tours: Tour[];
    chartsData: ChartData;
    gameDate: Date;
    onBack: () => void;
}

const formatNumber = (num: number | undefined | null) => {
    const val = typeof num === 'number' ? num : 0;
    if (val >= 1000000000) return `${(val / 1000000000).toFixed(1)}B`;
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
    return val.toLocaleString();
};

const ComposeTweetModal: React.FC<{ 
    onClose: () => void; 
    onTweet: (content: string, media?: string, quote?: Tweet) => void;
    quotingTweet?: Tweet | null;
}> = ({ onClose, onTweet, quotingTweet }) => {
    const [content, setContent] = useState('');
    const [media, setMedia] = useState<string | null>(null);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setMedia(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-[200] flex items-start justify-center pt-10 px-4 backdrop-blur-md">
            <div className="bg-black w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-[#2f3336] animate-fade-in-up">
                <div className="flex justify-between items-center mb-8">
                    <button onClick={onClose} className="text-white font-bold text-sm">Cancel</button>
                    <button 
                        onClick={() => { if(content.trim()) onTweet(content, media || undefined, quotingTweet || undefined); }} 
                        className="bg-white text-black font-black px-6 py-2 rounded-full disabled:opacity-50 text-sm uppercase tracking-tighter"
                        disabled={!content.trim()}
                    >
                        {quotingTweet ? 'Quote' : 'Post'}
                    </button>
                </div>
                <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#16181c] flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                        <textarea 
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder={quotingTweet ? "Add a comment..." : "What is happening?!"}
                            className="w-full bg-transparent text-xl text-white placeholder-gray-600 focus:outline-none resize-none h-32"
                            autoFocus
                        />
                        {quotingTweet && (
                            <div className="mt-2 rounded-2xl border border-[#2f3336] p-3 space-y-1 bg-white/[0.03]">
                                <div className="flex items-center gap-2 mb-1">
                                    <img src={quotingTweet.author.avatarSeed.startsWith('http') ? quotingTweet.author.avatarSeed : 'https://source.unsplash.com/100x100/?portrait'} className="w-5 h-5 rounded-full object-cover" />
                                    <span className="font-black text-xs text-white">{quotingTweet.author.name}</span>
                                    {quotingTweet.author.isVerified && <svg viewBox="0 0 22 22" className="w-3.5 h-3.5 text-[#1d9bf0] fill-current"><g><path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.056-.75-1.69-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.9-.14-.635.13-1.22.436-1.69.882-.445.47-.75 1.055-.882 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.44 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.355.54.854.97 1.44 1.245-.224.606-.274 1.263-.144 1.896.13.634.437 1.218.882 1.687.47.445.1054.75 1.69.882.633.132 1.29.084 1.897-.138.274.586.705 1.086 1.246 1.44.54.354 1.17.553 1.816.572.647-.02 1.275-.217 1.817-.573.54-.356.97-.854 1.245-1.44.604.224 1.263.272 1.896.14.634-.13.122-.436.169-.882.445-.47.75-1.054.882-1.688.13-.633.08-1.29-.14-1.896.586-.274 1.086-.705 1.44-1.245.355-.54.553-1.17.572-1.816zM9.662 14.85l-3.428-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"></path></g></svg>}
                                </div>
                                <p className="text-sm text-gray-400 line-clamp-2 leading-normal">{quotingTweet.content}</p>
                            </div>
                        )}
                        {media && (
                            <div className="relative mt-4 rounded-2xl overflow-hidden border border-[#2f3336]">
                                <img src={media} className="w-full h-full object-cover" />
                                <button onClick={() => setMedia(null)} className="absolute top-3 right-3 bg-black/70 p-1.5 rounded-full backdrop-blur-md hover:bg-red-500 transition-colors">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="white"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2.5}/></svg>
                                </button>
                            </div>
                        )}
                        <div className="mt-6 pt-4 border-t border-[#16181c] flex items-center">
                            <label className="p-2.5 text-[#1d9bf0] hover:bg-[#1d9bf0]/10 rounded-full cursor-pointer transition-colors">
                                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><g><path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3L5 17.414V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z"></path></g></svg>
                                <input type="file" className="hidden" accept="image/*" onChange={handleFile} />
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TweetComponent: React.FC<{ tweet: Tweet, artistName: string, gameDate: Date, onQuote: (t: Tweet) => void }> = ({ tweet, artistName, gameDate, onQuote }) => {
    const { author, content, media, timestamp, views, comments, retweets, likes, statsData, quotedTweet } = tweet;

    const highlightMentions = (text: string) => {
        const artistMention = `@${artistName.replace(/\s/g, '')}`;
        return text.split('\n').map((line, i) => (
            <p key={i} className="whitespace-pre-wrap leading-relaxed">
                {line.split(' ').map((word, j) => 
                    word.toLowerCase() === artistMention.toLowerCase() 
                    ? <span key={j} className="text-[#1d9bf0] font-medium">{word} </span> 
                    : `${word} `
                )}
            </p>
        ));
    };

    const timeSince = (date: Date | string) => {
        const dateObj = new Date(date);
        const nowObj = new Date(gameDate);
        const seconds = Math.floor((nowObj.getTime() - dateObj.getTime()) / 1000);
        
        if (seconds < 10) return "Just Now";
        if (seconds < 60) return `${seconds}s`;
        
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m`;
        
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h`;
        
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d`;
        
        const weeks = Math.floor(days / 7);
        if (weeks < 4) return `${weeks}w ago`;
        
        const months = Math.floor(days / 30);
        if (months < 12) return `${months}mo ago`;
        
        const years = Math.floor(days / 365);
        return `${years}y ago`;
    }

    const pfpSrc = (author.avatarSeed.startsWith('data:image') || author.avatarSeed.startsWith('http'))
        ? author.avatarSeed 
        : `https://source.unsplash.com/100x100/?portrait`;

    return (
        <div className="px-4 py-4 border-b border-[#16181c] flex space-x-3 hover:bg-white/[0.02] transition-colors cursor-pointer group/tweet">
            <img src={pfpSrc} alt={author.name} className="w-11 h-11 rounded-full flex-shrink-0 object-cover bg-[#2f3336]" />
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-[15px] truncate">
                        <span className="font-black text-white truncate">{author.name}</span>
                        {author.isVerified && <svg viewBox="0 0 22 22" className="w-[18px] h-[18px] text-[#1d9bf0] fill-current flex-shrink-0"><g><path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.056-.75-1.69-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.9-.14-.635.13-1.22.436-1.69.882-.445.47-.75 1.055-.882 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.44 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.355.54.854.97 1.44 1.245-.224.606-.274 1.263-.144 1.896.13.634.437 1.218.882 1.687.47.445.1054.75 1.69.882.633.132 1.29.084 1.897-.138.274.586.705 1.086 1.246 1.44.54.354 1.17.553 1.816.572.647-.02 1.275-.217 1.817-.573.54-.356.97-.854 1.245-1.44.604.224 1.263.272 1.896.14.634-.13.122-.436.169-.882.445-.47.75-1.054.882-1.688.13-.633.08-1.29-.14-1.896.586-.274 1.086-.705 1.44-1.245.355-.54.553-1.17.572-1.816zM9.662 14.85l-3.428-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"></path></g></svg>}
                        <span className="text-[#71767b] truncate">@{author.handle}</span>
                        <span className="text-[#71767b]">·</span>
                        <span className="text-[#71767b] flex-shrink-0 font-medium">{timeSince(timestamp)}</span>
                    </div>
                </div>
                <div className="text-white text-[15px] mt-0.5 leading-normal">{highlightMentions(content)}</div>
                
                {statsData && (
                    <div className="mt-3 rounded-2xl border border-[#16181c] overflow-hidden bg-black">
                        <StreamSnapshot items={statsData.items} title={statsData.title} artistName={statsData.artistName} coverArt={statsData.coverArt} gameDate={gameDate} embedMode={true} />
                    </div>
                )}

                {quotedTweet && (
                    <div className="mt-3 rounded-2xl border border-[#2f3336] p-3 space-y-1 hover:bg-white/[0.02] transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                            <img src={quotedTweet.avatar || `https://source.unsplash.com/100x100/?portrait`} className="w-5 h-5 rounded-full object-cover" />
                            <span className="font-black text-xs text-white">{quotedTweet.author}</span>
                            {quotedTweet.verified && <svg viewBox="0 0 22 22" className="w-3.5 h-3.5 text-[#1d9bf0] fill-current"><g><path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.056-.75-1.69-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.9-.14-.635.13-1.22.436-1.69.882-.445.47-.75 1.055-.882 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.44 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.355.54.854.97 1.44 1.245-.224.606-.274 1.263-.144 1.896.13.634.437 1.218.882 1.687.47.445.1054.75 1.69.882.633.132 1.29.084 1.897-.138.274.586.705 1.086 1.246 1.44.54.354 1.17.553 1.816.572.647-.02 1.275-.217 1.817-.573.54-.356.97-.854 1.245-1.44.604.224 1.263.272 1.896.14.634-.13.122-.436.169-.882.445-.47.75-1.054.882-1.688.13-.633.08-1.29-.14-1.896.586-.274 1.086-.705 1.44-1.245.355-.54.553-1.17.572-1.816zM9.662 14.85l-3.428-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"></path></g></svg>}
                            <span className="text-gray-500 text-xs truncate">@{quotedTweet.handle}</span>
                        </div>
                        <p className="text-sm text-gray-300 leading-normal">{quotedTweet.content}</p>
                    </div>
                )}

                {media && !statsData && !quotedTweet && <img src={media} alt="Tweet media" className="mt-3 rounded-2xl border border-[#16181c] max-h-96 w-full object-cover" />}
                
                <div className="flex justify-between text-[#71767b] mt-4 pr-12 max-w-md">
                    <div className="flex items-center gap-1.5 hover:text-[#1d9bf0] transition-colors"><svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg><span className="text-xs font-medium tabular-nums">{formatNumber(comments)}</span></div>
                    <div 
                        onClick={(e) => { e.stopPropagation(); onQuote(tweet); }}
                        className="flex items-center gap-1.5 hover:text-[#00ba7c] transition-colors"
                    >
                        <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>
                        <span className="text-xs font-medium tabular-nums uppercase">Quote</span>
                    </div>
                    <div className="flex items-center gap-1.5 hover:text-[#f91880] transition-colors"><svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg><span className="text-xs font-medium tabular-nums">{formatNumber(likes)}</span></div>
                    <div className="flex items-center gap-1.5 hover:text-[#1d9bf0] transition-colors"><svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg><span className="text-xs font-medium tabular-nums">{formatNumber(views)}</span></div>
                </div>
            </div>
        </div>
    );
};

const XScreen: React.FC<XScreenProps> = ({ player, setPlayer, songs, albums, tours, chartsData, gameDate, onBack }) => {
    const [feed, setFeed] = useState<Tweet[]>([]);
    const [isComposing, setIsComposing] = useState(false);
    const [quotingTweet, setQuotingTweet] = useState<Tweet | null>(null);
    const [activeTab, setActiveTab] = useState<'home' | 'search' | 'profile'>('home');

    // PERSISTENT FOLLOWER LOGIC: Dampened monthly listener effect + High Reputation/Catalog Floor
    const followers = useMemo(() => {
        const mlFloor = player.monthlyListeners * 0.08; 
        const repBonus = player.reputation * 10000; 
        const catalogFloor = player.careerTotalUnits * 0.15; 
        return Math.floor(mlFloor + repBonus + catalogFloor + 50 + Math.random() * 500);
    }, [player.monthlyListeners, player.reputation, player.careerTotalUnits]);

    const following = 24 + Math.floor(player.reputation / 5);

    useEffect(() => {
        const generatedFeed = generateXFeed(player, songs, albums, tours, chartsData, gameDate);
        setFeed(generatedFeed);
    }, [player, songs, albums, tours, chartsData, gameDate]);

    const profileFeed = useMemo(() => 
        feed.filter(t => t.author.handle.toLowerCase() === player.artistName.replace(/\s/g, '').toLowerCase()), 
    [feed, player.artistName]);

    const handleTweet = (content: string, media?: string, quote?: Tweet) => {
        const baseLikes = Math.floor(followers * (0.01 + Math.random() * 0.02));
        const newPost: SocialPost = { 
            id: `tweet_${Date.now()}`, 
            type: 'Manual', 
            caption: content, 
            image: media, 
            date: new Date(gameDate), 
            likes: baseLikes, 
            comments: Math.floor(baseLikes * 0.05), 
            platform: 'X', 
            baseLikes, 
            peakLikes: baseLikes,
            quotedTweet: quote ? {
                author: quote.author.name,
                handle: quote.author.handle,
                content: quote.content,
                avatar: quote.author.avatarSeed,
                verified: quote.author.isVerified
            } : undefined
        };
        setPlayer(prev => prev ? { ...prev, socialPosts: [newPost, ...(prev.socialPosts || [])] } : null);
        setIsComposing(false);
        setQuotingTweet(null);
    };

    const handleQuote = (t: Tweet) => {
        setQuotingTweet(t);
        setIsComposing(true);
    };

    return (
        <div className="bg-black text-white min-h-screen fixed inset-0 z-[100] flex flex-col font-sans overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-4 bg-black/80 backdrop-blur-md z-[120] border-b border-[#16181c]">
                <button onClick={onBack} className="p-3 hover:bg-white/10 rounded-full transition-colors text-white z-[130]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                </button>
                <div className="flex-1 flex justify-center">
                    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white"><title>X</title><path fill="currentColor" d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
                </div>
                <div className="w-12"></div>
            </div>

            {isComposing && <ComposeTweetModal onClose={() => { setIsComposing(false); setQuotingTweet(null); }} onTweet={handleTweet} quotingTweet={quotingTweet} />}
            
            <main className="flex-1 overflow-y-auto scrollbar-hide bg-black pt-16">
                {activeTab === 'home' ? (
                    feed.length > 0 ? feed.map(tweet => <TweetComponent key={tweet.id} tweet={tweet} artistName={player.artistName} gameDate={gameDate} onQuote={handleQuote} />) : <div className="text-center p-12 text-gray-500"><p className="font-bold text-white text-xl mb-2">Welcome to Pulse!</p><p>Posts about your career will appear here.</p></div>
                ) : activeTab === 'search' ? (
                    <div className="p-4 space-y-8">
                         <div className="bg-[#16181c] rounded-full flex items-center px-5 py-3 border border-transparent focus-within:border-[#1d9bf0] transition-colors">
                            <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#71767b] mr-3" fill="currentColor"><g><path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.418-.726 4.596-1.904 1.178-1.178 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"></path></g></svg>
                            <input type="text" placeholder="Explore Trends" className="bg-transparent outline-none text-white w-full text-base font-medium" />
                        </div>
                        <div className="space-y-6">
                            <h2 className="text-xl font-black italic uppercase tracking-tighter border-b border-[#16181c] pb-2">Trending Now</h2>
                            {['#Grammys2025', 'Hip Hop Weekly', 'Super Bowl LIX', player.artistName, 'New Music Friday'].map((topic, i) => (
                                <div key={topic} className="flex justify-between items-center group cursor-pointer">
                                    <div>
                                        <p className="text-[#71767b] text-xs font-bold uppercase tracking-widest">{i + 1} · Trending</p>
                                        <p className="font-black text-lg group-hover:text-[#1d9bf0] transition-colors">{topic}</p>
                                        <p className="text-[#71767b] text-xs">{(100000 - i * 15000).toLocaleString()} posts</p>
                                    </div>
                                    <span className="text-gray-700">···</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="bg-black">
                        <div className="h-32 bg-[#16181c] w-full overflow-hidden relative">
                            {player.headerImage && <img src={player.headerImage} className="w-full h-full object-cover brightness-75" />}
                        </div>
                        <div className="px-4 relative">
                            <div className="absolute -top-12 left-4">
                                <div className="rounded-full border-[4px] border-black bg-black w-[94px] h-[94px] overflow-hidden shadow-2xl">
                                    <img src={player.aboutImage || `https://source.unsplash.com/100x100/?portrait`} className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <div className="flex justify-end pt-3">
                                <button className="border border-[#cfd9de] rounded-full px-5 py-2 font-black text-sm hover:bg-white/10 transition-colors uppercase tracking-widest">Edit profile</button>
                            </div>
                            <div className="mt-6">
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-1.5">
                                        <h2 className="text-2xl font-black text-white leading-tight italic uppercase tracking-tighter">{player.artistName}</h2>
                                        <svg viewBox="0 0 22 22" className="w-[20px] h-[20px] text-[#1d9bf0] fill-current"><g><path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.056-.75-1.69-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.9-.14-.635.13-1.22.436-1.69.882-.445.47-.75 1.055-.882 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.44 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.355.54.854.97 1.44 1.245-.224.606-.274 1.263-.144 1.896.13.634.437 1.218.882 1.687.47.445.1054.75 1.69.882.633.132 1.29.084 1.897-.138.274.586.705 1.086 1.246 1.44.54.354 1.17.553 1.816.572.647-.02 1.275-.217 1.817-.573.54-.356.97-.854 1.245-1.44.604.224 1.263.272 1.896.14.634-.13.122-.436.169-.882.445-.47.75-1.054.882-1.688.13-.633.08-1.29-.14-1.896.586-.274 1.086-.705 1.44-1.245.355-.54.553-1.17.572-1.816zM9.662 14.85l-3.428-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"></path></g></svg>
                                    </div>
                                    <p className="text-[#71767b] text-base">@{player.artistName.replace(/\s/g, '').toLowerCase()}</p>
                                </div>
                                <p className="text-white text-base my-4 leading-relaxed">{player.bio || "Industry Visionary • Official Page."}</p>
                                <div className="flex gap-5 text-[15px] mb-6">
                                    <div className="hover:underline cursor-pointer"><span className="font-black text-white">{following}</span> <span className="text-[#71767b]">Following</span></div>
                                    <div className="hover:underline cursor-pointer"><span className="font-black text-white">{formatNumber(followers)}</span> <span className="text-[#71767b]">Followers</span></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex border-b border-[#16181c] bg-black">
                            {['Posts', 'Media', 'Likes'].map(tab => (
                                <button key={tab} onClick={() => setActiveTab('profile')} className="flex-1 py-4 font-black text-sm uppercase text-gray-500 hover:text-white transition-colors relative">
                                    {tab}
                                    {tab === 'Posts' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#1d9bf0] rounded-full"></div>}
                                </button>
                            ))}
                        </div>
                        <div className="bg-black min-h-[400px]">
                            {profileFeed.length > 0 ? profileFeed.map(tweet => <TweetComponent key={tweet.id} tweet={tweet} artistName={player.artistName} gameDate={gameDate} onQuote={handleQuote} />) : <div className="text-center p-20 text-[#71767b]"><p className="text-sm font-bold uppercase tracking-widest">No activity found.</p></div>}
                        </div>
                    </div>
                )}
            </main>
            
            <button onClick={() => { setQuotingTweet(null); setIsComposing(true); }} className="fixed bottom-24 right-6 bg-white text-black w-14 h-14 rounded-full flex items-center justify-center shadow-2xl z-40 active:scale-90 transition-transform"><svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor"><path d="M23 3c-1.1.49-2.3.82-3.53 1.02A6.28 6.28 0 0021.6 2c-1.12.67-2.35 1.16-3.63 1.39A6.27 6.27 0 0012.5 2C8.9 2 6 4.9 6 8.5c0 .52.06 1.03.18 1.52A17.63 17.63 0 011.64 3.16c-.54.92-.84 2-.84 3.12 0 2.15 1.1 4.04 2.76 5.17-.93-.03-1.8-.28-2.57-.7v.08c0 3 2.14 5.5 4.97 6.07-.52.14-1.06.22-1.62.22-.4 0-.78-.04-1.16-.11.8 2.46 3.1 4.25 5.84 4.3-2.12 1.66-4.8 2.65-7.72 2.65-.5 0-1-.03-1.49-.09A17.52 17.52 0 009.5 22c7.22 0 11.16-6 11.16-11.16 0-.17 0-.34-.01-.5A7.95 7.95 0 0023 3z"></path></svg></button>
            
            <footer className="w-full bg-black/90 backdrop-blur-xl border-t border-[#16181c] flex justify-around pb-8 pt-3 px-6 z-30">
                <button onClick={() => setActiveTab('home')} className={`p-2 transition-transform active:scale-90 ${activeTab === 'home' ? 'text-white' : 'text-gray-600 hover:text-gray-400'}`}>
                    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor"><path d="M12 1.696L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696z"/></svg>
                </button>
                <button onClick={() => setActiveTab('search')} className={`p-2 transition-transform active:scale-90 ${activeTab === 'search' ? 'text-white' : 'text-gray-600 hover:text-gray-400'}`}>
                    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor"><path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.418-.726 4.596-1.904 1.178-1.178 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"></path></svg>
                </button>
                <button onClick={() => setActiveTab('profile')} className={`p-2 transition-transform active:scale-90 ${activeTab === 'profile' ? 'text-white' : 'text-gray-600 hover:text-gray-400'}`}>
                    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"></path></svg>
                </button>
            </footer>
        </div>
    );
};

export default XScreen;
