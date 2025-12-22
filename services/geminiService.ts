
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message } from "../types";

export const getGeminiResponse = async (history: Message[], userInput: string): Promise<string> => {
  // Always use the correct initialization with the named apiKey parameter and direct reference to process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    You are "Zen", a compassionate digital wellness coach. 
    Your goal is to help the user reduce phone addiction and find joy in offline activities. 
    Be supportive, use a calming tone, and suggest creative "analog" alternatives to scrolling (like reading, drawing, walking, gardening, or meditation).
    Keep responses concise but insightful. 
    If they are feeling an urge to use their phone, provide a quick mindfulness technique.
  `;

  // Build the contents format for the SDK
  const contents = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model' as any,
    parts: [{ text: msg.text }]
  }));
  
  // Add the new message
  contents.push({
    role: 'user',
    parts: [{ text: userInput }]
  });

  try {
    const result: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents as any,
      config: {
        systemInstruction,
        temperature: 0.8,
        topP: 0.95,
      }
    });

    // Access the .text property directly to retrieve the generated string
    return result.text || "I'm reflecting on that. Let's take a deep breath together.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting to my digital sanctuary right now. Maybe take a 5-minute offline break while I recover?";
  }
};
