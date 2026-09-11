/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the consolidated tenant-scoped Website
 *          Settings workspace for website configuration and
 *          branding without duplicating Business settings.
 * ============================================================
 */

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Globe2,
  LayoutDashboard,
  LockKeyhole,
  Palette,
  Settings,
  ShieldCheck,
} from "lucide-react";

import WebsiteBrandingForm from "@/app/app/workspace/website/settings/WebsiteBrandingForm";
import WebsiteConfigurationForm from "@/app/app/workspace/website/settings/WebsiteConfigurationForm";

import {
  getWebsiteSettingsOverview,
  type WebsiteSettingsStatus,
} from "@/app/lib/workspace/website/website-settings.service";

import { requireWorkspaceAccess } from "@/app/lib/workspace/require-workspace-access";

function getStatusLabel(status: WebsiteSettingsStatus) {
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

function getStatusClassName(status: WebsiteSettingsStatus) {
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

function getStatusIcon(status: WebsiteSettingsStatus) {
  switch (status) {
    case "READY":
      return CheckCircle2;

    case "NOT_CONNECTED":
      return LockKeyhole;

    case "PREPARING":
    default:
      return Settings;
  }
}

export default async function WebsiteSettingsPage() {
  const [{ membership }, overview] = await Promise.all([
    requireWorkspaceAccess(),
    getWebsiteSettingsOverview(),
  ]);

  const canEdit =
    membership.role === "OWNER" || membership.role === "ADMIN";

  const SettingsStatusIcon = getStatusIcon(
    overview.settings.status
  );

  const BrandingStatusIcon = getStatusIcon(
    overview.settings.brandingStatus
  );

  const WebsiteBindingStatusIcon = getStatusIcon(
    overview.settings.websiteBindingStatus
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-10">
        {/* =====================================================
            PAGE HEADER
            ===================================================== */}

        <header className="mb-8">
          <div className="flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                Website
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                Website Settings
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Manage website configuration and branding for this
                customer workspace.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-600 ring-1 ring-slate-200">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                {canEdit ? "Edit Access" : "View Only"}
              </div>

              <Link
                href="/app/workspace/website/overview"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                Website Overview
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </header>

        {/* =====================================================
            WEBSITE STATUS
            ===================================================== */}

        <section>
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
              Status
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
              Website configuration status
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Current configuration, branding and website connection
              status for this workspace.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {/* Configuration */}

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                  <Settings className="h-5 w-5 text-emerald-600" />
                </div>

                <SettingsStatusIcon className="h-5 w-5 text-slate-400" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Configuration
              </p>

              <p className="mt-2 text-xl font-bold text-slate-950">
                {getStatusLabel(overview.settings.status)}
              </p>

              <span
                className={`mt-3 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${getStatusClassName(
                  overview.settings.status
                )}`}
              >
                {getStatusLabel(overview.settings.status)}
              </span>
            </div>

            {/* Branding */}

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                  <Palette className="h-5 w-5 text-emerald-600" />
                </div>

                <BrandingStatusIcon className="h-5 w-5 text-slate-400" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Branding
              </p>

              <p className="mt-2 text-xl font-bold text-slate-950">
                {getStatusLabel(
                  overview.settings.brandingStatus
                )}
              </p>

              <span
                className={`mt-3 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${getStatusClassName(
                  overview.settings.brandingStatus
                )}`}
              >
                {getStatusLabel(
                  overview.settings.brandingStatus
                )}
              </span>
            </div>

            {/* Website Binding */}

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                  <Globe2 className="h-5 w-5 text-emerald-600" />
                </div>

                <WebsiteBindingStatusIcon className="h-5 w-5 text-slate-400" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Website Binding
              </p>

              <p className="mt-2 text-xl font-bold text-slate-950">
                {getStatusLabel(
                  overview.settings.websiteBindingStatus
                )}
              </p>

              <span
                className={`mt-3 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${getStatusClassName(
                  overview.settings.websiteBindingStatus
                )}`}
              >
                {getStatusLabel(
                  overview.settings.websiteBindingStatus
                )}
              </span>
            </div>
          </div>
        </section>

        {
        
        
        /* =====================================================
            WEBSITE CONFIGURATION
            ===================================================== */}

<section className="mt-10">
  <WebsiteConfigurationForm canEdit={canEdit} />
</section>

{/* =====================================================
    WEBSITE BRANDING
    ===================================================== */}

<section className="mt-10">
  <WebsiteBrandingForm canEdit={canEdit} />
</section>

        {/* =====================================================
            WORKSPACE CONTEXT
            ===================================================== */}

        <section className="mt-10">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                  Workspace
                </p>

                <h2 className="mt-2 text-xl font-bold text-slate-950">
                  {overview.workspace.name}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {overview.workspace.slug}
                </p>

                <p className="mt-3 text-sm text-slate-500">
                  Website settings are tenant-scoped to this workspace.
                </p>
              </div>

              <Link
                href="/app/workspace"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Customer Workspace
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* =====================================================
            FOOTER
            ===================================================== */}

        <footer className="mt-10 border-t border-slate-200 pt-6">
          <div className="flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span className="font-semibold text-slate-700">
              ROOTYM Website Settings
            </span>

            <Link
              href="/app/workspace"
              className="inline-flex items-center gap-1.5 transition hover:text-slate-900"
            >
              Customer Workspace
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}