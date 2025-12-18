
import React, { useState } from 'react';
import { Fortune, OutputLanguage } from '../types';
import { t } from '../locales';

interface FortuneTellerProps {
  fortune: Fortune;
  lang: OutputLanguage;
}

export const FortuneTeller: React.FC<FortuneTellerProps> = ({ fortune, lang }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const txt = t[lang].results;

  return (
    <div className="glass-card rounded-2xl p-6 border-violet-500/20 relative overflow-hidden">
      {/* Mystical Background */}
      <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(139,92,246,0.1)_0%,transparent_50%)] animate-pulse-slow pointer-events-none"></div>

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="p-2 bg-violet-500/10 rounded-lg text-violet-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{txt.fortuneTitle}</h3>
          <p className="text-xs text-violet-300/60">{txt.fortuneSubtitle}</p>
        </div>
      </div>

      <div className="flex flex-col items-center relative z-10">
        
        {/* The Card (Click to flip) */}
        <div 
          onClick={() => setIsFlipped(!isFlipped)}
          className="perspective-1000 w-full max-w-[240px] h-[340px] cursor-pointer group mb-6"
        >
          <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
            
            {/* Front of Card */}
            <div className="absolute inset-0 backface-hidden rounded-xl border-2 border-violet-500/30 bg-gradient-to-br from-slate-900 to-violet-950 shadow-2xl flex flex-col items-center justify-center p-6 text-center group-hover:border-violet-400/50 transition-colors">
              <div className="w-full h-full border border-violet-500/10 rounded-lg flex flex-col items-center justify-center p-4">
                <div className="text-6xl mb-4 animate-float">{fortune.cardEmoji}</div>
                <h4 className="text-xl font-bold text-violet-200 font-serif mb-2">{fortune.cardName}</h4>
                <div className="w-8 h-0.5 bg-violet-500/30 rounded-full mb-3"></div>
                <p className="text-xs text-violet-300/70 uppercase tracking-widest font-semibold">{txt.clickFlip}</p>
              </div>
              {/* Corner Ornaments */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-violet-500/40"></div>
              <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-violet-500/40"></div>
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-violet-500/40"></div>
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-violet-500/40"></div>
            </div>

            {/* Back of Card */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-xl border-2 border-violet-500/30 bg-slate-900 shadow-2xl flex flex-col items-center justify-center p-6 text-center">
              <h4 className="text-sm font-bold text-violet-300 uppercase tracking-wider mb-3">{txt.prophecy}</h4>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                {fortune.prediction}
              </p>
              <div className="mt-6 pt-4 border-t border-white/5 w-full">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">{txt.luckyNumbers}</p>
                <div className="flex justify-center gap-2">
                  {fortune.luckyNumbers.map((num, i) => (
                    <span key={i} className="w-8 h-8 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-xs font-mono text-violet-300">
                      {num}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        <p className="text-xs text-center text-slate-400 max-w-sm italic">
          "{fortune.meaning}"
        </p>

      </div>
    </div>
  );
};

// Add minimal required styles for 3D flip if not in Tailwind config
const style = document.createElement('style');
style.innerHTML = `
  .perspective-1000 { perspective: 1000px; }
  .transform-style-3d { transform-style: preserve-3d; }
  .backface-hidden { backface-visibility: hidden; }
  .rotate-y-180 { transform: rotateY(180deg); }
`;
document.head.appendChild(style);
