
import React from 'react';
import { OutputLanguage } from '../types';
import { t } from '../locales';

interface AnalysisLoaderProps {
  lang: OutputLanguage;
}

export const AnalysisLoader: React.FC<AnalysisLoaderProps> = ({ lang }) => {
  const [stepIndex, setStepIndex] = React.useState(0);
  const txt = t[lang].loader;

  React.useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % txt.steps.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [lang, txt.steps.length]);

  return (
    <div className="flex flex-col items-center justify-center p-16 text-center w-full min-h-[400px]">
      <div className="relative w-24 h-24 mb-10">
        <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-r-2 border-secondary rounded-full animate-spin-slow"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
        </div>
      </div>
      
      <div className="max-w-md">
        <h3 className="text-xl font-semibold text-white mb-3 tracking-tight animate-pulse">
          {txt.working}
        </h3>
        <div className="h-1 w-full bg-slate-800 rounded-full mb-4 overflow-hidden">
           <div className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-out" style={{ width: `${((stepIndex + 1) / txt.steps.length) * 100}%` }}></div>
        </div>
        <p className="text-slate-400 font-mono text-sm h-6 transition-opacity duration-300">
          {">"} {txt.steps[stepIndex]}
        </p>
      </div>
    </div>
  );
};
