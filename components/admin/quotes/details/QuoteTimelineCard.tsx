"use client";

/**
 * ============================================================
 * ROOTYM Admin
 * File: components/admin/quotes/details/QuoteTimelineCard.tsx
 * Sprint 8.1
 * ============================================================
 */

import {
  CheckCircle2,
  Clock3,
  Eye,
  FileEdit,
  Mail,
  MessageSquare,
  XCircle,
} from "lucide-react";

interface TimelineItem {
  id: string;
  action: string;
  description: string;
  createdAt: string;
  user?: string | null;
}

interface Props {
  timeline: TimelineItem[];
}

const ICONS: Record<string, React.ReactNode> = {
  CREATED: <Clock3 className="h-4 w-4" />,
  UPDATED: <FileEdit className="h-4 w-4" />,
  SENT: <Mail className="h-4 w-4" />,
  VIEWED: <Eye className="h-4 w-4" />,
  NEGOTIATION: <MessageSquare className="h-4 w-4" />,
  APPROVED: <CheckCircle2 className="h-4 w-4" />,
  REJECTED: <XCircle className="h-4 w-4" />,
};

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function QuoteTimelineCard({
  timeline,
}: Props) {
  return (
    <section className="rounded-xl border bg-background shadow-sm">

      <div className="border-b px-5 py-4">
        <h2 className="text-lg font-semibold">
          Activity Timeline
        </h2>
      </div>

      {timeline.length === 0 ? (
        <div className="py-10 text-center text-sm text-muted-foreground">
          No activity available.
        </div>
      ) : (
        <div className="p-5">

          <div className="relative">

            <div className="absolute left-[18px] top-0 bottom-0 w-px bg-border" />

            <div className="space-y-6">

              {timeline.map((item) => (
                <div
                  key={item.id}
                  className="relative flex gap-4"
                >
                  <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-background">
                    {ICONS[item.action] ?? (
                      <Clock3 className="h-4 w-4" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1 pb-2">

                    <div className="flex flex-wrap items-center justify-between gap-2">

                      <h3 className="font-medium">
                        {item.action}
                      </h3>

                      <span className="text-xs text-muted-foreground">
                        {formatDate(item.createdAt)}
                      </span>

                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.description}
                    </p>

                    {item.user && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        By <span className="font-medium">{item.user}</span>
                      </p>
                    )}

                  </div>

                </div>
              ))}

            </div>

          </div>

        </div>
      )}

    </section>
  );
}