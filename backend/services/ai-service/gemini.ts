import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

let genAI: GoogleGenerativeAI | null = null;
if (GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
}

// Generate a deterministic mock embedding if Gemini API key is not configured
const generateMockEmbedding = (text: string): number[] => {
  const embedding = new Array(768).fill(0);
  const words = text.toLowerCase().split(/\s+/);
  for (let i = 0; i < 768; i++) {
    let sum = 0;
    words.forEach((word, wordIdx) => {
      const charCode = word.charCodeAt(i % word.length) || 0;
      sum += charCode * (wordIdx + 1);
    });
    embedding[i] = Math.sin(sum + i) * 0.5;
  }
  // Normalize vector
  let norm = 0;
  for (let i = 0; i < 768; i++) norm += embedding[i] * embedding[i];
  norm = Math.sqrt(norm);
  if (norm > 0) {
    for (let i = 0; i < 768; i++) embedding[i] /= norm;
  }
  return embedding;
};

export const getEmbedding = async (text: string): Promise<number[]> => {
  if (!genAI) {
    return generateMockEmbedding(text);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error(`[Gemini Error] Embedding generation failed: ${(error as Error).message}. Falling back to mock embedding.`);
    return generateMockEmbedding(text);
  }
};

export const generateText = async (prompt: string, systemInstruction?: string): Promise<string> => {
  if (!genAI) {
    return `[Mock AI Response] Since GEMINI_API_KEY is not configured in your environment, I am answering with a mock text. You asked: "${prompt}"`;
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });
    
    let contents: any = prompt;
    if (systemInstruction) {
      contents = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] }
      };
    }
    
    const result = await model.generateContent(contents);
    return result.response.text();
  } catch (error) {
    console.error(`[Gemini Error] Text generation failed: ${(error as Error).message}`);
    return `[AI Error] Failed to generate response from Gemini API: ${(error as Error).message}`;
  }
};
