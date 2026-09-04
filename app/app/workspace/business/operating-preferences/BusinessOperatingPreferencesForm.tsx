/**
 * ============================================================
 * ROOTYM Business Operating Preferences Form
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides editable operational, document, shipment,
 *          workflow and business working preferences.
 * ============================================================
 */

"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  CalendarDays,
  FileText,
  Globe2,
  ListChecks,
  Save,
  Settings2,
  Truck,
  UsersRound,
} from "lucide-react";

import type { BusinessOperatingPreferencesInput } from "@/lib/validations/business-operating-preferences";

type BusinessOperatingPreferencesFormProps = {
  initialData: BusinessOperatingPreferencesInput | null;
  canEdit: boolean;
};

export default function BusinessOperatingPreferencesForm({
  initialData,
  canEdit,
}: BusinessOperatingPreferencesFormProps) {
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BusinessOperatingPreferencesInput>({
    defaultValues: {
      // Order & Export Operations
      defaultOrderProcessingPriority:
        initialData?.defaultOrderProcessingPriority ?? "",
      defaultShipmentMode:
        initialData?.defaultShipmentMode ?? "",
      defaultIncoterm:
        initialData?.defaultIncoterm ?? "",
      defaultPortOfLoading:
        initialData?.defaultPortOfLoading ?? "",
      defaultDestinationHandling:
        initialData?.defaultDestinationHandling ?? "",
      allowPartialShipment:
        initialData?.allowPartialShipment ?? false,
      allowSplitShipment:
        initialData?.allowSplitShipment ?? false,

      // Document Preferences
      defaultDocumentLanguage:
        initialData?.defaultDocumentLanguage ?? "",
      documentNumberingPreference:
        initialData?.documentNumberingPreference ?? "",
      invoiceNumberPrefix:
        initialData?.invoiceNumberPrefix ?? "",
      quoteNumberPrefix:
        initialData?.quoteNumberPrefix ?? "",
      packingListNumberPrefix:
        initialData?.packingListNumberPrefix ?? "",
      shippingDocumentNumberPrefix:
        initialData?.shippingDocumentNumberPrefix ?? "",
      documentNotes:
        initialData?.documentNotes ?? "",

      // Shipment Preferences
      defaultTransportMode:
        initialData?.defaultTransportMode ?? "",
      defaultShipmentType:
        initialData?.defaultShipmentType ?? "",
      defaultPackageUnit:
        initialData?.defaultPackageUnit ?? "",
      defaultWeightUnit:
        initialData?.defaultWeightUnit ?? "",
      defaultDimensionUnit:
        initialData?.defaultDimensionUnit ?? "",
      shipmentHandlingInstructions:
        initialData?.shipmentHandlingInstructions ?? "",

      // Communication & Workflow
      defaultCustomerCommunicationChannel:
        initialData?.defaultCustomerCommunicationChannel ?? "",
      internalApprovalRequired:
        initialData?.internalApprovalRequired ?? false,
      orderApprovalRequired:
        initialData?.orderApprovalRequired ?? false,
      shipmentApprovalRequired:
        initialData?.shipmentApprovalRequired ?? false,
      documentApprovalRequired:
        initialData?.documentApprovalRequired ?? false,
      workflowNotes:
        initialData?.workflowNotes ?? "",

      // Business Working Preferences
      businessWorkingDays:
        initialData?.businessWorkingDays ?? "",
      businessTimezone:
        initialData?.businessTimezone ?? "",
      defaultDateFormat:
        initialData?.defaultDateFormat ?? "",
      defaultNumberFormat:
        initialData?.defaultNumberFormat ?? "",
      operationalNotes:
        initialData?.operationalNotes ?? "",
    },
  });

  const onSubmit: SubmitHandler<BusinessOperatingPreferencesInput> =
    async (values) => {
      setServerError("");
      setSuccessMessage("");

      try {
        const response = await fetch(
          "/api/workspace/business/operating-preferences",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          setServerError(
            data?.error ||
              "Failed to save Operating Preferences.",
          );
          return;
        }

        reset(data);
        setSuccessMessage(
          "Operating Preferences saved successfully.",
        );
      } catch (error) {
        console.error(
          "Failed to save Operating Preferences:",
          error,
        );

        setServerError(
          "Unable to save Operating Preferences. Please try again.",
        );
      }
    };

  const inputClassName =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100 disabled:text-slate-500";

  const textareaClassName =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100 disabled:text-slate-500";

  const labelClassName =
    "mb-1.5 block text-sm font-medium text-slate-700";

  const errorClassName =
    "mt-1 text-xs text-red-600";

  const checkboxClassName =
    "h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400 disabled:opacity-60";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8"
    >
      {!canEdit && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          You have view-only access to Operating Preferences.
          Only workspace owners and administrators can modify
          these settings.
        </div>
      )}

      {serverError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      {successMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </div>
      )}

      {/* ======================================================
          Order & Export Operations
          ====================================================== */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <ListChecks className="h-5 w-5 text-slate-700" />

            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Order &amp; Export Operations
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Define the default operational preferences used
                when processing export orders and shipments.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 px-6 py-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="defaultOrderProcessingPriority"
              className={labelClassName}
            >
              Default Order Processing Priority
            </label>

            <select
              id="defaultOrderProcessingPriority"
              disabled={!canEdit}
              className={inputClassName}
              {...register("defaultOrderProcessingPriority")}
            >
              <option value="">Select priority</option>
              <option value="LOW">Low</option>
              <option value="NORMAL">Normal</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>

            {errors.defaultOrderProcessingPriority && (
              <p className={errorClassName}>
                {errors.defaultOrderProcessingPriority.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="defaultShipmentMode"
              className={labelClassName}
            >
              Default Shipment Mode
            </label>

            <select
              id="defaultShipmentMode"
              disabled={!canEdit}
              className={inputClassName}
              {...register("defaultShipmentMode")}
            >
              <option value="">Select shipment mode</option>
              <option value="SEA">Sea</option>
              <option value="AIR">Air</option>
              <option value="ROAD">Road</option>
              <option value="RAIL">Rail</option>
              <option value="COURIER">Courier</option>
              <option value="MULTIMODAL">Multimodal</option>
            </select>

            {errors.defaultShipmentMode && (
              <p className={errorClassName}>
                {errors.defaultShipmentMode.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="defaultIncoterm"
              className={labelClassName}
            >
              Default Incoterm
            </label>

            <select
              id="defaultIncoterm"
              disabled={!canEdit}
              className={inputClassName}
              {...register("defaultIncoterm")}
            >
              <option value="">Select Incoterm</option>
              <option value="EXW">EXW</option>
              <option value="FCA">FCA</option>
              <option value="CPT">CPT</option>
              <option value="CIP">CIP</option>
              <option value="DAP">DAP</option>
              <option value="DPU">DPU</option>
              <option value="DDP">DDP</option>
              <option value="FAS">FAS</option>
              <option value="FOB">FOB</option>
              <option value="CFR">CFR</option>
              <option value="CIF">CIF</option>
            </select>

            {errors.defaultIncoterm && (
              <p className={errorClassName}>
                {errors.defaultIncoterm.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="defaultPortOfLoading"
              className={labelClassName}
            >
              Default Port / Place of Loading
            </label>

            <input
              id="defaultPortOfLoading"
              type="text"
              placeholder="e.g. Nhava Sheva / JNPT"
              disabled={!canEdit}
              className={inputClassName}
              {...register("defaultPortOfLoading")}
            />

            {errors.defaultPortOfLoading && (
              <p className={errorClassName}>
                {errors.defaultPortOfLoading.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="defaultDestinationHandling"
              className={labelClassName}
            >
              Default Destination Handling
            </label>

            <textarea
              id="defaultDestinationHandling"
              rows={3}
              placeholder="Default instructions for destination-side handling"
              disabled={!canEdit}
              className={textareaClassName}
              {...register("defaultDestinationHandling")}
            />

            {errors.defaultDestinationHandling && (
              <p className={errorClassName}>
                {errors.defaultDestinationHandling.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-4">
                <input
                  type="checkbox"
                  disabled={!canEdit}
                  className={checkboxClassName}
                  {...register("allowPartialShipment")}
                />

                <span>
                  <span className="block text-sm font-medium text-slate-800">
                    Allow Partial Shipment
                  </span>

                  <span className="mt-1 block text-xs text-slate-500">
                    Allow an order to be fulfilled through
                    multiple partial shipments.
                  </span>
                </span>
              </label>

              <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-4">
                <input
                  type="checkbox"
                  disabled={!canEdit}
                  className={checkboxClassName}
                  {...register("allowSplitShipment")}
                />

                <span>
                  <span className="block text-sm font-medium text-slate-800">
                    Allow Split Shipment
                  </span>

                  <span className="mt-1 block text-xs text-slate-500">
                    Allow a single order to be divided across
                    different shipment records.
                  </span>
                </span>
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          Document Preferences
          ====================================================== */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-slate-700" />

            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Document Preferences
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Configure default language and numbering
                preferences for operational documents.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 px-6 py-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="defaultDocumentLanguage"
              className={labelClassName}
            >
              Default Document Language
            </label>

            <select
              id="defaultDocumentLanguage"
              disabled={!canEdit}
              className={inputClassName}
              {...register("defaultDocumentLanguage")}
            >
              <option value="">Select language</option>
              <option value="EN">English</option>
              <option value="HI">Hindi</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="documentNumberingPreference"
              className={labelClassName}
            >
              Document Numbering Preference
            </label>

            <select
              id="documentNumberingPreference"
              disabled={!canEdit}
              className={inputClassName}
              {...register("documentNumberingPreference")}
            >
              <option value="">Select preference</option>
              <option value="SEQUENTIAL">
                Sequential
              </option>
              <option value="YEARLY_RESET">
                Yearly Reset
              </option>
              <option value="CUSTOM">
                Custom
              </option>
            </select>
          </div>

          <div>
            <label
              htmlFor="invoiceNumberPrefix"
              className={labelClassName}
            >
              Invoice Number Prefix
            </label>

            <input
              id="invoiceNumberPrefix"
              type="text"
              placeholder="e.g. INV-"
              disabled={!canEdit}
              className={inputClassName}
              {...register("invoiceNumberPrefix")}
            />
          </div>

          <div>
            <label
              htmlFor="quoteNumberPrefix"
              className={labelClassName}
            >
              Quote Number Prefix
            </label>

            <input
              id="quoteNumberPrefix"
              type="text"
              placeholder="e.g. QT-"
              disabled={!canEdit}
              className={inputClassName}
              {...register("quoteNumberPrefix")}
            />
          </div>

          <div>
            <label
              htmlFor="packingListNumberPrefix"
              className={labelClassName}
            >
              Packing List Number Prefix
            </label>

            <input
              id="packingListNumberPrefix"
              type="text"
              placeholder="e.g. PL-"
              disabled={!canEdit}
              className={inputClassName}
              {...register("packingListNumberPrefix")}
            />
          </div>

          <div>
            <label
              htmlFor="shippingDocumentNumberPrefix"
              className={labelClassName}
            >
              Shipping Document Number Prefix
            </label>

            <input
              id="shippingDocumentNumberPrefix"
              type="text"
              placeholder="e.g. SHP-"
              disabled={!canEdit}
              className={inputClassName}
              {...register("shippingDocumentNumberPrefix")}
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="documentNotes"
              className={labelClassName}
            >
              Document Notes
            </label>

            <textarea
              id="documentNotes"
              rows={3}
              placeholder="Additional document generation or numbering notes"
              disabled={!canEdit}
              className={textareaClassName}
              {...register("documentNotes")}
            />
          </div>
        </div>
      </section>

      {/* ======================================================
          Shipment Preferences
          ====================================================== */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <Truck className="h-5 w-5 text-slate-700" />

            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Shipment Preferences
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Define default transport, shipment and measurement
                conventions.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 px-6 py-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="defaultTransportMode"
              className={labelClassName}
            >
              Default Transport Mode
            </label>

            <select
              id="defaultTransportMode"
              disabled={!canEdit}
              className={inputClassName}
              {...register("defaultTransportMode")}
            >
              <option value="">Select transport mode</option>
              <option value="SEA">Sea</option>
              <option value="AIR">Air</option>
              <option value="ROAD">Road</option>
              <option value="RAIL">Rail</option>
              <option value="COURIER">Courier</option>
              <option value="MULTIMODAL">Multimodal</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="defaultShipmentType"
              className={labelClassName}
            >
              Default Shipment Type
            </label>

            <select
              id="defaultShipmentType"
              disabled={!canEdit}
              className={inputClassName}
              {...register("defaultShipmentType")}
            >
              <option value="">Select shipment type</option>
              <option value="FCL">FCL</option>
              <option value="LCL">LCL</option>
              <option value="AIR_CARGO">
                Air Cargo
              </option>
              <option value="PARCEL">Parcel</option>
              <option value="COURIER">Courier</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="defaultPackageUnit"
              className={labelClassName}
            >
              Default Package / Unit
            </label>

            <input
              id="defaultPackageUnit"
              type="text"
              placeholder="e.g. Carton"
              disabled={!canEdit}
              className={inputClassName}
              {...register("defaultPackageUnit")}
            />
          </div>

          <div>
            <label
              htmlFor="defaultWeightUnit"
              className={labelClassName}
            >
              Default Weight Unit
            </label>

            <select
              id="defaultWeightUnit"
              disabled={!canEdit}
              className={inputClassName}
              {...register("defaultWeightUnit")}
            >
              <option value="">Select weight unit</option>
              <option value="KG">Kilogram (KG)</option>
              <option value="MT">Metric Ton (MT)</option>
              <option value="LB">Pound (LB)</option>
              <option value="G">Gram (G)</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="defaultDimensionUnit"
              className={labelClassName}
            >
              Default Dimension Unit
            </label>

            <select
              id="defaultDimensionUnit"
              disabled={!canEdit}
              className={inputClassName}
              {...register("defaultDimensionUnit")}
            >
              <option value="">Select dimension unit</option>
              <option value="CM">Centimeter (CM)</option>
              <option value="M">Meter (M)</option>
              <option value="IN">Inch (IN)</option>
              <option value="FT">Foot (FT)</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="shipmentHandlingInstructions"
              className={labelClassName}
            >
              Shipment Handling Instructions
            </label>

            <textarea
              id="shipmentHandlingInstructions"
              rows={4}
              placeholder="Default instructions for shipment handling"
              disabled={!canEdit}
              className={textareaClassName}
              {...register("shipmentHandlingInstructions")}
            />
          </div>
        </div>
      </section>

      {/* ======================================================
          Communication & Workflow
          ====================================================== */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <UsersRound className="h-5 w-5 text-slate-700" />

            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Communication &amp; Workflow
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Configure default customer communication and
                internal approval requirements.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 px-6 py-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="defaultCustomerCommunicationChannel"
              className={labelClassName}
            >
              Default Customer Communication Channel
            </label>

            <select
              id="defaultCustomerCommunicationChannel"
              disabled={!canEdit}
              className={inputClassName}
              {...register(
                "defaultCustomerCommunicationChannel",
              )}
            >
              <option value="">Select channel</option>
              <option value="EMAIL">Email</option>
              <option value="PHONE">Phone</option>
              <option value="WHATSAPP">WhatsApp</option>
              <option value="PORTAL">Customer Portal</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div />

          <div className="md:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-4">
                <input
                  type="checkbox"
                  disabled={!canEdit}
                  className={checkboxClassName}
                  {...register("internalApprovalRequired")}
                />

                <span>
                  <span className="block text-sm font-medium text-slate-800">
                    Internal Approval Required
                  </span>

                  <span className="mt-1 block text-xs text-slate-500">
                    Require approval before internal operational
                    actions are finalized.
                  </span>
                </span>
              </label>

              <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-4">
                <input
                  type="checkbox"
                  disabled={!canEdit}
                  className={checkboxClassName}
                  {...register("orderApprovalRequired")}
                />

                <span>
                  <span className="block text-sm font-medium text-slate-800">
                    Order Approval Required
                  </span>

                  <span className="mt-1 block text-xs text-slate-500">
                    Require approval before an order can proceed.
                  </span>
                </span>
              </label>

              <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-4">
                <input
                  type="checkbox"
                  disabled={!canEdit}
                  className={checkboxClassName}
                  {...register("shipmentApprovalRequired")}
                />

                <span>
                  <span className="block text-sm font-medium text-slate-800">
                    Shipment Approval Required
                  </span>

                  <span className="mt-1 block text-xs text-slate-500">
                    Require approval before shipment processing.
                  </span>
                </span>
              </label>

              <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-4">
                <input
                  type="checkbox"
                  disabled={!canEdit}
                  className={checkboxClassName}
                  {...register("documentApprovalRequired")}
                />

                <span>
                  <span className="block text-sm font-medium text-slate-800">
                    Document Approval Required
                  </span>

                  <span className="mt-1 block text-xs text-slate-500">
                    Require approval before operational documents
                    are finalized.
                  </span>
                </span>
              </label>
            </div>
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="workflowNotes"
              className={labelClassName}
            >
              Workflow Notes
            </label>

            <textarea
              id="workflowNotes"
              rows={4}
              placeholder="Additional workflow and approval instructions"
              disabled={!canEdit}
              className={textareaClassName}
              {...register("workflowNotes")}
            />
          </div>
        </div>
      </section>

      {/* ======================================================
          Business Working Preferences
          ====================================================== */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-5 w-5 text-slate-700" />

            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Business Working Preferences
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Configure working days, timezone and display
                preferences used by the workspace.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 px-6 py-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="businessWorkingDays"
              className={labelClassName}
            >
              Business Working Days
            </label>

            <input
              id="businessWorkingDays"
              type="text"
              placeholder="e.g. Monday-Friday"
              disabled={!canEdit}
              className={inputClassName}
              {...register("businessWorkingDays")}
            />
          </div>

          <div>
            <label
              htmlFor="businessTimezone"
              className={labelClassName}
            >
              Business Timezone
            </label>

            <input
              id="businessTimezone"
              type="text"
              placeholder="e.g. Asia/Kolkata"
              disabled={!canEdit}
              className={inputClassName}
              {...register("businessTimezone")}
            />
          </div>

          <div>
            <label
              htmlFor="defaultDateFormat"
              className={labelClassName}
            >
              Default Date Format
            </label>

            <select
              id="defaultDateFormat"
              disabled={!canEdit}
              className={inputClassName}
              {...register("defaultDateFormat")}
            >
              <option value="">Select date format</option>
              <option value="DD/MM/YYYY">
                DD/MM/YYYY
              </option>
              <option value="MM/DD/YYYY">
                MM/DD/YYYY
              </option>
              <option value="YYYY-MM-DD">
                YYYY-MM-DD
              </option>
            </select>
          </div>

          <div>
            <label
              htmlFor="defaultNumberFormat"
              className={labelClassName}
            >
              Default Number Format
            </label>

            <select
              id="defaultNumberFormat"
              disabled={!canEdit}
              className={inputClassName}
              {...register("defaultNumberFormat")}
            >
              <option value="">Select number format</option>
              <option value="1,234.56">
                1,234.56
              </option>
              <option value="1.234,56">
                1.234,56
              </option>
              <option value="1 234.56">
                1 234.56
              </option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="operationalNotes"
              className={labelClassName}
            >
              Operational Notes
            </label>

            <textarea
              id="operationalNotes"
              rows={4}
              placeholder="Additional business operating preferences or instructions"
              disabled={!canEdit}
              className={textareaClassName}
              {...register("operationalNotes")}
            />
          </div>
        </div>
      </section>

      {/* ======================================================
          Save
          ====================================================== */}
      {canEdit && (
        <div className="flex justify-end border-t border-slate-200 pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />

            {isSubmitting
              ? "Saving..."
              : "Save Operating Preferences"}
          </button>
        </div>
      )}
    </form>
  );
}