"use client";

/**
 * ============================================================
 * ROOTYM Admin
 * File: components/admin/quotes/editor/QuoteNotesCard.tsx
 * Sprint 8.1
 * ============================================================
 */

import {
  FileText,
  ShieldCheck,
} from "lucide-react";

interface Props {
  notes: string;
  termsAndConditions: string;

  onNotesChange: (value: string) => void;
  onTermsChange: (value: string) => void;
}

export default function QuoteNotesCard({
  notes,
  termsAndConditions,
  onNotesChange,
  onTermsChange,
}: Props) {
  return (
    <div className="space-y-6">

      {/* Internal Notes */}

      <section className="rounded-xl border bg-background shadow-sm">

        <div className="flex items-center gap-2 border-b px-5 py-4">

          <FileText className="h-5 w-5 text-primary" />

          <h2 className="text-lg font-semibold">
            Internal Notes
          </h2>

        </div>

        <div className="p-5">

          <textarea
            rows={6}
            value={notes}
            onChange={(e) =>
              onNotesChange(e.target.value)
            }
            placeholder="Internal comments visible only to administrators..."
            className="
              w-full
              rounded-lg
              border
              p-3
              text-sm
              outline-none
              transition
              focus:border-primary
              focus:ring-2
              focus:ring-primary/20
            "
          />

          <p className="mt-2 text-xs text-muted-foreground">
            These notes are never included in the customer PDF.
          </p>

        </div>

      </section>

      {/* Terms & Conditions */}

      <section className="rounded-xl border bg-background shadow-sm">

        <div className="flex items-center gap-2 border-b px-5 py-4">

          <ShieldCheck className="h-5 w-5 text-primary" />

          <h2 className="text-lg font-semibold">
            Terms & Conditions
          </h2>

        </div>

        <div className="p-5">

          <textarea
            rows={10}
            value={termsAndConditions}
            onChange={(e) =>
              onTermsChange(e.target.value)
            }
            placeholder="Commercial terms, warranty, payment conditions, shipment conditions, quality clause..."
            className="
              w-full
              rounded-lg
              border
              p-3
              text-sm
              outline-none
              transition
              focus:border-primary
              focus:ring-2
              focus:ring-primary/20
            "
          />

          <p className="mt-2 text-xs text-muted-foreground">
            These terms will appear in the exported PDF and customer quotation.
          </p>

        </div>

      </section>

    </div>
  );
}