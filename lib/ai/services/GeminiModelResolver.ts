import { GoogleGenAI } from "@google/genai";

import { AI_CONFIG } from "@/lib/config/ai";

export type ModelResolution = {
  models: string[];
  source: "discovery" | "fallback";
};

export default class GeminiModelResolver {
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


  async getAvailableModels(): Promise<ModelResolution> {

    try {

      const models = await this.ai.models.list();

      const availableModels: string[] = [];


      for await (const model of models) {

        if (
          model.name &&
          model.name.includes("gemini")
        ) {

          availableModels.push(
            model.name.replace(
              "models/",
              "",
            ),
          );

        }

      }


      if (availableModels.length > 0) {

        return {
          models: availableModels,
          source: "discovery",
        };

      }


    } catch (error) {

      console.warn(
        "Gemini model discovery failed:",
        error,
      );

    }


    return {
      models:
        AI_CONFIG.gemini.preferredModels,

      source: "fallback",

    };

  }

}