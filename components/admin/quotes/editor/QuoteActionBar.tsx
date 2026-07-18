"use client";

/**
 * ============================================================
 * ROOTYM Admin
 * File: components/admin/quotes/editor/QuoteActionBar.tsx
 * Sprint 8.1
 * ============================================================
 */

import {
  Download,
  Eye,
  Loader2,
  Mail,
  Save,
  Send,
} from "lucide-react";

interface Props {
  saving: boolean;
  sending: boolean;
  generatingPdf: boolean;

  onSave: () => void;
  onPreview: () => void;
  onSend: () => void;
  onDownloadPdf: () => void;
}

export default function QuoteActionBar({
  saving,
  sending,
  generatingPdf,
  onSave,
  onPreview,
  onSend,
  onDownloadPdf,
}: Props) {
  return (
    <div className="sticky top-0 z-30 rounded-xl border bg-background/95 p-4 shadow-sm backdrop-blur">

      <div className="flex flex-wrap items-center justify-end gap-3">

        <button
          type="button"
          onClick={onPreview}
          className="inline-flex h-11 items-center gap-2 rounded-lg border px-4 transition hover:bg-muted"
        >
          <Eye className="h-4 w-4" />
          Preview
        </button>

        <button
          type="button"
          onClick={onDownloadPdf}
          disabled={generatingPdf}
          className="inline-flex h-11 items-center gap-2 rounded-lg border px-4 transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
        >
          {generatingPdf ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}

          Download PDF
        </button>

        <button
          type="button"
          onClick={onSend}
          disabled={sending}
          className="inline-flex h-11 items-center gap-2 rounded-lg border px-4 transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Mail className="h-4 w-4" />
          )}

          Send Quote
        </button>

        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}

          Save Changes
        </button>

      </div>

      <div className="mt-3 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">

        <span>
          Changes are saved through the Quote API.
        </span>

        <span className="inline-flex items-center gap-1">
          <Send className="h-3 w-3" />
          Production Ready
        </span>

      </div>

    </div>
  );
}