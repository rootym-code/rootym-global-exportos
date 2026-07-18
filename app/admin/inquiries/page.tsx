// app/admin/inquiries/page.tsx

"use client";

import { useEffect, useState } from "react";
import InquiryFilters from "@/components/admin/InquiryFilters";
import InquiryTable, {
  InquiryTableItem,
} from "@/components/admin/InquiryTable";

interface ApiResponse {
  success: boolean;
  inquiries: InquiryTableItem[];
  pagination: {
    page: number;
    totalPages: number;
    totalRecords: number;
  };
}

export default function InquiriesPage() {
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("");

  const [page, setPage] = useState(1);

  const [data, setData] = useState<ApiResponse | null>(
    null
  );

  useEffect(() => {
    loadInquiries();
  }, [page, status]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadInquiries();
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  async function loadInquiries() {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      params.set("page", page.toString());

      if (search) {
        params.set("search", search);
      }

      if (status) {
        params.set("status", status);
      }

      const response = await fetch(
        `/api/admin/inquiries?${params.toString()}`
      );

      const result = await response.json();

      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Inquiry Management
        </h1>

        <p className="mt-1 text-gray-500">
          Manage export inquiries.
        </p>
      </div>

      <InquiryFilters
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

      {loading ? (
        <div className="rounded-lg border bg-white p-12 text-center">
          Loading...
        </div>
      ) : (
        <InquiryTable
          inquiries={data?.inquiries ?? []}
        />
      )}

      {data && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            disabled={page === 1}
            onClick={() =>
              setPage((prev) => prev - 1)
            }
            className="rounded border px-4 py-2 disabled:opacity-50"
          >
            Previous
          </button>

          <span className="font-medium">
            Page {page} of{" "}
            {data.pagination.totalPages}
          </span>

          <button
            disabled={
              page === data.pagination.totalPages
            }
            onClick={() =>
              setPage((prev) => prev + 1)
            }
            className="rounded border px-4 py-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}