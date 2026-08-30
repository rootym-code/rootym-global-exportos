/**
 * Author: Prem Singh
 * Purpose: Provides the billing UI action for changing an active ROOTYM subscription to the alternate billing interval.
 */

"use client";

import {
  useState,
} from "react";

interface BillingPlanChangeButtonProps {
  billingInterval:
    | "MONTHLY"
    | "ANNUAL";
}

interface PlanChangeResponse {
  success: boolean;

  message?: string;

  data?: {
    planChangeId: string;

    paymentId: string;

    paymentStatus: string;

    planChangeStatus: string;

    currentPlan: {
      code: string;
      name: string;
    };

    targetPlan: {
      code: string;
      name: string;
    };

    effectiveAt: string;
  };
}

function formatDate(
  value: string,
) {
  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  ).format(new Date(value));
}

export default function BillingPlanChangeButton({
  billingInterval,
}: BillingPlanChangeButtonProps) {
  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState<string | null>(null);

  async function handlePlanChange() {
    if (isLoading) {
      return;
    }

    setError(null);
    setMessage(null);
    setIsLoading(true);

    try {
      const response =
        await fetch(
          "/api/billing/plan-change",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            credentials: "include",

            body: JSON.stringify({
              billingInterval,
            }),
          },
        );

      const result =
        (await response.json()) as PlanChangeResponse;

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "The plan change could not be completed.",
        );
      }

      const effectiveAt =
        result.data?.effectiveAt;

      setMessage(
        effectiveAt
          ? `Payment successful. Your ${billingInterval === "ANNUAL" ? "Annual" : "Monthly"} plan will become effective on ${formatDate(effectiveAt)}.`
          : result.message ||
              "Plan change payment completed successfully.",
      );

      window.setTimeout(
        () => {
          window.location.reload();
        },
        900,
      );
    } catch (planChangeError) {
      setError(
        planChangeError instanceof Error
          ? planChangeError.message
          : "The plan change could not be completed.",
      );

      setIsLoading(false);
    }
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={
          handlePlanChange
        }
        disabled={isLoading}
        className="w-full rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading
          ? "Processing Payment..."
          : `Change to ${
              billingInterval ===
              "ANNUAL"
                ? "Annual"
                : "Monthly"
            }`}
      </button>

      <p className="mt-2 text-center text-xs font-medium text-amber-600">
        Development payment provider
      </p>

      {message && (
        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {message}
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}
    </div>
  );
}