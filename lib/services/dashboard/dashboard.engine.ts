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
    aiScore: calculateAIScore(item.priority, item.quotes),
    confidence: getConfidence(item.priority, item.quotes),
    action: getRecommendedAction(item.status, item.quotes),
    reason: getRecommendationReason(item.status, item.quotes),
  }));
}

export function calculateAIScore(
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
