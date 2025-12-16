import { GoogleGenAI, Type } from "@google/genai";
import { GEMINI_MODEL_CHAT, SYSTEM_INSTRUCTION } from "../constants";

let genAI: GoogleGenAI | null = null;

const getAIInstance = (): GoogleGenAI => {
  if (!genAI) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("Gemini API Key is missing. Skipping analysis.");
    }
    genAI = new GoogleGenAI({ apiKey: apiKey || '' });
  }
  return genAI;
};

// Chatbot now runs fully offline; this file only keeps analyzeRepos for optional enrichment.
export const sendMessageToGemini = async (
  _message: string,
  _history?: { role: "user" | "assistant"; content: string }[]
): Promise<string> => {
  return "Offline responder is active.";
};

// New function to analyze projects in bulk
export const analyzeRepos = async (repos: any[]) => {
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    return [];
  }

  const ai = getAIInstance();
  
  // Create a simplified list for the model to process
  const repoSummaries = repos.map(r => ({
    id: r.id,
    name: r.name,
    description: r.description,
    language: r.language,
    topics: r.topics
  }));

  const prompt = `
    Analyze these GitHub repositories.
    1. Filter out any repositories that are definitely NOT related to Machine Learning, Data Science, AI, Web Development or Software Engineering (e.g. random config files).
    2. For each valid project, categorize it into exactly one of these 3 categories based on the "Three Pillars" methodology:
       - "The End-to-End" (Apps, APIs, Deployments, UI, Fullstack)
       - "The Business Value" (Analytics, Dashboards, ROI, Data Cleaning, SQL, EDA)
       - "The Deep Dive" (Research, Math, Algorithms, Low-level Implementations, NLP, CV)
    3. Improve the title to be display-friendly (Capitalized, remove hyphens).
    4. Improve the description to be punchy and professional (under 20 words).
    5. List the key technologies (up to 4) used or inferred.

    Return the result as a JSON array.
    
    Repositories:
    ${JSON.stringify(repoSummaries)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_CHAT,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.NUMBER },
              title: { type: Type.STRING },
              category: { type: Type.STRING, enum: ['The End-to-End', 'The Business Value', 'The Deep Dive'] },
              description: { type: Type.STRING },
              technologies: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("JSON Parse error", e);
      return [];
    }

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return [];
  }
};
