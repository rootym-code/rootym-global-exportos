/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * Organization    : ROOTYM Agro Harvest Pvt. Ltd.
 *
 * Module          : AI Configuration
 * Component       : AI_CONFIG
 *
 * Description
 * ------------------------------------------------------------
 * Centralized AI configuration for ROOTYM AI services.
 *
 * Used by:
 * • R-CAPTAIN
 * • Future ROOTYM AI modules
 *
 * Responsibilities:
 * • AI provider selection
 * • Gemini model discovery configuration
 * • Fallback configuration
 * • Cache settings
 * ============================================================
 */

export const AI_CONFIG = {
    /**
     * Active AI Provider
     */
    provider: "gemini",
  
    gemini: {
      /**
       * Google Gemini Model Discovery API
       */
      discoveryEndpoint:
        "https://generativelanguage.googleapis.com/v1beta/models",
  
      /**
       * Emergency fallback models.
       *
       * Automatic discovery is preferred.
       * These are used only when discovery fails.
       */
      preferredModels: [
        "gemini-2.5-flash-lite",
        "gemini-2.5-flash",
        "gemini-2.0-flash",
      ],
  
      /**
       * Number of retries per request
       */
      maxRetries: 2,
  
      /**
       * Request timeout
       */
      timeout: 30000,
  
      /**
       * Model discovery cache duration
       */
      cacheDurationHours: 24,
    },
  } as const;