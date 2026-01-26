import { useState } from "react";
import { AppState, AnalysisType } from "../types";

export const useAppState = () => {
  const [appState, setAppState] = useState<AppState>({
    status: "IDLE",
    error: null,
    analysisType: "SINGLE",
    repoInfo: null,
    repoInfo2: null,
    analysis: null,
    comparison: null,
    squadResults: undefined,
    rateLimitRemaining: undefined,
    history: [],
  });

  const setAnalysisType = (type: AnalysisType) => {
    setAppState((prev) => ({ ...prev, analysisType: type }));
  };

  const resetApp = () => {
    setAppState((prev) => ({
      ...prev,
      status: "IDLE",
      error: null,
      repoInfo: null,
      repoInfo2: null,
      analysis: null,
      comparison: null,
      squadResults: undefined,
    }));
  };

  return { appState, setAppState, setAnalysisType, resetApp };
};
