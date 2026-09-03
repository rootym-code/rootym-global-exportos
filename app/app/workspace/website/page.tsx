/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the authenticated Website & Marketing
 *          workspace area for managing website-related
 *          customer workspace capabilities.
 * ============================================================
 */

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  FileText,
  Globe2,
  ImageIcon,
  LayoutDashboard,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { requireWorkspaceAccess } from "@/app/lib/workspace/require-workspace-access";

const websiteModules = [
  {
    title: "Website Overview",
    description:
      "View the current website environment, publishing status and customer-facing website configuration.",
    icon: Globe2,
    href: "/app/workspace/website/overview",
    status: "Available",
  },
  {
    title: "Pages & Content",
    description:
      "Create, manage and publish website pages and customer-facing content.",
    icon: FileText,
    href: "/app/workspace/website/pages",
    status: "Available",
  },
  {
    title: "Media Library",
    description:
      "Manage website images and reusable media assets for your digital presence.",
    icon: ImageIcon,
    href: "/app/workspace/website/media",
    status: "Available",
  },
  {
    title: "Navigation & Menus",
    description:
      "Configure website navigation, menu items and links across the customer website.",
    icon: Menu,
    href: "/app/workspace/website/navigation",
    status: "Available",
  },
  {
    title: "SEO & Search",
    description:
      "Manage search engine settings, metadata and website discoverability.",
    icon: Search,
    href: "/app/workspace/website/seo",
    status: "Available",
  },
  {
    title: "Site Settings",
    description:
      "Manage website-level settings such as branding, contact information and default website configuration.",
    icon: Settings,
    href: "/app/workspace/website/settings",
    status: "Available",
  },
  {
    title: "Analytics & Integrations",
    description:
      "Connect website analytics and future digital marketing integrations to your workspace.",
    icon: BarChart3,
    href: "/app/workspace/website/analytics",
    status: "Available",
  },
  {
    title: "AI Website Assistance",
    description:
      "Use future ROOTYM AI capabilities to assist with website content, optimization and marketing workflows.",
    icon: Sparkles,
    href: "/app/workspace/website/ai-assistance",
    status: "Available",
  },
];

export default async function WebsiteMarketingPage() {
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
                <Globe2 className="h-5 w-5 text-white" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                  ROOTYM
                </p>

                <p className="text-lg font-bold">
                  Website & Marketing
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/app/workspace"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <ArrowLeft className="h-4 w-4" />
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
                <Globe2 className="h-4 w-4" />
                Website & Marketing
              </div>

              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Your digital presence
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Manage the website and digital marketing capabilities
                connected to your ROOTYM workspace from one central
                environment.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/10">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                {String(membership.role)}
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
            WEBSITE & MARKETING CAPABILITIES
            ===================================================== */}

        <section className="mt-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
              Website Capabilities
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              Manage your website environment
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Website and marketing capabilities will be progressively
              enabled here as the ROOTYM customer platform is built.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {websiteModules.map((module) => {
              const Icon = module.icon;

              const cardContent = (
                <>
                  <div className="flex items-start justify-between gap-5">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1 ${
                        module.href
                          ? "bg-emerald-50 ring-emerald-100"
                          : "bg-emerald-50 ring-emerald-100"
                      }`}
                    >
                      <Icon className="h-6 w-6 text-emerald-600" />
                    </div>

                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                        module.href
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {module.status}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-bold">
                    {module.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {module.description}
                  </p>

                  <div className="mt-6">
                    <span
                      className={`inline-flex items-center gap-2 text-sm font-semibold ${
                        module.href
                          ? "text-emerald-600"
                          : "text-slate-400"
                      }`}
                    >
                      {module.href
                        ? module.title === "Pages & Content"
                          ? "View pages"
                          : module.title === "Media Library"
                            ? "View media"
                            : module.title === "Navigation & Menus"
                              ? "View navigation"
                              : module.title === "SEO & Search"
                                ? "View SEO"
                                : module.title === "Site Settings"
                                  ? "View settings"
                                  : module.title ===
                                      "Analytics & Integrations"
                                    ? "View analytics"
                                    : module.title ===
                                        "AI Website Assistance"
                                      ? "View AI assistance"
                                      : "View overview"
                        : "Coming soon"}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </>
              );

              if (module.href) {
                return (
                  <Link
                    key={module.title}
                    href={module.href}
                    className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-emerald-200 transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    {cardContent}
                  </Link>
                );
              }

              return (
                <div
                  key={module.title}
                  className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md"
                >
                  {cardContent}
                </div>
              );
            })}
          </div>
        </section>

        {/* =====================================================
            CURRENT ARCHITECTURE NOTE
            ===================================================== */}

        <section className="mt-8">
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-7 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-emerald-100">
                <Globe2 className="h-5 w-5 text-emerald-600" />
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
                  Website Architecture
                </p>

                <h2 className="mt-2 text-xl font-bold text-slate-900">
                  Customer website capabilities are being built
                </h2>

                <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
                  This workspace area is the customer-facing
                  foundation for future website management. Existing
                  ROOTYM public website functionality and the existing
                  CMS foundation remain separate and are not replaced
                  by this workspace shell.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            FOOTER NAVIGATION
            ===================================================== */}

        <footer className="mt-10 border-t border-slate-200 pt-6">
          <div className="flex flex-col gap-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="font-semibold text-slate-700">
                ROOTYM Website & Marketing
              </span>

              <span className="ml-2">
                · {membership.tenant.name}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-5">
              <Link
                href="/app/workspace"
                className="inline-flex items-center gap-1.5 transition hover:text-slate-900"
              >
                <ArrowLeft className="h-4 w-4" />
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