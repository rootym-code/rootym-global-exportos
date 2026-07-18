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
  Download,
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

export default function QuoteDetailsPage({
  quoteId,
}: Props) {
  const [loading, setLoading] = useState(true);

  const [quote, setQuote] =
    useState<QuoteDetails | null>(null);

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
        throw new Error("Unable to load quote.");
      }

      const data: QuoteDetails =
        await response.json();

      setQuote(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQuote();
  }, [quoteId]);

  if (loading) {
    return (
      <div className="py-24 text-center text-muted-foreground">
        Loading quote...
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="py-24 text-center text-muted-foreground">
        Quote not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">

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
            Inquiry #{quote.inquiryId}
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

          <Link
            href={`/admin/quotes/${quote.id}/edit`}
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-muted"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Link>

          <button
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-muted"
          >
            <Mail className="h-4 w-4" />
            Send
          </button>

          <button
            className="inline-flex items-center gap-2 rounded-lg border bg-primary px-4 py-2 text-primary-foreground hover:opacity-90"
          >
            <Download className="h-4 w-4" />
            PDF
          </button>

        </div>

      </div>

      <div className="grid gap-6 xl:grid-cols-3">

        <div className="space-y-6 xl:col-span-2">

          <QuoteOverviewCard quote={quote} />

          <QuoteItemsTable
            currency={quote.currency}
            items={quote.items}
          />

        </div>

        <div className="space-y-6">

          <QuoteCustomerCard quote={quote} />

          <QuoteAmountCard quote={quote} />

          <QuoteTimelineCard
            timeline={quote.timeline}
          />

        </div>

      </div>

    </div>
  );
}