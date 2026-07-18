/**
 * ============================================================
 * ROOTYM PDF Quote Generator
 * File: lib/pdf/quote-generator.ts
 * Sprint 8
 * ============================================================
 */

import { Buffer } from "node:buffer";
import {
  QuoteTemplate,
  QuotePdfData,
  QuotePdfItem,
} from "./quote-template";

type DecimalLike = {
  toNumber(): number;
};

export interface QuoteEntity {
  quoteNumber: string;
  quoteDate: Date;
  validUntil: Date;

  buyerName: string;
  buyerCompany?: string | null;
  buyerAddress?: string | null;
  buyerCountry?: string | null;

  currency: string;

  subtotal: DecimalLike;
  discount: DecimalLike;
  freight: DecimalLike;
  insurance: DecimalLike;
  tax: DecimalLike;
  grandTotal: DecimalLike;

  notes?: string | null;

  items: Array<{
    description: string;
    quantity: number;
    unit: string;
    unitPrice: DecimalLike;
    lineTotal: DecimalLike;
  }>;
}

function fmtDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB").format(date);
}

function mapItems(
  items: QuoteEntity["items"]
): QuotePdfItem[] {
  return items.map((item) => ({
    description: item.description,
    quantity: item.quantity,
    unit: item.unit,
    unitPrice: item.unitPrice.toNumber(),
    lineTotal: item.lineTotal.toNumber(),
  }));
}

function mapQuote(
  quote: QuoteEntity
): QuotePdfData {
  return {
    quoteNumber: quote.quoteNumber,
    quoteDate: fmtDate(quote.quoteDate),
    validUntil: fmtDate(quote.validUntil),

    buyerName: quote.buyerName,
    buyerCompany: quote.buyerCompany ?? "",
    buyerAddress: quote.buyerAddress ?? "",
    buyerCountry: quote.buyerCountry ?? "",

    currency: quote.currency,

    items: mapItems(quote.items),

    subtotal: quote.subtotal.toNumber(),
    discount: quote.discount.toNumber(),
    freight: quote.freight.toNumber(),
    insurance: quote.insurance.toNumber(),
    tax: quote.tax.toNumber(),
    grandTotal: quote.grandTotal.toNumber(),

    notes: quote.notes ?? "",
  };
}

export class QuoteGenerator {
  private readonly template =
    new QuoteTemplate();

  async generateUint8Array(
    quote: QuoteEntity
  ): Promise<Uint8Array> {
    return this.template.render(
      mapQuote(quote)
    );
  }

  async generateBuffer(
    quote: QuoteEntity
  ): Promise<Buffer> {
    const bytes =
      await this.generateUint8Array(quote);

    return Buffer.from(bytes);
  }

  async generateBase64(
    quote: QuoteEntity
  ): Promise<string> {
    const buffer =
      await this.generateBuffer(quote);

    return buffer.toString("base64");
  }
}

export const quoteGenerator =
  new QuoteGenerator();