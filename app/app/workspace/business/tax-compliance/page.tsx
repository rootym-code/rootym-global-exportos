/**
 * ============================================================
 * ROOTYM Business Tax & Compliance Page
 * ============================================================
 * Author: Prem Singh
 * Purpose: Displays authenticated tenant-scoped Tax &
 *          Compliance configuration within Business Settings.
 * ============================================================
 */

import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  FileCheck2,
  Globe2,
  ShieldCheck,
} from "lucide-react";

import BusinessTaxComplianceForm from "./BusinessTaxComplianceForm";

import { getBusinessTaxCompliance } from "@/app/lib/workspace/business/business-tax-compliance.service";
import { requireWorkspaceAccess } from "@/app/lib/workspace/require-workspace-access";

function formatDate(value: Date | string | null | undefined) {
  if (!value) {
    return "Not configured";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not configured";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function BusinessTaxCompliancePage() {
  const { tenant, membership } = await requireWorkspaceAccess();
  const data = await getBusinessTaxCompliance();

  const canEdit =
    membership.role === "OWNER" || membership.role === "ADMIN";

  const configured = Boolean(data);

  const complianceStatus = data?.complianceStatus || "Not configured";
  const lutBondStatus = data?.lutBondStatus || "Not configured";
  const gstTreatment = data?.gstExportTreatment || "Not configured";

  const defaultTaxRate =
    data?.defaultTaxRate !== null &&
    data?.defaultTaxRate !== undefined
      ? `${data.defaultTaxRate.toString()}%`
      : "Not configured";

  const initialData = data
    ? {
        gstRegistrationType: data.gstRegistrationType ?? "",
        gstExportTreatment: data.gstExportTreatment ?? "",
        defaultTaxRate:
        data.defaultTaxRate === null ||
        data.defaultTaxRate === undefined
          ? undefined
          : Number(data.defaultTaxRate),
        taxNotes: data.taxNotes ?? "",

        lutBondStatus: data.lutBondStatus ?? "",
        lutBondNumber: data.lutBondNumber ?? "",
        lutBondFinancialYear: data.lutBondFinancialYear ?? "",
        lutBondIssueDate: data.lutBondIssueDate
          ? data.lutBondIssueDate.toISOString().slice(0, 10)
          : "",
        lutBondExpiryDate: data.lutBondExpiryDate
          ? data.lutBondExpiryDate.toISOString().slice(0, 10)
          : "",

        tdsApplicable: data.tdsApplicable,
        tdsNotes: data.tdsNotes ?? "",

        tcsApplicable: data.tcsApplicable,
        tcsNotes: data.tcsNotes ?? "",

        complianceStatus: data.complianceStatus ?? "",
        nextComplianceDate: data.nextComplianceDate
          ? data.nextComplianceDate.toISOString().slice(0, 10)
          : "",
        complianceNotes: data.complianceNotes ?? "",
      }
    : null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ======================================================
          Top Navigation
          ====================================================== */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/app/workspace/business"
              className="flex items-center gap-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
                <Building2 className="h-5 w-5" />
              </div>

              <div>
                <div className="text-sm font-bold tracking-wide text-slate-900">
                  ROOTYM
                </div>
                <div className="text-xs text-slate-500">
                  Global ExportOS
                </div>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <Link
              href="/app/workspace/business"
              className="text-slate-600 transition hover:text-slate-900"
            >
              Business Configuration
            </Link>

            <Link
              href="/app/workspace/settings"
              className="text-slate-600 transition hover:text-slate-900"
            >
              Settings
            </Link>
          </div>
        </div>
      </header>

      {/* ======================================================
          Hero
          ====================================================== */}

      <section className="bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="mb-4 flex items-center gap-2 text-sm text-slate-300">
            <Link
              href="/app/workspace/business"
              className="transition hover:text-white"
            >
              Business Configuration
            </Link>
            <span>/</span>
            <span>Tax & Compliance</span>
          </div>

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                <FileCheck2 className="h-6 w-6" />
              </div>

              <h1 className="text-3xl font-bold tracking-tight">
                Tax & Compliance
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Configure GST treatment, export tax handling, LUT/Bond
                information and business compliance settings for this tenant.
              </p>
            </div>

            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-200">
                {canEdit ? (
                  <>
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Editable
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-3.5 w-3.5" />
                    View Only
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          Main Content
          ====================================================== */}

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Status */}

        <section className="mb-8">
          <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                <CheckCircle2 className="h-5 w-5 text-slate-700" />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Configuration Status
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {configured
                    ? "Tax & Compliance configuration is available for this business."
                    : "No Tax & Compliance configuration has been saved yet."}
                </p>
              </div>
            </div>

            <div className="text-sm font-medium text-slate-700">
              {configured ? "Configured" : "Not Configured"}
            </div>
          </div>
        </section>

        {/* Summary Cards */}

        <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
              GST Export Treatment
            </div>
            <div className="mt-2 text-sm font-semibold text-slate-900">
              {gstTreatment}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Default Tax Rate
            </div>
            <div className="mt-2 text-sm font-semibold text-slate-900">
              {defaultTaxRate}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
              LUT / Bond
            </div>
            <div className="mt-2 text-sm font-semibold text-slate-900">
              {lutBondStatus}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Compliance
            </div>
            <div className="mt-2 text-sm font-semibold text-slate-900">
              {complianceStatus}
            </div>
          </div>
        </section>

        {/* Configuration */}

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Tax & Compliance Configuration
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Maintain the tax and compliance preferences used by the
              business workspace.
            </p>
          </div>

          <div className="p-6">
            <BusinessTaxComplianceForm
              initialData={initialData}
              canEdit={canEdit}
            />
          </div>
        </section>

        {/* Record Information */}

        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
              <FileCheck2 className="h-5 w-5 text-slate-700" />
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Tenant Configuration Record
              </h2>
              <p className="text-sm text-slate-500">
                Tax & Compliance settings are isolated to the authenticated
                business tenant.
              </p>
            </div>
          </div>

          <div className="grid gap-5 text-sm md:grid-cols-3">
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Tenant
              </div>
              <div className="mt-1 font-medium text-slate-900">
                {tenant.name}
              </div>
            </div>

            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Next Compliance Date
              </div>
              <div className="mt-1 font-medium text-slate-900">
                {formatDate(data?.nextComplianceDate)}
              </div>
            </div>

            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Last Updated
              </div>
              <div className="mt-1 font-medium text-slate-900">
                {formatDate(data?.updatedAt)}
              </div>
            </div>
          </div>
        </section>

        {/* Navigation */}

        <section className="mt-8 rounded-xl bg-slate-900 p-6 text-white">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <h2 className="text-base font-semibold">
                Business Configuration
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Continue configuring other business settings.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/app/workspace/business/export-credentials"
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
              >
                <Globe2 className="h-4 w-4" />
                Export Credentials
              </Link>

              <Link
                href="/app/workspace/business"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                <ArrowLeft className="h-4 w-4" />
                All Business Settings
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ======================================================
          Footer
          ====================================================== */}

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <div>
            ROOTYM Global ExportOS — Business Configuration
          </div>

          <div>
            Tenant-scoped configuration
          </div>
        </div>
      </footer>
    </div>
  );
}