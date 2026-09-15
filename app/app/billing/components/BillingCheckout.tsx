/**
 * Author: Prem Singh
 * Purpose: Provides the ROOTYM SaaS billing details form and Razorpay subscription checkout flow.
 */

"use client";

import {
  FormEvent,
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

interface BillingDetails {
  customerName: string;
  mobile: string;
  email: string;
  billingAddressLine1: string;
  billingAddressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  gstRegistered: boolean;
  gstin: string;
}

interface BillingDetailsResponse {
  success: boolean;
  message?: string;
  data?: BillingDetails;
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

function formatCurrency(amount: number) {
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

function createInitialBillingDetails(): BillingDetails {
  return {
    customerName: "",
    mobile: "",
    email: "",
    billingAddressLine1: "",
    billingAddressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    gstRegistered: false,
    gstin: "",
  };
}

export default function BillingCheckout({
  billingInterval,
  price,
  disabled = false,
  current = false,
}: BillingCheckoutProps) {
  const [billingDetails, setBillingDetails] =
    useState<BillingDetails>(
      createInitialBillingDetails(),
    );

  const [isLoading, setIsLoading] =
    useState(false);

  const [isLoadingDetails, setIsLoadingDetails] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadBillingDetails() {
      try {
        const response = await fetch(
          "/api/billing/customer-details",
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          },
        );

        const result =
          (await response.json()) as BillingDetailsResponse;

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Billing details could not be loaded.",
          );
        }

        if (
          isMounted &&
          result.success &&
          result.data
        ) {
          setBillingDetails({
            customerName:
              result.data.customerName || "",
            mobile:
              result.data.mobile || "",
            email:
              result.data.email || "",
            billingAddressLine1:
              result.data.billingAddressLine1 || "",
            billingAddressLine2:
              result.data.billingAddressLine2 || "",
            city:
              result.data.city || "",
            state:
              result.data.state || "",
            postalCode:
              result.data.postalCode || "",
            country:
              result.data.country || "India",
            gstRegistered:
              Boolean(
                result.data.gstRegistered,
              ),
            gstin:
              result.data.gstin || "",
          });
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Billing details could not be loaded.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoadingDetails(false);
        }
      }
    }

    void loadBillingDetails();

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

  function updateBillingDetails(
    field: keyof BillingDetails,
    value: string | boolean,
  ) {
    setBillingDetails((currentDetails) => ({
      ...currentDetails,
      [field]: value,
    }));
  }

  async function saveBillingDetails() {
    const response = await fetch(
      "/api/billing/customer-details",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        credentials: "include",
        body: JSON.stringify(
          billingDetails,
        ),
      },
    );

    const result =
      (await response.json()) as BillingDetailsResponse;

    if (
      !response.ok ||
      !result.success ||
      !result.data
    ) {
      throw new Error(
        result.message ||
          "Billing details could not be saved.",
      );
    }

    return result.data;
  }

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

  async function handleCheckout(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      isLoading ||
      disabled ||
      current ||
      isLoadingDetails
    ) {
      return;
    }

    setError(null);
    setMessage(null);
    setIsLoading(true);

    try {
      await saveBillingDetails();
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
          prefill: {
            name:
              billingDetails.customerName,
            email:
              billingDetails.email,
            contact:
              billingDetails.mobile,
          },
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
    <form
      onSubmit={handleCheckout}
      className="mt-6 space-y-5"
    >
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-slate-900">
            Billing Information
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            These details will be used for your
            ROOTYM GST invoice.
          </p>
        </div>

        {isLoadingDetails ? (
          <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-500">
            Loading saved billing details...
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className="mb-1 block text-sm font-medium text-slate-700">
                Business / Customer Name *
              </span>
              <input
                type="text"
                value={billingDetails.customerName}
                onChange={(event) =>
                  updateBillingDetails(
                    "customerName",
                    event.target.value,
                  )
                }
                autoComplete="organization"
                required
                disabled={isLoading}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:bg-slate-50"
              />
            </label>

            <label>
              <span className="mb-1 block text-sm font-medium text-slate-700">
                Mobile Number *
              </span>
              <input
                type="tel"
                value={billingDetails.mobile}
                onChange={(event) =>
                  updateBillingDetails(
                    "mobile",
                    event.target.value,
                  )
                }
                autoComplete="tel"
                required
                disabled={isLoading}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:bg-slate-50"
              />
            </label>

            <label>
              <span className="mb-1 block text-sm font-medium text-slate-700">
                Email *
              </span>
              <input
                type="email"
                value={billingDetails.email}
                onChange={(event) =>
                  updateBillingDetails(
                    "email",
                    event.target.value,
                  )
                }
                autoComplete="email"
                required
                disabled={isLoading}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:bg-slate-50"
              />
            </label>

            <label className="sm:col-span-2">
              <span className="mb-1 block text-sm font-medium text-slate-700">
                Billing Address *
              </span>
              <input
                type="text"
                value={
                  billingDetails.billingAddressLine1
                }
                onChange={(event) =>
                  updateBillingDetails(
                    "billingAddressLine1",
                    event.target.value,
                  )
                }
                autoComplete="street-address"
                required
                disabled={isLoading}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:bg-slate-50"
              />
            </label>

            <label className="sm:col-span-2">
              <span className="mb-1 block text-sm font-medium text-slate-700">
                Address Line 2
              </span>
              <input
                type="text"
                value={
                  billingDetails.billingAddressLine2
                }
                onChange={(event) =>
                  updateBillingDetails(
                    "billingAddressLine2",
                    event.target.value,
                  )
                }
                autoComplete="address-line2"
                disabled={isLoading}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:bg-slate-50"
              />
            </label>

            <label>
              <span className="mb-1 block text-sm font-medium text-slate-700">
                City *
              </span>
              <input
                type="text"
                value={billingDetails.city}
                onChange={(event) =>
                  updateBillingDetails(
                    "city",
                    event.target.value,
                  )
                }
                autoComplete="address-level2"
                required
                disabled={isLoading}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:bg-slate-50"
              />
            </label>

            <label>
              <span className="mb-1 block text-sm font-medium text-slate-700">
                State *
              </span>
              <input
                type="text"
                value={billingDetails.state}
                onChange={(event) =>
                  updateBillingDetails(
                    "state",
                    event.target.value,
                  )
                }
                autoComplete="address-level1"
                required
                disabled={isLoading}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:bg-slate-50"
              />
            </label>

            <label>
              <span className="mb-1 block text-sm font-medium text-slate-700">
                Postal Code *
              </span>
              <input
                type="text"
                value={
                  billingDetails.postalCode
                }
                onChange={(event) =>
                  updateBillingDetails(
                    "postalCode",
                    event.target.value,
                  )
                }
                autoComplete="postal-code"
                required
                disabled={isLoading}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:bg-slate-50"
              />
            </label>

            <label>
              <span className="mb-1 block text-sm font-medium text-slate-700">
                Country *
              </span>
              <input
                type="text"
                value={billingDetails.country}
                onChange={(event) =>
                  updateBillingDetails(
                    "country",
                    event.target.value,
                  )
                }
                autoComplete="country-name"
                required
                disabled={isLoading}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:bg-slate-50"
              />
            </label>

            <div className="sm:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={
                    billingDetails.gstRegistered
                  }
                  onChange={(event) =>
                    updateBillingDetails(
                      "gstRegistered",
                      event.target.checked,
                    )
                  }
                  disabled={isLoading}
                  className="h-4 w-4 rounded border-slate-300"
                />
                GST Registered
              </label>

              {billingDetails.gstRegistered && (
                <label className="mt-3 block">
                  <span className="mb-1 block text-sm font-medium text-slate-700">
                    GSTIN *
                  </span>
                  <input
                    type="text"
                    value={
                      billingDetails.gstin
                    }
                    onChange={(event) =>
                      updateBillingDetails(
                        "gstin",
                        event.target.value.toUpperCase(),
                      )
                    }
                    autoComplete="off"
                    maxLength={15}
                    required
                    disabled={isLoading}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm uppercase outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:bg-slate-50"
                  />
                </label>
              )}
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={
          disabled ||
          current ||
          isLoading ||
          isLoadingDetails
        }
        className="w-full rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading
          ? "Processing Payment..."
          : current
            ? "Current Billing"
            : `Subscribe with Razorpay — ${
                billingInterval === "ANNUAL"
                  ? "Annual"
                  : "Monthly"
              }`}
      </button>

      <p className="text-center text-xs font-medium text-emerald-600">
      Razorpay Live Mode
      </p>

      <p className="text-center text-xs text-slate-500">
        {formatCurrency(price)}{" "}
        {billingInterval === "ANNUAL"
          ? "per year"
          : "per month"}{" "}
        (inclusive of applicable GST)
      </p>

      {message && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}
    </form>
  );
}
