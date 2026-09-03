/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the authenticated AI Website Assistance
 *          workspace area for future website content,
 *          optimization and marketing assistance.
 * ============================================================
 */

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  FileText,
  Globe2,
  LayoutDashboard,
  LockKeyhole,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  WandSparkles,
} from "lucide-react";

import { requireWorkspaceAccess } from "@/app/lib/workspace/require-workspace-access";

const assistanceAreas = [
  {
    title: "Content Assistance",
    description:
      "Use future ROOTYM AI capabilities to assist with website content creation, editing and improvement.",
    icon: FileText,
  },
  {
    title: "SEO Assistance",
    description:
      "Generate future recommendations for page metadata, search visibility and website discoverability.",
    icon: Search,
  },
  {
    title: "Website Optimization",
    description:
      "Review website content and structure with future AI-assisted optimization recommendations.",
    icon: WandSparkles,
  },
  {
    title: "Marketing Assistance",
    description:
      "Use future AI capabilities to support website messaging, campaigns and digital marketing workflows.",
    icon: Sparkles,
  },
  {
    title: "Website Recommendations",
    description:
      "Receive future AI-generated recommendations based on the customer website environment.",
    icon: Globe2,
  },
  {
    title: "AI Website Workflows",
    description:
      "Prepare future assisted workflows that can help manage recurring website and marketing tasks.",
    icon: Bot,
  },
];

export default async function AIWebsiteAssistancePage() {
  const workspace = await requireWorkspaceAccess();

  const { membership } = workspace;

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
                <Sparkles className="h-5 w-5 text-white" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                  ROOTYM
                </p>

                <p className="text-lg font-bold">
                  AI Website Assistance
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/app/workspace/website"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <ArrowLeft className="h-4 w-4" />
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
                <Sparkles className="h-4 w-4" />
                Website & Marketing
              </div>

              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                AI Website Assistance
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Use future ROOTYM AI capabilities to assist with website
                content, optimization and digital marketing workflows from
                your customer workspace.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/10">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Customer Workspace
              </div>

              <div className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 ring-1 ring-white/10">
                Module Preparing
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            WORKSPACE CONTEXT
            ===================================================== */}

        <section className="mt-8">
          <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
                  Workspace
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  {membership.tenant.name}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  {membership.tenant.slug}
                </p>
              </div>

              <Link
                href="/app/workspace"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <LayoutDashboard className="h-4 w-4" />
                Workspace Home
              </Link>
            </div>
          </div>
        </section>

        {/* =====================================================
            AI ENVIRONMENT
            ===================================================== */}

        <section className="mt-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
              AI Environment
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              AI website assistance status
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              These indicators show the current readiness of the customer
              workspace for future AI-assisted website capabilities.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-100">
                  <Sparkles className="h-5 w-5 text-emerald-600" />
                </div>

                <LockKeyhole className="h-4 w-4 text-slate-400" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                AI Assistance
              </p>

              <h3 className="mt-2 text-lg font-bold">
                Preparing
              </h3>

              <span className="mt-4 inline-flex rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-600 ring-1 ring-amber-100">
                Preparing
              </span>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 ring-1 ring-slate-200">
                  <FileText className="h-5 w-5 text-slate-600" />
                </div>

                <LockKeyhole className="h-4 w-4 text-slate-400" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Content Context
              </p>

              <h3 className="mt-2 text-lg font-bold">
                Not Connected
              </h3>

              <span className="mt-4 inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500">
                Not Connected
              </span>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 ring-1 ring-slate-200">
                  <Globe2 className="h-5 w-5 text-slate-600" />
                </div>

                <LockKeyhole className="h-4 w-4 text-slate-400" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Website Context
              </p>

              <h3 className="mt-2 text-lg font-bold">
                Not Connected
              </h3>

              <span className="mt-4 inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500">
                Not Connected
              </span>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 ring-1 ring-slate-200">
                  <Bot className="h-5 w-5 text-slate-600" />
                </div>

                <LockKeyhole className="h-4 w-4 text-slate-400" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                AI Workflows
              </p>

              <h3 className="mt-2 text-lg font-bold">
                Preparing
              </h3>

              <span className="mt-4 inline-flex rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-600 ring-1 ring-amber-100">
                Preparing
              </span>
            </div>
          </div>
        </section>

        {/* =====================================================
            AI READINESS
            ===================================================== */}

        <section className="mt-8">
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-7 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-emerald-100">
                <Sparkles className="h-5 w-5 text-emerald-600" />
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
                  AI Readiness
                </p>

                <h2 className="mt-2 text-xl font-bold text-slate-900">
                  AI website assistance is being prepared
                </h2>

                <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
                  The customer workspace boundary is ready for future
                  tenant-specific AI assistance. AI capabilities will be
                  connected to customer website context only after the
                  website environment and appropriate customer data
                  boundaries are established.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-700 ring-1 ring-emerald-100">
                Workspace connected
              </div>

              <div className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-700 ring-1 ring-emerald-100">
                AI assistance preparing
              </div>

              <div className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-700 ring-1 ring-emerald-100">
                Website context not connected
              </div>

              <div className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-700 ring-1 ring-emerald-100">
                AI workflows preparing
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            ASSISTANCE AREAS
            ===================================================== */}

        <section className="mt-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
              AI Assistance
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              Website assistance areas
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              These AI-assisted capabilities will be enabled progressively
              as the customer website platform and AI architecture are
              implemented.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {assistanceAreas.map((area) => {
              const Icon = area.icon;

              return (
                <div
                  key={area.title}
                  className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-100">
                      <Icon className="h-6 w-6 text-emerald-600" />
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500">
                      Preparing
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-bold">
                    {area.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {area.description}
                  </p>

                  <div className="mt-6">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400">
                      Coming soon
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =====================================================
            AI ARCHITECTURE
            ===================================================== */}

        <section className="mt-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
                  AI Architecture
                </p>

                <h2 className="mt-2 text-xl font-bold">
                  AI assistance remains customer-workspace scoped
                </h2>

                <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
                  Future AI website assistance will operate within the
                  authenticated customer workspace and its connected
                  website environment. Global ROOTYM CMS content will not
                  be treated as customer-specific AI context.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            WORKSPACE HOME
            ===================================================== */}

        <section className="mt-8">
          <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
                  Workspace
                </p>

                <h2 className="mt-2 text-xl font-bold">
                  Return to your workspace
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Continue managing your ROOTYM customer workspace.
                </p>
              </div>

              <Link
                href="/app/workspace"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Workspace Home
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* =====================================================
            FOOTER
            ===================================================== */}

        <footer className="mt-10 border-t border-slate-200 pt-6">
          <div className="flex flex-col gap-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="font-semibold text-slate-700">
                ROOTYM AI Website Assistance
              </span>

              <span className="ml-2">
                · {membership.tenant.name}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-5">
              <Link
                href="/app/workspace/website"
                className="inline-flex items-center gap-1.5 transition hover:text-slate-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Website & Marketing
              </Link>

              <Link
                href="/app/workspace"
                className="inline-flex items-center gap-1.5 transition hover:text-slate-900"
              >
                <LayoutDashboard className="h-4 w-4" />
                Workspace
              </Link>

              <Link
                href="/app"
                className="inline-flex items-center gap-1.5 transition hover:text-slate-900"
              >
                <LayoutDashboard className="h-4 w-4" />
                Control Center
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