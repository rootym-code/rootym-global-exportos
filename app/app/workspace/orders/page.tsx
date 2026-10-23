"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ClipboardList,
  CreditCard,
  MapPin,
  Package,
  RefreshCw,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";

type OrderItem = {
  id: string;
  productName: string;
  productSku: string | null;
  unit: string;
  quantity: string | number;
  unitPrice: string | number;
  lineTotal: string | number;
};

type WorkspaceOrder = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  currency: string;
  totalAmount: string | number;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  shippingCity: string;
  shippingState: string | null;
  createdAt: string;
  items: OrderItem[];
};

type WorkspaceOrderDetail = WorkspaceOrder & {
  subtotal: string | number;
  shippingAmount: string | number;
  discountAmount: string | number;
  taxAmount: string | number;
  shippingRuleName: string | null;
  taxType: string;
  taxableAmount: string | number;
  cgstRate: string | number;
  cgstAmount: string | number;
  sgstRate: string | number;
  sgstAmount: string | number;
  igstRate: string | number;
  igstAmount: string | number;
  shippingAddress1: string;
  shippingAddress2: string | null;
  shippingPostalCode: string;
  shippingCountry: string;
  provider: string;
  providerOrderId: string | null;
  providerPaymentId: string | null;
  providerOrderCreationStatus: string;
  paidAt: string | null;
  paymentFailureReason: string | null;
  updatedAt: string;
};

type Pagination = {
  page: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
};

type OrdersResponse = {
  success: boolean;
  orders?: WorkspaceOrder[];
  pagination?: Pagination;
  error?: string;
};

type DetailResponse = {
  success: boolean;
  order?: WorkspaceOrderDetail;
  message?: string;
  error?: string;
};

const ORDER_STATUSES = [
  "ALL", "PENDING_PAYMENT", "CONFIRMED", "PROCESSING",
  "SHIPPED", "DELIVERED", "CANCELLED", "FAILED",
];
const PAYMENT_STATUSES = [
  "ALL", "CREATED", "PENDING", "PAID", "FAILED", "REFUNDED",
];

function humanizeStatus(value: string) {
  return value.toLowerCase().split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function statusClass(value: string) {
  if (["PAID", "CONFIRMED", "DELIVERED"].includes(value))
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (["FAILED", "CANCELLED"].includes(value))
    return "bg-red-50 text-red-700 ring-red-200";
  if (["CREATED", "PENDING", "PENDING_PAYMENT"].includes(value))
    return "bg-amber-50 text-amber-700 ring-amber-200";
  if (["PROCESSING", "SHIPPED"].includes(value))
    return "bg-blue-50 text-blue-700 ring-blue-200";
  if (value === "REFUNDED")
    return "bg-purple-50 text-purple-700 ring-purple-200";
  return "bg-slate-100 text-slate-700 ring-slate-200";
}

function formatMoney(amount: string | number, currency: string) {
  const value = Number(amount);
  if (!Number.isFinite(value)) return `${currency} ${amount}`;
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency", currency, maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  }).format(date);
}

function DetailLine({ label, value }: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-100 py-2 last:border-0 sm:flex-row sm:justify-between sm:gap-4">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="break-words text-sm font-medium text-slate-800 sm:max-w-[65%] sm:text-right">
        {value === null || value === undefined || value === "" ? "—" : value}
      </span>
    </div>
  );
}

export default function WorkspaceOrdersPage() {
  const [orders, setOrders] = useState<WorkspaceOrder[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [paymentStatus, setPaymentStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1, pageSize: 25, totalRecords: 0, totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<WorkspaceOrderDetail | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 300);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const loadOrders = useCallback(async (signal: AbortSignal) => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams({
      search, status, paymentStatus, page: String(page), pageSize: "25",
    });
    try {
      const response = await fetch(`/api/workspace/orders?${params.toString()}`, {
        method: "GET", credentials: "same-origin", cache: "no-store", signal,
      });
      const data = await response.json() as OrdersResponse;
      if (!response.ok || !data.success) {
        throw new Error(
          response.status === 401
            ? "Your workspace session has expired. Please sign in again."
            : response.status === 403
              ? "You do not have permission to view these orders."
              : data.error || "Unable to load orders.",
        );
      }
      setOrders(data.orders ?? []);
      setPagination(data.pagination ?? {
        page, pageSize: 25, totalRecords: 0, totalPages: 1,
      });
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setOrders([]);
      setError(err instanceof Error ? err.message : "Unable to load orders.");
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }, [search, status, paymentStatus, page]);

  useEffect(() => {
    const controller = new AbortController();
    void loadOrders(controller.signal);
    return () => controller.abort();
  }, [loadOrders]);

  async function openOrderDetails(orderId: string) {
    setSelectedOrder(null);
    setDetailsError("");
    setDetailsLoading(true);
    try {
      const response = await fetch(
        `/api/workspace/orders/${encodeURIComponent(orderId)}`,
        { method: "GET", credentials: "same-origin", cache: "no-store" },
      );
      const data = await response.json() as DetailResponse;
      if (!response.ok || !data.success || !data.order) {
        throw new Error(
          response.status === 401
            ? "Your workspace session has expired. Please sign in again."
            : data.message || data.error || "Unable to load order details.",
        );
      }
      setSelectedOrder(data.order);
    } catch (err) {
      setDetailsError(err instanceof Error ? err.message : "Unable to load order details.");
    } finally {
      setDetailsLoading(false);
    }
  }

  function closeOrderDetails() {
    setSelectedOrder(null);
    setDetailsError("");
    setDetailsLoading(false);
  }

  function clearFilters() {
    setSearchInput("");
    setSearch("");
    setStatus("ALL");
    setPaymentStatus("ALL");
    setPage(1);
  }

  const firstRecord = pagination.totalRecords === 0
    ? 0 : (pagination.page - 1) * pagination.pageSize + 1;
  const lastRecord = Math.min(pagination.page * pagination.pageSize, pagination.totalRecords);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
              <ShoppingBag className="h-4 w-4" /> BUSINESS
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Orders</h1>
            <p className="mt-2 text-sm text-slate-500">
              Review customer orders and monitor payment progress for your authorized workspace.
            </p>
          </div>
          <button type="button" onClick={clearFilters}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
            <RefreshCw className="h-4 w-4" /> Clear filters
          </button>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Matching orders</p>
            <p className="mt-2 text-2xl font-bold">{loading ? "—" : pagination.totalRecords.toLocaleString("en-IN")}</p>
            <p className="mt-1 text-xs text-slate-400">Based on the current filters</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Current page</p>
            <p className="mt-2 text-2xl font-bold">{pagination.page}
              <span className="text-base font-medium text-slate-400"> / {pagination.totalPages}</span>
            </p>
            <p className="mt-1 text-xs text-slate-400">25 orders per page</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Displayed records</p>
            <p className="mt-2 text-2xl font-bold">{loading ? "—" : `${firstRecord}–${lastRecord}`}</p>
            <p className="mt-1 text-xs text-slate-400">Of {pagination.totalRecords.toLocaleString("en-IN")} matching orders</p>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div>
              <label htmlFor="workspace-order-search" className="mb-2 block text-sm font-semibold">Search orders</label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input id="workspace-order-search" type="search" value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Order number, customer, email..."
                  className="min-h-11 w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100" />
              </div>
            </div>
            <div>
              <label htmlFor="workspace-order-status" className="mb-2 block text-sm font-semibold">Order status</label>
              <select id="workspace-order-status" value={status}
                onChange={(event) => { setStatus(event.target.value); setPage(1); }}
                className="min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100">
                {ORDER_STATUSES.map((value) => <option key={value} value={value}>
                  {value === "ALL" ? "All order statuses" : humanizeStatus(value)}
                </option>)}
              </select>
            </div>
            <div>
              <label htmlFor="workspace-payment-status" className="mb-2 block text-sm font-semibold">Payment status</label>
              <select id="workspace-payment-status" value={paymentStatus}
                onChange={(event) => { setPaymentStatus(event.target.value); setPage(1); }}
                className="min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100">
                {PAYMENT_STATUSES.map((value) => <option key={value} value={value}>
                  {value === "ALL" ? "All payment statuses" : humanizeStatus(value)}
                </option>)}
              </select>
            </div>
          </div>
        </section>

        {error && <section role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="font-semibold text-amber-900">Orders could not be loaded</p>
          <p className="mt-1 text-sm text-amber-800">{error}</p>
          <p className="mt-2 text-xs text-amber-800">This page uses the workspace-authorized API, not the Superadmin orders endpoint.</p>
          <button type="button" onClick={() => { const controller = new AbortController(); void loadOrders(controller.signal); }}
            className="mt-3 rounded-lg border border-amber-300 bg-white px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100">Retry</button>
        </section>}

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-4 py-4 sm:px-5">
            <div className="flex items-center gap-2"><ClipboardList className="h-5 w-5 text-slate-500" /><h2 className="font-bold">All orders</h2></div>
            <p className="mt-1 text-xs text-slate-500">Most recent orders appear first. Select an order to view full details.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[1000px] w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Order</th><th className="px-5 py-3 font-semibold">Customer</th>
                  <th className="px-5 py-3 font-semibold">Date</th><th className="px-5 py-3 text-right font-semibold">Total</th>
                  <th className="px-5 py-3 font-semibold">Order status</th><th className="px-5 py-3 font-semibold">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {!loading && !error && orders.length === 0 && <tr><td colSpan={6} className="px-5 py-14 text-center">
                  <ShoppingBag className="mx-auto h-8 w-8 text-slate-300" /><p className="mt-3 font-semibold text-slate-800">No orders found</p>
                  <p className="mt-1 text-sm text-slate-500">Try another search or clear the filters.</p>
                </td></tr>}
                {orders.map((order) => <tr key={order.id} className="transition hover:bg-slate-50">
                  <td className="px-5 py-4 align-top">
                    <p className="font-bold text-slate-950">{order.orderNumber}</p>
                    <p className="mt-1 text-xs text-slate-500">{order.items.length} {order.items.length === 1 ? "item" : "items"}</p>
                    <button type="button" onClick={() => void openOrderDetails(order.id)}
                      className="mt-2 inline-flex min-h-8 items-center rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-100">View details</button>
                  </td>
                  <td className="px-5 py-4 align-top">
                    <p className="font-semibold text-slate-800">{order.customerName}</p>
                    <p className="mt-1 text-xs text-slate-500">{order.customerEmail}</p>
                    {order.customerPhone && <p className="mt-1 text-xs text-slate-500">{order.customerPhone}</p>}
                    <p className="mt-1 text-xs text-slate-500">{[order.shippingCity, order.shippingState].filter(Boolean).join(", ")}</p>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 align-top text-slate-600">{formatDate(order.createdAt)}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-right align-top font-semibold">{formatMoney(order.totalAmount, order.currency)}</td>
                  <td className="px-5 py-4 align-top"><span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusClass(order.status)}`}>{humanizeStatus(order.status)}</span></td>
                  <td className="px-5 py-4 align-top"><span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusClass(order.paymentStatus)}`}>{humanizeStatus(order.paymentStatus)}</span></td>
                </tr>)}
                {loading && orders.length === 0 && Array.from({ length: 4 }).map((_, index) => <tr key={`loading-${index}`}>
                  {Array.from({ length: 6 }).map((__, cell) => <td key={cell} className="px-5 py-5"><div className="h-4 animate-pulse rounded bg-slate-100" /></td>)}
                </tr>)}
              </tbody>
            </table>
          </div>
          <footer className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="text-sm text-slate-500">{loading ? "Loading orders…" : pagination.totalRecords === 0 ? "No records to display" : `Showing ${firstRecord}–${lastRecord} of ${pagination.totalRecords} orders`}</p>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={loading || page <= 1}
                className="min-h-10 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
              <span className="min-w-20 text-center text-sm text-slate-600">Page {pagination.page} of {pagination.totalPages}</span>
              <button type="button" onClick={() => setPage((value) => Math.min(pagination.totalPages, value + 1))} disabled={loading || page >= pagination.totalPages}
                className="min-h-10 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40">Next</button>
            </div>
          </footer>
        </section>
        <p className="text-xs leading-5 text-slate-500">This page is read-only. Order updates, payment reconciliation, cancellation, refunds and shipment management will be implemented through their respective authorized workflows.</p>
      </div>

      {(detailsLoading || detailsError || selectedOrder) && <div
        className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
        onMouseDown={(event) => { if (event.target === event.currentTarget) closeOrderDetails(); }}>
        <section role="dialog" aria-modal="true" aria-labelledby="workspace-order-detail-title"
          className="max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
          <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6">
            <div><p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Customer workspace</p>
              <h2 id="workspace-order-detail-title" className="mt-1 text-xl font-bold text-slate-950">{selectedOrder ? `Order ${selectedOrder.orderNumber}` : "Order details"}</h2>
              <p className="mt-1 text-sm text-slate-500">Customer, delivery, product and payment information</p>
            </div>
            <button type="button" onClick={closeOrderDetails} aria-label="Close order details"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"><X className="h-5 w-5" /></button>
          </header>
          <div className="max-h-[calc(92vh-84px)] overflow-y-auto px-5 py-5 sm:px-6">
            {detailsLoading && <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
              <p className="mt-4 font-semibold text-slate-800">Loading order details…</p><p className="mt-1 text-sm text-slate-500">Please wait a moment.</p>
            </div>}
            {!detailsLoading && detailsError && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="font-semibold text-red-900">Could not load order details</p><p className="mt-1 text-sm text-red-800">{detailsError}</p>
              <button type="button" onClick={closeOrderDetails} className="mt-3 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-800 hover:bg-red-100">Close</button>
            </div>}
            {!detailsLoading && !detailsError && selectedOrder && <div className="space-y-6">
              <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div><p className="text-xs text-slate-500">Order placed</p><p className="mt-1 font-semibold text-slate-900">{formatDate(selectedOrder.createdAt)}</p></div>
                <div className="flex flex-wrap gap-2">
                  <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${statusClass(selectedOrder.status)}`}>Order: {humanizeStatus(selectedOrder.status)}</span>
                  <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${statusClass(selectedOrder.paymentStatus)}`}>Payment: {humanizeStatus(selectedOrder.paymentStatus)}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <section className="rounded-xl border border-slate-200 p-4"><div className="mb-2 flex items-center gap-2"><UserRound className="h-5 w-5 text-slate-500" /><h3 className="font-bold">Customer information</h3></div>
                  <DetailLine label="Name" value={selectedOrder.customerName} /><DetailLine label="Email" value={selectedOrder.customerEmail} /><DetailLine label="Phone" value={selectedOrder.customerPhone} />
                </section>
                <section className="rounded-xl border border-slate-200 p-4"><div className="mb-2 flex items-center gap-2"><MapPin className="h-5 w-5 text-slate-500" /><h3 className="font-bold">Delivery address</h3></div>
                  <p className="text-sm leading-6 text-slate-700">{selectedOrder.shippingAddress1}{selectedOrder.shippingAddress2 ? `, ${selectedOrder.shippingAddress2}` : ""}<br />{selectedOrder.shippingCity}{selectedOrder.shippingState ? `, ${selectedOrder.shippingState}` : ""}{selectedOrder.shippingPostalCode ? ` - ${selectedOrder.shippingPostalCode}` : ""}<br />{selectedOrder.shippingCountry}</p>
                </section>
              </div>
              <section className="overflow-hidden rounded-xl border border-slate-200"><div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3"><Package className="h-5 w-5 text-slate-500" /><h3 className="font-bold">Ordered products</h3></div>
                <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3 font-semibold">Product</th><th className="px-4 py-3 font-semibold">SKU</th><th className="px-4 py-3 text-right font-semibold">Qty</th><th className="px-4 py-3 text-right font-semibold">Unit price</th><th className="px-4 py-3 text-right font-semibold">Line total</th></tr></thead>
                  <tbody className="divide-y divide-slate-100">{selectedOrder.items.map((item) => <tr key={item.id}>
                    <td className="px-4 py-3 font-medium text-slate-800">{item.productName}</td><td className="px-4 py-3 text-slate-500">{item.productSku || "—"}</td>
                    <td className="px-4 py-3 text-right text-slate-700">{item.quantity} {item.unit}</td><td className="whitespace-nowrap px-4 py-3 text-right text-slate-700">{formatMoney(item.unitPrice, selectedOrder.currency)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-slate-900">{formatMoney(item.lineTotal, selectedOrder.currency)}</td>
                  </tr>)}</tbody>
                </table></div>
              </section>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <section className="rounded-xl border border-slate-200 p-4"><h3 className="mb-2 font-bold">Order amount breakdown</h3>
                  <DetailLine label="Subtotal" value={formatMoney(selectedOrder.subtotal, selectedOrder.currency)} />
                  <DetailLine label="Shipping" value={formatMoney(selectedOrder.shippingAmount, selectedOrder.currency)} />
                  <DetailLine label="Discount" value={formatMoney(selectedOrder.discountAmount, selectedOrder.currency)} />
                  <DetailLine label="Taxable amount" value={formatMoney(selectedOrder.taxableAmount, selectedOrder.currency)} />
                  <DetailLine label="Tax type" value={selectedOrder.taxType} />
                  <DetailLine label={`CGST (${selectedOrder.cgstRate}%)`} value={formatMoney(selectedOrder.cgstAmount, selectedOrder.currency)} />
                  <DetailLine label={`SGST (${selectedOrder.sgstRate}%)`} value={formatMoney(selectedOrder.sgstAmount, selectedOrder.currency)} />
                  <DetailLine label={`IGST (${selectedOrder.igstRate}%)`} value={formatMoney(selectedOrder.igstAmount, selectedOrder.currency)} />
                  <div className="mt-2 border-t border-slate-200 pt-3"><DetailLine label="Total amount" value={formatMoney(selectedOrder.totalAmount, selectedOrder.currency)} /></div>
                </section>
                <section className="rounded-xl border border-slate-200 p-4"><div className="mb-2 flex items-center gap-2"><CreditCard className="h-5 w-5 text-slate-500" /><h3 className="font-bold">Payment information</h3></div>
                  <DetailLine label="Payment provider" value={selectedOrder.provider} />
                  <DetailLine label="Payment setup status" value={humanizeStatus(selectedOrder.providerOrderCreationStatus)} />
                  <DetailLine label="Provider order reference" value={selectedOrder.providerOrderId} />
                  <DetailLine label="Provider payment reference" value={selectedOrder.providerPaymentId} />
                  <DetailLine label="Paid at" value={formatDate(selectedOrder.paidAt)} />
                  <DetailLine label="Shipping rule" value={selectedOrder.shippingRuleName} />
                  <DetailLine label="Last updated" value={formatDate(selectedOrder.updatedAt)} />
                  {selectedOrder.paymentFailureReason && <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3"><p className="text-xs font-semibold uppercase tracking-wide text-red-700">Payment failure reason</p><p className="mt-1 break-words text-sm text-red-800">{selectedOrder.paymentFailureReason}</p></div>}
                </section>
              </div>
            </div>}
          </div>
        </section>
      </div>}
    </div>
  );
}
