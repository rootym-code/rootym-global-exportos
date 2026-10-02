// app/admin/inquiries/page.tsx

"use client";

import { useEffect, useState } from "react";

import InquiryFilters from "@/components/admin/InquiryFilters";
import InquiryTable, {
  InquiryTableItem,
} from "@/components/admin/InquiryTable";

import TenantSelector, {
  type AdminTenant,
} from "@/components/admin/TenantSelector";

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

  /**
   * null = All Customers
   * value = selected customer tenant
   */
  const [selectedTenantId, setSelectedTenantId] =
    useState<string | null>(null);

  const [selectedTenant, setSelectedTenant] =
    useState<AdminTenant | null>(null);

  const [page, setPage] = useState(1);

  const [data, setData] = useState<ApiResponse | null>(
    null
  );

  useEffect(() => {
    loadInquiries();
  }, [page, status, selectedTenantId]);

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

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (status) {
        params.set("status", status);
      }

      if (selectedTenantId) {
        params.set("tenantId", selectedTenantId);
      }

      const response = await fetch(
        `/api/admin/inquiries?${params.toString()}`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const result = await response.json();

      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function handleTenantChange(
    tenantId: string | null,
    tenant?: AdminTenant
  ) {
    setPage(1);
    setSelectedTenantId(tenantId);
    setSelectedTenant(tenant ?? null);
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Inquiry Management
        </h1>

        <p className="mt-1 text-gray-500">
          Manage export inquiries.
        </p>
      </div>

      {/* Customer Workspace Filter */}
      <div className="rounded-lg border bg-white p-5">
        <TenantSelector
          value={selectedTenantId}
          onChange={handleTenantChange}
        />
      </div>

      {/* Selected Customer Context */}
      {selectedTenant && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-5 py-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-green-700">
            Selected Customer
          </div>

          <div className="mt-1 text-lg font-semibold text-slate-900">
            {selectedTenant.businessName ||
              selectedTenant.name}
          </div>

          <div className="mt-1 text-sm text-slate-500">
            {selectedTenant.email
              ? selectedTenant.email
              : selectedTenant.slug}
            {selectedTenant.country
              ? ` · ${selectedTenant.country}`
              : ""}
          </div>
        </div>
      )}

      {/* Inquiry Filters */}
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

      {/* Inquiry Table */}
      {loading ? (
        <div className="rounded-lg border bg-white p-12 text-center">
          Loading...
        </div>
      ) : (
        <InquiryTable
          inquiries={data?.inquiries ?? []}
        />
      )}

      {/* Pagination */}
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