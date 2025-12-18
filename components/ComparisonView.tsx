
import React from 'react';
import { ComparisonResult, RepoInfo, OutputLanguage } from '../types';
import { t } from '../locales';

interface ComparisonViewProps {
  repo1: RepoInfo;
  repo2: RepoInfo;
  result: ComparisonResult;
  lang: OutputLanguage;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ repo1, repo2, result, lang }) => {
  const txt = t[lang].results;
  return (
    <div className="animate-fade-in-up space-y-8">
      
      {/* Header / Winner Banner */}
      <div className="text-center mb-8">
        <div className="inline-block relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary blur-2xl opacity-20 rounded-full"></div>
          <h2 className="relative text-3xl font-bold text-white mb-2">
            {result.winner === 1 ? repo1.name : result.winner === 2 ? repo2.name : txt.tie} {result.winner !== 0 && txt.comparisonTitle}
          </h2>
        </div>
        <p className="text-slate-400 max-w-2xl mx-auto">{result.winnerReason}</p>
      </div>

      {/* Main VS Card */}
      <div className="glass-card rounded-3xl overflow-hidden border border-slate-700/50">
        <div className="grid grid-cols-1 md:grid-cols-3">
          
          {/* Repo 1 Column */}
          <div className={`p-6 md:p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-700/50 bg-gradient-to-b ${result.winner === 1 ? 'from-primary/10 to-transparent' : 'from-transparent to-transparent'}`}>
            <h3 className="text-xl font-bold text-white mb-1">{repo1.owner}</h3>
            <div className="text-sm text-slate-400 mb-4">/ {repo1.name}</div>
            <div className="text-5xl font-bold text-primary mb-2">{result.repo1Score}</div>
            <div className="text-xs uppercase tracking-widest text-primary/70 font-semibold">{t[lang].common.score}</div>
            <div className="mt-6 flex gap-3 text-sm text-slate-400">
               <span className="flex items-center gap-1">★ {repo1.stars.toLocaleString()}</span>
               <span className="flex items-center gap-1">⑂ {repo1.forks.toLocaleString()}</span>
            </div>
          </div>

          {/* VS Center */}
          <div className="p-4 flex flex-col items-center justify-center relative bg-slate-900/30">
             <div className="w-16 h-16 rounded-full bg-slate-800 border-4 border-slate-900 flex items-center justify-center shadow-xl z-10">
               <span className="text-xl font-black italic text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-500">VS</span>
             </div>
             <div className="absolute inset-x-0 h-px bg-slate-700/50 top-1/2 -z-0"></div>
          </div>

          {/* Repo 2 Column */}
          <div className={`p-6 md:p-8 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-slate-700/50 bg-gradient-to-b ${result.winner === 2 ? 'from-secondary/10 to-transparent' : 'from-transparent to-transparent'}`}>
            <h3 className="text-xl font-bold text-white mb-1">{repo2.owner}</h3>
            <div className="text-sm text-slate-400 mb-4">/ {repo2.name}</div>
            <div className="text-5xl font-bold text-secondary mb-2">{result.repo2Score}</div>
            <div className="text-xs uppercase tracking-widest text-secondary/70 font-semibold">{t[lang].common.score}</div>
            <div className="mt-6 flex gap-3 text-sm text-slate-400">
               <span className="flex items-center gap-1">★ {repo2.stars.toLocaleString()}</span>
               <span className="flex items-center gap-1">⑂ {repo2.forks.toLocaleString()}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Metrics Table */}
      <div className="glass-card rounded-2xl p-6 md:p-8">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          {txt.metrics}
        </h3>
        <div className="space-y-6">
          {result.metrics.map((metric, idx) => (
            <div key={idx} className="relative">
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className={`${metric.winner === 1 ? 'text-primary' : 'text-slate-400'}`}>{metric.repo1Value}</span>
                <span className="text-white">{metric.name}</span>
                <span className={`${metric.winner === 2 ? 'text-secondary' : 'text-slate-400'}`}>{metric.repo2Value}</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden flex">
                <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${metric.repo1Value}%` }}></div>
                <div className="flex-grow bg-slate-800"></div>
                <div className="h-full bg-secondary transition-all duration-1000" style={{ width: `${metric.repo2Value}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Differences & Verdict */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6">
           <h3 className="text-lg font-semibold text-white mb-4">{txt.keyDiff}</h3>
           <ul className="space-y-3">
             {result.keyDifferences.map((diff, i) => (
               <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                 <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-500 flex-shrink-0"></span>
                 {diff}
               </li>
             ))}
           </ul>
        </div>
        <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-slate-800/50 to-emerald-900/20 border border-emerald-500/20">
           <h3 className="text-lg font-semibold text-emerald-400 mb-4">{txt.verdict}</h3>
           <p className="text-slate-200 leading-relaxed text-sm">
             {result.recommendation}
           </p>
        </div>
      </div>

    </div>
  );
};
