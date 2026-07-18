/**
 * ============================================================
 * ROOTYM Brain
 * File: lib/brain/inquiry/index.ts
 * ============================================================
 */

import { brainRegistry } from "../registry";

import { CreateInquiryHandler } from "./CreateInquiryHandler";

let registered = false;

export function registerInquiryBrain(): void {
  if (registered) {
    return;
  }

  brainRegistry.register(
    "CREATE_INQUIRY",
    new CreateInquiryHandler(),
  );

  registered = true;
}

export { default as buyerScorer } from "./BuyerScorer";
export { default as duplicateDetector } from "./DuplicateDetector";
export { default as leadTemperatureEngine } from "./LeadTemperature";
export { default as priorityEngine } from "./PriorityEngine";
export { default as recommendationEngine } from "./RecommendationEngine";
export { default as timelineService } from "./TimelineService";

export * from "./rules";
export * from "./ScoringEngine";
export * from "./PriorityEngine";
export * from "./BuyerScorer";
export * from "./LeadTemperature";
export * from "./DuplicateDetector";
export * from "./RecommendationEngine";
export * from "./TimelineService";
export * from "./CreateInquiryHandler";