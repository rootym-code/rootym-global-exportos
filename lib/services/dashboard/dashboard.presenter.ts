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
import { AnalyzedPriorityQueueItem } from "./dashboard.engine";

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
  items: AnalyzedPriorityQueueItem[]
): PriorityOpportunity[] {
  return items.map((item) => ({
    id: item.id,
    buyer: item.companyName,
    country: item.country,
    product: item.product,
    stage: formatStage(item.status),

    revenue: formatRevenue(item.quotes),
    quotationAge: getQuotationAge(item.quotes),
    action: item.action,
    reason: item.reason,
    aiScore: item.aiScore,
    confidence: item.confidence,
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
