import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  label: string;
  colorClass?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, max, label, colorClass = 'bg-blue-500' }) => {
  const percentage = (value / max) * 100;
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-brand-text-muted">{label}</span>
        <span className="text-sm font-medium text-brand-text">{value} / {max}</span>
      </div>
      <div className="w-full bg-brand-dialog rounded-full h-2.5">
        <div className={`${colorClass} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

export default ProgressBar;