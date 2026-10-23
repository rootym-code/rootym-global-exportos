"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CheckCircle2,
  CreditCard,
  Loader2,
  Save,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

import { Button } from "@/components/ui/Button";

interface StoreSettingsData {
  id?: string;
  storeEnabled: boolean;
  cartEnabled: boolean;
  guestCheckoutEnabled: boolean;
  defaultCurrency: string;
  shippingMode: string;
}

type ShippingPricingType = "FLAT_RATE" | "WEIGHT_BASED";

interface ShippingRule {
  id: string;
  name: string;
  zoneName: string | null;
  countryCode: string;
  stateCode: string | null;
  postalCode: string | null;
  postalCodePrefix: string | null;
  pricingType: ShippingPricingType;
  currency: string;
  flatRate: number | string;
  baseCharge: number | string;
  includedWeightKg: number | string | null;
  additionalPerKg: number | string | null;
  isActive: boolean;
  effectiveFrom: string | null;
  effectiveTo: string | null;
}

interface ShippingRulesResponse {
  success: boolean;
  message?: string;
  data?: {
    website: {
      name: string;
      slug: string;
    };
    settings: {
      shippingEnabled: boolean;
      shippingMode: string;
      defaultCurrency: string;
    };
    rules: ShippingRule[];
  };
}

interface StorePaymentData {
  id?: string;
  provider: string;
  environment: "TEST" | "LIVE";
  publicKeyId: string | null;
  paymentsEnabled: boolean;
  verifiedAt: string | null;
}

interface StoreSettingsResponse {
  success: boolean;
  message?: string;
  data?: {
    website: {
      name: string;
      slug: string;
    };
    settings: StoreSettingsData | null;
    payment: StorePaymentData | null;
    secretsConfigured: {
      keySecret: boolean;
      webhookSecret: boolean;
    };
    saved?: boolean;
    storeActivationPending?: boolean;
  };
}

interface StoreSettingsFormProps {
  canEdit: boolean;
}

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:bg-slate-50";

export default function StoreSettingsForm({
  canEdit,
}: StoreSettingsFormProps) {
  const [websiteName, setWebsiteName] = useState("");
  const [websiteSlug, setWebsiteSlug] = useState("");

  const [storeEnabled, setStoreEnabled] = useState(false);
  const [cartEnabled, setCartEnabled] = useState(false);
  const [guestCheckoutEnabled, setGuestCheckoutEnabled] =
    useState(true);
  const [defaultCurrency, setDefaultCurrency] = useState("INR");

  const [environment, setEnvironment] =
    useState<"TEST" | "LIVE">("TEST");
  const [publicKeyId, setPublicKeyId] = useState("");
  const [keySecret, setKeySecret] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");
  const [keySecretConfigured, setKeySecretConfigured] =
    useState(false);
  const [webhookSecretConfigured, setWebhookSecretConfigured] =
    useState(false);
  const [paymentsEnabled, setPaymentsEnabled] = useState(false);

  const [verifyingPayment, setVerifyingPayment] = useState(false);
const [paymentVerifiedAt, setPaymentVerifiedAt] = useState<string | null>(
  null,
);
  const [shippingRules, setShippingRules] = useState<ShippingRule[]>([]);
const [shippingEnabled, setShippingEnabled] = useState(false);
const [shippingLoading, setShippingLoading] = useState(true);
const [shippingError, setShippingError] = useState("");
const [shippingSuccess, setShippingSuccess] = useState("");
const [shippingSaving, setShippingSaving] = useState(false);
const [showShippingForm, setShowShippingForm] = useState(false);

const [shippingPricingType, setShippingPricingType] =
  useState<ShippingPricingType>("FLAT_RATE");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      const response = await fetch(
        "/api/workspace/website/store-settings",
        {
          credentials: "include",
          cache: "no-store",
        },
      );

      const result: StoreSettingsResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ?? "Unable to load store settings.",
        );
      }

      const data = result.data;

      if (!data) {
        throw new Error("The store settings response was incomplete.");
      }

      setWebsiteName(data.website.name);
      setWebsiteSlug(data.website.slug);

      setStoreEnabled(data.settings?.storeEnabled ?? false);
      setCartEnabled(data.settings?.cartEnabled ?? false);
      setGuestCheckoutEnabled(
        data.settings?.guestCheckoutEnabled ?? true,
      );
      setDefaultCurrency(
        data.settings?.defaultCurrency ?? "INR",
      );

      setEnvironment(
        data.payment?.environment === "LIVE" ? "LIVE" : "TEST",
      );
      setPublicKeyId(data.payment?.publicKeyId ?? "");
      setPaymentsEnabled(data.payment?.paymentsEnabled ?? false);

      setKeySecretConfigured(data.secretsConfigured.keySecret);
      setWebhookSecretConfigured(
        data.secretsConfigured.webhookSecret,
      );

      // Never populate secret inputs with stored credentials.
      setKeySecret("");
      setWebhookSecret("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load store settings.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

const loadShippingRules = useCallback(async () => {
  try {
    setShippingLoading(true);
    setShippingError("");

    const response = await fetch(
      "/api/workspace/website/shipping-rules",
      {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      },
    );

    const result: ShippingRulesResponse = await response.json();

    if (!response.ok || !result.success || !result.data) {
      throw new Error(
        result.message ?? "Unable to load shipping rules.",
      );
    }

    setShippingRules(result.data.rules);
    setShippingEnabled(result.data.settings.shippingEnabled);
  } catch (err) {
    setShippingError(
      err instanceof Error
        ? err.message
        : "Unable to load shipping rules.",
    );
  } finally {
    setShippingLoading(false);
  }
}, []);

useEffect(() => {
  void loadShippingRules();
}, [loadShippingRules]);

const handleSave = async () => {
    if (!canEdit || saving) return;

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const payload: Record<string, unknown> = {
        storeEnabled,
        cartEnabled,
        guestCheckoutEnabled,
        defaultCurrency,
        shippingMode: "MANUAL",
      };

      // Empty secret fields mean keep the existing encrypted credentials.
      if (keySecret.trim()) {
        payload.keySecret = keySecret.trim();
      }

      if (webhookSecret.trim()) {
        payload.webhookSecret = webhookSecret.trim();
      }

      const response = await fetch(
        "/api/workspace/website/store-settings",
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const result: StoreSettingsResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ?? "Unable to save store settings.",
        );
      }

      setKeySecret("");
      setWebhookSecret("");

      setSuccessMessage(
        result.message ??
          "Settings saved. Online checkout remains disabled until verification is available.",
      );

      await loadSettings();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save store settings.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyPayment = async () => {
    if (!canEdit || saving || verifyingPayment) return;
  
    try {
      setVerifyingPayment(true);
      setError("");
      setSuccessMessage("");
  
      const response = await fetch(
        "/api/workspace/website/store-settings/verify-payment",
        {
          method: "POST",
          credentials: "include",
        },
      );
  
      const result = await response.json();
  
      if (!response.ok || !result.success) {
        throw new Error(
          result.message ?? "Unable to verify Razorpay credentials.",
        );
      }
  
      setPaymentVerifiedAt(result.data?.verifiedAt ?? null);
      setPaymentsEnabled(false);
  
      setSuccessMessage(
        "Razorpay TEST API credentials verified successfully. Online payments remain disabled.",
      );
  
      await loadSettings();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to verify Razorpay credentials.",
      );
    } finally {
      setVerifyingPayment(false);
    }
  };

  const handleEnableTestPayments = async () => {
    if (
      !canEdit ||
      saving ||
      verifyingPayment ||
      environment !== "TEST" ||
      !paymentVerifiedAt
    ) {
      return;
    }
  
    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");
  
      const response = await fetch(
        "/api/workspace/website/store-settings",
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentsEnabled: true,
          }),
        },
      );
  
      const result: StoreSettingsResponse = await response.json();
  
      if (!response.ok || !result.success) {
        throw new Error(
          result.message ?? "Unable to enable Razorpay TEST payments.",
        );
      }
  
      setSuccessMessage("Razorpay TEST payments enabled successfully.");
      await loadSettings();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to enable Razorpay TEST payments.",
      );
    } finally {
      setSaving(false);
    }
  };

const handleShippingRuleSave = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!canEdit || shippingSaving) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const pricingType = String(
      formData.get("pricingType") ?? "FLAT_RATE",
    ) as ShippingPricingType;

    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      zoneName: String(formData.get("zoneName") ?? "").trim() || null,
      countryCode: String(formData.get("countryCode") ?? "IN")
        .trim()
        .toUpperCase(),
      stateCode: String(formData.get("stateCode") ?? "").trim() || null,
      postalCode: String(formData.get("postalCode") ?? "").trim() || null,
      postalCodePrefix:
        String(formData.get("postalCodePrefix") ?? "").trim() || null,
      pricingType,
      currency: defaultCurrency,
      flatRate: Number(formData.get("flatRate") ?? 0),
      baseCharge: Number(formData.get("baseCharge") ?? 0),
      includedWeightKg:
        pricingType === "WEIGHT_BASED"
          ? Number(formData.get("includedWeightKg"))
          : null,
      additionalPerKg:
        pricingType === "WEIGHT_BASED"
          ? Number(formData.get("additionalPerKg"))
          : null,
      isActive: formData.get("isActive") === "on",
    };

    if (!payload.name) {
      setShippingError("Enter a name for this shipping rule.");
      return;
    }

    if (
      !Number.isFinite(payload.flatRate) ||
      payload.flatRate < 0 ||
      !Number.isFinite(payload.baseCharge) ||
      payload.baseCharge < 0
    ) {
      setShippingError("Shipping charges must be valid non-negative numbers.");
      return;
    }

    if (
      pricingType === "WEIGHT_BASED" &&
      (!Number.isFinite(payload.includedWeightKg) ||
        payload.includedWeightKg === null ||
        payload.includedWeightKg < 0 ||
        !Number.isFinite(payload.additionalPerKg) ||
        payload.additionalPerKg === null ||
        payload.additionalPerKg < 0)
    ) {
      setShippingError(
        "Enter valid included weight and additional charge per kg.",
      );
      return;
    }

    try {
      setShippingSaving(true);
      setShippingError("");
      setShippingSuccess("");

      const response = await fetch(
        "/api/workspace/website/shipping-rules",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const result: ShippingRulesResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message ?? "Unable to save shipping rule.");
      }

      setShippingSuccess("Shipping rule created successfully.");
      setShowShippingForm(false);
      form.reset();

      await loadShippingRules();
    } catch (err) {
      setShippingError(
        err instanceof Error
          ? err.message
          : "Unable to save shipping rule.",
      );
    } finally {
      setShippingSaving(false);
    }
  };

if (loading) {
    return (
      <section className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <div className="flex min-h-[240px] items-center justify-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading online store settings...
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
      <div className="space-y-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                <ShoppingBag className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                  Ecommerce
                </p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
                  Online Store Settings
                </h2>
              </div>
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-500">
              Configure online purchasing for {websiteName}. Products
              using fixed prices will be eligible for online checkout
              once the complete payment and order safeguards are ready.
              Market-price products will continue using enquiries and
              quotations.
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Website: {websiteSlug}
            </p>
          </div>

          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 ring-1 ring-amber-100">
            <ShieldCheck className="h-4 w-4" />
            Checkout not activated
          </span>
        </header>

        {error && (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="flex items-start gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            {successMessage}
          </div>
        )}

        <fieldset disabled={!canEdit || saving} className="space-y-8">
          <section className="space-y-5">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Store and checkout
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Choose your intended store behaviour. Saving these
                preferences does not activate checkout yet.
              </p>
            </div>

            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4">
              <input
                type="checkbox"
                checked={storeEnabled}
                onChange={(event) =>
                  setStoreEnabled(event.target.checked)
                }
                className="mt-1 h-4 w-4 accent-emerald-600"
              />
              <span>
                <span className="block text-sm font-semibold text-slate-800">
                  Enable online store
                </span>
                <span className="mt-1 block text-sm text-slate-500">
                  Indicates that this website intends to offer online
                  sales. Activation is currently blocked by the API.
                </span>
              </span>
            </label>

            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4">
              <input
                type="checkbox"
                checked={cartEnabled}
                onChange={(event) =>
                  setCartEnabled(event.target.checked)
                }
                className="mt-1 h-4 w-4 accent-emerald-600"
              />
              <span>
                <span className="block text-sm font-semibold text-slate-800">
                  Enable Add to Cart
                </span>
                <span className="mt-1 block text-sm text-slate-500">
                  Intended for products with a valid fixed price.
                </span>
              </span>
            </label>

            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4">
              <input
                type="checkbox"
                checked={guestCheckoutEnabled}
                onChange={(event) =>
                  setGuestCheckoutEnabled(event.target.checked)
                }
                className="mt-1 h-4 w-4 accent-emerald-600"
              />
              <span>
                <span className="block text-sm font-semibold text-slate-800">
                  Allow guest checkout
                </span>
                <span className="mt-1 block text-sm text-slate-500">
                  Intended to let customers place orders without
                  creating an account.
                </span>
              </span>
            </label>

            <div className="max-w-sm">
              <label
                htmlFor="store-currency"
                className="text-sm font-semibold text-slate-800"
              >
                Store currency
              </label>
              <select
                id="store-currency"
                value={defaultCurrency}
                onChange={(event) =>
                  setDefaultCurrency(event.target.value)
                }
                className={inputClass}
              >
                <option value="INR">INR — Indian Rupee</option>
                <option value="USD">USD — US Dollar</option>
                <option value="EUR">EUR — Euro</option>
                <option value="GBP">GBP — British Pound</option>
                <option value="AED">AED — UAE Dirham</option>
              </select>
              <p className="mt-1.5 text-xs text-slate-400">
                The selected currency must be supported by your
                payment account before checkout can go live.
              </p>
            </div>
          </section>

<section className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 sm:p-6">
  <div className="flex items-start gap-3">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
      <ShieldCheck className="h-5 w-5 text-emerald-700" />
    </div>
    <div>
      <h3 className="text-lg font-bold text-slate-900">
        Razorpay Setup Guide
      </h3>
      <p className="mt-1 text-sm leading-6 text-slate-600">
        Complete these steps in order before connecting your payment
        account. Start with Test Mode; do not use live credentials yet.
      </p>
      <a
        href="https://razorpay.com/docs/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex text-sm font-semibold text-emerald-800 underline underline-offset-4"
      >
        Open official Razorpay Help & Documentation ↗
      </a>
    </div>
  </div>

  <ol className="mt-6 space-y-5">
    <li className="flex gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-emerald-800 ring-1 ring-emerald-200">
        1
      </span>
      <div>
        <h4 className="font-semibold text-slate-900">
          Open your Razorpay Dashboard
        </h4>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Sign in to your business account and complete any required
          business verification and account activation.
        </p>
        <a
          href="https://dashboard.razorpay.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex text-sm font-semibold text-emerald-800 underline underline-offset-4"
        >
          Open Razorpay Dashboard ↗
        </a>
      </div>
    </li>

    <li className="flex gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-emerald-800 ring-1 ring-emerald-200">
        2
      </span>
      <div>
        <h4 className="font-semibold text-slate-900">
          Generate your Key ID and Key Secret
        </h4>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          In Razorpay, select Test Mode and navigate to Account &amp;
          Settings → API Keys → Generate Key. Save both values securely
          when they appear.
        </p>
        <ul className="mt-2 space-y-1 text-sm text-slate-600">
          <li>
            <strong>Key ID:</strong> Enter it in the Razorpay Key ID field below.
          </li>
          <li>
            <strong>Key Secret:</strong> Enter it in the Razorpay Key Secret field.
            It is sensitive and must not be shared.
          </li>
        </ul>
        <a
          href="https://razorpay.com/docs/payments/dashboard/settings/api-keys/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex text-sm font-semibold text-emerald-800 underline underline-offset-4"
        >
          Follow the official API key instructions ↗
        </a>
      </div>
    </li>

    <li className="flex gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-emerald-800 ring-1 ring-emerald-200">
        3
      </span>
      <div>
        <h4 className="font-semibold text-slate-900">
          Configure the Webhook Secret
        </h4>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          In Razorpay, open Account &amp; Settings → Webhooks → Add New
          Webhook. ROOTYM must provide the actual public HTTPS webhook
          URL before you can complete this step. Do not enter localhost
          or invent an endpoint.
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Create a webhook secret in Razorpay and save it securely.
          Enter that same value in the Razorpay Webhook Secret field
          below. This is separate from the API Key Secret.
        </p>
        <a
          href="https://razorpay.com/docs/payments/dashboard/account-settings/webhooks/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex text-sm font-semibold text-emerald-800 underline underline-offset-4"
        >
          Follow the official webhook setup instructions ↗
        </a>
      </div>
    </li>

    <li className="flex gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-emerald-800 ring-1 ring-emerald-200">
        4
      </span>
      <div>
        <h4 className="font-semibold text-slate-900">
          Save credentials in ROOTYM
        </h4>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Return to this page, select Test Mode, enter the three
          credentials in their matching fields, and save. Leave a
          secret field blank when you want to retain an existing saved
          secret.
        </p>
      </div>
    </li>

    <li className="flex gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-emerald-800 ring-1 ring-emerald-200">
        5
      </span>
      <div>
        <h4 className="font-semibold text-slate-900">
          Test and prepare for launch
        </h4>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Complete a test payment only after ROOTYM's payment creation,
          signature verification, webhook processing and order handling
          are implemented. Switch to Live Mode only after the full
          production readiness checks pass.
        </p>
      </div>
    </li>
  </ol>

  <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
    <p className="text-sm font-semibold text-amber-900">
      Security reminder
    </p>
    <p className="mt-1 text-sm leading-6 text-amber-800">
      Never share your Key Secret or Webhook Secret by email, chat,
      screenshots or public code repositories. ROOTYM should store
      them securely and never display their saved values.
    </p>
  </div>
</section>

<section className="space-y-5 border-t border-slate-200 pt-8">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <CreditCard className="h-5 w-5 text-slate-700" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Razorpay payment configuration
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Connect the merchant account that belongs to this
                  business. Secret credentials are encrypted on the
                  server and are never returned to the form.
                </p>
              </div>
            </div>

            <div className="max-w-sm">
              <label
                htmlFor="razorpay-environment"
                className="text-sm font-semibold text-slate-800"
              >
                Environment
              </label>
              <select
                id="razorpay-environment"
                value={environment}
                onChange={(event) =>
                  setEnvironment(
                    event.target.value as "TEST" | "LIVE",
                  )
                }
                className={inputClass}
              >
                <option value="TEST">Test mode</option>
                <option value="LIVE">Live mode</option>
              </select>
              <p className="mt-1.5 text-xs text-slate-400">
                Start with Test mode. Live payments require additional
                verification and launch checks.
              </p>
            </div>

            <div>
              <label
                htmlFor="razorpay-public-key"
                className="text-sm font-semibold text-slate-800"
              >
                Razorpay Key ID
              </label>
              <input
                id="razorpay-public-key"
                type="text"
                autoComplete="off"
                value={publicKeyId}
                onChange={(event) =>
                  setPublicKeyId(event.target.value)
                }
                maxLength={200}
                placeholder="Enter your Razorpay Key ID"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="razorpay-key-secret"
                className="text-sm font-semibold text-slate-800"
              >
                Razorpay Key Secret
              </label>
              <input
                id="razorpay-key-secret"
                type="password"
                autoComplete="new-password"
                value={keySecret}
                onChange={(event) => setKeySecret(event.target.value)}
                maxLength={2000}
                placeholder={
                  keySecretConfigured
                    ? "Saved securely — enter only to replace"
                    : "Enter your Razorpay Key Secret"
                }
                className={inputClass}
              />
              <p className="mt-1.5 text-xs text-slate-500">
                {keySecretConfigured
                  ? "A secret is already saved. Leave blank to keep it."
                  : "No Key Secret is saved yet."}
              </p>
            </div>

            <div>
              <label
                htmlFor="razorpay-webhook-secret"
                className="text-sm font-semibold text-slate-800"
              >
                Razorpay Webhook Secret
              </label>
              <input
                id="razorpay-webhook-secret"
                type="password"
                autoComplete="new-password"
                value={webhookSecret}
                onChange={(event) =>
                  setWebhookSecret(event.target.value)
                }
                maxLength={2000}
                placeholder={
                  webhookSecretConfigured
                    ? "Saved securely — enter only to replace"
                    : "Enter your Razorpay Webhook Secret"
                }
                className={inputClass}
              />
              <p className="mt-1.5 text-xs text-slate-500">
                {webhookSecretConfigured
                  ? "A webhook secret is already saved. Leave blank to keep it."
                  : "No webhook secret is saved yet."}
              </p>
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
  <div>
    <p className="text-sm font-semibold text-slate-900">
      Verify Razorpay TEST credentials
    </p>

    <p className="mt-1 text-sm leading-6 text-slate-600">
      Save your credentials first, then verify the API connection.
      Verification does not enable online payments automatically.
    </p>
  </div>

  {paymentVerifiedAt && (
    <p className="text-sm font-medium text-emerald-700">
      Credentials verified successfully.
    </p>
  )}

  <Button
    type="button"
    onClick={handleVerifyPayment}
    disabled={
      !canEdit ||
      saving ||
      verifyingPayment ||
      environment !== "TEST" ||
      !publicKeyId.trim() ||
      !keySecretConfigured ||
      !webhookSecretConfigured
    }
  >
    {verifyingPayment ? (
      <>
        <Loader2 className="h-4 w-4 animate-spin" />
        Verifying credentials...
      </>
    ) : (
      <>
        <ShieldCheck className="h-4 w-4" />
        Verify Razorpay TEST Credentials
      </>
    )}
  </Button>


</div>
              {paymentVerifiedAt && environment === "TEST" && (
                <div className="border-t border-slate-200 pt-4">
                  <p className="mb-3 text-sm text-slate-600">
                    Your Razorpay TEST API credentials are verified. You can now
                    enable TEST payments for customer checkout.
                  </p>

                  <Button
                    type="button"
                    onClick={handleEnableTestPayments}
                    disabled={
                      !canEdit ||
                      saving ||
                      verifyingPayment ||
                      paymentsEnabled
                    }
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Enabling TEST payments...
                      </>
                    ) : paymentsEnabled ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        TEST Payments Enabled
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4" />
                        Enable TEST Payments
                      </>
                    )}
                  </Button>
                </div>
              )}
              
            </section>

<section className="space-y-5 border-t border-slate-200 pt-8">
  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
    <div>
      <h3 className="text-lg font-bold text-slate-900">
        Shipping rules
      </h3>
      <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
        Configure shipping rates and delivery zones for your
        store. Shipping charges will not be applied at checkout
        until shipping calculation and checkout integration are
        implemented and tested.
      </p>
    </div>

    <Button
      type="button"
      disabled={!canEdit || shippingLoading}
      onClick={() => setShowShippingForm(true)}
    >
      Add shipping rule
    </Button>
  </div>

  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
    <p className="text-sm font-semibold text-amber-900">
      {shippingEnabled
        ? "Shipping is marked as enabled in settings"
        : "Shipping is currently disabled"}
    </p>
    <p className="mt-1 text-sm leading-6 text-amber-800">
      This status does not activate shipping charges at checkout.
      Keep shipping disabled until the complete calculation flow
      is ready.
    </p>
  </div>

  {shippingError && (
    <div
      role="alert"
      className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {shippingError}
    </div>
  )}

{shippingSuccess && (
              <div
                role="status"
                className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
              >
                {shippingSuccess}
              </div>
            )}

            {showShippingForm && (
              <form
                onSubmit={handleShippingRuleSave}
                className="space-y-5 rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    Create shipping rule
                  </h4>
                  <p className="mt-1 text-sm text-slate-500">
                    Define where this rule applies and how its charge is calculated.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Rule name *
                    </label>
                    <input
                      name="name"
                      required
                      maxLength={100}
                      placeholder="e.g. Maharashtra delivery"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Delivery zone name
                    </label>
                    <input
                      name="zoneName"
                      maxLength={100}
                      placeholder="e.g. Local delivery"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Country code *
                    </label>
                    <input
                      name="countryCode"
                      required
                      defaultValue="IN"
                      minLength={2}
                      maxLength={2}
                      pattern="[A-Za-z]{2}"
                      title="Enter a two-letter country code, such as IN or DE."
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      State code
                    </label>
                    <input
                      name="stateCode"
                      maxLength={20}
                      placeholder="e.g. MH"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Exact postal code
                    </label>
                    <input
                      name="postalCode"
                      maxLength={20}
                      placeholder="Optional"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Postal-code prefix
                    </label>
                    <input
                      name="postalCodePrefix"
                      maxLength={20}
                      placeholder="e.g. 411"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Pricing method *
                    </label>
<select
  name="pricingType"
  value={shippingPricingType}
  className={inputClass}
  onChange={(event) =>
    setShippingPricingType(
      event.target.value as ShippingPricingType,
    )
  }
>
  <option value="FLAT_RATE">Flat rate</option>
  <option value="WEIGHT_BASED">Weight-based</option>
</select>

</div>
                </div>
                <div className={shippingPricingType === "FLAT_RATE" ? "" : "hidden"}>
                  <label className="text-sm font-semibold text-slate-700">
                    Flat shipping charge ({defaultCurrency}) *
                  </label>
                  <input
                    name="flatRate"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue="0"
                    required
                    className={inputClass}
                  />
                </div>

                <div className={shippingPricingType === "WEIGHT_BASED" ? "" : "hidden"}>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label className="text-sm font-semibold text-slate-700">
                        Base charge ({defaultCurrency}) *
                      </label>
                      <input
                        name="baseCharge"
                        type="number"
                        min="0"
                        step="0.01"
                        defaultValue="0"
                        className={inputClass}
                        disabled={shippingPricingType !== "WEIGHT_BASED"}
                        required={shippingPricingType === "WEIGHT_BASED"}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-slate-700">
                        Included weight (kg) *
                      </label>
                      <input
                        name="includedWeightKg"
                        type="number"
                        min="0"
                        step="0.001"
                        defaultValue="1"
                        className={inputClass}
                        disabled={shippingPricingType !== "WEIGHT_BASED"}
                        required={shippingPricingType === "WEIGHT_BASED"}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-slate-700">
                        Additional charge per kg ({defaultCurrency}) *
                      </label>
                      <input
                        name="additionalPerKg"
                        type="number"
                        min="0"
                        step="0.01"
                        defaultValue="0"
                        className={inputClass}
                        disabled={shippingPricingType !== "WEIGHT_BASED"}
                        required={shippingPricingType === "WEIGHT_BASED"}
                      />
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    Weight-based fields will be enabled when that pricing method is selected.
                  </p>
                </div>

                <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3">
                  <input
                    type="checkbox"
                    name="isActive"
                    className="mt-1 h-4 w-4 accent-emerald-600"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-slate-800">
                      Create as active rule
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500">
                      Active here means the rule is configured as active; it does not enable checkout shipping.
                    </span>
                  </span>
                </label>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    disabled={shippingSaving}
                    onClick={() => {
                      setShowShippingForm(false);
                      setShippingError("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={shippingSaving || !canEdit}>
                    {shippingSaving ? "Saving rule..." : "Save shipping rule"}
                  </Button>
                </div>
              </form>
            )}

  {shippingLoading ? (
    <div className="flex items-center gap-2 py-6 text-sm text-slate-500">
      <Loader2 className="h-4 w-4 animate-spin" />
      Loading shipping rules...
    </div>
  ) : shippingRules.length === 0 ? (
    <div className="rounded-2xl border border-dashed border-slate-300 px-5 py-8 text-center">
      <p className="font-semibold text-slate-800">
        No shipping rules configured
      </p>
      <p className="mt-1 text-sm text-slate-500">
        Add a rule to define rates for your delivery areas.
      </p>
    </div>
  ) : (
    <div className="space-y-3">
      {shippingRules.map((rule) => (
        <article
          key={rule.id}
          className="rounded-2xl border border-slate-200 p-4"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h4 className="font-semibold text-slate-900">
                {rule.name}
              </h4>
              <p className="mt-1 text-sm text-slate-500">
                {rule.zoneName || "General delivery zone"}
                {" · "}
                {rule.countryCode}
                {rule.stateCode ? ` · ${rule.stateCode}` : ""}
              </p>
              <p className="mt-2 text-sm text-slate-700">
                {rule.pricingType === "FLAT_RATE"
                  ? `Flat rate: ${rule.currency} ${Number(rule.flatRate).toFixed(2)}`
                  : `Base charge: ${rule.currency} ${Number(rule.baseCharge).toFixed(2)}; included weight: ${rule.includedWeightKg ?? "—"} kg; additional per kg: ${rule.additionalPerKg ?? "—"}`}
              </p>
              {(rule.postalCode || rule.postalCodePrefix) && (
                <p className="mt-1 text-xs text-slate-500">
                  Postal restriction:{" "}
                  {rule.postalCode || `Prefix ${rule.postalCodePrefix}`}
                </p>
              )}
            </div>

            <span
              className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                rule.isActive
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {rule.isActive ? "Active rule" : "Inactive rule"}
            </span>
          </div>
        </article>
      ))}
    </div>
  )}
</section>
</fieldset>

<div className="flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs leading-5 text-slate-500">
            {canEdit
              ? "Changes apply only to this customer website."
              : "You have view-only access to these settings."}
          </div>

          {canEdit && (
            <Button
              type="button"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Store Settings
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}