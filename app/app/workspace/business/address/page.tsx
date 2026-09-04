/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the authenticated tenant-scoped Business
 *          Address configuration view for the customer workspace.
 * ============================================================
 */

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  LayoutDashboard,
  MapPin,
  Settings,
  ShieldCheck,
} from "lucide-react";

import BusinessAddressForm from "./BusinessAddressForm";

import getBusinessAddress from "@/app/lib/workspace/business/business-address.service";
import { requireWorkspaceAccess } from "@/app/lib/workspace/require-workspace-access";

function displayValue(value: string | null | undefined) {
  if (!value) {
    return "Not configured";
  }

  return value;
}

export default async function BusinessAddressPage() {
  const workspace = await requireWorkspaceAccess();
  const { membership } = workspace;

  const businessAddress = await getBusinessAddress();

  const canEdit =
    membership.role === "OWNER" ||
    membership.role === "ADMIN";

  const initialData = {
    addressLine1: businessAddress?.addressLine1 ?? "",
    addressLine2: businessAddress?.addressLine2 ?? "",
    city: businessAddress?.city ?? "",
    state: businessAddress?.state ?? "",
    postalCode: businessAddress?.postalCode ?? "",
    country: businessAddress?.country ?? "",
  };

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
                <MapPin className="h-5 w-5 text-white" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                  ROOTYM
                </p>

                <p className="text-lg font-bold">
                  Business Address
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
                Business Address
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Manage the primary business address associated with
                your ROOTYM workspace.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/10">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Authenticated Workspace
            </div>
          </div>
        </section>

        {/* =====================================================
            ADDRESS STATUS
            ===================================================== */}

        <section className="mt-8">
          <div
            className={`rounded-3xl border p-7 sm:p-8 ${
              businessAddress
                ? "border-emerald-100 bg-emerald-50"
                : "border-amber-100 bg-amber-50"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200">
                {businessAddress ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                ) : (
                  <MapPin className="h-5 w-5 text-slate-700" />
                )}
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-600">
                  Address Status
                </p>

                <h2 className="mt-2 text-xl font-bold text-slate-900">
                  {businessAddress
                    ? "Business address configured"
                    : "Business address not configured"}
                </h2>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                  {businessAddress
                    ? "Your workspace has a tenant-scoped primary business address."
                    : "No primary business address has been created for this workspace yet."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            BUSINESS LOCATION
            ===================================================== */}

        <section className="mt-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
              Business Location
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              Primary business address
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              This address belongs to the authenticated ROOTYM
              workspace and will become the trusted primary business
              location used by future ROOTYM applications.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-emerald-600" />

                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Address Line 1
                </p>
              </div>

              <p className="mt-4 text-xl font-bold">
                {displayValue(businessAddress?.addressLine1)}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-emerald-600" />

                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Address Line 2
                </p>
              </div>

              <p className="mt-4 text-xl font-bold">
                {displayValue(businessAddress?.addressLine2)}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-emerald-600" />

                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
                  City
                </p>
              </div>

              <p className="mt-4 text-xl font-bold">
                {displayValue(businessAddress?.city)}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-emerald-600" />

                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
                  State
                </p>
              </div>

              <p className="mt-4 text-xl font-bold">
                {displayValue(businessAddress?.state)}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-emerald-600" />

                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Postal Code
                </p>
              </div>

              <p className="mt-4 text-xl font-bold">
                {displayValue(businessAddress?.postalCode)}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-emerald-600" />

                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Country
                </p>
              </div>

              <p className="mt-4 text-xl font-bold">
                {displayValue(businessAddress?.country)}
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            ADDRESS CONFIGURATION
            ===================================================== */}

        <section className="mt-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
              Address Configuration
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              Update your business address
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Authorized workspace users can update the primary
              business address below.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 sm:p-8">
            <BusinessAddressForm
              initialData={initialData}
              canEdit={canEdit}
            />
          </div>
        </section>

        {/* =====================================================
            ADDRESS RECORD
            ===================================================== */}

        {businessAddress && (
          <section className="mt-8">
            <div className="rounded-3xl border border-slate-200 bg-slate-100 p-7 sm:p-8">
              <div className="mb-5">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
                  Address Record
                </p>

                <h2 className="mt-2 text-xl font-bold text-slate-900">
                  Tenant-scoped address record
                </h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Address ID
                  </p>

                  <p className="mt-2 break-all font-mono text-sm text-slate-700">
                    {businessAddress.id}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Workspace ID
                  </p>

                  <p className="mt-2 break-all font-mono text-sm text-slate-700">
                    {businessAddress.tenantId}
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
                  Return to Business Configuration to continue setting
                  up your company profile, compliance, export and
                  operating configuration.
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
                ROOTYM Business Address
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