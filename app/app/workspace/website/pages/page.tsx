/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides a focused Pages & Content entry point for
 *          managing customer website pages without duplicating
 *          website health, business connectivity or navigation.
 * ============================================================
 */

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  PenLine,
  Plus,
} from "lucide-react";

import {
  getWebsitePagesOverview,
} from "@/app/lib/workspace/website/website-pages.service";

export default async function WebsitePagesPage() {
  const overview = await getWebsitePagesOverview();

  const contentSummary = overview.contentSummary;
  const totalPages = contentSummary.total;
  const publishedPages = contentSummary.published;
  const draftPages = contentSummary.draft;
  const archivedPages = contentSummary.archived;

  return (
    <main className="min-h-full bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8 lg:py-10">
        {/* =====================================================
            PAGE HEADER
            ===================================================== */}
        <header className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950">
              <FileText className="h-5 w-5 text-white" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                Website
              </p>

              <h1 className="text-2xl font-bold tracking-tight">
                Pages &amp; Content
              </h1>
            </div>
          </div>
        </header>

        {/* =====================================================
            HERO
            ===================================================== */}
        <section className="rounded-3xl bg-slate-950 p-7 text-white shadow-sm sm:p-9">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-400">
                <FileText className="h-4 w-4" />
                Website Content
              </div>

              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Manage your website pages
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Create, edit and manage the pages that make up your customer
                website.
              </p>
            </div>

            <Link
              href="/app/workspace/website/pages/all"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              View All Pages
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* =====================================================
            PRIMARY ACTIONS
            ===================================================== */}
        <section className="mt-8">
          <div className="grid gap-5 md:grid-cols-2">
            <Link
              href="/app/workspace/website/pages/all"
              className="group rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-100">
                  <FileText className="h-6 w-6 text-emerald-600" />
                </div>

                <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-600" />
              </div>

              <h3 className="mt-6 text-xl font-bold">All Pages</h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Search, filter, edit and manage every page in your website.
              </p>

              <p className="mt-5 text-sm font-semibold text-emerald-700">
                {totalPages} {totalPages === 1 ? "page" : "pages"}
              </p>
            </Link>

            <Link
              href="/app/workspace/website/pages/create"
              className="group rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950">
                  <Plus className="h-6 w-6 text-white" />
                </div>

                <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-600" />
              </div>

              <h3 className="mt-6 text-xl font-bold">Create Page</h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Start a new website page and continue in the Page Editor.
              </p>

              <p className="mt-5 text-sm font-semibold text-slate-700">
                Create a new page
              </p>
            </Link>
          </div>
        </section>

        {/* =====================================================
            CONTENT SUMMARY
            ===================================================== */}
        <section className="mt-8">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
              Content Summary
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              Your website content
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              A quick view of the current page inventory.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Total Pages
              </p>
              <p className="mt-2 text-3xl font-bold tracking-tight">
                {totalPages}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                All website pages
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Published
                </p>
              </div>
              <p className="mt-2 text-3xl font-bold tracking-tight">
                {publishedPages}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Currently published
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-2">
                <PenLine className="h-4 w-4 text-slate-600" />
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Draft
                </p>
              </div>
              <p className="mt-2 text-3xl font-bold tracking-tight">
                {draftPages}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Saved but not published
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Archived
              </p>
              <p className="mt-2 text-3xl font-bold tracking-tight">
                {archivedPages}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Moved out of active content
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            EDITOR GUIDANCE
            ===================================================== */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 ring-1 ring-slate-200">
              <PenLine className="h-5 w-5 text-slate-600" />
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900">
                Page editing
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Select a page from All Pages to open the Page Editor. Page
                content, publishing controls and page-level SEO metadata are
                managed there.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
