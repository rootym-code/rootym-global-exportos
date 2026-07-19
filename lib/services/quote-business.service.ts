/**
 * ============================================================================
 * Project      : ROOTYM Global Export Platform
 * Organization : ROOTYM AGRO HARVEST PRIVATE LIMITED
 * Module       : Quote Management
 * Feature      : Quote Business Service
 * File         : lib/services/quote-business.service.ts
 * Version      : 2.0.0
 *
 * ============================================================================
 * DESCRIPTION
 * ============================================================================
 *
 * Central business service responsible for the entire quotation lifecycle.
 *
 * Responsibilities
 * ----------------
 * • Quote Creation
 * • Quote Update
 * • Quote Revision
 * • Quote Status Management
 * • Financial Calculation
 * • Inquiry Synchronization
 * • Activity Timeline
 * • Transaction Management
 * • Business Rule Validation
 *
 * IMPORTANT
 * ---------
 *
 * API Routes should NEVER contain business logic.
 *
 * They should simply:
 *
 *      Validate Request
 *              ↓
 *      Call QuoteBusinessService
 *              ↓
 *      Return Response
 *
 * ============================================================================
 */

import {
  ActivityEntityType,
  InquiryStatus,
  Prisma,
  Quote,
  QuoteStatus,
  SalesStage,
} from "@/lib/generated/prisma";

import { prisma } from "@/lib/prisma";

import {
  ActivityAction,
  ActivityLogger,
} from "./activity.service";

import NumberGeneratorService from "./number-generator.service";

/* ============================================================================
* TYPES
* ========================================================================== */

export interface QuoteItemInput {

  productId: string;

  description?: string;

  quantity: number;

  unit: string;

  unitPrice: number;

}

export interface CreateQuoteInput {

  inquiryId?: string;

  companyName: string;

  contactPerson: string;

  email: string;

  phone?: string;

  country: string;

  currency: string;

  items: QuoteItemInput[];

  discount?: number;

  freight?: number;

  insurance?: number;

  tax?: number;

  validityDays?: number;

  notes?: string;

  createdById?: string;

}

export interface UpdateQuoteInput
  extends Partial<CreateQuoteInput> {}

export interface QuoteTotals {

  subtotal: number;

  discount: number;

  freight: number;

  insurance: number;

  tax: number;

  grandTotal: number;

}

/* ============================================================================
* BUSINESS VALIDATION
* ========================================================================== */

class QuoteValidator {

  static validateItems(
      items: QuoteItemInput[]
  ) {

      if (!items.length) {

          throw new Error(
              "At least one quote item is required."
          );

      }

      for (const item of items) {

          if (item.quantity <= 0) {

              throw new Error(
                  "Quantity must be greater than zero."
              );

          }

          if (item.unitPrice < 0) {

              throw new Error(
                  "Invalid unit price."
              );

          }

      }

  }

  static validateStatusTransition(

      current: QuoteStatus,

      next: QuoteStatus,

  ) {

      if (current === QuoteStatus.CANCELLED) {

          throw new Error(
              "Cancelled quotation cannot be modified."
          );

      }

      if (current === QuoteStatus.ACCEPTED) {

          throw new Error(
              "Accepted quotation cannot be modified."
          );

      }

      return true;

  }

}

/* ============================================================================
* QUOTE BUSINESS SERVICE
* ========================================================================== */

export class QuoteBusinessService {

  /* ==========================================================================
   * CALCULATE TOTALS
   * ======================================================================== */

  static calculateTotals(
      input: CreateQuoteInput
  ): QuoteTotals {

      QuoteValidator.validateItems(
          input.items
      );

      const subtotal =
          input.items.reduce(

              (sum, item) =>

                  sum +
                  item.quantity *
                  item.unitPrice,

              0,

          );

      const discount =
          input.discount ?? 0;

      const freight =
          input.freight ?? 0;

      const insurance =
          input.insurance ?? 0;

      const tax =
          input.tax ?? 0;

      const grandTotal =
          subtotal -
          discount +
          freight +
          insurance +
          tax;

      return {

          subtotal,

          discount,

          freight,

          insurance,

          tax,

          grandTotal,

      };

  }

  /* ==========================================================================
   * PRIVATE HELPERS
   * ======================================================================== */

  private static calculateValidityDate(
      validityDays: number = 15
  ) {

      const date = new Date();

      date.setDate(
          date.getDate() +
          validityDays
      );

      return date;

  }
      /* ==========================================================================
     * CREATE QUOTE
     * ==========================================================================
     *
     * Creates a new quotation together with its line items.
     * This operation is fully transactional.
     * ======================================================================== */

      static async createQuote(
        input: CreateQuoteInput
    ): Promise<Quote> {

        QuoteValidator.validateItems(
            input.items
        );

        const totals =
            this.calculateTotals(input);

        return prisma.$transaction(async (tx) => {

            /* ================================================================
             * Generate Quote Number
             * ================================================================ */

            const generatedNumber =
                await NumberGeneratorService.getNextQuoteNumber(tx);

            const quoteNumber =
                generatedNumber.number;

            const validUntil =
                this.calculateValidityDate(
                    input.validityDays
                );

            /* ================================================================
             * Create Quote
             * ================================================================ */

            const quote =
                await tx.quote.create({

                    data: {

                        quoteNumber,

                        inquiryId: input.inquiryId,

                        version: 1,

                        companyName: input.companyName,

                        contactPerson: input.contactPerson,

                        email: input.email,

                        phone: input.phone,

                        country: input.country,

                        currency: input.currency,

                        subtotal: totals.subtotal,

                        discount: totals.discount,

                        freight: totals.freight,

                        insurance: totals.insurance,

                        tax: totals.tax,

                        grandTotal: totals.grandTotal,

                        validityDays:
                            input.validityDays ?? 15,

                        validUntil,

                        notes: input.notes,

                        createdById: input.createdById,

                        items: {

                            create:

                                input.items.map(item => ({

                                    productId:
                                        item.productId,

                                    description:
                                        item.description,

                                    quantity:
                                        item.quantity,

                                    unit:
                                        item.unit,

                                    unitPrice:
                                        item.unitPrice,

                                    lineTotal:
                                        item.quantity *
                                        item.unitPrice,

                                })),

                        },

                    },

                });

            /* ================================================================
             * Synchronize Inquiry
             * ================================================================ */

            if (input.inquiryId) {

                await tx.inquiry.update({

                    where: {

                        id: input.inquiryId,

                    },

                    data: {

                        salesStage:
                            SalesStage.QUOTE_SENT,

                        status:
                            InquiryStatus.QUOTATION_SENT,

                    },

                });

            }

            /* ================================================================
             * Record Activity
             * ================================================================ */

            await ActivityLogger.logQuoteCreated(

                {

                    quoteId: quote.id,

                    quoteNumber:
                        quote.quoteNumber,

                    version:
                        quote.version,

                    performedById:
                        input.createdById,

                },

                tx,

            );

            return quote;

        });

    }

    /* ==========================================================================
     * UPDATE QUOTE
     * ==========================================================================
     *
     * Updates an existing quotation.
     * Line items are replaced as a complete set.
     * ======================================================================== */

    static async updateQuote(

        quoteId: string,

        input: UpdateQuoteInput,

    ): Promise<Quote> {

        return prisma.$transaction(async (tx) => {

            const existing =
                await tx.quote.findUnique({

                    where: {

                        id: quoteId,

                    },

                    include: {

                        items: true,

                    },

                });

            if (!existing) {

                throw new Error(
                    "Quote not found."
                );

            }

            QuoteValidator.validateStatusTransition(

                existing.status,

                existing.status,

            );

            let totals: QuoteTotals = {

                subtotal:
                    Number(existing.subtotal),

                discount:
                    Number(existing.discount),

                freight:
                    Number(existing.freight),

                insurance:
                    Number(existing.insurance),

                tax:
                    Number(existing.tax),

                grandTotal:
                    Number(existing.grandTotal),

            };

            /* ============================================================
             * Replace Items
             * ============================================================ */

            if (input.items) {

                QuoteValidator.validateItems(
                    input.items
                );

                totals =
                    this.calculateTotals({

                        ...existing,

                        items: input.items,

                        discount:
                            input.discount ??
                            totals.discount,

                        freight:
                            input.freight ??
                            totals.freight,

                        insurance:
                            input.insurance ??
                            totals.insurance,

                        tax:
                            input.tax ??
                            totals.tax,

                    } as CreateQuoteInput);

                await tx.quoteItem.deleteMany({

                    where: {

                        quoteId,

                    },

                });

                await tx.quoteItem.createMany({

                    data:

                        input.items.map(item => ({

                            quoteId,

                            productId:
                                item.productId,

                            description:
                                item.description,

                            quantity:
                                item.quantity,

                            unit:
                                item.unit,

                            unitPrice:
                                item.unitPrice,

                            lineTotal:
                                item.quantity *
                                item.unitPrice,

                        })),

                });

            }

            /* ============================================================
             * Update Header
             * ============================================================ */

            const updated =
                await tx.quote.update({

                    where: {

                        id: quoteId,

                    },

                    data: {

                        companyName:
                            input.companyName,

                        contactPerson:
                            input.contactPerson,

                        email:
                            input.email,

                        phone:
                            input.phone,

                        country:
                            input.country,

                        currency:
                            input.currency,

                        notes:
                            input.notes,

                        subtotal:
                            totals.subtotal,

                        discount:
                            totals.discount,

                        freight:
                            totals.freight,

                        insurance:
                            totals.insurance,

                        tax:
                            totals.tax,

                        grandTotal:
                            totals.grandTotal,

                        updatedById:
                            input.createdById,

                    },

                });

            /* ============================================================
             * Activity
             * ============================================================ */

            await ActivityLogger.logEvent(

                {

                    entityType:
                        ActivityEntityType.QUOTE,

                    entityId:
                        updated.id,

                    entityNumber:
                        updated.quoteNumber,

                    action:
                        ActivityAction.QUOTE_UPDATED,

                    title:
                        "Quote Updated",

                    description:
                        "Quotation details were updated.",

                    performedById:
                        input.createdById,

                },

                tx,

            );

            return updated;

        });

    }
        /* ==========================================================================
     * CREATE REVISION
     * ==========================================================================
     *
     * Creates a new immutable version of an existing quotation.
     * ======================================================================== */

        static async createRevision(

          quoteId: string,
  
          performedById?: string,
  
      ): Promise<Quote> {
  
          return prisma.$transaction(async (tx) => {
  
              const existing =
                  await tx.quote.findUnique({
  
                      where: {
  
                          id: quoteId,
  
                      },
  
                      include: {
  
                          items: true,
  
                      },
  
                  });
  
              if (!existing) {
  
                  throw new Error(
                      "Quote not found."
                  );
  
              }
  
              const latest =
                  await this.getLatestRevision(
                      existing.parentQuoteId ?? existing.id,
                      tx
                  );
  
              if (latest.id !== existing.id) {
  
                  throw new Error(
                      "Only the latest quote revision can be revised."
                  );
  
              }
  
              const revision =
                  await tx.quote.create({
  
                      data: {
  
                          quoteNumber:
                              existing.quoteNumber,
  
                          inquiryId:
                              existing.inquiryId,
  
                          version:
                              existing.version + 1,
  
                          parentQuoteId:
                              existing.parentQuoteId ??
                              existing.id,
  
                          companyName:
                              existing.companyName,
  
                          contactPerson:
                              existing.contactPerson,
  
                          email:
                              existing.email,
  
                          phone:
                              existing.phone,
  
                          country:
                              existing.country,
  
                          currency:
                              existing.currency,
  
                          subtotal:
                              existing.subtotal,
  
                          discount:
                              existing.discount,
  
                          freight:
                              existing.freight,
  
                          insurance:
                              existing.insurance,
  
                          tax:
                              existing.tax,
  
                          grandTotal:
                              existing.grandTotal,
  
                          validityDays:
                              existing.validityDays,
  
                          validUntil:
                              existing.validUntil,
  
                          notes:
                              existing.notes,
  
                          status:
                              QuoteStatus.DRAFT,
  
                          createdById:
                              performedById,
  
                          items: {
  
                              create:
  
                                  existing.items.map(item => ({
  
                                      productId:
                                          item.productId,
  
                                      description:
                                          item.description,
  
                                      quantity:
                                          item.quantity,
  
                                      unit:
                                          item.unit,
  
                                      unitPrice:
                                          item.unitPrice,
  
                                      lineTotal:
                                          item.lineTotal,
  
                                  })),
  
                          },
  
                      },
  
                  });
  
              await ActivityLogger.logEvent(
  
                  {
  
                      entityType:
                          ActivityEntityType.QUOTE,
  
                      entityId:
                          revision.id,
  
                      entityNumber:
                          revision.quoteNumber,
  
                      action:
                          ActivityAction.QUOTE_REVISED,
  
                      title:
                          "Quote Revised",
  
                      description:
                          `Revision ${revision.version} created.`,
  
                      metadata: {
  
                          previousQuoteId:
                              existing.id,
  
                          version:
                              revision.version,
  
                      },
  
                      performedById,
  
                  },
  
                  tx,
  
              );
  
              return revision;
  
          });
  
      }
  
      /* ==========================================================================
       * CHANGE STATUS
       * ======================================================================== */
  
      static async changeStatus(
  
          quoteId: string,
  
          status: QuoteStatus,
  
          performedById?: string,
  
      ): Promise<Quote> {
  
          return prisma.$transaction(async (tx) => {
  
              const existing =
                  await tx.quote.findUnique({
  
                      where: {
  
                          id: quoteId,
  
                      },
  
                  });
  
              if (!existing) {
  
                  throw new Error(
                      "Quote not found."
                  );
  
              }
  
              QuoteValidator.validateStatusTransition(
  
                  existing.status,
  
                  status,
  
              );
  
              const updated =
                  await tx.quote.update({
  
                      where: {
  
                          id: quoteId,
  
                      },
  
                      data: {
  
                          status,
  
                          updatedById:
                              performedById,
  
                      },
  
                  });
  
              await ActivityLogger.logEvent(
  
                  {
  
                      entityType:
                          ActivityEntityType.QUOTE,
  
                      entityId:
                          updated.id,
  
                      entityNumber:
                          updated.quoteNumber,
  
                      action:
                          ActivityAction.QUOTE_STATUS_CHANGED,
  
                      title:
                          "Quote Status Changed",
  
                      description:
                          `Status changed to ${status}.`,
  
                      metadata: {
  
                          status,
  
                      },
  
                      performedById,
  
                  },
  
                  tx,
  
              );
  
              return updated;
  
          });
  
      }
  
      /* ==========================================================================
       * HELPERS
       * ======================================================================== */
  
      static async getQuoteById(
          id: string
      ) {
  
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
  
                  createdBy: true,
  
                  updatedBy: true,
  
              },
  
          });
  
      }
  
      static async getRevisions(
          quoteId: string
      ) {
  
          const quote =
              await prisma.quote.findUnique({
  
                  where: {
  
                      id: quoteId,
  
                  },
  
              });
  
          if (!quote) {
  
              throw new Error(
                  "Quote not found."
              );
  
          }
  
          const rootId =
              quote.parentQuoteId ??
              quote.id;
  
          return prisma.quote.findMany({
  
              where: {
  
                  OR: [
  
                      { id: rootId },
  
                      {
                          parentQuoteId: rootId,
                      },
  
                  ],
  
              },
  
              orderBy: {
  
                  version: "asc",
  
              },
  
          });
  
      }
  
      private static async getLatestRevision(
  
          rootId: string,
  
          tx: Prisma.TransactionClient,
  
      ) {
  
          const latest =
              await tx.quote.findFirst({
  
                  where: {
  
                      OR: [
  
                          { id: rootId },
  
                          {
                              parentQuoteId: rootId,
                          },
  
                      ],
  
                  },
  
                  orderBy: {
  
                      version: "desc",
  
                  },
  
              });
  
          if (!latest) {
  
              throw new Error(
                  "Quote not found."
              );
  
          }
  
          return latest;
  
      }
  
      static async isLatestRevision(
          quoteId: string
      ) {
  
          const quote =
              await prisma.quote.findUnique({
  
                  where: {
  
                      id: quoteId,
  
                  },
  
              });
  
          if (!quote) {
  
              return false;
  
          }
  
          const latest =
              await this.getLatestRevision(
                  quote.parentQuoteId ?? quote.id,
                  prisma
              );
  
          return latest.id === quote.id;
  
      }
  
  }
  
  /* ============================================================================
   * EXPORTS
   * ========================================================================== */
  
  export default QuoteBusinessService;