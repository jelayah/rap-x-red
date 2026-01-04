import React from 'react';

interface PlaceholderScreenProps {
  title: string;
  message: string;
}

const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({ title, message }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
       <div className="bg-brand-surface p-8 rounded-xl shadow-lg max-w-lg border border-brand-dialog">
          <h1 className="text-3xl font-bold mb-4">{title}</h1>
          <p className="text-brand-text-muted">{message}</p>
          <p className="mt-6 text-sm text-yellow-400 font-semibold animate-pulse">Feature Coming Soon</p>
      </div>
    </div>
  );
};

export default PlaceholderScreen;