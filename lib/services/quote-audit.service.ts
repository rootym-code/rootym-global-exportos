/**
 * ============================================================
 * ROOTYM
 * File: lib/services/quote-audit.service.ts
 * Sprint 8.1
 * ============================================================
 */

export type QuoteAuditAction =
  | "CREATED"
  | "UPDATED"
  | "STATUS_CHANGED"
  | "SENT"
  | "DOWNLOADED"
  | "DUPLICATED"
  | "DELETED"
  | "PDF_GENERATED";

export interface QuoteAuditEntry {
  quoteId: string;

  quoteNumber: string;

  action: QuoteAuditAction;

  performedBy: string;

  remarks?: string;

  metadata?: Record<string, unknown>;

  createdAt: Date;
}

class QuoteAuditService {
  /**
   * ------------------------------------------------------------
   * Create Audit Entry
   * ------------------------------------------------------------
   *
   * Future persistence:
   *
   * prisma.quoteAudit.create(...)
   *
   * or
   *
   * Event Bus / Kafka / RabbitMQ
   *
   */

  async log(
    entry: QuoteAuditEntry
  ): Promise<void> {
    console.info("[QUOTE AUDIT]", {
      ...entry,
      createdAt:
        entry.createdAt.toISOString(),
    });
  }

  async created(
    quoteId: string,
    quoteNumber: string,
    user: string
  ) {
    return this.log({
      quoteId,
      quoteNumber,
      action: "CREATED",
      performedBy: user,
      createdAt: new Date(),
    });
  }

  async updated(
    quoteId: string,
    quoteNumber: string,
    user: string,
    metadata?: Record<string, unknown>
  ) {
    return this.log({
      quoteId,
      quoteNumber,
      action: "UPDATED",
      performedBy: user,
      metadata,
      createdAt: new Date(),
    });
  }

  async statusChanged(
    quoteId: string,
    quoteNumber: string,
    user: string,
    from: string,
    to: string,
    remarks?: string
  ) {
    return this.log({
      quoteId,
      quoteNumber,
      action: "STATUS_CHANGED",
      performedBy: user,
      remarks,
      metadata: {
        from,
        to,
      },
      createdAt: new Date(),
    });
  }

  async sent(
    quoteId: string,
    quoteNumber: string,
    user: string,
    recipient: string
  ) {
    return this.log({
      quoteId,
      quoteNumber,
      action: "SENT",
      performedBy: user,
      metadata: {
        recipient,
      },
      createdAt: new Date(),
    });
  }

  async duplicated(
    quoteId: string,
    quoteNumber: string,
    user: string,
    sourceQuoteNumber: string
  ) {
    return this.log({
      quoteId,
      quoteNumber,
      action: "DUPLICATED",
      performedBy: user,
      metadata: {
        sourceQuoteNumber,
      },
      createdAt: new Date(),
    });
  }

  async downloaded(
    quoteId: string,
    quoteNumber: string,
    user: string
  ) {
    return this.log({
      quoteId,
      quoteNumber,
      action: "DOWNLOADED",
      performedBy: user,
      createdAt: new Date(),
    });
  }

  async pdfGenerated(
    quoteId: string,
    quoteNumber: string,
    user: string
  ) {
    return this.log({
      quoteId,
      quoteNumber,
      action: "PDF_GENERATED",
      performedBy: user,
      createdAt: new Date(),
    });
  }

  async deleted(
    quoteId: string,
    quoteNumber: string,
    user: string
  ) {
    return this.log({
      quoteId,
      quoteNumber,
      action: "DELETED",
      performedBy: user,
      createdAt: new Date(),
    });
  }
}

export const quoteAuditService =
  new QuoteAuditService();