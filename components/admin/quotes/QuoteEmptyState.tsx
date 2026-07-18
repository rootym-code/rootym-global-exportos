"use client";

/**
 * ============================================================
 * ROOTYM Admin
 * File: components/admin/quotes/QuoteEmptyState.tsx
 * Sprint 8.1
 * ============================================================
 */

import Link from "next/link";
import {
  FileText,
  Plus,
} from "lucide-react";

interface Props {
  title?: string;
  description?: string;

  actionHref?: string;
  actionLabel?: string;
}

export default function QuoteEmptyState({
  title = "No Quotes Found",
  description = "No quotations match the current filters. Create a new quotation or modify your search criteria.",
  actionHref = "/admin/inquiries",
  actionLabel = "Create Quote",
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-background px-8 py-20 text-center">

      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">

        <FileText className="h-10 w-10 text-primary" />

      </div>

      <h2 className="mt-6 text-2xl font-semibold">
        {title}
      </h2>

      <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
        {description}
      </p>

      <Link
        href={actionHref}
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-medium text-primary-foreground transition hover:opacity-90"
      >
        <Plus className="h-4 w-4" />
        {actionLabel}
      </Link>

    </div>
  );
}