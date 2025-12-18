
import React, { useState } from 'react';
import { OutputLanguage } from '../types';
import { t } from '../locales';

interface RewriteProps {
  original: string;
  improved: string;
  explanation: string;
  lang: OutputLanguage;
}

export const MagicalRewrite: React.FC<RewriteProps> = ({ original, improved, explanation, lang }) => {
  const [copied, setCopied] = useState(false);
  const txt = t[lang];

  const handleCopy = () => {
    navigator.clipboard.writeText(improved);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-slate-700/50">
      <div className="bg-slate-800/50 p-5 border-b border-slate-700/50 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
           <div className="p-1.5 bg-primary/10 rounded text-primary">
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
           </div>
           <div>
             <h3 className="text-base font-semibold text-white">{txt.results.rewriteTitle}</h3>
             <p className="text-xs text-slate-500">{txt.results.rewriteSubtitle}</p>
           </div>
        </div>
        <div className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-xs font-mono text-slate-400">README.md</div>
      </div>
      
      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span> {txt.results.current}
            </span>
            <div className="bg-slate-950/50 p-4 rounded-xl text-slate-400 text-sm font-mono border border-slate-800 h-full overflow-auto max-h-60">
              {original}
            </div>
          </div>
          <div className="space-y-3">
            <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span> {txt.results.proposed}
            </span>
            <div className="bg-primary/5 p-4 rounded-xl text-slate-200 text-sm font-mono border border-primary/20 h-full shadow-[0_0_15px_rgba(99,102,241,0.05)] overflow-auto max-h-60">
              {improved}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-700/50">
           <p className="text-sm text-slate-400 italic">
             <span className="font-semibold text-slate-300 not-italic mr-2">💡 {txt.results.reason}:</span> 
             {explanation}
           </p>
           <button
             onClick={handleCopy}
             className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
               copied 
                 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                 : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-600'
             }`}
           >
             {copied ? (
               <>
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                 {txt.common.copied}
               </>
             ) : (
               <>
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                 {txt.common.copy}
               </>
             )}
           </button>
        </div>
      </div>
    </div>
  );
};
