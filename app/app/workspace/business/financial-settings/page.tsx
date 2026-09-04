/**
 * ============================================================
 * ROOTYM Business Financial Settings Page
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the tenant-scoped Financial Settings
 *          workspace for currency, payment terms, banking
 *          and foreign-remittance configuration.
 * ============================================================
 */

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowRightLeft,
  Banknote,
  Building2,
  CheckCircle2,
  ChevronRight,
  Globe2,
  Landmark,
  Settings2,
  WalletCards,
} from "lucide-react";

import { requireWorkspaceAccess } from "@/app/lib/workspace/require-workspace-access";
import { getBusinessFinancialSettings } from "@/app/lib/workspace/business/business-financial-settings.service";
import BusinessFinancialSettingsForm from "./BusinessFinancialSettingsForm";

export default async function BusinessFinancialSettingsPage() {
  const { tenant, membership } = await requireWorkspaceAccess();

  const settings = await getBusinessFinancialSettings();

  const canEdit =
    membership.role === "OWNER" || membership.role === "ADMIN";

  const initialData = settings
    ? {
        baseCurrency: settings.baseCurrency ?? "",
        defaultInvoiceCurrency:
          settings.defaultInvoiceCurrency ?? "",
        currencyNotes: settings.currencyNotes ?? "",

        defaultPaymentTermsDays:
          settings.defaultPaymentTermsDays ?? undefined,
        defaultPaymentMethod:
          settings.defaultPaymentMethod ?? "",
        paymentTermsNotes:
          settings.paymentTermsNotes ?? "",

        beneficiaryName:
          settings.beneficiaryName ?? "",
        bankName:
          settings.bankName ?? "",
        branchName:
          settings.branchName ?? "",
        accountNumber:
          settings.accountNumber ?? "",
        accountCurrency:
          settings.accountCurrency ?? "",
        ifscCode:
          settings.ifscCode ?? "",
        swiftBic:
          settings.swiftBic ?? "",
        iban:
          settings.iban ?? "",
        bankAddress:
          settings.bankAddress ?? "",
        bankCountry:
          settings.bankCountry ?? "",

        remittanceBankName:
          settings.remittanceBankName ?? "",
        remittanceBankSwiftBic:
          settings.remittanceBankSwiftBic ?? "",

        correspondentBankName:
          settings.correspondentBankName ?? "",
        correspondentBankSwiftBic:
          settings.correspondentBankSwiftBic ?? "",

        intermediaryBankName:
          settings.intermediaryBankName ?? "",
        intermediaryBankSwiftBic:
          settings.intermediaryBankSwiftBic ?? "",

        foreignBankAccountNumber:
          settings.foreignBankAccountNumber ?? "",
        foreignBankIban:
          settings.foreignBankIban ?? "",
        routingOrSortCode:
          settings.routingOrSortCode ?? "",

        remittanceCurrency:
          settings.remittanceCurrency ?? "",
        rbiPurposeCode:
          settings.rbiPurposeCode ?? "",

        foreignRemittanceInstructions:
          settings.foreignRemittanceInstructions ?? "",
        remittanceReferenceInstructions:
          settings.remittanceReferenceInstructions ?? "",

        bankChargesArrangement:
          settings.bankChargesArrangement ?? "",

        foreignRemittanceNotes:
          settings.foreignRemittanceNotes ?? "",
      }
    : null;

  const configuredSections = [
    Boolean(
      settings?.baseCurrency ||
        settings?.defaultInvoiceCurrency,
    ),
    Boolean(
      settings?.defaultPaymentTermsDays !== null ||
        settings?.defaultPaymentMethod,
    ),
    Boolean(
      settings?.beneficiaryName ||
        settings?.bankName ||
        settings?.accountNumber ||
        settings?.swiftBic ||
        settings?.iban,
    ),
    Boolean(
      settings?.remittanceBankName ||
        settings?.correspondentBankName ||
        settings?.intermediaryBankName ||
        settings?.foreignBankAccountNumber ||
        settings?.foreignBankIban ||
        settings?.rbiPurposeCode,
    ),
  ].filter(Boolean).length;

  const configurationStatus =
    configuredSections === 0
      ? "Not Configured"
      : configuredSections === 4
        ? "Configured"
        : "Partially Configured";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ======================================================
          Top Navigation
          ====================================================== */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
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

          <nav className="flex items-center gap-3">
            <Link
              href="/app/workspace/business"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Business Configuration
            </Link>

            <Link
              href="/app/settings"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <Settings2 className="h-4 w-4" />
              Settings
            </Link>
          </nav>
        </div>
      </header>

      {/* ======================================================
          Module Hero
          ====================================================== */}
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="mb-5">
            <Link
              href="/app/workspace/business"
              className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Business Configuration
            </Link>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-400">
                <WalletCards className="h-4 w-4" />
                Business Configuration
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Financial Settings
              </h1>

              <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">
                Configure business currency, payment terms,
                beneficiary banking information and foreign
                remittance details used across the export
                operations workspace.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-800 bg-emerald-950/60 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Available
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300">
                {canEdit ? "Edit Access" : "View Only"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          Main Content
          ====================================================== */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* ====================================================
            Status Section
            ==================================================== */}
        <section className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Financial Configuration Status
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Review the current configuration status for
                this tenant.
              </p>
            </div>

            <span
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                configurationStatus === "Configured"
                  ? "bg-emerald-100 text-emerald-700"
                  : configurationStatus ===
                      "Partially Configured"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-slate-200 text-slate-600"
              }`}
            >
              {configurationStatus}
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {/* Currency */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <Globe2 className="h-5 w-5 text-slate-700" />
              </div>

              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Currency
              </p>

              <p className="mt-1 text-lg font-semibold text-slate-900">
                {settings?.baseCurrency ||
                  settings?.defaultInvoiceCurrency ||
                  "Not Set"}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Base / invoice currency
              </p>
            </div>

            {/* Payment Terms */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <Banknote className="h-5 w-5 text-slate-700" />
              </div>

              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Payment Terms
              </p>

              <p className="mt-1 text-lg font-semibold text-slate-900">
                {settings?.defaultPaymentTermsDays !==
                null &&
                settings?.defaultPaymentTermsDays !==
                  undefined
                  ? `${settings.defaultPaymentTermsDays} Days`
                  : "Not Set"}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Default credit period
              </p>
            </div>

            {/* Bank */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <Landmark className="h-5 w-5 text-slate-700" />
              </div>

              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Beneficiary Bank
              </p>

              <p className="mt-1 truncate text-lg font-semibold text-slate-900">
                {settings?.bankName || "Not Set"}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Primary business bank
              </p>
            </div>

            {/* Remittance */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <ArrowRightLeft className="h-5 w-5 text-slate-700" />
              </div>

              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Remittance
              </p>

              <p className="mt-1 truncate text-lg font-semibold text-slate-900">
                {settings?.remittanceCurrency ||
                  "Not Set"}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Foreign remittance currency
              </p>
            </div>
          </div>
        </section>

        {/* ====================================================
            Configuration Section
            ==================================================== */}
        <section className="mb-8">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-slate-900">
              Financial Settings Configuration
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Maintain the financial information used by the
              business for domestic and international export
              transactions.
            </p>
          </div>

          <BusinessFinancialSettingsForm
            initialData={initialData}
            canEdit={canEdit}
          />
        </section>

        {/* ====================================================
            Tenant Record
            ==================================================== */}
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Tenant Financial Record
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Financial Settings are maintained independently
              for the authenticated workspace tenant.
            </p>
          </div>

          <div className="grid gap-5 px-6 py-6 md:grid-cols-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Tenant
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {tenant.name}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Configuration Record
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {settings ? "Existing" : "Not Created"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Access
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {canEdit ? "Editable" : "View Only"}
              </p>
            </div>
          </div>
        </section>

        {/* ====================================================
            Module Navigation
            ==================================================== */}
        <section className="rounded-2xl bg-slate-950 p-6 text-white">
          <div className="mb-5">
            <h2 className="text-lg font-semibold">
              Business Configuration
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Continue configuring the other business
              settings.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Link
              href="/app/workspace/business/tax-compliance"
              className="group flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-4 py-4 transition hover:border-slate-600 hover:bg-slate-800"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800">
                  <CheckCircle2 className="h-4 w-4 text-slate-300" />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Tax &amp; Compliance
                  </p>
                  <p className="text-xs text-slate-400">
                    Tax and compliance configuration
                  </p>
                </div>
              </div>

              <ChevronRight className="h-4 w-4 text-slate-500 transition group-hover:translate-x-1 group-hover:text-white" />
            </Link>

            <Link
              href="/app/workspace/business/export-credentials"
              className="group flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-4 py-4 transition hover:border-slate-600 hover:bg-slate-800"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800">
                  <Globe2 className="h-4 w-4 text-slate-300" />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Export Credentials
                  </p>
                  <p className="text-xs text-slate-400">
                    Export registrations and credentials
                  </p>
                </div>
              </div>

              <ChevronRight className="h-4 w-4 text-slate-500 transition group-hover:translate-x-1 group-hover:text-white" />
            </Link>

            <Link
              href="/app/workspace/business"
              className="group flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-4 py-4 transition hover:border-slate-600 hover:bg-slate-800 md:col-span-2"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800">
                  <WalletCards className="h-4 w-4 text-slate-300" />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    All Business Configuration
                  </p>
                  <p className="text-xs text-slate-400">
                    Return to the Business Configuration
                    workspace
                  </p>
                </div>
              </div>

              <ArrowRight className="h-4 w-4 text-slate-500 transition group-hover:translate-x-1 group-hover:text-white" />
            </Link>
          </div>
        </section>
      </main>

      {/* ======================================================
          Footer
          ====================================================== */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div>
            ROOTYM Global ExportOS
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/app/workspace/business"
              className="inline-flex items-center gap-1 transition hover:text-slate-900"
            >
              Business Configuration
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>

            <Link
              href="/app/settings"
              className="transition hover:text-slate-900"
            >
              Settings
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}