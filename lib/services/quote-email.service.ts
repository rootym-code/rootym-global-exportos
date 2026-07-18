/**
 * ============================================================
 * ROOTYM Quote Email Service
 * File: lib/services/quote-email.service.ts
 * ============================================================
 */

import { prisma } from "@/lib/prisma";
import { quoteGenerator } from "@/lib/pdf";
import { mailService } from "./mail.service";
import { QuoteStatus } from "@/lib/generated/prisma";

export interface SendQuoteEmailOptions {
  quoteId: string;
  to?: string;
  cc?: string | string[];
  bcc?: string | string[];
}

class QuoteEmailService {
  async send(options: SendQuoteEmailOptions) {
    const quote = await prisma.quote.findUnique({
      where: { id: options.quoteId },
      include: {
        inquiry: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!quote) {
      throw new Error("Quotation not found.");
    }

    const recipient =
      options.to ??
      quote.email ??
      quote.inquiry?.email;

    if (!recipient) {
      throw new Error(
        "Recipient email address not found."
      );
    }

    const pdf = await quoteGenerator.generateBuffer({
      quoteNumber: quote.quoteNumber,
      quoteDate: quote.createdAt,

      validUntil: new Date(
        quote.createdAt.getTime() +
          quote.validityDays * 24 * 60 * 60 * 1000
      ),

      buyerName: quote.contactPerson,
      buyerCompany: quote.companyName,
      buyerAddress: "",
      buyerCountry: quote.country,

      currency: quote.currency,

      subtotal: quote.subtotal,
      discount: quote.discount,
      freight: quote.freight,
      insurance: quote.insurance,
      tax: quote.tax,
      grandTotal: quote.grandTotal,

      notes: quote.notes ?? "",

      items: quote.items.map((item) => ({
        description:
          item.product?.name ??
          item.description ??
          "",
        quantity: Number(item.quantity),
        unit: item.unit,
        unitPrice: item.unitPrice,
        lineTotal: item.lineTotal,
      })),
    });

    const html = this.buildHtml(
      
      quote.quoteNumber,
      quote.contactPerson
    );

    const result = await mailService.send({
      to: recipient,
      cc: options.cc,
      bcc: options.bcc,
      subject: `ROOTYM Export Quotation ${quote.quoteNumber}`,
      html,
      attachments: [
        {
          filename: `${quote.quoteNumber}.pdf`,
          content: pdf,
          contentType: "application/pdf",
        },
      ],
    });

    if (quote.status === QuoteStatus.DRAFT) {
      await prisma.quote.update({
        where: { id: quote.id },
        data: {
          status: QuoteStatus.SENT,
        },
      });
    }

    return result;
  }

  private buildHtml(
    quoteNumber: string,
    contactName: string
  ) {
    return `
      <div style="font-family:Arial,sans-serif;font-size:14px;">
        <h2>ROOTYM AGRO HARVEST PRIVATE LIMITED</h2>

        <p>Dear ${contactName},</p>

        <p>
          Please find attached our export quotation
          <strong>${quoteNumber}</strong>.
        </p>

        <p>
          If you have any questions, feel free to reply
          to this email.
        </p>

        <br/>

        <p>
          Regards,<br/>
          ROOTYM Export Team
        </p>
      </div>
    `;
  }
}

export const quoteEmailService =
  new QuoteEmailService();