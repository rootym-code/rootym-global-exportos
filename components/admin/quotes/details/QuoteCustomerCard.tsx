"use client";

/**
 * ============================================================
 * ROOTYM Admin
 * File: components/admin/quotes/details/QuoteCustomerCard.tsx
 * Sprint 8.1
 * ============================================================
 */

import {
  Building2,
  Globe,
  Mail,
  Phone,
  User,
} from "lucide-react";

import type { QuoteDetails } from "./QuoteDetailsPage";

interface Props {
  quote: QuoteDetails;
}

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}

function InfoRow({
  icon,
  label,
  value,
}: InfoRowProps) {
  return (
    <div className="flex items-start gap-3">

      <div className="mt-0.5 rounded-lg bg-muted p-2 text-muted-foreground">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-medium">
          {value?.trim() ? value : "-"}
        </p>
      </div>

    </div>
  );
}

export default function QuoteCustomerCard({
  quote,
}: Props) {
  return (
    <section className="rounded-xl border bg-background shadow-sm">

      <div className="border-b px-5 py-4">
        <h2 className="text-lg font-semibold">
          Customer Information
        </h2>
      </div>

      <div className="space-y-5 p-5">

        <InfoRow
          icon={<User className="h-4 w-4" />}
          label="Contact Person"
          value={quote.customerName}
        />

        <InfoRow
          icon={<Building2 className="h-4 w-4" />}
          label="Company"
          value={quote.companyName}
        />

        <InfoRow
          icon={<Mail className="h-4 w-4" />}
          label="Email"
          value={quote.email}
        />

        <InfoRow
          icon={<Phone className="h-4 w-4" />}
          label="Phone"
          value={quote.phone}
        />

        <InfoRow
          icon={<Globe className="h-4 w-4" />}
          label="Country"
          value={quote.country}
        />

      </div>

    </section>
  );
}