
import React from 'react';
import { OutputLanguage } from '../types';
import { t } from '../locales';

interface ScoreCardProps {
  score: number;
  rank: string;
  lang: OutputLanguage;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ score, rank, lang }) => {
  const txt = t[lang].common;
  const getColor = (s: number) => {
    if (s >= 90) return 'text-primary stroke-primary';
    if (s >= 70) return 'text-secondary stroke-secondary';
    if (s >= 50) return 'text-amber-200 stroke-amber-200';
    return 'text-red-400 stroke-red-400';
  };

  const colorClass = getColor(score);
  const strokeDashoffset = 283 - (283 * score) / 100;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" className="stroke-white/10" strokeWidth="2" fill="transparent" />
          <circle
            cx="50" cy="50" r="45"
            className={`transition-all duration-1000 ease-out ${colorClass.split(' ')[1]}`}
            strokeWidth="3"
            fill="transparent"
            strokeDasharray="283"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="square"
            style={{ filter: 'drop-shadow(0 0 4px currentColor)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-5xl font-display font-bold tracking-tighter ${colorClass.split(' ')[0]}`}>{score}</span>
        </div>
      </div>
      <div className="mt-2 text-center">
        <h2 className="text-sm font-mono font-bold text-white uppercase tracking-widest border-b border-primary/50 pb-1">
          {rank}
        </h2>
      </div>
    </div>
  );
};
