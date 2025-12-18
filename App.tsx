
import React, { useState, useEffect } from 'react';
import { AnalysisMode, AppState, OutputLanguage, HistoryItem, AnalysisType, RepoInfo } from './types';
import { fetchRepoData, parseGithubUrl } from './services/githubService';
import { analyzeRepoWithGemini, compareReposWithGemini } from './services/geminiService';
import { AnalysisLoader } from './components/AnalysisLoader';
import { ScoreCard } from './components/ScoreCard';
import { CritiqueSection } from './components/CritiqueSection';
import { MagicalRewrite } from './components/MagicalRewrite';
import { SocialShare } from './components/SocialShare';
import { BadgeGenerator } from './components/BadgeGenerator';
import { RadarChart } from './components/RadarChart';
import { HistoryList } from './components/HistoryList';
import { SettingsModal } from './components/SettingsModal';
import { PricingModal } from './components/PricingModal';
import { PremiumLock } from './components/PremiumLock';
import { ComparisonView } from './components/ComparisonView';
import { SquadView } from './components/SquadView';
import { PersonaCard } from './components/PersonaCard';
import { FortuneTeller } from './components/FortuneTeller';
import { Confetti } from './components/Confetti';
import { t } from './locales';

function App() {
  const [url, setUrl] = useState('');
  const [url2, setUrl2] = useState('');
  const [squadUrls, setSquadUrls] = useState<string[]>(['', '', '']);
  
  const [analysisType, setAnalysisType] = useState<AnalysisType>('SINGLE');
  const [mode, setMode] = useState<AnalysisMode>(AnalysisMode.MARKETING);
  const [language, setLanguage] = useState<OutputLanguage>(OutputLanguage.TR);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [githubToken, setGithubToken] = useState('');
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const [state, setState] = useState<AppState>({
    status: 'IDLE',
    error: null,
    analysisType: 'SINGLE',
    repoInfo: null,
    repoInfo2: null,
    analysis: null,
    comparison: null,
    squadResults: undefined,
    rateLimitRemaining: undefined,
    history: []
  });

  const txt = t[language];

  useEffect(() => {
    const savedHistory = localStorage.getItem('gitaura_history');
    if (savedHistory) {
      try {
        setState(s => ({ ...s, history: JSON.parse(savedHistory) }));
      } catch (e) {
        console.error("History parse error", e);
      }
    }
    const savedToken = localStorage.getItem('gitaura_github_token');
    if (savedToken) {
      setGithubToken(savedToken);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (state.status !== 'ANALYZING' && state.status !== 'FETCHING_REPO') {
          const form = document.querySelector('form');
          if (form) form.requestSubmit();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.status]);

  const handleSaveToken = (token: string) => {
    setGithubToken(token);
    localStorage.setItem('gitaura_github_token', token);
  };

  const addToHistory = (owner: string, name: string, score: number) => {
    const newItem: HistoryItem = {
      id: `${owner}-${name}-${Date.now()}`,
      owner,
      name,
      score,
      date: Date.now()
    };
    
    setState(prev => {
      const filtered = prev.history.filter(h => h.owner !== owner || h.name !== name);
      const newHistory = [newItem, ...filtered].slice(0, 6);
      localStorage.setItem('gitaura_history', JSON.stringify(newHistory));
      return { ...prev, history: newHistory };
    });
  };

  const clearHistory = () => {
    localStorage.removeItem('gitaura_history');
    setState(s => ({ ...s, history: [] }));
  };

  const handleHistorySelect = (selectedUrl: string) => {
    setUrl(selectedUrl);
    setAnalysisType('SINGLE');
  };

  const handleSquadUrlChange = (index: number, value: string) => {
    const newUrls = [...squadUrls];
    newUrls[index] = value;
    setSquadUrls(newUrls);
  };

  const addSquadMember = () => {
    if (squadUrls.length < 4) {
      setSquadUrls([...squadUrls, '']);
    }
  };

  const removeSquadMember = (index: number) => {
    if (squadUrls.length > 2) {
      const newUrls = squadUrls.filter((_, i) => i !== index);
      setSquadUrls(newUrls);
    }
  };

  const generateReportMarkdown = () => {
    if (!state.analysis || !state.repoInfo) return '';
    return `# ✦ GitAura ${txt.report.title}

**${txt.results.repo}:** [${state.repoInfo.owner}/${state.repoInfo.name}](https://github.com/${state.repoInfo.owner}/${state.repoInfo.name})
**${txt.report.date}:** ${new Date().toLocaleDateString(language === OutputLanguage.TR ? 'tr-TR' : 'en-US')}

## ${state.analysis.score}/100 • ${state.analysis.rank}
> "${state.analysis.summary}"

---

### ${txt.report.metrics}
| Metric | Score |
|--------|------|
| ${txt.results.radarCode} | ${state.analysis.breakdown.codeQuality}/100 |
| ${txt.results.radarDocs} | ${state.analysis.breakdown.documentation}/100 |
| ${txt.results.radarViral} | ${state.analysis.breakdown.virality}/100 |

### ${txt.report.critique}
${state.analysis.critique.map(c => `- ${c}`).join('\n')}

---
*${txt.report.footer}*
`;
  };

  const handleDownloadReport = () => {
    if (!state.analysis || !state.repoInfo) return;
    const md = generateReportMarkdown();
    const blob = new Blob([md], { type: 'text/markdown' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `gitaura-report-${state.repoInfo.name}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateIssue = () => {
    if (!state.analysis || !state.repoInfo) return;
    const md = generateReportMarkdown();
    const title = `GitAura Report: ${state.analysis.score}/100 (${state.analysis.rank})`;
    navigator.clipboard.writeText(md);
    setShowCopyToast(true);
    setTimeout(() => setShowCopyToast(false), 4000);
    const issueUrl = `https://github.com/${state.repoInfo.owner}/${state.repoInfo.name}/issues/new?title=${encodeURIComponent(title)}`;
    window.open(issueUrl, '_blank');
  };

  const handleCompareThis = () => {
    if (!state.repoInfo) return;
    const currentRepoUrl = `https://github.com/${state.repoInfo.owner}/${state.repoInfo.name}`;
    setUrl(currentRepoUrl);
    setUrl2(''); 
    setAnalysisType('VERSUS');
    setState(s => ({
      ...s,
      status: 'IDLE', 
      analysis: null, 
      repoInfo: null
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setState(s => ({ ...s, status: 'FETCHING_REPO', error: null }));
    setShowConfetti(false);

    try {
      if (analysisType === 'SINGLE') {
        const parsed1 = parseGithubUrl(url);
        if (!parsed1) throw new Error('Invalid URL format.');
        const { repo, rateLimit } = await fetchRepoData(parsed1.owner, parsed1.name, githubToken);
        setState(s => ({ ...s, status: 'ANALYZING', repoInfo: repo, rateLimitRemaining: rateLimit }));
        const analysis = await analyzeRepoWithGemini(repo, mode, language);
        addToHistory(repo.owner, repo.name, analysis.score);
        setState(s => ({ ...s, status: 'SUCCESS', analysis, comparison: null, squadResults: undefined, analysisType: 'SINGLE' }));
        if (analysis.score >= 80) { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 5000); }
      } else if (analysisType === 'VERSUS') {
        const parsed1 = parseGithubUrl(url);
        const parsed2 = parseGithubUrl(url2);
        if (!parsed1 || !parsed2) throw new Error('Invalid URL format.');
        const [res1, res2] = await Promise.all([
          fetchRepoData(parsed1.owner, parsed1.name, githubToken),
          fetchRepoData(parsed2.owner, parsed2.name, githubToken)
        ]);
        setState(s => ({ ...s, status: 'ANALYZING', repoInfo: res1.repo, repoInfo2: res2.repo, rateLimitRemaining: res1.rateLimit }));
        const comparison = await compareReposWithGemini(res1.repo, res2.repo, language);
        setState(s => ({ ...s, status: 'SUCCESS', comparison, analysis: null, squadResults: undefined, analysisType: 'VERSUS' }));
        const maxScore = Math.max(comparison.repo1Score, comparison.repo2Score);
        if (maxScore >= 80) { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 5000); }
      } else if (analysisType === 'SQUAD') {
        const validUrls = squadUrls.filter(u => u.trim() !== '');
        if (validUrls.length < 2) throw new Error(language === 'Turkish' ? 'Çoklu analiz için en az 2 URL.' : 'At least 2 URLs required.');
        const parsedRepos = validUrls.map(u => parseGithubUrl(u));
        if (parsedRepos.some(p => p === null)) throw new Error('Invalid URL format.');
        const fetchPromises = parsedRepos.map(p => fetchRepoData(p!.owner, p!.name, githubToken));
        const results = await Promise.all(fetchPromises);
        setState(s => ({ ...s, status: 'ANALYZING', repoInfo: results[0].repo, rateLimitRemaining: results[0].rateLimit }));
        const analysisPromises = results.map(r => analyzeRepoWithGemini(r.repo, mode, language));
        const analyses = await Promise.all(analysisPromises);
        const squadResults = results.map((r, i) => ({ repo: r.repo, analysis: analyses[i] }));
        squadResults.forEach(sr => addToHistory(sr.repo.owner, sr.repo.name, sr.analysis.score));
        setState(s => ({ ...s, status: 'SUCCESS', squadResults, comparison: null, analysis: null, analysisType: 'SQUAD' }));
        const winner = squadResults.sort((a,b) => b.analysis.score - a.analysis.score)[0];
        if (winner && winner.analysis.score >= 80) { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 5000); }
      }
    } catch (err: any) {
      setState(s => ({ ...s, status: 'ERROR', error: err.message || 'Error.' }));
    }
  };

  const resetApp = () => {
    setUrl(''); setUrl2(''); setSquadUrls(['', '', '']); setShowConfetti(false);
    setState(prev => ({ ...prev, status: 'IDLE', error: null, repoInfo: null, repoInfo2: null, analysis: null, comparison: null, squadResults: undefined }));
  };

  const handleUpgradeToPro = () => { setIsPro(true); setIsPricingOpen(false); alert('Aura Pro Activated.'); };

  return (
    <div className="min-h-screen text-slate-200 selection:bg-primary/30 pb-20 font-sans relative">
      {showConfetti && <Confetti />}

      {/* Ambient Spotlights */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute -top-[20%] left-[20%] w-[60vw] h-[60vw] bg-primary/5 rounded-full blur-[150px] animate-pulse-slow"></div>
         <div className="absolute top-[40%] -right-[10%] w-[40vw] h-[40vw] bg-secondary/5 rounded-full blur-[120px]"></div>
      </div>

      {showCopyToast && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[60] animate-fade-in-up">
          <div className="bg-white text-black px-6 py-3 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center gap-3 font-medium">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            {txt.common.copied}
          </div>
        </div>
      )}

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} onSave={handleSaveToken} initialToken={githubToken} lang={language} />
      <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} onUpgrade={handleUpgradeToPro} lang={language} />

      {/* Navbar - Brutalist Minimal */}
      <nav className="fixed top-0 w-full z-40 bg-background/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={resetApp}>
            <div className="w-4 h-4 bg-primary rounded-sm group-hover:rotate-45 transition-transform duration-500"></div>
            <span className="font-display font-bold text-2xl tracking-tighter text-white">GitAura</span>
            {isPro && <span className="text-[10px] bg-white text-black font-bold px-1.5 py-0.5 rounded-sm tracking-widest">PRO</span>}
          </div>
          <div className="flex items-center gap-6">
             <div className="flex gap-1 bg-white/5 p-1 rounded-full border border-white/5">
               <button onClick={() => setLanguage(OutputLanguage.TR)} className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${language === OutputLanguage.TR ? 'bg-white text-black' : 'text-slate-400 hover:text-white'}`}>TR</button>
               <button onClick={() => setLanguage(OutputLanguage.EN)} className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${language === OutputLanguage.EN ? 'bg-white text-black' : 'text-slate-400 hover:text-white'}`}>EN</button>
             </div>
             <button onClick={() => setIsPricingOpen(true)} className="hidden md:block text-xs font-bold tracking-widest uppercase hover:text-primary transition-colors">{txt.common.goPro}</button>
             <button onClick={() => setIsSettingsOpen(true)} className="hover:text-white text-slate-400 transition-colors">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
             </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 mt-32 relative z-10">
        
        {state.status !== 'ANALYZING' && state.status !== 'SUCCESS' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 space-y-6">
              <div className="inline-block border border-primary/30 px-4 py-1.5 rounded-full bg-primary/5 text-primary text-xs font-mono font-bold tracking-widest uppercase mb-4 animate-glow">
                {txt.hero.badge}
              </div>
              <h1 className="font-display text-6xl md:text-8xl font-bold text-white tracking-tighter leading-[0.9]">
                {txt.hero.titleStart} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">{txt.hero.titleEnd}</span>
              </h1>
              <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
                {txt.hero.subtitle}
              </p>
            </div>

            <div className="flex justify-center mb-8">
               <div className="inline-flex bg-white/5 p-1 rounded-lg backdrop-blur-md border border-white/5">
                 {[
                   { id: 'SINGLE', label: txt.hero.modes.single },
                   { id: 'VERSUS', label: txt.hero.modes.versus },
                   { id: 'SQUAD', label: txt.hero.modes.squad }
                 ].map((m) => (
                   <button 
                     key={m.id}
                     onClick={() => setAnalysisType(m.id as AnalysisType)}
                     className={`px-6 py-2 rounded-md text-xs font-bold tracking-wider transition-all duration-300 ${analysisType === m.id ? 'bg-white text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}
                   >
                     {m.label}
                   </button>
                 ))}
               </div>
            </div>

            <form onSubmit={handleAnalyze} className="glass-panel p-8 rounded-3xl relative overflow-hidden transition-all duration-500 hover:border-white/20">
              <div className="relative z-10 space-y-6">
                
                {analysisType === 'SINGLE' && (
                  <div className="group">
                    <input
                      type="url"
                      placeholder={txt.hero.inputPlaceholder}
                      className="w-full bg-transparent border-b border-white/20 py-4 text-2xl md:text-3xl font-display text-white placeholder-white/20 focus:border-primary focus:outline-none transition-all font-light"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      required
                    />
                  </div>
                )}

                {analysisType === 'VERSUS' && (
                  <div className="space-y-8">
                    <input type="url" placeholder={txt.hero.yourRepo} className="w-full bg-transparent border-b border-white/20 py-4 text-xl font-display text-white placeholder-white/20 focus:border-primary focus:outline-none transition-all" value={url} onChange={(e) => setUrl(e.target.value)} required />
                    <input type="url" placeholder={txt.hero.competitorRepo} className="w-full bg-transparent border-b border-white/20 py-4 text-xl font-display text-white placeholder-white/20 focus:border-secondary focus:outline-none transition-all" value={url2} onChange={(e) => setUrl2(e.target.value)} required />
                  </div>
                )}

                {analysisType === 'SQUAD' && (
                  <div className="grid md:grid-cols-2 gap-4">
                    {squadUrls.map((sUrl, idx) => (
                      <div key={idx} className="relative">
                        <span className="absolute left-0 top-4 text-xs font-mono text-slate-600">0{idx+1}</span>
                        <input
                          type="url"
                          placeholder={txt.hero.inputPlaceholder}
                          className="w-full bg-transparent border-b border-white/20 py-3 pl-8 text-lg font-display text-white placeholder-white/20 focus:border-accent focus:outline-none transition-all"
                          value={sUrl}
                          onChange={(e) => handleSquadUrlChange(idx, e.target.value)}
                          required={idx < 2}
                        />
                        {squadUrls.length > 2 && <button type="button" onClick={() => removeSquadMember(idx)} className="absolute right-0 top-3 text-white/20 hover:text-white">×</button>}
                      </div>
                    ))}
                    {squadUrls.length < 4 && (
                      <button type="button" onClick={addSquadMember} className="w-full border border-dashed border-white/20 py-3 text-slate-400 hover:text-white hover:border-white transition-all rounded-lg text-sm font-mono">
                        {txt.hero.addRepo}
                      </button>
                    )}
                  </div>
                )}
                
                <div className="flex flex-col md:flex-row gap-4 pt-4 items-center">
                  {analysisType === 'SINGLE' && (
                    <div className="flex gap-2">
                       {['MARKETING', 'CODE_QUALITY', 'DOCUMENTATION'].map((m) => (
                         <button
                            key={m}
                            type="button"
                            onClick={() => setMode(m as AnalysisMode)}
                            className={`px-3 py-1.5 rounded text-[10px] font-bold border transition-all uppercase tracking-wider ${mode === m ? 'bg-white text-black border-white' : 'text-slate-500 border-slate-800 hover:border-slate-500'}`}
                         >
                           {txt.hero.analysisModes[m === 'MARKETING' ? 'marketing' : m === 'CODE_QUALITY' ? 'codeQuality' : 'documentation']}
                         </button>
                       ))}
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={state.status === 'FETCHING_REPO'}
                    className="ml-auto bg-white text-black px-10 py-4 rounded-full font-bold tracking-widest uppercase hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(217,249,157,0.4)]"
                  >
                    {state.status === 'FETCHING_REPO' ? '...' : (analysisType === 'SQUAD' ? txt.hero.buttons.analyzeAll : analysisType === 'VERSUS' ? txt.hero.buttons.compare : txt.hero.buttons.analyze)}
                  </button>
                </div>
              </div>
              
              {state.error && (
                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-200 text-sm rounded-lg font-mono">
                  <span className="font-bold mr-2">ERROR:</span> {state.error}
                  {state.error.includes("limit") && <button onClick={() => setIsSettingsOpen(true)} className="ml-2 underline text-white">{txt.hero.buttons.tokenError}</button>}
                </div>
              )}
            </form>
            
            <HistoryList items={state.history} onSelect={handleHistorySelect} onClear={clearHistory} lang={language} />
          </div>
        )}

        {state.status === 'ANALYZING' && <AnalysisLoader lang={language} />}

        {/* RESULTS SINGLE */}
        {state.status === 'SUCCESS' && state.analysis && state.repoInfo && state.analysisType === 'SINGLE' && (
          <div className="animate-fade-in-up pb-20">
             <div className="glass-panel rounded-[2rem] p-8 md:p-12 mb-8 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-radial from-primary/10 to-transparent opacity-50 blur-3xl pointer-events-none group-hover:opacity-70 transition-opacity duration-1000"></div>

              <div className="relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12 border-b border-white/5 pb-12">
                   <div className="space-y-4">
                      <div className="inline-flex items-center gap-3">
                         <h2 className="text-4xl md:text-6xl font-display font-bold text-white tracking-tighter">
                           {state.repoInfo.name}
                         </h2>
                         <span className="px-3 py-1 rounded-full border border-white/20 text-xs font-mono text-slate-300 uppercase tracking-wider">{state.repoInfo.language}</span>
                      </div>
                      <p className="text-slate-400 font-light text-lg max-w-2xl leading-relaxed">"{state.analysis.summary}"</p>
                      <div className="flex gap-4 pt-2">
                        <button onClick={handleCompareThis} className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors border-b border-transparent hover:border-white pb-0.5">{txt.results.compare}</button>
                        <button onClick={handleDownloadReport} className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors border-b border-transparent hover:border-white pb-0.5">{txt.common.download}</button>
                      </div>
                   </div>
                   <div className="flex gap-8">
                      <RadarChart data={state.analysis.breakdown} lang={language} />
                      <ScoreCard score={state.analysis.score} rank={state.analysis.rank} lang={language} />
                   </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  <div className="lg:col-span-8 space-y-12">
                     <CritiqueSection critiques={state.analysis.critique} tips={state.analysis.tips} lang={language} />
                     <MagicalRewrite original={state.analysis.rewrite.original} improved={state.analysis.rewrite.improved} explanation={state.analysis.rewrite.explanation} lang={language} />
                  </div>
                  <div className="lg:col-span-4 space-y-8">
                    <PersonaCard persona={state.analysis.persona} lang={language} />
                    <FortuneTeller fortune={state.analysis.fortune} lang={language} />
                    <BadgeGenerator score={state.analysis.score} lang={language} />
                    <PremiumLock isLocked={!isPro} title={txt.pricing.lockedTitle} desc={txt.pricing.lockedDesc} unlockText={txt.pricing.unlock} onUnlock={() => setIsPricingOpen(true)}>
                      <SocialShare posts={state.analysis.social} lang={language} />
                    </PremiumLock>
                    <button onClick={resetApp} className="w-full py-4 border border-white/10 hover:bg-white hover:text-black text-white rounded-xl transition-all font-bold uppercase tracking-widest text-sm">{txt.results.completeAnalysis}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {state.status === 'SUCCESS' && state.comparison && state.analysisType === 'VERSUS' && (
          <div className="pb-20">
             <ComparisonView repo1={state.repoInfo!} repo2={state.repoInfo2!} result={state.comparison!} lang={language} />
             <div className="mt-12 text-center">
                <button onClick={resetApp} className="px-8 py-3 bg-white text-black rounded-full font-bold uppercase tracking-widest hover:bg-primary transition-colors">{txt.results.newAnalysis}</button>
             </div>
          </div>
        )}

        {state.status === 'SUCCESS' && state.squadResults && state.analysisType === 'SQUAD' && (
          <div className="pb-20">
            <SquadView members={state.squadResults} lang={language} />
            <div className="mt-12 text-center">
              <button onClick={resetApp} className="px-8 py-3 bg-white text-black rounded-full font-bold uppercase tracking-widest hover:bg-primary transition-colors">{txt.results.newSquad}</button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
