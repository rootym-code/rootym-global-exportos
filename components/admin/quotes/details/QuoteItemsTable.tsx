"use client";

/**
 * ============================================================
 * ROOTYM Admin
 * File: components/admin/quotes/details/QuoteItemsTable.tsx
 * Sprint 8.1
 * ============================================================
 */

import type { QuoteItem } from "./QuoteDetailsPage";

interface Props {
  items: QuoteItem[];
  currency: string;
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

export default function QuoteItemsTable({
  items,
  currency,
}: Props) {
  return (
    <section className="rounded-xl border bg-background shadow-sm">

      <div className="border-b px-6 py-4">

        <h2 className="text-lg font-semibold">
          Quote Line Items
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Products included in this quotation
        </p>

      </div>

      {items.length === 0 ? (
        <div className="py-14 text-center text-sm text-muted-foreground">
          No line items available.
        </div>
      ) : (
        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead className="bg-muted/40">

              <tr className="text-left text-sm">

                <th className="px-6 py-3 font-semibold">
                  Product
                </th>

                <th className="px-6 py-3 font-semibold">
                  HSN Code
                </th>

                <th className="px-6 py-3 text-right font-semibold">
                  Quantity
                </th>

                <th className="px-6 py-3 text-right font-semibold">
                  Unit Price
                </th>

                <th className="px-6 py-3 text-right font-semibold">
                  Line Total
                </th>

              </tr>

            </thead>

            <tbody>

              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-t transition-colors hover:bg-muted/30"
                >
                  <td className="px-6 py-4">

                    <div className="font-medium">
                      {item.productName}
                    </div>

                  </td>

                  <td className="px-6 py-4 text-muted-foreground">
                    {item.hsnCode || "-"}
                  </td>

                  <td className="px-6 py-4 text-right">

                    <span className="font-medium">
                      {item.quantity.toLocaleString()}
                    </span>

                    <span className="ml-1 text-muted-foreground">
                      {item.unit}
                    </span>

                  </td>

                  <td className="px-6 py-4 text-right font-medium">
                    {formatCurrency(
                      item.unitPrice,
                      currency
                    )}
                  </td>

                  <td className="px-6 py-4 text-right font-semibold">
                    {formatCurrency(
                      item.total,
                      currency
                    )}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      )}

    </section>
  );
}