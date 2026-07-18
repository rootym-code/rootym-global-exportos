"use client";

/**
 * ============================================================
 * ROOTYM Admin
 * File: components/admin/quotes/QuoteTable.tsx
 * Sprint 8.1
 * ============================================================
 */

import Link from "next/link";
import {
  Eye,
  FileEdit,
  Mail,
  MoreHorizontal,
  RefreshCw,
} from "lucide-react";

import type { QuoteRow } from "./QuoteManagementPage";

interface Props {
  loading: boolean;
  quotes: QuoteRow[];

  page: number;
  totalPages: number;

  onPageChange: (page: number) => void;
  onRefresh: () => void;
}

const STATUS_STYLE: Record<string, string> = {
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

function formatCurrency(
  amount: number,
  currency: string
) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

function formatDate(value?: string | null) {
  if (!value) return "-";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function QuoteTable({
  loading,
  quotes,
  page,
  totalPages,
  onPageChange,
  onRefresh,
}: Props) {
  return (
    <div className="rounded-xl border bg-background shadow-sm">

      <div className="flex items-center justify-between border-b p-4">

        <div>
          <h2 className="text-lg font-semibold">
            Quotes
          </h2>

          <p className="text-sm text-muted-foreground">
            All generated quotations
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full text-sm">

          <thead className="bg-muted/40">

            <tr>

              <th className="px-4 py-3 text-left font-medium">
                Quote
              </th>

              <th className="px-4 py-3 text-left font-medium">
                Customer
              </th>

              <th className="px-4 py-3 text-left font-medium">
                Country
              </th>

              <th className="px-4 py-3 text-left font-medium">
                Amount
              </th>

              <th className="px-4 py-3 text-left font-medium">
                Status
              </th>

              <th className="px-4 py-3 text-left font-medium">
                Valid Till
              </th>

              <th className="px-4 py-3 text-left font-medium">
                Updated
              </th>

              <th className="px-4 py-3 text-right font-medium">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {loading && (
              <tr>
                <td
                  colSpan={8}
                  className="py-16 text-center text-muted-foreground"
                >
                  Loading quotes...
                </td>
              </tr>
            )}

            {!loading && quotes.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="py-16 text-center text-muted-foreground"
                >
                  No quotes found.
                </td>
              </tr>
            )}

            {!loading &&
              quotes.map((quote) => (
                <tr
                  key={quote.id}
                  className="border-t hover:bg-muted/30"
                >
                  <td className="px-4 py-4">

                    <div className="font-semibold">
                      {quote.quoteNumber}
                    </div>

                    <div className="mt-1 text-xs text-muted-foreground">
                      Inquiry #{quote.inquiryId}
                    </div>

                  </td>

                  <td className="px-4 py-4">

                    <div className="font-medium">
                      {quote.customerName}
                    </div>

                    <div className="mt-1 text-xs text-muted-foreground">
                      {quote.companyName || "-"}
                    </div>

                  </td>

                  <td className="px-4 py-4">
                    {quote.country || "-"}
                  </td>

                  <td className="px-4 py-4 font-medium">
                    {formatCurrency(
                      quote.total,
                      quote.currency
                    )}
                  </td>

                  <td className="px-4 py-4">

                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                        STATUS_STYLE[quote.status]
                      }`}
                    >
                      {quote.status}
                    </span>

                  </td>

                  <td className="px-4 py-4">
                    {formatDate(quote.validUntil)}
                  </td>

                  <td className="px-4 py-4">
                    {formatDate(quote.updatedAt)}
                  </td>

                  <td className="px-4 py-4">

                    <div className="flex justify-end gap-2">

                      <Link
                        href={`/admin/quotes/${quote.id}`}
                        className="rounded-md border p-2 hover:bg-muted"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>

                      <Link
                        href={`/admin/quotes/${quote.id}/edit`}
                        className="rounded-md border p-2 hover:bg-muted"
                        title="Edit"
                      >
                        <FileEdit className="h-4 w-4" />
                      </Link>

                      <button
                        className="rounded-md border p-2 hover:bg-muted"
                        title="Send Email"
                      >
                        <Mail className="h-4 w-4" />
                      </button>

                      <button
                        className="rounded-md border p-2 hover:bg-muted"
                        title="More"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>

                    </div>

                  </td>

                </tr>
              ))}

          </tbody>

        </table>

      </div>

      <div className="flex items-center justify-between border-t p-4">

        <div className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </div>

        <div className="flex gap-2">

          <button
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="rounded-lg border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 hover:bg-muted"
          >
            Previous
          </button>

          <button
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="rounded-lg border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 hover:bg-muted"
          >
            Next
          </button>

        </div>

      </div>

    </div>
  );
}