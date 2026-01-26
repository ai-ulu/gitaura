import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const ANALYSIS_SCHEMA = {
  type: SchemaType.OBJECT,
  properties: {
    score: {
      type: SchemaType.NUMBER,
      description: "Overall project score out of 100",
    },
    breakdown: {
      type: SchemaType.OBJECT,
      description: "Detailed score breakdown (0-100)",
      properties: {
        codeQuality: {
          type: SchemaType.NUMBER,
          description: "Engineering standards and structure",
        },
        documentation: {
          type: SchemaType.NUMBER,
          description: "Clarity and completeness of README",
        },
        virality: {
          type: SchemaType.NUMBER,
          description: "Marketing appeal and hype potential",
        },
        community: {
          type: SchemaType.NUMBER,
          description: "Contribution friendliness",
        },
        maintenance: {
          type: SchemaType.NUMBER,
          description: " sustainability and update frequency cues",
        },
      },
      required: [
        "codeQuality",
        "documentation",
        "virality",
        "community",
        "maintenance",
      ],
    },
    rank: {
      type: SchemaType.STRING,
      description:
        "A creative rank title like 'Unicorn Adayı' or 'Spagetti Ustası'",
    },
    summary: { type: SchemaType.STRING, description: "Brief analysis summary" },
    critique: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "List of 3-4 harsh but true critiques",
    },
    rewrite: {
      type: SchemaType.OBJECT,
      properties: {
        original: {
          type: SchemaType.STRING,
          description: "The original weak text segment",
        },
        improved: {
          type: SchemaType.STRING,
          description: "The professionally rewritten version",
        },
        explanation: {
          type: SchemaType.STRING,
          description: "Why this change matters",
        },
      },
      required: ["original", "improved", "explanation"],
    },
    tips: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "3 actionable improvement tips",
    },
    social: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          platform: { type: SchemaType.STRING, enum: ["Twitter", "LinkedIn"] },
          content: { type: SchemaType.STRING },
          hashtags: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
          },
        },
      },
    },
    persona: {
      type: SchemaType.OBJECT,
      description:
        "The personality profile of the developer based on the code/readme vibe",
      properties: {
        archetype: {
          type: SchemaType.STRING,
          description: "e.g. 'The Perfectionist', 'The Chaos Wizard'",
        },
        spiritAnimal: {
          type: SchemaType.STRING,
          description: "e.g. 'Owl', 'Honey Badger'",
        },
        spiritAnimalEmoji: {
          type: SchemaType.STRING,
          description: "Single emoji",
        },
        traits: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
          description: "3 personality traits",
        },
        quote: {
          type: SchemaType.STRING,
          description:
            "A mystical or funny power quote describing their coding style",
        },
        auraColor: {
          type: SchemaType.STRING,
          description:
            "A CSS color name or hex that fits the vibe (e.g. #FF0055)",
        },
      },
      required: [
        "archetype",
        "spiritAnimal",
        "spiritAnimalEmoji",
        "traits",
        "quote",
        "auraColor",
      ],
    },
    fortune: {
      type: SchemaType.OBJECT,
      description: "A mystical tarot reading for the repository's future",
      properties: {
        cardName: {
          type: SchemaType.STRING,
          description:
            "Creative Tarot card name (e.g. 'The Deprecated Dependency', 'The IPO')",
        },
        cardEmoji: {
          type: SchemaType.STRING,
          description: "Emoji representing the card",
        },
        meaning: {
          type: SchemaType.STRING,
          description: "What this card signifies for the code",
        },
        prediction: {
          type: SchemaType.STRING,
          description:
            "A fortune-teller style prediction for the next 6 months",
        },
        luckyNumbers: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.INTEGER },
          description: "4 lucky numbers (e.g. status codes)",
        },
      },
      required: [
        "cardName",
        "cardEmoji",
        "meaning",
        "prediction",
        "luckyNumbers",
      ],
    },
  },
  required: [
    "score",
    "breakdown",
    "rank",
    "summary",
    "critique",
    "rewrite",
    "tips",
    "social",
    "persona",
    "fortune",
  ],
};

const COMPARISON_SCHEMA = {
  type: SchemaType.OBJECT,
  properties: {
    repo1Score: { type: SchemaType.NUMBER },
    repo2Score: { type: SchemaType.NUMBER },
    winner: {
      type: SchemaType.INTEGER,
      description: "1 for Repo 1, 2 for Repo 2, 0 for Tie",
    },
    winnerReason: {
      type: SchemaType.STRING,
      description: "Why the winner won",
    },
    metrics: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          name: {
            type: SchemaType.STRING,
            description: "Metric name e.g. Documentation",
          },
          repo1Value: { type: SchemaType.NUMBER, description: "Score 0-100" },
          repo2Value: { type: SchemaType.NUMBER, description: "Score 0-100" },
          winner: { type: SchemaType.INTEGER, description: "1, 2, or 0" },
        },
      },
    },
    keyDifferences: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "3-4 key technical or marketing differences",
    },
    recommendation: {
      type: SchemaType.STRING,
      description: "Final verdict: which one to use when?",
    },
  },
  required: [
    "repo1Score",
    "repo2Score",
    "winner",
    "winnerReason",
    "metrics",
    "keyDifferences",
    "recommendation",
  ],
};

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== "POST") {
    return response.status(405).json({ message: "Method not allowed" });
  }

  const { type, payload } = request.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return response
      .status(500)
      .json({ message: "Gemini API Key is not configured on the server." });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });

  try {
    if (type === "single") {
      const { repo, mode, lang } = payload;

      let modeInstruction = "";
      switch (mode) {
        case "MARKETING":
          modeInstruction =
            "Focus on: Virality, clear value proposition, 'hook' in the first paragraph, and visual appeal description.";
          break;
        case "CODE_QUALITY":
          modeInstruction =
            "Focus on: Engineering structure mentioned in README, installation clarity, contribution guidelines, and technical robustness cues.";
          break;
        case "DOCUMENTATION":
          modeInstruction =
            "Focus on: Ease of use, examples, API reference clarity, and 'Grandma-proof' instructions.";
          break;
        case "SECURITY":
          modeInstruction =
            "Focus on: Potential vulnerabilities mentioned in README, security policy, dependency update frequency, and use of security tools.";
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

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: ANALYSIS_SCHEMA,
        },
      });

      return response.status(200).json(JSON.parse(result.response.text()));
    } else if (type === "compare") {
      const { repo1, repo2, lang } = payload;

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

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: COMPARISON_SCHEMA,
        },
      });

      return response.status(200).json(JSON.parse(result.response.text()));
    } else {
      return response.status(400).json({ message: "Invalid analysis type" });
    }
  } catch (error: any) {
    console.error("Backend API Error:", error);
    return response
      .status(500)
      .json({ message: error.message || "An error occurred during analysis." });
  }
}
