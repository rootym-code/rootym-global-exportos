"use client";

/**
 * ============================================================
 * ROOTYM Admin Support Ticket Detail
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the Admin operational view for an individual
 *          support ticket, including conversation history,
 *          customer information, status management, assignment,
 *          internal notes, replies, resolution, and closure.
 * ============================================================
 */

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileText,
  Loader2,
  MessageSquare,
  RefreshCw,
  Send,
  UserRound,
  Users,
  XCircle,
} from "lucide-react";

type SupportTicketStatus =
  | "OPEN"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "WAITING_FOR_CUSTOMER"
  | "RESOLVED"
  | "CLOSED";

type SupportTicketPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "URGENT";

interface SupportMessage {
  id: string;
  ticketId?: string;
  authorUserId?: string | null;
  authorAdminId?: string | null;
  message: string;
  messageType?: string;
  visibility?: string;
  sequence?: number;
  createdAt: string;

  authorUser?: {
    id: string;
    name?: string | null;
    email?: string | null;
  } | null;

  authorAdmin?: {
    id: string;
    name?: string | null;
    email?: string | null;
  } | null;
}

interface SupportStatusHistory {
  id: string;
  ticketId?: string;
  oldStatus?: string | null;
  newStatus: string;
  changedByUserId?: string | null;
  changedByAdminId?: string | null;
  note?: string | null;
  timestamp: string;

  changedByUser?: {
    id: string;
    name?: string | null;
    email?: string | null;
  } | null;

  changedByAdmin?: {
    id: string;
    name?: string | null;
    email?: string | null;
  } | null;
}

interface SupportTicket {
  id: string;
  tenantId: string;
  websiteId?: string | null;
  ticketNumber: string;
  subject: string;
  description: string;
  category: string;
  priority: SupportTicketPriority | string;
  status: SupportTicketStatus | string;

  assignedToId?: string | null;
  resolvedById?: string | null;
  closedById?: string | null;

  resolvedAt?: string | null;
  closedAt?: string | null;

  createdById: string;
  createdAt: string;
  updatedAt: string;

  tenant?: {
    id: string;
    name?: string | null;
    email?: string | null;
  } | null;

  website?: {
    id: string;
    name?: string | null;
    domain?: string | null;
  } | null;

  createdBy?: {
    id: string;
    name?: string | null;
    email?: string | null;
  } | null;

  assignedTo?: {
    id: string;
    name?: string | null;
    email?: string | null;
  } | null;

  resolvedBy?: {
    id: string;
    name?: string | null;
    email?: string | null;
  } | null;

  closedBy?: {
    id: string;
    name?: string | null;
    email?: string | null;
  } | null;

  messages?: SupportMessage[];

  statusHistory?: SupportStatusHistory[];

  attachments?: Array<{
    id: string;
    messageId?: string | null;
    mediaId: string;
  }>;

  _count?: {
    messages?: number;
    attachments?: number;
  };
}

interface TicketResponse {
  success: boolean;
  message?: string;
  ticket?: SupportTicket;
  data?: {
    ticket?: SupportTicket;
  };
}

interface ActionResponse {
  success: boolean;
  message?: string;
  ticket?: SupportTicket;
  data?: {
    ticket?: SupportTicket;
  };
}

const STATUS_OPTIONS: Array<{
  value: SupportTicketStatus;
  label: string;
}> = [
  {
    value: "OPEN",
    label: "Open",
  },
  {
    value: "ASSIGNED",
    label: "Assigned",
  },
  {
    value: "IN_PROGRESS",
    label: "In Progress",
  },
  {
    value: "WAITING_FOR_CUSTOMER",
    label: "Waiting for Customer",
  },
  {
    value: "RESOLVED",
    label: "Resolved",
  },
  {
    value: "CLOSED",
    label: "Closed",
  },
];

function formatDate(value?: string | null) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatStatus(value?: string | null) {
  if (!value) {
    return "—";
  }

  return value
    .toLowerCase()
    .split("_")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1)
    )
    .join(" ");
}

function formatPriority(value?: string | null) {
  if (!value) {
    return "—";
  }

  return (
    value.charAt(0).toUpperCase() +
    value.slice(1).toLowerCase()
  );
}

function statusClasses(status?: string | null) {
  switch (status) {
    case "OPEN":
      return "bg-blue-50 text-blue-700 ring-blue-200";

    case "ASSIGNED":
      return "bg-purple-50 text-purple-700 ring-purple-200";

    case "IN_PROGRESS":
      return "bg-amber-50 text-amber-700 ring-amber-200";

    case "WAITING_FOR_CUSTOMER":
      return "bg-orange-50 text-orange-700 ring-orange-200";

    case "RESOLVED":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";

    case "CLOSED":
      return "bg-slate-100 text-slate-700 ring-slate-200";

    default:
      return "bg-slate-100 text-slate-700 ring-slate-200";
  }
}

function priorityClasses(priority?: string | null) {
  switch (priority) {
    case "URGENT":
      return "bg-red-50 text-red-700 ring-red-200";

    case "HIGH":
      return "bg-orange-50 text-orange-700 ring-orange-200";

    case "MEDIUM":
      return "bg-yellow-50 text-yellow-700 ring-yellow-200";

    case "LOW":
      return "bg-slate-100 text-slate-600 ring-slate-200";

    default:
      return "bg-slate-100 text-slate-600 ring-slate-200";
  }
}

function getAuthorName(message: SupportMessage) {
  return (
    message.authorAdmin?.name ||
    message.authorAdmin?.email ||
    message.authorUser?.name ||
    message.authorUser?.email ||
    (message.authorAdminId
      ? "Administrator"
      : "Customer")
  );
}

function isAdminMessage(message: SupportMessage) {
  return Boolean(message.authorAdminId);
}

function isInternalMessage(message: SupportMessage) {
  return (
    message.visibility === "INTERNAL" ||
    message.messageType === "INTERNAL_NOTE"
  );
}

export default function AdminSupportTicketDetailPage() {
  const params = useParams();
  const router = useRouter();

  const ticketId =
    typeof params.ticketId === "string"
      ? params.ticketId
      : "";

  const [ticket, setTicket] =
    useState<SupportTicket | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [actionError, setActionError] =
    useState("");

  const [actionMessage, setActionMessage] =
    useState("");

  const [reply, setReply] =
    useState("");

  const [internalNote, setInternalNote] =
    useState("");

  const [assignedToId, setAssignedToId] =
    useState("");

  const [selectedStatus, setSelectedStatus] =
    useState<SupportTicketStatus>("OPEN");

  const [statusNote, setStatusNote] =
    useState("");

  const [busyAction, setBusyAction] =
    useState("");

  const loadTicket = useCallback(
    async (isRefresh = false) => {
      if (!ticketId) {
        setError("Invalid support ticket.");
        setLoading(false);
        return;
      }

      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");
        setActionError("");

        const response = await fetch(
          `/api/admin/support/tickets/${ticketId}`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const result =
          (await response.json()) as TicketResponse;

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.message ||
              "Unable to load support ticket."
          );
        }

        const loadedTicket =
          result.ticket ??
          result.data?.ticket;

        if (!loadedTicket) {
          throw new Error(
            "Support ticket data was not returned."
          );
        }

        setTicket(loadedTicket);

        setSelectedStatus(
          loadedTicket.status as SupportTicketStatus
        );

        setAssignedToId(
          loadedTicket.assignedToId || ""
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load support ticket."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [ticketId]
  );

  useEffect(() => {
    void loadTicket();
  }, [loadTicket]);

  async function executeAction(
    action: string,
    body: Record<string, unknown>,
    successText: string
  ) {
    try {
      setBusyAction(action);
      setActionError("");
      setActionMessage("");

      const response = await fetch(
        `/api/admin/support/tickets/${ticketId}/actions`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action,
            ...body,
          }),
        }
      );

      const result =
        (await response.json()) as ActionResponse;

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Unable to complete the action."
        );
      }

      setActionMessage(successText);

      const updatedTicket =
        result.ticket ??
        result.data?.ticket;

      if (updatedTicket) {
        setTicket(updatedTicket);

        setSelectedStatus(
          updatedTicket.status as SupportTicketStatus
        );

        setAssignedToId(
          updatedTicket.assignedToId || ""
        );
      } else {
        await loadTicket(true);
      }

      return true;
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : "Unable to complete the action."
      );

      return false;
    } finally {
      setBusyAction("");
    }
  }

  async function handleReply() {
    const message = reply.trim();

    if (!message) {
      setActionError(
        "Please enter a reply before sending."
      );
      return;
    }

    const success =
      await executeAction(
        "reply",
        { message },
        "Reply sent successfully."
      );

    if (success) {
      setReply("");
      await loadTicket(true);
    }
  }

  async function handleInternalNote() {
    const note = internalNote.trim();

    if (!note) {
      setActionError(
        "Please enter an internal note."
      );
      return;
    }

    const success =
      await executeAction(
        "internal_note",
        { note },
        "Internal note added successfully."
      );

    if (success) {
      setInternalNote("");
      await loadTicket(true);
    }
  }

  async function handleAssign() {
    const administratorId =
      assignedToId.trim();

    if (!administratorId) {
      setActionError(
        "Please enter an administrator ID."
      );
      return;
    }

    const success =
      await executeAction(
        "assign",
        {
          assignedToId: administratorId,
        },
        "Ticket assigned successfully."
      );

    if (success) {
      await loadTicket(true);
    }
  }

  async function handleStatusChange() {
    if (!selectedStatus) {
      return;
    }

    const success =
      await executeAction(
        "status",
        {
          status: selectedStatus,
          note:
            statusNote.trim() || undefined,
        },
        "Ticket status updated successfully."
      );

    if (success) {
      setStatusNote("");
      await loadTicket(true);
    }
  }

  async function handleResolve() {
    const confirmed =
      window.confirm(
        "Resolve this support ticket?"
      );

    if (!confirmed) {
      return;
    }

    const success =
      await executeAction(
        "resolve",
        {
          note:
            statusNote.trim() || undefined,
        },
        "Ticket resolved successfully."
      );

    if (success) {
      setStatusNote("");
      await loadTicket(true);
    }
  }

  async function handleClose() {
    const confirmed =
      window.confirm(
        "Close this support ticket? A closed ticket cannot be replied to by the customer."
      );

    if (!confirmed) {
      return;
    }

    const success =
      await executeAction(
        "close",
        {
          note:
            statusNote.trim() || undefined,
        },
        "Ticket closed successfully."
      );

    if (success) {
      setStatusNote("");
      await loadTicket(true);
    }
  }

  const customerName = useMemo(() => {
    if (!ticket) {
      return "Customer";
    }

    return (
      ticket.createdBy?.name ||
      ticket.tenant?.name ||
      ticket.createdBy?.email ||
      ticket.tenant?.email ||
      "Customer"
    );
  }, [ticket]);

  const customerEmail = useMemo(() => {
    if (!ticket) {
      return "—";
    }

    return (
      ticket.createdBy?.email ||
      ticket.tenant?.email ||
      "—"
    );
  }, [ticket]);

  const messages = useMemo(() => {
    return [...(ticket?.messages || [])].sort(
      (a, b) =>
        (a.sequence || 0) -
        (b.sequence || 0)
    );
  }, [ticket]);

  const statusHistory = useMemo(() => {
    return [...(ticket?.statusHistory || [])].sort(
      (a, b) =>
        new Date(a.timestamp).getTime() -
        new Date(b.timestamp).getTime()
    );
  }, [ticket]);

  const isClosed =
    ticket?.status === "CLOSED";

  const isResolved =
    ticket?.status === "RESOLVED";

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-green-700" />

          <p className="mt-3 text-sm text-slate-500">
            Loading support ticket...
          </p>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="space-y-6">
        <Link
          href="/admin/support/tickets"
          className="inline-flex items-center gap-2 text-sm font-medium text-green-700 hover:text-green-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Support Center
        </Link>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-red-600" />

          <h2 className="mt-4 text-lg font-semibold text-red-900">
            Unable to load ticket
          </h2>

          <p className="mt-2 text-sm text-red-700">
            {error ||
              "Support ticket was not found."}
          </p>

          <button
            type="button"
            onClick={() =>
              void loadTicket()
            }
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-800"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Link
            href="/admin/support/tickets"
            className="inline-flex items-center gap-2 text-sm font-medium text-green-700 transition hover:text-green-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Support Center
          </Link>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">
              {ticket.ticketNumber}
            </h1>

            <span
              className={`
                inline-flex
                rounded-full
                px-3
                py-1
                text-xs
                font-semibold
                ring-1
                ring-inset
                ${statusClasses(ticket.status)}
              `}
            >
              {formatStatus(ticket.status)}
            </span>

            <span
              className={`
                inline-flex
                rounded-full
                px-3
                py-1
                text-xs
                font-semibold
                ring-1
                ring-inset
                ${priorityClasses(ticket.priority)}
              `}
            >
              {formatPriority(ticket.priority)}
            </span>
          </div>

          <h2 className="mt-2 text-lg font-semibold text-slate-800">
            {ticket.subject}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Created{" "}
            {formatDate(ticket.createdAt)}
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            void loadTicket(true)
          }
          disabled={refreshing}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-slate-200
            bg-white
            px-4
            py-2.5
            text-sm
            font-medium
            text-slate-700
            shadow-sm
            transition
            hover:bg-slate-50
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          <RefreshCw
            className={`h-4 w-4 ${
              refreshing
                ? "animate-spin"
                : ""
            }`}
          />

          Refresh
        </button>
      </div>

      {/* Action Messages */}

      {actionMessage && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          <CheckCircle2 className="h-5 w-5 shrink-0" />

          <span>{actionMessage}</span>
        </div>
      )}

      {actionError && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <div>
            <p className="font-semibold">
              Action could not be completed
            </p>

            <p className="mt-1">
              {actionError}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Main Conversation */}

        <div className="space-y-6 xl:col-span-2">
          {/* Ticket Description */}

          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-700" />

                <h3 className="font-semibold text-slate-900">
                  Ticket Description
                </h3>
              </div>
            </div>

            <div className="px-5 py-5">
              <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                {ticket.description}
              </p>
            </div>
          </section>

          {/* Conversation */}

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-green-700" />

                <h3 className="font-semibold text-slate-900">
                  Conversation
                </h3>
              </div>

              <span className="text-xs text-slate-500">
                {messages.length}{" "}
                {messages.length === 1
                  ? "message"
                  : "messages"}
              </span>
            </div>

            <div className="space-y-4 p-5">
              {messages.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
                  <MessageSquare className="mx-auto h-7 w-7 text-slate-300" />

                  <p className="mt-2 text-sm text-slate-500">
                    No messages yet.
                  </p>
                </div>
              )}

              {messages.map(
                (message) => {
                  const admin =
                    isAdminMessage(
                      message
                    );

                  const internal =
                    isInternalMessage(
                      message
                    );

                  return (
                    <div
                      key={message.id}
                      className={`
                        rounded-2xl
                        border
                        p-4
                        ${
                          internal
                            ? "border-amber-200 bg-amber-50"
                            : admin
                            ? "border-green-100 bg-green-50"
                            : "border-slate-200 bg-slate-50"
                        }
                      `}
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`
                              flex
                              h-9
                              w-9
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              ${
                                internal
                                  ? "bg-amber-100 text-amber-700"
                                  : admin
                                  ? "bg-green-100 text-green-700"
                                  : "bg-blue-100 text-blue-700"
                              }
                            `}
                          >
                            {admin ? (
                              <Users className="h-4 w-4" />
                            ) : (
                              <UserRound className="h-4 w-4" />
                            )}
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {getAuthorName(
                                message
                              )}
                            </p>

                            <p className="text-xs text-slate-500">
                              {admin
                                ? internal
                                  ? "Internal Note"
                                  : "Administrator"
                                : "Customer"}
                            </p>
                          </div>
                        </div>

                        <span className="text-xs text-slate-500">
                          {formatDate(
                            message.createdAt
                          )}
                        </span>
                      </div>

                      <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                        {message.message}
                      </p>
                    </div>
                  );
                }
              )}
            </div>
          </section>

          {/* Reply */}

          {!isClosed && (
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-5 py-4">
                <div className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-green-700" />

                  <h3 className="font-semibold text-slate-900">
                    Reply to Customer
                  </h3>
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  This message will be visible to
                  the customer.
                </p>
              </div>

              <div className="p-5">
                <textarea
                  value={reply}
                  onChange={(event) =>
                    setReply(
                      event.target.value
                    )
                  }
                  rows={5}
                  placeholder="Write your response to the customer..."
                  className="
                    w-full
                    resize-y
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-3
                    text-sm
                    text-slate-900
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-green-500
                    focus:bg-white
                    focus:ring-2
                    focus:ring-green-100
                  "
                />

                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      void handleReply()
                    }
                    disabled={
                      busyAction ===
                        "reply" ||
                      !reply.trim()
                    }
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-xl
                      bg-green-700
                      px-5
                      py-2.5
                      text-sm
                      font-semibold
                      text-white
                      transition
                      hover:bg-green-800
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    {busyAction ===
                    "reply" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}

                    Send Reply
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Internal Note */}

          <section className="rounded-2xl border border-amber-200 bg-white shadow-sm">
            <div className="border-b border-amber-100 px-5 py-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-amber-600" />

                <h3 className="font-semibold text-slate-900">
                  Internal Note
                </h3>
              </div>

              <p className="mt-1 text-xs text-slate-500">
                Internal notes are for administrators
                and are not shown to the customer.
              </p>
            </div>

            <div className="p-5">
              <textarea
                value={internalNote}
                onChange={(event) =>
                  setInternalNote(
                    event.target.value
                  )
                }
                rows={4}
                placeholder="Add an internal note for the support team..."
                className="
                  w-full
                  resize-y
                  rounded-xl
                  border
                  border-amber-200
                  bg-amber-50/40
                  px-4
                  py-3
                  text-sm
                  text-slate-900
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-amber-400
                  focus:bg-white
                  focus:ring-2
                  focus:ring-amber-100
                "
              />

              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    void handleInternalNote()
                  }
                  disabled={
                    busyAction ===
                      "internal_note" ||
                    !internalNote.trim()
                  }
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-amber-300
                    bg-amber-50
                    px-5
                    py-2.5
                    text-sm
                    font-semibold
                    text-amber-800
                    transition
                    hover:bg-amber-100
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {busyAction ===
                  "internal_note" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}

                  Add Internal Note
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Right Panel */}

        <div className="space-y-6">
          {/* Customer */}

          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <div className="flex items-center gap-2">
                <UserRound className="h-5 w-5 text-green-700" />

                <h3 className="font-semibold text-slate-900">
                  Customer
                </h3>
              </div>
            </div>

            <div className="space-y-4 p-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Name
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {customerName}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Email
                </p>

                <p className="mt-1 break-all text-sm text-slate-700">
                  {customerEmail}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Tenant ID
                </p>

                <p className="mt-1 break-all font-mono text-xs text-slate-600">
                  {ticket.tenantId}
                </p>
              </div>

              {ticket.website && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Website
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {ticket.website.name ||
                      ticket.website.domain ||
                      ticket.website.id}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Ticket Information */}

          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h3 className="font-semibold text-slate-900">
                Ticket Information
              </h3>
            </div>

            <div className="space-y-4 p-5">
              <InfoRow
                label="Ticket Number"
                value={ticket.ticketNumber}
              />

              <InfoRow
                label="Category"
                value={formatStatus(
                  ticket.category
                )}
              />

              <InfoRow
                label="Priority"
                value={formatPriority(
                  ticket.priority
                )}
              />

              <InfoRow
                label="Status"
                value={formatStatus(
                  ticket.status
                )}
              />

              <InfoRow
                label="Created"
                value={formatDate(
                  ticket.createdAt
                )}
              />

              <InfoRow
                label="Last Updated"
                value={formatDate(
                  ticket.updatedAt
                )}
              />

              <InfoRow
                label="Attachments"
                value={String(
                  ticket._count
                    ?.attachments ??
                    ticket.attachments
                      ?.length ??
                    0
                )}
              />
            </div>
          </section>

          {/* Assignment */}

          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-700" />

                <h3 className="font-semibold text-slate-900">
                  Assignment
                </h3>
              </div>
            </div>

            <div className="space-y-4 p-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Currently Assigned To
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {ticket.assignedTo
                    ?.name ||
                    ticket.assignedTo
                      ?.email ||
                    "Unassigned"}
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Administrator ID
                </label>

                <input
                  type="text"
                  value={assignedToId}
                  onChange={(event) =>
                    setAssignedToId(
                      event.target.value
                    )
                  }
                  placeholder="Enter administrator ID"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-3
                    py-2.5
                    font-mono
                    text-xs
                    text-slate-800
                    outline-none
                    transition
                    placeholder:font-sans
                    placeholder:text-slate-400
                    focus:border-green-500
                    focus:bg-white
                    focus:ring-2
                    focus:ring-green-100
                  "
                />

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Enter the administrator ID available
                  in the ROOTYM Admin database.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  void handleAssign()
                }
                disabled={
                  busyAction === "assign" ||
                  !assignedToId.trim()
                }
                className="
                  w-full
                  rounded-xl
                  bg-green-700
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-green-800
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {busyAction ===
                "assign" ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Assigning...
                  </span>
                ) : (
                  "Assign Ticket"
                )}
              </button>
            </div>
          </section>

          {/* Status Management */}

          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <div className="flex items-center gap-2">
                <Clock3 className="h-5 w-5 text-green-700" />

                <h3 className="font-semibold text-slate-900">
                  Status Management
                </h3>
              </div>
            </div>

            <div className="space-y-4 p-5">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Status
                </label>

                <select
                  value={selectedStatus}
                  onChange={(event) =>
                    setSelectedStatus(
                      event.target
                        .value as SupportTicketStatus
                    )
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-3
                    py-2.5
                    text-sm
                    text-slate-700
                    outline-none
                    transition
                    focus:border-green-500
                    focus:ring-2
                    focus:ring-green-100
                  "
                >
                  {STATUS_OPTIONS.map(
                    (option) => (
                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Note
                </label>

                <textarea
                  value={statusNote}
                  onChange={(event) =>
                    setStatusNote(
                      event.target.value
                    )
                  }
                  rows={3}
                  placeholder="Optional status note..."
                  className="
                    w-full
                    resize-y
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-3
                    py-2.5
                    text-sm
                    text-slate-700
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-green-500
                    focus:bg-white
                    focus:ring-2
                    focus:ring-green-100
                  "
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  void handleStatusChange()
                }
                disabled={
                  busyAction === "status" ||
                  selectedStatus ===
                    ticket.status
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-slate-700
                  transition
                  hover:bg-slate-50
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {busyAction ===
                "status" ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating...
                  </span>
                ) : (
                  "Update Status"
                )}
              </button>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
                {!isResolved &&
                  !isClosed && (
                    <button
                      type="button"
                      onClick={() =>
                        void handleResolve()
                      }
                      disabled={
                        busyAction ===
                        "resolve"
                      }
                      className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-emerald-600
                        px-4
                        py-2.5
                        text-sm
                        font-semibold
                        text-white
                        transition
                        hover:bg-emerald-700
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      {busyAction ===
                      "resolve" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4" />
                      )}

                      Resolve Ticket
                    </button>
                  )}

                {isResolved &&
                  !isClosed && (
                    <button
                      type="button"
                      onClick={() =>
                        void handleClose()
                      }
                      disabled={
                        busyAction ===
                        "close"
                      }
                      className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-slate-700
                        px-4
                        py-2.5
                        text-sm
                        font-semibold
                        text-white
                        transition
                        hover:bg-slate-800
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      {busyAction ===
                      "close" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}

                      Close Ticket
                    </button>
                  )}
              </div>
            </div>
          </section>

          {/* Status History */}

          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <div className="flex items-center gap-2">
                <Clock3 className="h-5 w-5 text-green-700" />

                <h3 className="font-semibold text-slate-900">
                  Status History
                </h3>
              </div>
            </div>

            <div className="p-5">
              {statusHistory.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No status history available.
                </p>
              ) : (
                <div className="space-y-4">
                  {statusHistory.map(
                    (history) => (
                      <div
                        key={history.id}
                        className="relative pl-5"
                      >
                        <div className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-green-600" />

                        <p className="text-sm font-medium text-slate-800">
                          {history.oldStatus
                            ? `${formatStatus(
                                history.oldStatus
                              )} → `
                            : ""}
                          {formatStatus(
                            history.newStatus
                          )}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {formatDate(
                            history.timestamp
                          )}
                        </p>

                        {history.note && (
                          <p className="mt-2 whitespace-pre-wrap text-xs leading-5 text-slate-600">
                            {history.note}
                          </p>
                        )}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs font-medium text-slate-400">
        {label}
      </span>

      <span className="text-right text-sm font-medium text-slate-700">
        {value}
      </span>
    </div>
  );
}