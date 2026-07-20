import { AIService } from "@/lib/ai/AIService";

import type {
  AIMessage,
} from "@/lib/ai/types";

export async function generateGeminiResponse(
  prompt: string,
) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is missing",
    );
  }

  const aiService = new AIService(apiKey);

  const messages: AIMessage[] = [];

  const response =
    await aiService.generateResponse({
      message: prompt,
      image: null,
      messages,
    });

  return response.reply;
}