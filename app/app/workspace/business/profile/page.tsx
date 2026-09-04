/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the authenticated Business Profile view and
 *          connects authorized workspace members to the profile
 *          create and update form.
 * ============================================================
 */

import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  CircleUserRound,
  Globe2,
  LayoutDashboard,
  Mail,
  MapPin,
  Phone,
  Settings,
  ShieldCheck,
} from "lucide-react";

import { getBusinessProfile } from "@/app/lib/workspace/business/business-profile.service";
import BusinessProfileForm from "./BusinessProfileForm";

function displayValue(value: string | null | undefined) {
  if (!value) {
    return "Not configured";
  }

  return value;
}

export default async function BusinessProfilePage() {
  const { membership } = await import(
    "@/app/lib/workspace/require-workspace-access"
  ).then(({ requireWorkspaceAccess }) =>
    requireWorkspaceAccess()
  );

  const businessProfile = await getBusinessProfile();

  const canEdit =
    membership.role === "OWNER" ||
    membership.role === "ADMIN";

  const formInitialData = businessProfile
    ? {
        businessName: businessProfile.businessName,
        legalName: businessProfile.legalName ?? "",
        businessType: businessProfile.businessType ?? "",
        email: businessProfile.email ?? "",
        phone: businessProfile.phone ?? "",
        country: businessProfile.country ?? "",
        website: businessProfile.website ?? "",
        description: businessProfile.description ?? "",
      }
    : null;

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
                <Building2 className="h-5 w-5 text-white" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                  ROOTYM
                </p>

                <p className="text-lg font-bold">
                  Business Profile
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/app/workspace/business"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Business Configuration
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
                <Building2 className="h-4 w-4" />
                Business Configuration
              </div>

              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Business Profile
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Manage the business identity and primary business
                information associated with your ROOTYM workspace.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/10">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              {canEdit ? "Edit Access" : "View Only"}
            </div>
          </div>
        </section>

        {/* =====================================================
            BUSINESS PROFILE FORM
            ===================================================== */}

        <section className="mt-8">
          <BusinessProfileForm
            initialData={formInitialData}
            canEdit={canEdit}
          />
        </section>

        {/* =====================================================
            BUSINESS PROFILE STATUS
            ===================================================== */}

        <section className="mt-8">
          <div
            className={`rounded-3xl border p-7 sm:p-8 ${
              businessProfile
                ? "border-emerald-100 bg-emerald-50"
                : "border-amber-100 bg-amber-50"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200">
                <Building2 className="h-5 w-5 text-slate-700" />
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-600">
                  Profile Status
                </p>

                <h2 className="mt-2 text-xl font-bold text-slate-900">
                  {businessProfile
                    ? "Business profile configured"
                    : "Business profile not configured"}
                </h2>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                  {businessProfile
                    ? "Your workspace has a tenant-scoped business profile."
                    : "No business profile has been created for this workspace yet. Use the form above to configure the business information."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            BUSINESS IDENTITY
            ===================================================== */}

        <section className="mt-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
              Business Identity
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              Core business information
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              This information belongs to the authenticated ROOTYM
              workspace and will become the trusted business identity
              used by future ROOTYM applications.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-emerald-600" />

                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Business Name
                </p>
              </div>

              <p className="mt-4 text-xl font-bold">
                {displayValue(businessProfile?.businessName)}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-3">
                <CircleUserRound className="h-5 w-5 text-emerald-600" />

                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Legal Name
                </p>
              </div>

              <p className="mt-4 text-xl font-bold">
                {displayValue(businessProfile?.legalName)}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-emerald-600" />

                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Business Type
                </p>
              </div>

              <p className="mt-4 text-xl font-bold">
                {displayValue(businessProfile?.businessType)}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-emerald-600" />

                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Country
                </p>
              </div>

              <p className="mt-4 text-xl font-bold">
                {displayValue(businessProfile?.country)}
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            CONTACT INFORMATION
            ===================================================== */}

        <section className="mt-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
              Contact Information
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              Primary business contacts
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
              <Mail className="h-5 w-5 text-emerald-600" />

              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Business Email
              </p>

              <p className="mt-2 break-words text-base font-bold">
                {displayValue(businessProfile?.email)}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
              <Phone className="h-5 w-5 text-emerald-600" />

              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Business Phone
              </p>

              <p className="mt-2 text-base font-bold">
                {displayValue(businessProfile?.phone)}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
              <Globe2 className="h-5 w-5 text-emerald-600" />

              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Website
              </p>

              <p className="mt-2 break-words text-base font-bold">
                {displayValue(businessProfile?.website)}
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            BUSINESS DESCRIPTION
            ===================================================== */}

        <section className="mt-8">
          <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 ring-1 ring-emerald-100">
                <Building2 className="h-5 w-5 text-emerald-600" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
                  Business Description
                </p>

                <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                  {displayValue(businessProfile?.description)}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            PROFILE RECORD
            ===================================================== */}

        {businessProfile && (
          <section className="mt-8">
            <div className="rounded-3xl border border-slate-200 bg-slate-100 p-7 sm:p-8">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Profile ID
                  </p>

                  <p className="mt-2 break-all font-mono text-sm text-slate-700">
                    {businessProfile.id}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Workspace ID
                  </p>

                  <p className="mt-2 break-all font-mono text-sm text-slate-700">
                    {businessProfile.tenantId}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =====================================================
            NAVIGATION
            ===================================================== */}

        <section className="mt-8">
          <div className="rounded-3xl bg-slate-950 p-7 text-white shadow-sm sm:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-400">
                  Business Configuration
                </p>

                <h2 className="mt-2 text-xl font-bold">
                  Continue configuring your workspace
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                  Additional company, compliance, export and operating
                  configuration will be added progressively.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/app/workspace/business"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Business Configuration
                </Link>

                <Link
                  href="/app/workspace"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Workspace Home
                </Link>
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
                ROOTYM Business Profile
              </span>

              <span className="ml-2">
                · Authenticated Customer Workspace
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-5">
              <Link
                href="/app/workspace/business"
                className="inline-flex items-center gap-1.5 transition hover:text-slate-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Business Configuration
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