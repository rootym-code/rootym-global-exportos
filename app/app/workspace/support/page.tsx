/**
 * ============================================================
 * ROOTYM Support Center
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the single-page customer Support Center
 *          experience for support tickets, issue submission,
 *          ticket tracking, and customer conversation.
 * ============================================================
 */

"use client";

import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileImage,
  Filter,
  Headphones,
  MessageSquare,
  Paperclip,
  Plus,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Ticket,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type TicketStatus =
  | "OPEN"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "WAITING_FOR_CUSTOMER"
  | "RESOLVED"
  | "CLOSED";

type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

type TicketCategory =
  | "ACCOUNT"
  | "BILLING"
  | "WEBSITE"
  | "DOMAIN_DEPLOYMENT"
  | "PRODUCTS"
  | "INQUIRIES"
  | "EXPORT"
  | "R_CAPTAIN"
  | "TECHNICAL"
  | "OTHER";

type SupportTicket = {
  id: string;
  ticketNumber: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  updatedAt: string;
  createdAt: string;
};

type SupportMessage = {
  id: string;
  message: string;
  messageType: "REPLY" | "INTERNAL_NOTE" | "SYSTEM";
  visibility: "CUSTOMER" | "INTERNAL";
  sequence: number;
  createdAt: string;
  authorUser?: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
  authorAdmin?: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
};

type SupportStatusHistory = {
  id: string;
  oldStatus: TicketStatus | null;
  newStatus: TicketStatus;
  note: string | null;
  createdAt: string;
  changedByUser?: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
  changedByAdmin?: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
};

type SupportTicketDetail = SupportTicket & {
  description: string;
  website?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  createdBy?: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
  assignedTo?: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
  resolvedAt?: string | null;
  closedAt?: string | null;
  messages: SupportMessage[];
  attachments: Array<{
    id: string;
    mediaId: string;
    media?: {
      id: string;
      fileName?: string | null;
      fileUrl?: string | null;
      mimeType?: string | null;
    } | null;
  }>;
  statusHistory: SupportStatusHistory[];
};

const ticketStatusLabels: Record<TicketStatus, string> = {
  OPEN: "Open",
  ASSIGNED: "Assigned",
  IN_PROGRESS: "In Progress",
  WAITING_FOR_CUSTOMER: "Waiting for You",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

const ticketPriorityLabels: Record<TicketPriority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
};

const ticketCategoryLabels: Record<TicketCategory, string> = {
  ACCOUNT: "Account",
  BILLING: "Billing",
  WEBSITE: "Website",
  DOMAIN_DEPLOYMENT: "Domain & Deployment",
  PRODUCTS: "Products",
  INQUIRIES: "Inquiries",
  EXPORT: "Export",
  R_CAPTAIN: "R-CAPTAIN",
  TECHNICAL: "Technical",
  OTHER: "Other",
};

/**
 * Initial UI state.
 *
 * The backend/API integration will populate this collection
 * in the next implementation step.
 */
const initialTickets: SupportTicket[] = [];

function statusClasses(status: TicketStatus) {
  switch (status) {
    case "OPEN":
      return "bg-blue-50 text-blue-700 ring-blue-200";
    case "ASSIGNED":
      return "bg-violet-50 text-violet-700 ring-violet-200";
    case "IN_PROGRESS":
      return "bg-amber-50 text-amber-700 ring-amber-200";
    case "WAITING_FOR_CUSTOMER":
      return "bg-orange-50 text-orange-700 ring-orange-200";
    case "RESOLVED":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "CLOSED":
      return "bg-slate-100 text-slate-600 ring-slate-200";
    default:
      return "bg-slate-100 text-slate-600 ring-slate-200";
  }
}

function priorityClasses(priority: TicketPriority) {
  switch (priority) {
    case "URGENT":
      return "bg-red-50 text-red-700 ring-red-200";
    case "HIGH":
      return "bg-orange-50 text-orange-700 ring-orange-200";
    case "MEDIUM":
      return "bg-amber-50 text-amber-700 ring-amber-200";
    case "LOW":
      return "bg-slate-100 text-slate-600 ring-slate-200";
    default:
      return "bg-slate-100 text-slate-600 ring-slate-200";
  }
}

function statusIcon(status: TicketStatus) {
  switch (status) {
    case "OPEN":
      return <Ticket className="h-4 w-4" />;
    case "ASSIGNED":
      return <ShieldCheck className="h-4 w-4" />;
    case "IN_PROGRESS":
      return <RefreshCw className="h-4 w-4" />;
    case "WAITING_FOR_CUSTOMER":
      return <Clock3 className="h-4 w-4" />;
    case "RESOLVED":
      return <CheckCircle2 className="h-4 w-4" />;
    case "CLOSED":
      return <CheckCircle2 className="h-4 w-4" />;
    default:
      return <Ticket className="h-4 w-4" />;
  }
}

function formatCategory(category: TicketCategory) {
  return ticketCategoryLabels[category];
}

export default function SupportPage() {
  const [tickets, setTickets] =
    useState<SupportTicket[]>(initialTickets);

  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isReplySubmitting, setIsReplySubmitting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [detailError, setDetailError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [replyError, setReplyError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [replySuccess, setReplySuccess] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | TicketStatus>(
    "ALL",
  );

  const [showNewIssue, setShowNewIssue] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(
    null,
  );
  const [selectedTicketDetail, setSelectedTicketDetail] =
    useState<SupportTicketDetail | null>(null);

  const [subject, setSubject] = useState("");
  const [category, setCategory] =
    useState<TicketCategory>("TECHNICAL");
  const [priority, setPriority] =
    useState<TicketPriority>("MEDIUM");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [reply, setReply] = useState("");
  const [replyAttachments, setReplyAttachments] = useState<File[]>([]);

  const loadTickets = async () => {
    try {
      setIsLoading(true);
      setLoadError("");

      const response = await fetch("/api/support/tickets", {
        method: "GET",
        cache: "no-store",
      });

      const payload = (await response.json()) as {
        success?: boolean;
        message?: string;
        data?: {
          tickets?: Array<{
            id: string;
            ticketNumber: string;
            subject: string;
            category: TicketCategory;
            priority: TicketPriority;
            status: TicketStatus;
            updatedAt: string;
            createdAt: string;
          }>;
        };
      };

      if (!response.ok || !payload.success) {
        throw new Error(
          payload.message ?? "Unable to load support tickets.",
        );
      }

      setTickets(
        (payload.data?.tickets ?? []).map((ticket) => ({
          ...ticket,
          updatedAt: formatDate(ticket.updatedAt),
          createdAt: formatDate(ticket.createdAt),
        })),
      );
    } catch (error) {
      setLoadError(
        error instanceof Error
          ? error.message
          : "Unable to load support tickets.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadTickets();
  }, []);

  const loadTicketDetail = async (ticketId: string) => {
    try {
      setIsDetailLoading(true);
      setDetailError("");
      setReplyError("");
      setReplySuccess("");

      const response = await fetch(
        `/api/support/tickets/${encodeURIComponent(ticketId)}`,
        {
          method: "GET",
          cache: "no-store",
        },
      );

      const payload = (await response.json()) as {
        success?: boolean;
        error?: string;
        data?: SupportTicketDetail;
      };

      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(
          payload.error ?? "Unable to load the support ticket.",
        );
      }

      setSelectedTicketDetail({
        ...payload.data,
        createdAt: formatDate(payload.data.createdAt),
        updatedAt: formatDate(payload.data.updatedAt),
        resolvedAt: payload.data.resolvedAt
          ? formatDate(payload.data.resolvedAt)
          : null,
        closedAt: payload.data.closedAt
          ? formatDate(payload.data.closedAt)
          : null,
        messages: payload.data.messages.map((message) => ({
          ...message,
          createdAt: formatDateTime(message.createdAt),
        })),
        statusHistory: payload.data.statusHistory.map((history) => ({
          ...history,
          createdAt: formatDateTime(history.createdAt),
        })),
      });
    } catch (error) {
      setSelectedTicketDetail(null);
      setDetailError(
        error instanceof Error
          ? error.message
          : "Unable to load the support ticket.",
      );
    } finally {
      setIsDetailLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedTicketId) {
      setSelectedTicketDetail(null);
      setDetailError("");
      return;
    }

    void loadTicketDetail(selectedTicketId);
  }, [selectedTicketId]);

  const filteredTickets = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return tickets.filter((ticket) => {
      const matchesSearch =
        !query ||
        ticket.ticketNumber.toLowerCase().includes(query) ||
        ticket.subject.toLowerCase().includes(query) ||
        formatCategory(ticket.category).toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "ALL" || ticket.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tickets, searchQuery, statusFilter]);

  const selectedTicket = useMemo(
    () =>
      tickets.find((ticket) => ticket.id === selectedTicketId) ?? null,
    [tickets, selectedTicketId],
  );

  const summary = useMemo(
    () => ({
      total: tickets.length,
      open: tickets.filter((ticket) => ticket.status === "OPEN").length,
      inProgress: tickets.filter(
        (ticket) => ticket.status === "IN_PROGRESS",
      ).length,
      waiting: tickets.filter(
        (ticket) => ticket.status === "WAITING_FOR_CUSTOMER",
      ).length,
      resolved: tickets.filter(
        (ticket) => ticket.status === "RESOLVED",
      ).length,
    }),
    [tickets],
  );

  const handleAttachmentChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    if (!selectedFiles.length) {
      return;
    }

    setAttachments((current) => [...current, ...selectedFiles]);
    event.target.value = "";
  };

  const removeAttachment = (index: number) => {
    setAttachments((current) =>
      current.filter((_, fileIndex) => fileIndex !== index),
    );
  };

  const handleReplyAttachmentChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    if (!selectedFiles.length) {
      return;
    }

    setReplyAttachments((current) => [...current, ...selectedFiles]);
    event.target.value = "";
  };

  const removeReplyAttachment = (index: number) => {
    setReplyAttachments((current) =>
      current.filter((_, fileIndex) => fileIndex !== index),
    );
  };

  const uploadSupportAttachment = async (ticketId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      `/api/support/tickets/${encodeURIComponent(ticketId)}/attachments`,
      {
        method: "POST",
        body: formData,
      },
    );

    const payload = (await response.json()) as {
      success?: boolean;
      error?: string;
      message?: string;
    };

    if (!response.ok || !payload.success) {
      throw new Error(
        payload.error ??
          payload.message ??
          `Unable to upload ${file.name}.`,
      );
    }
  };

  const handleCreateTicket = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError("");
      setSubmitSuccess("");

      const response = await fetch("/api/support/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          category,
          priority,
          description,
        }),
      });

      const payload = (await response.json()) as {
        success?: boolean;
        message?: string;
        data?: {
          ticket?: {
            id: string;
            ticketNumber: string;
            subject: string;
            category: TicketCategory;
            priority: TicketPriority;
            status: TicketStatus;
            updatedAt: string;
            createdAt: string;
          };
        };
      };

      if (!response.ok || !payload.success || !payload.data?.ticket) {
        throw new Error(
          payload.message ?? "Unable to create support ticket.",
        );
      }

      const createdTicket = payload.data.ticket;
      const selectedAttachments = [...attachments];

      let uploadedAttachmentCount = 0;
      const failedAttachments: string[] = [];

      for (const file of selectedAttachments) {
        try {
          await uploadSupportAttachment(createdTicket.id, file);
          uploadedAttachmentCount += 1;
        } catch (error) {
          failedAttachments.push(
            error instanceof Error ? `${file.name}: ${error.message}` : file.name,
          );
        }
      }

      if (failedAttachments.length === 0) {
        setSubmitSuccess(
          selectedAttachments.length > 0
            ? `Ticket ${createdTicket.ticketNumber} was created successfully with ${uploadedAttachmentCount} attachment${uploadedAttachmentCount === 1 ? "" : "s"}.`
            : `Ticket ${createdTicket.ticketNumber} was created successfully.`,
        );
      } else {
        setSubmitSuccess(
          `Ticket ${createdTicket.ticketNumber} was created. ${uploadedAttachmentCount} of ${selectedAttachments.length} attachment${selectedAttachments.length === 1 ? "" : "s"} uploaded successfully.`,
        );
        setSubmitError(
          `Some attachments could not be uploaded: ${failedAttachments.join("; ")}`,
        );
      }

      setSubject("");
      setCategory("TECHNICAL");
      setPriority("MEDIUM");
      setDescription("");
      setAttachments([]);
      setSelectedTicketId(createdTicket.id);
      setShowNewIssue(false);

      await loadTickets();
      await loadTicketDetail(createdTicket.id);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to create support ticket.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendReply = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!selectedTicketId || !reply.trim() || isReplySubmitting) {
      return;
    }

    try {
      setIsReplySubmitting(true);
      setReplyError("");
      setReplySuccess("");

      const selectedReplyAttachments = [...replyAttachments];

      const response = await fetch(
        `/api/support/tickets/${encodeURIComponent(selectedTicketId)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: reply.trim(),
          }),
        },
      );

      const payload = (await response.json()) as {
        success?: boolean;
        error?: string;
        data?: {
          ticket?: SupportTicketDetail;
        };
      };

      if (!response.ok || !payload.success) {
        throw new Error(payload.error ?? "Unable to send the reply.");
      }

      let uploadedAttachmentCount = 0;
      const failedAttachments: string[] = [];

      for (const file of selectedReplyAttachments) {
        try {
          await uploadSupportAttachment(selectedTicketId, file);
          uploadedAttachmentCount += 1;
        } catch (error) {
          failedAttachments.push(
            error instanceof Error
              ? `${file.name}: ${error.message}`
              : file.name,
          );
        }
      }

      setReply("");
      setReplyAttachments([]);

      if (failedAttachments.length === 0) {
        setReplySuccess(
          selectedReplyAttachments.length > 0
            ? `Your reply was sent successfully with ${uploadedAttachmentCount} attachment${uploadedAttachmentCount === 1 ? "" : "s"}.`
            : "Your reply was sent successfully.",
        );
      } else {
        setReplySuccess(
          `Your reply was sent. ${uploadedAttachmentCount} of ${selectedReplyAttachments.length} attachment${selectedReplyAttachments.length === 1 ? "" : "s"} uploaded successfully.`,
        );
        setReplyError(
          `Some attachments could not be uploaded: ${failedAttachments.join("; ")}`,
        );
      }

      await loadTickets();
      await loadTicketDetail(selectedTicketId);
    } catch (error) {
      setReplyError(
        error instanceof Error
          ? error.message
          : "Unable to send the reply.",
      );
    } finally {
      setIsReplySubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-[1500px] px-5 py-6 sm:px-7 lg:px-10 lg:py-8">
        {/* ============================================================
         * HEADER
         * ============================================================ */}
        <section className="overflow-hidden rounded-2xl bg-slate-950 text-white shadow-sm">
          <div className="relative px-6 py-7 sm:px-8 sm:py-9">
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl" />
            <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl" />

            <div className="relative">
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">
                <Headphones className="h-4 w-4" />
                Support Center
              </div>

              <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    How can we help?
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                    Raise an issue, track your support tickets, and
                    communicate directly with the ROOTYM support team.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowNewIssue(true)}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                >
                  <Plus className="h-4 w-4" />
                  Raise New Issue
                </button>
              </div>
            </div>
          </div>
        </section>

        {(submitSuccess || submitError || loadError) && (
          <section className="mt-4 space-y-2">
            {submitSuccess && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                {submitSuccess}
                <button
                  type="button"
                  onClick={() => setSubmitSuccess("")}
                  className="ml-auto text-emerald-600 hover:text-emerald-900"
                  aria-label="Dismiss success message"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {(submitError || loadError) && (
              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {submitError || loadError}
                <button
                  type="button"
                  onClick={() => {
                    setSubmitError("");
                    setLoadError("");
                  }}
                  className="ml-auto text-red-600 hover:text-red-900"
                  aria-label="Dismiss error message"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </section>
        )}

        {/* ============================================================
         * SUMMARY
         * ============================================================ */}
        <section className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
          <SummaryCard
            label="All Tickets"
            value={summary.total}
            icon={<Ticket className="h-4 w-4" />}
          />

          <SummaryCard
            label="Open"
            value={summary.open}
            icon={<AlertCircle className="h-4 w-4" />}
          />

          <SummaryCard
            label="In Progress"
            value={summary.inProgress}
            icon={<RefreshCw className="h-4 w-4" />}
          />

          <SummaryCard
            label="Waiting for You"
            value={summary.waiting}
            icon={<Clock3 className="h-4 w-4" />}
          />

          <SummaryCard
            label="Resolved"
            value={summary.resolved}
            icon={<CheckCircle2 className="h-4 w-4" />}
          />
        </section>

        {/* ============================================================
         * MAIN CONTENT
         * ============================================================ */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px]">
          {/* ==========================================================
           * MY TICKETS
           * ========================================================== */}
          <section className="min-w-0 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
              <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-slate-500" />
                    <h2 className="text-lg font-bold text-slate-950">
                      My Support Tickets
                    </h2>
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    View and track all support requests raised by you.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowNewIssue(true)}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <Plus className="h-4 w-4" />
                  New Issue
                </button>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <div className="relative min-w-0 flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) =>
                      setSearchQuery(event.target.value)
                    }
                    placeholder="Search ticket number, subject or category..."
                    className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
                  />
                </div>

                <div className="relative sm:w-48">
                  <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <select
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(
                        event.target.value as "ALL" | TicketStatus,
                      )
                    }
                    className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="OPEN">Open</option>
                    <option value="ASSIGNED">Assigned</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="WAITING_FOR_CUSTOMER">
                      Waiting for You
                    </option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>
              </div>
            </div>

            {isLoading ? (
              <LoadingTickets />
            ) : filteredTickets.length === 0 ? (
              <EmptyTickets
                hasFilters={Boolean(searchQuery || statusFilter !== "ALL")}
                onCreate={() => setShowNewIssue(true)}
                onClear={() => {
                  setSearchQuery("");
                  setStatusFilter("ALL");
                }}
              />
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredTickets.map((ticket) => (
                  <button
                    key={ticket.id}
                    type="button"
                    onClick={() => setSelectedTicketId(ticket.id)}
                    className={[
                      "group flex w-full items-center gap-4 px-5 py-5 text-left transition hover:bg-slate-50 sm:px-6",
                      selectedTicketId === ticket.id
                        ? "bg-slate-50"
                        : "",
                    ].join(" ")}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                      <Ticket className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-slate-400">
                          {ticket.ticketNumber}
                        </span>

                        <span
                          className={[
                            "inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide ring-1 ring-inset",
                            statusClasses(ticket.status),
                          ].join(" ")}
                        >
                          {statusIcon(ticket.status)}
                          {ticketStatusLabels[ticket.status]}
                        </span>
                      </div>

                      <div className="mt-1 truncate text-sm font-semibold text-slate-900">
                        {ticket.subject}
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                        <span>
                          {ticketCategoryLabels[ticket.category]}
                        </span>
                        <span>•</span>
                        <span>
                          Updated {ticket.updatedAt}
                        </span>
                      </div>
                    </div>

                    <div className="hidden shrink-0 sm:block">
                      <span
                        className={[
                          "inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ring-1 ring-inset",
                          priorityClasses(ticket.priority),
                        ].join(" ")}
                      >
                        {ticketPriorityLabels[ticket.priority]}
                      </span>
                    </div>

                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500" />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* ==========================================================
           * RIGHT PANEL
           * ========================================================== */}
          <aside className="space-y-6">
            {showNewIssue ? (
              <NewIssueCard
                subject={subject}
                category={category}
                priority={priority}
                description={description}
                attachments={attachments}
                onSubjectChange={setSubject}
                onCategoryChange={setCategory}
                onPriorityChange={setPriority}
                onDescriptionChange={setDescription}
                onAttachmentChange={handleAttachmentChange}
                onRemoveAttachment={removeAttachment}
                onSubmit={handleCreateTicket}
                isSubmitting={isSubmitting}
                submitError={submitError}
                onClose={() => setShowNewIssue(false)}
              />
            ) : selectedTicket ? (
              <TicketDetailCard
                ticket={selectedTicket}
                detail={selectedTicketDetail}
                isLoading={isDetailLoading}
                detailError={detailError}
                reply={reply}
                replyAttachments={replyAttachments}
                replyError={replyError}
                replySuccess={replySuccess}
                isReplySubmitting={isReplySubmitting}
                onReplyChange={setReply}
                onReplyAttachmentChange={handleReplyAttachmentChange}
                onRemoveReplyAttachment={removeReplyAttachment}
                onReply={handleSendReply}
                onClose={() => setSelectedTicketId(null)}
              />
            ) : (
              <SupportHelpCard
                onCreate={() => setShowNewIssue(true)}
              />
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * SUMMARY CARD
 * ============================================================================
 */

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-slate-500">
          {label}
        </span>

        <span className="text-slate-300">{icon}</span>
      </div>

      <div className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
        {value}
      </div>
    </div>
  );
}

/* ============================================================================
 * LOADING TICKETS
 * ============================================================================
 */

function LoadingTickets() {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center px-6 py-12 text-center">
      <RefreshCw className="h-6 w-6 animate-spin text-slate-300" />

      <h3 className="mt-4 text-sm font-bold text-slate-800">
        Loading support tickets
      </h3>

      <p className="mt-1 text-xs text-slate-400">
        Fetching your latest support requests...
      </p>
    </div>
  );
}

/* ============================================================================
 * EMPTY TICKETS
 * ============================================================================
 */

function EmptyTickets({
  hasFilters,
  onCreate,
  onClear,
}: {
  hasFilters: boolean;
  onCreate: () => void;
  onClear: () => void;
}) {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center px-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        {hasFilters ? (
          <Search className="h-6 w-6" />
        ) : (
          <Headphones className="h-6 w-6" />
        )}
      </div>

      <h3 className="mt-5 text-base font-bold text-slate-900">
        {hasFilters
          ? "No matching tickets"
          : "No support tickets yet"}
      </h3>

      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
        {hasFilters
          ? "Try changing your search or status filter."
          : "If you need help with your ROOTYM workspace, raise an issue and our support team will follow up."}
      </p>

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {hasFilters ? (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </button>
        ) : null}

        <button
          type="button"
          onClick={onCreate}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          Raise New Issue
        </button>
      </div>
    </div>
  );
}

/* ============================================================================
 * SUPPORT HELP CARD
 * ============================================================================
 */

function SupportHelpCard({
  onCreate,
}: {
  onCreate: () => void;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
        <Headphones className="h-5 w-5" />
      </div>

      <h3 className="mt-5 text-base font-bold text-slate-950">
        Need assistance?
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        Tell us what is happening and include as much detail as
        possible. Screenshots can help our team resolve issues faster.
      </p>

      <button
        type="button"
        onClick={onCreate}
        className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        <Plus className="h-4 w-4" />
        Raise New Issue
      </button>

      <div className="mt-6 border-t border-slate-100 pt-5">
        <div className="space-y-4">
          <HelpPoint
            icon={<MessageSquare className="h-4 w-4" />}
            title="Keep everything in one place"
            description="All ticket communication stays connected to your issue."
          />

          <HelpPoint
            icon={<FileImage className="h-4 w-4" />}
            title="Share screenshots"
            description="Attach screenshots or supporting files when reporting an issue."
          />

          <HelpPoint
            icon={<ShieldCheck className="h-4 w-4" />}
            title="Tenant-safe support"
            description="Your support history remains associated with your ROOTYM workspace."
          />
        </div>
      </div>
    </section>
  );
}

function HelpPoint({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        {icon}
      </div>

      <div>
        <div className="text-sm font-semibold text-slate-800">
          {title}
        </div>

        <div className="mt-0.5 text-xs leading-5 text-slate-500">
          {description}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * NEW ISSUE CARD
 * ============================================================================
 */

function NewIssueCard({
  subject,
  category,
  priority,
  description,
  attachments,
  onSubjectChange,
  onCategoryChange,
  onPriorityChange,
  onDescriptionChange,
  onAttachmentChange,
  onRemoveAttachment,
  onSubmit,
  isSubmitting,
  submitError,
  onClose,
}: {
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  description: string;
  attachments: File[];
  onSubjectChange: (value: string) => void;
  onCategoryChange: (value: TicketCategory) => void;
  onPriorityChange: (value: TicketPriority) => void;
  onDescriptionChange: (value: string) => void;
  onAttachmentChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  onRemoveAttachment: (index: number) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  submitError: string;
  onClose: () => void;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-5 sm:px-6">
        <div>
          <div className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-slate-500" />
            <h2 className="text-lg font-bold text-slate-950">
              Raise New Issue
            </h2>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Provide the details so our team can investigate.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close new issue form"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-5 p-5 sm:p-6">
        <Field label="Subject" required>
          <input
            value={subject}
            onChange={(event) =>
              onSubjectChange(event.target.value)
            }
            placeholder="Briefly describe the issue"
            required
            className="field-input"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Category" required>
            <select
              value={category}
              onChange={(event) =>
                onCategoryChange(
                  event.target.value as TicketCategory,
                )
              }
              className="field-input"
            >
              {Object.entries(ticketCategoryLabels).map(
                ([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ),
              )}
            </select>
          </Field>

          <Field label="Priority" required>
            <select
              value={priority}
              onChange={(event) =>
                onPriorityChange(
                  event.target.value as TicketPriority,
                )
              }
              className="field-input"
            >
              {Object.entries(ticketPriorityLabels).map(
                ([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ),
              )}
            </select>
          </Field>
        </div>

        <Field label="Detailed Description" required>
          <textarea
            value={description}
            onChange={(event) =>
              onDescriptionChange(event.target.value)
            }
            placeholder="Explain what happened, what you expected, and any relevant steps to reproduce the issue..."
            required
            rows={7}
            className="field-input min-h-[150px] resize-y py-3"
          />

          <div className="mt-1.5 text-[11px] text-slate-400">
            Include useful details such as page name, action performed,
            error message, and expected result.
          </div>
        </Field>

        <Field label="Screenshots & Files">
          <label className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-7 text-center transition hover:border-slate-400 hover:bg-white">
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/gif,.pdf,.doc,.docx,.xls,.xlsx"
              onChange={onAttachmentChange}
              className="hidden"
            />

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-200">
              <Upload className="h-4 w-4" />
            </div>

            <div className="mt-3 text-sm font-semibold text-slate-700">
              Click to upload files
            </div>

            <div className="mt-1 text-xs text-slate-400">
              Screenshots, documents or supporting files
            </div>
          </label>

          {attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              {attachments.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2"
                >
                  <Paperclip className="h-4 w-4 shrink-0 text-slate-400" />

                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-medium text-slate-700">
                      {file.name}
                    </div>

                    <div className="text-[10px] text-slate-400">
                      {formatFileSize(file.size)}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveAttachment(index)}
                    aria-label={`Remove ${file.name}`}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Field>

        <div className="rounded-lg bg-slate-50 px-3 py-3 text-xs leading-5 text-slate-500">
          Your issue will be assigned a unique ticket number after
          submission. You can use that number when communicating with
          ROOTYM support.
        </div>

        {submitError && (
          <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-3 text-xs leading-5 text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="h-10 flex-1 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {isSubmitting ? "Submitting..." : "Submit Issue"}
          </button>
        </div>
      </form>
    </section>
  );
}

/* ============================================================================
 * TICKET DETAIL CARD
 * ============================================================================
 */

function TicketDetailCard({
  ticket,
  detail,
  isLoading,
  detailError,
  reply,
  replyAttachments,
  replyError,
  replySuccess,
  isReplySubmitting,
  onReplyChange,
  onReplyAttachmentChange,
  onRemoveReplyAttachment,
  onReply,
  onClose,
}: {
  ticket: SupportTicket;
  detail: SupportTicketDetail | null;
  isLoading: boolean;
  detailError: string;
  reply: string;
  replyAttachments: File[];
  replyError: string;
  replySuccess: string;
  isReplySubmitting: boolean;
  onReplyChange: (value: string) => void;
  onReplyAttachmentChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  onRemoveReplyAttachment: (index: number) => void;
  onReply: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}) {
  const canReply =
    ticket.status !== "RESOLVED" && ticket.status !== "CLOSED";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="font-mono text-xs font-semibold text-slate-400">
              {ticket.ticketNumber}
            </div>

            <h2 className="mt-1 text-base font-bold text-slate-950">
              {ticket.subject}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close ticket details"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <span
            className={[
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ring-1 ring-inset",
              statusClasses(ticket.status),
            ].join(" ")}
          >
            {statusIcon(ticket.status)}
            {ticketStatusLabels[ticket.status]}
          </span>

          <span
            className={[
              "inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ring-1 ring-inset",
              priorityClasses(ticket.priority),
            ].join(" ")}
          >
            {ticketPriorityLabels[ticket.priority]}
          </span>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {isLoading ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
            <RefreshCw className="h-6 w-6 animate-spin text-slate-300" />
            <p className="mt-3 text-sm font-semibold text-slate-600">
              Loading ticket details...
            </p>
          </div>
        ) : detailError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-2 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{detailError}</span>
            </div>

            <button
              type="button"
              onClick={() => {
                window.location.reload();
              }}
              className="mt-3 inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 text-xs font-semibold text-red-700 transition hover:bg-red-50"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Retry
            </button>
          </div>
        ) : detail ? (
          <>
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  Category
                </span>

                <span className="text-xs font-semibold text-slate-700">
                  {ticketCategoryLabels[detail.category]}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  Created
                </span>

                <span className="text-xs text-slate-600">
                  {detail.createdAt}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  Last Updated
                </span>

                <span className="text-xs text-slate-600">
                  {detail.updatedAt}
                </span>
              </div>

              {detail.assignedTo ? (
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    Assigned To
                  </span>

                  <span className="text-right text-xs font-semibold text-slate-700">
                    {detail.assignedTo.name || detail.assignedTo.email || "Support Team"}
                  </span>
                </div>
              ) : null}
            </div>

            <div className="mt-5">
              <div className="mb-3 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-slate-400" />
                <span className="text-sm font-bold text-slate-800">
                  Issue Description
                </span>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-600">
                {detail.description}
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-3 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-slate-400" />
                <span className="text-sm font-bold text-slate-800">
                  Conversation
                </span>
              </div>

              {detail.messages.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center">
                  <MessageSquare className="mx-auto h-5 w-5 text-slate-300" />
                  <p className="mt-2 text-xs leading-5 text-slate-400">
                    No customer-visible messages yet.
                  </p>
                </div>
              ) : (
                <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
                  {detail.messages.map((message) => {
                    const author =
                      message.authorAdmin?.name ||
                      message.authorUser?.name ||
                      message.authorAdmin?.email ||
                      message.authorUser?.email ||
                      "ROOTYM Support";

                    const isCustomerMessage = Boolean(message.authorUser);

                    return (
                      <div
                        key={message.id}
                        className={[
                          "rounded-xl border px-4 py-3",
                          isCustomerMessage
                            ? "border-slate-200 bg-slate-50"
                            : "border-emerald-100 bg-emerald-50/60",
                        ].join(" ")}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs font-bold text-slate-700">
                            {isCustomerMessage ? "You" : author}
                          </span>

                          <span className="text-[10px] text-slate-400">
                            {message.createdAt}
                          </span>
                        </div>

                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                          {message.message}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {detail.attachments.length > 0 ? (
              <div className="mt-5">
                <div className="mb-3 flex items-center gap-2">
                  <Paperclip className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-bold text-slate-800">
                    Attachments
                  </span>
                </div>

                <div className="space-y-2">
                  {detail.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2"
                    >
                      <FileImage className="h-4 w-4 shrink-0 text-slate-400" />

                      <div className="min-w-0 flex-1">
                        <div className="truncate text-xs font-medium text-slate-700">
                          {attachment.media?.fileName || "Support attachment"}
                        </div>

                        {attachment.media?.mimeType ? (
                          <div className="text-[10px] text-slate-400">
                            {attachment.media.mimeType}
                          </div>
                        ) : null}
                      </div>

                      {attachment.media?.fileUrl ? (
                        <a
                          href={attachment.media.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-semibold text-slate-600 hover:text-slate-950"
                        >
                          View
                        </a>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {detail.statusHistory.length > 0 ? (
              <div className="mt-5">
                <div className="mb-3 flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-bold text-slate-800">
                    Status History
                  </span>
                </div>

                <div className="space-y-2">
                  {detail.statusHistory.map((history) => (
                    <div
                      key={history.id}
                      className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-semibold text-slate-700">
                          {history.oldStatus
                            ? `${ticketStatusLabels[history.oldStatus]} → `
                            : ""}
                          {ticketStatusLabels[history.newStatus]}
                        </span>

                        <span className="text-[10px] text-slate-400">
                          {history.createdAt}
                        </span>
                      </div>

                      {history.note ? (
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {history.note}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {replySuccess ? (
              <div className="mt-5 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-3 text-xs font-medium text-emerald-700">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                {replySuccess}
              </div>
            ) : null}

            {replyError ? (
              <div className="mt-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-3 text-xs leading-5 text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{replyError}</span>
              </div>
            ) : null}

            {canReply ? (
              <form
                onSubmit={onReply}
                className="mt-5 border-t border-slate-100 pt-5"
              >
                <label className="text-sm font-semibold text-slate-800">
                  Reply
                </label>

                <textarea
                  value={reply}
                  onChange={(event) => onReplyChange(event.target.value)}
                  rows={4}
                  placeholder="Write your response..."
                  disabled={isReplySubmitting}
                  className="field-input mt-2 min-h-[100px] resize-y py-3 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <label className="mt-3 flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-slate-400 hover:bg-white">
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp,image/gif,.pdf,.doc,.docx,.xls,.xlsx"
                    onChange={onReplyAttachmentChange}
                    disabled={isReplySubmitting}
                    className="hidden"
                  />
                  <Paperclip className="h-4 w-4 text-slate-400" />
                  Attach screenshot or file
                </label>

                {replyAttachments.length > 0 ? (
                  <div className="mt-2 space-y-2">
                    {replyAttachments.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2"
                      >
                        <Paperclip className="h-4 w-4 shrink-0 text-slate-400" />

                        <div className="min-w-0 flex-1">
                          <div className="truncate text-xs font-medium text-slate-700">
                            {file.name}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {formatFileSize(file.size)}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveReplyAttachment(index)}
                          disabled={isReplySubmitting}
                          aria-label={`Remove ${file.name}`}
                          className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={!reply.trim() || isReplySubmitting}
                  className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isReplySubmitting ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {isReplySubmitting ? "Sending..." : "Send Reply"}
                </button>
              </form>
            ) : (
              <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-xs leading-5 text-slate-500">
                {ticket.status === "RESOLVED"
                  ? "This ticket has been resolved. Please raise a new issue if you need further assistance."
                  : "This ticket is closed and cannot receive new replies."}
              </div>
            )}
          </>
        ) : null}
      </div>
    </section>
  );
}

/* ============================================================================
 * FORM FIELD
 * ============================================================================
 */

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
        {label}
        {required ? (
          <span className="ml-1 text-red-500">*</span>
        ) : null}
      </label>

      {children}
    </div>
  );
}

/* ============================================================================
 * UTILITIES
 * ============================================================================
 */

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatFileSize(size: number) {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}