/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the tenant-scoped Business Address form
 *          with OWNER/ADMIN edit permissions and save feedback.
 * ============================================================
 */

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import type { BusinessAddressInput } from "@/lib/validations/business-address";

interface BusinessAddressFormProps {
  initialData: BusinessAddressInput;
  canEdit: boolean;
}

export default function BusinessAddressForm({
  initialData,
  canEdit,
}: BusinessAddressFormProps) {
  const [saveMessage, setSaveMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<BusinessAddressInput>({
    defaultValues: initialData,
  });

  const onSubmit = async (data: BusinessAddressInput) => {
    setSaveMessage("");
    setErrorMessage("");

    try {
      const response = await fetch(
        "/api/workspace/business/address",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        if (result?.details?.fieldErrors) {
          const fieldErrors = Object.values(
            result.details.fieldErrors,
          )
            .flat()
            .filter(Boolean);

          setErrorMessage(
            fieldErrors.length > 0
              ? fieldErrors.join(" ")
              : result?.error ||
                  "Unable to save the Business Address.",
          );
        } else {
          setErrorMessage(
            result?.error ||
              "Unable to save the Business Address.",
          );
        }

        return;
      }

      setSaveMessage(
        "Business Address saved successfully.",
      );
    } catch {
      setErrorMessage(
        "Unable to save the Business Address. Please try again.",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <label
            htmlFor="addressLine1"
            className="mb-2 block text-sm font-medium"
          >
            Address Line 1
          </label>

          <input
            id="addressLine1"
            type="text"
            disabled={!canEdit || isSubmitting}
            {...register("addressLine1")}
            className="w-full rounded-lg border px-3 py-2"
          />

          {errors.addressLine1 && (
            <p className="mt-1 text-sm text-red-600">
              {errors.addressLine1.message}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="addressLine2"
            className="mb-2 block text-sm font-medium"
          >
            Address Line 2
          </label>

          <input
            id="addressLine2"
            type="text"
            disabled={!canEdit || isSubmitting}
            {...register("addressLine2")}
            className="w-full rounded-lg border px-3 py-2"
          />

          {errors.addressLine2 && (
            <p className="mt-1 text-sm text-red-600">
              {errors.addressLine2.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="city"
            className="mb-2 block text-sm font-medium"
          >
            City
          </label>

          <input
            id="city"
            type="text"
            disabled={!canEdit || isSubmitting}
            {...register("city")}
            className="w-full rounded-lg border px-3 py-2"
          />

          {errors.city && (
            <p className="mt-1 text-sm text-red-600">
              {errors.city.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="state"
            className="mb-2 block text-sm font-medium"
          >
            State
          </label>

          <input
            id="state"
            type="text"
            disabled={!canEdit || isSubmitting}
            {...register("state")}
            className="w-full rounded-lg border px-3 py-2"
          />

          {errors.state && (
            <p className="mt-1 text-sm text-red-600">
              {errors.state.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="postalCode"
            className="mb-2 block text-sm font-medium"
          >
            Postal Code
          </label>

          <input
            id="postalCode"
            type="text"
            disabled={!canEdit || isSubmitting}
            {...register("postalCode")}
            className="w-full rounded-lg border px-3 py-2"
          />

          {errors.postalCode && (
            <p className="mt-1 text-sm text-red-600">
              {errors.postalCode.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="country"
            className="mb-2 block text-sm font-medium"
          >
            Country
          </label>

          <input
            id="country"
            type="text"
            disabled={!canEdit || isSubmitting}
            {...register("country")}
            className="w-full rounded-lg border px-3 py-2"
          />

          {errors.country && (
            <p className="mt-1 text-sm text-red-600">
              {errors.country.message}
            </p>
          )}
        </div>
      </div>

      {saveMessage && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {saveMessage}
        </div>
      )}

      {errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {canEdit ? (
        <button
          type="submit"
          disabled={!isDirty || isSubmitting}
          className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Business Address"}
        </button>
      ) : (
        <p className="text-sm text-gray-500">
          Only the workspace Owner or Admin can modify
          the Business Address.
        </p>
      )}
    </form>
  );
}