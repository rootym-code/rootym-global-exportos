"use client";

/**
 * ============================================================
 * ROOTYM Admin
 * File: components/admin/quotes/QuoteManagementPage.tsx
 * Sprint 8.1
 * ============================================================
 */

import { useEffect, useMemo, useState } from "react";

import QuoteFilters from "./QuoteFilters";
import QuoteStatsCards from "./QuoteStatsCards";
import QuoteTable from "./QuoteTable";

type QuoteStatus =
  | "DRAFT"
  | "SENT"
  | "VIEWED"
  | "NEGOTIATION"
  | "APPROVED"
  | "REJECTED"
  | "EXPIRED";

export interface QuoteRow {
  id: string;
  quoteNumber: string;

  inquiryId: string;

  customerName: string;
  companyName?: string | null;
  country?: string | null;

  status: QuoteStatus;

  currency: string;

  subtotal: number;
  freight: number;
  tax: number;
  total: number;

  validUntil?: string | null;

  createdAt: string;
  updatedAt: string;
}

interface QuoteListResponse {
  items: QuoteRow[];
  page: number;
  pageSize: number;
  total: number;

  summary?: {
    draft: number;
    sent: number;
    approved: number;
    expired: number;
  };
}

const DEFAULT_PAGE_SIZE = 15;

export default function QuoteManagementPage() {
  const [loading, setLoading] = useState(true);

  const [quotes, setQuotes] = useState<QuoteRow[]>([]);

  const [page, setPage] = useState(1);

  const [pageSize] = useState(DEFAULT_PAGE_SIZE);

  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState<string>("");

  const [summary, setSummary] = useState({
    draft: 0,
    sent: 0,
    approved: 0,
    expired: 0,
  });

  async function loadQuotes() {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      params.set("page", String(page));
      params.set("pageSize", String(pageSize));

      if (search) {
        params.set("search", search);
      }

      if (status) {
        params.set("status", status);
      }

      const response = await fetch(
        `/api/admin/quotes?${params.toString()}`,
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error("Unable to fetch quotes");
      }

      const data: QuoteListResponse = await response.json();

      setQuotes(data.items);

      setTotal(data.total);

      if (data.summary) {
        setSummary(data.summary);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQuotes();
  }, [page, pageSize, search, status]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(total / pageSize));
  }, [total, pageSize]);

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Quote Management
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage quotations generated for customer inquiries.
          </p>
        </div>

      </div>

      <QuoteStatsCards summary={summary} />

      <QuoteFilters
        search={search}
        status={status}
        onSearchChange={(value) => {
          setPage(1);
          setSearch(value);
        }}
        onStatusChange={(value) => {
          setPage(1);
          setStatus(value);
        }}
      />

      <QuoteTable
        loading={loading}
        quotes={quotes}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onRefresh={loadQuotes}
      />
    </div>
  );
}