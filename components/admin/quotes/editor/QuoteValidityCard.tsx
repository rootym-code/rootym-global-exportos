"use client";

/**
 * ============================================================
 * ROOTYM Admin
 * File: components/admin/quotes/editor/QuoteValidityCard.tsx
 * Sprint 8.1
 * ============================================================
 */

import {
  CalendarDays,
  Clock3,
} from "lucide-react";

interface Props {
  validUntil: string;

  paymentTerms: string;
  deliveryTerms: string;
  incoterm: string;

  onValidUntilChange: (value: string) => void;
  onPaymentTermsChange: (value: string) => void;
  onDeliveryTermsChange: (value: string) => void;
  onIncotermChange: (value: string) => void;
}

const INCOTERMS = [
  "EXW",
  "FCA",
  "FOB",
  "CFR",
  "CIF",
  "DAP",
  "DDP",
];

export default function QuoteValidityCard({
  validUntil,
  paymentTerms,
  deliveryTerms,
  incoterm,

  onValidUntilChange,
  onPaymentTermsChange,
  onDeliveryTermsChange,
  onIncotermChange,
}: Props) {
  return (
    <section className="rounded-xl border bg-background shadow-sm">

      <div className="border-b px-5 py-4">
        <h2 className="text-lg font-semibold">
          Commercial Terms
        </h2>
      </div>

      <div className="space-y-5 p-5">

        <div>

          <label className="mb-2 flex items-center gap-2 text-sm font-medium">
            <CalendarDays className="h-4 w-4" />
            Quote Valid Until
          </label>

          <input
            type="date"
            value={validUntil}
            onChange={(e) =>
              onValidUntilChange(e.target.value)
            }
            className="h-11 w-full rounded-lg border px-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />

        </div>

        <div>

          <label className="mb-2 block text-sm font-medium">
            Incoterm
          </label>

          <select
            value={incoterm}
            onChange={(e) =>
              onIncotermChange(e.target.value)
            }
            className="h-11 w-full rounded-lg border px-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            {INCOTERMS.map((term) => (
              <option
                key={term}
                value={term}
              >
                {term}
              </option>
            ))}
          </select>

        </div>

        <div>

          <label className="mb-2 flex items-center gap-2 text-sm font-medium">
            <Clock3 className="h-4 w-4" />
            Payment Terms
          </label>

          <textarea
            rows={3}
            value={paymentTerms}
            onChange={(e) =>
              onPaymentTermsChange(
                e.target.value
              )
            }
            placeholder="e.g. 50% Advance, 50% Before Dispatch"
            className="w-full rounded-lg border p-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />

        </div>

        <div>

          <label className="mb-2 block text-sm font-medium">
            Delivery Terms
          </label>

          <textarea
            rows={3}
            value={deliveryTerms}
            onChange={(e) =>
              onDeliveryTermsChange(
                e.target.value
              )
            }
            placeholder="e.g. Shipment within 20 days after payment."
            className="w-full rounded-lg border p-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />

        </div>

      </div>

    </section>
  );
}