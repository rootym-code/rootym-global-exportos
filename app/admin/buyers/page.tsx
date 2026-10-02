"use client";

import { useCallback, useEffect, useState } from "react";

import BuyerTable, {
  BuyerTableItem,
} from "@/components/admin/BuyerTable";

import TenantSelector, {
  type AdminTenant,
} from "@/components/admin/TenantSelector";

interface ApiResponse {
  success: boolean;
  buyers: BuyerTableItem[];
  message?: string;
}

export default function BuyersPage() {
  const [loading, setLoading] = useState(true);

  const [buyers, setBuyers] = useState<BuyerTableItem[]>([]);

  /**
   * ------------------------------------------------------------
   * Admin Tenant Filter
   * ------------------------------------------------------------
   *
   * null = All Customers
   * value = selected customer tenant
   */
  const [selectedTenantId, setSelectedTenantId] =
    useState<string | null>(null);

  const [selectedTenant, setSelectedTenant] =
    useState<AdminTenant | null>(null);

  /**
   * ------------------------------------------------------------
   * Load Buyers
   * ------------------------------------------------------------
   */
  const loadBuyers = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (selectedTenantId) {
        params.set("tenantId", selectedTenantId);
      }

      const query = params.toString();

      const response = await fetch(
        `/api/admin/buyers${query ? `?${query}` : ""}`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const result: ApiResponse =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to load buyers."
        );
      }

      setBuyers(
        Array.isArray(result.buyers)
          ? result.buyers
          : []
      );
    } catch (error) {
      console.error(
        "Failed to load buyers:",
        error
      );

      setBuyers([]);
    } finally {
      setLoading(false);
    }
  }, [selectedTenantId]);

  /**
   * ------------------------------------------------------------
   * Tenant Change
   * ------------------------------------------------------------
   */
  const handleTenantChange = (
    tenantId: string | null,
    tenant?: AdminTenant
  ) => {
    setSelectedTenantId(tenantId);
    setSelectedTenant(tenant ?? null);
  };

  /**
   * ------------------------------------------------------------
   * Reload whenever tenant changes
   * ------------------------------------------------------------
   */
  useEffect(() => {
    void loadBuyers();
  }, [loadBuyers]);

  return (
    <div className="space-y-6">
      {/* --------------------------------------------------------
          Header
          -------------------------------------------------------- */}
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold">
            Buyer Management
          </h1>

          {selectedTenant && (
            <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
              Customer Selected
            </span>
          )}
        </div>

        <p className="mt-1 text-gray-500">
          Manage global buyers and inquiry history.
        </p>

        {selectedTenant && (
          <p className="mt-2 text-sm text-gray-600">
            Showing buyers for{" "}
            <span className="font-semibold text-gray-900">
              {selectedTenant.businessName ||
                selectedTenant.name}
            </span>
            .
          </p>
        )}
      </div>

      {/* --------------------------------------------------------
          Customer Workspace Filter
          -------------------------------------------------------- */}
      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <TenantSelector
          value={selectedTenantId}
          onChange={handleTenantChange}
        />
      </div>

      {/* --------------------------------------------------------
          Buyer Table
          -------------------------------------------------------- */}
      {loading ? (
        <div className="rounded-lg border bg-white p-12 text-center">
          Loading buyers...
        </div>
      ) : (
        <BuyerTable buyers={buyers} />
      )}
    </div>
  );
}