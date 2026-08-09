"use client";

/**
 * ============================================================
 * ROOTYM Admin
 * File: components/admin/proforma-invoices/details/ProformaInvoiceDetailsPage.tsx
 * Sprint 8.1
 * ============================================================
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Download,
  FileText,
  Mail,
  Phone,
  RefreshCw,
  User,
} from "lucide-react";

interface Props {
  proformaInvoiceId: string;
}

/* ============================================================
 * API TYPES
 * ============================================================ */

interface ApiProduct {
  id?: string;
  name?: string | null;
  hsnCode?: string | null;
}

interface ApiInquiry {
  id?: string;
  companyName?: string | null;
  contactPerson?: string | null;
  email?: string | null;
  phone?: string | null;
  country?: string | null;
}

interface ApiQuoteItem {
  id?: string;
  productId?: string;
  description?: string | null;
  quantity?: unknown;
  unit?: string | null;
  unitPrice?: unknown;
  lineTotal?: unknown;
  product?: ApiProduct | null;
}

interface ApiQuote {
  id?: string;
  quoteNumber?: string | null;
  status?: string | null;
  inquiryId?: string | null;
  companyName?: string | null;
  contactPerson?: string | null;
  email?: string | null;
  phone?: string | null;
  country?: string | null;
  currency?: string | null;

  inquiry?: ApiInquiry | null;

  items?: ApiQuoteItem[];
}

interface ApiProformaInvoiceItem {
  id?: string;
  productId?: string | null;
  description?: string | null;
  quantity?: unknown;
  unit?: string | null;
  unitPrice?: unknown;
  lineTotal?: unknown;
  product?: ApiProduct | null;
}

interface ApiProformaInvoice {
  id?: string;
  piNumber?: string | null;
  quoteId?: string | null;

  issueDate?: unknown;
  paymentDueDate?: unknown;

  companyName?: string | null;
  contactPerson?: string | null;
  email?: string | null;
  phone?: string | null;
  country?: string | null;

  currency?: string | null;

  subtotal?: unknown;
  discount?: unknown;
  freight?: unknown;
  insurance?: unknown;
  tax?: unknown;
  grandTotal?: unknown;

  notes?: string | null;
  status?: string | null;

  createdAt?: unknown;
  updatedAt?: unknown;

  quote?: ApiQuote | null;

  items?: ApiProformaInvoiceItem[];
}

interface ApiResponse {
  success?: boolean;
  message?: string;
  data?: ApiProformaInvoice;
}

/* ============================================================
 * UI TYPES
 * ============================================================ */

interface PiItem {
  id: string;
  productName: string;
  description: string;
  hsnCode: string | null;
  quantity: number;
  unit: string;
  unitPrice: number;
  lineTotal: number;
}

interface PiDetails {
  id: string;
  piNumber: string;
  quoteId: string;
  quoteNumber: string;

  status: string;
  currency: string;

  issueDate: string | null;
  paymentDueDate: string | null;

  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  country: string;

  subtotal: number;
  discount: number;
  freight: number;
  insurance: number;
  tax: number;
  grandTotal: number;

  notes: string | null;

  createdAt: string | null;
  updatedAt: string | null;

  items: PiItem[];
}

/* ============================================================
 * HELPERS
 * ============================================================ */

function toNumber(value: unknown): number {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : 0;
}

function toDateString(
  value: unknown
): string | null {
  if (!value) {
    return null;
  }

  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

function formatDate(
  value: string | null
): string {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatAmount(
  value: number,
  currency: string
): string {
  try {
    return new Intl.NumberFormat(
      "en-US",
      {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    ).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

function mapApiToDetails(
  api: ApiProformaInvoice
): PiDetails {
  const quote = api.quote;

  return {
    id: api.id ?? "",
    piNumber: api.piNumber ?? "",
    quoteId: api.quoteId ?? quote?.id ?? "",
    quoteNumber:
      quote?.quoteNumber ?? "-",

    status: api.status ?? "DRAFT",
    currency:
      api.currency ??
      quote?.currency ??
      "USD",

    issueDate:
      toDateString(api.issueDate),

    paymentDueDate:
      toDateString(
        api.paymentDueDate
      ),

    companyName:
      api.companyName ??
      quote?.companyName ??
      quote?.inquiry?.companyName ??
      "-",

    contactPerson:
      api.contactPerson ??
      quote?.contactPerson ??
      quote?.inquiry?.contactPerson ??
      "-",

    email:
      api.email ??
      quote?.email ??
      quote?.inquiry?.email ??
      "-",

    phone:
      api.phone ??
      quote?.phone ??
      quote?.inquiry?.phone ??
      "-",

    country:
      api.country ??
      quote?.country ??
      quote?.inquiry?.country ??
      "-",

    subtotal:
      toNumber(api.subtotal),

    discount:
      toNumber(api.discount),

    freight:
      toNumber(api.freight),

    insurance:
      toNumber(api.insurance),

    tax:
      toNumber(api.tax),

    grandTotal:
      toNumber(api.grandTotal),

    notes:
      api.notes ?? null,

    createdAt:
      toDateString(api.createdAt),

    updatedAt:
      toDateString(api.updatedAt),

    items:
      Array.isArray(api.items)
        ? api.items.map(
            (item, index) => ({
              id:
                item.id ??
                `item-${index}`,

              productName:
                item.product?.name ??
                item.description ??
                "Unnamed Product",

              description:
                item.description ??
                item.product?.name ??
                "-",

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

              lineTotal:
                toNumber(
                  item.lineTotal ??
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

/* ============================================================
 * PAGE
 * ============================================================ */

export default function ProformaInvoiceDetailsPage({
  proformaInvoiceId,
}: Props) {
  const [loading, setLoading] =
    useState(true);

  const [pi, setPi] =
    useState<PiDetails | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  /* ============================================================
   * LOAD PROFORMA INVOICE
   * ========================================================== */

  async function loadProformaInvoice() {
    if (!proformaInvoiceId?.trim()) {
      setError(
        "Proforma Invoice ID is required."
      );
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response =
        await fetch(
          `/api/admin/proforma-invoices/${proformaInvoiceId}`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

      let data: ApiResponse = {};

      try {
        data =
          await response.json();
      } catch {
        // Response was not JSON.
      }

      if (!response.ok) {
        throw new Error(
          data.message ??
            "Unable to load Proforma Invoice."
        );
      }

      if (
        data.success === false ||
        !data.data
      ) {
        throw new Error(
          data.message ??
            "Proforma Invoice not found."
        );
      }

      setPi(
        mapApiToDetails(
          data.data
        )
      );
    } catch (err) {
      console.error(
        "Unable to load Proforma Invoice:",
        err
      );

      setPi(null);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load Proforma Invoice."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProformaInvoice();
  }, [proformaInvoiceId]);

  /* ============================================================
   * LOADING
   * ========================================================== */

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <RefreshCw className="h-5 w-5 animate-spin" />

        <span className="ml-2 text-sm">
          Loading Proforma Invoice...
        </span>
      </div>
    );
  }

  /* ============================================================
   * ERROR
   * ========================================================== */

  if (error || !pi) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <div className="rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error ??
            "Proforma Invoice not found."}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={
              loadProformaInvoice
            }
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-muted"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>

          <Link
            href="/admin/quotes"
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Quotes
          </Link>
        </div>
      </div>
    );
  }

  /* ============================================================
   * PAGE
   * ========================================================== */

  return (
    <div className="space-y-6">
      {/* ======================================================
       * HEADER
       * ==================================================== */}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/quotes"
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Quotes
          </Link>

          <h1 className="text-3xl font-bold">
            {pi.piNumber}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Proforma Invoice
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={
              loadProformaInvoice
            }
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-muted"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>

          <a
            href={`/api/admin/proforma-invoices/${proformaInvoiceId}/pdf`}
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-muted"
          >
            <Download className="h-4 w-4" />
            PDF
          </a>

          <Link
            href={`/admin/quotes/${pi.quoteId}`}
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-muted"
          >
            <FileText className="h-4 w-4" />
            Original Quote
          </Link>
        </div>
      </div>

      {/* ======================================================
       * STATUS
       * ==================================================== */}

      <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-green-700">
          <CheckCircle2 className="h-5 w-5" />

          <span className="font-medium">
            Proforma Invoice
          </span>

          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase">
            {pi.status}
          </span>
        </div>
      </div>

      {/* ======================================================
       * OVERVIEW + CUSTOMER
       * ==================================================== */}

      <div className="grid gap-6 xl:grid-cols-3">
        {/* ----------------------------------------------------
         * OVERVIEW
         * -------------------------------------------------- */}

        <div className="rounded-2xl border bg-white xl:col-span-2">
          <div className="border-b px-6 py-5">
            <h2 className="text-xl font-semibold">
              Proforma Invoice Overview
            </h2>
          </div>

          <div className="grid gap-6 p-6 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                PI Number
              </p>

              <p className="mt-1 text-base font-semibold">
                {pi.piNumber}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Currency
              </p>

              <p className="mt-1 text-base font-semibold">
                {pi.currency}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Original Quotation
              </p>

              <Link
                href={`/admin/quotes/${pi.quoteId}`}
                className="mt-1 inline-flex text-base font-semibold hover:underline"
              >
                {pi.quoteNumber}
              </Link>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Issue Date
              </p>

              <div className="mt-1 flex items-center gap-2 text-base font-semibold">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                {formatDate(
                  pi.issueDate
                )}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Payment Due Date
              </p>

              <div className="mt-1 flex items-center gap-2 text-base font-semibold">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                {formatDate(
                  pi.paymentDueDate
                )}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Last Updated
              </p>

              <p className="mt-1 text-base font-semibold">
                {formatDate(
                  pi.updatedAt
                )}
              </p>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------
         * CUSTOMER
         * -------------------------------------------------- */}

        <div className="rounded-2xl border bg-white">
          <div className="border-b px-6 py-5">
            <h2 className="text-xl font-semibold">
              Customer Information
            </h2>
          </div>

          <div className="space-y-5 p-6">
            <div className="flex gap-3">
              <div className="mt-0.5 rounded-lg bg-muted p-2">
                <User className="h-4 w-4" />
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Contact Person
                </p>

                <p className="mt-1 font-semibold">
                  {pi.contactPerson}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="mt-0.5 rounded-lg bg-muted p-2">
                <FileText className="h-4 w-4" />
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Company
                </p>

                <p className="mt-1 font-semibold">
                  {pi.companyName}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="mt-0.5 rounded-lg bg-muted p-2">
                <Mail className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Email
                </p>

                <p className="mt-1 break-all font-semibold">
                  {pi.email}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="mt-0.5 rounded-lg bg-muted p-2">
                <Phone className="h-4 w-4" />
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Phone
                </p>

                <p className="mt-1 font-semibold">
                  {pi.phone}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Country
              </p>

              <p className="mt-1 font-semibold">
                {pi.country}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================
       * LINE ITEMS
       * ==================================================== */}

      <div className="rounded-2xl border bg-white">
        <div className="border-b px-6 py-5">
          <h2 className="text-xl font-semibold">
            PI Line Items
          </h2>
        </div>

        {pi.items.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-muted-foreground">
            No line items found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-6 py-4">
                    Product
                  </th>

                  <th className="px-6 py-4">
                    HSN
                  </th>

                  <th className="px-6 py-4 text-right">
                    Quantity
                  </th>

                  <th className="px-6 py-4">
                    Unit
                  </th>

                  <th className="px-6 py-4 text-right">
                    Unit Price
                  </th>

                  <th className="px-6 py-4 text-right">
                    Line Total
                  </th>
                </tr>
              </thead>

              <tbody>
                {pi.items.map(
                  (item) => (
                    <tr
                      key={item.id}
                      className="border-b last:border-0"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium">
                          {item.productName}
                        </div>

                        {item.description !==
                          item.productName && (
                          <div className="mt-1 text-xs text-muted-foreground">
                            {
                              item.description
                            }
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4 text-sm">
                        {item.hsnCode ??
                          "-"}
                      </td>

                      <td className="px-6 py-4 text-right text-sm">
                        {item.quantity}
                      </td>

                      <td className="px-6 py-4 text-sm">
                        {item.unit || "-"}
                      </td>

                      <td className="px-6 py-4 text-right text-sm">
                        {formatAmount(
                          item.unitPrice,
                          pi.currency
                        )}
                      </td>

                      <td className="px-6 py-4 text-right font-medium">
                        {formatAmount(
                          item.lineTotal,
                          pi.currency
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ======================================================
       * TOTALS
       * ==================================================== */}

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border bg-white xl:col-span-2">
          <div className="border-b px-6 py-5">
            <h2 className="text-xl font-semibold">
              Notes
            </h2>
          </div>

          <div className="p-6">
            <div className="rounded-lg border bg-muted/20 px-4 py-4 text-sm">
              {pi.notes ||
                "No notes provided."}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-white">
          <div className="border-b px-6 py-5">
            <h2 className="text-xl font-semibold">
              Price Summary
            </h2>
          </div>

          <div className="space-y-4 p-6 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Subtotal
              </span>

              <span className="font-medium">
                {formatAmount(
                  pi.subtotal,
                  pi.currency
                )}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Discount
              </span>

              <span className="font-medium">
                {formatAmount(
                  pi.discount,
                  pi.currency
                )}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Freight
              </span>

              <span className="font-medium">
                {formatAmount(
                  pi.freight,
                  pi.currency
                )}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Insurance
              </span>

              <span className="font-medium">
                {formatAmount(
                  pi.insurance,
                  pi.currency
                )}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Tax
              </span>

              <span className="font-medium">
                {formatAmount(
                  pi.tax,
                  pi.currency
                )}
              </span>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold">
                  Grand Total
                </span>

                <span className="text-xl font-bold">
                  {formatAmount(
                    pi.grandTotal,
                    pi.currency
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================
       * DOCUMENT INFORMATION
       * ==================================================== */}

      <div className="rounded-2xl border bg-white">
        <div className="border-b px-6 py-5">
          <h2 className="text-xl font-semibold">
            Document Information
          </h2>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              PI ID
            </p>

            <p className="mt-1 break-all text-sm font-medium">
              {pi.id}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Quote ID
            </p>

            <p className="mt-1 break-all text-sm font-medium">
              {pi.quoteId}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Created
            </p>

            <p className="mt-1 text-sm font-medium">
              {formatDate(
                pi.createdAt
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}