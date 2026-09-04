/**
 * ============================================================
 * ROOTYM Business Tax & Compliance Form
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides tenant-scoped editable Tax & Compliance
 *          configuration for authorized business users.
 * ============================================================
 */

"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { FileCheck2, Save } from "lucide-react";

import type { BusinessTaxComplianceInput } from "@/lib/validations/business-tax-compliance";

type BusinessTaxComplianceFormProps = {
  initialData?: BusinessTaxComplianceInput | null;
  canEdit: boolean;
};

type ApiResponse = {
  success?: boolean;
  data?: BusinessTaxComplianceInput;
  error?: string;
  details?: {
    fieldErrors?: Record<string, string[] | undefined>;
  };
};

const inputClassName =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100";

function FieldError({
  message,
}: {
  message?: string;
}) {
  if (!message) {
    return null;
  }

  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-slate-200 pb-3">
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}

export default function BusinessTaxComplianceForm({
  initialData,
  canEdit,
}: BusinessTaxComplianceFormProps) {
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BusinessTaxComplianceInput>({
    defaultValues: {
      gstRegistrationType: initialData?.gstRegistrationType ?? "",
      gstExportTreatment: initialData?.gstExportTreatment ?? "",
      defaultTaxRate: initialData?.defaultTaxRate ?? undefined,
      taxNotes: initialData?.taxNotes ?? "",

      lutBondStatus: initialData?.lutBondStatus ?? "",
      lutBondNumber: initialData?.lutBondNumber ?? "",
      lutBondFinancialYear: initialData?.lutBondFinancialYear ?? "",
      lutBondIssueDate: initialData?.lutBondIssueDate ?? "",
      lutBondExpiryDate: initialData?.lutBondExpiryDate ?? "",

      tdsApplicable: initialData?.tdsApplicable ?? false,
      tdsNotes: initialData?.tdsNotes ?? "",

      tcsApplicable: initialData?.tcsApplicable ?? false,
      tcsNotes: initialData?.tcsNotes ?? "",

      complianceStatus: initialData?.complianceStatus ?? "",
      nextComplianceDate: initialData?.nextComplianceDate ?? "",
      complianceNotes: initialData?.complianceNotes ?? "",
    },
  });

  const onSubmit: SubmitHandler<BusinessTaxComplianceInput> = async (
    values,
  ) => {
    setServerError("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        "/api/workspace/business/tax-compliance",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        },
      );

      const result: ApiResponse = await response.json();

      if (!response.ok || !result.success) {
        setServerError(
          result.error || "Failed to save Tax & Compliance configuration.",
        );
        return;
      }

      setSuccessMessage(
        "Tax & Compliance configuration saved successfully.",
      );

      if (result.data) {
        reset(result.data);
      }
    } catch (error) {
      console.error("Failed to save Tax & Compliance:", error);
      setServerError(
        "Unable to save Tax & Compliance configuration. Please try again.",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {!canEdit && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          You have view-only access to Tax & Compliance. Only OWNER and ADMIN
          users can modify this configuration.
        </div>
      )}

      {serverError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      {successMessage && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </div>
      )}

      {/* ======================================================
          GST Configuration
          ====================================================== */}

      <section className="space-y-5">
        <SectionHeader
          title="GST Configuration"
          description="Configure how GST is treated for this business and its export transactions."
        />

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="gstRegistrationType"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              GST Registration Type
            </label>

            <select
              id="gstRegistrationType"
              {...register("gstRegistrationType")}
              disabled={!canEdit || isSubmitting}
              className={inputClassName}
            >
              <option value="">Select registration type</option>
              <option value="Regular">Regular</option>
              <option value="Composition">Composition</option>
              <option value="Other">Other</option>
            </select>

            <FieldError
              message={errors.gstRegistrationType?.message}
            />
          </div>

          <div>
            <label
              htmlFor="gstExportTreatment"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Export Tax Treatment
            </label>

            <select
              id="gstExportTreatment"
              {...register("gstExportTreatment")}
              disabled={!canEdit || isSubmitting}
              className={inputClassName}
            >
              <option value="">Select export treatment</option>
              <option value="Export without payment of IGST">
                Export without payment of IGST
              </option>
              <option value="Export with payment of IGST">
                Export with payment of IGST
              </option>
              <option value="Not Applicable">Not Applicable</option>
            </select>

            <FieldError
              message={errors.gstExportTreatment?.message}
            />
          </div>

          <div>
            <label
              htmlFor="defaultTaxRate"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Default Tax Rate (%)
            </label>

            <input
              id="defaultTaxRate"
              type="number"
              min="0"
              max="100"
              step="0.01"
              {...register("defaultTaxRate", {
                setValueAs: (value) =>
                  value === "" ? undefined : Number(value),
              })}
              disabled={!canEdit || isSubmitting}
              className={inputClassName}
              placeholder="e.g. 18"
            />

            <FieldError message={errors.defaultTaxRate?.message} />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="taxNotes"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Tax Notes
            </label>

            <textarea
              id="taxNotes"
              rows={3}
              {...register("taxNotes")}
              disabled={!canEdit || isSubmitting}
              className={inputClassName}
              placeholder="Additional GST or tax configuration notes"
            />

            <FieldError message={errors.taxNotes?.message} />
          </div>
        </div>
      </section>

      {/* ======================================================
          LUT / Bond
          ====================================================== */}

      <section className="space-y-5">
        <SectionHeader
          title="LUT / Bond"
          description="Maintain Letter of Undertaking or Bond information used for export tax compliance."
        />

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="lutBondStatus"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              LUT / Bond Status
            </label>

            <select
              id="lutBondStatus"
              {...register("lutBondStatus")}
              disabled={!canEdit || isSubmitting}
              className={inputClassName}
            >
              <option value="">Select status</option>
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
              <option value="Pending">Pending</option>
              <option value="Not Available">Not Available</option>
              <option value="Not Applicable">Not Applicable</option>
            </select>

            <FieldError message={errors.lutBondStatus?.message} />
          </div>

          <div>
            <label
              htmlFor="lutBondNumber"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              LUT / Bond Number
            </label>

            <input
              id="lutBondNumber"
              type="text"
              {...register("lutBondNumber")}
              disabled={!canEdit || isSubmitting}
              className={inputClassName}
              placeholder="Enter LUT / Bond number"
            />

            <FieldError message={errors.lutBondNumber?.message} />
          </div>

          <div>
            <label
              htmlFor="lutBondFinancialYear"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Financial Year
            </label>

            <input
              id="lutBondFinancialYear"
              type="text"
              {...register("lutBondFinancialYear")}
              disabled={!canEdit || isSubmitting}
              className={inputClassName}
              placeholder="e.g. 2026-27"
            />

            <FieldError
              message={errors.lutBondFinancialYear?.message}
            />
          </div>

          <div>
            <label
              htmlFor="lutBondIssueDate"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Issue Date
            </label>

            <input
              id="lutBondIssueDate"
              type="date"
              {...register("lutBondIssueDate")}
              disabled={!canEdit || isSubmitting}
              className={inputClassName}
            />

            <FieldError message={errors.lutBondIssueDate?.message} />
          </div>

          <div>
            <label
              htmlFor="lutBondExpiryDate"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Expiry Date
            </label>

            <input
              id="lutBondExpiryDate"
              type="date"
              {...register("lutBondExpiryDate")}
              disabled={!canEdit || isSubmitting}
              className={inputClassName}
            />

            <FieldError message={errors.lutBondExpiryDate?.message} />
          </div>
        </div>
      </section>

      {/* ======================================================
          TDS
          ====================================================== */}

      <section className="space-y-5">
        <SectionHeader
          title="TDS"
          description="Configure whether Tax Deducted at Source applies to the business."
        />

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              {...register("tdsApplicable")}
              disabled={!canEdit || isSubmitting}
              className="h-4 w-4 rounded border-slate-300"
            />

            <span className="text-sm font-medium text-slate-700">
              TDS is applicable
            </span>
          </label>
        </div>

        <div>
          <label
            htmlFor="tdsNotes"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            TDS Notes
          </label>

          <textarea
            id="tdsNotes"
            rows={3}
            {...register("tdsNotes")}
            disabled={!canEdit || isSubmitting}
            className={inputClassName}
            placeholder="Additional TDS configuration notes"
          />

          <FieldError message={errors.tdsNotes?.message} />
        </div>
      </section>

      {/* ======================================================
          TCS
          ====================================================== */}

      <section className="space-y-5">
        <SectionHeader
          title="TCS"
          description="Configure whether Tax Collected at Source applies to the business."
        />

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              {...register("tcsApplicable")}
              disabled={!canEdit || isSubmitting}
              className="h-4 w-4 rounded border-slate-300"
            />

            <span className="text-sm font-medium text-slate-700">
              TCS is applicable
            </span>
          </label>
        </div>

        <div>
          <label
            htmlFor="tcsNotes"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            TCS Notes
          </label>

          <textarea
            id="tcsNotes"
            rows={3}
            {...register("tcsNotes")}
            disabled={!canEdit || isSubmitting}
            className={inputClassName}
            placeholder="Additional TCS configuration notes"
          />

          <FieldError message={errors.tcsNotes?.message} />
        </div>
      </section>

      {/* ======================================================
          Compliance
          ====================================================== */}

      <section className="space-y-5">
        <SectionHeader
          title="Compliance"
          description="Maintain the current internal compliance status and upcoming compliance date."
        />

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="complianceStatus"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Compliance Status
            </label>

            <select
              id="complianceStatus"
              {...register("complianceStatus")}
              disabled={!canEdit || isSubmitting}
              className={inputClassName}
            >
              <option value="">Select status</option>
              <option value="Compliant">Compliant</option>
              <option value="Pending">Pending</option>
              <option value="Attention Required">
                Attention Required
              </option>
              <option value="Not Applicable">Not Applicable</option>
            </select>

            <FieldError
              message={errors.complianceStatus?.message}
            />
          </div>

          <div>
            <label
              htmlFor="nextComplianceDate"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Next Compliance Date
            </label>

            <input
              id="nextComplianceDate"
              type="date"
              {...register("nextComplianceDate")}
              disabled={!canEdit || isSubmitting}
              className={inputClassName}
            />

            <FieldError
              message={errors.nextComplianceDate?.message}
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="complianceNotes"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Compliance Notes
            </label>

            <textarea
              id="complianceNotes"
              rows={4}
              {...register("complianceNotes")}
              disabled={!canEdit || isSubmitting}
              className={inputClassName}
              placeholder="Additional compliance information or internal remarks"
            />

            <FieldError
              message={errors.complianceNotes?.message}
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
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}

      <div className="flex items-center gap-2 text-xs text-slate-500">
        <FileCheck2 className="h-4 w-4" />
        Tax & Compliance settings are maintained at the business
        tenant level.
      </div>
    </form>
  );
}