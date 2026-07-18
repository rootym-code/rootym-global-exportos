"use client";

/**
 * ============================================================
 * ROOTYM Admin
 * File: components/admin/quotes/QuoteFilters.tsx
 * Sprint 8.1
 * ============================================================
 */

import { Search, X } from "lucide-react";

interface Props {
  search: string;
  status: string;

  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

const STATUSES = [
  { value: "", label: "All Statuses" },
  { value: "DRAFT", label: "Draft" },
  { value: "SENT", label: "Sent" },
  { value: "VIEWED", label: "Viewed" },
  { value: "NEGOTIATION", label: "Negotiation" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "EXPIRED", label: "Expired" },
];

export default function QuoteFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: Props) {
  function clearFilters() {
    onSearchChange("");
    onStatusChange("");
  }

  const hasFilters = search.length > 0 || status.length > 0;

  return (
    <div className="rounded-xl border bg-background p-4 shadow-sm">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">

        {/* Search */}

        <div className="relative flex-1">

          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />

          <input
            type="text"
            value={search}
            placeholder="Search quote no., customer, company..."
            onChange={(e) => onSearchChange(e.target.value)}
            className="
              h-11
              w-full
              rounded-lg
              border
              bg-background
              pl-10
              pr-4
              text-sm
              outline-none
              transition
              focus:border-primary
              focus:ring-2
              focus:ring-primary/20
            "
          />

        </div>

        {/* Status */}

        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="
            h-11
            min-w-[220px]
            rounded-lg
            border
            bg-background
            px-3
            text-sm
            outline-none
            transition
            focus:border-primary
            focus:ring-2
            focus:ring-primary/20
          "
        >
          {STATUSES.map((item) => (
            <option
              key={item.value}
              value={item.value}
            >
              {item.label}
            </option>
          ))}
        </select>

        {/* Clear */}

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="
              inline-flex
              h-11
              items-center
              justify-center
              gap-2
              rounded-lg
              border
              px-4
              text-sm
              font-medium
              transition
              hover:bg-muted
            "
          >
            <X className="h-4 w-4" />

            Clear
          </button>
        )}

      </div>

    </div>
  );
}