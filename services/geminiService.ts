import { GoogleGenAI, Chat, GenerateContentResponse, Type } from "@google/genai";
import { GEMINI_MODEL_CHAT, SYSTEM_INSTRUCTION } from "../constants";

let chatSession: Chat | null = null;
let genAI: GoogleGenAI | null = null;

const getAIInstance = (): GoogleGenAI => {
  if (!genAI) {
    // In Vite, env vars are typically import.meta.env.VITE_..., but we shimmed process.env in vite.config.ts
    // You should add VITE_GEMINI_API_KEY to your Vercel Environment Variables
    const apiKey = process.env.API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY || ''; 
    
    // Safety check to prevent crashing if key is missing (though functionality will be limited)
    if (!apiKey) {
        console.warn("Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in your environment.");
    }

    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
};

export const initializeChat = async () => {
  try {
    const ai = getAIInstance();
    chatSession = ai.chats.create({
      model: GEMINI_MODEL_CHAT,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
    return true;
  } catch (error) {
    console.error("Failed to initialize chat:", error);
    return false;
  }
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!chatSession) {
     await initializeChat();
  }
  
  if (!chatSession) {
      return "Error: Could not connect to the neural core. Please check your API key configuration.";
  }

  try {
    const result: GenerateContentResponse = await chatSession.sendMessage({
        message: message
    });
    return result.text || "No response received.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I encountered a glitch in the matrix (API Error). Try again?";
  }
};

// New function to analyze projects in bulk
export const analyzeRepos = async (repos: any[]) => {
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