/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the authenticated All Pages workspace
 *          for managing tenant-owned CMS pages through the
 *          existing Website-scoped CMS service.
 * ============================================================
 */

import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileText,
  Filter,
  LayoutDashboard,
  LockKeyhole,
  PenLine,
  Plus,
  Search,
  Settings,
} from "lucide-react";

import { CmsPageStatus } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";
import cmsPageService from "@/lib/services/cms/page.service";

import { requireWorkspaceAccess } from "@/app/lib/workspace/require-workspace-access";
import PageBulkSelection from "@/app/app/workspace/website/pages/all/PageBulkSelection";

type SearchParams = {
  search?: string;
  status?: string;
  page?: string;
};

const PAGE_SIZE = 10;

function normalizePageNumber(value?: string) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }

  return Math.floor(parsed);
}

function normalizeStatus(value?: string) {
  if (
    value === CmsPageStatus.DRAFT ||
    value === CmsPageStatus.PUBLISHED ||
    value === CmsPageStatus.ARCHIVED
  ) {
    return value;
  }

  return undefined;
}

function getStatusLabel(status: CmsPageStatus) {
  switch (status) {
    case CmsPageStatus.PUBLISHED:
      return "Published";

    case CmsPageStatus.ARCHIVED:
      return "Archived";

    case CmsPageStatus.DRAFT:
    default:
      return "Draft";
  }
}

function getStatusClassName(status: CmsPageStatus) {
  switch (status) {
    case CmsPageStatus.PUBLISHED:
      return "bg-emerald-50 text-emerald-700 ring-emerald-100";

    case CmsPageStatus.ARCHIVED:
      return "bg-slate-100 text-slate-600 ring-slate-200";

    case CmsPageStatus.DRAFT:
    default:
      return "bg-amber-50 text-amber-700 ring-amber-100";
  }
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

function createPageUrl(
  page: number,
  search: string,
  status?: CmsPageStatus,
) {
  const params = new URLSearchParams();

  if (search) {
    params.set("search", search);
  }

  if (status) {
    params.set("status", status);
  }

  params.set("page", String(page));

  return `/app/workspace/website/pages/all?${params.toString()}`;
}

export default async function AllWebsitePagesPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const { tenant } = await requireWorkspaceAccess();

  const params = await searchParams;

  const search = params?.search?.trim() ?? "";
  const status = normalizeStatus(params?.status);
  const requestedPage = normalizePageNumber(params?.page);

  const website = await prisma.website.findUnique({
    where: {
      tenantId: tenant.id,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      isActive: true,
    },
  });

  if (!website || !website.isActive) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-10">
          <header className="mb-8">
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950">
                  <FileText className="h-5 w-5 text-white" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                    ROOTYM
                  </p>

                  <p className="text-lg font-bold">
                    All Pages
                  </p>
                </div>
              </div>

              <Link
                href="/app/workspace/website/pages"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Pages & Content
              </Link>
            </div>
          </header>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
              <LockKeyhole className="h-7 w-7 text-slate-500" />
            </div>

            <h1 className="mt-6 text-2xl font-bold">
              Website environment is not available
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
              Your customer Website environment is not currently
              connected. Page management will become available when
              the Website environment is ready.
            </p>

            <Link
              href="/app/workspace/website/pages"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Pages & Content
            </Link>
          </section>
        </div>
      </main>
    );
  }

  const result = await cmsPageService.list(
    website.id,
    {
      search: search || undefined,
      status,
    },
    {
      page: requestedPage,
      limit: PAGE_SIZE,
    },
  );

  const totalPages = Math.max(result.totalPages, 1);

  const currentPage =
    requestedPage > totalPages
      ? totalPages
      : requestedPage;

  let pageResult = result;

  if (currentPage !== requestedPage) {
    pageResult = await cmsPageService.list(
      website.id,
      {
        search: search || undefined,
        status,
      },
      {
        page: currentPage,
        limit: PAGE_SIZE,
      },
    );
  }

  const pages = pageResult.data;

  const total = pageResult.total;
  const pageLimit = pageResult.limit;

  const start =
    total === 0
      ? 0
      : (currentPage - 1) * pageLimit + 1;

  const end =
    total === 0
      ? 0
      : Math.min(
          currentPage * pageLimit,
          total,
        );

  const hasPreviousPage = currentPage > 1;
  const hasNextPage =
    currentPage < pageResult.totalPages;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-10">
        {/* =====================================================
            TOP NAVIGATION
            ===================================================== */}

        <header className="mb-8">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950">
                <FileText className="h-5 w-5 text-white" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                  ROOTYM
                </p>

                <p className="text-lg font-bold">
                  All Pages
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/app/workspace/website/pages"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Pages & Content
              </Link>

              <Link
                href="/app/workspace/website"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                Website & Marketing
              </Link>

              <Link
                href="/app/workspace"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <LayoutDashboard className="h-4 w-4" />
                Workspace
              </Link>

              <Link
                href="/settings"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </div>
          </div>
        </header>

        {/* =====================================================
            MODULE HEADER
            ===================================================== */}

        <section className="rounded-3xl bg-slate-950 p-7 text-white shadow-sm sm:p-9">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-400">
                <FileText className="h-4 w-4" />
                Website & Marketing
              </div>

              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                All Pages
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                View the CMS pages belonging to your customer
                website. Search, filter and review the current
                content state without leaving the tenant workspace.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/app/workspace/website/pages/create"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-slate-100"
              >
                <Plus className="h-4 w-4" />
                Create New Page
              </Link>

              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/10">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Website Connected
              </div>

              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300 ring-1 ring-emerald-400/20">
                <FileText className="h-4 w-4" />
                {total} {total === 1 ? "Page" : "Pages"}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            WEBSITE CONTEXT
            ===================================================== */}

        <section className="mt-8">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                  Website
                </p>

                <h2 className="mt-2 text-xl font-bold">
                  {website.name}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {website.slug}
                </p>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Tenant Website
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            SEARCH & FILTERS
            ===================================================== */}

        <section className="mt-8">
          <form
            method="GET"
            className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-7"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end">
              <div className="flex-1">
                <label
                  htmlFor="search"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Search pages
                </label>

                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    id="search"
                    name="search"
                    type="search"
                    defaultValue={search}
                    placeholder="Search by page title or slug..."
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
                  />
                </div>
              </div>

              <div className="w-full lg:w-64">
                <label
                  htmlFor="status"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Status
                </label>

                <div className="relative">
                  <Filter className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <select
                    id="status"
                    name="status"
                    defaultValue={status ?? ""}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
                  >
                    <option value="">
                      All Statuses
                    </option>

                    <option value={CmsPageStatus.PUBLISHED}>
                      Published
                    </option>

                    <option value={CmsPageStatus.DRAFT}>
                      Draft
                    </option>

                    <option value={CmsPageStatus.ARCHIVED}>
                      Archived
                    </option>
                  </select>
                </div>
              </div>

              <input
                type="hidden"
                name="page"
                value="1"
              />

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <Search className="h-4 w-4" />
                Search
              </button>

              {(search || status) && (
                <Link
                  href="/app/workspace/website/pages/all"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Clear
                </Link>
              )}
            </div>
          </form>
        </section>

        {/* =====================================================
            PAGE LIST
            ===================================================== */}

        <section className="mt-8">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
                CMS Pages
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight">
                Website content
              </h2>
            </div>

            <div className="text-sm text-slate-500">
              {total === 0
                ? "No pages found"
                : `Showing ${start}–${end} of ${total}`}
            </div>
          </div>

          {pages.length > 0 && <PageBulkSelection />}

          <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
            {pages.length === 0 ? (
              <div className="px-6 py-16 text-center sm:px-10">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                  <FileText className="h-7 w-7 text-slate-400" />
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  No pages found
                </h3>

                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
                  {search || status
                    ? "No CMS pages match the current search and status filters."
                    : "This Website does not have any CMS pages yet."}
                </p>

                {(search || status) && (
                  <Link
                    href="/app/workspace/website/pages/all"
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Clear Filters
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            ) : (
              <>
                <div className="hidden border-b border-slate-200 bg-slate-50 px-6 py-4 md:grid md:grid-cols-[auto_minmax(0,2fr)_minmax(140px,1fr)_minmax(150px,1fr)_auto] md:items-center md:gap-5">
                  <div aria-hidden="true" />
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Page
                  </p>

                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </p>

                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Last Updated
                  </p>

                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Action
                  </p>
                </div>

                <div className="divide-y divide-slate-100">
                  {pages.map((page) => {
                    const primaryTranslation =
                      page.translations[0];

                    const languages =
                      page.translations
                        .map(
                          (translation) =>
                            translation.language.name,
                        )
                        .filter(Boolean);

                    return (
                      <div
                        key={page.id}
                        data-page-row={page.id}
                        className="px-6 py-6 transition hover:bg-slate-50/70"
                      >
                        <div className="grid gap-5 md:grid-cols-[auto_minmax(0,2fr)_minmax(140px,1fr)_minmax(150px,1fr)_auto] md:items-center">
                          <div className="flex items-start pt-1">
                            <input
                              type="checkbox"
                              data-page-select
                              value={page.id}
                              aria-label={`Select ${page.title}`}
                              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-start gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 ring-1 ring-emerald-100">
                                <FileText className="h-5 w-5 text-emerald-600" />
                              </div>

                              <div className="min-w-0">
                                <h3 className="truncate text-base font-bold text-slate-900">
                                  {page.title}
                                </h3>

                                <p className="mt-1 truncate text-sm text-slate-500">
                                  /{page.slug}
                                </p>

                                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                                  {page.isHomePage && (
                                    <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-600">
                                      Homepage
                                    </span>
                                  )}

                                  {page.showInMenu && (
                                    <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-600">
                                      Menu
                                    </span>
                                  )}

                                  {languages.length > 0 && (
                                    <span>
                                      {languages.join(", ")}
                                    </span>
                                  )}

                                  {primaryTranslation && (
                                    <span className="hidden lg:inline">
                                      · {primaryTranslation.title}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <span
                              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${getStatusClassName(
                                page.status,
                              )}`}
                            >
                              {page.status ===
                              CmsPageStatus.PUBLISHED ? (
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              ) : page.status ===
                                CmsPageStatus.ARCHIVED ? (
                                <LockKeyhole className="h-3.5 w-3.5" />
                              ) : (
                                <Clock3 className="h-3.5 w-3.5" />
                              )}

                              {getStatusLabel(page.status)}
                            </span>
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-slate-700">
                              {formatDate(page.updatedAt)}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              Last modified
                            </p>
                          </div>

                          <div>
                            <Link
                              href={`/app/workspace/website/pages/${page.id}/edit`}
                              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                            >
                              <PenLine className="h-4 w-4" />
                              Edit
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </section>

        {/* =====================================================
            PAGINATION
            ===================================================== */}

        {pageResult.totalPages > 1 && (
          <section className="mt-6">
            <div className="flex flex-col gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                Page{" "}
                <span className="font-semibold text-slate-700">
                  {currentPage}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-700">
                  {pageResult.totalPages}
                </span>
              </p>

              <div className="flex items-center gap-2">
                {hasPreviousPage ? (
                  <Link
                    href={createPageUrl(
                      currentPage - 1,
                      search,
                      status,
                    )}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Link>
                ) : (
                  <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-300">
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </span>
                )}

                {hasNextPage ? (
                  <Link
                    href={createPageUrl(
                      currentPage + 1,
                      search,
                      status,
                    )}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-300">
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </span>
                )}
              </div>
            </div>
          </section>
        )}

        {/* =====================================================
            FOOTER
            ===================================================== */}

        <footer className="mt-10 border-t border-slate-200 pt-6">
          <div className="flex flex-col gap-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="font-semibold text-slate-700">
                ROOTYM All Pages
              </span>

              <span className="ml-2">
                · {website.name}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-5">
              <Link
                href="/app/workspace/website/pages"
                className="inline-flex items-center gap-1.5 transition hover:text-slate-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Pages & Content
              </Link>

              <Link
                href="/app/workspace"
                className="inline-flex items-center gap-1.5 transition hover:text-slate-900"
              >
                <LayoutDashboard className="h-4 w-4" />
                Workspace
              </Link>

              <Link
                href="/settings"
                className="inline-flex items-center gap-1.5 transition hover:text-slate-900"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
