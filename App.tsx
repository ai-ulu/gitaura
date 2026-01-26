// App.tsx (FINAL REFACTORED VERSION)
import React, { useState, useEffect } from "react";
import { AnalysisMode, OutputLanguage, AnalysisType } from "./types";
import { useAppState } from "./hooks/useAppState";
import { useHistory } from "./hooks/useHistory";
import { useAnalysis } from "./hooks/useAnalysis";

// All UI Components are imported
import { AnalysisLoader } from "./components/AnalysisLoader";
import { ScoreCard } from "./components/ScoreCard";
import { CritiqueSection } from "./components/CritiqueSection";
import { MagicalRewrite } from "./components/MagicalRewrite";
import { SocialShare } from "./components/SocialShare";
import { BadgeGenerator } from "./components/BadgeGenerator";
import { RadarChart } from "./components/RadarChart";
import { HistoryList } from "./components/HistoryList";
import { SettingsModal } from "./components/SettingsModal";
import { PricingModal } from "./components/PricingModal";
import { PremiumLock } from "./components/PremiumLock";
import { ComparisonView } from "./components/ComparisonView";
import { SquadView } from "./components/SquadView";
import { PersonaCard } from "./components/PersonaCard";
import { FortuneTeller } from "./components/FortuneTeller";
import { Confetti } from "./components/Confetti";
import { t } from "./locales";

function App() {
  // --- Local UI-only State ---
  const [mode, setMode] = useState<AnalysisMode>(AnalysisMode.MARKETING);
  const [language, setLanguage] = useState<OutputLanguage>(OutputLanguage.TR);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [githubToken, setGithubToken] = useState("");
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // --- Custom Hooks for Logic and State Management ---
  const appStateAndSetters = useAppState();
  const { appState, setAppState, setAnalysisType, resetApp } =
    appStateAndSetters;
  const historyHook = useHistory(appState, setAppState);
  const analysisHook = useAnalysis(
    appStateAndSetters,
    historyHook,
    githubToken,
    language,
    mode,
    setShowCopyToast,
  );

  const txt = t[language];

  // --- Effects ---
  useEffect(() => {
    const savedToken = localStorage.getItem("gitaura_github_token");
    if (savedToken) setGithubToken(savedToken);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        e.key === "Enter" &&
        appState.status === "IDLE"
      ) {
        document.querySelector("form")?.requestSubmit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [appState.status]);

  useEffect(() => {
    if (appState.status === "SUCCESS") {
      const score = appState.analysis?.score ?? 0;
      const compWinner = Math.max(
        appState.comparison?.repo1Score ?? 0,
        appState.comparison?.repo2Score ?? 0,
      );
      const squadWinner = Math.max(
        ...(appState.squadResults?.map((r) => r.analysis.score) ?? [0]),
      );
      if (score >= 80 || compWinner >= 80 || squadWinner >= 80) {
        setShowConfetti(true);
        const timer = setTimeout(() => setShowConfetti(false), 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [appState]);

  // --- UI Event Handlers ---
  const handleSaveToken = (token: string) => {
    setGithubToken(token);
    localStorage.setItem("gitaura_github_token", token);
  };
  const handleHistorySelect = (selectedUrl: string) => {
    analysisHook.setUrl(selectedUrl);
    setAnalysisType("SINGLE");
  };
  const handleFullReset = () => {
    analysisHook.setUrl("");
    analysisHook.setUrl2("");
    analysisHook.setSquadUrls(["", "", ""]);
    setAnalysisType("SINGLE");
    setShowConfetti(false);
    resetApp();
  };
  const handleUpgradeToPro = () => {
    setIsPro(true);
    setIsPricingOpen(false);
    alert("Aura Pro Activated!");
  };
  const handleCompareThis = () => {
    if (!appState.repoInfo) return;
    const currentRepoUrl = `https://github.com/${appState.repoInfo.owner}/${appState.repoInfo.name}`;
    analysisHook.setUrl(currentRepoUrl);
    analysisHook.setUrl2("");
    setAnalysisType("VERSUS");
    resetApp();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // --- Render ---
  return (
    <div className="min-h-screen text-slate-200 selection:bg-primary/30 pb-20 font-sans relative">
      {showConfetti && <Confetti />}

      {showCopyToast && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[60] animate-fade-in-up">
          <div className="bg-white text-black px-6 py-3 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center gap-3 font-medium">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            {txt.common.copied}
          </div>
        </div>
      )}

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-[20%] left-[20%] w-[60vw] h-[60vw] bg-primary/5 rounded-full blur-[150px] animate-pulse-slow"></div>
        <div className="absolute top-[40%] -right-[10%] w-[40vw] h-[40vw] bg-secondary/5 rounded-full blur-[120px]"></div>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveToken}
        initialToken={githubToken}
        lang={language}
      />
      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        onUpgrade={handleUpgradeToPro}
        lang={language}
      />

      <nav className="fixed top-0 w-full z-40 bg-background/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={handleFullReset}
          >
            <div className="w-4 h-4 bg-primary rounded-sm group-hover:rotate-45 transition-transform duration-500"></div>
            <span className="font-display font-bold text-2xl tracking-tighter text-white">
              GitAura
            </span>
            {isPro && (
              <span className="text-[10px] bg-white text-black font-bold px-1.5 py-0.5 rounded-sm tracking-widest">
                PRO
              </span>
            )}
          </div>
          <div className="flex items-center gap-6">
            <div className="flex gap-1 bg-white/5 p-1 rounded-full border border-white/5">
              <button
                onClick={() => setLanguage(OutputLanguage.TR)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${language === OutputLanguage.TR ? "bg-white text-black" : "text-slate-400 hover:text-white"}`}
              >
                TR
              </button>
              <button
                onClick={() => setLanguage(OutputLanguage.EN)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${language === OutputLanguage.EN ? "bg-white text-black" : "text-slate-400 hover:text-white"}`}
              >
                EN
              </button>
            </div>
            <button
              onClick={() => setIsPricingOpen(true)}
              className="hidden md:block text-xs font-bold tracking-widest uppercase hover:text-primary transition-colors"
            >
              {txt.common.goPro}
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-white text-slate-400 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 mt-32 relative z-10">
        {(appState.status === "IDLE" || appState.status === "ERROR") && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 space-y-6">
              <div className="inline-block border border-primary/30 px-4 py-1.5 rounded-full bg-primary/5 text-primary text-xs font-mono font-bold tracking-widest uppercase mb-4 animate-glow">
                {txt.hero.badge}
              </div>
              <h1 className="font-display text-6xl md:text-8xl font-bold text-white tracking-tighter leading-[0.9]">
                {txt.hero.titleStart}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
                  {txt.hero.titleEnd}
                </span>
              </h1>
              <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
                {txt.hero.subtitle}
              </p>
            </div>
            <div className="flex justify-center mb-8">
              <div className="inline-flex bg-white/5 p-1 rounded-lg backdrop-blur-md border border-white/5">
                {[
                  { id: "SINGLE", label: txt.hero.modes.single },
                  { id: "VERSUS", label: txt.hero.modes.versus },
                  { id: "SQUAD", label: txt.hero.modes.squad },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setAnalysisType(m.id as AnalysisType)}
                    className={`px-6 py-2 rounded-md text-xs font-bold tracking-wider transition-all duration-300 ${appState.analysisType === m.id ? "bg-white text-black shadow-lg" : "text-slate-400 hover:text-white"}`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
            <form
              onSubmit={analysisHook.handleAnalyze}
              className="glass-panel p-8 rounded-3xl relative overflow-hidden transition-all duration-500 hover:border-white/20"
            >
              <div className="relative z-10 space-y-6">
                {appState.analysisType === "SINGLE" && (
                  <input
                    type="url"
                    placeholder={txt.hero.inputPlaceholder}
                    className="w-full bg-transparent border-b border-white/20 py-4 text-2xl md:text-3xl font-display text-white placeholder-white/20 focus:border-primary focus:outline-none transition-all font-light"
                    value={analysisHook.url}
                    onChange={(e) => analysisHook.setUrl(e.target.value)}
                    required
                  />
                )}
                {appState.analysisType === "VERSUS" && (
                  <div className="space-y-8">
                    <input
                      type="url"
                      placeholder={txt.hero.yourRepo}
                      className="w-full bg-transparent border-b border-white/20 py-4 text-xl font-display text-white placeholder-white/20 focus:border-primary focus:outline-none transition-all"
                      value={analysisHook.url}
                      onChange={(e) => analysisHook.setUrl(e.target.value)}
                      required
                    />
                    <input
                      type="url"
                      placeholder={txt.hero.competitorRepo}
                      className="w-full bg-transparent border-b border-white/20 py-4 text-xl font-display text-white placeholder-white/20 focus:border-secondary focus:outline-none transition-all"
                      value={analysisHook.url2}
                      onChange={(e) => analysisHook.setUrl2(e.target.value)}
                      required
                    />
                  </div>
                )}
                {appState.analysisType === "SQUAD" && (
                  <div className="grid md:grid-cols-2 gap-4">
                    {analysisHook.squadUrls.map((sUrl, idx) => (
                      <div key={idx} className="relative">
                        <span className="absolute left-0 top-4 text-xs font-mono text-slate-600">
                          0{idx + 1}
                        </span>
                        <input
                          type="url"
                          placeholder={txt.hero.inputPlaceholder}
                          className="w-full bg-transparent border-b border-white/20 py-3 pl-8 text-lg font-display text-white placeholder-white/20 focus:border-accent focus:outline-none transition-all"
                          value={sUrl}
                          onChange={(e) =>
                            analysisHook.handleSquadUrlChange(
                              idx,
                              e.target.value,
                            )
                          }
                          required={idx < 2}
                        />
                        {analysisHook.squadUrls.length > 2 && (
                          <button
                            type="button"
                            onClick={() => analysisHook.removeSquadMember(idx)}
                            className="absolute right-0 top-3 text-white/20 hover:text-white"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                    {analysisHook.squadUrls.length < 4 && (
                      <button
                        type="button"
                        onClick={analysisHook.addSquadMember}
                        className="w-full border border-dashed border-white/20 py-3 text-slate-400 hover:text-white hover:border-white transition-all rounded-lg text-sm font-mono"
                      >
                        {txt.hero.addRepo}
                      </button>
                    )}
                  </div>
                )}
                <div className="flex flex-col md:flex-row gap-4 pt-4 items-center">
                  {appState.analysisType === "SINGLE" && (
                    <div className="flex gap-2 flex-wrap">
                      {(
                        [
                          "MARKETING",
                          "CODE_QUALITY",
                          "DOCUMENTATION",
                          "SECURITY",
                        ] as AnalysisMode[]
                      ).map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setMode(m)}
                          className={`px-3 py-1.5 rounded text-[10px] font-bold border transition-all uppercase tracking-wider ${mode === m ? "bg-white text-black border-white" : "text-slate-500 border-slate-800 hover:border-slate-500"}`}
                        >
                          {m === "CODE_QUALITY"
                            ? txt.hero.analysisModes.codeQuality
                            : txt.hero.analysisModes[
                                m.toLowerCase() as keyof typeof txt.hero.analysisModes
                              ]}
                        </button>
                      ))}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={
                      appState.status === "FETCHING_REPO" ||
                      appState.status === "ANALYZING"
                    }
                    className="ml-auto bg-white text-black px-10 py-4 rounded-full font-bold tracking-widest uppercase hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(217,249,157,0.4)]"
                  >
                    {appState.status === "FETCHING_REPO"
                      ? "..."
                      : appState.analysisType === "SQUAD"
                        ? txt.hero.buttons.analyzeAll
                        : appState.analysisType === "VERSUS"
                          ? txt.hero.buttons.compare
                          : txt.hero.buttons.analyze}
                  </button>
                </div>
              </div>
              {appState.error && (
                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-200 text-sm rounded-lg font-mono">
                  <span className="font-bold mr-2">ERROR:</span>{" "}
                  {appState.error}
                  {appState.error.includes("limit") && (
                    <button
                      onClick={() => setIsSettingsOpen(true)}
                      className="ml-2 underline text-white"
                    >
                      {txt.hero.buttons.tokenError}
                    </button>
                  )}
                </div>
              )}
            </form>
            <HistoryList
              items={historyHook.history}
              onSelect={handleHistorySelect}
              onClear={historyHook.clearHistory}
              lang={language}
            />
          </div>
        )}

        {(appState.status === "FETCHING_REPO" ||
          appState.status === "ANALYZING") && (
          <AnalysisLoader lang={language} />
        )}

        {appState.status === "SUCCESS" && (
          <div className="animate-fade-in-up pb-20">
            {appState.analysisType === "SINGLE" &&
              appState.analysis &&
              appState.repoInfo && (
                <div className="glass-panel rounded-[2rem] p-8 md:p-12 mb-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-radial from-primary/10 to-transparent opacity-50 blur-3xl pointer-events-none group-hover:opacity-70 transition-opacity duration-1000"></div>
                  <div className="relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12 border-b border-white/5 pb-12">
                      <div className="space-y-4">
                        <div className="inline-flex items-center gap-3">
                          <h2 className="text-4xl md:text-6xl font-display font-bold text-white tracking-tighter">
                            {appState.repoInfo.name}
                          </h2>
                          <span className="px-3 py-1 rounded-full border border-white/20 text-xs font-mono text-slate-300 uppercase tracking-wider">
                            {appState.repoInfo.language}
                          </span>
                        </div>
                        <p className="text-slate-400 font-light text-lg max-w-2xl leading-relaxed">
                          "{appState.analysis.summary}"
                        </p>
                        <div className="flex gap-4 pt-2">
                          <button
                            onClick={handleCompareThis}
                            className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors border-b border-transparent hover:border-white pb-0.5"
                          >
                            {txt.results.compare}
                          </button>
                          <button
                            onClick={analysisHook.handleDownloadReport}
                            className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors border-b border-transparent hover:border-white pb-0.5"
                          >
                            {txt.common.download}
                          </button>
                          <button
                            onClick={analysisHook.handleCreateIssue}
                            className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors border-b border-transparent hover:border-white pb-0.5"
                          >
                            {txt.results.createIssue || "Issue"}
                          </button>
                        </div>
                      </div>
                      <div className="flex gap-8">
                        <RadarChart
                          data={appState.analysis.breakdown}
                          lang={language}
                        />
                        <ScoreCard
                          score={appState.analysis.score}
                          rank={appState.analysis.rank}
                          lang={language}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                      <div className="lg:col-span-8 space-y-12">
                        <CritiqueSection
                          critiques={appState.analysis.critique}
                          tips={appState.analysis.tips}
                          lang={language}
                        />
                        <MagicalRewrite
                          original={appState.analysis.rewrite.original}
                          improved={appState.analysis.rewrite.improved}
                          explanation={appState.analysis.rewrite.explanation}
                          lang={language}
                        />
                      </div>
                      <div className="lg:col-span-4 space-y-8">
                        <PersonaCard
                          persona={appState.analysis.persona}
                          lang={language}
                        />
                        <FortuneTeller
                          fortune={appState.analysis.fortune}
                          lang={language}
                        />
                        <BadgeGenerator
                          score={appState.analysis.score}
                          lang={language}
                        />
                        <PremiumLock
                          isLocked={!isPro}
                          title={txt.pricing.lockedTitle}
                          desc={txt.pricing.lockedDesc}
                          unlockText={txt.pricing.unlock}
                          onUnlock={() => setIsPricingOpen(true)}
                        >
                          <SocialShare
                            posts={appState.analysis.social}
                            lang={language}
                          />
                        </PremiumLock>
                        <button
                          onClick={handleFullReset}
                          className="w-full py-4 border border-white/10 hover:bg-white hover:text-black text-white rounded-xl transition-all font-bold uppercase tracking-widest text-sm"
                        >
                          {txt.results.completeAnalysis}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            {appState.analysisType === "VERSUS" &&
              appState.comparison &&
              appState.repoInfo &&
              appState.repoInfo2 && (
                <div>
                  <ComparisonView
                    repo1={appState.repoInfo}
                    repo2={appState.repoInfo2}
                    result={appState.comparison}
                    lang={language}
                  />
                  <div className="mt-12 text-center">
                    <button
                      onClick={handleFullReset}
                      className="px-8 py-3 bg-white text-black rounded-full font-bold uppercase tracking-widest hover:bg-primary transition-colors"
                    >
                      {txt.results.newAnalysis}
                    </button>
                  </div>
                </div>
              )}
            {appState.analysisType === "SQUAD" && appState.squadResults && (
              <div>
                <SquadView members={appState.squadResults} lang={language} />
                <div className="mt-12 text-center">
                  <button
                    onClick={handleFullReset}
                    className="px-8 py-3 bg-white text-black rounded-full font-bold uppercase tracking-widest hover:bg-primary transition-colors"
                  >
                    {txt.results.newSquad}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
