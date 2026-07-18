"use client";

/**
 * ============================================================
 * ROOTYM Admin
 * File: components/admin/quotes/details/QuoteOverviewCard.tsx
 * Sprint 8.1
 * ============================================================
 */

import type { QuoteDetails } from "./QuoteDetailsPage";

interface Props {
  quote: QuoteDetails;
}

const STATUS_STYLES: Record<string, string> = {
  DRAFT:
    "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-300",

  SENT:
    "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300",

  VIEWED:
    "bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300",

  NEGOTIATION:
    "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300",

  APPROVED:
    "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300",

  REJECTED:
    "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300",

  EXPIRED:
    "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-300",
};

function formatDate(value?: string | null) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function QuoteOverviewCard({
  quote,
}: Props) {
  return (
    <section className="rounded-xl border bg-background shadow-sm">

      <div className="border-b px-6 py-4">
        <h2 className="text-lg font-semibold">
          Quote Overview
        </h2>
      </div>

      <div className="grid gap-6 p-6 md:grid-cols-2">

        <div className="space-y-5">

          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Quote Number
            </p>

            <p className="mt-1 text-base font-semibold">
              {quote.quoteNumber}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Inquiry Reference
            </p>

            <p className="mt-1 font-medium">
              #{quote.inquiryId}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Status
            </p>

            <span
              className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                STATUS_STYLES[quote.status] ??
                STATUS_STYLES.DRAFT
              }`}
            >
              {quote.status}
            </span>
          </div>

        </div>

        <div className="space-y-5">

          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Currency
            </p>

            <p className="mt-1 font-medium">
              {quote.currency}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Valid Until
            </p>

            <p className="mt-1 font-medium">
              {formatDate(quote.validUntil)}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Last Updated
            </p>

            <p className="mt-1 font-medium">
              {formatDate(quote.updatedAt)}
            </p>
          </div>

        </div>

      </div>

      {quote.notes && quote.notes.trim().length > 0 && (
        <>
          <div className="border-t" />

          <div className="p-6">

            <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
              Internal Notes
            </p>

            <div className="rounded-lg border bg-muted/30 p-4 text-sm leading-7 whitespace-pre-wrap">
              {quote.notes}
            </div>

          </div>
        </>
      )}

    </section>
  );
}