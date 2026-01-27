import React, { useState } from "react";
import {
  AnalysisMode,
  OutputLanguage,
  AppState,
  AnalysisType,
  HistoryItem,
} from "../types";
import { fetchRepoData, parseGithubUrl } from "../services/githubService";
import {
  analyzeRepoWithGemini,
  compareReposWithGemini,
} from "../services/geminiService";
import { saveAnalysis } from "../services/storageService";
import { t } from "../locales";

interface AppStateAndSetters {
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  setAnalysisType: (type: AnalysisType) => void;
  resetApp: () => void;
}

interface HistoryHook {
  history: HistoryItem[];
  addToHistory: (owner: string, name: string, score: number) => void;
  clearHistory: () => void;
}

export const useAnalysis = (
  appStateAndSetters: AppStateAndSetters,
  historyHook: HistoryHook,
  githubToken: string,
  language: OutputLanguage,
  mode: AnalysisMode,
  setShowCopyToast: (show: boolean) => void,
) => {
  const { appState, setAppState } = appStateAndSetters;
  const { addToHistory } = historyHook;
  const txt = t[language];

  const [url, setUrl] = useState("");
  const [url2, setUrl2] = useState("");
  const [squadUrls, setSquadUrls] = useState<string[]>(["", "", ""]);

  const handleSquadUrlChange = (index: number, value: string) => {
    const newUrls = [...squadUrls];
    newUrls[index] = value;
    setSquadUrls(newUrls);
  };

  const addSquadMember = () => {
    if (squadUrls.length < 4) {
      setSquadUrls([...squadUrls, ""]);
    }
  };

  const removeSquadMember = (index: number) => {
    if (squadUrls.length > 2) {
      const newUrls = squadUrls.filter((_, i) => i !== index);
      setSquadUrls(newUrls);
    }
  };

  const generateReportMarkdown = () => {
    if (!appState.analysis || !appState.repoInfo) return "";
    return `# ✦ GitAura ${txt.report.title}

**${txt.results.repo}:** [${appState.repoInfo.owner}/${appState.repoInfo.name}](https://github.com/${appState.repoInfo.owner}/${appState.repoInfo.name})
**${txt.report.date}:** ${new Date().toLocaleDateString(language === OutputLanguage.TR ? "tr-TR" : "en-US")}

## ${appState.analysis.score}/100 • ${appState.analysis.rank}
> "${appState.analysis.summary}"

---

### ${txt.report.metrics}
| Metric | Score |
|--------|------|
| ${txt.results.radarCode} | ${appState.analysis.breakdown.codeQuality}/100 |
| ${txt.results.radarDocs} | ${appState.analysis.breakdown.documentation}/100 |
| ${txt.results.radarViral} | ${appState.analysis.breakdown.virality}/100 |

### ${txt.report.critique}
${appState.analysis.critique.map((c) => `- ${c}`).join("\n")}

---
*${txt.report.footer}*
`;
  };

  const handleDownloadReport = () => {
    if (!appState.analysis || !appState.repoInfo) return;
    const md = generateReportMarkdown();
    const blob = new Blob([md], { type: "text/markdown" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `gitaura-report-${appState.repoInfo.name}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateIssue = () => {
    if (!appState.analysis || !appState.repoInfo) return;
    const md = generateReportMarkdown();
    const title = `GitAura Report: ${appState.analysis.score}/100 (${appState.analysis.rank})`;
    navigator.clipboard.writeText(md);
    setShowCopyToast(true);
    setTimeout(() => setShowCopyToast(false), 4000);
    const issueUrl = `https://github.com/${appState.repoInfo.owner}/${appState.repoInfo.name}/issues/new?title=${encodeURIComponent(title)}`;
    window.open(issueUrl, "_blank");
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setAppState((s: AppState) => ({
      ...s,
      status: "FETCHING_REPO",
      error: null,
    }));

    try {
      if (appState.analysisType === "SINGLE") {
        const parsed1 = parseGithubUrl(url);
        if (!parsed1) throw new Error("Invalid URL format.");
        const { repo, rateLimit } = await fetchRepoData(
          parsed1.owner,
          parsed1.name,
          githubToken,
        );
        setAppState((s: AppState) => ({
          ...s,
          status: "ANALYZING",
          repoInfo: repo,
          rateLimitRemaining: rateLimit,
        }));
        const analysis = await analyzeRepoWithGemini(repo, mode, language);

        // Save analysis to storage
        saveAnalysis("SINGLE", mode, repo, analysis);

        addToHistory(repo.owner, repo.name, analysis.score);
        setAppState((s: AppState) => ({
          ...s,
          status: "SUCCESS",
          analysis,
          comparison: null,
          squadResults: undefined,
          analysisType: "SINGLE",
        }));
      } else if (appState.analysisType === "VERSUS") {
        const parsed1 = parseGithubUrl(url);
        const parsed2 = parseGithubUrl(url2);
        if (!parsed1 || !parsed2) throw new Error("Invalid URL format.");
        const [res1, res2] = await Promise.all([
          fetchRepoData(parsed1.owner, parsed1.name, githubToken),
          fetchRepoData(parsed2.owner, parsed2.name, githubToken),
        ]);
        setAppState((s: AppState) => ({
          ...s,
          status: "ANALYZING",
          repoInfo: res1.repo,
          repoInfo2: res2.repo,
          rateLimitRemaining: res1.rateLimit,
        }));
        const comparison = await compareReposWithGemini(
          res1.repo,
          res2.repo,
          language,
        );

        // Save comparison to storage
        saveAnalysis(
          "VERSUS",
          mode,
          res1.repo,
          { score: Math.max(comparison.repo1Score, comparison.repo2Score) } as any,
          res2.repo,
          comparison,
        );

        setAppState((s: AppState) => ({
          ...s,
          status: "SUCCESS",
          comparison,
          analysis: null,
          squadResults: undefined,
          analysisType: "VERSUS",
        }));
      } else if (appState.analysisType === "SQUAD") {
        const validUrls = squadUrls.filter((u) => u.trim() !== "");
        if (validUrls.length < 2)
          throw new Error(
            language === OutputLanguage.TR
              ? "Çoklu analiz için en az 2 URL."
              : "At least 2 URLs required.",
          );
        const parsedRepos = validUrls.map((u) => parseGithubUrl(u));
        if (parsedRepos.some((p) => p === null))
          throw new Error("Invalid URL format.");
        const fetchPromises = parsedRepos.map((p) =>
          fetchRepoData(p!.owner, p!.name, githubToken),
        );
        const results = await Promise.all(fetchPromises);
        setAppState((s: AppState) => ({
          ...s,
          status: "ANALYZING",
          repoInfo: results[0].repo,
          rateLimitRemaining: results[0].rateLimit,
        }));
        const analysisPromises = results.map((r) =>
          analyzeRepoWithGemini(r.repo, mode, language),
        );
        const analyses = await Promise.all(analysisPromises);
        const squadResults = results.map((r, i) => ({
          repo: r.repo,
          analysis: analyses[i],
        }));

        // Save squad analysis to storage
        const bestResult = squadResults.reduce((prev, curr) =>
          prev.analysis.score > curr.analysis.score ? prev : curr,
        );
        saveAnalysis(
          "SQUAD",
          mode,
          bestResult.repo,
          bestResult.analysis,
          undefined,
          undefined,
          squadResults,
        );

        squadResults.forEach((sr) =>
          addToHistory(sr.repo.owner, sr.repo.name, sr.analysis.score),
        );
        setAppState((s: AppState) => ({
          ...s,
          status: "SUCCESS",
          squadResults,
          comparison: null,
          analysis: null,
          analysisType: "SQUAD",
        }));
      }
    } catch (err: any) {
      setAppState((s: AppState) => ({
        ...s,
        status: "ERROR",
        error: err.message || "Error.",
      }));
    }
  };

  return {
    url,
    setUrl,
    url2,
    setUrl2,
    squadUrls,
    setSquadUrls,
    handleSquadUrlChange,
    addSquadMember,
    removeSquadMember,
    handleAnalyze,
    handleDownloadReport,
    handleCreateIssue,
  };
};
