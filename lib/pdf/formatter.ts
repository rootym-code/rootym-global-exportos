/**
 * ============================================================
 * ROOTYM PDF Formatter
 * File: lib/pdf/formatter.ts
 * Sprint 8
 * ============================================================
 */

import { Prisma } from "@/lib/generated/prisma";

export interface CurrencyOptions {
  currency?: string;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

const DEFAULT_LOCALE = "en-IN";
const DEFAULT_CURRENCY = "USD";

function decimalToNumber(
  value: number | string | Prisma.Decimal
): number {
  if (value instanceof Prisma.Decimal) {
    return value.toNumber();
  }

  return Number(value);
}

/**
 * Formats a currency value.
 */
export function formatCurrency(
  value: number | string | Prisma.Decimal,
  options: CurrencyOptions = {}
): string {
  const amount = decimalToNumber(value);

  return new Intl.NumberFormat(
    options.locale ?? DEFAULT_LOCALE,
    {
      style: "currency",
      currency:
        options.currency ?? DEFAULT_CURRENCY,
      minimumFractionDigits:
        options.minimumFractionDigits ?? 2,
      maximumFractionDigits:
        options.maximumFractionDigits ?? 2,
    }
  ).format(amount);
}

/**
 * Formats a plain number.
 */
export function formatNumber(
  value: number | string | Prisma.Decimal,
  fractionDigits = 2
): string {
  return decimalToNumber(value).toLocaleString(
    DEFAULT_LOCALE,
    {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }
  );
}

/**
 * Formats percentage.
 */
export function formatPercentage(
  value: number,
  digits = 2
): string {
  return `${value.toFixed(digits)}%`;
}

/**
 * Formats quantity.
 */
export function formatQuantity(
  quantity: number,
  unit?: string
): string {
  if (!unit) {
    return formatNumber(quantity);
  }

  return `${formatNumber(quantity)} ${unit}`;
}

/**
 * Formats date.
 */
export function formatDate(
  value: Date | string
): string {
  const date =
    value instanceof Date
      ? value
      : new Date(value);

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(date);
}

/**
 * Formats ISO date.
 */
export function formatISODate(
  value: Date | string
): string {
  const date =
    value instanceof Date
      ? value
      : new Date(value);

  return date.toISOString().split("T")[0];
}

/**
 * Formats date and time.
 */
export function formatDateTime(
  value: Date | string
): string {
  const date =
    value instanceof Date
      ? value
      : new Date(value);

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(date);
}

/**
 * Truncates text.
 */
export function truncateText(
  value: string,
  maxLength: number
): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.substring(
    0,
    maxLength - 3
  )}...`;
}

/**
 * Wraps text into lines.
 */
export function wrapText(
  text: string,
  maxCharacters = 60
): string[] {
  const words = text.split(" ");

  const lines: string[] = [];

  let current = "";

  for (const word of words) {
    if (
      `${current} ${word}`.trim().length >
      maxCharacters
    ) {
      lines.push(current.trim());
      current = word;
    } else {
      current += ` ${word}`;
    }
  }

  if (current.trim()) {
    lines.push(current.trim());
  }

  return lines;
}

/**
 * Pads a number with leading zeros.
 */
export function padNumber(
  value: number,
  length = 5
): string {
  return value
    .toString()
    .padStart(length, "0");
}

/**
 * Formats quote number.
 */
export function formatQuoteNumber(
  year: number,
  sequence: number
): string {
  return `QT-${year}-${padNumber(sequence)}`;
}

/**
 * Formats invoice number.
 */
export function formatInvoiceNumber(
  year: number,
  sequence: number
): string {
  return `INV-${year}-${padNumber(sequence)}`;
}

/**
 * Formats purchase order number.
 */
export function formatPurchaseOrderNumber(
  year: number,
  sequence: number
): string {
  return `PO-${year}-${padNumber(sequence)}`;
}

/**
 * Formats weight.
 */
export function formatWeight(
  value: number,
  unit = "KG"
): string {
  return `${formatNumber(value)} ${unit}`;
}

/**
 * Formats dimensions.
 */
export function formatDimensions(
  length: number,
  width: number,
  height: number,
  unit = "cm"
): string {
  return `${length} × ${width} × ${height} ${unit}`;
}

/**
 * Formats yes/no values.
 */
export function formatBoolean(
  value: boolean
): string {
  return value ? "Yes" : "No";
}

/**
 * Safely formats nullable values.
 */
export function safeValue(
  value: string | null | undefined,
  fallback = "-"
): string {
  return value?.trim() || fallback;
}