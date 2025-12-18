
import React from 'react';
import { OutputLanguage } from '../types';
import { t } from '../locales';

interface CritiqueSectionProps {
  critiques: string[];
  tips: string[];
  lang: OutputLanguage;
}

export const CritiqueSection: React.FC<CritiqueSectionProps> = ({ critiques, tips, lang }) => {
  const txt = t[lang].results;
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Weaknesses */}
      <div className="glass-card rounded-2xl p-6 border-l-4 border-l-red-500">
        <div className="flex items-center gap-3 mb-5">
           <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
           </div>
           <h3 className="text-lg font-semibold text-white">{txt.critiques}</h3>
        </div>
        <ul className="space-y-3">
          {critiques.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-slate-300 text-sm leading-relaxed">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Improvements */}
      <div className="glass-card rounded-2xl p-6 border-l-4 border-l-secondary">
        <div className="flex items-center gap-3 mb-5">
           <div className="p-2 bg-teal-500/10 rounded-lg text-secondary">
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           </div>
           <h3 className="text-lg font-semibold text-white">{txt.tips}</h3>
        </div>
        <ul className="space-y-3">
          {tips.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-slate-300 text-sm leading-relaxed">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0"></span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
