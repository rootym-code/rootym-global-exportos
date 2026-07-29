/**
 * ============================================================
 * R-CAPTAIN Dashboard Presenter
 * Presentation Layer
 * ============================================================
 *
 * Responsibility:
 * Transform business intelligence into UI-ready view models.
 */
import {
  ProductivityScoreData,
  TodaysMissionData,
} from "./dashboard.types";

import { ProductivityAnalysis } from "./productivity.engine";
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

  explanation: string[];

  impact: string;

  temperature: "HOT" | "WARM" | "COLD";

  lastActivity: string;
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

    explanation: buildExplanation(item),

    impact: getBusinessImpact(item),

    temperature: getBuyerTemperature(item),

    lastActivity: getQuotationAge(item.quotes),
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
function buildExplanation(
  item: AnalyzedPriorityQueueItem
): string[] {
  const explanation: string[] = [];

  explanation.push(`Stage: ${formatStage(item.status)}`);

  if (item.quotes.length > 0) {
    explanation.push("Quotation available");
  } else {
    explanation.push("Quotation pending");
  }

  explanation.push(`Priority: ${item.priority}`);

  return explanation;
}

function getBusinessImpact(
  item: AnalyzedPriorityQueueItem
): string {
  if (item.aiScore >= 80) {
    return "High probability opportunity";
  }

  if (item.aiScore >= 60) {
    return "Strong follow-up recommended";
  }

  if (item.aiScore >= 40) {
    return "Needs buyer engagement";
  }

  return "Low conversion probability";
}

function getBuyerTemperature(
  item: AnalyzedPriorityQueueItem
): "HOT" | "WARM" | "COLD" {
  if (item.aiScore >= 80) {
    return "HOT";
  }

  if (item.aiScore >= 50) {
    return "WARM";
  }

  return "COLD";
}
function getMetricScore(
  completed: number,
  total: number
): number {
  if (total === 0) {
    return 100;
  }

  return Math.round((completed / total) * 100);
}

export function buildProductivityScore(
  mission: TodaysMissionData,
  analysis: ProductivityAnalysis
): ProductivityScoreData {
  return {
    score: analysis.score,

    status: analysis.status,

    recommendation: analysis.recommendation,

    progress: analysis.progress,

    calls: {
      ...mission.calls,
      score: getMetricScore(
        mission.calls.completed,
        mission.calls.total
      ),
    },

    whatsapp: {
      ...mission.whatsapp,
      score: getMetricScore(
        mission.whatsapp.completed,
        mission.whatsapp.total
      ),
    },

    quotations: {
      ...mission.quotations,
      score: getMetricScore(
        mission.quotations.completed,
        mission.quotations.total
      ),
    },

    meetings: {
      ...mission.meetings,
      score: getMetricScore(
        mission.meetings.completed,
        mission.meetings.total
      ),
    },
  };
}