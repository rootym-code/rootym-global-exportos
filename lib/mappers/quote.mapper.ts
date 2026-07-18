/**
 * ============================================================
 * ROOTYM
 * File: lib/mappers/quote.mapper.ts
 * Sprint 8.1
 * ============================================================
 */

import type {
  Quote,
  QuoteItem,
} from "@/lib/types/quote";

import type { QuoteInput } from "@/lib/validators/quote";

interface PrismaQuoteItem {
  id: string;

  productId: string;

  description: string | null;

  quantity: unknown;

  unit: string;

  unitPrice: unknown;

  lineTotal: unknown;

  createdAt?: Date;

  updatedAt?: Date;

  product?: {
    id: string;
    name: string;
    sku?: string | null;
    unit?: string | null;
  };
}

interface PrismaQuote {
  id: string;

  quoteNumber: string;

  inquiryId: string | null;

  companyName: string;

  contactPerson: string;

  email: string;

  phone: string | null;

  country: string;

  currency: string;

  subtotal: unknown;

  discount: unknown;

  freight: unknown;

  insurance: unknown;

  tax: unknown;

  grandTotal: unknown;

  validityDays: number;

  status: string;

  notes: string | null;

  createdById: string | null;

  updatedById: string | null;

  createdAt: Date;

  updatedAt: Date;

  items?: PrismaQuoteItem[];
}

/**
 * ------------------------------------------------------------
 * Quote Items
 * ------------------------------------------------------------
 */

function mapItems(
  items: PrismaQuoteItem[] = []
): QuoteItem[] {
  return items.map((item) => ({
    id: item.id,

    productId: item.productId,

    description: item.description,

    quantity: Number(item.quantity),

    unit: item.unit,

    unitPrice: Number(item.unitPrice),

    lineTotal: Number(item.lineTotal),

    createdAt: item.createdAt?.toISOString(),

    updatedAt: item.updatedAt?.toISOString(),

    product: item.product
      ? {
          id: item.product.id,
          name: item.product.name,
          sku: item.product.sku ?? null,
          unit: item.product.unit ?? null,
        }
      : undefined,
  }));
}

/**
 * ------------------------------------------------------------
 * Prisma -> Domain
 * ------------------------------------------------------------
 */

export function mapQuoteFromPrisma(
  quote: PrismaQuote
): Quote {
  return {
    id: quote.id,

    quoteNumber: quote.quoteNumber,

    inquiryId: quote.inquiryId,

    companyName: quote.companyName,

    contactPerson: quote.contactPerson,

    email: quote.email,

    phone: quote.phone,

    country: quote.country,

    currency: quote.currency,

    subtotal: Number(quote.subtotal),

    discount: Number(quote.discount),

    freight: Number(quote.freight),

    insurance: Number(quote.insurance),

    tax: Number(quote.tax),

    grandTotal: Number(quote.grandTotal),

    validityDays: quote.validityDays,

    status: quote.status as Quote["status"],

    notes: quote.notes,

    createdById: quote.createdById,

    updatedById: quote.updatedById,

    createdAt: quote.createdAt.toISOString(),

    updatedAt: quote.updatedAt.toISOString(),

    items: mapItems(quote.items),
  };
}

/**
 * ------------------------------------------------------------
 * Domain -> Prisma Payload
 * ------------------------------------------------------------
 */

export function mapQuoteToPersistence(
  input: QuoteInput
) {
  return {
    inquiryId: input.inquiryId,

    companyName: input.companyName,

    contactPerson: input.contactPerson,

    email: input.email,

    phone: input.phone,

    country: input.country,

    currency: input.currency,

    subtotal: input.subtotal,

    discount: input.discount,

    freight: input.freight,

    insurance: input.insurance,

    tax: input.tax,

    grandTotal: input.grandTotal,

    validityDays: input.validityDays,

    status: input.status,

    notes: input.notes,

    items: input.items,
  };
}