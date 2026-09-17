"use client";

/**
 * ============================================================
 * ROOTYM Admin Support Center
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the Admin Support Center ticket list,
 *          including ticket search, status filtering, priority
 *          visibility, customer details, and ticket navigation.
 * ============================================================
 */

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Filter,
  MessageSquare,
  RefreshCw,
  Search,
  Ticket,
  UserRound,
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

  messages?: Array<{
    id: string;
    message: string;
    messageType?: string;
    visibility?: string;
    sequence?: number;
    createdAt: string;
  }>;

  _count?: {
    messages?: number;
    attachments?: number;
  };
}

interface Pagination {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

interface SupportTicketsResponse {
  success: boolean;
  message?: string;
  tickets?: SupportTicket[];
  data?: {
    tickets?: SupportTicket[];
    pagination?: Pagination;
  };
  pagination?: Pagination;
}

const STATUS_OPTIONS = [
  { value: "ALL", label: "All Statuses" },
  { value: "OPEN", label: "Open" },
  { value: "ASSIGNED", label: "Assigned" },
  { value: "IN_PROGRESS", label: "In Progress" },
  {
    value: "WAITING_FOR_CUSTOMER",
    label: "Waiting for Customer",
  },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
];

const PRIORITY_OPTIONS = [
  { value: "ALL", label: "All Priorities" },
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "URGENT", label: "Urgent" },
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

function getCustomerName(ticket: SupportTicket) {
  return (
    ticket.createdBy?.name ||
    ticket.tenant?.name ||
    ticket.createdBy?.email ||
    ticket.tenant?.email ||
    "Customer"
  );
}

function getCustomerEmail(ticket: SupportTicket) {
  return (
    ticket.createdBy?.email ||
    ticket.tenant?.email ||
    "—"
  );
}

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1)
    )
    .join(" ");
}

function formatPriority(priority: string) {
  return (
    priority.charAt(0).toUpperCase() +
    priority.slice(1).toLowerCase()
  );
}

function statusClasses(status: string) {
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

function priorityClasses(priority: string) {
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

export default function AdminSupportTicketsPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [pagination, setPagination] =
    useState<Pagination | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [priorityFilter, setPriorityFilter] =
    useState("ALL");

  const [showFilters, setShowFilters] =
    useState(false);

  const loadTickets = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const response = await fetch(
          "/api/admin/support/tickets?limit=100",
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const result =
          (await response.json()) as SupportTicketsResponse;

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              "Unable to load support tickets."
          );
        }

        const loadedTickets =
          result.tickets ??
          result.data?.tickets ??
          [];

        setTickets(
          Array.isArray(loadedTickets)
            ? loadedTickets
            : []
        );

        setPagination(
          result.pagination ??
            result.data?.pagination ??
            null
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load support tickets."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    void loadTickets();
  }, [loadTickets]);

  const filteredTickets =
    useMemo(() => {
      const normalizedSearch =
        search.trim().toLowerCase();

      return tickets.filter(
        (ticket) => {
          const matchesSearch =
            !normalizedSearch ||
            ticket.ticketNumber
              .toLowerCase()
              .includes(normalizedSearch) ||
            ticket.subject
              .toLowerCase()
              .includes(normalizedSearch) ||
            ticket.category
              .toLowerCase()
              .includes(normalizedSearch) ||
            getCustomerName(ticket)
              .toLowerCase()
              .includes(normalizedSearch) ||
            getCustomerEmail(ticket)
              .toLowerCase()
              .includes(normalizedSearch);

          const matchesStatus =
            statusFilter === "ALL" ||
            ticket.status === statusFilter;

          const matchesPriority =
            priorityFilter === "ALL" ||
            ticket.priority === priorityFilter;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesPriority
          );
        }
      );
    }, [
      tickets,
      search,
      statusFilter,
      priorityFilter,
    ]);

  const summary = useMemo(() => {
    return {
      total: tickets.length,

      open: tickets.filter(
        (ticket) =>
          ticket.status === "OPEN"
      ).length,

      inProgress: tickets.filter(
        (ticket) =>
          ticket.status === "IN_PROGRESS" ||
          ticket.status === "ASSIGNED"
      ).length,

      waiting: tickets.filter(
        (ticket) =>
          ticket.status ===
          "WAITING_FOR_CUSTOMER"
      ).length,

      resolved: tickets.filter(
        (ticket) =>
          ticket.status === "RESOLVED"
      ).length,

      urgent: tickets.filter(
        (ticket) =>
          ticket.priority === "URGENT" &&
          ticket.status !== "CLOSED"
      ).length,
    };
  }, [tickets]);

  return (
    <div className="space-y-6">
      {/* Page Header */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700">
              <MessageSquare className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Support Center
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage customer support tickets and
                service conversations.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            void loadTickets(true)
          }
          disabled={loading || refreshing}
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

      {/* Summary Cards */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <SummaryCard
          label="Total Tickets"
          value={summary.total}
          icon={Ticket}
        />

        <SummaryCard
          label="Open"
          value={summary.open}
          icon={AlertCircle}
        />

        <SummaryCard
          label="In Progress"
          value={summary.inProgress}
          icon={Clock3}
        />

        <SummaryCard
          label="Waiting"
          value={summary.waiting}
          icon={UserRound}
        />

        <SummaryCard
          label="Resolved"
          value={summary.resolved}
          icon={CheckCircle2}
        />

        <SummaryCard
          label="Urgent"
          value={summary.urgent}
          icon={AlertCircle}
        />
      </div>

      {/* Main Card */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Toolbar */}

        <div className="border-b border-slate-200 p-4 lg:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search ticket number, subject, customer or category..."
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  py-2.5
                  pl-10
                  pr-4
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
            </div>

            <button
              type="button"
              onClick={() =>
                setShowFilters(
                  (current) => !current
                )
              }
              className={`
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                px-4
                py-2.5
                text-sm
                font-medium
                transition
                ${
                  showFilters ||
                  statusFilter !== "ALL" ||
                  priorityFilter !== "ALL"
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }
              `}
            >
              <Filter className="h-4 w-4" />

              Filters
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 md:grid-cols-2">
              <FilterSelect
                label="Status"
                value={statusFilter}
                options={STATUS_OPTIONS}
                onChange={setStatusFilter}
              />

              <FilterSelect
                label="Priority"
                value={priorityFilter}
                options={PRIORITY_OPTIONS}
                onChange={setPriorityFilter}
              />
            </div>
          )}
        </div>

        {/* Error */}

        {error && (
          <div className="m-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="font-semibold">
                Unable to load support tickets
              </p>

              <p className="mt-1">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Loading */}

        {loading && (
          <div className="p-10 text-center">
            <RefreshCw className="mx-auto h-7 w-7 animate-spin text-green-700" />

            <p className="mt-3 text-sm text-slate-500">
              Loading support tickets...
            </p>
          </div>
        )}

        {/* Empty State */}

        {!loading &&
          !error &&
          filteredTickets.length === 0 && (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-700">
                <MessageSquare className="h-7 w-7" />
              </div>

              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                {tickets.length === 0
                  ? "No support tickets yet"
                  : "No matching tickets"}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                {tickets.length === 0
                  ? "Customer support tickets will appear here when they are submitted."
                  : "Try changing your search or filter criteria."}
              </p>

              {tickets.length > 0 &&
                (search ||
                  statusFilter !== "ALL" ||
                  priorityFilter !==
                    "ALL") && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setStatusFilter(
                        "ALL"
                      );
                      setPriorityFilter(
                        "ALL"
                      );
                    }}
                    className="mt-5 rounded-xl bg-green-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-800"
                  >
                    Clear Filters
                  </button>
                )}
            </div>
          )}

        {/* Desktop Table */}

        {!loading &&
          !error &&
          filteredTickets.length > 0 && (
            <>
              <div className="hidden overflow-x-auto lg:block">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Ticket
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Customer
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Category
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Priority
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Status
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Assigned To
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Created
                      </th>

                      <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredTickets.map(
                      (ticket) => (
                        <tr
                          key={ticket.id}
                          className="transition hover:bg-slate-50"
                        >
                          <td className="px-5 py-4">
                            <Link
                              href={`/admin/support/tickets/${ticket.id}`}
                              className="group block"
                            >
                              <p className="font-semibold text-green-700 group-hover:text-green-800">
                                {
                                  ticket.ticketNumber
                                }
                              </p>

                              <p className="mt-1 max-w-xs truncate text-sm font-medium text-slate-900">
                                {ticket.subject}
                              </p>
                            </Link>
                          </td>

                          <td className="px-5 py-4">
                            <p className="text-sm font-medium text-slate-900">
                              {getCustomerName(
                                ticket
                              )}
                            </p>

                            <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                              {getCustomerEmail(
                                ticket
                              )}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <span className="text-sm text-slate-700">
                              {formatStatus(
                                ticket.category
                              )}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`
                                inline-flex
                                rounded-full
                                px-2.5
                                py-1
                                text-xs
                                font-semibold
                                ring-1
                                ring-inset
                                ${priorityClasses(
                                  ticket.priority
                                )}
                              `}
                            >
                              {formatPriority(
                                ticket.priority
                              )}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`
                                inline-flex
                                rounded-full
                                px-2.5
                                py-1
                                text-xs
                                font-semibold
                                ring-1
                                ring-inset
                                ${statusClasses(
                                  ticket.status
                                )}
                              `}
                            >
                              {formatStatus(
                                ticket.status
                              )}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <span className="text-sm text-slate-700">
                              {ticket.assignedTo
                                ?.name ||
                                ticket
                                  .assignedTo
                                  ?.email ||
                                "Unassigned"}
                            </span>
                          </td>

                          <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500">
                            {formatDate(
                              ticket.createdAt
                            )}
                          </td>

                          <td className="px-5 py-4 text-right">
                            <Link
                              href={`/admin/support/tickets/${ticket.id}`}
                              className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}

              <div className="divide-y divide-slate-100 lg:hidden">
                {filteredTickets.map(
                  (ticket) => (
                    <Link
                      key={ticket.id}
                      href={`/admin/support/tickets/${ticket.id}`}
                      className="block p-5 transition hover:bg-slate-50"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-green-700">
                            {
                              ticket.ticketNumber
                            }
                          </p>

                          <h3 className="mt-1 text-base font-semibold text-slate-900">
                            {ticket.subject}
                          </h3>
                        </div>

                        <span
                          className={`
                            shrink-0
                            rounded-full
                            px-2.5
                            py-1
                            text-xs
                            font-semibold
                            ring-1
                            ring-inset
                            ${statusClasses(
                              ticket.status
                            )}
                          `}
                        >
                          {formatStatus(
                            ticket.status
                          )}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-slate-400">
                            Customer
                          </p>

                          <p className="mt-1 truncate text-sm font-medium text-slate-700">
                            {getCustomerName(
                              ticket
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-400">
                            Priority
                          </p>

                          <span
                            className={`
                              mt-1
                              inline-flex
                              rounded-full
                              px-2.5
                              py-1
                              text-xs
                              font-semibold
                              ring-1
                              ring-inset
                              ${priorityClasses(
                                ticket.priority
                              )}
                            `}
                          >
                            {formatPriority(
                              ticket.priority
                            )}
                          </span>
                        </div>

                        <div>
                          <p className="text-xs text-slate-400">
                            Category
                          </p>

                          <p className="mt-1 text-sm text-slate-700">
                            {formatStatus(
                              ticket.category
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-400">
                            Created
                          </p>

                          <p className="mt-1 text-sm text-slate-700">
                            {formatDate(
                              ticket.createdAt
                            )}
                          </p>
                        </div>
                      </div>
                    </Link>
                  )
                )}
              </div>
            </>
          )}

        {/* Footer */}

        {!loading &&
          !error &&
          filteredTickets.length > 0 && (
            <div className="border-t border-slate-200 bg-slate-50 px-5 py-3">
              <div className="flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                <span>
                  Showing{" "}
                  <strong className="text-slate-700">
                    {filteredTickets.length}
                  </strong>{" "}
                  of{" "}
                  <strong className="text-slate-700">
                    {pagination?.total ??
                      tickets.length}
                  </strong>{" "}
                  tickets
                </span>

                {pagination?.totalPages &&
                  pagination.totalPages >
                    1 && (
                    <span>
                      Page{" "}
                      {pagination.page ??
                        1}{" "}
                      of{" "}
                      {
                        pagination.totalPages
                      }
                    </span>
                  )}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{
    className?: string;
  }>;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{
    value: string;
    label: string;
  }>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-600">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
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
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}