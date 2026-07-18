"use client";

/**
 * ============================================================
 * ROOTYM Admin
 * File: components/admin/quotes/editor/QuoteTotalsCard.tsx
 * Sprint 8.1
 * ============================================================
 */

interface Props {
  currency: string;

  subtotal: number;
  freight: number;
  insurance: number;
  tax: number;
  discount: number;

  onFreightChange: (value: number) => void;
  onInsuranceChange: (value: number) => void;
  onTaxChange: (value: number) => void;
  onDiscountChange: (value: number) => void;
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

interface EditableRowProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

function EditableRow({
  label,
  value,
  onChange,
}: EditableRowProps) {
  return (
    <div className="space-y-2">

      <label className="block text-sm font-medium">
        {label}
      </label>

      <input
        type="number"
        min={0}
        step="0.01"
        value={value}
        onChange={(e) =>
          onChange(Number(e.target.value) || 0)
        }
        className="
          h-11
          w-full
          rounded-lg
          border
          px-3
          text-right
          outline-none
          transition
          focus:border-primary
          focus:ring-2
          focus:ring-primary/20
        "
      />

    </div>
  );
}

interface SummaryRowProps {
  label: string;
  value: string;
  bold?: boolean;
}

function SummaryRow({
  label,
  value,
  bold = false,
}: SummaryRowProps) {
  return (
    <div
      className={`flex items-center justify-between ${
        bold
          ? "border-t pt-4 text-lg font-bold"
          : "text-sm"
      }`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

export default function QuoteTotalsCard({
  currency,

  subtotal,
  freight,
  insurance,
  tax,
  discount,

  onFreightChange,
  onInsuranceChange,
  onTaxChange,
  onDiscountChange,
}: Props) {
  const grandTotal =
    subtotal +
    freight +
    insurance +
    tax -
    discount;

  return (
    <section className="rounded-xl border bg-background shadow-sm">

      <div className="border-b px-5 py-4">
        <h2 className="text-lg font-semibold">
          Quote Totals
        </h2>
      </div>

      <div className="space-y-5 p-5">

        <EditableRow
          label="Freight"
          value={freight}
          onChange={onFreightChange}
        />

        <EditableRow
          label="Insurance"
          value={insurance}
          onChange={onInsuranceChange}
        />

        <EditableRow
          label="Tax"
          value={tax}
          onChange={onTaxChange}
        />

        <EditableRow
          label="Discount"
          value={discount}
          onChange={onDiscountChange}
        />

        <div className="space-y-3 border-t pt-5">

          <SummaryRow
            label="Subtotal"
            value={formatCurrency(
              subtotal,
              currency
            )}
          />

          <SummaryRow
            label="Freight"
            value={formatCurrency(
              freight,
              currency
            )}
          />

          <SummaryRow
            label="Insurance"
            value={formatCurrency(
              insurance,
              currency
            )}
          />

          <SummaryRow
            label="Tax"
            value={formatCurrency(
              tax,
              currency
            )}
          />

          <SummaryRow
            label="Discount"
            value={`- ${formatCurrency(
              discount,
              currency
            )}`}
          />

          <SummaryRow
            bold
            label="Grand Total"
            value={formatCurrency(
              grandTotal,
              currency
            )}
          />

        </div>

      </div>

    </section>
  );
}