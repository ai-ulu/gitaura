
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisMode, AnalysisResult, ComparisonResult, OutputLanguage, RepoInfo } from "../types";

// Note: In a real production app, never expose keys in client-side code.
// For this demo/prototype, we rely on the injected process.env.API_KEY.
const getClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.NUMBER, description: "Overall project score out of 100" },
    breakdown: {
      type: Type.OBJECT,
      description: "Detailed score breakdown (0-100)",
      properties: {
        codeQuality: { type: Type.NUMBER, description: "Engineering standards and structure" },
        documentation: { type: Type.NUMBER, description: "Clarity and completeness of README" },
        virality: { type: Type.NUMBER, description: "Marketing appeal and hype potential" },
        community: { type: Type.NUMBER, description: "Contribution friendliness" },
        maintenance: { type: Type.NUMBER, description: " sustainability and update frequency cues" }
      },
      required: ["codeQuality", "documentation", "virality", "community", "maintenance"]
    },
    rank: { type: Type.STRING, description: "A creative rank title like 'Unicorn Adayı' or 'Spagetti Ustası'" },
    summary: { type: Type.STRING, description: "Brief analysis summary" },
    critique: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of 3-4 harsh but true critiques"
    },
    rewrite: {
      type: Type.OBJECT,
      properties: {
        original: { type: Type.STRING, description: "The original weak text segment" },
        improved: { type: Type.STRING, description: "The professionally rewritten version" },
        explanation: { type: Type.STRING, description: "Why this change matters" }
      },
      required: ["original", "improved", "explanation"]
    },
    tips: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3 actionable improvement tips"
    },
    social: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          platform: { type: Type.STRING, enum: ["Twitter", "LinkedIn"] },
          content: { type: Type.STRING },
          hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    },
    persona: {
      type: Type.OBJECT,
      description: "The personality profile of the developer based on the code/readme vibe",
      properties: {
        archetype: { type: Type.STRING, description: "e.g. 'The Perfectionist', 'The Chaos Wizard'" },
        spiritAnimal: { type: Type.STRING, description: "e.g. 'Owl', 'Honey Badger'" },
        spiritAnimalEmoji: { type: Type.STRING, description: "Single emoji" },
        traits: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 personality traits" },
        quote: { type: Type.STRING, description: "A mystical or funny power quote describing their coding style" },
        auraColor: { type: Type.STRING, description: "A CSS color name or hex that fits the vibe (e.g. #FF0055)" }
      },
      required: ["archetype", "spiritAnimal", "spiritAnimalEmoji", "traits", "quote", "auraColor"]
    },
    fortune: {
      type: Type.OBJECT,
      description: "A mystical tarot reading for the repository's future",
      properties: {
        cardName: { type: Type.STRING, description: "Creative Tarot card name (e.g. 'The Deprecated Dependency', 'The IPO')" },
        cardEmoji: { type: Type.STRING, description: "Emoji representing the card" },
        meaning: { type: Type.STRING, description: "What this card signifies for the code" },
        prediction: { type: Type.STRING, description: "A fortune-teller style prediction for the next 6 months" },
        luckyNumbers: { type: Type.ARRAY, items: { type: Type.INTEGER }, description: "4 lucky numbers (e.g. status codes)" }
      },
      required: ["cardName", "cardEmoji", "meaning", "prediction", "luckyNumbers"]
    }
  },
  required: ["score", "breakdown", "rank", "summary", "critique", "rewrite", "tips", "social", "persona", "fortune"]
};

const COMPARISON_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    repo1Score: { type: Type.NUMBER },
    repo2Score: { type: Type.NUMBER },
    winner: { type: Type.INTEGER, description: "1 for Repo 1, 2 for Repo 2, 0 for Tie" },
    winnerReason: { type: Type.STRING, description: "Why the winner won" },
    metrics: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Metric name e.g. Documentation" },
          repo1Value: { type: Type.NUMBER, description: "Score 0-100" },
          repo2Value: { type: Type.NUMBER, description: "Score 0-100" },
          winner: { type: Type.INTEGER, description: "1, 2, or 0" }
        }
      }
    },
    keyDifferences: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3-4 key technical or marketing differences"
    },
    recommendation: { type: Type.STRING, description: "Final verdict: which one to use when?" }
  },
  required: ["repo1Score", "repo2Score", "winner", "winnerReason", "metrics", "keyDifferences", "recommendation"]
};

export const analyzeRepoWithGemini = async (
  repo: RepoInfo,
  mode: AnalysisMode,
  lang: OutputLanguage
): Promise<AnalysisResult> => {
  
  const ai = getClient();
  const modelId = "gemini-2.5-flash"; 

  let modeInstruction = "";
  switch (mode) {
    case AnalysisMode.MARKETING:
      modeInstruction = "Focus on: Virality, clear value proposition, 'hook' in the first paragraph, and visual appeal description.";
      break;
    case AnalysisMode.CODE_QUALITY:
      modeInstruction = "Focus on: Engineering structure mentioned in README, installation clarity, contribution guidelines, and technical robustness cues.";
      break;
    case AnalysisMode.DOCUMENTATION:
      modeInstruction = "Focus on: Ease of use, examples, API reference clarity, and 'Grandma-proof' instructions.";
      break;
  }

  const prompt = `
    You are 'GitAura', a brutal but highly effective Project Coach for developers with a mystical twist.
    
    Analyze this GitHub Repository README.
    
    Repository Name: ${repo.owner}/${repo.name}
    Description: ${repo.description}
    Stars: ${repo.stars}
    Main Language: ${repo.language}
    
    README CONTENT (Truncated first 8000 chars):
    ${repo.readmeContent.substring(0, 8000)}
    
    ---
    
    YOUR MISSION:
    1. Analyze based on mode: ${modeInstruction}
    2. Provide output in language: ${lang}
    3. Be honest. If it's bad, say it's bad (with wit).
    4. Provide specific scores (0-100) for Code Quality, Documentation, Virality, Community, and Maintenance based on your assessment of the project's state.
    5. For the 'rewrite' section, find the boring introduction or 'About' section and rewrite it to be extremely professional and catchy.
    6. Generate a viral Tweet and a professional LinkedIn post based on the project's actual value.
    7. PSYCHOANALYZE THE DEVELOPER: Determine their 'Developer Persona' (Archetype, Spirit Animal, Aura).
    8. TELL THEIR FORTUNE: Draw a custom 'Developer Tarot Card' (e.g. 'The Infinite Loop', 'The 10x Engineer', 'The Abandonedware'). Predict the repo's future in 6 months.
    
    Return strict JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No response from AI");

    const data = JSON.parse(resultText) as AnalysisResult;
    return data;
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw new Error("Yapay zeka analizi sırasında bir hata oluştu. Lütfen tekrar deneyin.");
  }
};

export const compareReposWithGemini = async (
  repo1: RepoInfo,
  repo2: RepoInfo,
  lang: OutputLanguage
): Promise<ComparisonResult> => {
  const ai = getClient();
  const modelId = "gemini-2.5-flash";

  const prompt = `
    You are 'GitAura', a brutal but highly effective Project Coach and Tech Critic.
    
    COMPARE these two GitHub Repositories based on their descriptions and README content.

    REPO 1:
    Name: ${repo1.owner}/${repo1.name}
    Description: ${repo1.description}
    Stars: ${repo1.stars}
    Language: ${repo1.language}
    Readme Sample: ${repo1.readmeContent.substring(0, 3000)}

    REPO 2:
    Name: ${repo2.owner}/${repo2.name}
    Description: ${repo2.description}
    Stars: ${repo2.stars}
    Language: ${repo2.language}
    Readme Sample: ${repo2.readmeContent.substring(0, 3000)}

    ---

    YOUR MISSION:
    1. Determine a WINNER based on: Code Quality (inferred), Documentation Clarity, Popularity (Stars), and Overall Vibe.
    2. Provide output in language: ${lang}
    3. Compare 5 key metrics: "Code Quality", "Documentation", "Community/Stars", "Maintenance", "Innovation".
    4. Highlight 3-4 Key Differences.
    5. Give a final recommendation on which one to choose for what scenario.

    Return strict JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: COMPARISON_SCHEMA
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No response from AI");

    const data = JSON.parse(resultText) as ComparisonResult;
    return data;
  } catch (error) {
    console.error("Gemini Comparison Failed:", error);
    throw new Error("Karşılaştırma analizi sırasında bir hata oluştu.");
  }
};
