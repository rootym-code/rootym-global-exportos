/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * Organization    : ROOTYM Agro Harvest Pvt. Ltd.
 *
 * Module          : AI Configuration
 * Component       : GeminiRanking
 *
 * Description
 * ------------------------------------------------------------
 * Defines ROOTYM preferred Gemini model priority.
 *
 * Responsibilities:
 * • Maintain preferred model order
 * • Rank discovered models
 * • Select best available model
 * ============================================================
 */

export const GEMINI_MODEL_PRIORITY: readonly string[] = [

  // Latest production Flash models
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-flash-latest",
  "gemini-flash-lite-latest",

  // Latest Pro models
  "gemini-pro-latest",
  "gemini-3.1-pro-preview",

  // Legacy fallback
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash",

];
  
  /**
   * Returns highest priority available model.
   */
  export function getBestGeminiModel(
    availableModels: string[]
  ): string | null {
    for (const preferredModel of GEMINI_MODEL_PRIORITY) {
      if (availableModels.includes(preferredModel)) {
        return preferredModel;
      }
    }
  
    return availableModels.length > 0
      ? availableModels[0]
      : null;
  }
  
  /**
   * Sort models according to ROOTYM priority.
   */
  export function rankGeminiModels(
    availableModels: string[]
  ): string[] {
    return [...availableModels].sort((a, b) => {
      const indexA =
        GEMINI_MODEL_PRIORITY.indexOf(a);
  
      const indexB =
        GEMINI_MODEL_PRIORITY.indexOf(b);
  
      if (indexA === -1 && indexB === -1) {
        return a.localeCompare(b);
      }
  
      if (indexA === -1) {
        return 1;
      }
  
      if (indexB === -1) {
        return -1;
      }
  
      return indexA - indexB;
    });
  }