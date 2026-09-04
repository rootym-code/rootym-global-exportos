/**
 * ============================================================
 * ROOTYM Business Financial Settings Form
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides editable currency, payment terms, banking
 *          and foreign-remittance configuration.
 * ============================================================
 */

"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  ArrowRightLeft,
  Banknote,
  Building2,
  Globe2,
  Landmark,
  Save,
} from "lucide-react";

import type { BusinessFinancialSettingsInput } from "@/lib/validations/business-financial-settings";

type BusinessFinancialSettingsFormProps = {
  initialData: BusinessFinancialSettingsInput | null;
  canEdit: boolean;
};

export default function BusinessFinancialSettingsForm({
  initialData,
  canEdit,
}: BusinessFinancialSettingsFormProps) {
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BusinessFinancialSettingsInput>({
    defaultValues: {
      baseCurrency: initialData?.baseCurrency ?? "",
      defaultInvoiceCurrency: initialData?.defaultInvoiceCurrency ?? "",
      currencyNotes: initialData?.currencyNotes ?? "",

      defaultPaymentTermsDays:
        initialData?.defaultPaymentTermsDays ?? undefined,
      defaultPaymentMethod: initialData?.defaultPaymentMethod ?? "",
      paymentTermsNotes: initialData?.paymentTermsNotes ?? "",

      beneficiaryName: initialData?.beneficiaryName ?? "",
      bankName: initialData?.bankName ?? "",
      branchName: initialData?.branchName ?? "",
      accountNumber: initialData?.accountNumber ?? "",
      accountCurrency: initialData?.accountCurrency ?? "",
      ifscCode: initialData?.ifscCode ?? "",
      swiftBic: initialData?.swiftBic ?? "",
      iban: initialData?.iban ?? "",
      bankAddress: initialData?.bankAddress ?? "",
      bankCountry: initialData?.bankCountry ?? "",

      remittanceBankName: initialData?.remittanceBankName ?? "",
      remittanceBankSwiftBic:
        initialData?.remittanceBankSwiftBic ?? "",

      correspondentBankName:
        initialData?.correspondentBankName ?? "",
      correspondentBankSwiftBic:
        initialData?.correspondentBankSwiftBic ?? "",

      intermediaryBankName:
        initialData?.intermediaryBankName ?? "",
      intermediaryBankSwiftBic:
        initialData?.intermediaryBankSwiftBic ?? "",

      foreignBankAccountNumber:
        initialData?.foreignBankAccountNumber ?? "",
      foreignBankIban: initialData?.foreignBankIban ?? "",
      routingOrSortCode: initialData?.routingOrSortCode ?? "",

      remittanceCurrency: initialData?.remittanceCurrency ?? "",
      rbiPurposeCode: initialData?.rbiPurposeCode ?? "",

      foreignRemittanceInstructions:
        initialData?.foreignRemittanceInstructions ?? "",
      remittanceReferenceInstructions:
        initialData?.remittanceReferenceInstructions ?? "",

      bankChargesArrangement:
        initialData?.bankChargesArrangement ?? "",

      foreignRemittanceNotes:
        initialData?.foreignRemittanceNotes ?? "",
    },
  });

  const onSubmit: SubmitHandler<BusinessFinancialSettingsInput> =
    async (values) => {
      setServerError("");
      setSuccessMessage("");

      try {
        const response = await fetch(
          "/api/workspace/business/financial-settings",
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
              "Failed to save Financial Settings.",
          );
          return;
        }

        reset(data);
        setSuccessMessage(
          "Financial Settings saved successfully.",
        );
      } catch (error) {
        console.error(
          "Failed to save Financial Settings:",
          error,
        );

        setServerError(
          "Unable to save Financial Settings. Please try again.",
        );
      }
    };

  const inputClassName =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100 disabled:text-slate-500";

  const textareaClassName =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100 disabled:text-slate-500";

  const labelClassName =
    "mb-1.5 block text-sm font-medium text-slate-700";

  const errorClassName = "mt-1 text-xs text-red-600";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8"
    >
      {!canEdit && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          You have view-only access to Financial Settings.
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
          Currency
          ====================================================== */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <Globe2 className="h-5 w-5 text-slate-700" />
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Currency
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Configure the business base currency and default
                invoice currency.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 px-6 py-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="baseCurrency"
              className={labelClassName}
            >
              Base Currency
            </label>
            <input
              id="baseCurrency"
              type="text"
              placeholder="e.g. INR"
              disabled={!canEdit}
              className={inputClassName}
              {...register("baseCurrency")}
            />
            {errors.baseCurrency && (
              <p className={errorClassName}>
                {errors.baseCurrency.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="defaultInvoiceCurrency"
              className={labelClassName}
            >
              Default Invoice Currency
            </label>
            <input
              id="defaultInvoiceCurrency"
              type="text"
              placeholder="e.g. USD"
              disabled={!canEdit}
              className={inputClassName}
              {...register("defaultInvoiceCurrency")}
            />
            {errors.defaultInvoiceCurrency && (
              <p className={errorClassName}>
                {errors.defaultInvoiceCurrency.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="currencyNotes"
              className={labelClassName}
            >
              Currency Notes
            </label>
            <textarea
              id="currencyNotes"
              rows={3}
              placeholder="Additional currency configuration notes"
              disabled={!canEdit}
              className={textareaClassName}
              {...register("currencyNotes")}
            />
          </div>
        </div>
      </section>

      {/* ======================================================
          Payment Terms
          ====================================================== */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <Banknote className="h-5 w-5 text-slate-700" />
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Payment Terms
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Define default payment terms and payment method
                preferences.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 px-6 py-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="defaultPaymentTermsDays"
              className={labelClassName}
            >
              Default Payment Terms
            </label>
            <div className="flex items-center gap-2">
              <input
                id="defaultPaymentTermsDays"
                type="number"
                min="0"
                max="3650"
                placeholder="e.g. 30"
                disabled={!canEdit}
                className={inputClassName}
                {...register("defaultPaymentTermsDays", {
                  setValueAs: (value) =>
                    value === "" ? undefined : Number(value),
                })}
              />
              <span className="shrink-0 text-sm text-slate-500">
                days
              </span>
            </div>
            {errors.defaultPaymentTermsDays && (
              <p className={errorClassName}>
                {errors.defaultPaymentTermsDays.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="defaultPaymentMethod"
              className={labelClassName}
            >
              Default Payment Method
            </label>
            <input
              id="defaultPaymentMethod"
              type="text"
              placeholder="e.g. Bank Transfer"
              disabled={!canEdit}
              className={inputClassName}
              {...register("defaultPaymentMethod")}
            />
            {errors.defaultPaymentMethod && (
              <p className={errorClassName}>
                {errors.defaultPaymentMethod.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="paymentTermsNotes"
              className={labelClassName}
            >
              Payment Terms Notes
            </label>
            <textarea
              id="paymentTermsNotes"
              rows={3}
              placeholder="Additional payment terms or collection instructions"
              disabled={!canEdit}
              className={textareaClassName}
              {...register("paymentTermsNotes")}
            />
          </div>
        </div>
      </section>

      {/* ======================================================
          Beneficiary / Bank Details
          ====================================================== */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <Landmark className="h-5 w-5 text-slate-700" />
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Beneficiary / Bank Details
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Store the primary beneficiary and banking details
                used for business transactions.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 px-6 py-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="beneficiaryName"
              className={labelClassName}
            >
              Beneficiary Name
            </label>
            <input
              id="beneficiaryName"
              type="text"
              disabled={!canEdit}
              className={inputClassName}
              {...register("beneficiaryName")}
            />
          </div>

          <div>
            <label
              htmlFor="bankName"
              className={labelClassName}
            >
              Bank Name
            </label>
            <input
              id="bankName"
              type="text"
              disabled={!canEdit}
              className={inputClassName}
              {...register("bankName")}
            />
          </div>

          <div>
            <label
              htmlFor="branchName"
              className={labelClassName}
            >
              Branch Name
            </label>
            <input
              id="branchName"
              type="text"
              disabled={!canEdit}
              className={inputClassName}
              {...register("branchName")}
            />
          </div>

          <div>
            <label
              htmlFor="accountNumber"
              className={labelClassName}
            >
              Account Number
            </label>
            <input
              id="accountNumber"
              type="text"
              autoComplete="off"
              disabled={!canEdit}
              className={inputClassName}
              {...register("accountNumber")}
            />
          </div>

          <div>
            <label
              htmlFor="accountCurrency"
              className={labelClassName}
            >
              Account Currency
            </label>
            <input
              id="accountCurrency"
              type="text"
              placeholder="e.g. INR"
              disabled={!canEdit}
              className={inputClassName}
              {...register("accountCurrency")}
            />
          </div>

          <div>
            <label
              htmlFor="ifscCode"
              className={labelClassName}
            >
              IFSC Code
            </label>
            <input
              id="ifscCode"
              type="text"
              disabled={!canEdit}
              className={inputClassName}
              {...register("ifscCode")}
            />
          </div>

          <div>
            <label
              htmlFor="swiftBic"
              className={labelClassName}
            >
              SWIFT / BIC
            </label>
            <input
              id="swiftBic"
              type="text"
              disabled={!canEdit}
              className={inputClassName}
              {...register("swiftBic")}
            />
          </div>

          <div>
            <label
              htmlFor="iban"
              className={labelClassName}
            >
              IBAN
            </label>
            <input
              id="iban"
              type="text"
              disabled={!canEdit}
              className={inputClassName}
              {...register("iban")}
            />
          </div>

          <div>
            <label
              htmlFor="bankCountry"
              className={labelClassName}
            >
              Bank Country
            </label>
            <input
              id="bankCountry"
              type="text"
              placeholder="e.g. India"
              disabled={!canEdit}
              className={inputClassName}
              {...register("bankCountry")}
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="bankAddress"
              className={labelClassName}
            >
              Bank Address
            </label>
            <textarea
              id="bankAddress"
              rows={3}
              disabled={!canEdit}
              className={textareaClassName}
              {...register("bankAddress")}
            />
          </div>
        </div>
      </section>

      {/* ======================================================
          Foreign Remittance Details
          ====================================================== */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <ArrowRightLeft className="h-5 w-5 text-slate-700" />
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Foreign Remittance Details
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Configure remittance banks, correspondent/intermediary
                banking and foreign payment instructions.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 px-6 py-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="remittanceBankName"
              className={labelClassName}
            >
              Remittance Bank Name
            </label>
            <input
              id="remittanceBankName"
              type="text"
              disabled={!canEdit}
              className={inputClassName}
              {...register("remittanceBankName")}
            />
          </div>

          <div>
            <label
              htmlFor="remittanceBankSwiftBic"
              className={labelClassName}
            >
              Remittance Bank SWIFT / BIC
            </label>
            <input
              id="remittanceBankSwiftBic"
              type="text"
              disabled={!canEdit}
              className={inputClassName}
              {...register("remittanceBankSwiftBic")}
            />
          </div>

          <div>
            <label
              htmlFor="correspondentBankName"
              className={labelClassName}
            >
              Correspondent Bank Name
            </label>
            <input
              id="correspondentBankName"
              type="text"
              disabled={!canEdit}
              className={inputClassName}
              {...register("correspondentBankName")}
            />
          </div>

          <div>
            <label
              htmlFor="correspondentBankSwiftBic"
              className={labelClassName}
            >
              Correspondent Bank SWIFT / BIC
            </label>
            <input
              id="correspondentBankSwiftBic"
              type="text"
              disabled={!canEdit}
              className={inputClassName}
              {...register("correspondentBankSwiftBic")}
            />
          </div>

          <div>
            <label
              htmlFor="intermediaryBankName"
              className={labelClassName}
            >
              Intermediary Bank Name
            </label>
            <input
              id="intermediaryBankName"
              type="text"
              disabled={!canEdit}
              className={inputClassName}
              {...register("intermediaryBankName")}
            />
          </div>

          <div>
            <label
              htmlFor="intermediaryBankSwiftBic"
              className={labelClassName}
            >
              Intermediary Bank SWIFT / BIC
            </label>
            <input
              id="intermediaryBankSwiftBic"
              type="text"
              disabled={!canEdit}
              className={inputClassName}
              {...register("intermediaryBankSwiftBic")}
            />
          </div>

          <div>
            <label
              htmlFor="foreignBankAccountNumber"
              className={labelClassName}
            >
              Foreign Bank Account Number
            </label>
            <input
              id="foreignBankAccountNumber"
              type="text"
              autoComplete="off"
              disabled={!canEdit}
              className={inputClassName}
              {...register("foreignBankAccountNumber")}
            />
          </div>

          <div>
            <label
              htmlFor="foreignBankIban"
              className={labelClassName}
            >
              Foreign Bank IBAN
            </label>
            <input
              id="foreignBankIban"
              type="text"
              disabled={!canEdit}
              className={inputClassName}
              {...register("foreignBankIban")}
            />
          </div>

          <div>
            <label
              htmlFor="routingOrSortCode"
              className={labelClassName}
            >
              Routing / Sort Code
            </label>
            <input
              id="routingOrSortCode"
              type="text"
              disabled={!canEdit}
              className={inputClassName}
              {...register("routingOrSortCode")}
            />
          </div>

          <div>
            <label
              htmlFor="remittanceCurrency"
              className={labelClassName}
            >
              Remittance Currency
            </label>
            <input
              id="remittanceCurrency"
              type="text"
              placeholder="e.g. USD"
              disabled={!canEdit}
              className={inputClassName}
              {...register("remittanceCurrency")}
            />
          </div>

          <div>
            <label
              htmlFor="rbiPurposeCode"
              className={labelClassName}
            >
              RBI Purpose Code
            </label>
            <input
              id="rbiPurposeCode"
              type="text"
              placeholder="e.g. P0102"
              disabled={!canEdit}
              className={inputClassName}
              {...register("rbiPurposeCode")}
            />
          </div>

          <div>
            <label
              htmlFor="bankChargesArrangement"
              className={labelClassName}
            >
              Bank Charges Arrangement
            </label>
            <select
              id="bankChargesArrangement"
              disabled={!canEdit}
              className={inputClassName}
              {...register("bankChargesArrangement")}
            >
              <option value="">Select arrangement</option>
              <option value="OUR">OUR</option>
              <option value="SHA">SHA</option>
              <option value="BEN">BEN</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="foreignRemittanceInstructions"
              className={labelClassName}
            >
              Foreign Remittance Instructions
            </label>
            <textarea
              id="foreignRemittanceInstructions"
              rows={4}
              placeholder="Instructions for handling foreign remittances"
              disabled={!canEdit}
              className={textareaClassName}
              {...register("foreignRemittanceInstructions")}
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="remittanceReferenceInstructions"
              className={labelClassName}
            >
              Remittance Reference Instructions
            </label>
            <textarea
              id="remittanceReferenceInstructions"
              rows={3}
              placeholder="Reference details to be included with remittances"
              disabled={!canEdit}
              className={textareaClassName}
              {...register("remittanceReferenceInstructions")}
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="foreignRemittanceNotes"
              className={labelClassName}
            >
              Foreign Remittance Notes
            </label>
            <textarea
              id="foreignRemittanceNotes"
              rows={3}
              placeholder="Additional foreign remittance notes"
              disabled={!canEdit}
              className={textareaClassName}
              {...register("foreignRemittanceNotes")}
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
              : "Save Financial Settings"}
          </button>
        </div>
      )}
    </form>
  );
}