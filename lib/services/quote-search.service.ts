/**
 * ============================================================
 * ROOTYM
 * File: lib/services/quote-search.service.ts
 * Sprint 8.1
 * ============================================================
 */

import type {
  Quote,
  QuoteStatus,
} from "@/lib/types/quote";

export interface QuoteSearchFilters {
  search?: string;

  status?: QuoteStatus;

  country?: string;

  currency?: string;

  fromDate?: string;

  toDate?: string;

  company?: string;

  minAmount?: number;

  maxAmount?: number;

  page?: number;

  pageSize?: number;
}

export interface QuoteSearchResult {
  items: Quote[];

  total: number;

  page: number;

  pageSize: number;

  totalPages: number;
}

class QuoteSearchService {
  search(
    quotes: Quote[],
    filters: QuoteSearchFilters = {}
  ): QuoteSearchResult {
    let result = [...quotes];

    if (filters.search) {
      const keyword =
        filters.search.toLowerCase();

      result = result.filter((quote) => {
        return (
          quote.quoteNumber
            .toLowerCase()
            .includes(keyword) ||
          quote.companyName
            .toLowerCase()
            .includes(keyword) ||
          quote.contactPerson
            .toLowerCase()
            .includes(keyword) ||
          quote.email
            .toLowerCase()
            .includes(keyword)
        );
      });
    }

    if (filters.status) {
      result = result.filter(
        (quote) =>
          quote.status ===
          filters.status
      );
    }

    if (filters.country) {
      result = result.filter(
        (quote) =>
          quote.country ===
          filters.country
      );
    }

    if (filters.currency) {
      result = result.filter(
        (quote) =>
          quote.currency ===
          filters.currency
      );
    }

    if (filters.company) {
      const company =
        filters.company.toLowerCase();

      result = result.filter((quote) =>
        quote.companyName
          .toLowerCase()
          .includes(company)
      );
    }

    if (filters.fromDate) {
      const from =
        new Date(filters.fromDate);

      result = result.filter(
        (quote) =>
          new Date(
            quote.createdAt
          ) >= from
      );
    }

    if (filters.toDate) {
      const to =
        new Date(filters.toDate);

      result = result.filter(
        (quote) =>
          new Date(
            quote.createdAt
          ) <= to
      );
    }

    if (
      filters.minAmount !==
      undefined
    ) {
      result = result.filter(
        (quote) =>
          quote.grandTotal >=
          filters.minAmount!
      );
    }

    if (
      filters.maxAmount !==
      undefined
    ) {
      result = result.filter(
        (quote) =>
          quote.grandTotal <=
          filters.maxAmount!
      );
    }

    result.sort(
      (a, b) =>
        new Date(
          b.createdAt
        ).getTime() -
        new Date(
          a.createdAt
        ).getTime()
    );

    const page =
      filters.page ?? 1;

    const pageSize =
      filters.pageSize ?? 20;

    const total =
      result.length;

    const totalPages =
      Math.max(
        1,
        Math.ceil(
          total / pageSize
        )
      );

    const items =
      result.slice(
        (page - 1) * pageSize,
        page * pageSize
      );

    return {
      items,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  availableCountries(
    quotes: Quote[]
  ): string[] {
    return [
      ...new Set(
        quotes
          .map(
            (q) => q.country
          )
          .filter(Boolean)
      ),
    ].sort();
  }

  availableCurrencies(
    quotes: Quote[]
  ): string[] {
    return [
      ...new Set(
        quotes.map(
          (q) => q.currency
        )
      ),
    ].sort();
  }

  availableCompanies(
    quotes: Quote[]
  ): string[] {
    return [
      ...new Set(
        quotes
          .map(
            (q) =>
              q.companyName
          )
          .filter(Boolean)
      ),
    ].sort();
  }
}

export const quoteSearchService =
  new QuoteSearchService();