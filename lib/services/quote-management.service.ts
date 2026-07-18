/**
 * ============================================================
 * ROOTYM
 * File: lib/services/quote-management.service.ts
 * Sprint 8.1
 * ============================================================
 */

import { quoteRepository } from "@/lib/repositories/quote.repository";

import {
  mapQuoteFromPrisma,
  mapQuoteToPersistence,
} from "@/lib/mappers/quote.mapper";

import { quoteSchema } from "@/lib/validators/quote";

import { calculateQuoteTotals } from "@/lib/utils/quote-calculator";

import { generateQuoteNumber } from "@/lib/utils/quote-number";

import {
  DEFAULT_QUOTE_VALIDITY_DAYS,
} from "@/lib/constants/quote";

export class QuoteManagementService {
  async list(options?: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: string;
  }) {
    const result =
      await quoteRepository.findMany(options);

    return {
      ...result,
      items: result.items.map(
        mapQuoteFromPrisma
      ),
    };
  }

  async get(id: string) {
    const quote =
      await quoteRepository.findById(id);

    if (!quote) {
      throw new Error(
        "Quote not found."
      );
    }

    return mapQuoteFromPrisma(
      quote
    );
  }

  async create(payload: unknown) {
    const input =
      quoteSchema.parse(payload);

    const totals =
      calculateQuoteTotals({
        items: input.items,
        freight: input.freight,
        insurance:
          input.insurance,
        discount:
          input.discount,
        tax: input.tax,
      });

    const sequence =
      await quoteRepository.nextSequence();

    const quoteNumber =
      generateQuoteNumber(
        sequence
      );

    const persistence =
      mapQuoteToPersistence(
        input
      );

    const created =
      await quoteRepository.create({
        ...persistence,

        quoteNumber,

        subtotal:
          totals.subtotal,

          discount:
          totals.discount,

        freight:
          totals.freight,

        insurance:
          totals.insurance,

        tax: totals.tax,

        grandTotal:
          totals.grandTotal,
      } as any);

    return mapQuoteFromPrisma(
      created
    );
  }

  async update(
    id: string,
    payload: unknown
  ) {
    const exists =
      await quoteRepository.exists(
        id
      );

    if (!exists) {
      throw new Error(
        "Quote not found."
      );
    }

    const input =
      quoteSchema.parse(payload);

    const totals =
      calculateQuoteTotals({
        items: input.items,
        freight: input.freight,
        insurance:
          input.insurance,
        discount:
          input.discount,
        tax: input.tax,
      });

    const updated =
      await quoteRepository.update(
        id,
        {
          ...mapQuoteToPersistence(
            input
          ),

          subtotal:
            totals.subtotal,

          discount:
          totals.discount,

          freight:
            totals.freight,

          insurance:
            totals.insurance,

          tax: totals.tax,

          grandTotal:
            totals.grandTotal,
        } as any
      );

    return mapQuoteFromPrisma(
      updated
    );
  }

  async delete(id: string) {
    const exists =
      await quoteRepository.exists(
        id
      );

    if (!exists) {
      throw new Error(
        "Quote not found."
      );
    }

    await quoteRepository.delete(
      id
    );
  }

  async changeStatus(
    id: string,
    status: string
  ) {
    const updated =
      await quoteRepository.updateStatus(
        id,
        status
      );

    return updated;
  }

  createDefaultValidityDate(
    issueDate = new Date()
  ) {
    const validity =
      new Date(issueDate);

    validity.setDate(
      validity.getDate() +
        DEFAULT_QUOTE_VALIDITY_DAYS
    );

    return validity;
  }
}

export const quoteManagementService =
  new QuoteManagementService();