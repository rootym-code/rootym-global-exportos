/**
 * ============================================================
 * ROOTYM
 * File: lib/services/quote-timeline.service.ts
 * Sprint 8.1
 * ============================================================
 */

import type { QuoteStatus } from "@/lib/types/quote";

export type QuoteTimelineEvent =
  | "QUOTE_CREATED"
  | "QUOTE_UPDATED"
  | "STATUS_CHANGED"
  | "EMAIL_SENT"
  | "PDF_GENERATED"
  | "PDF_DOWNLOADED"
  | "QUOTE_DUPLICATED"
  | "QUOTE_APPROVED"
  | "QUOTE_REJECTED"
  | "QUOTE_EXPIRED"
  | "NOTE_ADDED";

export interface QuoteTimelineEntry {
  quoteId: string;

  event: QuoteTimelineEvent;

  title: string;

  description?: string;

  status?: QuoteStatus;

  createdBy: string;

  metadata?: Record<string, unknown>;

  createdAt: Date;
}

class QuoteTimelineService {
  /**
   * ------------------------------------------------------------
   * Persist timeline entry
   * ------------------------------------------------------------
   *
   * Future implementation:
   *
   * await prisma.quoteTimeline.create({
   *   data: ...
   * });
   *
   */

  async add(
    entry: QuoteTimelineEntry
  ): Promise<void> {
    console.info("[QUOTE TIMELINE]", {
      ...entry,
      createdAt:
        entry.createdAt.toISOString(),
    });
  }

  async created(
    quoteId: string,
    user: string
  ) {
    return this.add({
      quoteId,
      event: "QUOTE_CREATED",
      title: "Quote Created",
      createdBy: user,
      createdAt: new Date(),
    });
  }

  async updated(
    quoteId: string,
    user: string
  ) {
    return this.add({
      quoteId,
      event: "QUOTE_UPDATED",
      title: "Quote Updated",
      createdBy: user,
      createdAt: new Date(),
    });
  }

  async statusChanged(
    quoteId: string,
    user: string,
    from: QuoteStatus,
    to: QuoteStatus,
    remarks?: string
  ) {
    return this.add({
      quoteId,
      event: "STATUS_CHANGED",
      title: "Status Changed",

      description: remarks,

      status: to,

      createdBy: user,

      metadata: {
        from,
        to,
      },

      createdAt: new Date(),
    });
  }

  async emailSent(
    quoteId: string,
    user: string,
    recipient: string
  ) {
    return this.add({
      quoteId,

      event: "EMAIL_SENT",

      title: "Quotation Sent",

      createdBy: user,

      metadata: {
        recipient,
      },

      createdAt: new Date(),
    });
  }

  async pdfGenerated(
    quoteId: string,
    user: string
  ) {
    return this.add({
      quoteId,

      event: "PDF_GENERATED",

      title: "PDF Generated",

      createdBy: user,

      createdAt: new Date(),
    });
  }

  async pdfDownloaded(
    quoteId: string,
    user: string
  ) {
    return this.add({
      quoteId,

      event: "PDF_DOWNLOADED",

      title: "PDF Downloaded",

      createdBy: user,

      createdAt: new Date(),
    });
  }

  async duplicated(
    quoteId: string,
    user: string,
    sourceQuoteNumber: string
  ) {
    return this.add({
      quoteId,

      event: "QUOTE_DUPLICATED",

      title: "Quote Duplicated",

      createdBy: user,

      metadata: {
        sourceQuoteNumber,
      },

      createdAt: new Date(),
    });
  }

  async approved(
    quoteId: string,
    user: string
  ) {
    return this.add({
      quoteId,

      event: "QUOTE_APPROVED",

      title: "Quote Approved",

      status: "APPROVED",

      createdBy: user,

      createdAt: new Date(),
    });
  }

  async rejected(
    quoteId: string,
    user: string
  ) {
    return this.add({
      quoteId,

      event: "QUOTE_REJECTED",

      title: "Quote Rejected",

      status: "REJECTED",

      createdBy: user,

      createdAt: new Date(),
    });
  }

  async expired(
    quoteId: string,
    user: string
  ) {
    return this.add({
      quoteId,

      event: "QUOTE_EXPIRED",

      title: "Quote Expired",

      status: "EXPIRED",

      createdBy: user,

      createdAt: new Date(),
    });
  }

  async noteAdded(
    quoteId: string,
    user: string,
    note: string
  ) {
    return this.add({
      quoteId,

      event: "NOTE_ADDED",

      title: "Internal Note Added",

      description: note,

      createdBy: user,

      createdAt: new Date(),
    });
  }
}

export const quoteTimelineService =
  new QuoteTimelineService();