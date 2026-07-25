import type {
  BuyerContext,
} from "./context";

import type {
  BuyerObservation,
} from "./BuyerSignalExtractor";

import type {
  BuyerReasoningResult,
} from "./BuyerReasoningEngine";

import type {
  BuyerRecommendation,
} from "./BuyerRecommendationEngine";


export interface BuyerIntelligenceResult {

  context: BuyerContext;


  observations: BuyerObservation[];


  reasoning: BuyerReasoningResult;


  recommendation: BuyerRecommendation;


  generatedAt: Date;

}