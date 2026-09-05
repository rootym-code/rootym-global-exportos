/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the authenticated Website Overview page
 *          for the customer Website & Marketing workspace,
 *          presenting the existing ROOTYM website ecosystem
 *          through the customer workspace control layer.
 * ============================================================
 */

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  CircleUserRound,
  FileText,
  Globe2,
  ImageIcon,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  Users,
  Workflow,
} from "lucide-react";

import {
  getWebsiteOverview,
  type WebsiteOverviewStatus,
} from "@/app/lib/workspace/website/website-overview.service";

function getStatusLabel(status: WebsiteOverviewStatus) {
  switch (status) {
    case "READY":
      return "Ready";

    case "NOT_CONNECTED":
      return "Not Connected";

    case "PREPARING":
    default:
      return "Preparing";
  }
}

function getStatusClassName(status: WebsiteOverviewStatus) {
  switch (status) {
    case "READY":
      return "bg-emerald-50 text-emerald-700 ring-emerald-100";

    case "NOT_CONNECTED":
      return "bg-slate-100 text-slate-500 ring-slate-200";

    case "PREPARING":
    default:
      return "bg-amber-50 text-amber-700 ring-amber-100";
  }
}

function getStatusIcon(status: WebsiteOverviewStatus) {
  switch (status) {
    case "READY":
      return CheckCircle2;

    case "NOT_CONNECTED":
      return LockKeyhole;

    case "PREPARING":
    default:
      return UploadCloud;
  }
}

const connectedCapabilities = [
  {
    title: "Pages & Content",
    description:
      "Manage the existing ROOTYM CMS pages, structured content and customer-facing website content.",
    icon: FileText,
    href: "/app/workspace/website/pages",
    label: "Manage pages",
  },
  {
    title: "Media Library",
    description:
      "Use the existing ROOTYM media capability for website images and reusable digital assets.",
    icon: ImageIcon,
    href: "/app/workspace/website/media",
    label: "Manage media",
  },
  {
    title: "Navigation & Menus",
    description:
      "Manage website navigation and menu structures used by the existing website experience.",
    icon: Menu,
    href: "/app/workspace/website/navigation",
    label: "Manage navigation",
  },
  {
    title: "SEO & Search",
    description:
      "Manage website metadata and search-related configuration supported by the existing CMS.",
    icon: Search,
    href: "/app/workspace/website/seo",
    label: "Manage SEO",
  },
  {
    title: "Site Settings",
    description:
      "Manage website-level presentation and configuration settings through the customer workspace.",
    icon: Settings,
    href: "/app/workspace/website/settings",
    label: "Manage settings",
  },
  {
    title: "Analytics & Integrations",
    description:
      "Access website analytics and future digital marketing integrations connected to the ROOTYM environment.",
    icon: BarChart3,
    href: "/app/workspace/website/analytics",
    label: "View analytics",
  },
];

const businessCapabilities = [
  {
    title: "Products",
    description:
      "Existing ROOTYM product data can provide the business catalogue presented through the website.",
    icon: LayoutDashboard,
    href: "/app/workspace/products",
  },
  {
    title: "Inquiries",
    description:
      "Website enquiries remain part of the existing ROOTYM inquiry workflow rather than a separate website system.",
    icon: FileText,
    href: "/app/workspace/inquiries",
  },
  {
    title: "Buyers",
    description:
      "Buyer context remains part of the existing business workflow and can be surfaced alongside website activity.",
    icon: Users,
    href: "/app/workspace/buyers",
  },
  {
    title: "FollowUps",
    description:
      "Follow-up activity remains governed by the existing ROOTYM operational workflow.",
    icon: Workflow,
    href: "/app/workspace/followups",
  },
  {
    title: "R-CAPTAIN",
    description:
      "R-CAPTAIN remains the operational intelligence and business decision layer behind customer activity.",
    icon: ShieldCheck,
    href: "/app/workspace/r-captain",
  },
];

export default async function WebsiteOverviewPage() {
  const overview = await getWebsiteOverview();

  const websiteStatusIcon = getStatusIcon(overview.website.status);
  const publishingStatusIcon = getStatusIcon(
    overview.website.publishingStatus,
  );
  const domainStatusIcon = getStatusIcon(overview.website.domainStatus);
  const cmsStatusIcon = getStatusIcon(overview.website.cmsStatus);

  const WebsiteStatusIcon = websiteStatusIcon;
  const PublishingStatusIcon = publishingStatusIcon;
  const DomainStatusIcon = domainStatusIcon;
  const CmsStatusIcon = cmsStatusIcon;

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

                <p className="text-lg font-bold">Website Overview</p>
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
            </div>
          </div>
        </header>

        {/* =====================================================
            WEBSITE HEADER
            ===================================================== */}

        <section className="rounded-3xl bg-slate-950 p-7 text-white shadow-sm sm:p-9">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-400">
                <Globe2 className="h-4 w-4" />
                Website & Marketing
              </div>

              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Your ROOTYM website environment
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Manage and understand the website capabilities connected to
                your ROOTYM workspace. The customer workspace provides the
                control layer while the existing ROOTYM website and business
                systems remain the underlying source of truth.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/10">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Customer Workspace
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            WORKSPACE IDENTITY
            ===================================================== */}

        <section className="mt-8">
          <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
                  Workspace
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  {overview.workspace.name}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Website capabilities are scoped to this authenticated
                  customer workspace.
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-5 py-4 ring-1 ring-slate-200">
                <CircleUserRound className="h-5 w-5 text-slate-600" />

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {overview.owner.name}
                  </p>

                  <p className="text-xs text-slate-500">
                    {overview.owner.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            WEBSITE STATUS
            ===================================================== */}

        <section className="mt-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
              Website Status
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              Existing website environment
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              These indicators describe the current state of the website
              capabilities connected to this workspace.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {/* Website */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                  <Globe2 className="h-5 w-5 text-emerald-600" />
                </div>

                <WebsiteStatusIcon className="h-5 w-5 text-slate-400" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Website
              </p>

              <p className="mt-2 text-xl font-bold">
                {getStatusLabel(overview.website.status)}
              </p>

              <span
                className={`mt-3 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${getStatusClassName(
                  overview.website.status,
                )}`}
              >
                {getStatusLabel(overview.website.status)}
              </span>
            </div>

            {/* Publishing */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                  <UploadCloud className="h-5 w-5 text-slate-700" />
                </div>

                <PublishingStatusIcon className="h-5 w-5 text-slate-400" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Publishing
              </p>

              <p className="mt-2 text-xl font-bold">
                {getStatusLabel(overview.website.publishingStatus)}
              </p>

              <span
                className={`mt-3 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${getStatusClassName(
                  overview.website.publishingStatus,
                )}`}
              >
                {getStatusLabel(overview.website.publishingStatus)}
              </span>
            </div>

            {/* Domain */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                  <Globe2 className="h-5 w-5 text-slate-700" />
                </div>

                <DomainStatusIcon className="h-5 w-5 text-slate-400" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Domain
              </p>

              <p className="mt-2 text-xl font-bold">
                {getStatusLabel(overview.website.domainStatus)}
              </p>

              <span
                className={`mt-3 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${getStatusClassName(
                  overview.website.domainStatus,
                )}`}
              >
                {getStatusLabel(overview.website.domainStatus)}
              </span>
            </div>

            {/* CMS */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                  <FileText className="h-5 w-5 text-slate-700" />
                </div>

                <CmsStatusIcon className="h-5 w-5 text-slate-400" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                CMS
              </p>

              <p className="mt-2 text-xl font-bold">
                {getStatusLabel(overview.website.cmsStatus)}
              </p>

              <span
                className={`mt-3 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${getStatusClassName(
                  overview.website.cmsStatus,
                )}`}
              >
                {getStatusLabel(overview.website.cmsStatus)}
              </span>
            </div>
          </div>
        </section>

        {/* =====================================================
            WEBSITE CONTROL LAYER
            ===================================================== */}

        <section className="mt-8">
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-7 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-emerald-100">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
                  Website Control Layer
                </p>

                <h2 className="mt-2 text-xl font-bold text-slate-900">
                  One customer workspace over the existing ROOTYM systems
                </h2>

                <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-600">
                  Website & Marketing is the presentation and management layer
                  for your digital presence. Existing ROOTYM systems remain
                  responsible for the underlying website content, business
                  data, inquiry processing and operational workflows.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white px-5 py-4 ring-1 ring-emerald-100">
                    <p className="text-sm font-semibold text-slate-900">
                      Customer controls presentation
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Content, layout, website presentation, navigation,
                      metadata and other customer-facing configuration.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white px-5 py-4 ring-1 ring-emerald-100">
                    <p className="text-sm font-semibold text-slate-900">
                      ROOTYM controls business behavior
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Products, inquiries, buyers, follow-ups and R-CAPTAIN
                      business workflows remain governed by their existing
                      implementations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            WEBSITE CAPABILITIES
            ===================================================== */}

        <section className="mt-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
              Website Capabilities
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              Manage the existing website ecosystem
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              These customer-facing modules provide controlled access to the
              website capabilities already available within the ROOTYM
              platform.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {connectedCapabilities.map((capability) => {
              const Icon = capability.icon;

              return (
                <Link
                  key={capability.title}
                  href={capability.href}
                  className="group rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-100">
                      <Icon className="h-6 w-6 text-emerald-600" />
                    </div>

                    <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
                      Available
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-bold">
                    {capability.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {capability.description}
                  </p>

                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 transition group-hover:gap-3">
                    {capability.label}
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* =====================================================
            BUSINESS CONNECTIVITY
            ===================================================== */}

        <section className="mt-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
              Business Connectivity
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              Website connected to your business operations
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              The website does not create a second business workflow. Customer
              activity connects back to the existing ROOTYM business modules
              and operational intelligence.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {businessCapabilities.map((capability) => {
              const Icon = capability.icon;

              return (
                <Link
                  key={capability.title}
                  href={capability.href}
                  className="group rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 ring-1 ring-slate-200">
                    <Icon className="h-6 w-6 text-slate-700" />
                  </div>

                  <h3 className="mt-6 text-xl font-bold">
                    {capability.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {capability.description}
                  </p>

                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition group-hover:gap-3">
                    Open module
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* =====================================================
            WEBSITE PRINCIPLE
            ===================================================== */}

        <section className="mt-8">
          <div className="rounded-3xl bg-slate-950 p-7 text-white shadow-sm sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-4xl">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-400">
                  <Sparkles className="h-4 w-4" />
                  ROOTYM Architecture
                </div>

                <h2 className="mt-3 text-2xl font-bold tracking-tight">
                  The website presents the business. ROOTYM runs the business.
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Website content and presentation can be managed through this
                  workspace without duplicating the underlying ROOTYM business
                  logic. Website enquiries, product information, buyer
                  context, follow-up activity and operational decisions remain
                  connected to their existing business systems.
                </p>
              </div>

              <div className="shrink-0">
                <div className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-5 py-3 text-sm font-semibold ring-1 ring-white/10">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  Existing systems remain the source of truth
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            SUBSCRIPTION CONTEXT
            ===================================================== */}

        <section className="mt-8">
          <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
                  Workspace Subscription
                </p>

                <h2 className="mt-2 text-xl font-bold">
                  {overview.subscription.planName ?? "No active plan"}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Status:{" "}
                  {overview.subscription.status
                    ? String(overview.subscription.status)
                    : "No subscription"}
                </p>
              </div>

              <Link
                href="/app/billing"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Manage Billing
                <ArrowRight className="h-4 w-4" />
              </Link>
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
                ROOTYM Website Overview
              </span>

              <span className="ml-2">· {overview.workspace.name}</span>
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