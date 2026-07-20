import {
    AIRequest,
    AIResponse,
  } from "../types";
  
  export interface AIProvider {
    generateResponse(
      request: AIRequest,
    ): Promise<AIResponse>;
  }