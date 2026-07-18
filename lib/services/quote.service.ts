/**
 * ROOTYM Sprint 8
 * File: lib/services/quote.service.ts
 *
 * Quote Service
 */

import { Prisma, QuoteStatus } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";
import type {
  CreateQuoteInput,
  UpdateQuoteInput,
} from "@/lib/validation/quote";

function decimal(n: number) {
  return new Prisma.Decimal(n);
}

function calculateTotals(
  input: Pick<
    CreateQuoteInput,
    "items" | "discount" | "freight" | "insurance" | "tax"
  >
) {
  const subtotal = input.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  const grandTotal =
    subtotal -
    input.discount +
    input.freight +
    input.insurance +
    input.tax;

  return {
    subtotal,
    grandTotal,
  };
}

export async function generateQuoteNumber(
  tx: Prisma.TransactionClient
) {
  const year = new Date().getFullYear();

  const latest = await tx.quote.findFirst({
    where: {
      quoteNumber: {
        startsWith: `QT-${year}-`,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  let next = 1;

  if (latest) {
    const last = Number(
      latest.quoteNumber.split("-").pop() ?? "0"
    );

    next = last + 1;
  }

  return `QT-${year}-${String(next).padStart(
    5,
    "0"
  )}`;
}

/**
 * Lightweight list used by Admin Quote Table.
 */
export async function listQuotes() {
  return prisma.quote.findMany({
    select: {
      id: true,
      quoteNumber: true,
      companyName: true,
      contactPerson: true,
      email: true,
      phone: true,
      country: true,
      currency: true,
      grandTotal: true,
      status: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

/**
 * Full quote used by View/Edit/PDF/Email.
 */
export async function getQuoteById(id: string) {
  return prisma.quote.findUnique({
    where: {
      id,
    },
    include: {
      inquiry: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });
}

export async function createQuote(
  data: CreateQuoteInput
) {
  return prisma.$transaction(async (tx) => {
    const totals = calculateTotals(data);

    const quote = await tx.quote.create({
      data: {
        quoteNumber:
          await generateQuoteNumber(tx),

        inquiryId: data.inquiryId || null,

        companyName: data.companyName,
        contactPerson: data.contactPerson,
        email: data.email,
        phone: data.phone || null,
        country: data.country,
        currency: data.currency,

        subtotal: decimal(totals.subtotal),
        discount: decimal(data.discount),
        freight: decimal(data.freight),
        insurance: decimal(data.insurance),
        tax: decimal(data.tax),
        grandTotal: decimal(
          totals.grandTotal
        ),

        validityDays: data.validityDays,
        status: data.status,

        notes: data.notes || null,
      },
    });

    await tx.quoteItem.createMany({
      data: data.items.map((item) => ({
        quoteId: quote.id,
        productId: item.productId,
        description:
          item.description || null,
        quantity: decimal(item.quantity),
        unit: item.unit,
        unitPrice: decimal(
          item.unitPrice
        ),
        lineTotal: decimal(
          item.quantity * item.unitPrice
        ),
      })),
    });

    return tx.quote.findUniqueOrThrow({
      where: {
        id: quote.id,
      },
      include: {
        inquiry: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  });
}

export async function updateQuote(
  id: string,
  data: UpdateQuoteInput
) {
  return prisma.$transaction(async (tx) => {
    const existing =
      await tx.quote.findUnique({
        where: {
          id,
        },
      });

    if (!existing) {
      throw new Error("Quote not found.");
    }

    let subtotal = Number(
      existing.subtotal
    );

    let grandTotal = Number(
      existing.grandTotal
    );

    if (data.items) {
      const totals = calculateTotals({
        items: data.items,
        discount:
          data.discount ??
          Number(existing.discount),
        freight:
          data.freight ??
          Number(existing.freight),
        insurance:
          data.insurance ??
          Number(existing.insurance),
        tax:
          data.tax ??
          Number(existing.tax),
      });

      subtotal = totals.subtotal;
      grandTotal = totals.grandTotal;

      await tx.quoteItem.deleteMany({
        where: {
          quoteId: id,
        },
      });

      await tx.quoteItem.createMany({
        data: data.items.map((item) => ({
          quoteId: id,
          productId: item.productId,
          description:
            item.description || null,
          quantity: decimal(item.quantity),
          unit: item.unit,
          unitPrice: decimal(
            item.unitPrice
          ),
          lineTotal: decimal(
            item.quantity *
              item.unitPrice
          ),
        })),
      });
    }

    await tx.quote.update({
      where: {
        id,
      },
      data: {
        inquiryId:
          data.inquiryId ??
          existing.inquiryId,

        companyName:
          data.companyName ??
          existing.companyName,

        contactPerson:
          data.contactPerson ??
          existing.contactPerson,

        email:
          data.email ??
          existing.email,

        phone:
          data.phone ??
          existing.phone,

        country:
          data.country ??
          existing.country,

        currency:
          data.currency ??
          existing.currency,

        discount:
          data.discount !== undefined
            ? decimal(data.discount)
            : undefined,

        freight:
          data.freight !== undefined
            ? decimal(data.freight)
            : undefined,

        insurance:
          data.insurance !== undefined
            ? decimal(data.insurance)
            : undefined,

        tax:
          data.tax !== undefined
            ? decimal(data.tax)
            : undefined,

        subtotal: decimal(subtotal),
        grandTotal: decimal(
          grandTotal
        ),

        validityDays:
          data.validityDays ??
          existing.validityDays,

        status:
          data.status ??
          existing.status,

        notes:
          data.notes ??
          existing.notes,
      },
    });

    return tx.quote.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        inquiry: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  });
}

export async function updateQuoteStatus(
  id: string,
  status: QuoteStatus
) {
  return prisma.quote.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });
}

export async function deleteQuote(id: string) {
  return prisma.$transaction(async (tx) => {
    await tx.quoteItem.deleteMany({
      where: {
        quoteId: id,
      },
    });

    return tx.quote.delete({
      where: {
        id,
      },
    });
  });
}