/**
 * ============================================================
 * ROOTYM
 * File: lib/utils/quote-status.ts
 * Sprint 8.1
 * ============================================================
 */

import type { QuoteStatus } from "@/lib/types/quote";

export interface QuoteStatusMeta {
  label: string;

  color: string;

  badgeClass: string;

  description: string;

  isFinal: boolean;

  canEdit: boolean;

  canSend: boolean;

  canApprove: boolean;
}

export const QUOTE_STATUS_META: Record<
  QuoteStatus,
  QuoteStatusMeta
> = {
  DRAFT: {
    label: "Draft",
    color: "#6B7280",
    badgeClass:
      "bg-gray-100 text-gray-700 border-gray-200",
    description:
      "Quote is being prepared.",
    isFinal: false,
    canEdit: true,
    canSend: true,
    canApprove: false,
  },

  SENT: {
    label: "Sent",
    color: "#2563EB",
    badgeClass:
      "bg-blue-100 text-blue-700 border-blue-200",
    description:
      "Quote has been sent to the customer.",
    isFinal: false,
    canEdit: true,
    canSend: true,
    canApprove: true,
  },

  VIEWED: {
    label: "Viewed",
    color: "#0891B2",
    badgeClass:
      "bg-cyan-100 text-cyan-700 border-cyan-200",
    description:
      "Customer has viewed the quote.",
    isFinal: false,
    canEdit: true,
    canSend: true,
    canApprove: true,
  },

  NEGOTIATION: {
    label: "Negotiation",
    color: "#EA580C",
    badgeClass:
      "bg-orange-100 text-orange-700 border-orange-200",
    description:
      "Quote is under commercial negotiation.",
    isFinal: false,
    canEdit: true,
    canSend: true,
    canApprove: true,
  },

  APPROVED: {
    label: "Approved",
    color: "#16A34A",
    badgeClass:
      "bg-green-100 text-green-700 border-green-200",
    description:
      "Customer has approved the quotation.",
    isFinal: true,
    canEdit: false,
    canSend: false,
    canApprove: false,
  },

  REJECTED: {
    label: "Rejected",
    color: "#DC2626",
    badgeClass:
      "bg-red-100 text-red-700 border-red-200",
    description:
      "Customer rejected the quotation.",
    isFinal: true,
    canEdit: false,
    canSend: false,
    canApprove: false,
  },

  EXPIRED: {
    label: "Expired",
    color: "#7C3AED",
    badgeClass:
      "bg-violet-100 text-violet-700 border-violet-200",
    description:
      "Quote validity period has expired.",
    isFinal: true,
    canEdit: false,
    canSend: false,
    canApprove: false,
  },
};

export function getQuoteStatusMeta(
  status: QuoteStatus
): QuoteStatusMeta {
  return QUOTE_STATUS_META[status];
}

export function getQuoteStatusLabel(
  status: QuoteStatus
): string {
  return QUOTE_STATUS_META[status].label;
}

export function isQuoteEditable(
  status: QuoteStatus
): boolean {
  return QUOTE_STATUS_META[status].canEdit;
}

export function isQuoteFinal(
  status: QuoteStatus
): boolean {
  return QUOTE_STATUS_META[status].isFinal;
}

export function canSendQuote(
  status: QuoteStatus
): boolean {
  return QUOTE_STATUS_META[status].canSend;
}

export function canApproveQuote(
  status: QuoteStatus
): boolean {
  return QUOTE_STATUS_META[status].canApprove;
}

export function getNextAllowedStatuses(
  status: QuoteStatus
): QuoteStatus[] {
  switch (status) {
    case "DRAFT":
      return ["SENT"];

    case "SENT":
      return [
        "VIEWED",
        "NEGOTIATION",
        "APPROVED",
        "REJECTED",
        "EXPIRED",
      ];

    case "VIEWED":
      return [
        "NEGOTIATION",
        "APPROVED",
        "REJECTED",
        "EXPIRED",
      ];

    case "NEGOTIATION":
      return [
        "APPROVED",
        "REJECTED",
        "EXPIRED",
      ];

    case "APPROVED":
    case "REJECTED":
    case "EXPIRED":
      return [];

    default:
      return [];
  }
}