import {
    AI_CONFIG,
  } from "@/lib/config/ai";
  
  import {
    AIRequest,
    AIResponse,
  } from "./types";
  
  import {
    AIProvider,
  } from "./interfaces/AIProvider";
  
  import {
    GeminiProvider,
  } from "./providers/GeminiProvider";
  
  
  export class AIService {
  
    private provider: AIProvider;
  
  
    constructor(
      apiKey: string,
    ) {
  
      switch (AI_CONFIG.provider) {
  
        case "gemini":
  
          this.provider =
            new GeminiProvider(
              apiKey,
            );
  
          break;
  
  
        default:
  
          throw new Error(
            `Unsupported AI provider: ${AI_CONFIG.provider}`,
          );
  
      }
  
    }
  
  
    async generateResponse(
      request: AIRequest,
    ): Promise<AIResponse> {
  
      return this.provider.generateResponse(
        request,
      );
  
    }
  
  }