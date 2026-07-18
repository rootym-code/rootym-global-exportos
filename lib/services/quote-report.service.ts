/**
 * ============================================================
 * ROOTYM
 * File: lib/services/quote-report.service.ts
 * Sprint 8.1
 * ============================================================
 */

import type {
  Quote,
  QuoteStatus,
} from "@/lib/types/quote";

export interface QuoteDashboardReport {
  totalQuotes: number;

  totalValue: number;

  averageQuoteValue: number;

  draft: number;

  sent: number;

  viewed: number;

  negotiation: number;

  approved: number;

  rejected: number;

  expired: number;

  conversionRate: number;

  approvalRate: number;

  rejectionRate: number;

  expiryRate: number;

  monthlyValue: Record<string, number>;

  currencyBreakdown: Record<string, number>;
}

class QuoteReportService {
  /**
   * ------------------------------------------------------------
   * Dashboard Report
   * ------------------------------------------------------------
   */

  build(
    quotes: Quote[]
  ): QuoteDashboardReport {
    const statusCount: Record<
      QuoteStatus,
      number
    > = {
      DRAFT: 0,
      SENT: 0,
      VIEWED: 0,
      NEGOTIATION: 0,
      APPROVED: 0,
      REJECTED: 0,
      EXPIRED: 0,
    };

    const monthlyValue: Record<
      string,
      number
    > = {};

    const currencyBreakdown: Record<
      string,
      number
    > = {};

    let totalValue = 0;

    for (const quote of quotes) {
      statusCount[quote.status]++;

      totalValue += quote.grandTotal;

      const month = new Date(
        quote.createdAt
      )
        .toISOString()
        .slice(0, 7);

      monthlyValue[month] =
        (monthlyValue[month] ?? 0) +
        quote.grandTotal;

      const currency =
        quote.currency ?? "UNKNOWN";

      currencyBreakdown[currency] =
        (currencyBreakdown[currency] ?? 0) +
        quote.grandTotal;
    }

    const total = quotes.length || 1;

    return {
      totalQuotes: quotes.length,

      totalValue,

      averageQuoteValue:
        totalValue / total,

      draft: statusCount.DRAFT,

      sent: statusCount.SENT,

      viewed: statusCount.VIEWED,

      negotiation:
        statusCount.NEGOTIATION,

      approved:
        statusCount.APPROVED,

      rejected:
        statusCount.REJECTED,

      expired:
        statusCount.EXPIRED,

      conversionRate:
        (statusCount.APPROVED /
          total) *
        100,

      approvalRate:
        (statusCount.APPROVED /
          total) *
        100,

      rejectionRate:
        (statusCount.REJECTED /
          total) *
        100,

      expiryRate:
        (statusCount.EXPIRED /
          total) *
        100,

      monthlyValue,

      currencyBreakdown,
    };
  }

  /**
   * ------------------------------------------------------------
   * Status Distribution
   * ------------------------------------------------------------
   */

  statusDistribution(
    quotes: Quote[]
  ) {
    return quotes.reduce(
      (acc, quote) => {
        acc[quote.status] =
          (acc[quote.status] ?? 0) + 1;

        return acc;
      },
      {} as Record<string, number>
    );
  }

  /**
   * ------------------------------------------------------------
   * Top Companies
   * ------------------------------------------------------------
   */

  topCustomers(
    quotes: Quote[],
    limit = 10
  ) {
    const map = new Map<
      string,
      number
    >();

    for (const quote of quotes) {
      const key =
        quote.companyName ||
        "Unknown Company";

      map.set(
        key,
        (map.get(key) ?? 0) +
          quote.grandTotal
      );
    }

    return [...map.entries()]
      .sort(
        (a, b) => b[1] - a[1]
      )
      .slice(0, limit)
      .map(([customer, value]) => ({
        customer,
        value,
      }));
  }

  /**
   * ------------------------------------------------------------
   * Top Countries
   * ------------------------------------------------------------
   */

  topCountries(
    quotes: Quote[],
    limit = 10
  ) {
    const map = new Map<
      string,
      number
    >();

    for (const quote of quotes) {
      const key =
        quote.country ||
        "Unknown";

      map.set(
        key,
        (map.get(key) ?? 0) + 1
      );
    }

    return [...map.entries()]
      .sort(
        (a, b) => b[1] - a[1]
      )
      .slice(0, limit)
      .map(([country, total]) => ({
        country,
        total,
      }));
  }
}

export const quoteReportService =
  new QuoteReportService();