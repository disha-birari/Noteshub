import { GoogleGenerativeAI, Content } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Summarizes a piece of text (like note descriptions or extracted text)
 */
export const summarizeText = async (text: string) => {
  if (!apiKey) throw new Error("Gemini API Key is missing");
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const prompt = `You are an academic assistant. Please provide a concise, structured summary of the following student notes. Use bullet points and highlight key concepts: \n\n ${text}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Gemini AI Summary Error:", error);
    throw error;
  }
};

/**
 * Chat with the AI about a specific topic
 */
export const chatWithAI = async (history: { role: string; parts: string }[], message: string) => {
  if (!apiKey) throw new Error("Gemini API Key is missing");

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    
    // Convert history to the format required by GoogleGenerativeAI
    const formattedHistory: Content[] = history.map(item => ({
      role: item.role === 'model' ? 'model' : 'user',
      parts: [{ text: item.parts }]
    }));

    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Gemini AI Chat Error:", error);
    throw error;
  }
};
