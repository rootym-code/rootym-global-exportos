/**
 * ============================================================
 * ROOTYM Brain
 * File: lib/brain/inquiry/PriorityEngine.ts
 *
 * Calculates Inquiry Priority from the shared ScoringEngine.
 * ============================================================
 */

import { PRIORITY_RULES, type InquiryPriority } from "./rules";
import {
  scoringEngine,
  type ScoringInput,
  type ScoringResult,
} from "./ScoringEngine";

export interface PriorityResult extends ScoringResult {
  priority: InquiryPriority;
}

export class PriorityEngine {
  calculate(input: ScoringInput): PriorityResult {
    const scoring = scoringEngine.calculate(input);

    const priority =
      PRIORITY_RULES.find(
        (rule) => scoring.totalScore >= rule.minScore,
      )?.value ?? "LOW";

    return {
      ...scoring,
      priority,
    };
  }
}

export const priorityEngine = new PriorityEngine();

export default priorityEngine;