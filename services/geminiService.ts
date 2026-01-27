// services/geminiService.ts
import {
  AnalysisMode,
  AnalysisResult,
  ComparisonResult,
  OutputLanguage,
  RepoInfo,
} from "../types";
import { loadApiConfig } from "./configService";

/**
 * Analyzes a single repository by sending a request to our secure backend proxy.
 * The backend proxy then calls the Gemini API.
 * @param repo - The repository information.
 * @param mode - The analysis mode.
 * @param lang - The output language.
 * @returns A promise that resolves to the analysis result.
 */
export const analyzeRepoWithGemini = async (
  repo: RepoInfo,
  mode: AnalysisMode,
  lang: OutputLanguage,
): Promise<AnalysisResult> => {
  try {
    const { geminiApiKey } = loadApiConfig();
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "single",
        payload: { repo, mode, lang },
        apiKey: geminiApiKey,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data as AnalysisResult;
  } catch (error) {
    console.error("Frontend service error (single analysis):", error);
    if (error instanceof Error) {
      throw new Error(`Analysis failed: ${error.message}`);
    }
    throw new Error("An unknown error occurred during analysis.");
  }
};

/**
 * Compares two repositories by sending a request to our secure backend proxy.
 * The backend proxy then calls the Gemini API.
 * @param repo1 - The first repository information.
 * @param repo2 - The second repository information.
 * @param lang - The output language.
 * @returns A promise that resolves to the comparison result.
 */
export const compareReposWithGemini = async (
  repo1: RepoInfo,
  repo2: RepoInfo,
  lang: OutputLanguage,
): Promise<ComparisonResult> => {
  try {
    const { geminiApiKey } = loadApiConfig();
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "compare",
        payload: { repo1, repo2, lang },
        apiKey: geminiApiKey,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data as ComparisonResult;
  } catch (error) {
    console.error("Frontend service error (comparison):", error);
    if (error instanceof Error) {
      throw new Error(`Comparison failed: ${error.message}`);
    }
    throw new Error("An unknown error occurred during comparison.");
  }
};
