"use client";

/**
 * ============================================================
 * ROOTYM Admin
 * File: components/admin/quotes/QuoteSendDialog.tsx
 * Sprint 8.1
 * ============================================================
 */

import { useEffect, useState } from "react";
import {
  Loader2,
  Mail,
  Send,
} from "lucide-react";

interface Props {
  open: boolean;

  loading?: boolean;

  defaultTo: string;
  defaultCc?: string;

  quoteNumber: string;

  onClose: () => void;

  onSend: (payload: {
    to: string;
    cc: string;
    subject: string;
    message: string;
  }) => void;
}

export default function QuoteSendDialog({
  open,
  loading = false,
  defaultTo,
  defaultCc = "",
  quoteNumber,
  onClose,
  onSend,
}: Props) {
  const [to, setTo] = useState(defaultTo);

  const [cc, setCc] = useState(defaultCc);

  const [subject, setSubject] = useState("");

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    if (!open) return;

    setTo(defaultTo);

    setCc(defaultCc);

    setSubject(
      `Quotation ${quoteNumber}`
    );

    setMessage(`Dear Customer,

Please find attached our quotation ${quoteNumber} for your enquiry.

If you have any questions or require any revisions, please let us know.

Thank you for your business.

Regards,
ROOTYM Export Team`);
  }, [
    open,
    defaultTo,
    defaultCc,
    quoteNumber,
  ]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-2xl rounded-xl border bg-background shadow-2xl">

        <div className="flex items-center gap-3 border-b px-6 py-5">

          <Mail className="h-5 w-5 text-primary" />

          <div>

            <h2 className="text-xl font-semibold">
              Send Quote
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Email quotation directly to the
              customer.
            </p>

          </div>

        </div>

        <div className="space-y-5 p-6">

          <div>

            <label className="mb-2 block text-sm font-medium">
              To
            </label>

            <input
              type="email"
              value={to}
              disabled={loading}
              onChange={(e) =>
                setTo(e.target.value)
              }
              className="h-11 w-full rounded-lg border px-3"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              CC
            </label>

            <input
              type="email"
              value={cc}
              disabled={loading}
              onChange={(e) =>
                setCc(e.target.value)
              }
              className="h-11 w-full rounded-lg border px-3"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Subject
            </label>

            <input
              value={subject}
              disabled={loading}
              onChange={(e) =>
                setSubject(e.target.value)
              }
              className="h-11 w-full rounded-lg border px-3"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Message
            </label>

            <textarea
              rows={10}
              value={message}
              disabled={loading}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              className="w-full rounded-lg border p-3"
            />

          </div>

        </div>

        <div className="flex justify-end gap-3 border-t px-6 py-5">

          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="rounded-lg border px-5 py-2.5 hover:bg-muted"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={
              loading ||
              !to.trim() ||
              !subject.trim()
            }
            onClick={() =>
              onSend({
                to,
                cc,
                subject,
                message,
              })
            }
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-medium text-primary-foreground disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}

            Send Quote
          </button>

        </div>

      </div>

    </div>
  );
}