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
  quotationAge: string;
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

    revenue: formatRevenue(item.quotes),
    quotationAge: getQuotationAge(item.quotes),
    action: getRecommendedAction(item.status, item.quotes),
    reason: getRecommendationReason(item.status, item.quotes),
    aiScore: calculateAIScore(item.priority, item.quotes),
    confidence: getConfidence(item.priority, item.quotes),
  }));
}

/* ============================================================
   Helper Functions
============================================================ */

function formatStage(status: string): string {
  switch (status) {
    case "NEW":
      return "New Inquiry";

    case "CONTACTED":
      return "Contacted";

    case "QUOTATION_SENT":
      return "Quotation Sent";

    case "NEGOTIATION":
      return "Negotiation";

    case "CONFIRMED":
      return "Confirmed";

    case "REJECTED":
      return "Rejected";

    default:
      return status.replaceAll("_", " ");
  }
}

function formatRevenue(
  quotes: {
    currency: string;
    grandTotal: { toString(): string };
  }[]
): string {
  if (quotes.length === 0) {
    return "Pending";
  }

  return `${quotes[0].currency} ${quotes[0].grandTotal.toString()}`;
}

function getQuotationAge(
  quotes: {
    createdAt: Date;
  }[]
): string {
  if (quotes.length === 0) {
    return "No Quote";
  }

  const days = Math.floor(
    (Date.now() - quotes[0].createdAt.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return `${days} day${days === 1 ? "" : "s"}`;
}

function calculateAIScore(
  priority: string,
  quotes: { createdAt: Date }[]
): number {
  let score = 70;

  switch (priority) {
    case "URGENT":
      score = 98;
      break;

    case "HIGH":
      score = 90;
      break;

    case "MEDIUM":
      score = 80;
      break;

    default:
      score = 70;
  }

  if (quotes.length > 0) {
    score += 2;
  }

  return Math.min(score, 100);
}

function getConfidence(
  priority: string,
  quotes: { createdAt: Date }[]
): string {
  if (quotes.length > 0) {
    return "Quotation Available";
  }

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

function getRecommendedAction(
  status: string,
  quotes: { createdAt: Date }[]
): string {
  switch (status) {
    case "NEGOTIATION":
      return "Call Now";

    case "QUOTATION_SENT": {
      if (quotes.length === 0) {
        return "Verify Quote";
      }

      const ageInDays = Math.floor(
        (Date.now() - quotes[0].createdAt.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      if (ageInDays <= 2) {
        return "Wait for Response";
      }

      if (ageInDays <= 7) {
        return "Send Follow-up";
      }

      return "Call Buyer";
    }

    case "CONTACTED":
      return "Schedule Discussion";

    default:
      return "Review";
  }
}

function getRecommendationReason(
  status: string,
  quotes: { createdAt: Date }[]
): string {
  switch (status) {
    case "NEGOTIATION":
      return "Buyer is actively negotiating.";

    case "QUOTATION_SENT":
      return quotes.length > 0
        ? "Latest quotation sent. Follow-up recommended."
        : "Quotation status found, but no quotation record exists.";

    case "CONTACTED":
      return "Continue buyer engagement.";

    default:
      return "Requires review.";
  }
}