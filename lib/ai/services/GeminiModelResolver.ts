/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * Organization    : ROOTYM Agro Harvest Pvt. Ltd.
 *
 * Module          : AI Services
 * Component       : GeminiModelResolver
 *
 * Description
 * ------------------------------------------------------------
 * Discovers available Gemini models,
 * filters supported models,
 * ranks them,
 * and caches results.
 *
 * Responsibilities:
 * • Discover Gemini models
 * • Filter generateContent models
 * • Rank according to ROOTYM priority
 * • Cache available models
 * ============================================================
 */

import { AI_CONFIG } from "@/lib/ai/config/ai";

import modelCache from "@/lib/ai/cache/ModelCache";

import {
  rankGeminiModels,
} from "@/lib/ai/config/GeminiRanking";


export interface ModelResolution {
  models: string[];
  source: "cache" | "api";
}


type GoogleModel = {
  name: string;

  displayName?: string;

  supportedGenerationMethods?: string[];
};


type GoogleModelsResponse = {
  models?: GoogleModel[];
};


export default class GeminiModelResolver {

  constructor(
    private readonly apiKey: string
  ) {}


  /**
   * Timestamp helper
   */
  private timestamp(): string {

    return new Date().toLocaleString(
      "en-IN",
      {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "medium",
      }
    );

  }


  /**
   * Returns available Gemini models.
   *
   * Uses cache when available.
   */
  async getAvailableModels():
    Promise<ModelResolution> {


    console.log(
      "===================================="
    );

    console.log(
      `[${this.timestamp()}] Gemini Model Resolver`
    );


    if (modelCache.isValid()) {


      console.log(
        "Model Cache : HIT"
      );


      console.log(
        `Cache Age   : ${modelCache.getAgeMinutes()} minutes`
      );


      console.log(
        "===================================="
      );


      return {

        models:
          modelCache.getModels(),

        source: "cache",

      };

    }


    console.log(
      "Model Cache : MISS"
    );


    console.log(
      "Discovering Gemini models..."
    );


    console.log(
      "===================================="
    );


    const models =
      await this.discoverModels();


    modelCache.setModels(
      models
    );


    return {

      models,

      source: "api",

    };

  }


  /**
   * Calls Google's model discovery API.
   */
  private async discoverModels():
    Promise<string[]> {


    const endpoint =
      AI_CONFIG.gemini.discoveryEndpoint;


    const response =
      await fetch(

        `${endpoint}?key=${this.apiKey}`,

        {
          method: "GET",

          headers: {
            "Content-Type":
              "application/json",
          },

        }

      );


    if (!response.ok) {

      throw new Error(
        `Gemini model discovery failed (${response.status})`
      );

    }


    const data:
      GoogleModelsResponse =
        await response.json();


    const models =
      data.models ?? [];


      const availableModels =

      models
  
      .filter(
        (model: GoogleModel) => {
  
          const name =
            model.name.replace(
              "models/",
              ""
            );
  
  
          const supportsGenerateContent =
            model.supportedGenerationMethods?.includes(
              "generateContent"
            );
  
  
          const excludedModels = [
            "image",
            "tts",
            "robotics",
            "computer",
            "embedding",
          ];
  
  
          const isExcluded =
            excludedModels.some(
              (keyword) =>
                name.includes(keyword)
            );
  
  
          return (
            name.startsWith("gemini")
            &&
            supportsGenerateContent
            &&
            !isExcluded
          );
  
        }
  
      )


        .map(
          (model: GoogleModel) =>
            model.name.replace(
              "models/",
              ""
            )
        );


    const rankedModels =
      rankGeminiModels(
        availableModels
      );


    console.log(
      `Discovered Models : ${rankedModels.length}`
    );


    rankedModels.forEach(
      (model: string) => {
        console.log(
          `✓ ${model}`
        );
      }
    );


    console.log(
      "===================================="
    );


    return rankedModels;

  }

}