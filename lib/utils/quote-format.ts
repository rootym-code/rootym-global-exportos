/**
 * ============================================================
 * ROOTYM
 * File: lib/utils/quote-format.ts
 * Sprint 8.1
 * ============================================================
 */

export type SupportedCurrency =
  | "INR"
  | "USD"
  | "EUR"
  | "GBP"
  | "AED";

const DEFAULT_LOCALE = "en-IN";

const CURRENCY_LOCALE: Record<
  SupportedCurrency,
  string
> = {
  INR: "en-IN",
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
  AED: "en-AE",
};

export function formatCurrency(
  amount: number,
  currency: SupportedCurrency = "INR",
  minimumFractionDigits = 2,
  maximumFractionDigits = 2
): string {
  return new Intl.NumberFormat(
    CURRENCY_LOCALE[currency] ??
      DEFAULT_LOCALE,
    {
      style: "currency",
      currency,
      minimumFractionDigits,
      maximumFractionDigits,
    }
  ).format(amount);
}

export function formatNumber(
  value: number,
  fractionDigits = 2
): string {
  return new Intl.NumberFormat(
    DEFAULT_LOCALE,
    {
      minimumFractionDigits:
        fractionDigits,
      maximumFractionDigits:
        fractionDigits,
    }
  ).format(value);
}

export function formatPercentage(
  value: number,
  fractionDigits = 2
): string {
  return `${formatNumber(
    value,
    fractionDigits
  )}%`;
}

export function formatDate(
  value: Date | string
): string {
  const date =
    value instanceof Date
      ? value
      : new Date(value);

  return new Intl.DateTimeFormat(
    DEFAULT_LOCALE,
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(date);
}

export function formatDateTime(
  value: Date | string
): string {
  const date =
    value instanceof Date
      ? value
      : new Date(value);

  return new Intl.DateTimeFormat(
    DEFAULT_LOCALE,
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  ).format(date);
}

export function formatValidity(
  issueDate: Date | string,
  validUntil: Date | string
): string {
  return `${formatDate(
    issueDate
  )} → ${formatDate(validUntil)}`;
}

export function formatPhone(
  phone?: string | null
): string {
  if (!phone) {
    return "-";
  }

  return phone.trim();
}

export function formatEmail(
  email?: string | null
): string {
  return email?.trim() || "-";
}

export function formatAddress(
  address?: string | null
): string {
  return address?.trim() || "-";
}

export function formatQuantity(
  quantity: number,
  unit: string
): string {
  return `${formatNumber(
    quantity
  )} ${unit}`;
}

export function formatWeight(
  value: number,
  unit = "kg"
): string {
  return `${formatNumber(value)} ${unit}`;
}

export function formatQuoteAge(
  createdAt: Date | string
): string {
  const created =
    createdAt instanceof Date
      ? createdAt
      : new Date(createdAt);

  const diff =
    Date.now() - created.getTime();

  const days = Math.floor(
    diff / (1000 * 60 * 60 * 24)
  );

  if (days <= 0) {
    return "Today";
  }

  if (days === 1) {
    return "1 day";
  }

  if (days < 30) {
    return `${days} days`;
  }

  const months = Math.floor(days / 30);

  if (months === 1) {
    return "1 month";
  }

  if (months < 12) {
    return `${months} months`;
  }

  const years = Math.floor(months / 12);

  if (years === 1) {
    return "1 year";
  }

  return `${years} years`;
}