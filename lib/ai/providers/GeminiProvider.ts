import { GoogleGenAI } from "@google/genai";

import GeminiModelResolver from "@/lib/ai/services/GeminiModelResolver";

import {
  AIRequest,
  AIResponse,
} from "../types";

import {
  AIProvider,
} from "../interfaces/AIProvider";


export class GeminiProvider implements AIProvider {

  private ai: GoogleGenAI;

  private apiKey: string;


  constructor(
    apiKey: string,
  ) {

    this.apiKey = apiKey;

    this.ai = new GoogleGenAI({
      apiKey,
    });

  }


  private buildConversationHistory(
    request: AIRequest,
  ): string {

    return request.messages
      .map(
        (message) =>
          `${message.role === "user"
            ? "User"
            : "Assistant"}:
${message.content}`,
      )
      .join("\n\n");

  }


  private buildPrompt(
    request: AIRequest,
  ): string {

    return `
ROOTYM AI ASSISTANT

Conversation History:

${this.buildConversationHistory(request)}

Current User Question:

${request.message}
`;

  }


  private async tryModel(
    model: string,
    prompt: string,
  ) {

    console.log(
      "Trying Gemini model:",
      model,
    );

    return await this.ai.models.generateContent({
      model,
      contents: prompt,
    });

  }


  async generateResponse(
    request: AIRequest,
  ): Promise<AIResponse> {

    const prompt =
      this.buildPrompt(request);


    const resolver =
      new GeminiModelResolver(
        this.apiKey,
      );


    const {
      models,
      source,
    } =
      await resolver.getAvailableModels();


    console.log(
      "Gemini model source:",
      source,
    );


    let result = null;

    let lastError: unknown = null;


    for (const model of models) {

      try {

        result =
          await this.tryModel(
            model,
            prompt,
          );

        break;

      } catch (error) {

        lastError = error;

        console.warn(
          "Gemini model failed:",
          model,
        );

      }

    }


    if (!result) {

      throw lastError instanceof Error
        ? lastError
        : new Error(
            "No Gemini model available",
          );

    }


    const reply =
      result.text?.trim();


    if (!reply) {

      throw new Error(
        "Gemini returned empty response",
      );

    }


    return {
      reply,
    };

  }

}