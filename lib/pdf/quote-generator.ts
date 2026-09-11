/**
 * ============================================================
 * ROOTYM PDF Quote Generator
 * File: lib/pdf/quote-generator.ts
 * Sprint 8
 * ============================================================
 */

import { Buffer } from "node:buffer";

import { QuoteTemplate, QuotePdfData, QuotePdfItem } from "./quote-template";

type DecimalLike = { toNumber(): number };

export interface QuoteEntity {
  quoteNumber: string;
  quoteDate: Date;
  validUntil: Date;
  buyerName: string;
  buyerCompany?: string | null;
  buyerAddress?: string | null;
  buyerCountry?: string | null;
  buyerGstin?: string | null;

  seller?: {
    businessName?: string;
    tagline?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    gstin?: string;
    fssaiNumber?: string;
    iecNumber?: string;
    logoUrl?: string;
    logoMimeType?: string;
  };

  currency: string;

  subtotal: DecimalLike;
  discount: DecimalLike;
  freight: DecimalLike;
  insurance: DecimalLike;
  tax: DecimalLike;
  grandTotal: DecimalLike;

  paymentTerms?: string | null;
  deliveryTerms?: string | null;
  incoterms?: string | null;

  notes?: string | null;

  items: Array<{
    description: string;
    quantity: number;
    unit: string;
    unitPrice: DecimalLike;
    lineTotal: DecimalLike;
  }>;
}

function fmtDate(d: Date): string {
  return new Intl.DateTimeFormat("en-GB").format(d);
}

function mapItems(items: QuoteEntity["items"]): QuotePdfItem[] {
  return items.map((i) => ({
    description: i.description,
    quantity: i.quantity,
    unit: i.unit,
    unitPrice: i.unitPrice.toNumber(),
    lineTotal: i.lineTotal.toNumber(),
  }));
}

function mapQuote(q: QuoteEntity): QuotePdfData {
  return {
    quoteNumber: q.quoteNumber,
    quoteDate: fmtDate(q.quoteDate),
    validUntil: fmtDate(q.validUntil),

    buyerName: q.buyerName,
    buyerCompany: q.buyerCompany ?? "",
    buyerAddress: q.buyerAddress ?? "",
    buyerCountry: q.buyerCountry ?? "",
    buyerGstin: q.buyerGstin ?? "",

    currency: q.currency,
    items: mapItems(q.items),

    subtotal: q.subtotal.toNumber(),
    discount: q.discount.toNumber(),
    freight: q.freight.toNumber(),
    insurance: q.insurance.toNumber(),
    tax: q.tax.toNumber(),
    grandTotal: q.grandTotal.toNumber(),

    notes: q.notes ?? "",
  };
}

export class QuoteGenerator {
  private readonly template = new QuoteTemplate();

  async generateUint8Array(quote: QuoteEntity): Promise<Uint8Array> {
    return this.template.render(mapQuote(quote));
  }

  async generateBuffer(quote: QuoteEntity): Promise<Buffer> {
    const bytes = await this.generateUint8Array(quote);
    return Buffer.from(bytes);
  }

  async generateBase64(quote: QuoteEntity): Promise<string> {
    const buffer = await this.generateBuffer(quote);
    return buffer.toString("base64");
  }
}

export const quoteGenerator = new QuoteGenerator();
