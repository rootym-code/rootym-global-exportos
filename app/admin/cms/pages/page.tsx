/**
 * ============================================================
 * ROOTYM Global Export Platform
 * ============================================================
 * Module      : CMS
 * Feature     : Pages
 * File        : app/admin/cms/pages/page.tsx
 * Purpose     : CMS Page Management
 * Sprint      : Sprint 10.1
 * ============================================================
 */

"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import Link from "next/link";

import {
  AlertCircle,
  CheckCircle2,
  Eye,
  FileText,
  Filter,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";

/* ============================================================
   Types
============================================================ */

interface CmsPageDto {
  id: string;

  title: string;

  slug: string;

  excerpt: string | null;

  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";

  template: string | null;

  featuredImageId: string | null;

  seoTitle: string | null;

  seoDescription: string | null;

  createdAt: string;

  updatedAt: string;

  publishedAt: string | null;
}

interface Pagination {
  page: number;

  limit: number;

  total: number;

  totalPages: number;
}

interface PageListResponse {
  success: boolean;

  message?: string;

  data: CmsPageDto[];

  pagination: Pagination;
}

/* ============================================================
   Constants
============================================================ */

const PAGE_SIZE = 20;

const PAGE_STATUS = [
  "ALL",
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
] as const;

type StatusFilter = (typeof PAGE_STATUS)[number];

/* ============================================================
   Helpers
============================================================ */

function formatDate(value?: string | null) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function statusClasses(status: CmsPageDto["status"]) {
  switch (status) {
    case "PUBLISHED":
      return "bg-green-100 text-green-700";

    case "DRAFT":
      return "bg-amber-100 text-amber-700";

    case "ARCHIVED":
      return "bg-slate-200 text-slate-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

function statusIcon(status: CmsPageDto["status"]) {
  switch (status) {
    case "PUBLISHED":
      return CheckCircle2;

    case "DRAFT":
      return Pencil;

    case "ARCHIVED":
      return XCircle;

    default:
      return FileText;
  }
}

/* ============================================================
   Component
============================================================ */

export default function CmsPagesPage() {
  /* ============================================================
     State
  ============================================================ */

  const [items, setItems] =
    useState<CmsPageDto[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [pagination, setPagination] =
    useState<Pagination>({
      page: 1,
      limit: PAGE_SIZE,
      total: 0,
      totalPages: 1,
    });

  /* ============================================================
     Filters
  ============================================================ */

  const [searchInput, setSearchInput] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState<StatusFilter>("ALL");

  const debounceTimer =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

  /* ============================================================
     Debounced Search
  ============================================================ */

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 500);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchInput]);
    /* ============================================================
     Load Pages
  ============================================================ */

  const loadPages = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      params.set("page", page.toString());
      params.set("limit", PAGE_SIZE.toString());

      if (search) {
        params.set("search", search);
      }

      if (status !== "ALL") {
        params.set("status", status);
      }

      const response = await fetch(
        `/api/admin/cms/pages?${params.toString()}`,
        {
          cache: "no-store",
          credentials: "include",
        }
      );

      const result: PageListResponse =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ??
            "Unable to load CMS pages."
        );
      }

      setItems(result.data);

      setPagination(result.pagination);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    loadPages();
  }, [loadPages]);

  /* ============================================================
     Dashboard Statistics
  ============================================================ */

  const statistics = useMemo(() => {
    const published = items.filter(
      (item) => item.status === "PUBLISHED"
    ).length;

    const drafts = items.filter(
      (item) => item.status === "DRAFT"
    ).length;

    const archived = items.filter(
      (item) => item.status === "ARCHIVED"
    ).length;

    return {
      total: pagination.total,
      published,
      drafts,
      archived,
    };
  }, [items, pagination.total]);

  /* ============================================================
     Render
  ============================================================ */

  return (
    <div className="space-y-8">
      {/* ============================================================
          Header
      ============================================================ */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            CMS Pages
          </h1>

          <p className="mt-2 text-slate-500">
            Create, publish and manage website pages
            from the ROOTYM CMS.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={loadPages}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                loading ? "animate-spin" : ""
              }`}
            />

            Refresh
          </button>

          <Link
            href="/admin/cms/pages/create"
            className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-green-800"
          >
            <Plus className="h-4 w-4" />

            New Page
          </Link>
        </div>
      </div>

      {/* ============================================================
          Statistics
      ============================================================ */}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Total Pages
            </span>

            <FileText className="h-6 w-6 text-green-700" />
          </div>

          <p className="mt-4 text-3xl font-bold text-slate-900">
            {statistics.total}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            All CMS pages
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Published
            </span>

            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>

          <p className="mt-4 text-3xl font-bold text-slate-900">
            {statistics.published}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            Visible on website
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Drafts
            </span>

            <Pencil className="h-6 w-6 text-amber-600" />
          </div>

          <p className="mt-4 text-3xl font-bold text-slate-900">
            {statistics.drafts}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            Not yet published
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Archived
            </span>

            <Trash2 className="h-6 w-6 text-slate-600" />
          </div>

          <p className="mt-4 text-3xl font-bold text-slate-900">
            {statistics.archived}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            Archived pages
          </p>
        </div>
      </div>
            {/* ============================================================
          Filters
      ============================================================ */}

<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-12">
          {/* Search */}

          <div className="relative lg:col-span-8">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={searchInput}
              onChange={(event) =>
                setSearchInput(event.target.value)
              }
              placeholder="Search title, slug or SEO title..."
              className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none transition focus:border-green-700"
            />
          </div>

          {/* Status */}

          <div className="relative lg:col-span-3">
            <Filter className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <select
              value={status}
              onChange={(event) => {
                setPage(1);
                setStatus(
                  event.target.value as StatusFilter
                );
              }}
              className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 outline-none transition focus:border-green-700"
            >
              {PAGE_STATUS.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Apply */}

          <button
            type="button"
            onClick={loadPages}
            disabled={loading}
            className="rounded-xl bg-green-700 px-5 py-3 font-medium text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Apply
          </button>
        </div>
      </div>

      {/* ============================================================
          Error
      ============================================================ */}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-red-600" />

            <div>
              <h3 className="font-semibold text-red-700">
                Unable to load CMS pages
              </h3>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          Loading
      ============================================================ */}

      {loading ? (
        <div className="flex h-96 items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-green-700" />

            <p className="text-sm text-slate-500">
              Loading CMS pages...
            </p>
          </div>
        </div>
      ) : items.length === 0 ? (
        /* ============================================================
            Empty State
        ============================================================ */

        <div className="rounded-2xl border border-slate-200 bg-white py-24 text-center shadow-sm">
          <FileText className="mx-auto h-16 w-16 text-slate-300" />

          <h2 className="mt-6 text-2xl font-semibold text-slate-800">
            No Pages Found
          </h2>

          <p className="mt-2 text-slate-500">
            No CMS pages matched your current filters.
          </p>

          <Link
            href="/admin/cms/pages/create"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-green-700 px-6 py-3 text-white transition hover:bg-green-800"
          >
            <Plus className="h-4 w-4" />

            Create First Page
          </Link>
        </div>
      ) : (
                /* ============================================================
            Pages Table
        ============================================================ */

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Page
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Template
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Published
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white">
                {items.map((item) => {
                  const StatusIcon = statusIcon(item.status);

                  return (
                    <tr
                      key={item.id}
                      className="transition hover:bg-slate-50"
                    >
                      {/* ====================================================
                          Page Details
                      ==================================================== */}

                      <td className="px-6 py-5 align-top">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-slate-900">
                            {item.title}
                          </h3>

                          <p className="text-sm text-slate-500">
                            /{item.slug}
                          </p>

                          {item.excerpt && (
                            <p className="line-clamp-2 max-w-xl text-sm text-slate-600">
                              {item.excerpt}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* ====================================================
                          Status
                      ==================================================== */}

                      <td className="px-6 py-5 align-top">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(
                            item.status
                          )}`}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />

                          {item.status}
                        </span>
                      </td>

                      {/* ====================================================
                          Template
                      ==================================================== */}

                      <td className="px-6 py-5 align-top">
                        <span className="text-sm text-slate-700">
                          {item.template ?? "-"}
                        </span>
                      </td>

                      {/* ====================================================
                          Published
                      ==================================================== */}

                      <td className="px-6 py-5 align-top">
                        <span className="text-sm text-slate-700">
                          {formatDate(item.publishedAt)}
                        </span>
                      </td>

                      {/* ====================================================
                          Actions
                      ==================================================== */}

                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/cms/pages/${item.id}`}
                            className="rounded-lg border border-slate-300 p-2 text-slate-600 transition hover:bg-slate-100"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>

                          <Link
                            href={`/admin/cms/pages/${item.id}/edit`}
                            className="rounded-lg border border-slate-300 p-2 text-slate-600 transition hover:bg-slate-100"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>

                          <button
                            type="button"
                            disabled
                            title="Delete workflow will be implemented in a later sprint."
                            className="cursor-not-allowed rounded-lg border border-red-200 p-2 text-red-500 opacity-60"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
            {/* ============================================================
          Footer
      ============================================================ */}

<div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="text-sm text-slate-600">
          Showing{" "}
          <span className="font-semibold">
            {items.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold">
            {pagination.total}
          </span>{" "}
          CMS pages
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() =>
              setPage((current) => Math.max(1, current - 1))
            }
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          <div className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
            Page {pagination.page} of {pagination.totalPages}
          </div>

          <button
            type="button"
            disabled={
              page >= pagination.totalPages || loading
            }
            onClick={() =>
              setPage((current) =>
                Math.min(
                  pagination.totalPages,
                  current + 1
                )
              )
            }
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

 
