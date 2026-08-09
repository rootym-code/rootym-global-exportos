"use client";

/**
 * ============================================================
 * ROOTYM Admin
 * File: components/admin/quotes/details/QuoteDetailsPage.tsx
 * Sprint 8.1
 * ============================================================
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  FileText,
  Mail,
  Pencil,
  RefreshCw,
} from "lucide-react";

import QuoteOverviewCard from "./QuoteOverviewCard";
import QuoteCustomerCard from "./QuoteCustomerCard";
import QuoteAmountCard from "./QuoteAmountCard";
import QuoteItemsTable from "./QuoteItemsTable";
import QuoteTimelineCard from "./QuoteTimelineCard";

export interface QuoteItem {
  id: string;
  productName: string;
  hsnCode?: string | null;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export interface QuoteDetails {
  id: string;

  quoteNumber: string;

  inquiryId: string;

  status: string;

  currency: string;

  customerName: string;
  companyName?: string | null;
  email: string;
  phone?: string | null;
  country?: string | null;

  subtotal: number;
  freight: number;
  insurance: number;
  tax: number;
  discount: number;
  total: number;

  validUntil?: string | null;

  notes?: string | null;

  createdAt: string;
  updatedAt: string;

  items: QuoteItem[];

  timeline: {
    id: string;
    action: string;
    description: string;
    createdAt: string;
    user?: string | null;
  }[];
}

interface Props {
  quoteId: string;
}

/* ============================================================
 * API TYPES
 * ============================================================ */

interface ApiQuoteItem {
  id: string;
  productId: string;
  description?: string | null;
  quantity?: unknown;
  unit?: string | null;
  unitPrice?: unknown;
  lineTotal?: unknown;
  product?: {
    name?: string | null;
    hsnCode?: string | null;
  } | null;
}

interface ApiQuote {
  id: string;
  quoteNumber?: string | null;
  inquiryId?: string | null;

  status?: string | null;

  companyName?: string | null;
  contactPerson?: string | null;
  email?: string | null;
  phone?: string | null;
  country?: string | null;
  currency?: string | null;

  subtotal?: unknown;
  freight?: unknown;
  insurance?: unknown;
  tax?: unknown;
  discount?: unknown;
  grandTotal?: unknown;

  validUntil?: unknown;

  notes?: string | null;

  createdAt?: unknown;
  updatedAt?: unknown;

  items?: ApiQuoteItem[];
}

interface ApiQuoteResponse {
  success: boolean;
  message?: string;
  data?: {
    quote?: ApiQuote | null;
    revisions?: unknown[];
    proformaInvoice?: {
      id?: string | null;
      piNumber?: string | null;
    } | null;
  };
}

/* ============================================================
 * PROFORMA INVOICE API TYPES
 * ============================================================ */

interface ProformaInvoiceApiResponse {
  success?: boolean;
  message?: string;
  data?: {
    id?: string;
    piNumber?: string;
    status?: string;
    proformaInvoice?: {
      id?: string;
      piNumber?: string;
      status?: string;
    };
  };
}

/* ============================================================
 * HELPERS
 * ============================================================ */

function toNumber(value: unknown): number {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : 0;
}

function toDateString(value: unknown): string {
  if (!value) {
    return "";
  }

  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString();
}

/* ============================================================
 * API → UI MAPPER
 * ============================================================ */

function mapApiQuoteToDetails(
  apiQuote: ApiQuote
): QuoteDetails {
  return {
    id: apiQuote.id,

    quoteNumber:
      apiQuote.quoteNumber ?? "",

    inquiryId:
      apiQuote.inquiryId ?? "",

    status:
      apiQuote.status ?? "DRAFT",

    currency:
      apiQuote.currency ?? "INR",

    customerName:
      apiQuote.contactPerson ?? "",

    companyName:
      apiQuote.companyName ?? null,

    email:
      apiQuote.email ?? "",

    phone:
      apiQuote.phone ?? null,

    country:
      apiQuote.country ?? null,

    subtotal:
      toNumber(apiQuote.subtotal),

    freight:
      toNumber(apiQuote.freight),

    insurance:
      toNumber(apiQuote.insurance),

    tax:
      toNumber(apiQuote.tax),

    discount:
      toNumber(apiQuote.discount),

    total:
      toNumber(apiQuote.grandTotal),

    validUntil:
      apiQuote.validUntil
        ? toDateString(apiQuote.validUntil)
        : null,

    notes:
      apiQuote.notes ?? null,

    createdAt:
      toDateString(apiQuote.createdAt),

    updatedAt:
      toDateString(apiQuote.updatedAt),

    items:
      Array.isArray(apiQuote.items)
        ? apiQuote.items.map((item) => ({
            id: item.id,

            productName:
              item.product?.name ??
              item.description ??
              "Unnamed Product",

            hsnCode:
              item.product?.hsnCode ??
              null,

            quantity:
              toNumber(item.quantity),

            unit:
              item.unit ?? "",

            unitPrice:
              toNumber(item.unitPrice),

            total:
              toNumber(
                item.lineTotal ??
                  toNumber(item.quantity) *
                    toNumber(item.unitPrice)
              ),
          }))
        : [],

    /*
     * The current Single Quote API returns:
     *
     *   quote
     *   revisions
     *
     * It does not currently return a timeline.
     *
     * Keep this as an empty array until the dedicated
     * quote timeline API is connected.
     */
    timeline: [],
  };
}

/* ============================================================
 * PAGE
 * ============================================================ */

export default function QuoteDetailsPage({
  quoteId,
}: Props) {
  const [loading, setLoading] =
    useState(true);

  const [quote, setQuote] =
    useState<QuoteDetails | null>(null);

  const [proformaInvoiceId, setProformaInvoiceId] =
    useState<string | null>(null);

  const [pdfLoading, setPdfLoading] =
    useState(false);

  const [pdfError, setPdfError] =
    useState<string | null>(null);

  const [statusLoading, setStatusLoading] =
    useState(false);

  const [statusError, setStatusError] =
    useState<string | null>(null);

  /* ============================================================
   * PROFORMA INVOICE STATE
   * ========================================================== */

  const [piLoading, setPiLoading] =
    useState(false);

  const [piError, setPiError] =
    useState<string | null>(null);

  const [piMessage, setPiMessage] =
    useState<string | null>(null);

  /* ============================================================
   * LOAD QUOTE
   * ========================================================== */

  async function loadQuote() {
    setLoading(true);

    try {
      const response = await fetch(
        `/api/admin/quotes/${quoteId}`,
        {
          cache: "no-store",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Unable to load quote."
        );
      }

      const data: ApiQuoteResponse =
        await response.json();

      /*
       * Single Quote API response:
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
        mapApiQuoteToDetails(
          data.data.quote
        )
      );

      setProformaInvoiceId(
        data.data.proformaInvoice?.id ?? null
      );
    } catch (error) {
      console.error(
        "Unable to load quote:",
        error
      );

      setQuote(null);
    } finally {
      setLoading(false);
    }
  }

  /* ============================================================
   * MARK QUOTE AS ACCEPTED
   * ========================================================== */

  async function handleMarkAccepted() {
    if (
      !quote ||
      statusLoading ||
      quote.status === "APPROVED"
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        `Mark quotation ${quote.quoteNumber} as ACCEPTED?\n\nOnce accepted, the quotation cannot be modified.`
      );

    if (!confirmed) {
      return;
    }

    setStatusLoading(true);
    setStatusError(null);

    try {
      const response = await fetch(
        `/api/admin/quotes/${quote.id}/status`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          credentials: "include",
          cache: "no-store",
          body: JSON.stringify({
            status: "APPROVED",
          }),
        }
      );

      let data: {
        success?: boolean;
        message?: string;
      } = {};

      try {
        data = await response.json();
      } catch {
        // Response was not JSON.
      }

      if (
        !response.ok ||
        data.success === false
      ) {
        throw new Error(
          data.message ??
            "Unable to mark quotation as accepted."
        );
      }

      await loadQuote();
    } catch (error) {
      console.error(
        "Unable to mark quote as accepted:",
        error
      );

      setStatusError(
        error instanceof Error
          ? error.message
          : "Unable to mark quotation as accepted."
      );
    } finally {
      setStatusLoading(false);
    }
  }

  /* ============================================================
   * CREATE PROFORMA INVOICE
   * ========================================================== */

  async function handleCreateProformaInvoice() {
    if (
      !quote ||
      piLoading ||
      quote.status !== "APPROVED"
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        `Create Proforma Invoice from quotation ${quote.quoteNumber}?\n\nThe quotation will remain unchanged.`
      );

    if (!confirmed) {
      return;
    }

    setPiLoading(true);
    setPiError(null);
    setPiMessage(null);

    try {
      const response = await fetch(
        `/api/admin/quotes/${quote.id}/proforma`,
        {
          method: "POST",
          credentials: "include",
          cache: "no-store",
        }
      );

      let data: ProformaInvoiceApiResponse =
        {};

      try {
        data = await response.json();
      } catch {
        // Response was not JSON.
      }

      if (!response.ok) {
        throw new Error(
          data.message ??
            "Unable to create Proforma Invoice."
        );
      }

      if (data.success === false) {
        throw new Error(
          data.message ??
            "Unable to create Proforma Invoice."
        );
      }

      const createdProformaInvoiceId =
        data.data?.id ??
        data.data?.proformaInvoice?.id;

      const piNumber =
        data.data?.piNumber ??
        data.data?.proformaInvoice?.piNumber;

      if (createdProformaInvoiceId) {
        setProformaInvoiceId(
          createdProformaInvoiceId
        );
      }

      const message =
        piNumber
          ? `Proforma Invoice ${piNumber} created successfully.`
          : data.message ??
            "Proforma Invoice created successfully.";

      setPiMessage(message);
    } catch (error) {
      console.error(
        "Unable to create Proforma Invoice:",
        error
      );

      setPiError(
        error instanceof Error
          ? error.message
          : "Unable to create Proforma Invoice."
      );
    } finally {
      setPiLoading(false);
    }
  }

  /* ============================================================
   * DOWNLOAD PDF
   * ========================================================== */

  async function handleDownloadPdf() {
    if (!quote || pdfLoading) {
      return;
    }

    setPdfLoading(true);
    setPdfError(null);

    try {
      const pdfEndpoint =
        proformaInvoiceId
          ? `/api/admin/proforma-invoices/${proformaInvoiceId}/pdf`
          : `/api/admin/quotes/${quote.id}/pdf`;

      const response = await fetch(
        pdfEndpoint,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        let message =
          "Unable to generate PDF.";

        try {
          const errorData =
            await response.json();

          if (errorData?.message) {
            message =
              errorData.message;
          }
        } catch {
          // Response was not JSON.
        }

        throw new Error(message);
      }

      const blob =
        await response.blob();

      if (
        !blob ||
        blob.size === 0
      ) {
        throw new Error(
          "The generated PDF is empty."
        );
      }

      /*
       * Prefer the filename supplied by the
       * API. Fall back to the quote number.
       */
      let filename =
        proformaInvoiceId
          ? "Proforma-Invoice.pdf"
          : `${quote.quoteNumber}.pdf`;

      const disposition =
        response.headers.get(
          "Content-Disposition"
        );

      if (disposition) {
        const match =
          disposition.match(
            /filename="?([^"]+)"?/i
          );

        if (match?.[1]) {
          filename =
            match[1];
        }
      }

      /*
       * Create a temporary browser URL
       * and trigger a normal file download.
       */
      const url =
        window.URL.createObjectURL(
          blob
        );

      const anchor =
        document.createElement("a");

      anchor.href = url;
      anchor.download = filename;

      document.body.appendChild(anchor);

      anchor.click();

      anchor.remove();

      /*
       * Give the browser a moment to start
       * the download before releasing the URL.
       */
      window.setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
    } catch (error) {
      console.error(
        "Unable to download PDF:",
        error
      );

      setPdfError(
        error instanceof Error
          ? error.message
          : "Unable to generate PDF."
      );
    } finally {
      setPdfLoading(false);
    }
  }

  useEffect(() => {
    loadQuote();
  }, [quoteId]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <RefreshCw className="h-5 w-5 animate-spin" />

        <span className="ml-2">
          Loading quote...
        </span>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <p className="text-sm text-muted-foreground">
          Quote not found.
        </p>

        <Link
          href="/admin/quotes"
          className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Quotes
        </Link>
      </div>
    );
  }

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
            {quote.quoteNumber}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Inquiry #{quote.inquiryId || "-"}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={loadQuote}
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-muted"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>

          {quote.status !== "APPROVED" && (
            <Link
              href={`/admin/quotes/${quote.id}/edit`}
              className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-muted"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Link>
          )}

          {quote.status !== "APPROVED" &&
            quote.status !== "CANCELLED" &&
            quote.status !== "REJECTED" &&
            quote.status !== "EXPIRED" && (
              <button
                type="button"
                onClick={
                  handleMarkAccepted
                }
                disabled={statusLoading}
                className="inline-flex items-center gap-2 rounded-lg border border-green-600 bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {statusLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}

                {statusLoading
                  ? "Accepting..."
                  : "Mark as Accepted"}
              </button>
            )}

          {/* ==================================================
           * CREATE PROFORMA INVOICE
           * ================================================== */}

          {quote.status === "APPROVED" && (
            <button
              type="button"
              onClick={
                handleCreateProformaInvoice
              }
              disabled={piLoading}
              className="inline-flex items-center gap-2 rounded-lg border border-green-700 bg-green-700 px-4 py-2 text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {piLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <FileText className="h-4 w-4" />
              )}

              {piLoading
                ? "Creating PI..."
                : "Create Proforma Invoice"}
            </button>
          )}

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-muted"
          >
            <Mail className="h-4 w-4" />
            Send
          </button>

          <button
            type="button"
            onClick={
              handleDownloadPdf
            }
            disabled={pdfLoading}
            className="inline-flex items-center gap-2 rounded-lg border bg-primary px-4 py-2 text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pdfLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}

            {pdfLoading
              ? "Generating..."
              : "PDF"}
          </button>
        </div>
      </div>

      {/* ======================================================
       * PDF ERROR
       * ==================================================== */}

      {pdfError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <div className="flex items-center justify-between gap-4">
            <span>
              {pdfError}
            </span>

            <button
              type="button"
              onClick={() =>
                setPdfError(null)
              }
              className="font-medium hover:underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* ======================================================
       * STATUS ERROR
       * ==================================================== */}

      {statusError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <div className="flex items-center justify-between gap-4">
            <span>
              {statusError}
            </span>

            <button
              type="button"
              onClick={() =>
                setStatusError(null)
              }
              className="font-medium hover:underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* ======================================================
       * PROFORMA INVOICE ERROR
       * ==================================================== */}

      {piError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <div className="flex items-center justify-between gap-4">
            <span>
              {piError}
            </span>

            <button
              type="button"
              onClick={() =>
                setPiError(null)
              }
              className="font-medium hover:underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* ======================================================
       * PROFORMA INVOICE SUCCESS
       * ==================================================== */}

      {piMessage && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <div className="flex items-center justify-between gap-4">
            <span>
              {piMessage}
            </span>

            <button
              type="button"
              onClick={() =>
                setPiMessage(null)
              }
              className="font-medium hover:underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* ======================================================
       * CONTENT
       * ==================================================== */}

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <QuoteOverviewCard
            quote={quote}
          />

          <QuoteItemsTable
            currency={quote.currency}
            items={quote.items}
          />
        </div>

        <div className="space-y-6">
          <QuoteCustomerCard
            quote={quote}
          />

          <QuoteAmountCard
            quote={quote}
          />

          <QuoteTimelineCard
            timeline={quote.timeline}
          />
        </div>
      </div>
    </div>
  );
}