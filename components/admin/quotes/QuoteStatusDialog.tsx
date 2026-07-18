"use client";

/**
 * ============================================================
 * ROOTYM Admin
 * File: components/admin/quotes/QuoteStatusDialog.tsx
 * Sprint 8.1
 * ============================================================
 */

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export const QUOTE_STATUSES = [
  "DRAFT",
  "SENT",
  "VIEWED",
  "NEGOTIATION",
  "APPROVED",
  "REJECTED",
  "EXPIRED",
] as const;

export type QuoteStatus =
  (typeof QUOTE_STATUSES)[number];

interface Props {
  open: boolean;

  currentStatus: QuoteStatus;

  loading?: boolean;

  onClose: () => void;

  onSave: (
    status: QuoteStatus,
    remarks: string
  ) => void;
}

export default function QuoteStatusDialog({
  open,
  currentStatus,
  loading = false,
  onClose,
  onSave,
}: Props) {
  const [status, setStatus] =
    useState<QuoteStatus>(currentStatus);

  const [remarks, setRemarks] =
    useState("");

  useEffect(() => {
    if (!open) return;

    setStatus(currentStatus);
    setRemarks("");
  }, [open, currentStatus]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-lg rounded-xl border bg-background shadow-2xl">

        <div className="border-b px-6 py-5">

          <h2 className="text-xl font-semibold">
            Change Quote Status
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Update the quotation lifecycle and
            optionally record internal remarks.
          </p>

        </div>

        <div className="space-y-5 p-6">

          <div>

            <label className="mb-2 block text-sm font-medium">
              Status
            </label>

            <select
              value={status}
              disabled={loading}
              onChange={(e) =>
                setStatus(
                  e.target.value as QuoteStatus
                )
              }
              className="h-11 w-full rounded-lg border px-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {QUOTE_STATUSES.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item.replaceAll("_", " ")}
                </option>
              ))}
            </select>

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Remarks
            </label>

            <textarea
              rows={5}
              disabled={loading}
              value={remarks}
              onChange={(e) =>
                setRemarks(e.target.value)
              }
              placeholder="Reason for status update..."
              className="w-full rounded-lg border p-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />

          </div>

        </div>

        <div className="flex justify-end gap-3 border-t px-6 py-5">

          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="rounded-lg border px-5 py-2.5 hover:bg-muted disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() =>
              onSave(status, remarks)
            }
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            {loading && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}

            Update Status
          </button>

        </div>

      </div>

    </div>
  );
}