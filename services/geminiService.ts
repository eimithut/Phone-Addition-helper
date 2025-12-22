
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message } from "../types";

export const getGeminiResponse = async (history: Message[], userInput: string): Promise<string> => {
  // Safe access to process.env.API_KEY to prevent crashes if undefined
  const apiKey = (typeof process !== 'undefined' && process.env?.API_KEY) ? String(process.env.API_KEY) : "";
  
  if (!apiKey) {
    console.error("Gemini API Key is missing. Please ensure process.env.API_KEY is configured.");
    return "I'm currently resting. Please check my connection settings (API Key).";
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const systemInstruction = `
    You are "Zen", a compassionate digital wellness coach. 
    Your goal is to help the user reduce phone addiction and find joy in offline activities. 
    Be supportive, use a calming tone, and suggest creative "analog" alternatives to scrolling.
    Keep responses concise but insightful. 
    If they are feeling an urge to use their phone, provide a quick mindfulness technique.
  `;

  // Gemini requires the first message in the contents array to be from the 'user'.
  const conversationHistory = history
    .filter((msg, index) => {
      if (index === 0 && msg.role === 'model') return false;
      return true;
    })
    .map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: String(msg.text || "") }]
    }));

  const contents = [
    ...conversationHistory,
    {
      role: 'user',
      parts: [{ text: String(userInput || "") }]
    }
  ];

  try {
    const result: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.8,
        topP: 0.95,
      }
    });

    return result.text || "I'm reflecting on that. Let's take a deep breath together.";
  } catch (error: any) {
    // FIX: Only log the message string to avoid 'cyclic structure' serialization errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Gemini API Error:", errorMessage);
    
    return "I'm having trouble connecting to my digital sanctuary right now. Maybe take a 5-minute offline break while I recover?";
  }
};
