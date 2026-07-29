import { PriorityQueueItem } from "./dashboard.types";

export interface AnalyzedPriorityQueueItem extends PriorityQueueItem {
  aiScore: number;
  confidence: string;
  action: string;
  reason: string;
}

export function analyzePriorityQueue(
  items: PriorityQueueItem[]
): AnalyzedPriorityQueueItem[] {
  return items.map((item) => ({
    ...item,
    aiScore: calculateAIScore(item),
    confidence: getConfidence(item.priority, item.quotes),
    action: getRecommendedAction(item.status, item.quotes),
    reason: getRecommendationReason(item.status, item.quotes),
  }));
}

function getBuyerIntentScore(item: PriorityQueueItem): number {
  switch (item.status.toUpperCase()) {
    case "NEGOTIATION":
      return 40;

    case "QUOTATION_SENT":
      return 30;

    case "CONTACTED":
      return 20;

    case "NEW":
      return 10;

    case "CONFIRMED":
    case "REJECTED":
    default:
      return 0;
  }
}
function getOpportunityValueScore(item: PriorityQueueItem): number {
  const firstQuote = item.quotes[0];

  if (!firstQuote) {
    return 0;
  }

  const value = Number(firstQuote.grandTotal.toString());

  if (Number.isNaN(value)) {
    return 0;
  }

  if (value > 25000) {
    return 20;
  }

  if (value >= 10000) {
    return 15;
  }

  if (value >= 5000) {
    return 10;
  }

  if (value >= 1000) {
    return 5;
  }

  return 0;
}


function getFollowUpScore(_: PriorityQueueItem): number {
  // Follow-up intelligence will be implemented in Sprint V5
  // once follow-up data is included in PriorityQueueItem.
  return 0;
}


function getQuoteFreshnessScore(item: PriorityQueueItem): number {
  // Move your existing Quote Freshness code here unchanged.
  return 0;
}

function getPriorityScore(item: PriorityQueueItem): number {
  switch (item.priority.toUpperCase()) {
    case "URGENT":
      return 10;

    case "HIGH":
      return 7;

    case "MEDIUM":
      return 4;

    case "LOW":
      return 2;

    default:
      return 0;
  }
}

function getCompletenessScore(item: PriorityQueueItem): number {
  let score = 0;

  if (item.quotes.length > 0) {
    score += 2;
  }

  if (item.country.trim().length > 0) {
    score += 1;
  }

  if (item.product.trim().length > 0) {
    score += 1;
  }

  if (item.companyName.trim().length > 0) {
    score += 1;
  }

  return score;
}

export function calculateAIScore(  item: PriorityQueueItem): number {
  const buyerIntentScore = getBuyerIntentScore(item);
  const valueScore = getOpportunityValueScore(item);
const followUpScore = getFollowUpScore(item);
  const quoteFreshnessScore = getQuoteFreshnessScore(item);
  const priorityScore = getPriorityScore(item);
const completenessScore = getCompletenessScore(item);

const totalScore =
  buyerIntentScore +
  valueScore +
  followUpScore +
  quoteFreshnessScore +
  priorityScore +
  completenessScore;

return Math.min(100, Math.max(0, totalScore));
}

export function getConfidence(
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

export function getRecommendedAction(
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

export function getRecommendationReason(
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
