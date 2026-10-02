"use client";

/**
 * ============================================================
 * ROOTYM ExportOS — Admin Tenant Selector
 * ============================================================
 *
 * Purpose:
 * Reusable customer/tenant selector for the ROOTYM Admin Portal.
 *
 * Responsibilities:
 * - Load active customer tenants from /api/admin/tenants
 * - Search by customer/company/email/etc.
 * - Allow "All Customers"
 * - Return the selected tenant ID to the parent
 *
 * This component does NOT:
 * - Apply tenant filtering itself
 * - Modify Products / Inquiries / FollowUps
 * - Persist tenant selection
 *
 * The parent page remains responsible for using the selected
 * tenantId when requesting its data.
 * ============================================================
 */

import { useEffect, useRef, useState } from "react";

export type AdminTenant = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;

  businessName: string | null;
  legalName: string | null;
  email: string | null;
  phone: string | null;
  country: string | null;

  website: {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
  } | null;
};

type TenantSelectorProps = {
  value?: string | null;
  onChange: (tenantId: string | null, tenant?: AdminTenant) => void;
  label?: string;
  placeholder?: string;
  className?: string;
};

export default function TenantSelector({
  value = null,
  onChange,
  label = "Customer Workspace",
  placeholder = "Search customer, company or email...",
  className = "",
}: TenantSelectorProps) {
  const [tenants, setTenants] = useState<AdminTenant[]>([]);
  const [selectedTenant, setSelectedTenant] =
    useState<AdminTenant | null>(null);

  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  /**
   * ------------------------------------------------------------
   * Load tenants
   * ------------------------------------------------------------
   */
  const loadTenants = async (searchValue = "") => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();

      if (searchValue.trim()) {
        params.set("search", searchValue.trim());
      }

      const query = params.toString();

      const response = await fetch(
        `/api/admin/tenants${query ? `?${query}` : ""}`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.message || "Unable to load customer workspaces."
        );
      }

      setTenants(Array.isArray(data.tenants) ? data.tenants : []);
    } catch (err) {
      console.error("TenantSelector load error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load customer workspaces."
      );

      setTenants([]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * ------------------------------------------------------------
   * Initial load
   * ------------------------------------------------------------
   */
  useEffect(() => {
    void loadTenants();
  }, []);

  /**
   * ------------------------------------------------------------
   * Resolve selected tenant
   * ------------------------------------------------------------
   *
   * When a parent already provides a tenant ID, find its complete
   * tenant object after the API data has loaded.
   */
  useEffect(() => {
    if (!value) {
      setSelectedTenant(null);
      return;
    }

    const tenant = tenants.find((item) => item.id === value);

    if (tenant) {
      setSelectedTenant(tenant);
    }
  }, [value, tenants]);

  /**
   * ------------------------------------------------------------
   * Close dropdown when clicking outside
   * ------------------------------------------------------------
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /**
   * ------------------------------------------------------------
   * Search with small debounce
   * ------------------------------------------------------------
   */
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setIsOpen(true);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      void loadTenants(value);
    }, 250);
  };

  /**
   * ------------------------------------------------------------
   * Select tenant
   * ------------------------------------------------------------
   */
  const handleSelect = (tenant: AdminTenant) => {
    setSelectedTenant(tenant);
    setSearch("");
    setIsOpen(false);

    onChange(tenant.id, tenant);
  };

  /**
   * ------------------------------------------------------------
   * Select all customers
   * ------------------------------------------------------------
   */
  const handleSelectAll = () => {
    setSelectedTenant(null);
    setSearch("");
    setIsOpen(false);

    onChange(null);
  };

  /**
   * ------------------------------------------------------------
   * Display helpers
   * ------------------------------------------------------------
   */
  const getPrimaryName = (tenant: AdminTenant) => {
    return tenant.businessName || tenant.name;
  };

  const getSecondaryText = (tenant: AdminTenant) => {
    const parts: string[] = [];

    if (
      tenant.businessName &&
      tenant.name &&
      tenant.businessName !== tenant.name
    ) {
      parts.push(tenant.name);
    }

    if (tenant.country) {
      parts.push(tenant.country);
    }

    return parts.join(" · ");
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className}`}
    >
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex min-h-[58px] w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-left shadow-sm transition hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
      >
        <div className="min-w-0 flex-1">
          {selectedTenant ? (
            <>
              <div className="truncate text-sm font-semibold text-gray-900">
                {getPrimaryName(selectedTenant)}
              </div>

              <div className="mt-0.5 truncate text-xs text-gray-500">
                {selectedTenant.email ||
                  getSecondaryText(selectedTenant) ||
                  selectedTenant.slug}
              </div>
            </>
          ) : (
            <>
              <div className="text-sm font-semibold text-gray-900">
                All Customers
              </div>

              <div className="mt-0.5 text-xs text-gray-500">
                View data across all customer workspaces
              </div>
            </>
          )}
        </div>

        <svg
          className={`ml-3 h-5 w-5 shrink-0 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
          <div className="border-b border-gray-100 p-3">
            <div className="relative">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8.5 3a5.5 5.5 0 104.396 8.804l3.15 3.15a.75.75 0 101.06-1.06l-3.15-3.15A5.5 5.5 0 008.5 3zM4.5 8.5a4 4 0 118 0 4 4 0 01-8 0z"
                  clipRule="evenodd"
                />
              </svg>

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  handleSearchChange(event.target.value)
                }
                onClick={(event) => event.stopPropagation()}
                placeholder={placeholder}
                autoFocus
                className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-300 focus:bg-white"
              />
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            <button
              type="button"
              onClick={handleSelectAll}
              className={`w-full border-b border-gray-100 px-4 py-3 text-left transition hover:bg-gray-50 ${
                !selectedTenant ? "bg-gray-50" : ""
              }`}
            >
              <div className="text-sm font-semibold text-gray-900">
                All Customers
              </div>

              <div className="mt-0.5 text-xs text-gray-500">
                View data across all customer workspaces
              </div>
            </button>

            {isLoading ? (
              <div className="px-4 py-8 text-center text-sm text-gray-500">
                Loading customers...
              </div>
            ) : error ? (
              <div className="px-4 py-8 text-center">
                <div className="text-sm font-medium text-red-600">
                  Unable to load customers
                </div>

                <button
                  type="button"
                  onClick={() => void loadTenants(search)}
                  className="mt-2 text-xs font-medium text-gray-700 underline underline-offset-2"
                >
                  Try again
                </button>
              </div>
            ) : tenants.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-gray-500">
                No customer workspaces found.
              </div>
            ) : (
              tenants.map((tenant) => {
                const isSelected = selectedTenant?.id === tenant.id;

                return (
                  <button
                    key={tenant.id}
                    type="button"
                    onClick={() => handleSelect(tenant)}
                    className={`w-full border-b border-gray-50 px-4 py-3 text-left transition last:border-b-0 hover:bg-gray-50 ${
                      isSelected ? "bg-gray-50" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold text-gray-900">
                          {getPrimaryName(tenant)}
                        </div>

                        {getSecondaryText(tenant) && (
                          <div className="mt-0.5 truncate text-xs text-gray-500">
                            {getSecondaryText(tenant)}
                          </div>
                        )}

                        {tenant.email && (
                          <div className="mt-1 truncate text-xs text-gray-400">
                            {tenant.email}
                          </div>
                        )}
                      </div>

                      {isSelected && (
                        <svg
                          className="mt-0.5 h-5 w-5 shrink-0 text-gray-700"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.704 5.29a1 1 0 010 1.42l-7.25 7.25a1 1 0 01-1.415 0l-3.75-3.75a1 1 0 011.415-1.42l3.043 3.043 6.543-6.543a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}