"use client";

/**
 * ============================================================
 * ROOTYM Admin
 * File: components/admin/quotes/editor/QuoteEditorForm.tsx
 * Sprint 8.1
 * ============================================================
 */

import { useEffect, useMemo } from "react";

import type {
  QuoteEditorItem,
  QuoteEditorModel,
} from "./QuoteEditorPage";

interface Props {
  value: QuoteEditorModel;
  onChange: (quote: QuoteEditorModel) => void;
}

function currency(
  amount: number,
  code: string
) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: code,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${code} ${amount.toFixed(2)}`;
  }
}

export default function QuoteEditorForm({
  value,
  onChange,
}: Props) {
  const subtotal = useMemo(() => {
    return value.items.reduce(
      (sum, item) => sum + item.total,
      0
    );
  }, [value.items]);

  const grandTotal = useMemo(() => {
    return (
      subtotal +
      value.freight +
      value.insurance +
      value.tax -
      value.discount
    );
  }, [
    subtotal,
    value.freight,
    value.insurance,
    value.tax,
    value.discount,
  ]);

  useEffect(() => {
    // Keep line totals in sync
    const updatedItems = value.items.map((item) => ({
      ...item,
      total: item.quantity * item.unitPrice,
    }));

    const changed = updatedItems.some(
      (item, index) =>
        item.total !== value.items[index].total
    );

    if (changed) {
      onChange({
        ...value,
        items: updatedItems,
      });
    }
  }, [value.items, onChange, value]);

  function updateItem(
    index: number,
    patch: Partial<QuoteEditorItem>
  ) {
    const items = [...value.items];

    items[index] = {
      ...items[index],
      ...patch,
    };

    items[index].total =
      items[index].quantity *
      items[index].unitPrice;

    onChange({
      ...value,
      items,
    });
  }

  function update<K extends keyof QuoteEditorModel>(
    key: K,
    newValue: QuoteEditorModel[K]
  ) {
    onChange({
      ...value,
      [key]: newValue,
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-3">

      {/* LEFT */}

      <div className="space-y-6 xl:col-span-2">

        <section className="rounded-xl border bg-background">

          <div className="border-b px-6 py-4">
            <h2 className="font-semibold">
              Quote Information
            </h2>
          </div>

          <div className="grid gap-5 p-6 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium">
                Quote Number
              </label>

              <input
                disabled
                value={value.quoteNumber}
                className="h-11 w-full rounded-lg border bg-muted px-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Valid Until
              </label>

              <input
                type="date"
                value={value.validUntil}
                onChange={(e) =>
                  update(
                    "validUntil",
                    e.target.value
                  )
                }
                className="h-11 w-full rounded-lg border px-3"
              />
            </div>

          </div>

        </section>

        <section className="rounded-xl border bg-background">

          <div className="border-b px-6 py-4">
            <h2 className="font-semibold">
              Quote Line Items
            </h2>
          </div>

          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="bg-muted/40">

                <tr>

                  <th className="px-5 py-3 text-left">
                    Product
                  </th>

                  <th className="px-5 py-3 text-right">
                    Qty
                  </th>

                  <th className="px-5 py-3 text-right">
                    Unit Price
                  </th>

                  <th className="px-5 py-3 text-right">
                    Total
                  </th>

                </tr>

              </thead>

              <tbody>

                {value.items.map(
                  (item, index) => (
                    <tr
                      key={item.id}
                      className="border-t"
                    >
                      <td className="px-5 py-4">

                        <div className="font-medium">
                          {item.productName}
                        </div>

                        <div className="text-xs text-muted-foreground">
                          {item.unit}
                        </div>

                      </td>

                      <td className="px-5 py-4">

                        <input
                          type="number"
                          value={item.quantity}
                          min={0}
                          onChange={(e) =>
                            updateItem(index, {
                              quantity:
                                Number(
                                  e.target.value
                                ) || 0,
                            })
                          }
                          className="h-10 w-24 rounded border px-2 text-right"
                        />

                      </td>

                      <td className="px-5 py-4">

                        <input
                          type="number"
                          value={item.unitPrice}
                          step="0.01"
                          min={0}
                          onChange={(e) =>
                            updateItem(index, {
                              unitPrice:
                                Number(
                                  e.target.value
                                ) || 0,
                            })
                          }
                          className="h-10 w-32 rounded border px-2 text-right"
                        />

                      </td>

                      <td className="px-5 py-4 text-right font-semibold">
                        {currency(
                          item.total,
                          value.currency
                        )}
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        </section>

        <section className="rounded-xl border bg-background">

          <div className="border-b px-6 py-4">
            <h2 className="font-semibold">
              Internal Notes
            </h2>
          </div>

          <div className="p-6">

            <textarea
              rows={6}
              value={value.notes}
              onChange={(e) =>
                update(
                  "notes",
                  e.target.value
                )
              }
              className="w-full rounded-lg border p-3"
              placeholder="Internal notes..."
            />

          </div>

        </section>

      </div>

      {/* RIGHT */}

      <div>

        <section className="sticky top-6 rounded-xl border bg-background">

          <div className="border-b px-5 py-4">
            <h2 className="font-semibold">
              Quote Totals
            </h2>
          </div>

          <div className="space-y-4 p-5">

            <NumberField
              label="Freight"
              value={value.freight}
              onChange={(v) =>
                update("freight", v)
              }
            />

            <NumberField
              label="Insurance"
              value={value.insurance}
              onChange={(v) =>
                update("insurance", v)
              }
            />

            <NumberField
              label="Tax"
              value={value.tax}
              onChange={(v) =>
                update("tax", v)
              }
            />

            <NumberField
              label="Discount"
              value={value.discount}
              onChange={(v) =>
                update("discount", v)
              }
            />

            <div className="border-t pt-4 text-sm">

              <SummaryRow
                label="Subtotal"
                value={currency(
                  subtotal,
                  value.currency
                )}
              />

              <SummaryRow
                label="Grand Total"
                value={currency(
                  grandTotal,
                  value.currency
                )}
                bold
              />

            </div>

          </div>

        </section>

      </div>

    </div>
  );
}

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

function NumberField({
  label,
  value,
  onChange,
}: NumberFieldProps) {
  return (
    <div>

      <label className="mb-2 block text-sm font-medium">
        {label}
      </label>

      <input
        type="number"
        value={value}
        step="0.01"
        min={0}
        onChange={(e) =>
          onChange(
            Number(e.target.value) || 0
          )
        }
        className="h-11 w-full rounded-lg border px-3 text-right"
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
      className={`flex items-center justify-between py-2 ${
        bold ? "text-lg font-bold" : ""
      }`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}