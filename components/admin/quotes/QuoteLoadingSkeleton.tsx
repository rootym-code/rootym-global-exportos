"use client";

/**
 * ============================================================
 * ROOTYM Admin
 * File: components/admin/quotes/QuoteLoadingSkeleton.tsx
 * Sprint 8.1
 * ============================================================
 */

export default function QuoteLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div className="space-y-3">

          <div className="h-8 w-64 rounded bg-muted" />

          <div className="h-4 w-96 rounded bg-muted" />

        </div>

        <div className="h-11 w-40 rounded-lg bg-muted" />

      </div>

      {/* Stats */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border bg-background p-5"
          >
            <div className="flex items-center justify-between">

              <div className="space-y-3">

                <div className="h-4 w-24 rounded bg-muted" />

                <div className="h-8 w-16 rounded bg-muted" />

              </div>

              <div className="h-12 w-12 rounded-lg bg-muted" />

            </div>
          </div>
        ))}

      </div>

      {/* Filters */}

      <div className="rounded-xl border bg-background p-4">

        <div className="flex gap-4">

          <div className="h-11 flex-1 rounded-lg bg-muted" />

          <div className="h-11 w-56 rounded-lg bg-muted" />

          <div className="h-11 w-32 rounded-lg bg-muted" />

        </div>

      </div>

      {/* Table */}

      <div className="overflow-hidden rounded-xl border bg-background">

        <div className="border-b p-4">

          <div className="h-5 w-40 rounded bg-muted" />

        </div>

        <table className="w-full">

          <tbody>

            {Array.from({ length: 8 }).map((_, row) => (
              <tr
                key={row}
                className="border-b"
              >
                {Array.from({ length: 8 }).map((_, col) => (
                  <td
                    key={col}
                    className="px-4 py-5"
                  >
                    <div className="h-4 rounded bg-muted" />
                  </td>
                ))}
              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}