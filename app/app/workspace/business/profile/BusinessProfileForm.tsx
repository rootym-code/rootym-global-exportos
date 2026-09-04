/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the interactive Business Profile form for
 *          creating and updating tenant-scoped business details.
 * ============================================================
 */

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import type { BusinessProfileInput } from "@/lib/validations/business-profile";

interface BusinessProfileFormProps {
  initialData: BusinessProfileInput | null;
  canEdit: boolean;
}

interface ApiResponse {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
}

export default function BusinessProfileForm({
  initialData,
  canEdit,
}: BusinessProfileFormProps) {
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<BusinessProfileInput>({
    defaultValues: {
      businessName: initialData?.businessName ?? "",
      legalName: initialData?.legalName ?? "",
      businessType: initialData?.businessType ?? "",
      email: initialData?.email ?? "",
      phone: initialData?.phone ?? "",
      country: initialData?.country ?? "",
      website: initialData?.website ?? "",
      description: initialData?.description ?? "",
    },
  });

  async function onSubmit(data: BusinessProfileInput) {
    setServerError("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        "/api/workspace/business/profile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result =
        (await response.json()) as ApiResponse;

      if (!response.ok || !result.success) {
        if (result.errors) {
          const firstError = Object.values(
            result.errors
          ).find(
            (messages) =>
              messages && messages.length > 0
          );

          if (firstError?.[0]) {
            setServerError(firstError[0]);
            return;
          }
        }

        setServerError(
          result.message ??
            "Unable to save the Business Profile."
        );

        return;
      }

      reset(data);
      setSuccessMessage(
        result.message ??
          "Business Profile saved successfully."
      );
    } catch {
      setServerError(
        "Unable to connect to the Business Profile service."
      );
    }
  }

  return (
    <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 sm:p-8">
      <div className="mb-7">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
          Business Profile
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight">
          Business identity
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Maintain the core business information associated with
          this ROOTYM workspace.
        </p>
      </div>

      {!canEdit && (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          You have view-only access to this Business Profile.
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
        className="space-y-7"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="businessName"
              className="block text-sm font-semibold text-slate-700"
            >
              Business Name
            </label>

            <input
              id="businessName"
              type="text"
              disabled={!canEdit || isSubmitting}
              {...register("businessName", {
                required: "Business name is required",
                maxLength: {
                  value: 200,
                  message:
                    "Business name must not exceed 200 characters",
                },
              })}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100"
              placeholder="Enter your business name"
            />

            {errors.businessName && (
              <p className="mt-2 text-xs font-medium text-red-600">
                {errors.businessName.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="legalName"
              className="block text-sm font-semibold text-slate-700"
            >
              Legal Name
            </label>

            <input
              id="legalName"
              type="text"
              disabled={!canEdit || isSubmitting}
              {...register("legalName")}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100"
              placeholder="Enter legal company name"
            />

            {errors.legalName && (
              <p className="mt-2 text-xs font-medium text-red-600">
                {errors.legalName.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="businessType"
              className="block text-sm font-semibold text-slate-700"
            >
              Business Type
            </label>

            <input
              id="businessType"
              type="text"
              disabled={!canEdit || isSubmitting}
              {...register("businessType")}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100"
              placeholder="e.g. Manufacturer, Trader"
            />

            {errors.businessType && (
              <p className="mt-2 text-xs font-medium text-red-600">
                {errors.businessType.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="country"
              className="block text-sm font-semibold text-slate-700"
            >
              Country
            </label>

            <input
              id="country"
              type="text"
              disabled={!canEdit || isSubmitting}
              {...register("country")}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100"
              placeholder="Enter country"
            />

            {errors.country && (
              <p className="mt-2 text-xs font-medium text-red-600">
                {errors.country.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-slate-700"
            >
              Business Email
            </label>

            <input
              id="email"
              type="email"
              disabled={!canEdit || isSubmitting}
              {...register("email")}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100"
              placeholder="business@example.com"
            />

            {errors.email && (
              <p className="mt-2 text-xs font-medium text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-semibold text-slate-700"
            >
              Business Phone
            </label>

            <input
              id="phone"
              type="tel"
              disabled={!canEdit || isSubmitting}
              {...register("phone")}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100"
              placeholder="+91..."
            />

            {errors.phone && (
              <p className="mt-2 text-xs font-medium text-red-600">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="website"
              className="block text-sm font-semibold text-slate-700"
            >
              Website
            </label>

            <input
              id="website"
              type="url"
              disabled={!canEdit || isSubmitting}
              {...register("website")}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100"
              placeholder="https://example.com"
            />

            {errors.website && (
              <p className="mt-2 text-xs font-medium text-red-600">
                {errors.website.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-slate-700"
            >
              Business Description
            </label>

            <textarea
              id="description"
              rows={6}
              disabled={!canEdit || isSubmitting}
              {...register("description")}
              className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100"
              placeholder="Describe your business..."
            />

            {errors.description && (
              <p className="mt-2 text-xs font-medium text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>

        {canEdit && (
          <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 pt-6">
            <button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting
                ? "Saving..."
                : "Save Business Profile"}
            </button>

            {isDirty && !isSubmitting && (
              <span className="text-sm text-slate-500">
                You have unsaved changes.
              </span>
            )}
          </div>
        )}
      </form>
    </div>
  );
}