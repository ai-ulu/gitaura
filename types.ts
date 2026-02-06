export enum AnalysisMode {
  MARKETING = "MARKETING",
  CODE_QUALITY = "CODE_QUALITY",
  DOCUMENTATION = "DOCUMENTATION",
  SECURITY = "SECURITY",
}

export enum OutputLanguage {
  TR = "Turkish",
  EN = "English",
}

export type AnalysisType = "SINGLE" | "VERSUS" | "SQUAD";

export interface RepoInfo {
  owner: string;
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  readmeContent: string;
  defaultBranch: string;
}

export interface SocialPost {
  platform: "Twitter" | "LinkedIn";
  content: string;
  hashtags: string[];
}

export interface AnalysisBreakdown {
  codeQuality: number;
  documentation: number;
  virality: number;
  community: number;
  maintenance: number;
}

export interface DeveloperPersona {
  archetype: string; // e.g. "The Code Poet"
  spiritAnimal: string; // e.g. "Owl"
  spiritAnimalEmoji: string; // e.g. "🦉"
  traits: string[]; // e.g. ["Perfectionist", "Minimalist"]
  quote: string; // A tailored quote for this dev
  auraColor: string; // hex code or tailwind color name
}

export interface Fortune {
  cardName: string; // e.g. "The Infinite Loop", "The Unicorn"
  cardEmoji: string; // e.g. "♾️"
  meaning: string; // The metaphorical meaning
  prediction: string; // Future prophecy for the repo
  luckyNumbers: number[]; // e.g. [404, 200]
}

export interface AnalysisResult {
  score: number; // 0-100
  breakdown: AnalysisBreakdown; // Detailed metrics
  rank: string; // e.g., "Unicorn Adayı", "Kod Çırağı"
  summary: string;
  critique: string[]; // "Acı Gerçekler"
  rewrite: {
    original: string; // The part identified as needing rewrite
    improved: string; // The magical rewrite
    explanation: string;
  };
  tips: string[]; // 3 actionable tips
  social: SocialPost[];
  persona: DeveloperPersona; // The soul of the project
  fortune: Fortune; // NEW: The future prediction
}

export interface ComparisonMetric {
  name: string;
  repo1Value: number;
  repo2Value: number;
  winner: 1 | 2 | 0; // 0 for tie
}

export interface ComparisonResult {
  repo1Score: number;
  repo2Score: number;
  winner: 1 | 2 | 0; // 0 for tie
  winnerReason: string;
  metrics: ComparisonMetric[]; // e.g. Code Quality, Popularity, etc.
  keyDifferences: string[];
  recommendation: string; // "Choose Repo A if you need speed..."
}

export interface SquadMember {
  repo: RepoInfo;
  analysis: AnalysisResult;
}

export interface HistoryItem {
  id: string;
  owner: string;
  name: string;
  score: number;
  date: number;
}

export interface AppState {
  status: "IDLE" | "FETCHING_REPO" | "ANALYZING" | "SUCCESS" | "ERROR";
  error: string | null;
  analysisType: AnalysisType;
  repoInfo: RepoInfo | null; // For Single
  repoInfo2?: RepoInfo | null; // For Versus
  analysis: AnalysisResult | null; // For Single
  comparison?: ComparisonResult | null; // For Versus
  squadResults?: SquadMember[]; // For Squad
  rateLimitRemaining?: string;
  history: HistoryItem[];
}
