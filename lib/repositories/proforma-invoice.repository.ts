/**
 * ============================================================
 * ROOTYM
 * File: lib/repositories/proforma-invoice.repository.ts
 * Sprint 8.1
 * ============================================================
 */

import {
    Prisma,
    ProformaInvoiceStatus,
  } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";

export class ProformaInvoiceRepository {
  async findById(id: string) {
    return prisma.proformaInvoice.findUnique({
      where: {
        id,
      },
      include: {
        quote: {
          include: {
            inquiry: true,
            items: {
              include: {
                product: true,
              },
            },
            createdBy: true,
            updatedBy: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async findByQuoteId(quoteId: string) {
    return prisma.proformaInvoice.findUnique({
      where: {
        quoteId,
      },
      include: {
        quote: {
          include: {
            inquiry: true,
            items: {
              include: {
                product: true,
              },
            },
            createdBy: true,
            updatedBy: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async existsByQuoteId(quoteId: string) {
    const count =
      await prisma.proformaInvoice.count({
        where: {
          quoteId,
        },
      });

    return count > 0;
  }

  /**
   * Generates the next PI sequence number for the
   * current calendar year.
   *
   * Uses NumberSequence so PI numbering remains
   * independent from quotation numbering.
   */
  async nextSequence(): Promise<number> {
    const year = new Date().getFullYear();

    const sequence =
      await prisma.numberSequence.upsert({
        where: {
          type_year: {
            type: "PROFORMA_INVOICE",
            year,
          },
        },
        create: {
          type: "PROFORMA_INVOICE",
          year,
          lastValue: 1,
        },
        update: {
          lastValue: {
            increment: 1,
          },
        },
        select: {
          lastValue: true,
        },
      });

    return sequence.lastValue;
  }

  /**
   * Creates a PI from an approved quotation.
   *
   * The quotation itself is never modified.
   * All commercial/customer/item values are copied
   * into the PI as an independent document snapshot.
   */
  async createFromApprovedQuote(
    quoteId: string,
    piNumber: string
  ) {
    return prisma.$transaction(async (tx) => {
      const quote =
        await tx.quote.findUnique({
          where: {
            id: quoteId,
          },
          include: {
            inquiry: true,
            items: {
              include: {
                product: true,
              },
            },
            createdBy: true,
            updatedBy: true,
          },
        });

      if (!quote) {
        throw new Error(
          "Quote not found."
        );
      }

      if (quote.status !== "APPROVED") {
        throw new Error(
          "Only approved quotations can be converted to a Proforma Invoice."
        );
      }

      const existing =
        await tx.proformaInvoice.findUnique({
          where: {
            quoteId,
          },
          select: {
            id: true,
            piNumber: true,
          },
        });

      if (existing) {
        throw new Error(
          `A Proforma Invoice (${existing.piNumber}) already exists for this quotation.`
        );
      }

      const created =
        await tx.proformaInvoice.create({
          data: {
            piNumber,
            quoteId: quote.id,

            issueDate: new Date(),

            companyName:
              quote.companyName,

            contactPerson:
              quote.contactPerson,

            email: quote.email,

            phone: quote.phone,

            country: quote.country,

            currency: quote.currency,

            subtotal: quote.subtotal,

            discount: quote.discount,

            freight: quote.freight,

            insurance: quote.insurance,

            tax: quote.tax,

            grandTotal:
              quote.grandTotal,

            notes: quote.notes,

            items: {
              create: quote.items.map(
                (item) => ({
                  productId:
                    item.productId,

                  description:
                    item.description,

                  quantity:
                    item.quantity,

                  unit: item.unit,

                  unitPrice:
                    item.unitPrice,

                  lineTotal:
                    item.lineTotal,
                })
              ),
            },
          },
          include: {
            quote: {
              include: {
                inquiry: true,
                items: {
                  include: {
                    product: true,
                  },
                },
                createdBy: true,
                updatedBy: true,
              },
            },
            items: {
              include: {
                product: true,
              },
            },
          },
        });

      return created;
    });
  }

  async update(
    id: string,
    data: Prisma.ProformaInvoiceUpdateInput
  ) {
    return prisma.proformaInvoice.update({
      where: {
        id,
      },
      data,
      include: {
        quote: {
          include: {
            inquiry: true,
            items: {
              include: {
                product: true,
              },
            },
            createdBy: true,
            updatedBy: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async updateStatus(
    id: string,
    status: ProformaInvoiceStatus
  ) {
    return prisma.proformaInvoice.update({
      where: {
        id,
      },
      data: {
        status,
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
}

export const proformaInvoiceRepository =
  new ProformaInvoiceRepository();