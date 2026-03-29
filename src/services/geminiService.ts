import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function summarizeUrl(url: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Summarize the content of this URL for a digital curator app: ${url}. 
      Provide a title, a brief content overview, and a one-sentence key takeaway. 
      Format as JSON: { "title": "...", "content": "...", "keyTakeaway": "..." }`,
      config: {
        tools: [{ urlContext: {} }],
        responseMimeType: "application/json"
      }
    });

    if (!response.text) {
      throw new Error("No text returned from Gemini API");
    }

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Summarization error:", error);
    throw error;
  }
}
