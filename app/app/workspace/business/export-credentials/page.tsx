/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the authenticated tenant-scoped Export
 *          Credentials configuration view for the customer
 *          workspace.
 * ============================================================
 */

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  Globe2,
  LayoutDashboard,
  Settings,
  ShieldCheck,
} from "lucide-react";

import BusinessExportCredentialsForm from "./BusinessExportCredentialsForm";

import { getBusinessExportCredentials } from "@/app/lib/workspace/business/business-export-credentials.service";
import { requireWorkspaceAccess } from "@/app/lib/workspace/require-workspace-access";

function displayValue(
  value: string | null | undefined,
) {
  if (!value) {
    return "Not configured";
  }

  return value;
}

function displayDate(
  value: Date | string | null | undefined,
) {
  if (!value) {
    return "Not configured";
  }

  const date =
    value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not configured";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function BusinessExportCredentialsPage() {
  const workspace = await requireWorkspaceAccess();
  const { membership } = workspace;

  const exportCredentials =
    await getBusinessExportCredentials();

  const canEdit =
    membership.role === "OWNER" ||
    membership.role === "ADMIN";

  const initialData = {
    iecNumber: exportCredentials?.iecNumber ?? "",
    iecStatus: exportCredentials?.iecStatus ?? "",
    iecIssueDate:
      exportCredentials?.iecIssueDate
        ? new Date(
            exportCredentials.iecIssueDate,
          )
            .toISOString()
            .split("T")[0]
        : "",
    dgftProfileUrl:
      exportCredentials?.dgftProfileUrl ?? "",

    gstin: exportCredentials?.gstin ?? "",
    gstStatus: exportCredentials?.gstStatus ?? "",
    gstRegistrationDate:
      exportCredentials?.gstRegistrationDate
        ? new Date(
            exportCredentials.gstRegistrationDate,
          )
            .toISOString()
            .split("T")[0]
        : "",

    udyamNumber:
      exportCredentials?.udyamNumber ?? "",
    udyamStatus:
      exportCredentials?.udyamStatus ?? "",
    udyamRegistrationDate:
      exportCredentials?.udyamRegistrationDate
        ? new Date(
            exportCredentials.udyamRegistrationDate,
          )
            .toISOString()
            .split("T")[0]
        : "",

    adCode: exportCredentials?.adCode ?? "",
    adCodeStatus:
      exportCredentials?.adCodeStatus ?? "",
    adCodeBankName:
      exportCredentials?.adCodeBankName ?? "",

    icegateRegistrationId:
      exportCredentials?.icegateRegistrationId ?? "",
    icegateStatus:
      exportCredentials?.icegateStatus ?? "",

    rcmcNumber:
      exportCredentials?.rcmcNumber ?? "",
    rcmcIssuingAuthority:
      exportCredentials?.rcmcIssuingAuthority ?? "",
    rcmcStatus:
      exportCredentials?.rcmcStatus ?? "",
    rcmcIssueDate:
      exportCredentials?.rcmcIssueDate
        ? new Date(
            exportCredentials.rcmcIssueDate,
          )
            .toISOString()
            .split("T")[0]
        : "",
    rcmcExpiryDate:
      exportCredentials?.rcmcExpiryDate
        ? new Date(
            exportCredentials.rcmcExpiryDate,
          )
            .toISOString()
            .split("T")[0]
        : "",

    otherLicense1Name:
      exportCredentials?.otherLicense1Name ?? "",
    otherLicense1Number:
      exportCredentials?.otherLicense1Number ?? "",
    otherLicense1Status:
      exportCredentials?.otherLicense1Status ?? "",
    otherLicense1ExpiryDate:
      exportCredentials?.otherLicense1ExpiryDate
        ? new Date(
            exportCredentials.otherLicense1ExpiryDate,
          )
            .toISOString()
            .split("T")[0]
        : "",

    otherLicense2Name:
      exportCredentials?.otherLicense2Name ?? "",
    otherLicense2Number:
      exportCredentials?.otherLicense2Number ?? "",
    otherLicense2Status:
      exportCredentials?.otherLicense2Status ?? "",
    otherLicense2ExpiryDate:
      exportCredentials?.otherLicense2ExpiryDate
        ? new Date(
            exportCredentials.otherLicense2ExpiryDate,
          )
            .toISOString()
            .split("T")[0]
        : "",

    otherLicense3Name:
      exportCredentials?.otherLicense3Name ?? "",
    otherLicense3Number:
      exportCredentials?.otherLicense3Number ?? "",
    otherLicense3Status:
      exportCredentials?.otherLicense3Status ?? "",
    otherLicense3ExpiryDate:
      exportCredentials?.otherLicense3ExpiryDate
        ? new Date(
            exportCredentials.otherLicense3ExpiryDate,
          )
            .toISOString()
            .split("T")[0]
        : "",

    notes: exportCredentials?.notes ?? "",
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
                <Globe2 className="h-5 w-5 text-white" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                  ROOTYM
                </p>

                <p className="text-lg font-bold">
                  Export Credentials
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
                <Globe2 className="h-4 w-4" />
                Business Configuration
              </div>

              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Export Credentials
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Manage export registrations, business
                credentials and regulatory identification
                information associated with your ROOTYM
                workspace.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/10">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              {canEdit ? "Edit Access" : "View Only"}
            </div>
          </div>
        </section>

        {/* =====================================================
            EXPORT CREDENTIALS FORM
            ===================================================== */}

        <section className="mt-8">
          <BusinessExportCredentialsForm
            initialData={initialData}
            canEdit={canEdit}
          />
        </section>

        {/* =====================================================
            CREDENTIAL STATUS
            ===================================================== */}

        <section className="mt-8">
          <div
            className={`rounded-3xl border p-7 sm:p-8 ${
              exportCredentials
                ? "border-emerald-100 bg-emerald-50"
                : "border-amber-100 bg-amber-50"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200">
                {exportCredentials ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                ) : (
                  <FileCheck2 className="h-5 w-5 text-slate-700" />
                )}
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-600">
                  Credential Status
                </p>

                <h2 className="mt-2 text-xl font-bold text-slate-900">
                  {exportCredentials
                    ? "Export credentials configured"
                    : "Export credentials not configured"}
                </h2>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                  {exportCredentials
                    ? "Your workspace has a tenant-scoped export credentials record."
                    : "No export credentials record has been created for this workspace yet. Use the configuration form above to add the required information."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            CREDENTIAL SUMMARY
            ===================================================== */}

        <section className="mt-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
              Credential Summary
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              Registered export information
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              A read-only summary of the principal export and
              registration identifiers configured for this
              workspace.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
                IEC Number
              </p>

              <p className="mt-4 text-xl font-bold">
                {displayValue(
                  exportCredentials?.iecNumber,
                )}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Status:{" "}
                {displayValue(
                  exportCredentials?.iecStatus,
                )}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
                GSTIN
              </p>

              <p className="mt-4 text-xl font-bold">
                {displayValue(
                  exportCredentials?.gstin,
                )}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Status:{" "}
                {displayValue(
                  exportCredentials?.gstStatus,
                )}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
                UDYAM Number
              </p>

              <p className="mt-4 text-xl font-bold">
                {displayValue(
                  exportCredentials?.udyamNumber,
                )}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Status:{" "}
                {displayValue(
                  exportCredentials?.udyamStatus,
                )}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
                AD Code
              </p>

              <p className="mt-4 text-xl font-bold">
                {displayValue(
                  exportCredentials?.adCode,
                )}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Bank:{" "}
                {displayValue(
                  exportCredentials?.adCodeBankName,
                )}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
                ICEGATE Registration
              </p>

              <p className="mt-4 text-xl font-bold">
                {displayValue(
                  exportCredentials?.icegateRegistrationId,
                )}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Status:{" "}
                {displayValue(
                  exportCredentials?.icegateStatus,
                )}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
                RCMC Number
              </p>

              <p className="mt-4 text-xl font-bold">
                {displayValue(
                  exportCredentials?.rcmcNumber,
                )}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Status:{" "}
                {displayValue(
                  exportCredentials?.rcmcStatus,
                )}
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            VALIDITY INFORMATION
            ===================================================== */}

        <section className="mt-8">
          <div className="rounded-3xl border border-slate-200 bg-slate-100 p-7 sm:p-8">
            <div className="mb-5">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
                Registration Dates
              </p>

              <h2 className="mt-2 text-xl font-bold text-slate-900">
                Credential validity information
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  IEC Issue Date
                </p>

                <p className="mt-2 text-sm font-medium text-slate-700">
                  {displayDate(
                    exportCredentials?.iecIssueDate,
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  GST Registration Date
                </p>

                <p className="mt-2 text-sm font-medium text-slate-700">
                  {displayDate(
                    exportCredentials?.gstRegistrationDate,
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  UDYAM Registration Date
                </p>

                <p className="mt-2 text-sm font-medium text-slate-700">
                  {displayDate(
                    exportCredentials?.udyamRegistrationDate,
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  RCMC Expiry Date
                </p>

                <p className="mt-2 text-sm font-medium text-slate-700">
                  {displayDate(
                    exportCredentials?.rcmcExpiryDate,
                  )}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            EXPORT CREDENTIALS RECORD
            ===================================================== */}

        {exportCredentials && (
          <section className="mt-8">
            <div className="rounded-3xl border border-slate-200 bg-slate-100 p-7 sm:p-8">
              <div className="mb-5">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
                  Export Credentials Record
                </p>

                <h2 className="mt-2 text-xl font-bold text-slate-900">
                  Tenant-scoped credential record
                </h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Credential ID
                  </p>

                  <p className="mt-2 break-all font-mono text-sm text-slate-700">
                    {exportCredentials.id}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Workspace ID
                  </p>

                  <p className="mt-2 break-all font-mono text-sm text-slate-700">
                    {exportCredentials.tenantId}
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
                  Return to Business Configuration to continue
                  setting up your company profile, compliance,
                  export and operating configuration.
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
                ROOTYM Export Credentials
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