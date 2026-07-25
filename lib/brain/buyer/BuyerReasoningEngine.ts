import type {
    BuyerContext,
  } from "./context";

  import type {
    BuyerObservation,
  } from "./BuyerSignalExtractor";
  
  
  export interface BuyerReasoningResult {
  
    buyerState: string;
  
    risk: string;
  
    reasoning: string[];
  
    focusAreas: string[];
  
  }
  
  
  
  export class BuyerReasoningEngine {
  
  
    analyze(
      context: BuyerContext,
      observations: BuyerObservation[],
    ): BuyerReasoningResult {
  
  
      const reasoning: string[] = [];
  
      const focusAreas: string[] = [];
  
  
  
      let buyerState =
        "UNKNOWN";
  
  
      let risk =
        "LOW";
  
  
  
      if (
        context.engagement.totalFollowUps > 3
      ) {
  
        buyerState =
          "ACTIVE_REVIEW";
  
  
        risk =
          "MEDIUM";
  
  
        reasoning.push(
          "Buyer requires multiple engagement attempts, indicating an ongoing decision process.",
        );
  
  
        focusAreas.push(
          "Understand buyer decision blockers before next follow-up.",
        );
  
      }
  
  
  
      if (
        context.history.notes.length > 0
      ) {
  
        reasoning.push(
          "Human notes contain additional sales context.",
        );
  
  
        focusAreas.push(
          "Review previous conversation context before contacting buyer.",
        );
  
      }
  
  
  
      if (
        observations.length === 0
      ) {
  
        reasoning.push(
          "Insufficient buyer history available for deeper reasoning.",
        );
  
      }
  
  
  
      if (
        buyerState === "UNKNOWN"
      ) {
  
        buyerState =
          "EARLY_STAGE";
  
      }
  
  
  
      return {
  
        buyerState,
  
        risk,
  
        reasoning,
  
        focusAreas,
  
      };
  
    }
  
  }
  
  
  
  const buyerReasoningEngine =
    new BuyerReasoningEngine();
  
  
  export default buyerReasoningEngine;