/**
 * ============================================================
 * ROOTYM SaaS Billing
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides authenticated customer controls for
 *          managing and cancelling the current ROOTYM SaaS
 *          subscription.
 * ============================================================
 */

"use client";

import {
  useState,
} from "react";

type BillingSubscriptionManagerProps = {
  currentPeriodEnd: string | null;
  billingInterval: "MONTHLY" | "ANNUAL" | null;
};

type CancellationMode =
  | "CYCLE_END"
  | "IMMEDIATE"
  | null;

export default function BillingSubscriptionManager({
  currentPeriodEnd,
  billingInterval,
}: BillingSubscriptionManagerProps) {
  const [
    isOpen,
    setIsOpen,
  ] = useState(false);

  const [
    cancellationMode,
    setCancellationMode,
  ] = useState<CancellationMode>(null);

  const [
    isCancelling,
    setIsCancelling,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState<string | null>(null);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  const formattedPeriodEnd =
    currentPeriodEnd
      ? new Intl.DateTimeFormat(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        ).format(
          new Date(currentPeriodEnd)
        )
      : null;

  const billingLabel =
    billingInterval === "ANNUAL"
      ? "Annual"
      : billingInterval === "MONTHLY"
        ? "Monthly"
        : "Current";

  function openManager() {
    setMessage(null);
    setError(null);
    setCancellationMode(null);
    setIsOpen(true);
  }

  function closeManager() {
    if (isCancelling) {
      return;
    }

    setIsOpen(false);
    setCancellationMode(null);
    setError(null);
  }

  async function handleCancel(
    cancelAtCycleEnd: boolean
  ) {
    setIsCancelling(true);
    setError(null);
    setMessage(null);

    try {
      const response =
        await fetch(
          "/api/billing/subscription",
          {
            method: "DELETE",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              cancelAtCycleEnd,
            }),
          }
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ??
            "Unable to cancel the subscription."
        );
      }

      setMessage(
        cancelAtCycleEnd
          ? "Your subscription is scheduled to cancel at the end of the current billing period. No further renewal payment will be taken."
          : "Your subscription cancellation has been requested immediately."
      );

      setCancellationMode(null);
    } catch (cancelError) {
      setError(
        cancelError instanceof Error
          ? cancelError.message
          : "Unable to cancel the subscription."
      );
    } finally {
      setIsCancelling(false);
    }
  }

  return (
    <div className="mt-6">
      {!isOpen ? (
        <button
          type="button"
          onClick={openManager}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
        >
          Manage Subscription
        </button>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Manage Subscription
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                {billingLabel} billing
                {formattedPeriodEnd
                  ? ` · Current period ends ${formattedPeriodEnd}`
                  : ""}
              </p>
            </div>

            <button
              type="button"
              onClick={closeManager}
              disabled={isCancelling}
              className="text-xs font-medium text-slate-500 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Close
            </button>
          </div>

          {message && (
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-5 text-emerald-800">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-800">
              {error}
            </div>
          )}

          {!message && (
            <>
              {!cancellationMode && (
                <div className="mt-5 space-y-3">
                  <button
                    type="button"
                    onClick={() =>
                      setCancellationMode(
                        "CYCLE_END"
                      )
                    }
                    disabled={
                      isCancelling
                    }
                    className="w-full rounded-xl border border-amber-300 bg-white px-4 py-3 text-left transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span className="block text-sm font-semibold text-slate-900">
                      Cancel at End of Billing Period
                    </span>

                    <span className="mt-1 block text-xs leading-5 text-slate-500">
                      Keep your workspace active
                      until the current billing
                      period ends. No further
                      automatic renewal will occur.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setCancellationMode(
                        "IMMEDIATE"
                      )
                    }
                    disabled={
                      isCancelling
                    }
                    className="w-full rounded-xl border border-red-200 bg-white px-4 py-3 text-left transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span className="block text-sm font-semibold text-red-700">
                      Cancel Immediately
                    </span>

                    <span className="mt-1 block text-xs leading-5 text-slate-500">
                      Request immediate cancellation
                      of the current subscription.
                      Your current paid period is not
                      automatically refunded.
                    </span>
                  </button>
                </div>
              )}

              {cancellationMode ===
                "CYCLE_END" && (
                <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <h4 className="text-sm font-semibold text-amber-900">
                    Confirm cancellation
                  </h4>

                  <p className="mt-2 text-xs leading-5 text-amber-800">
                    Your {billingLabel.toLowerCase()} subscription
                    will remain active
                    {formattedPeriodEnd
                      ? ` until ${formattedPeriodEnd}`
                      : " until the current billing period ends"}
                    . After that, it will not
                    renew automatically.
                  </p>

                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={() =>
                        handleCancel(
                          true
                        )
                      }
                      disabled={
                        isCancelling
                      }
                      className="rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isCancelling
                        ? "Processing..."
                        : "Confirm Cancellation"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setCancellationMode(
                          null
                        )
                      }
                      disabled={
                        isCancelling
                      }
                      className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Go Back
                    </button>
                  </div>
                </div>
              )}

              {cancellationMode ===
                "IMMEDIATE" && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
                  <h4 className="text-sm font-semibold text-red-900">
                    Confirm immediate cancellation
                  </h4>

                  <p className="mt-2 text-xs leading-5 text-red-800">
                    This will request immediate cancellation
                    of your current Razorpay subscription.
                    Cancellation does not automatically
                    refund an amount already paid.
                  </p>

                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={() =>
                        handleCancel(
                          false
                        )
                      }
                      disabled={
                        isCancelling
                      }
                      className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isCancelling
                        ? "Processing..."
                        : "Confirm Immediate Cancellation"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setCancellationMode(
                          null
                        )
                      }
                      disabled={
                        isCancelling
                      }
                      className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Go Back
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {message && (
            <button
              type="button"
              onClick={closeManager}
              className="mt-4 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Close
            </button>
          )}
        </div>
      )}
    </div>
  );
}