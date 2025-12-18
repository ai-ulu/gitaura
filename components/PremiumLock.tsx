
import React from 'react';

interface PremiumLockProps {
  isLocked: boolean;
  onUnlock: () => void;
  title: string;
  desc?: string;
  unlockText?: string;
  children: React.ReactNode;
}

export const PremiumLock: React.FC<PremiumLockProps> = ({ isLocked, onUnlock, title, desc, unlockText, children }) => {
  if (!isLocked) {
    return <>{children}</>;
  }

  return (
    <div className="relative group overflow-hidden rounded-2xl">
      {/* Blurry Content */}
      <div className="filter blur-md opacity-50 pointer-events-none select-none grayscale transition-all duration-500">
        {children}
      </div>

      {/* Lock Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-[2px] z-10 p-6 text-center border border-white/10 rounded-2xl">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 mb-4 animate-float">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        {desc && <p className="text-slate-300 text-sm mb-6 max-w-xs">{desc}</p>}
        <button
          onClick={onUnlock}
          className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-orange-500/30 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <span>{unlockText || 'Kilidi Aç'}</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </button>
      </div>
    </div>
  );
};
