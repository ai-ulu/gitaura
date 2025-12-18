
import React from 'react';
import { OutputLanguage } from '../types';
import { t } from '../locales';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  lang: OutputLanguage;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, onUpgrade, lang }) => {
  if (!isOpen) return null;
  const txt = t[lang].pricing;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="glass-card w-full max-w-5xl p-8 rounded-3xl border border-slate-700 shadow-2xl relative my-auto">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors z-10">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">{txt.title}</h2>
          <p className="text-slate-400 text-lg">{txt.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6 flex flex-col">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-slate-300">{txt.apprentice}</h3>
              <div className="text-3xl font-bold text-white mt-2">₺0<span className="text-sm font-normal text-slate-500">{txt.month}</span></div>
            </div>
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-center gap-3 text-sm text-slate-300">
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {txt.features.basic}
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-300">
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {txt.features.scorecard}
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-300">
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {txt.features.history}
              </li>
            </ul>
            <button className="w-full py-3 rounded-xl border border-slate-600 text-slate-300 font-semibold hover:bg-slate-800 transition-colors">
              {txt.currentPlan}
            </button>
          </div>

          {/* Pro Plan - Highlighted */}
          <div className="bg-gradient-to-b from-primary/20 to-slate-900/80 border border-primary/50 rounded-2xl p-6 flex flex-col relative transform scale-105 shadow-2xl shadow-primary/20">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {txt.mostPopular}
            </div>
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                {txt.unicornHunter} 🦄
              </h3>
              <div className="text-3xl font-bold text-white mt-2">₺199<span className="text-sm font-normal text-slate-400">{txt.month}</span></div>
            </div>
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-center gap-3 text-sm text-white font-medium">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {txt.features.unlimited}
              </li>
              <li className="flex items-center gap-3 text-sm text-white">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-amber-300 font-bold">{txt.features.social}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {txt.features.issue}
              </li>
              <li className="flex items-center gap-3 text-sm text-white">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {txt.features.writer}
              </li>
            </ul>
            <button 
              onClick={onUpgrade}
              className="w-full py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2"
            >
              {txt.startNow}
            </button>
            <p className="text-center text-xs text-slate-400 mt-3">{txt.noCC}</p>
          </div>

          {/* Team Plan */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6 flex flex-col">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-slate-300">{txt.ctoMode}</h3>
              <div className="text-3xl font-bold text-white mt-2">₺999<span className="text-sm font-normal text-slate-500">{txt.month}</span></div>
            </div>
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-center gap-3 text-sm text-slate-300">
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {txt.features.allPro}
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-300">
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {txt.features.private}
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-300">
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {txt.features.api}
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-300">
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {txt.features.support}
              </li>
            </ul>
            <button className="w-full py-3 rounded-xl border border-slate-600 text-slate-300 font-semibold hover:bg-slate-800 transition-colors">
              {txt.contact}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
