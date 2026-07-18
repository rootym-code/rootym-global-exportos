/**
 * ============================================================
 * ROOTYM
 * File: lib/services/quote-export.service.ts
 * Sprint 8.1
 * ============================================================
 */

import type { Quote } from "@/lib/types/quote";

import {
  formatCurrency,
  formatDate,
} from "@/lib/utils/quote-format";

export type QuoteExportFormat =
  | "csv"
  | "json";

export interface QuoteExportFile {
  fileName: string;

  mimeType: string;

  content: string;
}

class QuoteExportService {
  /**
   * ------------------------------------------------------------
   * Export Quotes
   * ------------------------------------------------------------
   */

  async export(
    quotes: Quote[],
    format: QuoteExportFormat
  ): Promise<QuoteExportFile> {
    switch (format) {
      case "csv":
        return this.exportCsv(quotes);

      case "json":
        return this.exportJson(quotes);

      default:
        throw new Error(
          "Unsupported export format."
        );
    }
  }

  /**
   * ------------------------------------------------------------
   * CSV
   * ------------------------------------------------------------
   */

  private async exportCsv(
    quotes: Quote[]
  ): Promise<QuoteExportFile> {
    const header = [
      "Quote Number",
      "Status",
      "Company",
      "Contact Person",
      "Country",
      "Currency",
      "Grand Total",
      "Created At",
      "Validity (Days)",
    ];

    const rows = quotes.map((quote) => [
      quote.quoteNumber,
      quote.status,
      this.escape(
        quote.companyName
      ),
      this.escape(
        quote.contactPerson
      ),
      this.escape(
        quote.country
      ),
      quote.currency,
      quote.grandTotal.toFixed(2),
      formatDate(
        quote.createdAt
      ),
      quote.validityDays.toString(),
    ]);

    const csv = [
      header.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");

    return {
      fileName: `quotes-${Date.now()}.csv`,

      mimeType: "text/csv",

      content: csv,
    };
  }

  /**
   * ------------------------------------------------------------
   * JSON
   * ------------------------------------------------------------
   */

  private async exportJson(
    quotes: Quote[]
  ): Promise<QuoteExportFile> {
    return {
      fileName: `quotes-${Date.now()}.json`,

      mimeType:
        "application/json",

      content: JSON.stringify(
        quotes,
        null,
        2
      ),
    };
  }

  /**
   * ------------------------------------------------------------
   * Single Quote Summary
   * ------------------------------------------------------------
   */

  summary(
    quote: Quote
  ) {
    return {
      quoteNumber:
        quote.quoteNumber,

      companyName:
        quote.companyName,

      contactPerson:
        quote.contactPerson,

      status:
        quote.status,

      total: formatCurrency(
        quote.grandTotal,
        quote.currency as any
      ),

      createdAt: formatDate(
        quote.createdAt
      ),

      validityDays:
        quote.validityDays,

      itemCount:
        quote.items.length,
    };
  }

  /**
   * ------------------------------------------------------------
   * Escape CSV
   * ------------------------------------------------------------
   */

  private escape(
    value?: string | null
  ): string {
    if (!value) {
      return "";
    }

    const escaped = value.replace(
      /"/g,
      '""'
    );

    return `"${escaped}"`;
  }
}

export const quoteExportService =
  new QuoteExportService();