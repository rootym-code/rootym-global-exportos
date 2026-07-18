"use client";

/**
 * ============================================================
 * ROOTYM Admin
 * File: components/admin/quotes/editor/QuoteItemEditorRow.tsx
 * Sprint 8.1
 * ============================================================
 */

import { Trash2 } from "lucide-react";

import type { QuoteEditorItem } from "./QuoteEditorPage";

interface Props {
  item: QuoteEditorItem;
  currency: string;

  onChange: (item: QuoteEditorItem) => void;
  onRemove: () => void;
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

export default function QuoteItemEditorRow({
  item,
  currency,
  onChange,
  onRemove,
}: Props) {
  function update<K extends keyof QuoteEditorItem>(
    key: K,
    value: QuoteEditorItem[K]
  ) {
    const updated: QuoteEditorItem = {
      ...item,
      [key]: value,
    };

    updated.total =
      updated.quantity * updated.unitPrice;

    onChange(updated);
  }

  return (
    <tr className="border-t transition-colors hover:bg-muted/30">

      <td className="px-5 py-4 align-top">

        <div className="space-y-2">

          <input
            type="text"
            value={item.productName}
            onChange={(e) =>
              update("productName", e.target.value)
            }
            className="h-10 w-full rounded-lg border px-3"
            placeholder="Product Name"
          />

          <input
            type="text"
            value={item.hsnCode ?? ""}
            onChange={(e) =>
              update("hsnCode", e.target.value)
            }
            className="h-9 w-full rounded-lg border px-3 text-sm"
            placeholder="HSN Code"
          />

        </div>

      </td>

      <td className="px-5 py-4 align-top">

        <input
          type="number"
          min={0}
          value={item.quantity}
          onChange={(e) =>
            update(
              "quantity",
              Number(e.target.value) || 0
            )
          }
          className="h-10 w-24 rounded-lg border px-3 text-right"
        />

        <div className="mt-2">

          <input
            type="text"
            value={item.unit}
            onChange={(e) =>
              update("unit", e.target.value)
            }
            className="h-9 w-24 rounded-lg border px-2 text-center text-sm"
            placeholder="KG"
          />

        </div>

      </td>

      <td className="px-5 py-4 align-top">

        <input
          type="number"
          min={0}
          step="0.01"
          value={item.unitPrice}
          onChange={(e) =>
            update(
              "unitPrice",
              Number(e.target.value) || 0
            )
          }
          className="h-10 w-36 rounded-lg border px-3 text-right"
        />

      </td>

      <td className="px-5 py-4 text-right align-top">

        <div className="pt-2 text-base font-semibold">
          {formatCurrency(item.total, currency)}
        </div>

      </td>

      <td className="px-5 py-4 text-center align-top">

        <button
          type="button"
          onClick={onRemove}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border text-red-600 transition hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30"
          title="Remove Item"
        >
          <Trash2 className="h-4 w-4" />
        </button>

      </td>

    </tr>
  );
}