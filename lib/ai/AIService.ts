/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * Organization    : ROOTYM Agro Harvest Pvt. Ltd.
 *
 * Module          : AI Service
 * Component       : AIService
 *
 * Description
 * ------------------------------------------------------------
 * Central AI service layer.
 *
 * Responsibilities:
 * • Select AI provider
 * • Route AI requests
 * • Provide common AI interface
 *
 * Used by:
 * • R-CAPTAIN
 * • Future ROOTYM AI modules
 * ============================================================
 */

import { AI_CONFIG } from "@/lib/ai/config/ai";

import {
  AIRequest,
  AIResponse,
} from "@/lib/ai/types";

import {
  AIProvider,
} from "@/lib/ai/interfaces/AIProvider";

import {
  GeminiProvider,
} from "@/lib/ai/providers/GeminiProvider";


export class AIService {

  private provider: AIProvider;


  constructor(
    apiKey: string
  ) {

    switch (
      AI_CONFIG.provider
    ) {


      case "gemini":

        this.provider =
          new GeminiProvider(
            apiKey
          );

        break;


      default:

        throw new Error(
          `Unsupported AI provider: ${AI_CONFIG.provider}`
        );

    }

  }


  async generateResponse(
    request: AIRequest
  ): Promise<AIResponse> {


    return this.provider.generateResponse(
      request
    );

  }

}