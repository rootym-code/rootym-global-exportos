/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the interactive Export Credentials form for
 *          creating and updating tenant-scoped export,
 *          registration and regulatory credential information.
 * ============================================================
 */

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import type { BusinessExportCredentialsInput } from "@/lib/validations/business-export-credentials";

interface BusinessExportCredentialsFormProps {
  initialData: BusinessExportCredentialsInput | null;
  canEdit: boolean;
}

interface ApiResponse {
  data?: unknown;
  error?: string;
  details?: {
    fieldErrors?: Record<string, string[] | undefined>;
  };
}

function inputClassName(hasError: boolean) {
  return `mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
    hasError
      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
      : "border-slate-200 focus:border-emerald-400 focus:ring-emerald-100"
  }`;
}

function FieldError({
  message,
}: {
  message?: string;
}) {
  if (!message) {
    return null;
  }

  return (
    <p className="mt-1.5 text-xs font-medium text-red-600">
      {message}
    </p>
  );
}

function TextField({
  id,
  label,
  register,
  error,
  disabled,
  placeholder,
  type = "text",
}: {
  id: keyof BusinessExportCredentialsInput;
  label: string;
  register: ReturnType<
    typeof useForm<BusinessExportCredentialsInput>
  >["register"];
  error?: string;
  disabled: boolean;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <input
        id={id}
        type={type}
        disabled={disabled}
        placeholder={placeholder}
        {...register(id)}
        className={inputClassName(Boolean(error))}
      />

      <FieldError message={error} />
    </div>
  );
}

function DateField({
  id,
  label,
  register,
  error,
  disabled,
}: {
  id: keyof BusinessExportCredentialsInput;
  label: string;
  register: ReturnType<
    typeof useForm<BusinessExportCredentialsInput>
  >["register"];
  error?: string;
  disabled: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <input
        id={id}
        type="date"
        disabled={disabled}
        {...register(id)}
        className={inputClassName(Boolean(error))}
      />

      <FieldError message={error} />
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
        {eyebrow}
      </p>

      <h3 className="mt-2 text-xl font-bold tracking-tight text-slate-900">
        {title}
      </h3>

      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

export default function BusinessExportCredentialsForm({
  initialData,
  canEdit,
}: BusinessExportCredentialsFormProps) {
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<BusinessExportCredentialsInput>({
    defaultValues: {
      iecNumber: initialData?.iecNumber ?? "",
      iecStatus: initialData?.iecStatus ?? "",
      iecIssueDate: initialData?.iecIssueDate ?? "",
      dgftProfileUrl: initialData?.dgftProfileUrl ?? "",

      gstin: initialData?.gstin ?? "",
      gstStatus: initialData?.gstStatus ?? "",
      gstRegistrationDate:
        initialData?.gstRegistrationDate ?? "",

      udyamNumber: initialData?.udyamNumber ?? "",
      udyamStatus: initialData?.udyamStatus ?? "",
      udyamRegistrationDate:
        initialData?.udyamRegistrationDate ?? "",

      adCode: initialData?.adCode ?? "",
      adCodeStatus: initialData?.adCodeStatus ?? "",
      adCodeBankName: initialData?.adCodeBankName ?? "",

      icegateRegistrationId:
        initialData?.icegateRegistrationId ?? "",
      icegateStatus: initialData?.icegateStatus ?? "",

      rcmcNumber: initialData?.rcmcNumber ?? "",
      rcmcIssuingAuthority:
        initialData?.rcmcIssuingAuthority ?? "",
      rcmcStatus: initialData?.rcmcStatus ?? "",
      rcmcIssueDate: initialData?.rcmcIssueDate ?? "",
      rcmcExpiryDate: initialData?.rcmcExpiryDate ?? "",

      otherLicense1Name:
        initialData?.otherLicense1Name ?? "",
      otherLicense1Number:
        initialData?.otherLicense1Number ?? "",
      otherLicense1Status:
        initialData?.otherLicense1Status ?? "",
      otherLicense1ExpiryDate:
        initialData?.otherLicense1ExpiryDate ?? "",

      otherLicense2Name:
        initialData?.otherLicense2Name ?? "",
      otherLicense2Number:
        initialData?.otherLicense2Number ?? "",
      otherLicense2Status:
        initialData?.otherLicense2Status ?? "",
      otherLicense2ExpiryDate:
        initialData?.otherLicense2ExpiryDate ?? "",

      otherLicense3Name:
        initialData?.otherLicense3Name ?? "",
      otherLicense3Number:
        initialData?.otherLicense3Number ?? "",
      otherLicense3Status:
        initialData?.otherLicense3Status ?? "",
      otherLicense3ExpiryDate:
        initialData?.otherLicense3ExpiryDate ?? "",

      notes: initialData?.notes ?? "",
    },
  });

  async function onSubmit(
    data: BusinessExportCredentialsInput,
  ) {
    setServerError("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        "/api/workspace/business/export-credentials",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      const result = (await response.json()) as ApiResponse;

      if (!response.ok) {
        const fieldErrors =
          result.details?.fieldErrors;

        if (fieldErrors) {
          const firstError = Object.values(fieldErrors).find(
            (messages) =>
              messages && messages.length > 0,
          );

          if (firstError?.[0]) {
            setServerError(firstError[0]);
            return;
          }
        }

        setServerError(
          result.error ??
            "Unable to save Export Credentials.",
        );

        return;
      }

      reset(data);

      setSuccessMessage(
        "Export Credentials saved successfully.",
      );
    } catch {
      setServerError(
        "Unable to connect to the Export Credentials service.",
      );
    }
  }

  const disabled = !canEdit || isSubmitting;

  return (
    <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 sm:p-8">
      <div className="mb-7">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
          Export Credentials
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight">
          Export and regulatory credentials
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Maintain the export registrations, business
          credentials, regulatory identifiers and licenses
          associated with this ROOTYM workspace.
        </p>
      </div>

      {!canEdit && (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          You have view-only access to these Export
          Credentials.
        </div>
      )}

      {serverError && (
        <div
          role="alert"
          className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
        >
          {serverError}
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700"
        >
          {successMessage}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-10"
      >
        {/* =====================================================
            IEC / DGFT
            ===================================================== */}

        <section>
          <SectionHeader
            eyebrow="IEC / DGFT"
            title="Import Export Code"
            description="Maintain the business IEC and associated DGFT profile information used for export operations."
          />

          <div className="grid gap-6 md:grid-cols-2">
            <TextField
              id="iecNumber"
              label="IEC Number"
              register={register}
              error={errors.iecNumber?.message}
              disabled={disabled}
              placeholder="Enter IEC number"
            />

            <TextField
              id="iecStatus"
              label="IEC Status"
              register={register}
              error={errors.iecStatus?.message}
              disabled={disabled}
              placeholder="e.g. Active"
            />

            <DateField
              id="iecIssueDate"
              label="IEC Issue Date"
              register={register}
              error={errors.iecIssueDate?.message}
              disabled={disabled}
            />

            <TextField
              id="dgftProfileUrl"
              label="DGFT Profile URL"
              register={register}
              error={errors.dgftProfileUrl?.message}
              disabled={disabled}
              placeholder="https://..."
              type="url"
            />
          </div>
        </section>

        {/* =====================================================
            GST
            ===================================================== */}

        <section>
          <SectionHeader
            eyebrow="GST"
            title="Goods and Services Tax"
            description="Maintain the GST registration information associated with the exporting business."
          />

          <div className="grid gap-6 md:grid-cols-2">
            <TextField
              id="gstin"
              label="GSTIN"
              register={register}
              error={errors.gstin?.message}
              disabled={disabled}
              placeholder="Enter GSTIN"
            />

            <TextField
              id="gstStatus"
              label="GST Status"
              register={register}
              error={errors.gstStatus?.message}
              disabled={disabled}
              placeholder="e.g. Active"
            />

            <DateField
              id="gstRegistrationDate"
              label="GST Registration Date"
              register={register}
              error={errors.gstRegistrationDate?.message}
              disabled={disabled}
            />
          </div>
        </section>

        {/* =====================================================
            UDYAM / MSME
            ===================================================== */}

        <section>
          <SectionHeader
            eyebrow="UDYAM / MSME"
            title="MSME Registration"
            description="Maintain the UDYAM registration information associated with the business."
          />

          <div className="grid gap-6 md:grid-cols-2">
            <TextField
              id="udyamNumber"
              label="UDYAM Number"
              register={register}
              error={errors.udyamNumber?.message}
              disabled={disabled}
              placeholder="Enter UDYAM number"
            />

            <TextField
              id="udyamStatus"
              label="UDYAM Status"
              register={register}
              error={errors.udyamStatus?.message}
              disabled={disabled}
              placeholder="e.g. Active"
            />

            <DateField
              id="udyamRegistrationDate"
              label="UDYAM Registration Date"
              register={register}
              error={errors.udyamRegistrationDate?.message}
              disabled={disabled}
            />
          </div>
        </section>

        {/* =====================================================
            AD CODE
            ===================================================== */}

        <section>
          <SectionHeader
            eyebrow="AD CODE"
            title="Authorized Dealer Code"
            description="Maintain the Authorized Dealer Code and associated bank information used for export transactions."
          />

          <div className="grid gap-6 md:grid-cols-2">
            <TextField
              id="adCode"
              label="AD Code"
              register={register}
              error={errors.adCode?.message}
              disabled={disabled}
              placeholder="Enter AD Code"
            />

            <TextField
              id="adCodeStatus"
              label="AD Code Status"
              register={register}
              error={errors.adCodeStatus?.message}
              disabled={disabled}
              placeholder="e.g. Active"
            />

            <TextField
              id="adCodeBankName"
              label="AD Code Bank Name"
              register={register}
              error={errors.adCodeBankName?.message}
              disabled={disabled}
              placeholder="Enter bank name"
            />
          </div>
        </section>

        {/* =====================================================
            ICEGATE
            ===================================================== */}

        <section>
          <SectionHeader
            eyebrow="ICEGATE"
            title="ICEGATE Registration"
            description="Maintain the ICEGATE registration identifier and current registration status."
          />

          <div className="grid gap-6 md:grid-cols-2">
            <TextField
              id="icegateRegistrationId"
              label="ICEGATE Registration ID"
              register={register}
              error={
                errors.icegateRegistrationId?.message
              }
              disabled={disabled}
              placeholder="Enter ICEGATE registration ID"
            />

            <TextField
              id="icegateStatus"
              label="ICEGATE Status"
              register={register}
              error={errors.icegateStatus?.message}
              disabled={disabled}
              placeholder="e.g. Active"
            />
          </div>
        </section>

        {/* =====================================================
            RCMC
            ===================================================== */}

        <section>
          <SectionHeader
            eyebrow="RCMC"
            title="Registration-Cum-Membership Certificate"
            description="Maintain RCMC registration, issuing authority and validity information."
          />

          <div className="grid gap-6 md:grid-cols-2">
            <TextField
              id="rcmcNumber"
              label="RCMC Number"
              register={register}
              error={errors.rcmcNumber?.message}
              disabled={disabled}
              placeholder="Enter RCMC number"
            />

            <TextField
              id="rcmcIssuingAuthority"
              label="RCMC Issuing Authority"
              register={register}
              error={
                errors.rcmcIssuingAuthority?.message
              }
              disabled={disabled}
              placeholder="Enter issuing authority"
            />

            <TextField
              id="rcmcStatus"
              label="RCMC Status"
              register={register}
              error={errors.rcmcStatus?.message}
              disabled={disabled}
              placeholder="e.g. Active"
            />

            <DateField
              id="rcmcIssueDate"
              label="RCMC Issue Date"
              register={register}
              error={errors.rcmcIssueDate?.message}
              disabled={disabled}
            />

            <DateField
              id="rcmcExpiryDate"
              label="RCMC Expiry Date"
              register={register}
              error={errors.rcmcExpiryDate?.message}
              disabled={disabled}
            />
          </div>
        </section>

        {/* =====================================================
            OTHER LICENSE 1
            ===================================================== */}

        <section>
          <SectionHeader
            eyebrow="OTHER LICENSE 1"
            title="Additional License"
            description="Use this section for another business or regulatory license relevant to your export operations."
          />

          <div className="grid gap-6 md:grid-cols-2">
            <TextField
              id="otherLicense1Name"
              label="License Name"
              register={register}
              error={
                errors.otherLicense1Name?.message
              }
              disabled={disabled}
              placeholder="Enter license name"
            />

            <TextField
              id="otherLicense1Number"
              label="License Number"
              register={register}
              error={
                errors.otherLicense1Number?.message
              }
              disabled={disabled}
              placeholder="Enter license number"
            />

            <TextField
              id="otherLicense1Status"
              label="License Status"
              register={register}
              error={
                errors.otherLicense1Status?.message
              }
              disabled={disabled}
              placeholder="e.g. Active"
            />

            <DateField
              id="otherLicense1ExpiryDate"
              label="Expiry Date"
              register={register}
              error={
                errors.otherLicense1ExpiryDate?.message
              }
              disabled={disabled}
            />
          </div>
        </section>

        {/* =====================================================
            OTHER LICENSE 2
            ===================================================== */}

        <section>
          <SectionHeader
            eyebrow="OTHER LICENSE 2"
            title="Additional License"
            description="Use this section for another business or regulatory license relevant to your export operations."
          />

          <div className="grid gap-6 md:grid-cols-2">
            <TextField
              id="otherLicense2Name"
              label="License Name"
              register={register}
              error={
                errors.otherLicense2Name?.message
              }
              disabled={disabled}
              placeholder="Enter license name"
            />

            <TextField
              id="otherLicense2Number"
              label="License Number"
              register={register}
              error={
                errors.otherLicense2Number?.message
              }
              disabled={disabled}
              placeholder="Enter license number"
            />

            <TextField
              id="otherLicense2Status"
              label="License Status"
              register={register}
              error={
                errors.otherLicense2Status?.message
              }
              disabled={disabled}
              placeholder="e.g. Active"
            />

            <DateField
              id="otherLicense2ExpiryDate"
              label="Expiry Date"
              register={register}
              error={
                errors.otherLicense2ExpiryDate?.message
              }
              disabled={disabled}
            />
          </div>
        </section>

        {/* =====================================================
            OTHER LICENSE 3
            ===================================================== */}

        <section>
          <SectionHeader
            eyebrow="OTHER LICENSE 3"
            title="Additional License"
            description="Use this section for another business or regulatory license relevant to your export operations."
          />

          <div className="grid gap-6 md:grid-cols-2">
            <TextField
              id="otherLicense3Name"
              label="License Name"
              register={register}
              error={
                errors.otherLicense3Name?.message
              }
              disabled={disabled}
              placeholder="Enter license name"
            />

            <TextField
              id="otherLicense3Number"
              label="License Number"
              register={register}
              error={
                errors.otherLicense3Number?.message
              }
              disabled={disabled}
              placeholder="Enter license number"
            />

            <TextField
              id="otherLicense3Status"
              label="License Status"
              register={register}
              error={
                errors.otherLicense3Status?.message
              }
              disabled={disabled}
              placeholder="e.g. Active"
            />

            <DateField
              id="otherLicense3ExpiryDate"
              label="Expiry Date"
              register={register}
              error={
                errors.otherLicense3ExpiryDate?.message
              }
              disabled={disabled}
            />
          </div>
        </section>

        {/* =====================================================
            NOTES
            ===================================================== */}

        <section>
          <SectionHeader
            eyebrow="ADDITIONAL INFORMATION"
            title="Notes"
            description="Capture additional information that does not fit into the credential fields above."
          />

          <div>
            <label
              htmlFor="notes"
              className="text-sm font-semibold text-slate-700"
            >
              Notes
            </label>

            <textarea
              id="notes"
              rows={6}
              disabled={disabled}
              placeholder="Enter any additional export credential or license information..."
              {...register("notes")}
              className={inputClassName(
                Boolean(errors.notes?.message),
              )}
            />

            <FieldError message={errors.notes?.message} />
          </div>
        </section>

        {/* =====================================================
            FORM ACTION
            ===================================================== */}

        <div className="flex flex-col gap-3 border-t border-slate-200 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            {canEdit
              ? isDirty
                ? "You have unsaved changes."
                : "Changes are saved when you submit the form."
              : "This configuration is available in view-only mode."}
          </p>

          {canEdit && (
            <button
              type="submit"
              disabled={disabled}
              className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting
                ? "Saving..."
                : "Save Export Credentials"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}