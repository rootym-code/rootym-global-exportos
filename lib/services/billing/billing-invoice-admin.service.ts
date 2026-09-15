/**
 * Author: Prem Singh
 * Purpose: Admin-only service for listing, retrieving, and marking GST billing invoices as sent.
 */

import { prisma } from "@/lib/prisma";

export interface AdminBillingInvoiceListFilters {
  status?: "PENDING" | "GENERATED" | "SENT" | "FAILED";
  search?: string;
}

export async function listBillingInvoicesForAdmin(
  filters: AdminBillingInvoiceListFilters = {},
) {
  const where = {
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.search?.trim()
      ? {
          OR: [
            {
              invoiceNumber: {
                contains: filters.search.trim(),
                mode: "insensitive" as const,
              },
            },
            {
              customerName: {
                contains: filters.search.trim(),
                mode: "insensitive" as const,
              },
            },
            {
              customerEmail: {
                contains: filters.search.trim(),
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
  };

  return prisma.billingInvoice.findMany({
    where,
    orderBy: {
      invoiceDate: "desc",
    },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
        },
      },
      subscription: {
        select: {
          id: true,
          status: true,
        },
      },
      payment: {
        select: {
          id: true,
          providerPaymentId: true,
          status: true,
          paidAt: true,
        },
      },
      items: {
        orderBy: {
          id: "asc",
        },
      },
    },
  });
}

export async function getBillingInvoiceForAdmin(invoiceId: string) {
  if (!invoiceId?.trim()) {
    return null;
  }

  return prisma.billingInvoice.findUnique({
    where: {
      id: invoiceId,
    },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
        },
      },
      subscription: {
        select: {
          id: true,
          status: true,
        },
      },
      payment: {
        select: {
          id: true,
          providerPaymentId: true,
          providerSubscriptionId: true,
          status: true,
          paidAt: true,
          amount: true,
          currency: true,
        },
      },
      items: {
        orderBy: {
          id: "asc",
        },
      },
    },
  });
}

export async function markBillingInvoiceAsSent(invoiceId: string) {
  if (!invoiceId?.trim()) {
    throw new Error("Invoice ID is required.");
  }

  return prisma.$transaction(async (tx) => {
    const invoice = await tx.billingInvoice.findUnique({
      where: {
        id: invoiceId,
      },
      select: {
        id: true,
        status: true,
        sentAt: true,
      },
    });

    if (!invoice) {
      throw new Error("Billing invoice not found.");
    }

    if (invoice.status === "SENT") {
      return tx.billingInvoice.findUnique({
        where: {
          id: invoiceId,
        },
      });
    }

    if (invoice.status !== "GENERATED") {
      throw new Error("Only a generated invoice can be marked as sent.");
    }

    return tx.billingInvoice.update({
      where: {
        id: invoiceId,
      },
      data: {
        status: "SENT",
        sentAt: new Date(),
      },
    });
  });
}