
import React, { useState } from 'react';
import { SquadMember, OutputLanguage } from '../types';
import { t } from '../locales';

interface SquadViewProps {
  members: SquadMember[];
  lang: OutputLanguage;
}

export const SquadView: React.FC<SquadViewProps> = ({ members, lang }) => {
  const [copied, setCopied] = useState(false);
  const txt = t[lang].results;
  const common = t[lang].common;
  
  // Sort members by score descending
  const sortedMembers = [...members].sort((a, b) => b.analysis.score - a.analysis.score);
  const winner = sortedMembers[0];

  const generateShareText = () => {
    let text = `🔥 RepoStar ${txt.squadTitle} 🔥\n\n`;
    text += `👑 ${txt.squadChampion}: ${winner.repo.name} (${winner.analysis.score}/100)\n\n`;
    text += `${txt.leaderboard}:\n`;
    sortedMembers.forEach((m, i) => {
      text += `${i+1}. ${m.repo.name}: ${m.analysis.score}\n`;
    });
    text += `\nhttps://repostar.vercel.app`;
    return text;
  };

  const handleShare = () => {
    const text = generateShareText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTweet = () => {
    const text = generateShareText();
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="animate-fade-in-up space-y-10 pb-20">
      
      {/* Header */}
      <div className="text-center relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-sm font-bold mb-4 uppercase tracking-wider animate-pulse">
          🔥 {txt.squadTitle}
        </div>
        <h2 className="text-4xl font-bold text-white mb-4">
          {txt.squadChampion}: <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">{winner.repo.name}</span> 👑
        </h2>
        
        {/* Share Buttons */}
        <div className="flex justify-center gap-3">
          <button 
            onClick={handleShare}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 border ${copied ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'}`}
          >
            {copied ? (
              <>
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                 {common.copied}
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                {txt.copyResult}
              </>
            )}
          </button>
          
          <button 
            onClick={handleTweet}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 bg-[#1DA1F2]/10 border border-[#1DA1F2]/30 text-[#1DA1F2] hover:bg-[#1DA1F2]/20"
          >
             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
             {common.tweet}
          </button>
        </div>
      </div>

      {/* Podium / Leaderboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedMembers.map((member, index) => {
          const isWinner = index === 0;
          return (
            <div 
              key={member.repo.name}
              className={`relative glass-card rounded-3xl p-6 border transition-all duration-300 hover:-translate-y-2 ${
                isWinner 
                  ? 'border-pink-500/50 bg-gradient-to-b from-pink-500/10 to-slate-900/50 shadow-2xl shadow-pink-500/20 z-10 scale-105 md:-mt-4' 
                  : 'border-slate-700/50 hover:border-slate-600'
              }`}
            >
              {isWinner && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                   👑 Lider Proje
                </div>
              )}

              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-slate-400 border border-slate-700">
                  #{index + 1}
                </div>
                <div className={`text-4xl font-bold ${isWinner ? 'text-pink-400' : 'text-slate-200'}`}>
                  {member.analysis.score}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold text-white truncate" title={member.repo.name}>{member.repo.name}</h3>
                <p className="text-sm text-slate-400 truncate">{member.repo.owner}</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">{common.rank}</span>
                  <span className="text-slate-200 font-medium">{member.analysis.rank}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Ruh</span>
                  <span className="text-slate-200 font-medium flex items-center gap-1">
                    {member.analysis.persona.spiritAnimalEmoji} {member.analysis.persona.archetype}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">{txt.radarCode}</span>
                  <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden mt-1.5">
                    <div 
                      className="h-full bg-emerald-500" 
                      style={{ width: `${member.analysis.breakdown.codeQuality}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800/50 text-xs text-slate-400 italic">
                "{member.analysis.summary.substring(0, 80)}..."
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700/50 bg-slate-800/30">
          <h3 className="text-lg font-semibold text-white">{txt.detailedTable}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/50 text-slate-400 uppercase tracking-wider font-mono text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">{txt.repo}</th>
                <th className="px-6 py-4 font-medium text-center">{common.score}</th>
                <th className="px-6 py-4 font-medium text-center">{txt.viral}</th>
                <th className="px-6 py-4 font-medium text-center">{txt.docs}</th>
                <th className="px-6 py-4 font-medium text-center">{txt.stars}</th>
                <th className="px-6 py-4 font-medium">{txt.truth}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {sortedMembers.map((member) => (
                <tr key={member.repo.name} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">
                    {member.repo.name}
                    <div className="text-xs text-slate-500 font-normal">{member.repo.owner}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-block px-2 py-1 rounded font-bold ${
                      member.analysis.score >= 80 ? 'bg-emerald-500/10 text-emerald-400' : 
                      member.analysis.score >= 60 ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {member.analysis.score}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-slate-300">{member.analysis.breakdown.virality}</td>
                  <td className="px-6 py-4 text-center text-slate-300">{member.analysis.breakdown.documentation}</td>
                  <td className="px-6 py-4 text-center text-slate-300">{member.repo.stars.toLocaleString()}</td>
                  <td className="px-6 py-4 text-slate-400 italic max-w-xs truncate">
                    {member.analysis.critique[0]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
