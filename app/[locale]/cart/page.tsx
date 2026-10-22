
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/Button";

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

const CART_STORAGE_KEY = "rootym_store_cart_v1";
const CART_UPDATED_EVENT = "rootym-cart-updated";

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is CartItem =>
        item !== null &&
        typeof item === "object" &&
        typeof item.websiteSlug === "string" &&
        typeof item.productId === "string" &&
        typeof item.productSlug === "string" &&
        typeof item.productName === "string" &&
        typeof item.price === "number" &&
        Number.isFinite(item.price) &&
        item.price >= 0 &&
        typeof item.currency === "string" &&
        typeof item.unit === "string" &&
        Number.isInteger(item.quantity) &&
        item.quantity >= 1 &&
        item.quantity <= 999,
    );
  } catch {
    return [];
  }
}

function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export default function CartPage() {
  const params = useParams<{ locale: string }>();
  const locale = params.locale || "en";

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);


  const refreshCart = useCallback(() => {
    setCart(readCart());
    setLoaded(true);
  }, []);

  useEffect(() => {
    refreshCart();

    window.addEventListener(CART_UPDATED_EVENT, refreshCart);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, refreshCart);
    };
  }, [refreshCart]);

  function saveCart(nextCart: CartItem[]) {
    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(nextCart),
      );

      setCart(nextCart);

      window.dispatchEvent(new Event(CART_UPDATED_EVENT));
    } catch {
        console.error("Unable to save cart to browser storage.");
      }
  }

  function changeQuantity(index: number, change: number) {
    const nextCart = cart.map((item, itemIndex) =>
      itemIndex === index
        ? {
            ...item,
            quantity: Math.max(
              1,
              Math.min(999, item.quantity + change),
            ),
          }
        : item,
    );

    saveCart(nextCart);
  }

  function removeItem(index: number) {
    saveCart(cart.filter((_, itemIndex) => itemIndex !== index));
  }

  const itemCount = cart.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const subtotals = cart.reduce<Record<string, number>>(
    (totals, item) => {
      totals[item.currency] =
        (totals[item.currency] || 0) +
        item.price * item.quantity;

      return totals;
    },
    {},
  );

  if (!loaded) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-5xl text-center text-gray-600">
          Loading your cart...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href={`/${locale}/products`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-green-800 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Link>

        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-xl bg-green-100 p-3 text-green-800">
            <ShoppingCart className="h-6 w-6" />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Your Cart
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
            </p>
          </div>
        </div>

        {cart.length === 0 ? (
          <section className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <ShoppingCart className="mx-auto mb-4 h-12 w-12 text-gray-400" />

            <h2 className="text-xl font-semibold text-gray-900">
              Your cart is empty
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
              Browse our products and add the items you need.
            </p>

            <div className="mt-6">
              <Link href={`/${locale}/products`}>
                <Button>Browse Products</Button>
              </Link>
            </div>
          </section>
        ) : (
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
            <section className="space-y-4 lg:col-span-2">
              {cart.map((item, index) => (
                <article
                  key={`${item.websiteSlug}:${item.productId}`}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h2 className="text-lg font-semibold text-gray-900">
                        {item.productName}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        {formatMoney(item.price, item.currency)}
                        {" / "}
                        {item.unit}
                      </p>

                      <p className="mt-2 text-sm font-medium text-gray-800">
                        Line total:{" "}
                        {formatMoney(
                          item.price * item.quantity,
                          item.currency,
                        )}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="inline-flex items-center gap-1 self-start text-sm text-red-700 hover:text-red-900"
                      aria-label={`Remove ${item.productName} from cart`}
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
                    <div className="inline-flex h-10 items-center rounded-md border border-gray-300">
                      <button
                        type="button"
                        onClick={() => changeQuantity(index, -1)}
                        disabled={item.quantity <= 1}
                        aria-label={`Decrease ${item.productName} quantity`}
                        className="px-3 py-2 disabled:opacity-40"
                      >
                        <Minus className="h-4 w-4" />
                      </button>

                      <span
                        className="min-w-10 text-center text-sm font-semibold"
                        aria-live="polite"
                      >
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => changeQuantity(index, 1)}
                        disabled={item.quantity >= 999}
                        aria-label={`Increase ${item.productName} quantity`}
                        className="px-3 py-2 disabled:opacity-40"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <Link
                      href={`/${locale}/products/${encodeURIComponent(item.productSlug)}`}
                      className="text-sm font-medium text-green-800 hover:underline"
                    >
                      View Product
                    </Link>
                  </div>
                </article>
              ))}
            </section>

            <aside className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Order Summary
              </h2>

              <div className="mt-5 space-y-3">
                <div className="flex justify-between gap-3 text-sm text-gray-600">
                  <span>Total quantity</span>
                  <span className="font-medium text-gray-900">
                    {itemCount}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <p className="mb-3 text-sm text-gray-600">
                    Subtotal by currency
                  </p>

                  {Object.entries(subtotals).map(
                    ([currency, subtotal]) => (
                      <div
                        key={currency}
                        className="mb-2 flex justify-between gap-3 text-sm"
                      >
                        <span className="text-gray-600">{currency}</span>
                        <span className="font-semibold text-gray-900">
                          {formatMoney(subtotal, currency)}
                        </span>
                      </div>
                    ),
                  )}
                </div>

                <p className="text-xs leading-5 text-gray-500">
                  Shipping, applicable taxes and final prices will be
                  confirmed during checkout. Prices shown here are
                  stored in your browser and are not authoritative
                  checkout prices.
                </p>
                <div className="w-full">
  <Link href={`/${locale}/checkout`} className="block">
    <Button className="w-full">
      Proceed to Checkout
    </Button>
  </Link>
</div>

                <Link
                  href={`/${locale}/products`}
                  className="block text-center text-sm font-medium text-green-800 hover:underline"
                >
                  Continue Shopping
                </Link>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
