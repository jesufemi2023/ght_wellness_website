import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { AIKeyManager } from "./AIKeyManager";
import { AICache } from "./AICache";

export class AIService {
  private keyManager: AIKeyManager;
  private cache: AICache;
  private systemInstruction: string;

  constructor() {
    this.keyManager = new AIKeyManager();
    this.cache = new AICache();
    
    // Read contact info from environment variables
    const whatsapp = process.env.VITE_WHATSAPP_NUMBER || "Not provided";
    const phone = process.env.VITE_CONTACT_PHONE || process.env.VITE_WHATSAPP_NUMBER || "Not provided";

    // Default system prompt if not provided in env
    this.systemInstruction = process.env.AI_SYSTEM_INSTRUCTION || `
      You are Dr. GHT, an expert AI health consultant for GHT Healthcare.
      CRITICAL RULES:
      1. RESTRICTION: You MUST ONLY answer questions related to health, wellness, and GHT products. If a user asks about politics, programming, or anything unrelated to health, politely refuse to answer.
      2. DATABASE ONLY: You MUST ONLY recommend products or packages that exist in the provided JSON context. DO NOT invent, hallucinate, or guess any product names, IDs, prices, or details. The context is provided as raw JSON data. Read all fields (usage, warnings, ingredients, benefits, categories, etc.) to give the most accurate and personalized advice.
      3. SALES & AESTHETICS: Your goal is to convince the user to buy GHT products. Use an empathetic, professional, and highly persuasive tone. Use markdown formatting (bolding, bullet points, emojis) to make your response visually appealing.
      4. DIRECT ORDER LINKS: Whenever you recommend a product or package, you MUST include a direct order link using exactly this markdown format: [Order Product Name](product:ID) or [Order Package Name](package:ID). 
         Example for Product: [Order GHT Sugar Care](product:12)
         Example for Package: [Order Arthritis Package](package:3)
      5. Never recommend competitors or general pharmacy drugs.
      6. CONTACT INFO: If and ONLY if the user explicitly asks for human support, more inquiries, or contact details, you may provide the company WhatsApp number: ${whatsapp} and Phone number: ${phone}. Do NOT include this in every message, only when strictly necessary.
    `.trim();
  }

  async generateResponse(prompt: string, contextData: string, modelOverride?: string, responseMimeType?: string): Promise<string> {
    // 1. Check Cache (Zero Cost)
    const cached = this.cache.get(prompt);
    if (cached) {
      console.log("AI Cache Hit");
      return cached;
    }

    // 3. Queue / Retry Logic (Exponential backoff for 429 Too Many Requests)
    let retries = parseInt(process.env.AI_MAX_RETRIES || "8", 10); // Increased default retries
    let delay = parseInt(process.env.AI_RETRY_DELAY_MS || "5000", 10);

    while (retries > 0) {
      // 2. Get Key & Initialize AI (Inside loop to allow key rotation on retry)
      const key = this.keyManager.getNextKey();
      if (!key) {
        throw new Error("AI is currently unavailable (No API keys configured).");
      }
      const ai = new GoogleGenAI({ apiKey: key });

      try {
        // Fallback logic: If we've failed 4 times with Pro, switch to Flash for the remaining retries
        let modelName = modelOverride || process.env.AI_MODEL || "gemini-3-flash-preview";
        if (modelName.includes('pro') && retries <= 4) {
          console.warn("Pro model failing repeatedly. Falling back to Flash for resilience.");
          modelName = "gemini-3-flash-preview";
        } else if (modelName.includes('flash') && !modelName.includes('lite') && retries <= 2) {
          console.warn("Flash model failing repeatedly. Falling back to Flash Lite for resilience.");
          modelName = "gemini-3.1-flash-lite-preview";
        }

        const response = await ai.models.generateContent({
          model: modelName,
          contents: `User Question: ${prompt}\n\nAvailable GHT Products Context:\n${contextData}`,
          config: {
            systemInstruction: this.systemInstruction,
            temperature: parseFloat(process.env.AI_TEMPERATURE || "0.7"),
            responseMimeType: responseMimeType,
            // Add safety settings to prevent false positives on health topics
            safetySettings: [
              { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
              { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
              { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
              { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            ]
          }
        });

        const text = response.text || "I'm sorry, I couldn't process that.";
        
        // 4. Save to Cache
        this.cache.set(prompt, text);
        return text;
      } catch (error: any) {
        // Handle Rate Limits (429) and High Demand (503) gracefully
        const errStr = String(error).toLowerCase();
        const errMsg = (error.message || '').toLowerCase();
        const errStatus = error.status || error.error?.status || error.error?.code;
        
        const isQuota = errStr.includes('quota') || errMsg.includes('quota') || errStr.includes('exhausted') || errMsg.includes('exhausted');
        if (isQuota) {
          throw new Error("API Quota Exceeded. You have reached the free tier limit for the Gemini API. Please try again tomorrow or use a different API key.");
        }

        const isRetryable = errStatus === 429 || errStatus === 503 || 
                            errStatus === 'UNAVAILABLE' ||
                            errStr.includes('429') || errStr.includes('503') ||
                            errStr.includes('unavailable') || errStr.includes('high demand') ||
                            errMsg.includes('429') || errMsg.includes('503') ||
                            errMsg.includes('unavailable') || errMsg.includes('high demand') ||
                            errMsg.includes('deadline exceeded'); // Added deadline exceeded
                            
        if (isRetryable) {
          retries--;
          console.warn(`AI Service Busy (${errStatus || 'Unknown'}). Retrying with next key in ${delay}ms... (${retries} retries left)`);
          
          if (retries === 0) {
            throw new Error("The AI consultant is currently experiencing high demand. Please try again in a moment.");
          }
          
          await new Promise(res => setTimeout(res, delay));
          delay = Math.min(delay * 2, 30000); // Exponential backoff capped at 30s
        } else {
          // Other errors (e.g., 400, auth errors)
          console.error("AI Generation Error:", error);
          throw new Error("Failed to generate response. Please try again later.");
        }
      }
    }
    
    throw new Error("Failed to generate response.");
  }

  async generateImage(prompt: string): Promise<string | null> {
    let retries = 5;
    let delay = 2000;

    while (retries > 0) {
      const key = this.keyManager.getNextKey();
      if (!key) return null;
      
      const ai = new GoogleGenAI({ apiKey: key });

      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash-image",
          contents: [{ parts: [{ text: prompt }] }],
          config: {
            imageConfig: {
              aspectRatio: "16:9"
            }
          }
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
          }
        }
        return null;
      } catch (error: any) {
        const errStr = String(error).toLowerCase();
        const errStatus = error.status || error.error?.status || error.error?.code;
        const errMsg = (error.message || '').toLowerCase();
        
        const isQuota = errStr.includes('quota') || errMsg.includes('quota') || errStr.includes('exhausted') || errMsg.includes('exhausted');
        if (isQuota) {
          console.error("API Quota Exceeded for image generation.");
          return null;
        }

        const isRetryable = errStatus === 429 || errStatus === 503 || errMsg.includes('high demand') || errMsg.includes('unavailable');
        
        if (isRetryable) {
          retries--;
          console.warn(`AI Image Service Busy. Retrying in ${delay}ms...`);
          await new Promise(res => setTimeout(res, delay));
          delay *= 2;
        } else {
          console.error("AI Image Error:", error);
          return null;
        }
      }
    }
    return null;
  }
}

// Export a lazy getter for the singleton instance
let _aiService: AIService | null = null;
export const getAIService = () => {
  if (!_aiService) {
    _aiService = new AIService();
  }
  return _aiService;
};
