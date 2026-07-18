/**
 * ============================================================
 * ROOTYM
 * File: lib/services/quote-email.service.ts
 * Sprint 8.1
 * ============================================================
 */

import type { Quote } from "@/lib/types/quote";

import { quotePdfService } from "./quote-pdf.service";

export interface SendQuoteEmailRequest {
  quote: Quote;

  to: string;

  cc?: string;

  subject: string;

  message: string;
}

export interface SendQuoteEmailResult {
  success: boolean;

  messageId?: string;

  queuedAt: Date;
}

class QuoteEmailService {
  /**
   * ------------------------------------------------------------
   * Send quotation email
   * ------------------------------------------------------------
   *
   * Future supported providers:
   *
   * • Resend
   * • SMTP (Hostinger)
   * • AWS SES
   * • SendGrid
   * • Zoho Mail
   * • Microsoft 365
   *
   */

  async send(
    request: SendQuoteEmailRequest
  ): Promise<SendQuoteEmailResult> {
    const pdf =
      await quotePdfService.generate(
        request.quote
      );

    /**
     * ==========================================================
     * Future implementation
     * ==========================================================
     *
     * await mailProvider.send({
     *   to: request.to,
     *   cc: request.cc,
     *   subject: request.subject,
     *   html: request.message,
     *   attachments: [
     *     {
     *       filename: pdf.fileName,
     *       content: pdfBuffer
     *     }
     *   ]
     * });
     *
     * ==========================================================
     */

    console.info(
      "[Quote Email]",
      {
        quote:
          request.quote.quoteNumber,

        to: request.to,

        cc: request.cc,

        subject: request.subject,

        attachment:
          pdf.fileName,
      }
    );

    return {
      success: true,

      messageId: crypto.randomUUID(),

      queuedAt: new Date(),
    };
  }
}

export const quoteEmailService =
  new QuoteEmailService();