/**
 * ============================================================
 * ROOTYM Brain
 * File: lib/brain/inquiry/BuyerScorer.ts
 *
 * Buyer Quality Scoring
 * ============================================================
 */

import {
    scoringEngine,
    type ScoringInput,
    type ScoringResult,
  } from "./ScoringEngine";
  
  export interface BuyerScoreResult extends ScoringResult {
    buyerScore: number;
    grade: "A" | "B" | "C" | "D";
  }
  
  export class BuyerScorer {
    calculate(input: ScoringInput): BuyerScoreResult {
      const scoring = scoringEngine.calculate(input);
  
      const buyerScore = scoring.totalScore;
  
      let grade: BuyerScoreResult["grade"] = "D";
  
      if (buyerScore >= 90) {
        grade = "A";
      } else if (buyerScore >= 75) {
        grade = "B";
      } else if (buyerScore >= 50) {
        grade = "C";
      }
  
      return {
        ...scoring,
        buyerScore,
        grade,
      };
    }
  }
  
  export const buyerScorer = new BuyerScorer();
  
  export default buyerScorer;