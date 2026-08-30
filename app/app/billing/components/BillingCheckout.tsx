/**
 * Author: Prem Singh
 * Purpose: Provides a temporary local billing checkout flow for testing ROOTYM subscription activation without Razorpay.
 */

"use client";

import {
  useState,
} from "react";

interface BillingCheckoutProps {
  billingInterval:
    | "MONTHLY"
    | "ANNUAL";

  price: number;

  disabled?: boolean;

  current?: boolean;
}

interface TestPaymentResponse {
  success: boolean;

  message?: string;

  data?: {
    subscriptionId: string;

    status: string;

    billingInterval:
      | "MONTHLY"
      | "ANNUAL";

    amount: number | null;

    currency: string | null;

    paymentId: string;
  };
}

function formatCurrency(
  amount: number,
) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    },
  ).format(amount);
}

export default function BillingCheckout({
  billingInterval,
  price,
  disabled = false,
  current = false,
}: BillingCheckoutProps) {
  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState<string | null>(null);

  async function handleTestPayment() {
    if (
      isLoading ||
      disabled ||
      current
    ) {
      return;
    }

    setError(null);
    setMessage(null);
    setIsLoading(true);

    try {
      const response =
        await fetch(
          "/api/billing/test-payment",
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
        (await response.json()) as TestPaymentResponse;

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Test payment could not be completed.",
        );
      }

      setMessage(
        result.message ||
          "Test payment completed successfully.",
      );

      /*
       * Refresh the server-rendered billing
       * state after the database transaction
       * has completed.
       */
      window.setTimeout(
        () => {
          window.location.reload();
        },
        700,
      );
    } catch (paymentError) {
      setError(
        paymentError instanceof Error
          ? paymentError.message
          : "Test payment failed.",
      );

      setIsLoading(false);
    }
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={
          handleTestPayment
        }
        disabled={
          disabled ||
          current ||
          isLoading
        }
        className="w-full rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading
          ? "Processing Test Payment..."
          : current
            ? "Current Billing"
            : `Complete Test Payment — ${
                billingInterval ===
                "ANNUAL"
                  ? "Annual"
                  : "Monthly"
              }`}
      </button>

      <p className="mt-2 text-center text-xs font-medium text-amber-600">
        Temporary test mode — Razorpay is bypassed
      </p>

      <p className="mt-3 text-center text-xs text-slate-500">
        {formatCurrency(price)}{" "}
        {billingInterval ===
        "ANNUAL"
          ? "per year"
          : "per month"}
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