"use client";

/**
 * ============================================================
 * ROOTYM Global ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Customer Workspace Inquiry list. Displays the shared
 *          Website-scoped Inquiry records through Workspace APIs
 *          without depending on Admin UI components or routes.
 * ============================================================
 */

import { useEffect, useState } from "react";
import Link from "next/link";

interface InquiryItem {
  id: string;
  inquiryNumber: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string | null;
  country: string;
  product: string;
  quantity: number | null;
  unit: string | null;
  message: string;
  status: string;
  priority: string;
  source: string | null;
  salesStage: string | null;
  createdAt: string;
  updatedAt: string;
  linkedProduct?: {
    id: string;
    name: string;
    sku: string;
  } | null;
}

interface ApiResponse {
  success: boolean;
  inquiries: InquiryItem[];
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalRecords: number;
  };
}

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "NEW", label: "New" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "QUALIFIED", label: "Qualified" },
  { value: "QUOTED", label: "Quoted" },
  { value: "NEGOTIATING", label: "Negotiating" },
  { value: "WON", label: "Won" },
  { value: "LOST", label: "Lost" },
  { value: "CLOSED", label: "Closed" },
];

const PRIORITY_OPTIONS = [
  { value: "", label: "All Priorities" },
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "URGENT", label: "Urgent" },
];

const SALES_STAGE_OPTIONS = [
  { value: "", label: "All Sales Stages" },
  { value: "NEW", label: "New" },
  { value: "QUALIFICATION", label: "Qualification" },
  { value: "PROPOSAL", label: "Proposal" },
  { value: "NEGOTIATION", label: "Negotiation" },
  { value: "CLOSED_WON", label: "Closed Won" },
  { value: "CLOSED_LOST", label: "Closed Lost" },
];

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatStatus(value: string) {
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function statusClasses(status: string) {
  switch (status) {
    case "NEW":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "IN_PROGRESS":
      return "bg-amber-50 text-amber-700 border-amber-200";

    case "QUALIFIED":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";

    case "QUOTED":
      return "bg-purple-50 text-purple-700 border-purple-200";

    case "NEGOTIATING":
      return "bg-orange-50 text-orange-700 border-orange-200";

    case "WON":
      return "bg-green-50 text-green-700 border-green-200";

    case "LOST":
      return "bg-red-50 text-red-700 border-red-200";

    case "CLOSED":
      return "bg-gray-50 text-gray-700 border-gray-200";

    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

function priorityClasses(priority: string) {
  switch (priority) {
    case "URGENT":
      return "bg-red-50 text-red-700 border-red-200";

    case "HIGH":
      return "bg-orange-50 text-orange-700 border-orange-200";

    case "MEDIUM":
      return "bg-amber-50 text-amber-700 border-amber-200";

    case "LOW":
      return "bg-gray-50 text-gray-600 border-gray-200";

    default:
      return "bg-gray-50 text-gray-600 border-gray-200";
  }
}

export default function WorkspaceInquiriesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [salesStage, setSalesStage] = useState("");

  const [page, setPage] = useState(1);
  const [data, setData] = useState<ApiResponse | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadInquiries();
    }, 350);

    return () => window.clearTimeout(timer);
  }, [search, status, priority, salesStage, page]);

  async function loadInquiries() {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      params.set("page", page.toString());
      params.set("pageSize", "20");

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (status) {
        params.set("status", status);
      }

      if (priority) {
        params.set("priority", priority);
      }

      if (salesStage) {
        params.set("salesStage", salesStage);
      }

      const response = await fetch(
        `/api/workspace/inquiries?${params.toString()}`,
        {
          method: "GET",
          cache: "no-store",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error || "Unable to load inquiries.",
        );
      }

      setData(result);
    } catch (err) {
      console.error("Failed to load Workspace inquiries:", err);

      setData(null);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load inquiries.",
      );
    } finally {
      setLoading(false);
    }
  }

  function resetFilters() {
    setSearch("");
    setStatus("");
    setPriority("");
    setSalesStage("");
    setPage(1);
  }

  const inquiries = data?.inquiries ?? [];
  const totalRecords = data?.pagination.totalRecords ?? 0;
  const totalPages = data?.pagination.totalPages ?? 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Inquiries
          </h1>

          <p className="mt-1 text-gray-500">
            Manage buyer inquiries for your business.
          </p>
        </div>

        <Link
          href="/app/workspace/inquiries/new"
          className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          New Inquiry
        </Link>
      </div>

      {/* Filters */}
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[minmax(240px,1fr)_180px_180px_190px_auto]">
          <div>
            <label
              htmlFor="inquiry-search"
              className="sr-only"
            >
              Search inquiries
            </label>

            <input
              id="inquiry-search"
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search inquiries, buyers, email, product..."
              className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
            />
          </div>

          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
            className="rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
            aria-label="Filter by status"
          >
            {STATUS_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={priority}
            onChange={(event) => {
              setPriority(event.target.value);
              setPage(1);
            }}
            className="rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
            aria-label="Filter by priority"
          >
            {PRIORITY_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={salesStage}
            onChange={(event) => {
              setSalesStage(event.target.value);
              setPage(1);
            }}
            className="rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
            aria-label="Filter by sales stage"
          >
            {SALES_STAGE_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={resetFilters}
            disabled={
              !search &&
              !status &&
              !priority &&
              !salesStage
            }
            className="rounded-lg border px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {totalRecords === 0
            ? "No inquiries found"
            : `${totalRecords} ${
                totalRecords === 1
                  ? "inquiry"
                  : "inquiries"
              }`}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="rounded-xl border bg-white p-12 text-center text-sm text-gray-500 shadow-sm">
          Loading inquiries...
        </div>
      )}

      {/* Empty */}
      {!loading && !error && inquiries.length === 0 && (
        <div className="rounded-xl border bg-white p-12 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            No inquiries found
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Try changing your filters or create a new
            inquiry.
          </p>

          <Link
            href="/app/workspace/inquiries/new"
            className="mt-5 inline-flex rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            New Inquiry
          </Link>
        </div>
      )}

      {/* Desktop table */}
      {!loading && !error && inquiries.length > 0 && (
        <>
          <div className="hidden overflow-hidden rounded-xl border bg-white shadow-sm lg:block">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="border-b bg-gray-50">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th className="px-5 py-3">
                      Inquiry
                    </th>

                    <th className="px-5 py-3">
                      Buyer
                    </th>

                    <th className="px-5 py-3">
                      Product
                    </th>

                    <th className="px-5 py-3">
                      Country
                    </th>

                    <th className="px-5 py-3">
                      Status
                    </th>

                    <th className="px-5 py-3">
                      Priority
                    </th>

                    <th className="px-5 py-3">
                      Updated
                    </th>

                    <th className="px-5 py-3 text-right">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {inquiries.map((inquiry) => (
                    <tr
                      key={inquiry.id}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-5 py-4">
                        <Link
                          href={`/app/workspace/inquiries/${inquiry.id}`}
                          className="font-semibold text-gray-900 hover:underline"
                        >
                          {inquiry.inquiryNumber}
                        </Link>

                        <p className="mt-1 text-xs text-gray-500">
                          {formatDate(inquiry.createdAt)}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-900">
                          {inquiry.companyName}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {inquiry.contactPerson}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {inquiry.email}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-800">
                          {inquiry.linkedProduct?.name ||
                            inquiry.product ||
                            "—"}
                        </p>

                        {inquiry.linkedProduct?.sku && (
                          <p className="mt-1 text-xs text-gray-500">
                            SKU:{" "}
                            {inquiry.linkedProduct.sku}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4 text-gray-700">
                        {inquiry.country || "—"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusClasses(
                            inquiry.status,
                          )}`}
                        >
                          {formatStatus(inquiry.status)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${priorityClasses(
                            inquiry.priority,
                          )}`}
                        >
                          {formatStatus(inquiry.priority)}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {formatDate(inquiry.updatedAt)}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/app/workspace/inquiries/${inquiry.id}`}
                          className="font-medium text-gray-900 hover:underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile/tablet cards */}
          <div className="space-y-3 lg:hidden">
            {inquiries.map((inquiry) => (
              <Link
                key={inquiry.id}
                href={`/app/workspace/inquiries/${inquiry.id}`}
                className="block rounded-xl border bg-white p-4 shadow-sm transition hover:bg-gray-50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900">
                      {inquiry.inquiryNumber}
                    </p>

                    <p className="mt-1 truncate text-sm font-medium text-gray-800">
                      {inquiry.companyName}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {inquiry.contactPerson}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium ${statusClasses(
                      inquiry.status,
                    )}`}
                  >
                    {formatStatus(inquiry.status)}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-400">
                      Product
                    </p>

                    <p className="mt-1 truncate text-gray-700">
                      {inquiry.linkedProduct?.name ||
                        inquiry.product ||
                        "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Country
                    </p>

                    <p className="mt-1 text-gray-700">
                      {inquiry.country || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Priority
                    </p>

                    <span
                      className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${priorityClasses(
                        inquiry.priority,
                      )}`}
                    >
                      {formatStatus(inquiry.priority)}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Updated
                    </p>

                    <p className="mt-1 text-gray-700">
                      {formatDate(inquiry.updatedAt)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      {!loading &&
        !error &&
        data &&
        totalPages > 1 && (
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-sm text-gray-500">
              Page {data.pagination.page} of{" "}
              {totalPages}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() =>
                  setPage((current) =>
                    Math.max(1, current - 1),
                  )
                }
                className="rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() =>
                  setPage((current) =>
                    Math.min(
                      totalPages,
                      current + 1,
                    ),
                  )
                }
                className="rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
    </div>
  );
}