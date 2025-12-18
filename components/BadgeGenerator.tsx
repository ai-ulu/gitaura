
import React, { useState } from 'react';
import { OutputLanguage } from '../types';
import { t } from '../locales';

interface BadgeGeneratorProps {
  score: number;
  lang: OutputLanguage;
}

export const BadgeGenerator: React.FC<BadgeGeneratorProps> = ({ score, lang }) => {
  const [copied, setCopied] = useState(false);
  const [style, setStyle] = useState<'modern' | 'classic' | 'plastic'>('modern');
  const [format, setFormat] = useState<'markdown' | 'html'>('markdown');
  
  const txt = t[lang].results;
  const common = t[lang].common;

  let color = 'critical'; 
  if (score >= 90) color = 'success'; 
  else if (score >= 70) color = 'blue'; 
  else if (score >= 50) color = 'yellow'; 
  
  const styleMap = { modern: 'for-the-badge', classic: 'flat', plastic: 'plastic' };

  // Changed badge name to GitAura
  const badgeUrl = `https://img.shields.io/badge/GitAura_Score-${score}%2F100-${color}?style=${styleMap[style]}&logo=github&logoColor=white`;
  const appUrl = typeof window !== 'undefined' ? window.location.href : 'https://gitaura.vercel.app';
  
  const codeToCopy = format === 'markdown' ? markdownCode : htmlCode;
  var markdownCode = `[![GitAura Score](${badgeUrl})](${appUrl})`; 
  var htmlCode = `<a href="${appUrl}"><img src="${badgeUrl}" alt="GitAura Score" /></a>`;

  const handleCopy = () => {
    const code = format === 'markdown' ? markdownCode : htmlCode;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group">
       <div className="flex items-center gap-3 mb-6 relative z-10">
         <div className="w-1 h-8 bg-primary"></div>
         <div className="flex-grow">
           <h3 className="text-lg font-bold text-white font-display tracking-wide">{txt.badgeTitle}</h3>
         </div>
      </div>

      <div className="flex flex-col gap-4 relative z-10">
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
           <div className="flex gap-2">
             {['modern', 'classic', 'plastic'].map(s => (
                <button key={s} onClick={() => setStyle(s as any)} className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider transition-all ${style === s ? 'bg-white text-black' : 'text-slate-500 hover:text-white'}`}>{s}</button>
             ))}
           </div>
           <div className="flex gap-2">
             {['markdown', 'html'].map(f => (
                <button key={f} onClick={() => setFormat(f as any)} className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider transition-all ${format === f ? 'text-primary' : 'text-slate-500 hover:text-white'}`}>{f === 'markdown' ? 'MD' : 'HTML'}</button>
             ))}
           </div>
        </div>

        <div className="bg-black/40 p-6 rounded-xl border border-white/5 flex justify-center items-center min-h-[80px]">
            <img src={badgeUrl} alt="GitAura Score" className="shadow-lg" />
        </div>
        
        <button 
          onClick={handleCopy}
          className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 rounded-lg transition-all text-center truncate px-4"
        >
          {copied ? common.copied : (format === 'markdown' ? markdownCode : htmlCode)}
        </button>
      </div>
    </div>
  );
};
