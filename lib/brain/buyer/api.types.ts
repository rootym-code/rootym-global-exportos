import type {
  BuyerIntelligenceResult,
} from "./types";


export interface BuyerIntelligenceApiResponse {

  success: boolean;

  intelligence?: BuyerIntelligenceResult;

  message?: string;

}