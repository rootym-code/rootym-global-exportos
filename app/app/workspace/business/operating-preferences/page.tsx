/**
 * ============================================================
 * ROOTYM Business Operating Preferences Page
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the tenant-scoped Operating Preferences
 *          workspace for operational, document, shipment,
 *          workflow and working preferences.
 * ============================================================
 */

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  FileText,
  Globe2,
  ListChecks,
  Settings2,
  Truck,
  UsersRound,
  WalletCards,
} from "lucide-react";

import { requireWorkspaceAccess } from "@/app/lib/workspace/require-workspace-access";
import { getBusinessOperatingPreferences } from "@/app/lib/workspace/business/business-operating-preferences.service";
import BusinessOperatingPreferencesForm from "./BusinessOperatingPreferencesForm";

export default async function BusinessOperatingPreferencesPage() {
  const { tenant, membership } =
    await requireWorkspaceAccess();

  const preferences =
    await getBusinessOperatingPreferences();

  const canEdit =
    membership.role === "OWNER" ||
    membership.role === "ADMIN";

  const initialData = preferences
    ? {
        // Order & Export Operations
        defaultOrderProcessingPriority:
          preferences.defaultOrderProcessingPriority ?? "",
        defaultShipmentMode:
          preferences.defaultShipmentMode ?? "",
        defaultIncoterm:
          preferences.defaultIncoterm ?? "",
        defaultPortOfLoading:
          preferences.defaultPortOfLoading ?? "",
        defaultDestinationHandling:
          preferences.defaultDestinationHandling ?? "",
        allowPartialShipment:
          preferences.allowPartialShipment ?? false,
        allowSplitShipment:
          preferences.allowSplitShipment ?? false,

        // Document Preferences
        defaultDocumentLanguage:
          preferences.defaultDocumentLanguage ?? "",
        documentNumberingPreference:
          preferences.documentNumberingPreference ?? "",
        invoiceNumberPrefix:
          preferences.invoiceNumberPrefix ?? "",
        quoteNumberPrefix:
          preferences.quoteNumberPrefix ?? "",
        packingListNumberPrefix:
          preferences.packingListNumberPrefix ?? "",
        shippingDocumentNumberPrefix:
          preferences.shippingDocumentNumberPrefix ?? "",
        documentNotes:
          preferences.documentNotes ?? "",

        // Shipment Preferences
        defaultTransportMode:
          preferences.defaultTransportMode ?? "",
        defaultShipmentType:
          preferences.defaultShipmentType ?? "",
        defaultPackageUnit:
          preferences.defaultPackageUnit ?? "",
        defaultWeightUnit:
          preferences.defaultWeightUnit ?? "",
        defaultDimensionUnit:
          preferences.defaultDimensionUnit ?? "",
        shipmentHandlingInstructions:
          preferences.shipmentHandlingInstructions ?? "",

        // Communication & Workflow
        defaultCustomerCommunicationChannel:
          preferences.defaultCustomerCommunicationChannel ?? "",
        internalApprovalRequired:
          preferences.internalApprovalRequired ?? false,
        orderApprovalRequired:
          preferences.orderApprovalRequired ?? false,
        shipmentApprovalRequired:
          preferences.shipmentApprovalRequired ?? false,
        documentApprovalRequired:
          preferences.documentApprovalRequired ?? false,
        workflowNotes:
          preferences.workflowNotes ?? "",

        // Business Working Preferences
        businessWorkingDays:
          preferences.businessWorkingDays ?? "",
        businessTimezone:
          preferences.businessTimezone ?? "",
        defaultDateFormat:
          preferences.defaultDateFormat ?? "",
        defaultNumberFormat:
          preferences.defaultNumberFormat ?? "",
        operationalNotes:
          preferences.operationalNotes ?? "",
      }
    : null;

  const configuredSections = [
    Boolean(
      preferences?.defaultOrderProcessingPriority ||
        preferences?.defaultShipmentMode ||
        preferences?.defaultIncoterm ||
        preferences?.defaultPortOfLoading ||
        preferences?.defaultDestinationHandling ||
        preferences?.allowPartialShipment ||
        preferences?.allowSplitShipment,
    ),

    Boolean(
      preferences?.defaultDocumentLanguage ||
        preferences?.documentNumberingPreference ||
        preferences?.invoiceNumberPrefix ||
        preferences?.quoteNumberPrefix ||
        preferences?.packingListNumberPrefix ||
        preferences?.shippingDocumentNumberPrefix ||
        preferences?.documentNotes,
    ),

    Boolean(
      preferences?.defaultTransportMode ||
        preferences?.defaultShipmentType ||
        preferences?.defaultPackageUnit ||
        preferences?.defaultWeightUnit ||
        preferences?.defaultDimensionUnit ||
        preferences?.shipmentHandlingInstructions,
    ),

    Boolean(
      preferences?.defaultCustomerCommunicationChannel ||
        preferences?.internalApprovalRequired ||
        preferences?.orderApprovalRequired ||
        preferences?.shipmentApprovalRequired ||
        preferences?.documentApprovalRequired ||
        preferences?.workflowNotes,
    ),

    Boolean(
      preferences?.businessWorkingDays ||
        preferences?.businessTimezone ||
        preferences?.defaultDateFormat ||
        preferences?.defaultNumberFormat ||
        preferences?.operationalNotes,
    ),
  ].filter(Boolean).length;

  const configurationStatus =
    configuredSections === 0
      ? "Not Configured"
      : configuredSections === 5
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
              <WalletCards className="h-5 w-5" />
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
                <ListChecks className="h-4 w-4" />
                Business Configuration
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Operating Preferences
              </h1>

              <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">
                Configure the operational, document, shipment,
                workflow and business working preferences used
                across the ROOTYM export workspace.
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
                Operating Configuration Status
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Review the current operational configuration
                status for this tenant.
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
            {/* Operations */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <ListChecks className="h-5 w-5 text-slate-700" />
              </div>

              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Operations
              </p>

              <p className="mt-1 text-lg font-semibold text-slate-900">
                {preferences?.defaultShipmentMode ||
                  preferences?.defaultIncoterm ||
                  "Not Set"}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Default shipment / Incoterm
              </p>
            </div>

            {/* Documents */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <FileText className="h-5 w-5 text-slate-700" />
              </div>

              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Documents
              </p>

              <p className="mt-1 truncate text-lg font-semibold text-slate-900">
                {preferences?.defaultDocumentLanguage ||
                  "Not Set"}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Default document language
              </p>
            </div>

            {/* Shipment */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <Truck className="h-5 w-5 text-slate-700" />
              </div>

              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Shipment
              </p>

              <p className="mt-1 truncate text-lg font-semibold text-slate-900">
                {preferences?.defaultTransportMode ||
                  "Not Set"}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Default transport mode
              </p>
            </div>

            {/* Working */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <CalendarDays className="h-5 w-5 text-slate-700" />
              </div>

              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Working Preferences
              </p>

              <p className="mt-1 truncate text-lg font-semibold text-slate-900">
                {preferences?.businessTimezone ||
                  "Not Set"}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Business timezone
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
              Operating Preferences Configuration
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Maintain the default operational preferences used
              throughout the business export workflow.
            </p>
          </div>

          <BusinessOperatingPreferencesForm
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
              Tenant Operating Record
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Operating Preferences are maintained independently
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
                {preferences
                  ? "Existing"
                  : "Not Created"}
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
              Continue configuring the other business settings.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {/* Financial Settings */}
            <Link
              href="/app/workspace/business/financial-settings"
              className="group flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-4 py-4 transition hover:border-slate-600 hover:bg-slate-800"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800">
                  <WalletCards className="h-4 w-4 text-slate-300" />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Financial Settings
                  </p>

                  <p className="text-xs text-slate-400">
                    Currency, payment and banking configuration
                  </p>
                </div>
              </div>

              <ChevronRight className="h-4 w-4 text-slate-500 transition group-hover:translate-x-1 group-hover:text-white" />
            </Link>

            {/* Tax & Compliance */}
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

            {/* Contact & Communication */}
            <Link
              href="/app/workspace/business/contact-communication"
              className="group flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-4 py-4 transition hover:border-slate-600 hover:bg-slate-800"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800">
                  <UsersRound className="h-4 w-4 text-slate-300" />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Contact &amp; Communication
                  </p>

                  <p className="text-xs text-slate-400">
                    Business contact and communication settings
                  </p>
                </div>
              </div>

              <ChevronRight className="h-4 w-4 text-slate-500 transition group-hover:translate-x-1 group-hover:text-white" />
            </Link>

            {/* Export Credentials */}
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

            {/* Business Configuration */}
            <Link
              href="/app/workspace/business"
              className="group flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-4 py-4 transition hover:border-slate-600 hover:bg-slate-800 md:col-span-2"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800">
                  <Settings2 className="h-4 w-4 text-slate-300" />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    All Business Configuration
                  </p>

                  <p className="text-xs text-slate-400">
                    Return to the Business Configuration workspace
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
          <div>ROOTYM Global ExportOS</div>

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