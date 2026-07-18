"use client";

/**
 * ============================================================
 * ROOTYM Admin
 * File: components/admin/quotes/QuoteActionsDropdown.tsx
 * Sprint 8.1
 * ============================================================
 */

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Copy,
  Download,
  Eye,
  Mail,
  MoreVertical,
  Pencil,
  RefreshCw,
  Trash2,
} from "lucide-react";

interface Props {
  quoteId: string;

  onDuplicate?: () => void;
  onSend?: () => void;
  onDownloadPdf?: () => void;
  onChangeStatus?: () => void;
  onDelete?: () => void;
}

export default function QuoteActionsDropdown({
  quoteId,
  onDuplicate,
  onSend,
  onDownloadPdf,
  onChangeStatus,
  onDelete,
}: Props) {
  const [open, setOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClick
      );
    };
  }, []);

  function closeAndRun(callback?: () => void) {
    setOpen(false);

    callback?.();
  }

  return (
    <div
      ref={menuRef}
      className="relative inline-block text-left"
    >
      <button
        type="button"
        onClick={() =>
          setOpen((previous) => !previous)
        }
        className="rounded-lg border p-2 transition hover:bg-muted"
        aria-label="Quote Actions"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-60 rounded-xl border bg-background py-2 shadow-xl">

          <Link
            href={`/admin/quotes/${quoteId}`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted"
          >
            <Eye className="h-4 w-4" />
            View Quote
          </Link>

          <Link
            href={`/admin/quotes/${quoteId}/edit`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted"
          >
            <Pencil className="h-4 w-4" />
            Edit Quote
          </Link>

          <button
            type="button"
            onClick={() =>
              closeAndRun(onDuplicate)
            }
            className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm hover:bg-muted"
          >
            <Copy className="h-4 w-4" />
            Duplicate Quote
          </button>

          <button
            type="button"
            onClick={() =>
              closeAndRun(onSend)
            }
            className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm hover:bg-muted"
          >
            <Mail className="h-4 w-4" />
            Send Quote
          </button>

          <button
            type="button"
            onClick={() =>
              closeAndRun(onDownloadPdf)
            }
            className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm hover:bg-muted"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </button>

          <button
            type="button"
            onClick={() =>
              closeAndRun(onChangeStatus)
            }
            className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm hover:bg-muted"
          >
            <RefreshCw className="h-4 w-4" />
            Change Status
          </button>

          <div className="my-2 border-t" />

          <button
            type="button"
            onClick={() =>
              closeAndRun(onDelete)
            }
            className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <Trash2 className="h-4 w-4" />
            Delete Quote
          </button>

        </div>
      )}
    </div>
  );
}