/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the authenticated Pages & Content control
 *          center for the customer Website & Marketing
 *          workspace, including website status, publishing
 *          readiness, future health monitoring, and connected
 *          ROOTYM business-system placeholders.
 * ============================================================
 */

import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  CircleUserRound,
  Cloud,
  FileArchive,
  FileCheck2,
  FileText,
  Globe2,
  HeartPulse,
  LayoutDashboard,
  LockKeyhole,
  MonitorCog,
  Network,
  PenLine,
  Search,
  ServerCog,
  Settings,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  Users,
  Workflow,
  XCircle,
} from "lucide-react";

import {
  getWebsitePagesOverview,
  type WebsitePagesStatus,
} from "@/app/lib/workspace/website/website-pages.service";

function getStatusLabel(status: WebsitePagesStatus) {
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

function getStatusClassName(status: WebsitePagesStatus) {
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

function getStatusIcon(status: WebsitePagesStatus) {
  switch (status) {
    case "READY":
      return CheckCircle2;

    case "NOT_CONNECTED":
      return LockKeyhole;

    case "PREPARING":
    default:
      return MonitorCog;
  }
}

const pageAreas = [
  {
    title: "All Pages",
    description:
      "View and manage the pages belonging to your customer website.",
    icon: FileText,
    status: "Available",
    href: "/app/workspace/website/pages/all",
  },
  {
    title: "Page Structure",
    description:
      "Organize page hierarchy and future website navigation relationships.",
    icon: Network,
    status: "Preparing",
    href: null,
  },
  {
    title: "Page SEO",
    description:
      "Manage page-level metadata, indexing and search visibility settings.",
    icon: Search,
    status: "Preparing",
    href: null,
  },
];

const healthChecks = [
  {
    title: "Website Availability",
    description:
      "Confirm that the customer website is reachable and responding normally.",
    icon: Globe2,
  },
  {
    title: "Domain & DNS",
    description:
      "Verify domain configuration and DNS resolution.",
    icon: Network,
  },
  {
    title: "SSL / HTTPS",
    description:
      "Verify secure HTTPS connectivity and certificate status.",
    icon: ShieldCheck,
  },
  {
    title: "CMS Connection",
    description:
      "Verify that the website CMS is available for customer content.",
    icon: MonitorCog,
  },
  {
    title: "Publishing",
    description:
      "Verify that website publishing services are operational.",
    icon: UploadCloud,
  },
  {
    title: "Media",
    description:
      "Verify availability of the website media environment.",
    icon: Cloud,
  },
];

const connectedSystems = [
  {
    title: "Products",
    description:
      "Business products presented through the customer website.",
    icon: FileArchive,
  },
  {
    title: "Inquiries",
    description:
      "Website enquiries and customer leads connected to ROOTYM.",
    icon: FileCheck2,
  },
  {
    title: "Buyers",
    description:
      "Buyer context associated with business enquiries and activity.",
    icon: Users,
  },
  {
    title: "FollowUps",
    description:
      "Follow-up activity generated through existing business workflows.",
    icon: Workflow,
  },
  {
    title: "R-CAPTAIN",
    description:
      "Operational intelligence and protected business workflow layer.",
    icon: Sparkles,
  },
];

export default async function WebsitePagesPage() {
  const overview = await getWebsitePagesOverview();

  const pagesStatusIcon = getStatusIcon(
    overview.pages.status,
  );

  const publishingStatusIcon = getStatusIcon(
    overview.pages.publishingStatus,
  );

  const cmsStatusIcon = getStatusIcon(
    overview.pages.cmsStatus,
  );

  const pageEnvironmentReady =
    overview.pages.status === "READY" &&
    overview.pages.publishingStatus === "READY" &&
    overview.pages.cmsStatus === "READY";

  const PagesStatusIcon = pagesStatusIcon;
  const PublishingStatusIcon = publishingStatusIcon;
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
                <FileText className="h-5 w-5 text-white" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                  ROOTYM
                </p>

                <p className="text-lg font-bold">
                  Pages & Content
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
                <FileText className="h-4 w-4" />
                Website & Marketing
              </div>

              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Pages & Content
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Manage your website content, monitor publishing
                readiness and understand the ROOTYM systems connected
                to your customer website.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/10">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Customer Workspace
              </div>

              <div
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ring-1 ${
                  pageEnvironmentReady
                    ? "bg-emerald-500/10 text-emerald-300 ring-emerald-400/20"
                    : "bg-slate-800 text-slate-300 ring-white/10"
                }`}
              >
                {pageEnvironmentReady
                  ? "Website Connected"
                  : "Environment Preparing"}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            WEBSITE CONTROL BAR
            ===================================================== */}

        <section className="mt-8">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-7">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
                  Website Control
                </p>

                <h2 className="mt-2 text-2xl font-bold tracking-tight">
                  {overview.workspace.name}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  {overview.workspace.slug}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-100">
                  <CheckCircle2 className="h-4 w-4" />
                  {pageEnvironmentReady
                    ? "Website Environment Ready"
                    : "Website Environment Preparing"}
                </div>

                <div className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-500 ring-1 ring-slate-200">
                  <Activity className="h-4 w-4" />
                  Live Monitoring â€” Coming Soon
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 border-t border-slate-100 pt-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Website
                </p>
                <p className="mt-2 text-sm font-bold text-slate-900">
                  {pageEnvironmentReady ? "Connected" : "Preparing"}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Live website status integration
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Published
                </p>
                <p className="mt-2 text-sm font-bold text-slate-900">
                  Status integration pending
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Last publication will appear here
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Changes
                </p>
                <p className="mt-2 text-sm font-bold text-slate-900">
                  Pending-change tracking
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Draft and publication workflow coming next
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Health
                </p>
                <p className="mt-2 text-sm font-bold text-slate-900">
                  Health checks coming soon
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Availability and service checks
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                disabled
                className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white opacity-60"
                title="Website preview will be enabled when public Website routing is connected."
              >
                <Globe2 className="h-4 w-4" />
                View Website
              </button>

              <button
                type="button"
                disabled
                className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-500 opacity-70"
                title="Preview Changes will be enabled with the publishing workflow."
              >
                <MonitorCog className="h-4 w-4" />
                Preview Changes
              </button>

              <button
                type="button"
                disabled
                className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-500 opacity-70"
                title="Website health checks will be implemented in the Website Status & Health module."
              >
                <HeartPulse className="h-4 w-4" />
                Run Health Check
              </button>
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
                  {overview.workspace.name}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  {overview.workspace.slug}
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
            PAGE ENVIRONMENT STATUS
            ===================================================== */}

        <section className="mt-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
              Page Environment
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              Website environment status
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              These indicators reflect the current customer Website
              connection available to the Pages & Content module.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                  <FileText className="h-5 w-5 text-emerald-600" />
                </div>

                <PagesStatusIcon className="h-5 w-5 text-slate-400" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Pages
              </p>

              <p className="mt-2 text-xl font-bold">
                {getStatusLabel(overview.pages.status)}
              </p>

              <span
                className={`mt-3 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${getStatusClassName(
                  overview.pages.status,
                )}`}
              >
                {getStatusLabel(overview.pages.status)}
              </span>
            </div>

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
                {getStatusLabel(
                  overview.pages.publishingStatus,
                )}
              </p>

              <span
                className={`mt-3 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${getStatusClassName(
                  overview.pages.publishingStatus,
                )}`}
              >
                {getStatusLabel(
                  overview.pages.publishingStatus,
                )}
              </span>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                  <MonitorCog className="h-5 w-5 text-slate-700" />
                </div>

                <CmsStatusIcon className="h-5 w-5 text-slate-400" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                CMS Connection
              </p>

              <p className="mt-2 text-xl font-bold">
                {getStatusLabel(overview.pages.cmsStatus)}
              </p>

              <span
                className={`mt-3 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${getStatusClassName(
                  overview.pages.cmsStatus,
                )}`}
              >
                {getStatusLabel(overview.pages.cmsStatus)}
              </span>
            </div>
          </div>
        </section>

        {/* =====================================================
            CONTENT SUMMARY
            ===================================================== */}

        <section className="mt-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
              Content Summary
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              Website content at a glance
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Live page counts will be connected to the Website-scoped
              CMS service as the page management workflow is enabled.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Total Pages",
                value: "â€”",
                description: "Awaiting CMS page-count integration",
                icon: FileText,
              },
              {
                title: "Published",
                value: "â€”",
                description: "Awaiting publication metrics",
                icon: CheckCircle2,
              },
              {
                title: "Draft",
                value: "â€”",
                description: "Awaiting draft tracking",
                icon: PenLine,
              },
              {
                title: "Archived",
                value: "â€”",
                description: "Awaiting archive metrics",
                icon: FileArchive,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 ring-1 ring-slate-100">
                    <Icon className="h-5 w-5 text-slate-600" />
                  </div>

                  <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {item.title}
                  </p>

                  <p className="mt-2 text-3xl font-bold tracking-tight">
                    {item.value}
                  </p>

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* =====================================================
            PENDING CHANGES
            ===================================================== */}

        <section className="mt-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 ring-1 ring-amber-100">
                  <UploadCloud className="h-6 w-6 text-amber-600" />
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-700">
                    Publishing Queue
                  </p>

                  <h2 className="mt-2 text-xl font-bold">
                    Pending website changes
                  </h2>

                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                    This area will show customer website changes that
                    have been saved but are not yet published.
                  </p>
                </div>
              </div>

              <span className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500">
                Workflow coming soon
              </span>
            </div>

            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6">
              <div className="flex flex-col items-center justify-center text-center">
                <UploadCloud className="h-8 w-8 text-slate-300" />

                <p className="mt-3 text-sm font-semibold text-slate-700">
                  No live pending-change data yet
                </p>

                <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                  Once draft tracking and publishing are connected,
                  this section will list pending changes, affected
                  pages, authors, timestamps and publication actions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            PAGE MANAGEMENT
            ===================================================== */}

        <section className="mt-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
              Page Management
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              Website content controls
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              These capabilities will progressively become operational
              on top of the existing Website-scoped CMS implementation.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {pageAreas.map((area) => {
              const Icon = area.icon;

              const isNext = area.status === "Next";
              const isAvailable = Boolean(area.href);

              const cardContent = (
                <>
                  <div className="flex items-start justify-between gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-100">
                      <Icon className="h-6 w-6 text-emerald-600" />
                    </div>

                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                        isAvailable || isNext
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {area.status}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-bold">
                    {area.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {area.description}
                  </p>

                  <div className="mt-6">
                    <span
                      className={`inline-flex items-center gap-2 text-sm font-semibold ${
                        isAvailable
                          ? "text-emerald-700"
                          : "text-slate-400"
                      }`}
                    >
                      {isAvailable
                        ? "Open All Pages"
                        : isNext
                          ? "Implementation queued"
                          : "Coming soon"}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </>
              );

              if (area.href) {
                return (
                  <Link
                    key={area.title}
                    href={area.href}
                    className="block rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    {cardContent}
                  </Link>
                );
              }

              return (
                <div
                  key={area.title}
                  className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md"
                >
                  {cardContent}
                </div>
              );
            })}
          </div>
        </section>

        {/* =====================================================
            WEBSITE HEALTH
            ===================================================== */}

        <section className="mt-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
              Website Health
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              Website Status & Health
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              A dedicated health layer will verify whether the customer
              website, domain, CMS, publishing services and connected
              systems are operating correctly.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 sm:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 ring-1 ring-slate-200">
                  <HeartPulse className="h-6 w-6 text-slate-600" />
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Overall Health
                  </p>

                  <h3 className="mt-1 text-xl font-bold">
                    Health monitoring not yet connected
                  </h3>
                </div>
              </div>

              <button
                type="button"
                disabled
                className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white opacity-50"
              >
                <HeartPulse className="h-4 w-4" />
                Run Health Check
              </button>
            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {healthChecks.map((check) => {
                const Icon = check.icon;

                return (
                  <div
                    key={check.title}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200">
                        <Icon className="h-5 w-5 text-slate-500" />
                      </div>

                      <span className="text-xs font-semibold text-slate-400">
                        Not checked
                      </span>
                    </div>

                    <h4 className="mt-5 text-sm font-bold text-slate-800">
                      {check.title}
                    </h4>

                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      {check.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================
            ROOTYM PLATFORM CONNECTIVITY
            ===================================================== */}

        <section className="mt-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
              ROOTYM Connectivity
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              Connected business systems
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              The Website presents the business while existing ROOTYM
              modules remain responsible for business operations and
              protected workflow logic.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {connectedSystems.map((system) => {
              const Icon = system.icon;

              return (
                <div
                  key={system.title}
                  className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 ring-1 ring-slate-200">
                      <Icon className="h-5 w-5 text-slate-600" />
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500">
                      Connected view
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-bold">
                    {system.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {system.description}
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-slate-400">
                    <MonitorCog className="h-4 w-4" />
                    Customer control surface coming soon
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =====================================================
            PLATFORM ADMINISTRATION
            ===================================================== */}

        <section className="mt-8">
          <div className="rounded-3xl border border-slate-200 bg-slate-950 p-7 text-white shadow-sm sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
                  <ServerCog className="h-6 w-6 text-emerald-400" />
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-400">
                    Platform Administration
                  </p>

                  <h2 className="mt-2 text-xl font-bold">
                    Admin Dashboard
                  </h2>

                  <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                    The existing ROOTYM Admin Dashboard remains a
                    platform-administration surface. Customer users
                    should use the tenant-scoped workspace modules
                    rather than bypassing tenant authorization through
                    the platform admin interface.
                  </p>
                </div>
              </div>

              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300 ring-1 ring-white/10">
                <LockKeyhole className="h-3.5 w-3.5" />
                Restricted
              </span>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
                <LayoutDashboard className="h-5 w-5 text-emerald-400" />

                <p className="mt-4 text-sm font-bold">
                  Platform Dashboard
                </p>

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Existing administrative dashboard remains outside
                  the customer Website control layer.
                </p>
              </div>

              <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
                <ServerCog className="h-5 w-5 text-emerald-400" />

                <p className="mt-4 text-sm font-bold">
                  Platform Operations
                </p>

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Infrastructure and platform controls remain
                  separated from customer content management.
                </p>
              </div>

              <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />

                <p className="mt-4 text-sm font-bold">
                  Tenant Isolation
                </p>

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Customer operations continue through the authenticated
                  tenant workspace boundary.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            SYSTEM HEALTH PLACEHOLDER
            ===================================================== */}

        <section className="mt-8">
          <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
                  Operational Visibility
                </p>

                <h2 className="mt-2 text-xl font-bold">
                  Platform service status
                </h2>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                  A future read-only service monitor can provide
                  customer-facing visibility into the availability of
                  the ROOTYM services used by the website.
                </p>
              </div>

              <span className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500">
                Planned
              </span>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Website Platform",
                  icon: Globe2,
                },
                {
                  title: "CMS API",
                  icon: MonitorCog,
                },
                {
                  title: "Database",
                  icon: ServerCog,
                },
                {
                  title: "Publishing Service",
                  icon: UploadCloud,
                },
              ].map((service) => {
                const Icon = service.icon;

                return (
                  <div
                    key={service.title}
                    className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-4 ring-1 ring-slate-100"
                  >
                    <Icon className="h-5 w-5 text-slate-400" />

                    <div>
                      <p className="text-sm font-semibold text-slate-700">
                        {service.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Monitoring planned
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================
            ARCHITECTURE PRINCIPLE
            ===================================================== */}

        <section className="mt-8">
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-7 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-emerald-100">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
                  ROOTYM Architecture
                </p>

                <h2 className="mt-2 text-xl font-bold text-slate-900">
                  The website presents the business. ROOTYM runs the business.
                </h2>

                <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-600">
                  Website & Marketing controls how the business is
                  presented to customers. Products, Inquiries, Buyers,
                  FollowUps and R-CAPTAIN remain the authoritative
                  business systems. The customer Website layer will
                  connect to those systems without duplicating their
                  business logic.
                </p>
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
                  {overview.subscription.planName ??
                    "No active plan"}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Status:{" "}
                  {overview.subscription.status ??
                    "No subscription"}
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
                ROOTYM Pages & Content
              </span>

              <span className="ml-2">
                Â· {overview.workspace.name}
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