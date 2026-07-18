"use client";

/**
 * ============================================================
 * ROOTYM Admin
 * File: components/admin/quotes/QuoteStatsCards.tsx
 * Sprint 8.1
 * ============================================================
 */

import {
  CheckCircle2,
  Clock3,
  FileText,
  XCircle,
} from "lucide-react";

interface QuoteSummary {
  draft: number;
  sent: number;
  approved: number;
  expired: number;
}

interface Props {
  summary: QuoteSummary;
}

interface CardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconClass: string;
}

function StatCard({
  title,
  value,
  icon,
  iconClass,
}: CardProps) {
  return (
    <div className="rounded-xl border bg-background p-5 shadow-sm transition-colors hover:bg-muted/30">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {title}
          </p>

          <h3 className="mt-3 text-3xl font-bold">
            {value}
          </h3>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-lg ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function QuoteStatsCards({
  summary,
}: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

      <StatCard
        title="Draft Quotes"
        value={summary.draft}
        icon={<FileText className="h-5 w-5" />}
        iconClass="bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300"
      />

      <StatCard
        title="Sent"
        value={summary.sent}
        icon={<Clock3 className="h-5 w-5" />}
        iconClass="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
      />

      <StatCard
        title="Approved"
        value={summary.approved}
        icon={<CheckCircle2 className="h-5 w-5" />}
        iconClass="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
      />

      <StatCard
        title="Expired"
        value={summary.expired}
        icon={<XCircle className="h-5 w-5" />}
        iconClass="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
      />

    </div>
  );
}