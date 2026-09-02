/**
 * Author: Prem Singh
 * Purpose: Provides the Razorpay subscription checkout flow for ROOTYM SaaS
 *          initial subscriptions in Razorpay Test Mode.
 */

"use client";

import {
  useEffect,
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

interface SubscriptionResponse {
  success: boolean;
  message?: string;
  data?: {
    subscriptionId: string;
    customerId?: string;
    status: string;
    checkoutKey: string;
    billingInterval:
      | "MONTHLY"
      | "ANNUAL";
    amount: number | null;
    currency: string | null;
    plan?: {
      id: string;
      code: string;
      name: string;
    };
  };
}

interface VerificationResponse {
  success: boolean;
  message?: string;
  data?: {
    subscriptionId?: string;
    paymentId?: string;
    status?: string;
  };
}

interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
  razorpay_signature: string;
}

interface RazorpayErrorResponse {
  error?: {
    code?: string;
    description?: string;
    source?: string;
    step?: string;
    reason?: string;
    metadata?: Record<string, unknown>;
  };
}

interface RazorpayInstance {
  open: () => void;
  on: (
    event: string,
    handler: (
      response: RazorpayErrorResponse,
    ) => void,
  ) => void;
}

interface RazorpayConstructor {
  new (
    options: Record<string, unknown>,
  ): RazorpayInstance;
}

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
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

function loadRazorpayCheckout() {
  return new Promise<void>(
    (resolve, reject) => {
      if (window.Razorpay) {
        resolve();
        return;
      }

      const existingScript =
        document.querySelector(
          'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
        );

      if (existingScript) {
        existingScript.addEventListener(
          "load",
          () => resolve(),
          { once: true },
        );

        existingScript.addEventListener(
          "error",
          () =>
            reject(
              new Error(
                "Razorpay Checkout could not be loaded.",
              ),
            ),
          { once: true },
        );

        return;
      }

      const script =
        document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.async = true;

      script.onload = () => {
        if (window.Razorpay) {
          resolve();
        } else {
          reject(
            new Error(
              "Razorpay Checkout loaded but is unavailable.",
            ),
          );
        }
      };

      script.onerror = () => {
        reject(
          new Error(
            "Razorpay Checkout could not be loaded.",
          ),
        );
      };

      document.body.appendChild(script);
    },
  );
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

  useEffect(() => {
    let isMounted = true;

    loadRazorpayCheckout().catch(
      (loadError) => {
        if (!isMounted) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Razorpay Checkout could not be loaded.",
        );
      },
    );

    return () => {
      isMounted = false;
    };
  }, []);

  async function createSubscription() {
    const response =
      await fetch(
        "/api/billing/subscription",
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
      (await response.json()) as SubscriptionResponse;

    if (
      !response.ok ||
      !result.success ||
      !result.data
    ) {
      throw new Error(
        result.message ||
          "Razorpay subscription could not be created.",
      );
    }

    return result.data;
  }

  async function verifyPayment(
    response: RazorpaySuccessResponse,
  ) {
    const verificationResponse =
      await fetch(
        "/api/billing/subscription/verify",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          credentials: "include",

          body: JSON.stringify({
            razorpayPaymentId:
              response.razorpay_payment_id,

            razorpaySubscriptionId:
              response.razorpay_subscription_id,

            razorpaySignature:
              response.razorpay_signature,
          }),

        },
      );

    const result =
      (await verificationResponse.json()) as VerificationResponse;

    if (
      !verificationResponse.ok ||
      !result.success
    ) {
      throw new Error(
        result.message ||
          "Payment verification could not be completed.",
      );
    }

    return result;
  }

  async function handleCheckout() {
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
      await loadRazorpayCheckout();

      if (!window.Razorpay) {
        throw new Error(
          "Razorpay Checkout is unavailable.",
        );
      }

      const subscription =
        await createSubscription();

      const razorpay =
        new window.Razorpay({
          key:
            subscription.checkoutKey,

          subscription_id:
            subscription.subscriptionId,

          name: "ROOTYM",

          description:
            billingInterval === "ANNUAL"
              ? "ROOTYM SaaS Annual Subscription"
              : "ROOTYM SaaS Monthly Subscription",

          handler:
            async (
              response: RazorpaySuccessResponse,
            ) => {
              try {
                setError(null);
                setMessage(
                  "Payment received. Verifying payment...",
                );

                await verifyPayment(
                  response,
                );

                setMessage(
                  "Payment verified successfully. Activating your ROOTYM subscription...",
                );

                window.setTimeout(
                  () => {
                    window.location.reload();
                  },
                  700,
                );
              } catch (verificationError) {
                setError(
                  verificationError instanceof
                    Error
                    ? verificationError.message
                    : "Payment verification failed.",
                );

                setIsLoading(false);
              }
            },
        });

      razorpay.on(
        "payment.failed",
        (
          response: RazorpayErrorResponse,
        ) => {
          const description =
            response.error
              ?.description;

          setError(
            description ||
              "Razorpay payment failed. Please try again.",
          );

          setIsLoading(false);
        },
      );

      razorpay.open();
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Razorpay checkout could not be started.",
      );

      setIsLoading(false);
    }
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={handleCheckout}
        disabled={
          disabled ||
          current ||
          isLoading
        }
        className="w-full rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading
          ? "Processing Payment..."
          : current
            ? "Current Billing"
            : `Subscribe with Razorpay — ${
                billingInterval ===
                "ANNUAL"
                  ? "Annual"
                  : "Monthly"
              }`}
      </button>

      <p className="mt-2 text-center text-xs font-medium text-emerald-600">
        Razorpay Test Mode
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
