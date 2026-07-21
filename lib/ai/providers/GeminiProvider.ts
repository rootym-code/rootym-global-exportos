/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * Organization    : ROOTYM Agro Harvest Pvt. Ltd.
 *
 * Module          : AI Provider
 * Component       : GeminiProvider
 *
 * Description
 * ------------------------------------------------------------
 * Production Gemini AI provider.
 *
 * Responsibilities:
 * • Gemini initialization
 * • Prompt construction
 * • Conversation history
 * • Model failover
 * • Error handling
 * • Response validation
 * ============================================================
 */

import { GoogleGenAI } from "@google/genai";

import { AI_CONFIG } from "@/lib/ai/config/ai";

import GeminiModelResolver from "@/lib/ai/services/GeminiModelResolver";

import {
  AIRequest,
  AIResponse,
} from "@/lib/ai/types";

import {
  AIProvider,
} from "@/lib/ai/interfaces/AIProvider";


type GeminiImagePart = {
  inlineData: {
    data: string;
    mimeType: string;
  };
};


export class GeminiProvider
  implements AIProvider {


  private ai: GoogleGenAI;

  private apiKey: string;


  constructor(
    apiKey: string
  ) {

    this.apiKey = apiKey;

    this.ai =
      new GoogleGenAI({
        apiKey,
      });

  }


  /**
   * Build conversation history
   */
  private buildConversationHistory(
    request: AIRequest
  ): string {


    return request.messages
      .map(
        (message) =>
          `${message.role === "user"
            ? "User"
            : "Assistant"}:
${message.content}`
      )
      .join("\n\n");

  }


  /**
   * Build complete AI prompt
   */
  private buildPrompt(
    request: AIRequest
  ): string {
  
  
    return `
  
  ${this.getSystemPrompt()}
  
  -----------------------------------------
  
  ROOTYM PRODUCT KNOWLEDGE
  
  -----------------------------------------
  
  ${request.context ?? "No product knowledge available."}
  
  -----------------------------------------
  
  Conversation History
  
  -----------------------------------------
  
  ${this.buildConversationHistory(request)}
  
  -----------------------------------------
  
  Current User Question
  
  -----------------------------------------
  
  ${request.message}
  
  `;
  
  }








  /**
   * ROOTYM R-CAPTAIN system prompt
   *
   * Temporary internal prompt.
   * Later moved to:
   * lib/systemPrompt/rCaptain.ts
   */
  private getSystemPrompt(): string {

    return `
You are R-CAPTAIN,
ROOTYM Agro Harvest Pvt. Ltd.'s
AI Export Intelligence Partner.

Your role:
- Help global buyers discover ROOTYM products.
- Explain Indian agricultural exports.
- Guide buyers professionally.

ROOTYM exports:
- Phool Makhana
- Basmati Rice
- Wheat
- Dehydrated Onion Powder
- Potato Starch
- Frozen French Fries

Communication style:
- Professional
- Trustworthy
- Export focused

Do not invent prices or commitments.
Ask for details when information is missing.
`;

  }


  /**
   * Convert uploaded image
   * for Gemini vision support
   */
  private async buildImagePart(
    image?: File | null
  ): Promise<GeminiImagePart | null> {


    if (!image) {

      return null;

    }


    const bytes =
      await image.arrayBuffer();


    return {

      inlineData: {

        data:
          Buffer
            .from(bytes)
            .toString("base64"),

        mimeType:
          image.type,

      },

    };

  }
    /**
   * Execute one Gemini model
   */
    private async tryModel(
      model: string,
      prompt: string,
      imagePart: GeminiImagePart | null
    ) {
  
      console.log(
        `Trying Gemini model: ${model}`
      );
  
  
      return await this.ai.models.generateContent({
  
        model,
  
        contents: imagePart
          ? [
              {
                role: "user",
                parts: [
                  {
                    text: prompt,
                  },
                  imagePart,
                ],
              },
            ]
          : prompt,
  
      });
  
    }
  
  
    /**
     * Main response generator
     */
    async generateResponse(
      request: AIRequest
    ): Promise<AIResponse> {
  
  
      const prompt =
        this.buildPrompt(request);
  
  
      const imagePart =
        await this.buildImagePart(
          request.image
        );
  
  
      const {
        models,
        source,
      } =
        await this.getAvailableModels();
  
  
      console.log(
        "===================================="
      );
  
      console.log(
        "ROOTYM AI"
      );
  
      console.log(
        "Model Source:",
        source.toUpperCase()
      );
  
      console.log(
        "Available Models:",
        models.length
      );
  
      console.log(
        "===================================="
      );
  
  
      let result:
        Awaited<
          ReturnType<
            GoogleGenAI["models"]["generateContent"]
          >
        >
        | null = null;
  
  
      let modelUsed = "";
  
      let lastError: unknown = null;
  
  
      for (
        const model of models
      ) {
  
        try {
  
  
          result =
            await this.tryModel(
              model,
              prompt,
              imagePart
            );
  
  
          modelUsed =
            model;
  
  
          break;
  
  
        } catch(error) {
  
  
          lastError =
            error;
  
  
          this.logFailure(
            model,
            error
          );
  
  
          continue;
  
        }
  
      }
  
  
      /**
       * Emergency fallback
       */
      if (!result) {
  
  
        console.warn(
          "Using emergency fallback models..."
        );
  
  
        for (
          const model of
          AI_CONFIG.gemini.preferredModels
        ) {
  
  
          try {
  
  
            result =
              await this.tryModel(
                model,
                prompt,
                imagePart
              );
  
  
            modelUsed =
              model;
  
  
            break;
  
  
          } catch(error) {
  
  
            lastError =
              error;
  
  
            this.logFailure(
              model,
              error
            );
  
          }
  
        }
  
      }
  
  
      if (!result) {
  
  
        throw lastError instanceof Error
  
          ? lastError
  
          : new Error(
              "No Gemini model could generate response."
            );
  
      }
  
  
      const reply =
        result.text?.trim();
  
  
      if (!reply) {
  
        throw new Error(
          "Gemini returned empty response."
        );
  
      }
  
  
      this.logSuccess(
        modelUsed,
        reply.length
      );
  
  
      return {
  
        reply,
  
      };
  
    }
      /**
   * Get available Gemini models
   */
  private async getAvailableModels() {

    const resolver =
      new GeminiModelResolver(
        this.apiKey
      );

    return await resolver.getAvailableModels();

  }


  /**
   * Success logging
   */
  private logSuccess(
    model: string,
    length: number
  ) {

    console.log(
      "===================================="
    );

    console.log(
      "Gemini Provider Success"
    );

    console.log(
      "Model:",
      model
    );

    console.log(
      "Reply Length:",
      length
    );

    console.log(
      "===================================="
    );

  }


  /**
   * Failure logging
   */
  private logFailure(
    model: string,
    error: unknown
  ) {

    console.warn(
      "===================================="
    );

    console.warn(
      "Gemini Model Failed"
    );

    console.warn(
      "Model:",
      model
    );


    if (error instanceof Error) {

      console.warn(
        error.message
      );

    } else {

      console.warn(
        error
      );

    }


    console.warn(
      "Trying next model..."
    );

    console.warn(
      "===================================="
    );

  }


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

}