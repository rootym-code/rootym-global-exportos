"use client";

/**
 * ============================================================
 * ROOTYM Admin
 * File: components/admin/quotes/QuoteDeleteDialog.tsx
 * Sprint 8.1
 * ============================================================
 */

import { Loader2, TriangleAlert } from "lucide-react";

interface Props {
  open: boolean;
  loading?: boolean;

  quoteNumber?: string;

  onClose: () => void;
  onConfirm: () => void;
}

export default function QuoteDeleteDialog({
  open,
  loading = false,
  quoteNumber,
  onClose,
  onConfirm,
}: Props) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-md rounded-xl border bg-background shadow-2xl">

        <div className="border-b p-6">

          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400">
              <TriangleAlert className="h-6 w-6" />
            </div>

            <div>

              <h2 className="text-xl font-semibold">
                Delete Quote
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                This action cannot be undone.
              </p>

            </div>

          </div>

        </div>

        <div className="space-y-4 p-6">

          <p className="text-sm leading-7">
            You are about to permanently delete
            the following quotation:
          </p>

          <div className="rounded-lg border bg-muted/40 p-4">

            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              Quote Number
            </div>

            <div className="mt-1 font-semibold">
              {quoteNumber || "-"}
            </div>

          </div>

          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/20 dark:text-red-300">
            The quotation, pricing history, audit
            records, and associated data may no
            longer be recoverable after deletion.
          </div>

        </div>

        <div className="flex justify-end gap-3 border-t p-5">

          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="rounded-lg border px-4 py-2.5 text-sm font-medium transition hover:bg-muted disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
          >
            {loading && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}

            Delete Quote
          </button>

        </div>

      </div>

    </div>
  );
}