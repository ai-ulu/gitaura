
import React from 'react';
import { SocialPost, OutputLanguage } from '../types';
import { t } from '../locales';

interface SocialShareProps {
  posts: SocialPost[];
  lang: OutputLanguage;
}

export const SocialShare: React.FC<SocialShareProps> = ({ posts, lang }) => {
  const txt = t[lang];

  const getIcon = (platform: string) => {
    if (platform === 'Twitter') return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
    );
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(txt.common.copied);
  };

  const shareOnWhatsApp = (text: string) => {
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
         <div className="p-2 bg-slate-800 rounded-lg text-slate-300">
           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
         </div>
         <h3 className="text-lg font-semibold text-white">{txt.results.socialTitle}</h3>
      </div>
      
      <div className="space-y-4">
        {posts.map((post, idx) => (
          <div key={idx} className="bg-slate-900/80 rounded-xl p-5 border border-slate-800 hover:border-slate-700 transition-colors">
             <div className="flex items-center justify-between mb-3">
               <div className={`flex items-center gap-2 text-sm font-bold ${post.platform === 'Twitter' ? 'text-sky-400' : 'text-blue-500'}`}>
                 {getIcon(post.platform)}
                 {post.platform}
               </div>
               <div className="flex gap-2">
                 <button 
                   onClick={() => shareOnWhatsApp(`${post.content} ${post.hashtags.join(' ')}`)}
                   className="text-xs text-green-400 hover:text-green-300 transition-colors flex items-center gap-1"
                   title="WhatsApp"
                 >
                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.697c.93.512 1.733.709 2.823.71h.003c3.191 0 5.75-2.581 5.753-5.766.001-1.539-.601-2.986-1.69-4.075a5.726 5.726 0 00-4.081-1.817zm7.482 1.552c1.516 1.516 2.348 3.529 2.349 5.674 0 4.416-3.604 8.019-8.026 8.019-1.34 0-2.655-.337-3.818-1.03l-4.381 1.15 1.168-4.275c-.636-1.096-1.025-2.359-1.024-3.864 0-4.421 3.593-8.016 8.025-8.016 2.144 0 4.156.837 5.707 2.342z"/></svg>
                   Wp
                 </button>
                 <div className="w-px h-3 bg-slate-700 my-auto"></div>
                 <button 
                   onClick={() => copyToClipboard(`${post.content} ${post.hashtags.join(' ')}`)}
                   className="text-xs text-slate-400 hover:text-white transition-colors"
                 >
                   {txt.common.copy}
                 </button>
               </div>
             </div>
             
             <p className="text-slate-300 text-sm whitespace-pre-line mb-4 leading-relaxed font-sans">{post.content}</p>
             
             <div className="flex flex-wrap gap-2">
               {post.hashtags.map((tag, tIdx) => (
                 <span key={tIdx} className="text-[11px] text-primary/80 bg-primary/10 px-2 py-0.5 rounded font-medium">#{tag.replace('#','')}</span>
               ))}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};
