"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bot,
  Loader2,
  MessageSquare,
  RefreshCcw,
  Send,
  SquarePen,
  CheckCircle2,
  Clock3,
  Truck,
  Eye,
} from "lucide-react";

import Card from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export type CommunicationStatus =
  | "DRAFT"
  | "APPROVED"
  | "QUEUED"
  | "SENT"
  | "DELIVERED"
  | "READ"
  | "FAILED"
  | "REJECTED";

export interface WhatsAppConversationCardProps {
  inquiryId: string;

  loading?: boolean;

  generating?: boolean;

  draft?: {
    id: string;
    message: string;
    status: CommunicationStatus;
    updatedAt?: string;
  } | null;

  onGenerate?: () => void | Promise<void>;

  onSaveEdit?: (
    message: string
  ) => void | Promise<void>;

  onRegenerate?: () => void | Promise<void>;

  onSend?: () => void | Promise<void>;
}

const STATUS = {
  DRAFT: {
    label: "Draft",
    icon: SquarePen,
    className:
      "bg-gray-100 text-gray-700 border-gray-300",
  },

  APPROVED: {
    label: "Approved",
    icon: CheckCircle2,
    className:
      "bg-green-100 text-green-700 border-green-300",
  },

  FAILED: {
    label: "Failed",
    icon: Clock3,
    className:
      "bg-red-100 text-red-700 border-red-300",
  },

  REJECTED: {
    label: "Rejected",
    icon: Clock3,
    className:
      "bg-red-100 text-red-700 border-red-300",
  },

  QUEUED: {
    label: "Queued",
    icon: Clock3,
    className:
      "bg-amber-100 text-amber-700 border-amber-300",
  },

  SENT: {
    label: "Sent",
    icon: Send,
    className:
      "bg-blue-100 text-blue-700 border-blue-300",
  },

  DELIVERED: {
    label: "Delivered",
    icon: Truck,
    className:
      "bg-green-100 text-green-700 border-green-300",
  },

  READ: {
    label: "Read",
    icon: Eye,
    className:
      "bg-emerald-100 text-emerald-700 border-emerald-300",
  },
} satisfies Record<
  CommunicationStatus,
  {
    label: string;
    icon: React.ElementType;
    className: string;
  }
>;

const TIMELINE: CommunicationStatus[] = [
  "DRAFT",
  "QUEUED",
  "SENT",
  "DELIVERED",
  "READ",
];

export default function WhatsAppConversationCard({
  loading = false,
  generating = false,
  draft,
  onGenerate,
  onSaveEdit,
  onRegenerate,
  onSend,
}: WhatsAppConversationCardProps) {
  const [editOpen, setEditOpen] =
    useState(false);

  const [editedMessage, setEditedMessage] =
    useState("");

  useEffect(() => {
    if (draft) {
      setEditedMessage(draft.message);
    }
  }, [draft]);

  const currentStep = useMemo(() => {
    if (!draft) return -1;

    return TIMELINE.indexOf(draft.status);
  }, [draft]);

  if (loading) {
    return (
      <Card className="rounded-xl border shadow-sm">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="mr-3 h-6 w-6 animate-spin text-green-600" />

          <span className="font-medium text-gray-600">
            Loading communication...
          </span>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="rounded-xl border shadow-sm">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-green-100 p-3">
              <MessageSquare className="h-5 w-5 text-green-700" />
            </div>

            <div>
              <h2 className="text-lg font-semibold">
                Customer Communication
              </h2>

              <p className="text-sm text-gray-500">
                WhatsApp
              </p>
            </div>
          </div>

          <div className="rounded-full bg-green-50 px-4 py-2 text-xs font-semibold text-green-700">
            Powered by R-CAPTAIN
          </div>
        </div>

        <div className="space-y-6 p-6">
        {!draft ? (
            <div className="rounded-xl border border-dashed p-10 text-center">
              <Bot className="mx-auto mb-5 h-14 w-14 text-gray-300" />

              <h3 className="text-lg font-semibold">
                No AI Reply Generated
              </h3>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500">
                Generate a professional WhatsApp reply using
                R-CAPTAIN AI.
              </p>

              <Button
                className="mt-8 bg-green-600 hover:bg-green-700"
                onClick={onGenerate}
                disabled={generating}
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Bot className="mr-2 h-4 w-4" />
                    Generate AI Reply
                  </>
                )}
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Draft</h3>

                <div
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm ${
                    STATUS[draft.status].className
                  }`}
                >
                  {(() => {
                    const Icon = STATUS[draft.status].icon;
                    return <Icon className="h-4 w-4" />;
                  })()}

                  {STATUS[draft.status].label}
                </div>
              </div>

              <div className="rounded-xl bg-gray-50 p-5">
                <p className="whitespace-pre-wrap text-sm leading-7 text-gray-700">
                  {draft.message}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={() => setEditOpen(true)}
                >
                  <SquarePen className="mr-2 h-4 w-4" />
                  Edit
                </Button>

                <Button
                  variant="outline"
                  onClick={onRegenerate}
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Regenerate
                </Button>

                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={onSend}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send WhatsApp
                </Button>
              </div>

              <div className="rounded-xl border bg-gray-50 p-5">
                <h4 className="mb-4 font-semibold">
                  Communication Timeline
                </h4>

                <div className="space-y-3">
                  {TIMELINE.map((step, index) => {
                    const complete =
                      index <= currentStep;

                    const Icon = STATUS[step].icon;

                    return (
                      <div
                        key={step}
                        className="flex items-center gap-3"
                      >
                        {complete ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                        )}

                        <Icon className="h-4 w-4 text-gray-500" />

                        <span
                          className={
                            complete
                              ? "font-medium text-gray-900"
                              : "text-gray-500"
                          }
                        >
                          {STATUS[step].label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </Card>

      {editOpen && draft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
            <div className="border-b px-6 py-4">
              <h3 className="text-lg font-semibold">
                Edit WhatsApp Draft
              </h3>
            </div>

            <div className="p-6">
              <textarea
                value={editedMessage}
                onChange={(e) =>
                  setEditedMessage(e.target.value)
                }
                rows={10}
                className="w-full rounded-lg border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex justify-end gap-3 border-t px-6 py-4">
              <Button
                variant="outline"
                onClick={() => {
                  setEditedMessage(draft.message);
                  setEditOpen(false);
                }}
              >
                Cancel
              </Button>

              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={async () => {
                  await onSaveEdit?.(editedMessage);
                  setEditOpen(false);
                }}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}