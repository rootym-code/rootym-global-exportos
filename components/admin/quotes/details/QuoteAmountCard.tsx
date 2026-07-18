"use client";

/**
 * ============================================================
 * ROOTYM Admin
 * File: components/admin/quotes/details/QuoteAmountCard.tsx
 * Sprint 8.1
 * ============================================================
 */

import type { QuoteDetails } from "./QuoteDetailsPage";

interface Props {
  quote: QuoteDetails;
}

function formatCurrency(
  amount: number,
  currency: string
) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

interface AmountRowProps {
  label: string;
  value: number;
  currency: string;
  bold?: boolean;
  divider?: boolean;
}

function AmountRow({
  label,
  value,
  currency,
  bold = false,
  divider = false,
}: AmountRowProps) {
  return (
    <>
      {divider && <div className="border-t" />}

      <div
        className={`flex items-center justify-between ${
          bold ? "pt-2 text-base font-semibold" : "text-sm"
        }`}
      >
        <span className="text-muted-foreground">
          {label}
        </span>

        <span
          className={
            bold
              ? "font-bold text-foreground"
              : "font-medium"
          }
        >
          {formatCurrency(value, currency)}
        </span>
      </div>
    </>
  );
}

export default function QuoteAmountCard({
  quote,
}: Props) {
  return (
    <section className="rounded-xl border bg-background shadow-sm">

      <div className="border-b px-5 py-4">
        <h2 className="text-lg font-semibold">
          Price Summary
        </h2>
      </div>

      <div className="space-y-4 p-5">

        <AmountRow
          label="Subtotal"
          value={quote.subtotal}
          currency={quote.currency}
        />

        <AmountRow
          label="Freight"
          value={quote.freight}
          currency={quote.currency}
        />

        <AmountRow
          label="Insurance"
          value={quote.insurance}
          currency={quote.currency}
        />

        <AmountRow
          label="Tax"
          value={quote.tax}
          currency={quote.currency}
        />

        <AmountRow
          label="Discount"
          value={quote.discount}
          currency={quote.currency}
        />

        <AmountRow
          divider
          bold
          label="Grand Total"
          value={quote.total}
          currency={quote.currency}
        />

      </div>

    </section>
  );
}