/**
 * ============================================================
 * ROOTYM
 * File: lib/services/quote-notification.service.ts
 * Sprint 8.1
 * ============================================================
 */

import type { QuoteStatus } from "@/lib/types/quote";

export type QuoteNotificationType =
  | "QUOTE_CREATED"
  | "QUOTE_UPDATED"
  | "STATUS_CHANGED"
  | "QUOTE_SENT"
  | "QUOTE_APPROVED"
  | "QUOTE_REJECTED"
  | "QUOTE_EXPIRED"
  | "QUOTE_DUPLICATED";

export interface QuoteNotification {
  type: QuoteNotificationType;

  quoteId: string;

  quoteNumber: string;

  title: string;

  message: string;

  recipients: string[];

  metadata?: Record<string, unknown>;

  createdAt: Date;
}

class QuoteNotificationService {
  /**
   * ------------------------------------------------------------
   * Dispatch notification
   * ------------------------------------------------------------
   *
   * Future integrations:
   *
   * • In-App Notification Center
   * • Email
   * • SMS
   * • WhatsApp
   * • Slack
   * • Microsoft Teams
   * • Web Push
   */

  async notify(
    notification: QuoteNotification
  ): Promise<void> {
    console.info(
      "[QUOTE NOTIFICATION]",
      {
        ...notification,
        createdAt:
          notification.createdAt.toISOString(),
      }
    );
  }

  async quoteCreated(
    quoteId: string,
    quoteNumber: string,
    recipients: string[]
  ) {
    return this.notify({
      type: "QUOTE_CREATED",

      quoteId,

      quoteNumber,

      title: "Quotation Created",

      message: `${quoteNumber} has been created.`,

      recipients,

      createdAt: new Date(),
    });
  }

  async quoteUpdated(
    quoteId: string,
    quoteNumber: string,
    recipients: string[]
  ) {
    return this.notify({
      type: "QUOTE_UPDATED",

      quoteId,

      quoteNumber,

      title: "Quotation Updated",

      message: `${quoteNumber} has been updated.`,

      recipients,

      createdAt: new Date(),
    });
  }

  async statusChanged(
    quoteId: string,
    quoteNumber: string,
    status: QuoteStatus,
    recipients: string[]
  ) {
    return this.notify({
      type: "STATUS_CHANGED",

      quoteId,

      quoteNumber,

      title: "Quotation Status Changed",

      message: `${quoteNumber} is now ${status}.`,

      recipients,

      metadata: {
        status,
      },

      createdAt: new Date(),
    });
  }

  async quoteSent(
    quoteId: string,
    quoteNumber: string,
    recipient: string
  ) {
    return this.notify({
      type: "QUOTE_SENT",

      quoteId,

      quoteNumber,

      title: "Quotation Sent",

      message: `${quoteNumber} has been emailed to ${recipient}.`,

      recipients: [recipient],

      createdAt: new Date(),
    });
  }

  async approved(
    quoteId: string,
    quoteNumber: string,
    recipients: string[]
  ) {
    return this.notify({
      type: "QUOTE_APPROVED",

      quoteId,

      quoteNumber,

      title: "Quotation Approved",

      message: `${quoteNumber} has been approved.`,

      recipients,

      createdAt: new Date(),
    });
  }

  async rejected(
    quoteId: string,
    quoteNumber: string,
    recipients: string[]
  ) {
    return this.notify({
      type: "QUOTE_REJECTED",

      quoteId,

      quoteNumber,

      title: "Quotation Rejected",

      message: `${quoteNumber} has been rejected.`,

      recipients,

      createdAt: new Date(),
    });
  }

  async expired(
    quoteId: string,
    quoteNumber: string,
    recipients: string[]
  ) {
    return this.notify({
      type: "QUOTE_EXPIRED",

      quoteId,

      quoteNumber,

      title: "Quotation Expired",

      message: `${quoteNumber} has expired.`,

      recipients,

      createdAt: new Date(),
    });
  }

  async duplicated(
    quoteId: string,
    quoteNumber: string,
    sourceQuoteNumber: string,
    recipients: string[]
  ) {
    return this.notify({
      type: "QUOTE_DUPLICATED",

      quoteId,

      quoteNumber,

      title: "Quotation Duplicated",

      message: `${quoteNumber} was created from ${sourceQuoteNumber}.`,

      recipients,

      metadata: {
        sourceQuoteNumber,
      },

      createdAt: new Date(),
    });
  }
}

export const quoteNotificationService =
  new QuoteNotificationService();