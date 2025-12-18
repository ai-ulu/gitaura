
import React from 'react';
import { HistoryItem, OutputLanguage } from '../types';
import { t } from '../locales';

interface HistoryListProps {
  items: HistoryItem[];
  onSelect: (url: string) => void;
  onClear: () => void;
  lang: OutputLanguage;
}

export const HistoryList: React.FC<HistoryListProps> = ({ items, onSelect, onClear, lang }) => {
  if (items.length === 0) return null;
  const txt = t[lang].hero;

  return (
    <div className="mt-12 w-full max-w-3xl mx-auto animate-fade-in-up">
      <div className="flex justify-between items-center mb-4 px-2">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{txt.history}</h3>
        <button onClick={onClear} className="text-xs text-slate-600 hover:text-red-400 transition-colors">
          {txt.clear}
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {items.map((item) => (
          <div 
            key={item.id}
            onClick={() => onSelect(`https://github.com/${item.owner}/${item.name}`)}
            className="group cursor-pointer bg-slate-900/40 hover:bg-slate-800 border border-slate-800 hover:border-primary/30 rounded-xl p-4 transition-all duration-200"
          >
            <div className="flex justify-between items-start mb-2">
               <div className="text-xs font-mono text-slate-500">
                 {new Date(item.date).toLocaleDateString(lang === OutputLanguage.TR ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'short' })}
               </div>
               <div className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                 item.score >= 90 ? 'bg-emerald-500/10 text-emerald-400' :
                 item.score >= 70 ? 'bg-blue-500/10 text-blue-400' :
                 item.score >= 50 ? 'bg-amber-500/10 text-amber-400' :
                 'bg-red-500/10 text-red-400'
               }`}>
                 {item.score}
               </div>
            </div>
            <div className="font-medium text-slate-300 group-hover:text-white truncate">
              {item.owner}/<span className="text-slate-100">{item.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
