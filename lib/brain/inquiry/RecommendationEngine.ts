/**
 * ============================================================
 * ROOTYM Brain
 * File: lib/brain/inquiry/RecommendationEngine.ts
 *
 * Smart Follow-up Recommendation Engine
 * ============================================================
 */

import { FOLLOW_UP_RULES } from "./rules";
import type { InquiryPriority } from "./rules";
import type { LeadTemperature } from "./rules";

export interface RecommendationInput {
  score: number;
  priority: InquiryPriority;
  leadTemperature: LeadTemperature;
  isDuplicate: boolean;
}

export interface RecommendationResult {
  recommendation: string;
  responseTarget: string;
  autoAssignSales: boolean;
  requiresImmediateAction: boolean;
}

export class RecommendationEngine {
  calculate(
    input: RecommendationInput,
  ): RecommendationResult {
    if (input.isDuplicate) {
      return {
        recommendation:
          "Review existing inquiry before creating a new quotation.",
        responseTarget: "Immediate",
        autoAssignSales: false,
        requiresImmediateAction: true,
      };
    }

    const recommendation =
      FOLLOW_UP_RULES.find(
        (rule) => input.score >= rule.minScore,
      )?.recommendation ??
      "Automated acknowledgement only";

    let responseTarget = "Within 24 Hours";

    switch (input.priority) {
      case "URGENT":
        responseTarget = "Within 15 Minutes";
        break;

      case "HIGH":
        responseTarget = "Within 1 Hour";
        break;

      case "MEDIUM":
        responseTarget = "Today";
        break;

      case "LOW":
        responseTarget = "Within 24 Hours";
        break;
    }

    return {
      recommendation,
      responseTarget,
      autoAssignSales:
        input.priority === "HIGH" ||
        input.priority === "URGENT",
      requiresImmediateAction:
        input.priority === "URGENT" ||
        input.leadTemperature === "HOT",
    };
  }
}

export const recommendationEngine =
  new RecommendationEngine();

export default recommendationEngine;