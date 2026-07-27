/**
 * ============================================================
 * R-CAPTAIN Dashboard Presenter
 * Presentation Layer
 * ============================================================
 *
 * Responsibility:
 * Transform business intelligence into UI-ready view models.
 */

import { PriorityQueueItem } from "./dashboard.types";

export interface PriorityOpportunity {
  id: string;
  buyer: string;
  country: string;
  product: string;
  stage: string;
  revenue: string;
  action: string;
  reason: string;
  aiScore: number;
  confidence: string;
}

/**
 * Build AI Priority Queue
 */
export function buildPriorityQueue(
  items: PriorityQueueItem[]
): PriorityOpportunity[] {
  return items.map((item) => ({
    id: item.id,
    buyer: item.companyName,
    country: item.country,
    product: item.product,
    stage: formatStage(item.status),

    // Placeholder values (will become intelligence-driven)
    revenue: "Pending",
    action: getRecommendedAction(item.status),
    reason: getRecommendationReason(item.status),
    aiScore: calculateAIScore(item.priority),
    confidence: getConfidence(item.priority),
  }));
}

/* ============================================================
   Helper Functions
============================================================ */

function formatStage(status: string): string {
  return status.replaceAll("_", " ");
}

function calculateAIScore(priority: string): number {
  switch (priority) {
    case "URGENT":
      return 98;

    case "HIGH":
      return 90;

    case "MEDIUM":
      return 80;

    default:
      return 70;
  }
}

function getConfidence(priority: string): string {
  switch (priority) {
    case "URGENT":
      return "High Conversion Probability";

    case "HIGH":
      return "Strong Buyer Interest";

    case "MEDIUM":
      return "Active Opportunity";

    default:
      return "Requires Monitoring";
  }
}

function getRecommendedAction(status: string): string {
  switch (status) {
    case "NEGOTIATION":
      return "Call Now";

    case "QUOTATION_SENT":
      return "Send Follow-up";

    case "CONTACTED":
      return "Schedule Discussion";

    default:
      return "Review";
  }
}

function getRecommendationReason(status: string): string {
  switch (status) {
    case "NEGOTIATION":
      return "Buyer is actively negotiating.";

    case "QUOTATION_SENT":
      return "Quotation has been shared. Follow-up is recommended.";

    case "CONTACTED":
      return "Continue buyer engagement.";

    default:
      return "Requires review.";
  }
}