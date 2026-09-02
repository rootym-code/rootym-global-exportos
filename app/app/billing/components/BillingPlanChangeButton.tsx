/**
 * ============================================================
 * ROOTYM ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the billing UI action for changing an
 *          active ROOTYM subscription through Razorpay Checkout.
 * ============================================================
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
    provider: string;
    checkout: {
      providerCheckoutId?: string | null;
      providerSubscriptionId?: string | null;
      checkoutKey?: string | null;
      checkoutUrl?: string | null;
      amount: number;
      currency: string;
      status: string;
      metadata?: Record<
        string,
        unknown
      > | null;
    };
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

interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open(): void;
  on(
    event: string,
    handler: (response: {
      error?: {
        description?: string;
      };
    }) => void,
  ): void;
}

interface RazorpayPlanChangeOptions {
  key: string;
  subscription_id: string;
  name: string;
  description: string;
  handler: (
    response: RazorpaySuccessResponse,
  ) => void | Promise<void>;
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayPlanChangeConstructor {
  new (
    options: RazorpayPlanChangeOptions,
  ): RazorpayInstance;
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

async function loadRazorpayCheckout() {
  const existingWindow =
    window as unknown as {
      Razorpay?: RazorpayPlanChangeConstructor;
    };

  if (existingWindow.Razorpay) {
    return;
  }

  await new Promise<void>(
    (
      resolve,
      reject,
    ) => {
      const existingScript =
        document.querySelector(
          'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
        );

      if (existingScript) {
        existingScript.addEventListener(
          "load",
          () => resolve(),
          {
            once: true,
          },
        );

        existingScript.addEventListener(
          "error",
          () =>
            reject(
              new Error(
                "Razorpay Checkout could not be loaded.",
              ),
            ),
          {
            once: true,
          },
        );

        return;
      }

      const script =
        document.createElement(
          "script",
        );

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.async = true;

      script.onload = () =>
        resolve();

      script.onerror = () =>
        reject(
          new Error(
            "Razorpay Checkout could not be loaded.",
          ),
        );

      document.body.appendChild(
        script,
      );
    },
  );

  const razorpayWindow =
    window as unknown as {
      Razorpay?: RazorpayPlanChangeConstructor;
    };

  if (!razorpayWindow.Razorpay) {
    throw new Error(
      "Razorpay Checkout is unavailable.",
    );
  }
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
            "The plan change could not be initialized.",
        );
      }

      const checkout =
        result.data?.checkout;

      const checkoutKey =
        checkout?.checkoutKey;

      const providerSubscriptionId =
        checkout?.providerSubscriptionId;

      if (
        result.data?.provider !==
        "RAZORPAY"
      ) {
        throw new Error(
          "Razorpay is not the active payment provider for this plan change.",
        );
      }

      if (!checkoutKey) {
        throw new Error(
          "Razorpay Checkout could not be initialized because the checkout key is missing.",
        );
      }

      if (!providerSubscriptionId) {
        throw new Error(
          "Razorpay Checkout could not be initialized because the subscription ID is missing.",
        );
      }

      await loadRazorpayCheckout();

      const razorpayWindow =
        window as unknown as {
          Razorpay?: RazorpayPlanChangeConstructor;
        };

      if (!razorpayWindow.Razorpay) {
        throw new Error(
          "Razorpay Checkout is unavailable.",
        );
      }

      const razorpay =
        new razorpayWindow.Razorpay(
          {
            key: checkoutKey,
            subscription_id:
              providerSubscriptionId,
            name: "ROOTYM",
            description:
              `ROOTYM SaaS ${
                billingInterval ===
                "ANNUAL"
                  ? "Annual"
                  : "Monthly"
              } Plan`,
            handler:
              async (
                razorpayResponse: RazorpaySuccessResponse,
              ) => {
                try {
                  setMessage(
                    "Payment received. Verifying your payment...",
                  );

                  const verifyResponse =
                    await fetch(
                      "/api/billing/subscription/verify",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type":
                            "application/json",
                        },
                        credentials:
                          "include",
                        body:
                          JSON.stringify({
                            razorpayPaymentId:
                              razorpayResponse.razorpay_payment_id,
                            razorpaySubscriptionId:
                              razorpayResponse.razorpay_subscription_id,
                            razorpaySignature:
                              razorpayResponse.razorpay_signature,
                          }),
                      },
                    );

                  const verifyResult =
                    (await verifyResponse.json()) as {
                      success: boolean;
                      message?: string;
                    };

                  if (
                    !verifyResponse.ok ||
                    !verifyResult.success
                  ) {
                    throw new Error(
                      verifyResult.message ||
                        "Payment verification could not be completed.",
                    );
                  }

                  setMessage(
                    result.data?.effectiveAt
                      ? `Payment successful. Your ${
                          billingInterval ===
                          "ANNUAL"
                            ? "Annual"
                            : "Monthly"
                        } plan will become effective on ${formatDate(
                          result.data
                            .effectiveAt,
                        )}.`
                      : "Payment successful. Your plan change has been confirmed.",
                  );

                  window.setTimeout(
                    () => {
                      window.location.reload();
                    },
                    900,
                  );
                } catch (
                  verificationError
                ) {
                  setError(
                    verificationError instanceof
                      Error
                      ? verificationError.message
                      : "Payment verification could not be completed.",
                  );

                  setIsLoading(false);
                }
              },
            modal: {
              ondismiss: () => {
                setIsLoading(false);
                setMessage(
                  "Payment was not completed. You can try again.",
                );
              },
            },
          },
        );

      razorpay.on(
        "payment.failed",
        (paymentFailedResponse) => {
          setError(
            paymentFailedResponse.error
              ?.description ||
              "The payment failed. Your current plan remains unchanged.",
          );

          setIsLoading(false);
        },
      );

      razorpay.open();
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
          ? "Opening Payment..."
          : `Change to ${
              billingInterval ===
              "ANNUAL"
                ? "Annual"
                : "Monthly"
            }`}
      </button>

      <p className="mt-2 text-center text-xs font-medium text-amber-600">
        Razorpay Test Mode
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