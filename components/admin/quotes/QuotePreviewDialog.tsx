"use client";

/**
 * ============================================================
 * ROOTYM Admin
 * File: components/admin/quotes/QuotePreviewDialog.tsx
 * Sprint 8.1
 * ============================================================
 */

import {
  Download,
  ExternalLink,
  Loader2,
  Printer,
  X,
} from "lucide-react";

interface Props {
  open: boolean;

  title?: string;

  previewUrl?: string;

  loading?: boolean;

  onClose: () => void;

  onDownload?: () => void;

  onPrint?: () => void;
}

export default function QuotePreviewDialog({
  open,
  title = "Quote Preview",
  previewUrl,
  loading = false,
  onClose,
  onDownload,
  onPrint,
}: Props) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/60">

      <div className="flex h-full w-full flex-col bg-background">

        {/* Header */}

        <div className="flex items-center justify-between border-b px-6 py-4">

          <div>

            <h2 className="text-xl font-semibold">
              {title}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Preview the quotation before sending
              it to the customer.
            </p>

          </div>

          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={onPrint}
              className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-muted"
            >
              <Printer className="h-4 w-4" />
              Print
            </button>

            <button
              type="button"
              onClick={onDownload}
              className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-muted"
            >
              <Download className="h-4 w-4" />
              Download
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border p-2 hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>

          </div>

        </div>

        {/* Body */}

        <div className="flex-1 overflow-hidden">

          {loading ? (
            <div className="flex h-full items-center justify-center">

              <div className="flex items-center gap-3 text-muted-foreground">

                <Loader2 className="h-5 w-5 animate-spin" />

                Generating Preview...

              </div>

            </div>
          ) : previewUrl ? (
            <iframe
              title="Quote Preview"
              src={previewUrl}
              className="h-full w-full border-0"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center">

              <ExternalLink className="mb-4 h-10 w-10 text-muted-foreground" />

              <h3 className="text-lg font-semibold">
                Preview Unavailable
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                The preview could not be generated.
              </p>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}