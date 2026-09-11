"use client";

/**
 * ============================================================
 * ROOTYM Global ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Customer Workspace FollowUp Center.
 *
 * ============================================================
 */

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Eye,
  Search,
} from "lucide-react";

import {
  FollowUpPriority,
  FollowUpStatus,
} from "@/lib/generated/prisma";

import CreateFollowUpModal from "./components/CreateFollowUpModal";

interface FollowUpItem {
  id: string;
  title: string;
  actionType: string;
  category: string;
  priority: FollowUpPriority;
  status: FollowUpStatus;
  scheduledAt: string | Date;
  inquiry: {
    id: string;
    inquiryNumber: string;
    companyName: string;
    contactPerson: string;
  };
  assignedTo?: {
    name: string;
  } | null;
}

interface Pagination {
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
}

interface DashboardSummary {
  pending: number;
  overdue: number;
  today: number;
  upcoming: number;
  completed: number;
}

interface FollowUpResponse {
  success: boolean;
  followUps: FollowUpItem[];
  pagination: Pagination;
  message?: string;
}

interface DashboardResponse {
  success: boolean;
  summary: DashboardSummary;
  message?: string;
}

function statusBadge(
  status: FollowUpStatus,
) {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-700";
    case "PENDING":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function priorityBadge(
  priority: FollowUpPriority,
) {
  switch (priority) {
    case "URGENT":
      return "bg-red-100 text-red-700";
    case "HIGH":
      return "bg-orange-100 text-orange-700";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function formatDateTime(
  value: string | Date,
) {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function isOverdue(
  item: FollowUpItem,
) {
  return (
    item.status === "PENDING" &&
    new Date(item.scheduledAt) < new Date()
  );
}

function activeQuickFilter(
  overdueOnly: boolean,
  status: string,
  priority: string,
) {
  if (overdueOnly) {
    return "overdue";
  }

  if (status === "PENDING" && !priority) {
    return "pending";
  }

  if (priority === "HIGH" && !status) {
    return "high";
  }

  if (!status && !priority) {
    return "all";
  }

  return "";
}

function DashboardCard({
  title,
  value,
  description,
}: {
  title: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="text-sm text-gray-500">
        {title}
      </div>

      <div className="mt-2 text-3xl font-bold text-slate-900">
        {value}
      </div>

      <div className="mt-2 text-xs text-gray-500">
        {description}
      </div>
    </div>
  );
}

export default function WorkspaceFollowUpsPage() {
  const searchParams = useSearchParams();
  const inquiryId = searchParams.get("inquiryId") || undefined;
  const inquiryLabel = searchParams.get("inquiryLabel") || undefined;

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [priority, setPriority] =
    useState("");

  const [overdueOnly, setOverdueOnly] =
    useState(false);

  const [page, setPage] =
    useState(1);

  const limit = 10;

  const [followUps, setFollowUps] =
    useState<FollowUpItem[]>([]);

  const [pagination, setPagination] =
    useState<Pagination>({
      page: 1,
      limit,
      totalRecords: 0,
      totalPages: 1,
    });

  const [summary, setSummary] =
    useState<DashboardSummary>({
      pending: 0,
      overdue: 0,
      today: 0,
      upcoming: 0,
      completed: 0,
    });

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadData();
  }, [
    page,
    status,
    priority,
    overdueOnly,
  ]);

  useEffect(() => {
    const timer =
      setTimeout(() => {
        setPage(1);
        loadData(1);
      }, 400);

    return () =>
      clearTimeout(timer);
  }, [search]);

  async function loadData(
    currentPage = page,
  ) {
    try {
      setLoading(true);
      setError("");

      const effectiveStatus =
        overdueOnly ? "PENDING" : status;

      const buildParams = (
        requestedPage: number,
      ) => {
        const params =
          new URLSearchParams();

        params.set(
          "page",
          requestedPage.toString(),
        );

        params.set(
          "limit",
          limit.toString(),
        );

        if (search) {
          params.set(
            "search",
            search,
          );
        }

        if (effectiveStatus) {
          params.set(
            "status",
            effectiveStatus,
          );
        }

        if (priority) {
          params.set(
            "priority",
            priority,
          );
        }

        return params;
      };

      const [
        listResponse,
        dashboardResponse,
      ] = await Promise.all([
        fetch(
          `/api/workspace/followups?${buildParams(
            currentPage,
          ).toString()}`,
        ),
        fetch(
          "/api/workspace/followups/dashboard",
        ),
      ]);

      const list =
        (await listResponse.json()) as FollowUpResponse;

      const dashboard =
        (await dashboardResponse.json()) as DashboardResponse;

      if (
        !listResponse.ok ||
        !list.success
      ) {
        throw new Error(
          list.message ??
            "Unable to load FollowUps.",
        );
      }

      if (overdueOnly) {
        /*
         * The dashboard defines overdue as PENDING FollowUps
         * whose scheduledAt is before the current time.
         * The list API does not expose an overdue filter, so
         * retrieve all matching PENDING pages and filter them
         * here before applying the local page.
         */
        const allPending =
          [...(list.followUps ?? [])];

        const pendingTotalPages =
          list.pagination?.totalPages ?? 1;

        for (
          let requestedPage = 2;
          requestedPage <= pendingTotalPages;
          requestedPage += 1
        ) {
          const response =
            await fetch(
              `/api/workspace/followups?${buildParams(
                requestedPage,
              ).toString()}`,
            );

          const pageResult =
            (await response.json()) as FollowUpResponse;

          if (
            !response.ok ||
            !pageResult.success
          ) {
            throw new Error(
              pageResult.message ??
                "Unable to load overdue FollowUps.",
            );
          }

          allPending.push(
            ...(pageResult.followUps ?? []),
          );
        }

        const now =
          new Date();

        const overdueFollowUps =
          allPending.filter(
            (item) =>
              item.status === "PENDING" &&
              new Date(
                item.scheduledAt,
              ) < now,
          );

        const totalRecords =
          overdueFollowUps.length;

        const totalPages =
          Math.max(
            1,
            Math.ceil(
              totalRecords / limit,
            ),
          );

        const safePage =
          Math.min(
            currentPage,
            totalPages,
          );

        const startIndex =
          (safePage - 1) * limit;

        setFollowUps(
          overdueFollowUps.slice(
            startIndex,
            startIndex + limit,
          ),
        );

        setPagination({
          page: safePage,
          limit,
          totalRecords,
          totalPages,
        });
      } else {
        setFollowUps(
          list.followUps ?? [],
        );

        setPagination(
          list.pagination,
        );
      }

      if (
        dashboardResponse.ok &&
        dashboard.success
      ) {
        setSummary(
          dashboard.summary,
        );
      }
    } catch (err) {
      console.error(
        "Workspace FollowUps loading error:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load FollowUps.",
      );
    } finally {
      setLoading(false);
    }
  }

  function resetFilters() {
    setSearch("");
    setStatus("");
    setPriority("");
    setOverdueOnly(false);
    setPage(1);
  }

  function applyQuickFilter(
    nextStatus?: string,
    nextPriority?: string,
  ) {
    setOverdueOnly(false);
    setStatus(
      nextStatus ?? "",
    );
    setPriority(
      nextPriority ?? "",
    );
    setPage(1);
  }

  const quickFilter = activeQuickFilter(
    overdueOnly,
    status,
    priority,
  );

  const hasFilters =
    Boolean(search) ||
    Boolean(status) ||
    Boolean(priority) ||
    overdueOnly;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            FollowUp Center
          </h1>

          <p className="mt-1 text-gray-500">
            Manage and track buyer follow-up activities
            for your business.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
        >
          + Create FollowUp
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <DashboardCard
          title="Total FollowUps"
          value={pagination.totalRecords}
          description="All follow-up activities"
        />

        <DashboardCard
          title="Pending"
          value={summary.pending}
          description="Needs attention"
        />

        <DashboardCard
          title="Overdue"
          value={summary.overdue}
          description="Past due date"
        />

        <DashboardCard
          title="Due Today"
          value={summary.today}
          description="Requires action today"
        />

        <DashboardCard
          title="Completed"
          value={summary.completed}
          description="Successfully closed"
        />
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              applyQuickFilter()
            }
            className={`rounded-full border px-4 py-2 text-sm font-medium ${
              quickFilter === "all"
                ? "border-slate-400 bg-slate-100 text-slate-900"
                : "hover:bg-gray-50"
            }`}
          >
            All
          </button>

          <button
            type="button"
            onClick={() =>
              applyQuickFilter(
                "PENDING",
              )
            }
            className={`rounded-full border px-4 py-2 text-sm font-medium ${
              quickFilter === "pending"
                ? "border-blue-300 bg-blue-100 text-blue-800"
                : "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
            }`}
          >
            ⚡ Pending
          </button>

          <button
            type="button"
            onClick={() => {
              setOverdueOnly(true);
              setStatus("PENDING");
              setPriority("");
              setPage(1);
            }}
            className={`rounded-full border px-4 py-2 text-sm font-medium ${
              overdueOnly
                ? "border-red-300 bg-red-100 text-red-800"
                : "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
            }`}
            title="Shows only pending FollowUps whose scheduled time has passed."
          >
            🔥 Overdue
          </button>

          <button
            type="button"
            onClick={() =>
              applyQuickFilter(
                undefined,
                "HIGH",
              )
            }
            className={`rounded-full border px-4 py-2 text-sm font-medium ${
              quickFilter === "high"
                ? "border-orange-300 bg-orange-100 text-orange-800"
                : "border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100"
            }`}
          >
            ⭐ High Priority
          </button>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Smart Filters
            </h2>

            <p className="text-sm text-gray-500">
              Quickly find the FollowUps you want to
              focus on.
            </p>

            {overdueOnly && (
              <p className="mt-2 text-xs font-medium text-red-700">
                Showing pending FollowUps whose scheduled time has passed.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="text-sm text-green-700 hover:underline"
          >
            Reset Filters
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-3 lg:flex-row">
          <div className="relative w-full lg:max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search title, company..."
              className="w-full rounded-md border py-2 pl-10 pr-4 outline-none focus:border-green-600"
            />
          </div>

          <select
            value={status}
            onChange={(event) => {
              setOverdueOnly(false);
              setStatus(
                event.target.value,
              );
              setPage(1);
            }}
            className="rounded-md border px-4 py-2 outline-none focus:border-green-600"
          >
            <option value="">
              All Status
            </option>

            {Object.values(
              FollowUpStatus,
            ).map((item) => (
              <option
                key={item}
                value={item}
              >
                {item.replaceAll(
                  "_",
                  " ",
                )}
              </option>
            ))}
          </select>

          <select
            value={priority}
            onChange={(event) => {
              setOverdueOnly(false);
              setPriority(
                event.target.value,
              );
              setPage(1);
            }}
            className="rounded-md border px-4 py-2 outline-none focus:border-green-600"
          >
            <option value="">
              All Priority
            </option>

            {Object.values(
              FollowUpPriority,
            ).map((item) => (
              <option
                key={item}
                value={item}
              >
                {item.replaceAll(
                  "_",
                  " ",
                )}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!loading && !error && followUps.length > 0 && (
        <div className="flex flex-col gap-2 rounded-lg border bg-white px-4 py-3 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
          <div>
            Showing{" "}
            <span className="font-semibold text-slate-900">
              {pagination.totalRecords}
            </span>{" "}
            FollowUp{pagination.totalRecords === 1 ? "" : "s"}
            {overdueOnly && (
              <span className="ml-1 font-medium text-red-700">
                · Overdue only
              </span>
            )}
          </div>

          <div className="text-xs text-gray-500">
            Page {pagination.page} of {pagination.totalPages}
          </div>
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border bg-white p-12 text-center text-gray-500">
          Loading FollowUps...
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <h2 className="font-semibold text-red-700">
            Unable to load FollowUps
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              loadData()
            }
            className="mt-4 rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
          >
            Retry
          </button>
        </div>
      ) : followUps.length === 0 ? (
        <div className="rounded-xl border bg-white p-12 text-center">
          <h2 className="text-lg font-semibold text-slate-900">
            {hasFilters
              ? "No FollowUps match your filters"
              : "No FollowUps found"}
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {hasFilters
              ? "Try adjusting the search or filters, or reset them to see all FollowUps."
              : "Create your first FollowUp to start tracking buyer actions."}
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {hasFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
              >
                Reset Filters
              </button>
            )}

            {!hasFilters && (
              <button
                type="button"
                onClick={() => setCreateModalOpen(true)}
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                + Create FollowUp
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-4 lg:hidden">
            {followUps.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border bg-white p-5 shadow-sm"
              >
                <div className="text-xs uppercase tracking-wide text-gray-400">
                  Buyer
                </div>

                <div className="mt-1 text-lg font-semibold text-slate-900">
                  {item.inquiry.companyName}
                </div>

                <div className="mt-4 text-xs uppercase tracking-wide text-gray-400">
                  FollowUp
                </div>

                <div className="mt-1 font-medium text-slate-800">
                  {item.title}
                </div>

                <div className="mt-4 text-sm text-gray-600">
                  Next Action:{" "}
                  <span className="font-medium text-slate-900">
                    {item.actionType}
                  </span>
                </div>

                <div className="mt-2 text-sm text-gray-600">
                  Scheduled:{" "}
                  <span
                    className={`font-medium ${
                      isOverdue(item)
                        ? "text-red-700"
                        : "text-slate-900"
                    }`}
                  >
                    {formatDateTime(item.scheduledAt)}
                  </span>
                </div>

                {isOverdue(item) && (
                  <div className="mt-2 text-xs font-semibold text-red-700">
                    Overdue
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(
                      item.status,
                    )}`}
                  >
                    {item.status}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityBadge(
                      item.priority,
                    )}`}
                  >
                    {item.priority}
                  </span>
                </div>

                <Link
                  href={`/app/workspace/followups/${item.id}`}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium hover:bg-gray-50"
                >
                  <Eye size={16} />
                  Open FollowUp
                </Link>
              </div>
            ))}
          </div>

          <div className="hidden overflow-hidden rounded-xl border bg-white shadow-sm lg:block">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-5 py-3 text-left font-semibold">
                      FollowUp
                    </th>
                    <th className="px-5 py-3 text-left font-semibold">
                      Buyer
                    </th>
                    <th className="px-5 py-3 text-left font-semibold">
                      Action
                    </th>
                    <th className="px-5 py-3 text-left font-semibold">
                      Category
                    </th>
                    <th className="px-5 py-3 text-left font-semibold">
                      Scheduled
                    </th>
                    <th className="px-5 py-3 text-left font-semibold">
                      Status
                    </th>
                    <th className="px-5 py-3 text-left font-semibold">
                      Priority
                    </th>
                    <th className="px-5 py-3 text-center font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {followUps.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="px-5 py-4 font-medium">
                        {item.title}
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-medium">
                          {item.inquiry.companyName}
                        </div>

                        <div className="text-xs text-gray-500">
                          {item.inquiry.inquiryNumber}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        {item.actionType}
                      </td>

                      <td className="px-5 py-4">
                        {item.category}
                      </td>

                      <td className="px-5 py-4">
                        <div
                          className={
                            isOverdue(item)
                              ? "font-medium text-red-700"
                              : "text-slate-700"
                          }
                        >
                          {formatDateTime(item.scheduledAt)}
                        </div>
                        {isOverdue(item) && (
                          <div className="mt-1 text-xs font-semibold text-red-700">
                            Overdue
                          </div>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(
                            item.status,
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityBadge(
                            item.priority,
                          )}`}
                        >
                          {item.priority}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <Link
                          href={`/app/workspace/followups/${item.id}`}
                          className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-gray-100"
                        >
                          <Eye size={16} />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-xl border bg-white px-6 py-4 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-gray-600">
              Showing page{" "}
              <span className="font-semibold">
                {pagination.page}
              </span>{" "}
              of{" "}
              <span className="font-semibold">
                {pagination.totalPages}
              </span>{" "}
              ({pagination.totalRecords} records)
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={
                  page <= 1
                }
                onClick={() =>
                  setPage((prev) =>
                    Math.max(
                      prev - 1,
                      1,
                    ),
                  )
                }
                className="rounded-md border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              <button
                type="button"
                disabled={
                  page >=
                  pagination.totalPages
                }
                onClick={() =>
                  setPage((prev) =>
                    Math.min(
                      prev + 1,
                      pagination.totalPages,
                    ),
                  )
                }
                className="rounded-md border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      <CreateFollowUpModal
        open={createModalOpen}
        inquiryId={inquiryId}
        inquiryLabel={inquiryLabel}
        onClose={() => setCreateModalOpen(false)}
        onCreated={() => {
          setCreateModalOpen(false);
          loadData(1);
          setPage(1);
        }}
      />
    </div>
  );
}
