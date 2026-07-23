"use client";

/**
 * ============================================================================
 * Project      : ROOTYM Global Export Platform
 * Organization : ROOTYM AGRO HARVEST PRIVATE LIMITED
 * Module       : WhatsApp Automation
 * Component    : WhatsApp Approval Card
 * File         : components/admin/whatsapp/WhatsAppApprovalCard.tsx
 * Version      : Sprint 10.3
 *
 * Description
 * ---------------------------------------------------------------------------
 * Displays AI-generated WhatsApp drafts awaiting administrator approval.
 *
 * Responsibilities
 * ---------------------------------------------------------------------------
 * • Display one or more generated drafts
 * • Preview complete message
 * • Display attachments
 * • Show approval status
 * • Approve / Reject / Regenerate actions
 * • Loading state
 * • Empty state
 *
 * This component is presentation-only.
 * Business logic remains inside API routes and parent pages.
 * ============================================================================
 */

import {
  Bot,
  Calendar,
  CheckCircle2,
  File,
  Image,
  Loader2,
  MessageSquare,
  RefreshCcw,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import Card from "@/components/ui/Card";

/* ============================================================================
 * TYPES
 * ========================================================================== */

export type WhatsAppDraftStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "SENT";

export interface WhatsAppAttachment {
  id: string;

  fileName: string;

  fileType: string;

  url: string;

  size?: number;
}

export interface WhatsAppDraft {
  id: string;

  message: string;

  status: WhatsAppDraftStatus;

  generatedBy: string;

  generatedAt: string;

  approvedAt?: string;

  approvedBy?: string;

  attachments: WhatsAppAttachment[];
}

/* ============================================================================
 * COMPONENT PROPS
 * ========================================================================== */

export interface WhatsAppApprovalCardProps {
  drafts: WhatsAppDraft[];

  loading?: boolean;

  onApprove?: (
    draftId: string
  ) => void | Promise<void>;

  onReject?: (
    draftId: string
  ) => void | Promise<void>;

  onRegenerate?: (
    draftId: string
  ) => void | Promise<void>;
}

/* ============================================================================
 * STATUS CONFIGURATION
 * ========================================================================== */

const STATUS_CONFIG: Record<
  WhatsAppDraftStatus,
  {
    label: string;
    className: string;
    icon: React.ElementType;
  }
> = {
  PENDING: {
    label: "Pending Approval",
    className:
      "bg-amber-100 text-amber-700 border-amber-300",
    icon: ShieldCheck,
  },

  APPROVED: {
    label: "Approved",
    className:
      "bg-green-100 text-green-700 border-green-300",
    icon: CheckCircle2,
  },

  REJECTED: {
    label: "Rejected",
    className:
      "bg-red-100 text-red-700 border-red-300",
    icon: XCircle,
  },

  SENT: {
    label: "Sent",
    className:
      "bg-blue-100 text-blue-700 border-blue-300",
    icon: MessageSquare,
  },
};

/* ============================================================================
 * COMPONENT
 * ========================================================================== */

export default function WhatsAppApprovalCard({
  drafts,
  loading = false,
  onApprove,
  onReject,
  onRegenerate,
}: WhatsAppApprovalCardProps) {

    /* ==========================================================================
   * LOADING STATE
   * ======================================================================== */

    if (loading) {
      return (
        <Card className="rounded-xl border shadow-sm">
          <div className="flex items-center justify-center py-16">
            <Loader2 className="mr-3 h-6 w-6 animate-spin text-green-600" />
  
            <span className="text-sm font-medium text-gray-600">
              Loading WhatsApp drafts...
            </span>
          </div>
        </Card>
      );
    }
  
    /* ==========================================================================
     * EMPTY STATE
     * ======================================================================== */
  
    if (drafts.length === 0) {
      return (
        <Card className="rounded-xl border shadow-sm">
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <MessageSquare className="mb-5 h-14 w-14 text-gray-300" />
  
            <h3 className="text-lg font-semibold text-gray-800">
              No WhatsApp Draft Available
            </h3>
  
            <p className="mt-2 max-w-lg text-sm leading-6 text-gray-500">
              R-CAPTAIN has not generated any WhatsApp follow-up for this
              inquiry yet.
            </p>
          </div>
        </Card>
      );
    }
  
    /* ==========================================================================
     * MAIN VIEW
     * ======================================================================== */
  
    return (
      <Card className="rounded-xl border shadow-sm">
        <div className="border-b px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2">
                <MessageSquare className="h-5 w-5 text-green-700" />
              </div>
  
              <div>
                <h2 className="text-lg font-semibold">
                  WhatsApp Follow-up
                </h2>
  
                <p className="text-sm text-gray-500">
                  AI-generated customer communication awaiting approval
                </p>
              </div>
            </div>
  
            <div className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
              Powered by R-CAPTAIN
            </div>
          </div>
        </div>
  
        <div className="space-y-6 p-6">
          {drafts.map((draft, index) => {
const status =
STATUS_CONFIG[draft.status] ?? {
  label: draft.status,
  icon: MessageSquare,
  color: "text-gray-600",
  badgeClass: "bg-gray-100 text-gray-700",
};
    
    console.log(
      "Draft Status:",
      draft.status,
      STATUS_CONFIG
    );
  
            const StatusIcon =
              status.icon;
  
            return (
              <div
                key={draft.id}
                className="rounded-xl border bg-white"
              >
                {/* ============================================================
                 * CARD HEADER
                 * ========================================================== */}
  
                <div className="flex flex-col gap-4 border-b p-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="text-base font-semibold">
                      Draft #{index + 1}
                    </h3>
  
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4" />
  
                        {draft.generatedBy}
                      </div>
  
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
  
                        {new Date(
                          draft.generatedAt
                        ).toLocaleString()}
                      </div>
                    </div>
                  </div>
  
                  <div
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${status.className}`}
                  >
                    <StatusIcon className="h-4 w-4" />
  
                    {status.label}
                  </div>
                </div>
  
                {/* ============================================================
                 * MESSAGE
                 * ========================================================== */}
  
                <div className="p-5">
                  <h4 className="mb-3 font-semibold text-gray-800">
                    Message Preview
                  </h4>
  
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="whitespace-pre-wrap text-sm leading-7 text-gray-700">
                      {draft.message}
                    </p>
                  </div>
                                  {/* ============================================================
                 * ATTACHMENTS
                 * ========================================================== */}

                {draft.attachments.length > 0 && (
                  <div className="mt-6">
                    <h4 className="mb-3 font-semibold text-gray-800">
                      Attachments
                    </h4>

                    <div className="space-y-3">
                      {draft.attachments.map((attachment) => {
                        const isImage =
                          attachment.fileType.startsWith("image/");

                        return (
                          <div
                            key={attachment.id}
                            className="flex items-center justify-between rounded-lg border bg-gray-50 px-4 py-3"
                          >
                            <div className="flex items-center gap-3">
                              {isImage ? (
                                <Image className="h-5 w-5 text-blue-600" />
                              ) : (
                                <File className="h-5 w-5 text-gray-600" />
                              )}

                              <div>
                                <p className="font-medium text-gray-800">
                                  {attachment.fileName}
                                </p>

                                {attachment.size && (
                                  <p className="text-xs text-gray-500">
                                    {(attachment.size / 1024).toFixed(1)} KB
                                  </p>
                                )}
                              </div>
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                window.open(
                                  attachment.url,
                                  "_blank",
                                  "noopener,noreferrer"
                                )
                              }
                            >
                              View
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ============================================================
                 * APPROVAL INFO
                 * ========================================================== */}

                {draft.approvedBy && (
                  <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
                    <p className="text-sm text-green-700">
                      <span className="font-semibold">
                        Approved By:
                      </span>{" "}
                      {draft.approvedBy}
                    </p>

                    {draft.approvedAt && (
                      <p className="mt-1 text-xs text-green-600">
                        {new Date(
                          draft.approvedAt
                        ).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* ============================================================
               * ACTIONS
               * ========================================================== */}

              <div className="flex flex-wrap justify-end gap-3 border-t bg-gray-50 p-5">
                <Button
                  variant="outline"
                  onClick={() =>
                    onRegenerate?.(draft.id)
                  }
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Regenerate
                </Button>

                <Button
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                  onClick={() =>
                    onReject?.(draft.id)
                  }
                  disabled={
                    draft.status === "APPROVED" ||
                    draft.status === "SENT"
                  }
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>

                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() =>
                    onApprove?.(draft.id)
                  }
                  disabled={
                    draft.status === "APPROVED" ||
                    draft.status === "SENT"
                  }
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

 