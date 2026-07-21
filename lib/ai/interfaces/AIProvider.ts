/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * Organization    : ROOTYM Agro Harvest Pvt. Ltd.
 *
 * Module          : AI Interface
 * Component       : AIProvider
 *
 * Description
 * ------------------------------------------------------------
 * Common contract for all AI providers.
 *
 * Implementations:
 * • GeminiProvider
 * • Future AI providers
 * ============================================================
 */

import type {
  AIRequest,
  AIResponse,
} from "../types";

export interface AIProvider {
  generateResponse(
    request: AIRequest
  ): Promise<AIResponse>;
}