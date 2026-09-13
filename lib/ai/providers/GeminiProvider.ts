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
 *
 * ============================================================
 * Author          : Prem Singh
 * Purpose         : Keep Gemini provider product-agnostic and
 *                   enforce the final application-side privacy
 *                   boundary before conversation content reaches
 *                   the Gemini API.
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
import {
  sanitizeForAI,
} from "@/lib/services/rcaptain/privacy.service";

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
   * Build conversation history.
   *
   * Conversation content is sanitized immediately before being
   * placed into the Gemini prompt. This is a second privacy
   * boundary in addition to the R-CAPTAIN orchestration layer.
   */
  private buildConversationHistory(
    request: AIRequest
  ): string {
    return request.messages
      .map(
        (message) => {
          const safeContent =
            sanitizeForAI(
              message.content
            );

          return `${
            message.role === "user"
              ? "User"
              : "Assistant"
          }:
${safeContent}`;
        }
      )
      .join("\n\n");
  }

  /**
   * Build complete AI prompt.
   *
   * Product/business context is supplied dynamically through
   * request.context by the R-CAPTAIN orchestration layer.
   *
   * This provider intentionally contains no hardcoded product
   * catalogue so the database remains the source of truth.
   *
   * The current user message and conversation history are
   * sanitized before being included in the Gemini prompt.
   */
  private buildPrompt(
    request: AIRequest
  ): string {
    const safeMessage =
      sanitizeForAI(
        request.message
      );

    const safeContext =
      sanitizeForAI(
        request.context ??
          "No live context available."
      );

    return `
${this.getSystemPrompt()}

-----------------------------------------
LIVE R-CAPTAIN CONTEXT
-----------------------------------------
${safeContext}
-----------------------------------------
Conversation History
-----------------------------------------
${this.buildConversationHistory(request)}
-----------------------------------------
Current User Question
-----------------------------------------
${safeMessage}
`;
  }

  /**
   * ROOTYM R-CAPTAIN system prompt.
   *
   * This contains only stable AI behavior and role guidance.
   * Product information must never be hardcoded here.
   */
  private getSystemPrompt(): string {
    return `

You are R-CAPTAIN,

ROOTYM Agro Harvest Pvt. Ltd.'s
AI Export Intelligence Partner.

Your role:

- Help users discover and understand products using the live context supplied to you.
- Explain Indian agricultural exports professionally.
- Guide buyers through export requirements and sourcing.
- Help users understand ROOTYM workflows when such information is supplied in context.
- Ask for details when information required to answer a question is missing.

Communication style:

- Professional
- Trustworthy
- Export focused
- Clear and practical

Knowledge rules:

- Treat live R-CAPTAIN context as the authoritative source for product and customer-specific information.
- Never invent products.
- Never assume a product exists if it is not present in the supplied context.
- Never invent prices, specifications, certifications, availability, lead times, or commercial commitments.
- If required information is not available in the supplied context, clearly say that it is not currently available.
- Do not expose information belonging to another customer or Website.
`;
  }

  /**
   * Convert uploaded image
   * for Gemini vision support.
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
   * Execute one Gemini model.
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
   * Main response generator.
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
     * Emergency fallback.
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
   * Get available Gemini models.
   */
  private async getAvailableModels() {
    const resolver =
      new GeminiModelResolver(
        this.apiKey
      );

    return await resolver.getAvailableModels();
  }

  /**
   * Success logging.
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
   * Failure logging.
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
   * Timestamp helper.
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
