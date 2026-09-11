/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides a focused Website Overview page that
 *          presents website health and status without
 *          duplicating workspace navigation or module dashboards.
 * ============================================================
 */

import {
  CheckCircle2,
  FileText,
  Globe2,
  LockKeyhole,
  ShieldCheck,
  UploadCloud,
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

type StatusCardProps = {
  label: string;
  status: WebsiteOverviewStatus;
  icon: typeof Globe2;
};

function StatusCard({ label, status, icon: Icon }: StatusCardProps) {
  const StatusIcon = getStatusIcon(status);

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 ring-1 ring-slate-200">
          <Icon className="h-5 w-5 text-slate-700" />
        </div>

        <StatusIcon className="h-5 w-5 text-slate-400" />
      </div>

      <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-lg font-bold text-slate-900">
        {getStatusLabel(status)}
      </p>

      <span
        className={`mt-3 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${getStatusClassName(
          status,
        )}`}
      >
        {getStatusLabel(status)}
      </span>
    </div>
  );
}

export default async function WebsiteOverviewPage() {
  const overview = await getWebsiteOverview();

  return (
    <main className="min-h-full bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8 lg:py-10">
        {/* =====================================================
            PAGE HEADER
            ===================================================== */}
        <header className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950">
              <Globe2 className="h-5 w-5 text-white" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                Website
              </p>

              <h1 className="text-2xl font-bold tracking-tight">
                Website Overview
              </h1>
            </div>
          </div>
        </header>

        {/* =====================================================
            INTRODUCTION
            ===================================================== */}
        <section className="rounded-3xl bg-slate-950 p-7 text-white shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-400">
                <Globe2 className="h-4 w-4" />
                Website Status
              </div>

              <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                Your website at a glance
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Check the current connection, publishing, domain and CMS
                status of your website from one place.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-slate-200 ring-1 ring-white/10">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Customer Workspace
            </div>
          </div>
        </section>

        {/* =====================================================
            WEBSITE STATUS
            ===================================================== */}
        <section className="mt-8">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
              Current Status
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              Website environment
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              These indicators show the current state of the website
              capabilities connected to this workspace.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <StatusCard
              label="Website"
              status={overview.website.status}
              icon={Globe2}
            />

            <StatusCard
              label="Publishing"
              status={overview.website.publishingStatus}
              icon={UploadCloud}
            />

            <StatusCard
              label="Domain"
              status={overview.website.domainStatus}
              icon={Globe2}
            />

            <StatusCard
              label="CMS"
              status={overview.website.cmsStatus}
              icon={FileText}
            />
          </div>
        </section>

        {/* =====================================================
            WORKSPACE NOTE
            ===================================================== */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 ring-1 ring-emerald-100">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900">
                Manage website features from the navigation
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Use the Website section in the workspace navigation to manage
                pages, media, navigation, analytics and website settings.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
