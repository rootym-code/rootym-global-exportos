"use client";

/**
 * ============================================================
 * ROOTYM Admin
 * File: components/admin/quotes/editor/QuoteEditorPage.tsx
 * Sprint 8.1
 * ============================================================
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Save,
} from "lucide-react";

import QuoteEditorForm from "./QuoteEditorForm";

export interface QuoteEditorItem {
  id: string;
  productId: string;
  productName: string;
  hsnCode?: string | null;

  quantity: number;
  unit: string;

  unitPrice: number;
  total: number;
}

export interface QuoteEditorModel {
  id: string;

  quoteNumber: string;

  inquiryId: string;

  /*
   * Quotation-specific customer/company name.
   *
   * This is copied from the inquiry when the quote is
   * created, but can be corrected independently on the
   * quotation.
   */
  companyName: string;

  currency: string;

  validUntil: string;

  freight: number;
  insurance: number;
  tax: number;
  discount: number;

  notes: string;

  items: QuoteEditorItem[];
}

interface Props {
  quoteId: string;
}

interface ApiQuoteItem {
  id: string;
  productId: string;
  description?: string | null;
  quantity: unknown;
  unit?: string | null;
  unitPrice: unknown;
  lineTotal?: unknown;
  total?: unknown;

  product?: {
    name?: string | null;
    hsnCode?: string | null;
  } | null;
}

interface ApiQuote {
  id: string;

  quoteNumber?: string | null;

  inquiryId?: string | null;

  companyName?: string | null;

  currency?: string | null;

  validUntil?: unknown;

  freight?: unknown;
  insurance?: unknown;
  tax?: unknown;
  discount?: unknown;

  notes?: string | null;

  items?: ApiQuoteItem[];
}

function toDateInputValue(
  value: unknown
): string {
  if (!value) {
    return "";
  }

  const date = new Date(
    String(value)
  );

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date
    .toISOString()
    .slice(0, 10);
}

function toNumber(
  value: unknown
): number {
  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : 0;
}

function mapApiQuoteToEditorModel(
  apiQuote: ApiQuote
): QuoteEditorModel {
  return {
    id: apiQuote.id,

    quoteNumber:
      apiQuote.quoteNumber ?? "",

    inquiryId:
      apiQuote.inquiryId ?? "",

    companyName:
      apiQuote.companyName ?? "",

    currency:
      apiQuote.currency ?? "INR",

    validUntil:
      toDateInputValue(
        apiQuote.validUntil
      ),

    freight:
      toNumber(apiQuote.freight),

    insurance:
      toNumber(apiQuote.insurance),

    tax:
      toNumber(apiQuote.tax),

    discount:
      toNumber(apiQuote.discount),

    notes:
      apiQuote.notes ?? "",

    items:
      Array.isArray(apiQuote.items)
        ? apiQuote.items.map(
            (item) => ({
              id: item.id,

              productId:
                item.productId,

              productName:
                item.product?.name ??
                item.description ??
                "Unnamed Product",

              hsnCode:
                item.product?.hsnCode ??
                null,

              quantity:
                toNumber(
                  item.quantity
                ),

              unit:
                item.unit ?? "",

              unitPrice:
                toNumber(
                  item.unitPrice
                ),

              total:
                toNumber(
                  item.lineTotal ??
                    item.total ??
                    toNumber(
                      item.quantity
                    ) *
                      toNumber(
                        item.unitPrice
                      )
                ),
            })
          )
        : [],
  };
}

export default function QuoteEditorPage({
  quoteId,
}: Props) {
  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [quote, setQuote] =
    useState<QuoteEditorModel | null>(
      null
    );

  async function loadQuote() {
    setLoading(true);

    try {
      const response =
        await fetch(
          `/api/admin/quotes/${quoteId}`,
          {
            credentials: "include",
            cache: "no-store",
          }
        );

      if (!response.ok) {
        throw new Error(
          "Unable to load quote."
        );
      }

      const data =
        await response.json();

      /*
       * Single Quote API returns:
       *
       * {
       *   success: true,
       *   data: {
       *     quote: {...},
       *     revisions: [...]
       *   }
       * }
       */

      if (
        !data?.success ||
        !data?.data?.quote
      ) {
        throw new Error(
          data?.message ??
            "Invalid quote response."
        );
      }

      setQuote(
        mapApiQuoteToEditorModel(
          data.data.quote
        )
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function saveQuote() {
    if (!quote) {
      return;
    }

    setSaving(true);

    try {
      const response =
        await fetch(
          `/api/admin/quotes/${quoteId}`,
          {
            method: "PUT",

            credentials: "include",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              /*
               * ==================================================
               * QUOTATION CUSTOMER DATA
               * ==================================================
               *
               * companyName is intentionally taken from
               * the quotation editor.
               *
               * It does NOT modify the original Inquiry.
               */
              companyName:
                quote.companyName,

              /*
               * These fields are not currently editable in
               * QuoteEditorModel, so keep them undefined as
               * before rather than inventing values.
               */
              contactPerson:
                undefined,

              email:
                undefined,

              phone:
                undefined,

              country:
                undefined,

              currency:
                quote.currency,

              items:
                quote.items.map(
                  (item) => ({
                    productId:
                      item.productId,

                    description:
                      item.productName,

                    quantity:
                      item.quantity,

                    unit:
                      item.unit,

                    unitPrice:
                      item.unitPrice,
                  })
                ),

              discount:
                quote.discount,

              freight:
                quote.freight,

              insurance:
                quote.insurance,

              tax:
                quote.tax,

              notes:
                quote.notes,

              validityDays:
                undefined,
            }),
          }
        );

      if (!response.ok) {
        const errorData =
          await response
            .json()
            .catch(
              () => null
            );

        throw new Error(
          errorData?.message ??
            "Unable to save quote."
        );
      }

      await loadQuote();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    loadQuote();
  }, [quoteId]);

  if (loading || !quote) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin" />

        <span className="ml-2">
          Loading Quote...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div className="flex flex-wrap items-center justify-between gap-4">

        <div>

          <Link
            href={`/admin/quotes/${quote.id}`}
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />

            Back to Quote
          </Link>

          <h1 className="text-3xl font-bold">
            Edit Quote
          </h1>

          <p className="mt-1 text-muted-foreground">
            {quote.quoteNumber}
          </p>

        </div>

        <button
          type="button"
          onClick={saveQuote}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-primary-foreground disabled:opacity-60"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}

          {saving
            ? "Saving..."
            : "Save Quote"}
        </button>

      </div>

      <QuoteEditorForm
        value={quote}
        onChange={setQuote}
      />

    </div>
  );
}