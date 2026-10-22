
"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Check, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

type AddToCartButtonProps = {
  websiteSlug: string;
  productId: string;
  productSlug: string;
  productName: string;
  price: number;
  currency: string;
  unit: string;
};

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

export default function AddToCartButton({
  websiteSlug,
  productId,
  productSlug,
  productName,
  price,
  currency,
  unit,
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function addToCart() {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      const cart: CartItem[] = saved ? JSON.parse(saved) : [];

      if (!Array.isArray(cart)) {
        throw new Error("Invalid cart data");
      }

      const existingIndex = cart.findIndex(
        (item) =>
          item.websiteSlug === websiteSlug &&
          item.productId === productId,
      );

      if (existingIndex >= 0) {
        cart[existingIndex] = {
          ...cart[existingIndex],
          quantity: cart[existingIndex].quantity + quantity,
          price,
          currency,
          unit,
          productName,
          productSlug,
        };
      } else {
        cart.push({
          websiteSlug,
          productId,
          productSlug,
          productName,
          price,
          currency,
          unit,
          quantity,
        });
      }

      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));

      window.dispatchEvent(new Event("rootym-cart-updated"));
      setAdded(true);
      window.setTimeout(() => setAdded(false), 2000);
    } catch {
      setAdded(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="inline-flex h-11 items-center rounded-md border border-gray-300">
        <button
          type="button"
          aria-label="Decrease quantity"
          disabled={quantity <= 1}
          onClick={() => setQuantity((value) => Math.max(1, value - 1))}
          className="px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Minus className="h-4 w-4" />
        </button>

        <span
          aria-live="polite"
          className="min-w-8 text-center font-semibold"
        >
          {quantity}
        </span>

        <button
          type="button"
          aria-label="Increase quantity"
          disabled={quantity >= 999}
          onClick={() => setQuantity((value) => Math.min(999, value + 1))}
          className="px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <Button onClick={addToCart}>
        {added ? (
          <>
            <Check className="mr-2 inline h-4 w-4" />
            Added to Cart
          </>
        ) : (
          <>
            <ShoppingCart className="mr-2 inline h-4 w-4" />
            Add to Cart
          </>
        )}
      </Button>

      <Link
        href="/en/cart"
        className="inline-flex h-11 items-center justify-center rounded-md border border-green-700 px-4 text-sm font-medium text-green-800 transition-colors hover:bg-green-50"
      >
        View Cart
      </Link>
    </div>
  );
}
