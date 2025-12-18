
import React from 'react';
import { DeveloperPersona, OutputLanguage } from '../types';
import { t } from '../locales';

interface PersonaCardProps {
  persona: DeveloperPersona;
  lang: OutputLanguage;
}

export const PersonaCard: React.FC<PersonaCardProps> = ({ persona, lang }) => {
  const txt = t[lang].results;
  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
      {/* Background Gradient Effect */}
      <div 
        className="absolute inset-0 opacity-10 transition-opacity duration-700 group-hover:opacity-20"
        style={{ background: `linear-gradient(135deg, ${persona.auraColor}, transparent)` }}
      ></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{txt.personaTitle}</span>
          </div>
          <div className="px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-[10px] text-slate-300">
            AI Detected
          </div>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-slate-900/80 border-2 border-white/10 flex items-center justify-center text-6xl shadow-2xl mb-4 animate-float relative">
            {persona.spiritAnimalEmoji}
            <div 
              className="absolute inset-0 rounded-full blur-xl opacity-40" 
              style={{ backgroundColor: persona.auraColor }}
            ></div>
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-1">{persona.archetype}</h3>
          <p className="text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
            {txt.spiritAnimal}: <span style={{ color: persona.auraColor }}>{persona.spiritAnimal}</span>
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {persona.traits.map((trait, i) => (
              <span key={i} className="px-3 py-1 rounded-lg bg-slate-800/80 text-xs text-slate-300 border border-slate-700">
                {trait}
              </span>
            ))}
          </div>

          <blockquote className="relative p-4 bg-slate-900/50 rounded-xl border border-slate-800/50">
            <svg className="absolute top-2 left-2 w-4 h-4 text-slate-700 transform -scale-x-100" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.896 14.325 15.989 14.941 15.279C15.557 14.569 16.485 14.014 17.726 13.614L18.423 13.364V8.428L17.726 8.178C16.485 7.778 15.557 7.223 14.941 6.513C14.325 5.803 14.017 4.896 14.017 3.792L14.017 0.791992H22.017V21H14.017ZM5.0166 21L5.0166 18C5.0166 16.896 5.3246 15.989 5.9406 15.279C6.5566 14.569 7.4846 14.014 8.7256 13.614L9.4226 13.364V8.428L8.7256 8.178C7.4846 7.778 6.5566 7.223 5.9406 6.513C5.3246 5.803 5.0166 4.896 5.0166 3.792L5.0166 0.791992H13.017V21H5.0166Z"/></svg>
            <p className="text-sm italic text-slate-300 z-10 relative px-2">"{persona.quote}"</p>
          </blockquote>
        </div>
      </div>
    </div>
  );
};
