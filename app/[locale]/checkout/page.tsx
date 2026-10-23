
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  LockKeyhole,
  ShoppingBag,
} from "lucide-react";

type CartItem = {
  websiteSlug: string;
  productId: string;
  productSlug: string;
  productName: string;
  price: number;
  currency: string;
  unit: string;
  quantity: number;
};

type CheckoutForm = {
  fullName: string;
  email: string;
  mobile: string;
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingPostalCode: string;
  billingCountry: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingCountry: string;
};

const CART_STORAGE_KEY = "rootym_store_cart_v1";

const CHECKOUT_ATTEMPT_STORAGE_KEY = "rootym_checkout_attempt_v1";

type CheckoutOrderResult = {
  orderId: string;
  orderNumber: string;
  paymentStatus: "NOT_INITIATED" | "PENDING" | "CAPTURED";
  razorpayOrderId?: string;
  publicKeyId?: string;
  amount?: number;
  currency?: string;
  subtotal?: string;
shippingAmount?: string;
taxAmount?: string;
discountAmount?: string;
totalAmount?: string;
guestAccessToken?: string;
};

type RazorpayCheckoutOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void | Promise<void>;
  modal?: {
    ondismiss?: () => void;
  };
  theme?: {
    color?: string;
  };
};

type RazorpayCheckoutInstance = {
  open: () => void;
  on: (
    event: string,
    callback: (response: {
      error?: {
        description?: string;
        reason?: string;
      };
    }) => void,
  ) => void;
};

type RazorpayConstructor = new (
  options: RazorpayCheckoutOptions,
) => RazorpayCheckoutInstance;

const inputClassName =
  "mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100";

const labelClassName = "block text-sm font-medium text-gray-700";

function isValidEmail(email: string): boolean {
  const value = email.trim();

  if (!value || value.length > 254) {
    return false;
  }

  const emailPattern =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  if (!emailPattern.test(value)) {
    return false;
  }

  const localPart = value.split("@")[0];

  return (
    localPart.length <= 64 &&
    !localPart.startsWith(".") &&
    !localPart.endsWith(".") &&
    !localPart.includes("..")
  );
}

function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);

    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item): item is CartItem => {
      if (!item || typeof item !== "object") return false;

      const candidate = item as Partial<CartItem>;

      return (
        typeof candidate.websiteSlug === "string" &&
        typeof candidate.productId === "string" &&
        typeof candidate.productName === "string" &&
        typeof candidate.currency === "string" &&
        typeof candidate.unit === "string" &&
        typeof candidate.price === "number" &&
        Number.isFinite(candidate.price) &&
        candidate.price >= 0 &&
        typeof candidate.quantity === "number" &&
        Number.isInteger(candidate.quantity) &&
        candidate.quantity > 0
      );
    });
  } catch {
    return [];
  }
}

const initialForm: CheckoutForm = {
  fullName: "",
  email: "",
  mobile: "",
  billingAddress: "",
  billingCity: "",
  billingState: "",
  billingPostalCode: "",
  billingCountry: "India",
  shippingAddress: "",
  shippingCity: "",
  shippingState: "",
  shippingPostalCode: "",
  shippingCountry: "India",
};

export default function CheckoutPage() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || "en";

  const [cart, setCart] = useState<CartItem[]>([]);
  const [form, setForm] = useState<CheckoutForm>(initialForm);
  const [sameShippingAddress, setSameShippingAddress] = useState(true);
  const [notice, setNotice] = useState("");
  const [reviewing, setReviewing] = useState(false);

  const [submitting, setSubmitting] = useState(false);
const [orderResult, setOrderResult] =
  useState<CheckoutOrderResult | null>(null);

  const [razorpayReady, setRazorpayReady] = useState(false);

  
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  async function handlePayNow() {
    if (!orderResult || orderResult.paymentStatus !== "PENDING") {
      setNotice("Create an eligible order before starting payment.");
      return;
    }

    if (
      !razorpayReady ||
      !orderResult.publicKeyId ||
      !orderResult.razorpayOrderId ||
      typeof orderResult.amount !== "number" ||
      !orderResult.currency
    ) {
      setNotice("Razorpay is not ready. Please refresh and retry.");
      return;
    }

    if (paymentProcessing) return;

    const getRazorpay = () =>
      (window as unknown as {
        Razorpay?: RazorpayConstructor;
      }).Razorpay;

    const RazorpayCheckout = getRazorpay();

    if (!RazorpayCheckout) {
      setNotice("The Razorpay checkout window could not be loaded.");
      return;
    }

    setPaymentProcessing(true);
    setNotice("");

    try {
      const checkout = new RazorpayCheckout({
        key: orderResult.publicKeyId,
        amount: orderResult.amount,
        currency: orderResult.currency,
        name: "ROOTYM",
        description: `Order ${orderResult.orderNumber}`,
        order_id: orderResult.razorpayOrderId,
        prefill: {
          name: form.fullName.trim(),
          email: form.email.trim(),
          contact: form.mobile.trim(),
        },
        theme: { color: "#15803d" },

        handler: async (response) => {
          try {
            const verificationResponse = await fetch(
              "/api/storefront/checkout/verify-payment",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  orderId: orderResult.orderId,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              },
            );

            const verificationBody = await verificationResponse
              .json()
              .catch(() => null);

            if (!verificationResponse.ok || verificationBody?.success !== true) {
              setNotice(
                verificationBody?.message ??
                  "Payment was submitted, but confirmation is pending. Do not pay again; retry verification or contact the store.",
              );
              return;
            }

            if (!orderResult.guestAccessToken) {
              setNotice(
                "Payment was verified, but the secure order confirmation link is unavailable. Do not pay again. Please contact the store with your order number.",
              );
              return;
            }
            
            setOrderResult((current) =>
              current
                ? { ...current, paymentStatus: "CAPTURED" }
                : current,
            );
            
            localStorage.removeItem(CART_STORAGE_KEY);
            setCart([]);
            
            const confirmationUrl = new URL(
              `/${locale}/order-confirmation`,
              window.location.origin,
            );
            
            confirmationUrl.searchParams.set("orderId", orderResult.orderId);
            confirmationUrl.searchParams.set(
              "token",
              orderResult.guestAccessToken,
            );
            
            window.location.assign(confirmationUrl.toString());

          } catch {
            setNotice(
              "Payment was submitted, but confirmation could not be retrieved. Do not pay again; retry verification or contact the store.",
            );
          } finally {
            setPaymentProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setPaymentProcessing(false);
            setNotice(
              "Payment window closed. Your order is still unpaid unless payment is verified.",
            );
          },
        },
      });

      checkout.on("payment.failed", (event) => {
        setPaymentProcessing(false);
        setNotice(
          event.error?.description ??
            "Payment failed. You can retry using Pay Now.",
        );
      });

      checkout.open();
    } catch {
      setPaymentProcessing(false);
      setNotice("Unable to open Razorpay. Please try again.");
    }
  }

  useEffect(() => {
    setCart(readCart());
  }, []);


  useEffect(() => {
    const scriptId = "razorpay-checkout-script";
    const existingScript = document.getElementById(
      scriptId,
    ) as HTMLScriptElement | null;

    const getRazorpay = () =>
      (window as Window & {
        Razorpay?: RazorpayConstructor;
      }).Razorpay;

    if (getRazorpay()) {
      setRazorpayReady(true);
      return;
    }

    const script = existingScript ?? document.createElement("script");

    const handleLoad = () => {
      setRazorpayReady(Boolean(getRazorpay()));
    };

    const handleError = () => {
      setRazorpayReady(false);
    };

    script.addEventListener("load", handleLoad);
    script.addEventListener("error", handleError);

    if (!existingScript) {
      script.id = scriptId;
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }

    return () => {
      script.removeEventListener("load", handleLoad);
      script.removeEventListener("error", handleError);
    };
  }, []);


  const itemCount = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart],
  );

  const subtotals = useMemo(() => {
    const totals = new Map<string, number>();

    for (const item of cart) {
      totals.set(
        item.currency,
        (totals.get(item.currency) ?? 0) + item.price * item.quantity,
      );
    }

    return Array.from(totals.entries());
  }, [cart]);

  function updateField(field: keyof CheckoutForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setNotice("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");

    if (cart.length === 0) {
      setNotice("Your cart is empty. Please add products before checkout.");
      return;
    }

    if (!isValidEmail(form.email)) {
      setNotice(
        "Please enter a valid email address, for example name@example.com.",
      );
      return;
    }

    const mobileDigits = form.mobile.replace(/\D/g, "");

    if (mobileDigits.length < 10 || mobileDigits.length > 15) {
      setNotice("Please enter a valid mobile number with 10–15 digits.");
      return;
    }

    if (!sameShippingAddress) {
      if (
        !form.shippingAddress.trim() ||
        !form.shippingCity.trim() ||
        !form.shippingState.trim() ||
        !form.shippingPostalCode.trim() ||
        !form.shippingCountry.trim()
      ) {
        setNotice("Please complete all required shipping address fields.");
        return;
      }
    }

    // Show the review panel only after the existing checks pass.
    setNotice("");
    setReviewing(true);
  }

  async function handleCreateOrder() {
    if (submitting || orderResult) return;
  
    setNotice("");
  
    if (cart.length === 0) {
      setNotice("Your cart is empty. Please return to your cart.");
      return;
    }
  
    const websiteSlugs = [...new Set(cart.map((item) => item.websiteSlug))];
  
    if (websiteSlugs.length !== 1 || !websiteSlugs[0]) {
      setNotice(
        "Your cart contains products from different stores. Please keep products from one store per checkout.",
      );
      return;
    }
  
    if (
      !isValidEmail(form.email) ||
      form.fullName.trim().length === 0
    ) {
      setNotice("Please check your name and email address.");
      return;
    }
  
    const mobileDigits = form.mobile.replace(/\D/g, "");
  
    if (mobileDigits.length < 10 || mobileDigits.length > 15) {
      setNotice("Please enter a valid mobile number with 10–15 digits.");
      return;
    }
  
    const address = sameShippingAddress
      ? {
          address1: form.billingAddress,
          city: form.billingCity,
          state: form.billingState,
          postalCode: form.billingPostalCode,
          country: form.billingCountry,
        }
      : {
          address1: form.shippingAddress,
          city: form.shippingCity,
          state: form.shippingState,
          postalCode: form.shippingPostalCode,
          country: form.shippingCountry,
        };
  
    if (
      !address.address1.trim() ||
      !address.city.trim() ||
      !address.state.trim() ||
      !address.postalCode.trim() ||
      !address.country.trim()
    ) {
      setNotice("Please complete all required delivery address fields.");
      return;
    }
  
    const payload = {
      websiteSlug: websiteSlugs[0],
      items: cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      customer: {
        name: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.mobile.trim(),
        address1: address.address1.trim(),
        city: address.city.trim(),
        state: address.state.trim(),
        postalCode: address.postalCode.trim(),
        country: address.country.trim(),
      },
    };
  
    // Reuse the same ID only when retrying the same checkout payload.
    // A changed cart or customer/address details starts a new attempt.
    const fingerprint = JSON.stringify(payload);
    let checkoutRequestId: string;
  
    try {
      const saved = localStorage.getItem(CHECKOUT_ATTEMPT_STORAGE_KEY);
      let previous: { fingerprint?: string; id?: string } | null = null;
  
      if (saved) {
        try {
          previous = JSON.parse(saved);
        } catch {
          previous = null;
        }
      }
  
      if (
        previous?.fingerprint === fingerprint &&
        typeof previous.id === "string" &&
        /^[A-Za-z0-9_-]{8,100}$/.test(previous.id)
      ) {
        checkoutRequestId = previous.id;
      } else {
        checkoutRequestId = crypto.randomUUID();
  
        localStorage.setItem(
          CHECKOUT_ATTEMPT_STORAGE_KEY,
          JSON.stringify({
            fingerprint,
            id: checkoutRequestId,
          }),
        );
      }
    } catch {
      setNotice(
        "Checkout storage is unavailable. Please enable browser storage and try again.",
      );
      return;
    }
  
    setSubmitting(true);
  
    try {
      const response = await fetch("/api/storefront/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...payload,
          checkoutRequestId,
        }),
      });
  
      const responseBody = await response.json().catch(() => null);
  
      if (!response.ok) {
        const code =
          responseBody?.code ??
          responseBody?.error?.code ??
          "CHECKOUT_REQUEST_FAILED";
  
        const message =
          responseBody?.message ??
          responseBody?.error?.message ??
          "We could not confirm your order. Please retry this checkout.";
  
        if (
          code === "RAZORPAY_ORDER_CREATION_UNKNOWN" ||
          code === "RAZORPAY_ORDER_SAVE_UNCONFIRMED"
        ) {
          setNotice(
            `${message} Your checkout attempt has been preserved. Do not start a new checkout or make another payment.`,
          );
        } else {
          setNotice(message);
        }
  
        return;
      }
  
      const data =
        responseBody?.data?.data ??
        responseBody?.data ??
        responseBody;
  

        if (!data?.orderId || !data?.orderNumber) {
          setNotice(
            "The server response could not be confirmed. Retry this same checkout attempt; do not start a new one.",
          );
          return;
        }
  

        // Local order created; payment has not been initiated.
        if (data.paymentStatus === "NOT_INITIATED") {
          setOrderResult({
            orderId: data.orderId,
            orderNumber: data.orderNumber,
            paymentStatus: "NOT_INITIATED",
            currency: data.currency,
            subtotal: data.subtotal,
            shippingAmount: data.shippingAmount,
            taxAmount: data.taxAmount,
            discountAmount: data.discountAmount,
            totalAmount: data.totalAmount,
            guestAccessToken: data.guestAccessToken,
          });
          setNotice("");
          return;
        }

  
        // Preserve the existing Razorpay TEST response validation.
        if (
          !data.razorpayOrderId ||
          !data.publicKeyId ||
          typeof data.amount !== "number" ||
          !data.currency
        ) {
          setNotice(
            "The server response could not be confirmed. Retry this same checkout attempt; do not start a new one.",
          );
          return;
        }
  

        setOrderResult({
          orderId: data.orderId,
          orderNumber: data.orderNumber,
          paymentStatus: "PENDING",
          razorpayOrderId: data.razorpayOrderId,
          publicKeyId: data.publicKeyId,
          amount: data.amount,
          currency: data.currency,
          subtotal: data.subtotal,
          shippingAmount: data.shippingAmount,
          taxAmount: data.taxAmount,
          discountAmount: data.discountAmount,
          totalAmount: data.totalAmount,
          guestAccessToken: data.guestAccessToken,
        });

  
        setNotice("");
  
    } catch {
      setNotice(
        "We could not confirm the server response. Retry this same checkout attempt; do not start a new one.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const addressFields = (
    prefix: "billing" | "shipping",
    heading: string,
  ) => {
    const fields: {
      key: keyof CheckoutForm;
      label: string;
      autoComplete: string;
    }[] = [
      {
        key: `${prefix}Address` as keyof CheckoutForm,
        label: "Street address",
        autoComplete:
          prefix === "billing"
            ? "billing street-address"
            : "shipping street-address",
      },
      {
        key: `${prefix}City` as keyof CheckoutForm,
        label: "City",
        autoComplete:
          prefix === "billing"
            ? "billing address-level2"
            : "shipping address-level2",
      },
      {
        key: `${prefix}State` as keyof CheckoutForm,
        label: "State / Province",
        autoComplete:
          prefix === "billing"
            ? "billing address-level1"
            : "shipping address-level1",
      },
      {
        key: `${prefix}PostalCode` as keyof CheckoutForm,
        label: "Postal code",
        autoComplete:
          prefix === "billing"
            ? "billing postal-code"
            : "shipping postal-code",
      },
      {
        key: `${prefix}Country` as keyof CheckoutForm,
        label: "Country",
        autoComplete:
          prefix === "billing"
            ? "billing country-name"
            : "shipping country-name",
      },
    ];

    return (
      <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-gray-900">{heading}</h2>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <div
              key={field.key}
              className={
                field.key.endsWith("Address") ? "sm:col-span-2" : ""
              }
            >
              <label className={labelClassName} htmlFor={field.key}>
                {field.label} <span className="text-red-600">*</span>
              </label>
              <input
                id={field.key}
                name={field.key}
                autoComplete={field.autoComplete}
                required
                value={form[field.key]}
                onChange={(event) =>
                  updateField(field.key, event.target.value)
                }
                className={inputClassName}
              />
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href={`/${locale}/cart`}
          className="inline-flex items-center gap-2 text-sm font-medium text-green-800 hover:text-green-950"
        >
          <ArrowLeft size={16} />
          Back to Cart
        </Link>

        <div className="mt-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-800">
            <ShoppingBag size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Checkout
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Review your cart and enter your delivery details.
            </p>
          </div>
        </div>

        {/* STEP 2: Show only the order review after Review Details is clicked. */}
        {reviewing && cart.length > 0 && (
          <section
            className="mt-8 rounded-xl border border-green-200 bg-white p-5 shadow-sm sm:p-6"
            aria-labelledby="order-review-heading"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-700" />
              <h2
                id="order-review-heading"
                className="text-xl font-bold text-gray-900"
              >
                Review Your Order
              </h2>
            </div>

            <p className="mt-2 text-sm text-gray-600">
              Please verify your customer and delivery details before continuing.
            </p>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="font-semibold text-gray-900">Customer Details</h3>
                <p className="mt-2 text-sm text-gray-700">{form.fullName}</p>
                <p className="text-sm text-gray-700">{form.email}</p>
                <p className="text-sm text-gray-700">{form.mobile}</p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="font-semibold text-gray-900">Billing Address</h3>
                <p className="mt-2 whitespace-pre-line text-sm text-gray-700">
                  {[
                    form.billingAddress,
                    form.billingCity,
                    form.billingState,
                    form.billingPostalCode,
                    form.billingCountry,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4 sm:col-span-2">
                <h3 className="font-semibold text-gray-900">Shipping Address</h3>
                <p className="mt-2 text-sm text-gray-700">
                  {sameShippingAddress
                    ? "Same as billing address"
                    : [
                        form.shippingAddress,
                        form.shippingCity,
                        form.shippingState,
                        form.shippingPostalCode,
                        form.shippingCountry,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                </p>
                {sameShippingAddress && (
                  <p className="mt-1 text-sm text-gray-600">
                    {[
                      form.billingAddress,
                      form.billingCity,
                      form.billingState,
                      form.billingPostalCode,
                      form.billingCountry,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-5 rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900">Items to Review</h3>

              <div className="mt-3 space-y-3">
                {cart.map((item, index) => (
                  <div
                    key={`${item.websiteSlug}-${item.productId}-${index}`}
                    className="flex items-start justify-between gap-3 text-sm"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.productName}
                      </p>
                      <p className="text-gray-600">
                        Quantity: {item.quantity} ×{" "}
                        {formatMoney(item.price, item.currency)} / {item.unit}
                      </p>
                    </div>
                    <p className="shrink-0 font-semibold text-gray-900">
                      {formatMoney(item.price * item.quantity, item.currency)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 border-t border-gray-200 pt-4">
                {subtotals.map(([currency, total]) => (
                  <div
                    key={currency}
                    className="flex justify-between gap-3 text-sm"
                  >
                    <span className="text-gray-600">Subtotal ({currency})</span>
                    <span className="font-semibold text-gray-900">
                      {formatMoney(total, currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm leading-5 text-amber-900">
              These prices are estimates from your browser cart. Product prices,
              stock, shipping, and taxes must be verified by the server before
              an order can be placed.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  setReviewing(false);
                  setNotice("");
                }}
                className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50"
              >
                Back to Edit Details
              </button>

              <button
  type="button"
  disabled={submitting || Boolean(orderResult)}
  onClick={handleCreateOrder}
  className="rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
>
  {submitting
    ? "Creating Order..."
    : orderResult
      ? "Order Created"
      : "Continue to Create Order"}
</button>
            </div>


            {orderResult && (
  <div
    role="status"
    aria-live="polite"
    className="mt-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-950"
  >
    <div className="font-semibold text-lg">
      Order created successfully
    </div>


    <p className="mt-2">
  Order number: <strong>{orderResult.orderNumber}</strong>
</p>

{orderResult.totalAmount !== undefined && (
  <div className="mt-4 space-y-2 border-t border-green-200 pt-3">
    <div className="flex justify-between gap-4">
      <span>Subtotal</span>
      <span>
        {formatMoney(
          Number(orderResult.subtotal ?? 0),
          orderResult.currency ?? "INR"
        )}
      </span>
    </div>

    <div className="flex justify-between gap-4">
      <span>Delhivery Shipping</span>
      <span>
        {formatMoney(
          Number(orderResult.shippingAmount ?? 0),
          orderResult.currency ?? "INR"
        )}
      </span>
    </div>

    <div className="flex justify-between gap-4">
      <span>Tax</span>
      <span>
        {formatMoney(
          Number(orderResult.taxAmount ?? 0),
          orderResult.currency ?? "INR"
        )}
      </span>
    </div>

    {Number(orderResult.discountAmount ?? 0) > 0 && (
      <div className="flex justify-between gap-4">
        <span>Discount</span>
        <span>
          -
          {formatMoney(
            Number(orderResult.discountAmount),
            orderResult.currency ?? "INR"
          )}
        </span>
      </div>
    )}

    <div className="flex justify-between gap-4 border-t border-green-200 pt-2 font-bold">
      <span>Order Total</span>
      <span>
        {formatMoney(
          Number(orderResult.totalAmount),
          orderResult.currency ?? "INR"
        )}
      </span>
    </div>
  </div>
)}



{orderResult.paymentStatus === "CAPTURED" ? (
  <div className="mt-4 rounded-lg border border-green-300 bg-white p-4">
    <p className="flex items-center gap-2 font-semibold text-green-800">
      <CheckCircle2 size={20} />
      Payment confirmed successfully
    </p>
    <p className="mt-2 text-sm text-green-900">
      Your payment has been verified by the server. Your order number is{" "}
      <strong>{orderResult.orderNumber}</strong>.
    </p>
  </div>
) : orderResult.paymentStatus === "NOT_INITIATED" ? (
  <p className="mt-3 text-sm text-amber-900">
    Your order has been recorded, but online payment has not been initiated.
    No payment has been made. Please contact the store for the next steps.
  </p>
) : (
  <>
    {typeof orderResult.amount === "number" && orderResult.currency && (
      <p className="mt-1">
        Order amount:{" "}
        <strong>
          {formatMoney(
            orderResult.amount / 100,
            orderResult.currency,
          )}
        </strong>
      </p>
    )}

    {orderResult.razorpayOrderId && (
      <p className="mt-1 break-all text-xs">
        Razorpay TEST order ID: {orderResult.razorpayOrderId}
      </p>
    )}

    <p className="mt-3 text-sm text-gray-700">
      Payment is not confirmed until server verification succeeds.
    </p>

    <button
      type="button"
      onClick={handlePayNow}
      disabled={paymentProcessing || !razorpayReady}
      className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
    >
      {paymentProcessing
        ? "Processing Payment..."
        : !razorpayReady
          ? "Loading Secure Payment..."
          : "Pay Now"}
    </button>
  </>
)}

  </div>
)}
     

            {notice && (
              <p
                role="status"
                aria-live="polite"
                className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm leading-5 text-green-900"
              >
                {notice}
              </p>
            )}
          </section>
        )}

        {/* STEP 1: Hide the cart-empty state and form while reviewing. */}
        {!reviewing &&
          (cart.length === 0 ? (
            <section className="mt-8 rounded-xl border border-gray-200 bg-white px-6 py-14 text-center shadow-sm">
              <ShoppingBag
                size={42}
                className="mx-auto text-gray-400"
              />
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                Your cart is empty
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Add products to your cart before proceeding to checkout.
              </p>
              <Link
                href={`/${locale}/products`}
                className="mt-6 inline-flex rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
              >
                Browse Products
              </Link>
            </section>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-8 grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_350px]"
            >
              <div className="space-y-6">
                <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex items-center gap-2">
                    <ClipboardList
                      size={20}
                      className="text-green-800"
                    />
                    <h2 className="text-lg font-semibold text-gray-900">
                      Customer Details
                    </h2>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className={labelClassName} htmlFor="fullName">
                        Full name <span className="text-red-600">*</span>
                      </label>
                      <input
                        id="fullName"
                        name="name"
                        autoComplete="name"
                        required
                        value={form.fullName}
                        onChange={(event) =>
                          updateField("fullName", event.target.value)
                        }
                        className={inputClassName}
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className={labelClassName} htmlFor="email">
                        Email address <span className="text-red-600">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={form.email}
                        onChange={(event) =>
                          updateField("email", event.target.value)
                        }
                        className={inputClassName}
                        placeholder="you@example.com"
                      />
                    </div>

                    <div>
                      <label className={labelClassName} htmlFor="mobile">
                        Mobile number <span className="text-red-600">*</span>
                      </label>
                      <input
                        id="mobile"
                        name="mobile"
                        type="tel"
                        autoComplete="tel"
                        inputMode="tel"
                        required
                        value={form.mobile}
                        onChange={(event) =>
                          updateField("mobile", event.target.value)
                        }
                        className={inputClassName}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                </section>

                {addressFields("billing", "Billing Address")}

                <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Shipping Address
                  </h2>

                  <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={sameShippingAddress}
                      onChange={(event) => {
                        setSameShippingAddress(event.target.checked);
                        setNotice("");
                      }}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-green-700"
                    />
                    <span>Use my billing address as the shipping address</span>
                  </label>

                  {!sameShippingAddress && (
                    <div className="mt-5">
                      {addressFields("shipping", "Delivery Address")}
                    </div>
                  )}
                </section>

                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
                  <div className="flex items-start gap-3">
                    <LockKeyhole size={20} className="mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold">Secure checkout comes next</p>
                      <p className="mt-1 leading-6">
                        This page is currently a UI prototype. Prices and stock
                        must be verified by the server before an order can be
                        placed. No payment information is collected here.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <aside className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:sticky lg:top-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Order Summary
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
                </p>

                <div className="mt-5 space-y-4">
                  {cart.map((item, index) => (
                    <div
                      key={`${item.websiteSlug}-${item.productId}-${index}`}
                      className="flex items-start justify-between gap-3 border-b border-gray-100 pb-4"
                    >
                      <div className="min-w-0">
                        <p className="break-words text-sm font-medium text-gray-900">
                          {item.productName}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Qty: {item.quantity} ×{" "}
                          {formatMoney(item.price, item.currency)} / {item.unit}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-semibold text-gray-900">
                        {formatMoney(
                          item.price * item.quantity,
                          item.currency,
                        )}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 space-y-3">
                  {subtotals.map(([currency, total]) => (
                    <div
                      key={currency}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <span className="text-gray-600">Subtotal ({currency})</span>
                      <span className="font-semibold text-gray-900">
                        {formatMoney(total, currency)}
                      </span>
                    </div>
                  ))}

                  <p className="text-xs leading-5 text-gray-500">
                    Shipping, taxes, stock, and final prices are not yet
                    confirmed. Browser-stored prices are estimates only.
                  </p>
                </div>

                <button
                  type="submit"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
                >
                  <CheckCircle2 size={18} />
                  Review Details
                </button>

                {notice && (
                  <div
                    role="status"
                    aria-live="polite"
                    className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm leading-6 text-green-900"
                  >
                    {notice}
                  </div>
                )}

                <Link
                  href={`/${locale}/cart`}
                  className="mt-4 block text-center text-sm font-medium text-green-800 hover:text-green-950"
                >
                  Return to Cart
                </Link>
              </aside>
            </form>
          ))}
      </div>
    </main>
  );
}
