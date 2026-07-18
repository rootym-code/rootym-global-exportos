"use client";

/**
 * ============================================================
 * ROOTYM Admin
 * File: components/admin/quotes/QuoteStatusBadge.tsx
 * Sprint 8.1
 * ============================================================
 */

interface Props {
  status: string;
}

const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    className: string;
  }
> = {
  DRAFT: {
    label: "Draft",
    className:
      "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
  },

  SENT: {
    label: "Sent",
    className:
      "border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300",
  },

  VIEWED: {
    label: "Viewed",
    className:
      "border-cyan-200 bg-cyan-100 text-cyan-700 dark:border-cyan-800 dark:bg-cyan-950 dark:text-cyan-300",
  },

  NEGOTIATION: {
    label: "Negotiation",
    className:
      "border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300",
  },

  APPROVED: {
    label: "Approved",
    className:
      "border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300",
  },

  REJECTED: {
    label: "Rejected",
    className:
      "border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300",
  },

  EXPIRED: {
    label: "Expired",
    className:
      "border-zinc-200 bg-zinc-100 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300",
  },
};

export default function QuoteStatusBadge({
  status,
}: Props) {
  const config =
    STATUS_CONFIG[status] ??
    STATUS_CONFIG.DRAFT;

  return (
    <span
      className={[
        "inline-flex",
        "items-center",
        "justify-center",
        "rounded-full",
        "border",
        "px-3",
        "py-1",
        "text-xs",
        "font-semibold",
        "whitespace-nowrap",
        config.className,
      ].join(" ")}
    >
      {config.label}
    </span>
  );
}