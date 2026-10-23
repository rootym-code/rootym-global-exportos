
"use client";

import { useEffect, useState } from "react";

type OrderItem = {
  productName: string;
  productSku: string | null;
  unit: string;
  quantity: number;
  unitPrice: string;
  lineTotal: string;
};

type OrderDetails = {
  orderId: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  currency: string;
  subtotal: string;
  shippingAmount: string;
  taxAmount: string;
  discountAmount: string;
  totalAmount: string;
  createdAt: string;
  items: OrderItem[];
};

type ApiResult = {
  success?: boolean;
  message?: string;
  data?: OrderDetails;
};

function formatMoney(amount: string, currency: string) {
  const value = Number(amount);

  if (!Number.isFinite(value)) {
    return `${currency} ${amount}`;
  }

  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

function formatStatus(status: string) {
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function OrderConfirmationPage() {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadOrder() {
      const searchParams = new URLSearchParams(window.location.search);
      const orderId = searchParams.get("orderId");
      const token = searchParams.get("token");

      if (!orderId || !token) {
        setError(
          "The order link is incomplete. Please open the confirmation link received after checkout.",
        );
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/storefront/orders/${encodeURIComponent(orderId)}?token=${encodeURIComponent(token)}`,
          {
            method: "GET",
            cache: "no-store",
            signal: controller.signal,
            headers: {
              Accept: "application/json",
            },
          },
        );

        const result = (await response.json()) as ApiResult;

        if (!response.ok || result.success !== true || !result.data) {
          throw new Error(
            result.message ||
              "We could not retrieve your order. Please try again.",
          );
        }

        setOrder(result.data);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while retrieving your order.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadOrder();

    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-4 py-12">
        <div className="text-center">
          <div
            className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-green-700"
            aria-label="Loading order"
          />
          <h1 className="text-xl font-semibold text-gray-900">
            Retrieving your order
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Please wait while we load your order details.
          </p>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-2xl text-amber-800">
            !
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Unable to load your order
          </h1>
          <p className="mt-3 text-gray-600">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-lg bg-green-700 px-5 py-3 font-medium text-white hover:bg-green-800"
          >
            Try again
          </button>
        </section>
      </main>
    );
  }

  const paymentCaptured =
    order.paymentStatus.toUpperCase() === "CAPTURED";

  const paymentNotInitiated =
    order.paymentStatus.toUpperCase() === "NOT_INITIATED";

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-8 text-center sm:px-8">
          <div
            className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-3xl ${
              paymentCaptured
                ? "bg-green-100 text-green-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {paymentCaptured ? "✓" : "!"}
          </div>

          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {paymentCaptured
              ? "Thank you for your order!"
              : paymentNotInitiated
                ? "Your order has been created"
                : "Your order is being processed"}
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-gray-600">
            {paymentCaptured
              ? "Your payment has been confirmed. Your order details are below."
              : paymentNotInitiated
                ? "Your order is recorded, but online payment was not initiated."
                : "We have retrieved your order. Payment has not yet been confirmed."}
          </p>

          <div className="mt-6 inline-block rounded-xl bg-gray-50 px-5 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Order number
            </p>
            <p className="mt-1 text-lg font-bold text-gray-900">
              {order.orderNumber}
            </p>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            Payment status:{" "}
            <span
              className={`font-semibold ${
                paymentCaptured ? "text-green-700" : "text-amber-700"
              }`}
            >
              {formatStatus(order.paymentStatus)}
            </span>
          </p>
        </div>

        <div className="p-5 sm:p-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Order items
          </h2>

          {order.items.length === 0 ? (
            <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
              No item details are available for this order.
            </p>
          ) : (
            <div className="divide-y divide-gray-100">
              {order.items.map((item, index) => (
                <div
                  key={`${item.productSku ?? item.productName}-${index}`}
                  className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900">
                      {item.productName}
                    </p>
                    {item.productSku && (
                      <p className="mt-1 text-xs text-gray-500">
                        SKU: {item.productSku}
                      </p>
                    )}
                    <p className="mt-1 text-sm text-gray-600">
                      Quantity: {item.quantity} {item.unit}
                    </p>
                    <p className="text-sm text-gray-600">
                      Unit price: {formatMoney(item.unitPrice, order.currency)}
                    </p>
                  </div>

                  <p className="shrink-0 font-semibold text-gray-900">
                    {formatMoney(item.lineTotal, order.currency)}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 space-y-3 border-t border-gray-200 pt-5">
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-gray-900">
                {formatMoney(order.subtotal, order.currency)}
              </span>
            </div>

            <div className="flex justify-between gap-4 text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium text-gray-900">
                {formatMoney(order.shippingAmount, order.currency)}
              </span>
            </div>

            <div className="flex justify-between gap-4 text-sm">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium text-gray-900">
                {formatMoney(order.taxAmount, order.currency)}
              </span>
            </div>

            <div className="flex justify-between gap-4 text-sm">
              <span className="text-gray-600">Discount</span>
              <span className="font-medium text-gray-900">
                −{formatMoney(order.discountAmount, order.currency)}
              </span>
            </div>

            <div className="flex justify-between gap-4 border-t border-gray-200 pt-4">
              <span className="text-base font-bold text-gray-900">
                Total
              </span>
              <span className="text-xl font-bold text-green-800">
                {formatMoney(order.totalAmount, order.currency)}
              </span>
            </div>
          </div>

          <div className="mt-8 rounded-xl bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-800">
              Order status: {formatStatus(order.status)}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-50"
            >
              Print order details
            </button>

            <a
              href={`/${window.location.pathname.split("/")[1] || "en"}`}
              className="rounded-lg bg-green-700 px-5 py-3 text-center font-medium text-white hover:bg-green-800"
            >
              Continue shopping
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
