
"use client";

import { useCallback, useEffect, useState } from "react";

type OrderItem = {
  id: string;
  productName: string;
  productSku: string | null;
  unit: string | null;
  quantity: string | number;
  unitPrice: string | number;
  lineTotal: string | number;
};

type StoreOrder = {
  id: string;
  websiteId: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  currency: string;
  subtotal: string | number;
  shippingAmount: string | number;
  discountAmount: string | number;
  taxAmount: string | number;
  totalAmount: string | number;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  shippingCity: string;
  shippingState: string | null;
  shippingPostalCode: string;
  shippingCountry: string;
  provider: string;
  providerOrderId: string | null;
  providerPaymentId: string | null;
  paidAt: string | null;
  paymentFailureReason: string | null;
  createdAt: string;
  updatedAt: string;
  website: {
    name: string;
    slug: string;
  };
  items: OrderItem[];
};

type Pagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

type OrdersResponse = {
  success: boolean;
  orders?: StoreOrder[];
  pagination?: Pagination;
  error?: string;
};

const ORDER_STATUSES = [
  "ALL",
  "PENDING_PAYMENT",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "FAILED",
];

const PAYMENT_STATUSES = [
  "ALL",
  "CREATED",
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
];

function formatMoney(
  amount: string | number,
  currency: string
): string {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return `${currency} ${amount}`;
  }

  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(numericAmount);
  } catch {
    return `${currency} ${numericAmount.toFixed(2)}`;
  }
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function humanizeStatus(status: string): string {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function statusClasses(status: string): string {
  switch (status) {
    case "PAID":
    case "CONFIRMED":
    case "DELIVERED":
      return "bg-green-100 text-green-800";

    case "FAILED":
    case "CANCELLED":
      return "bg-red-100 text-red-800";

    case "PENDING":
    case "PENDING_PAYMENT":
    case "CREATED":
      return "bg-amber-100 text-amber-800";

    case "SHIPPED":
    case "PROCESSING":
      return "bg-blue-100 text-blue-800";

    case "REFUNDED":
      return "bg-purple-100 text-purple-800";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses(status)}`}
    >
      {humanizeStatus(status)}
    </span>
  );
}

export default function StorefrontOrdersPage() {
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 25,
    total: 0,
    totalPages: 1,
  });

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = useCallback(
    async (signal: AbortSignal) => {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        search,
        status: statusFilter,
        paymentStatus: paymentFilter,
        page: String(pagination.page),
        pageSize: String(pagination.pageSize),
      });

      try {
        const response = await fetch(
          `/api/admin/storefront/orders?${params.toString()}`,
          {
            method: "GET",
            credentials: "same-origin",
            cache: "no-store",
            signal,
          }
        );

        const data = (await response.json()) as OrdersResponse;

        if (!response.ok || !data.success) {
          throw new Error(
            response.status === 401
              ? "Your admin session is missing or has expired. Sign in to the admin workspace and try again."
              : data.error || "Unable to load orders."
          );
        }

        setOrders(data.orders ?? []);

        setPagination((current) => ({
          ...current,
          ...(data.pagination ?? {}),
        }));
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setOrders([]);
        setError(
          err instanceof Error ? err.message : "Unable to load orders."
        );
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    },
    [
      search,
      statusFilter,
      paymentFilter,
      pagination.page,
      pagination.pageSize,
    ]
  );

  // Debounce search input.
  useEffect(() => {
    const timer = setTimeout(() => {
      setPagination((current) => ({ ...current, page: 1 }));
      setSearch(searchInput.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Reload orders when the search, filters, or page changes.
  useEffect(() => {
    const controller = new AbortController();

    void loadOrders(controller.signal);

    return () => controller.abort();
  }, [loadOrders]);

  function updateStatusFilter(value: string) {
    setPagination((current) => ({ ...current, page: 1 }));
    setStatusFilter(value);
  }

  function updatePaymentFilter(value: string) {
    setPagination((current) => ({ ...current, page: 1 }));
    setPaymentFilter(value);
  }

  function changePage(page: number) {
    setPagination((current) => ({
      ...current,
      page: Math.max(1, Math.min(page, current.totalPages)),
    }));
  }

  const firstRecord =
    pagination.total === 0
      ? 0
      : (pagination.page - 1) * pagination.pageSize + 1;

  const lastRecord = Math.min(
    pagination.page * pagination.pageSize,
    pagination.total
  );

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
              Ecommerce Administration
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
              Store Orders
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Search orders and review order and payment statuses.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setSearchInput("");
              setSearch("");
              setStatusFilter("ALL");
              setPaymentFilter("ALL");
              setPagination((current) => ({
                ...current,
                page: 1,
              }));
            }}
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100"
          >
            Clear filters
          </button>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Matching orders</p>
            <p className="mt-2 text-2xl font-bold text-gray-950">
              {loading ? "—" : pagination.total.toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Based on current filters
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Current page</p>
            <p className="mt-2 text-2xl font-bold text-gray-950">
              {pagination.page}
              <span className="text-base font-medium text-gray-400">
                {" "}
                / {pagination.totalPages}
              </span>
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {pagination.pageSize} orders per page
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Displayed records</p>
            <p className="mt-2 text-2xl font-bold text-gray-950">
              {loading ? "—" : `${firstRecord}–${lastRecord}`}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Of {pagination.total.toLocaleString("en-IN")} matching orders
            </p>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <label
                htmlFor="order-search"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Search orders
              </label>
              <input
                id="order-search"
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Order number, customer, email, phone..."
                className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label
                htmlFor="order-status"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Order status
              </label>
              <select
                id="order-status"
                value={statusFilter}
                onChange={(event) => updateStatusFilter(event.target.value)}
                className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              >
                {ORDER_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status === "ALL" ? "All order statuses" : humanizeStatus(status)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="payment-status"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Payment status
              </label>
              <select
                id="payment-status"
                value={paymentFilter}
                onChange={(event) => updatePaymentFilter(event.target.value)}
                className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              >
                {PAYMENT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status === "ALL"
                      ? "All payment statuses"
                      : humanizeStatus(status)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4"
          >
            <p className="font-semibold text-red-800">
              Unable to load orders
            </p>
            <p className="mt-1 text-sm text-red-700">{error}</p>
            <button
              type="button"
              onClick={() => {
                const controller = new AbortController();
                void loadOrders(controller.signal);
              }}
              className="mt-3 rounded-lg border border-red-300 bg-white px-3 py-2 text-sm font-semibold text-red-800 hover:bg-red-100"
            >
              Retry
            </button>
          </div>
        )}

        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div>
              <h2 className="font-bold text-gray-950">All orders</h2>
              <p className="mt-1 text-xs text-gray-500">
                Newest orders appear first.
              </p>
            </div>

            {loading && (
              <span className="text-sm text-gray-500" aria-live="polite">
                Loading orders…
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[1050px] w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Order</th>
                  <th className="px-5 py-3 font-semibold">Customer</th>
                  <th className="px-5 py-3 font-semibold">Website</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 text-right font-semibold">Total</th>
                  <th className="px-5 py-3 font-semibold">Order status</th>
                  <th className="px-5 py-3 font-semibold">Payment</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {!loading && !error && orders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-14 text-center">
                      <p className="font-semibold text-gray-800">
                        No orders found
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Try a different search term or clear the filters.
                      </p>
                    </td>
                  </tr>
                )}

                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="transition hover:bg-gray-50"
                  >
                    <td className="px-5 py-4 align-top">
                      <p className="font-bold text-gray-950">
                        {order.orderNumber}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {order.items.length}{" "}
                        {order.items.length === 1 ? "item" : "items"}
                      </p>
                    </td>

                    <td className="px-5 py-4 align-top">
                      <p className="font-semibold text-gray-900">
                        {order.customerName}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {order.customerEmail}
                      </p>
                      {order.customerPhone && (
                        <p className="mt-1 text-xs text-gray-500">
                          {order.customerPhone}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        {[order.shippingCity, order.shippingState]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </td>

                    <td className="px-5 py-4 align-top">
                      <p className="font-medium text-gray-800">
                        {order.website.name}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {order.website.slug}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 align-top text-gray-600">
                      {formatDate(order.createdAt)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-right align-top font-semibold text-gray-950">
                      {formatMoney(order.totalAmount, order.currency)}
                    </td>

                    <td className="px-5 py-4 align-top">
                      <StatusBadge status={order.status} />
                    </td>

                    <td className="px-5 py-4 align-top">
                      <StatusBadge status={order.paymentStatus} />
                      {order.providerPaymentId && (
                        <p
                          className="mt-1 max-w-36 truncate text-xs text-gray-500"
                          title={order.providerPaymentId}
                        >
                          Payment ID: {order.providerPaymentId}
                        </p>
                      )}
                    </td>
                  </tr>
                ))}

                {loading &&
                  orders.length === 0 &&
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={`loading-${index}`}>
                      {Array.from({ length: 7 }).map((__, cellIndex) => (
                        <td key={cellIndex} className="px-5 py-5">
                          <div className="h-4 animate-pulse rounded bg-gray-100" />
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <footer className="flex flex-col gap-3 border-t border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="text-sm text-gray-500">
              {loading
                ? "Updating results…"
                : pagination.total === 0
                  ? "No records to display"
                  : `Showing ${firstRecord}–${lastRecord} of ${pagination.total} orders`}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => changePage(pagination.page - 1)}
                disabled={loading || pagination.page <= 1}
                className="min-h-10 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <span className="min-w-20 text-center text-sm font-medium text-gray-700">
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <button
                type="button"
                onClick={() => changePage(pagination.page + 1)}
                disabled={
                  loading || pagination.page >= pagination.totalPages
                }
                className="min-h-10 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </footer>
        </section>

        <p className="text-xs leading-5 text-gray-500">
          This screen is read-only. Order status, payment status, cancellation,
          refunds, and shipment operations will be handled by their respective
          workflows in later implementation steps.
        </p>
      </div>
    </main>
  );
}
