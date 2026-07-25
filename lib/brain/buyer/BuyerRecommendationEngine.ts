import type {
    BuyerReasoningResult,
  } from "./BuyerReasoningEngine";
  
  
  export interface BuyerRecommendation {
  
    recommendedAction: string;
  
    preparation: string[];
  
    confidence: number;
  
  }
  
  
  
  export class BuyerRecommendationEngine {
  
  
    generate(
      reasoning: BuyerReasoningResult,
    ): BuyerRecommendation {
  
  
      const preparation: string[] = [];
  
      let recommendedAction =
        "Review buyer history before next interaction.";
  
  
  
      if (
        reasoning.buyerState ===
        "ACTIVE_REVIEW"
      ) {
  
  
        recommendedAction =
          "Engage buyer after reviewing previous discussions and possible blockers.";
  
  
        preparation.push(
          "Review activity timeline",
        );
  
  
        preparation.push(
          "Understand unresolved buyer concerns",
        );
  
  
      }
  
  
  
      if (
        reasoning.risk ===
        "MEDIUM"
      ) {
  
  
        preparation.push(
          "Avoid assumptions and confirm buyer requirements",
        );
  
  
      }
  
  
  
      return {
  
        recommendedAction,
  
        preparation,
  
        confidence:
          0.70,
  
      };
  
    }
  
  }
  
  
  
  const buyerRecommendationEngine =
    new BuyerRecommendationEngine();
  
  
  export default buyerRecommendationEngine;