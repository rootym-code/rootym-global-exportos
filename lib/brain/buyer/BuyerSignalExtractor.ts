import type {
    BuyerContext,
  } from "./context";
  
  
  export interface BuyerObservation {
  
    observation: string;
  
    confidence: number;
  
    source: string;
  
  }
  
  
  
  export class BuyerSignalExtractor {
  
  
    extract(
      context: BuyerContext,
    ): BuyerObservation[] {
  
  
      const observations: BuyerObservation[] = [];
  
  
  
      if (
        context.engagement.totalFollowUps > 3
      ) {
  
        observations.push({
  
          observation:
            "Buyer has required multiple follow-up attempts, indicating an extended decision cycle.",
  
          confidence:
            0.70,
  
          source:
            "follow-up history",
  
        });
  
      }
  
  
  
      if (
        context.history.activities.length > 0
      ) {
  
        observations.push({
  
          observation:
            "Buyer has a recorded interaction history that can provide additional sales context.",
  
          confidence:
            0.80,
  
          source:
            "activity timeline",
  
        });
  
      }
  
  
  
      if (
        context.history.notes.length > 0
      ) {
  
        observations.push({
  
          observation:
            "Admin notes contain human sales intelligence that should be considered before next action.",
  
          confidence:
            0.90,
  
          source:
            "admin notes",
  
        });
  
      }
  
  
  
      return observations;
  
    }
  
  }
  
  
  
  const buyerSignalExtractor =
    new BuyerSignalExtractor();
  
  
  export default buyerSignalExtractor;