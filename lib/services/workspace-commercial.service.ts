/**
 * ============================================================
 * ROOTYM Global ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides Customer Workspace-safe commercial adapters
 *          over the shared Quote and Proforma Invoice records.
 *          Workspace access is translated into Website ownership;
 *          no Admin authentication or Admin route is used.
 * ============================================================
 */

import {
  ProformaInvoiceStatus,
  QuoteStatus,
} from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";
import {
  QuoteBusinessService,
  type CreateQuoteInput,
} from "@/lib/services/quote-business.service";

export interface WorkspaceQuoteInput
  extends Omit<CreateQuoteInput, "inquiryId" | "createdById"> {}

function serializeCommercialRecord<T>(record: T): T {
  return JSON.parse(
    JSON.stringify(record, (_, value) =>
      typeof value === "bigint"
        ? value.toString()
        : value?.constructor?.name === "Decimal"
          ? value.toString()
          : value,
    ),
  ) as T;
}

async function requireWorkspaceInquiry(
  websiteId: string,
  inquiryId: string,
) {
  const inquiry = await prisma.inquiry.findFirst({
    where: {
      id: inquiryId,
      websiteId,
    },
    select: {
      id: true,
      inquiryNumber: true,
      companyName: true,
      contactPerson: true,
      email: true,
      phone: true,
      country: true,
      linkedProduct: {
        select: {
          id: true,
          name: true,
          sku: true,
          websiteId: true,
        },
      },
    },
  });

  if (!inquiry) {
    throw new Error("Inquiry not found.");
  }

  return inquiry;
}

async function requireWorkspaceQuote(
  websiteId: string,
  quoteId: string,
) {
  const quote = await prisma.quote.findFirst({
    where: {
      id: quoteId,
      inquiry: {
        websiteId,
      },
    },
    include: {
      inquiry: true,
      items: {
        include: {
          product: true,
        },
      },
      proformaInvoice: true,
      createdBy: true,
      updatedBy: true,
    },
  });

  if (!quote) {
    throw new Error("Quote not found.");
  }

  return quote;
}

export async function getWorkspaceQuote(
  websiteId: string,
  quoteId: string,
) {
  return serializeCommercialRecord(
    await requireWorkspaceQuote(websiteId, quoteId),
  );
}

export async function createWorkspaceQuote(
  websiteId: string,
  inquiryId: string,
  input: WorkspaceQuoteInput,
) {
  const inquiry = await requireWorkspaceInquiry(
    websiteId,
    inquiryId,
  );

  if (!input.items.length) {
    throw new Error("At least one quotation item is required.");
  }

  const productIds = Array.from(
    new Set(input.items.map((item) => item.productId)),
  );

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
      websiteId,
    },
    select: {
      id: true,
    },
  });

  if (products.length !== productIds.length) {
    throw new Error(
      "Every quotation product must belong to this Website.",
    );
  }

  const quote = await QuoteBusinessService.createQuote({
    ...input,
    websiteId,
    inquiryId: inquiry.id,
  });

  return serializeCommercialRecord(quote);
}

export async function createWorkspaceProformaInvoice(
  websiteId: string,
  quoteId: string,
) {
  const quote = await requireWorkspaceQuote(
    websiteId,
    quoteId,
  );

  if (quote.status !== QuoteStatus.APPROVED) {
    throw new Error(
      "A Proforma Invoice can only be created from an approved quotation.",
    );
  }

  if (quote.proformaInvoice) {
    return serializeCommercialRecord(
      quote.proformaInvoice,
    );
  }

  const piNumber = `PI-${Date.now()}-${crypto
    .randomUUID()
    .slice(0, 8)
    .toUpperCase()}`;

  const proformaInvoice =
    await prisma.$transaction(async (tx) => {
      const existing = await tx.proformaInvoice.findUnique({
        where: {
          quoteId,
        },
        select: {
          id: true,
        },
      });

      if (existing) {
        return tx.proformaInvoice.findUniqueOrThrow({
          where: {
            id: existing.id,
          },
          include: {
            quote: true,
            items: {
              include: {
                product: true,
              },
            },
          },
        });
      }

      return tx.proformaInvoice.create({
        data: {
          piNumber,
          websiteId,
          quoteId: quote.id,
          companyName: quote.companyName,
          contactPerson: quote.contactPerson,
          email: quote.email,
          phone: quote.phone,
          buyerAddress: quote.buyerAddress,
          buyerGstin: quote.buyerGstin,
          country: quote.country,
          currency: quote.currency,
          subtotal: quote.subtotal,
          discount: quote.discount,
          freight: quote.freight,
          insurance: quote.insurance,
          tax: quote.tax,
          grandTotal: quote.grandTotal,
          notes: quote.notes,
          status: ProformaInvoiceStatus.DRAFT,
          items: {
            create: quote.items.map((item) => ({
              productId: item.productId,
              description: item.description,
              quantity: item.quantity,
              unit: item.unit,
              unitPrice: item.unitPrice,
              lineTotal: item.lineTotal,
            })),
          },
        },
        include: {
          quote: true,
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    });

  return serializeCommercialRecord(
    proformaInvoice,
  );
}
