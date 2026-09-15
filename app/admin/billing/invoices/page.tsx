/**
 * Author: Prem Singh
 * Purpose: Admin GST invoice management page for reviewing, downloading, and marking invoices as sent.
 */

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type InvoiceStatus = "PENDING" | "GENERATED" | "SENT" | "FAILED";

interface BillingInvoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  customerName: string;
  customerEmail: string;
  customerMobile: string;
  customerGstin?: string | null;
  currency: string;
  taxType: "NONE" | "CGST_SGST" | "IGST";
  taxableAmount: string | number;
  totalTaxAmount: string | number;
  totalAmount: string | number;
  status: InvoiceStatus;
  sentAt?: string | null;
  tenant?: {
    id: string;
    name: string;
  } | null;
  payment?: {
    providerPaymentId?: string | null;
    paidAt?: string | null;
  } | null;
}

const STATUS_OPTIONS: Array<{
  value: "" | InvoiceStatus;
  label: string;
}> = [
  { value: "", label: "All Statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "GENERATED", label: "Generated" },
  { value: "SENT", label: "Sent" },
  { value: "FAILED", label: "Failed" },
];

function formatMoney(value: string | number, currency: string) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return `${currency} 0.00`;
  }

  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

function formatDate(value?: string | null) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function statusClasses(status: InvoiceStatus) {
  switch (status) {
    case "SENT":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "GENERATED":
      return "bg-blue-50 text-blue-700 ring-blue-200";
    case "FAILED":
      return "bg-red-50 text-red-700 ring-red-200";
    case "PENDING":
    default:
      return "bg-amber-50 text-amber-700 ring-amber-200";
  }
}

export default function AdminBillingInvoicesPage() {
  const [invoices, setInvoices] = useState<BillingInvoice[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"" | InvoiceStatus>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");
  const [markingId, setMarkingId] = useState<string | null>(null);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    if (status) {
      params.set("status", status);
    }

    if (search.trim()) {
      params.set("search", search.trim());
    }

    const query = params.toString();
    return query ? `?${query}` : "";
  }, [search, status]);

  const loadInvoices = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/billing/invoices${queryString}`,
        {
          method: "GET",
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Failed to load billing invoices.",
        );
      }

      setInvoices(data.invoices ?? []);
    } catch (err) {
      setInvoices([]);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load billing invoices.",
      );
    } finally {
      setLoading(false);
    }
  }, [queryString]);

  useEffect(() => {
    void loadInvoices();
  }, [loadInvoices]);

  async function handleDownload(invoice: BillingInvoice) {
    setActionError("");
    setActionSuccess("");

    try {
      const response = await fetch(
        `/api/admin/billing/invoices/${invoice.id}/pdf`,
        {
          method: "GET",
          cache: "no-store",
        },
      );

      if (!response.ok) {
        let message = "Failed to generate invoice PDF.";

        try {
          const data = await response.json();
          message = data.error || message;
        } catch {
          // Preserve the generic message when the response is not JSON.
        }

        throw new Error(message);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");

      anchor.href = url;
      anchor.download = `${invoice.invoiceNumber}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      window.URL.revokeObjectURL(url);

      setActionSuccess(
        `${invoice.invoiceNumber} PDF downloaded successfully.`,
      );
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : "Failed to download invoice PDF.",
      );
    }
  }

  async function handleMarkSent(invoice: BillingInvoice) {
    if (invoice.status === "SENT") {
      return;
    }

    const confirmed = window.confirm(
      `Confirm that invoice ${invoice.invoiceNumber} has been manually sent to ${invoice.customerEmail}?`,
    );

    if (!confirmed) {
      return;
    }

    setMarkingId(invoice.id);
    setActionError("");
    setActionSuccess("");

    try {
      const response = await fetch(
        `/api/admin/billing/invoices/${invoice.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "mark_sent",
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Failed to mark invoice as sent.",
        );
      }

      setActionSuccess(
        `${invoice.invoiceNumber} has been marked as sent.`,
      );

      await loadInvoices();
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : "Failed to mark invoice as sent.",
      );
    } finally {
      setMarkingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">
            GST Invoices
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Review customer invoices, download PDF copies, and record
            when an invoice has been manually sent.
          </p>
        </div>

        <section className="mb-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex-1">
              <label
                htmlFor="invoice-search"
                className="sr-only"
              >
                Search invoices
              </label>
              <input
                id="invoice-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search invoice number, customer, or email..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div className="w-full lg:w-48">
              <label
                htmlFor="invoice-status"
                className="sr-only"
              >
                Filter by status
              </label>
              <select
                id="invoice-status"
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as "" | InvoiceStatus)
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => void loadInvoices()}
              disabled={loading}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </section>

        {error ? (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {actionError ? (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {actionError}
          </div>
        ) : null}

        {actionSuccess ? (
          <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {actionSuccess}
          </div>
        ) : null}

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-[1200px] w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">Invoice</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Tax</th>
                  <th className="px-4 py-3 text-right">Tax Amount</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Sent At</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-4 py-12 text-center text-sm text-slate-500"
                    >
                      Loading invoices...
                    </td>
                  </tr>
                ) : invoices.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-4 py-12 text-center text-sm text-slate-500"
                    >
                      No billing invoices found.
                    </td>
                  </tr>
                ) : (
                  invoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="align-top hover:bg-slate-50/70"
                    >
                      <td className="px-4 py-4">
                        <div className="font-medium text-slate-900">
                          {invoice.invoiceNumber}
                        </div>
                        {invoice.payment?.providerPaymentId ? (
                          <div className="mt-1 max-w-48 truncate text-xs text-slate-400">
                            Payment: {invoice.payment.providerPaymentId}
                          </div>
                        ) : null}
                      </td>

                      <td className="px-4 py-4">
                        <div className="font-medium text-slate-900">
                          {invoice.customerName}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {invoice.customerEmail}
                        </div>
                        {invoice.tenant?.name ? (
                          <div className="mt-1 text-xs text-slate-400">
                            {invoice.tenant.name}
                          </div>
                        ) : null}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                        {formatDate(invoice.invoiceDate)}
                      </td>

                      <td className="px-4 py-4">
                        <span className="text-sm font-medium text-slate-700">
                          {invoice.taxType === "CGST_SGST"
                            ? "CGST + SGST"
                            : invoice.taxType === "IGST"
                              ? "IGST"
                              : "No GST"}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-right text-sm text-slate-700">
                        {formatMoney(
                          invoice.totalTaxAmount,
                          invoice.currency,
                        )}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-semibold text-slate-900">
                        {formatMoney(
                          invoice.totalAmount,
                          invoice.currency,
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusClasses(invoice.status)}`}
                        >
                          {invoice.status}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                        {formatDate(invoice.sentAt)}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => void handleDownload(invoice)}
                            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                          >
                            Download PDF
                          </button>

                          {invoice.status !== "SENT" ? (
                            <button
                              type="button"
                              onClick={() => void handleMarkSent(invoice)}
                              disabled={markingId === invoice.id}
                              className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {markingId === invoice.id
                                ? "Saving..."
                                : "Mark as Sent"}
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
