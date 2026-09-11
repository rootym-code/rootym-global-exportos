/**
 * ============================================================
 * ROOTYM Global ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Customer Workspace Inquiry detail baseline with a
 *          structured, sectioned UX and sticky quick navigation.
 *          Uses Workspace APIs only and reserves commercial,
 *          communication and intelligence areas for their
 *          Workspace-safe adapters.
 * ============================================================
 */

"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  FileText,
  Flag,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  Save,
  Sparkles,
  StickyNote,
  UserRound,
} from "lucide-react";

import {
  InquiryPriority,
  InquiryStatus,
  SalesStage,
} from "@/lib/generated/prisma";

import CreateFollowUpModal from "@/app/app/workspace/followups/components/CreateFollowUpModal";

interface LinkedProduct {
  id: string;
  name: string;
  sku: string;
}

interface Note {
  id: string;
  note: string;
  createdAt: string;
  createdBy?: {
    name?: string | null;
  } | null;
  admin?: {
    name?: string | null;
  } | null;
}

interface StatusHistoryItem {
  id: string;
  oldStatus: InquiryStatus | null;
  newStatus: InquiryStatus;
  createdAt: string;
  admin?: {
    name?: string | null;
  } | null;
}

interface ProformaInvoiceSummary {
  id: string;
  piNumber?: string | null;
  status?: string | null;
  issueDate?: string | null;
  paymentDueDate?: string | null;
  total?: number | null;
  currency?: string | null;
}

interface QuoteItem {
  id?: string;
  quoteNumber?: string;
  status?: string;
  total?: number;
  grandTotal?: number;
  currency?: string;
  createdAt?: string;
  updatedAt?: string;
  proformaInvoice?: ProformaInvoiceSummary | null;
}

interface FollowUpSummary {
  id: string;
  title: string;
  description?: string | null;
  actionType?: string | null;
  category?: string | null;
  priority?: string | null;
  status?: string | null;
  scheduledAt?: string | null;
  dueAt?: string | null;
  notes?: string | null;
}

interface Inquiry {
  id: string;
  inquiryNumber: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string | null;
  country: string;
  product: string;
  quantity: number | null;
  unit: string | null;
  message: string;
  status: InquiryStatus;
  priority: InquiryPriority;
  source: string | null;
  salesStage: SalesStage | null;
  createdAt: string;
  updatedAt: string;
  linkedProduct?: LinkedProduct | null;
  notes?: Note[];
  statusHistory?: StatusHistoryItem[];
  followUps?: FollowUpSummary[];
  quotes?: QuoteItem[];
  whatsappMessages?: unknown[];
}

interface ApiResponse {
  success: boolean;
  inquiry: Inquiry;
}

const QUICK_NAV = [
  { id: "overview", label: "Overview" },
  { id: "sales", label: "Sales" },
  { id: "commercial", label: "Commercial" },
  { id: "communication", label: "Communication" },
  { id: "customer", label: "Customer" },
  { id: "workflow", label: "Workflow" },
  { id: "followups", label: "FollowUps" },
  { id: "notes", label: "Notes" },
  { id: "activity", label: "Activity" },
] as const;

const SECTION_LABELS: Record<string, string> = {
  overview: "Overview",
  sales: "Sales",
  commercial: "Commercial",
  communication: "Communication",
  customer: "Customer",
  workflow: "Workflow",
  notes: "Notes",
  activity: "Activity",
};

function formatLabel(value: string | null | undefined) {
  if (!value) {
    return "—";
  }

  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value: string | null | undefined) {
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

function formatDateTime(value: string | null | undefined) {
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
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function statusClasses(status: InquiryStatus) {
  switch (status) {
    case InquiryStatus.NEW:
      return "border-blue-200 bg-blue-50 text-blue-700";
    case InquiryStatus.CONTACTED:
      return "border-cyan-200 bg-cyan-50 text-cyan-700";
    case InquiryStatus.QUOTATION_SENT:
      return "border-purple-200 bg-purple-50 text-purple-700";
    case InquiryStatus.NEGOTIATION:
      return "border-orange-200 bg-orange-50 text-orange-700";
    case InquiryStatus.CONFIRMED:
      return "border-green-200 bg-green-50 text-green-700";
    case InquiryStatus.REJECTED:
      return "border-red-200 bg-red-50 text-red-700";
    default:
      return "border-gray-200 bg-gray-50 text-gray-700";
  }
}

function priorityClasses(priority: InquiryPriority) {
  switch (priority) {
    case InquiryPriority.URGENT:
      return "border-red-200 bg-red-50 text-red-700";
    case InquiryPriority.HIGH:
      return "border-orange-200 bg-orange-50 text-orange-700";
    case InquiryPriority.MEDIUM:
      return "border-amber-200 bg-amber-50 text-amber-700";
    case InquiryPriority.LOW:
      return "border-gray-200 bg-gray-50 text-gray-600";
    default:
      return "border-gray-200 bg-gray-50 text-gray-700";
  }
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-xl border bg-white shadow-sm ${className}`}
    >
      {children}
    </section>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
  icon,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="border-b px-5 py-4 sm:px-6">
      <div className="flex items-start gap-3">
        {icon && (
          <div className="mt-0.5 rounded-lg bg-gray-50 p-2 text-gray-600">
            {icon}
          </div>
        )}

        <div>
          {eyebrow && (
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              {eyebrow}
            </p>
          )}

          <h2 className="mt-0.5 text-lg font-semibold text-gray-900">
            {title}
          </h2>

          {description && (
            <p className="mt-1 text-sm text-gray-500">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-400">
        {icon}
        {label}
      </div>

      <div className="mt-1.5 break-words text-sm font-medium text-gray-900">
        {value || "—"}
      </div>
    </div>
  );
}

export default function WorkspaceInquiryDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const inquiryId = params.id;

  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [status, setStatus] = useState<InquiryStatus>(
    InquiryStatus.NEW,
  );
  const [priority, setPriority] = useState<InquiryPriority>(
    InquiryPriority.MEDIUM,
  );
  const [salesStage, setSalesStage] = useState<SalesStage>(
    SalesStage.NEW,
  );

  const [activeSection, setActiveSection] =
    useState("overview");

  const [note, setNote] = useState("");

  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [followUpModalOpen, setFollowUpModalOpen] =
    useState(false);
  const [quoteSaving, setQuoteSaving] = useState(false);
  const [approvingQuoteId, setApprovingQuoteId] = useState<string | null>(
    null,
  );
  const [proformaSaving, setProformaSaving] = useState(false);
  const [createdProformaInvoices, setCreatedProformaInvoices] = useState<
    Record<string, ProformaInvoiceSummary>
  >({});
  const createdProformaInvoicesRef = useRef<
    Record<string, ProformaInvoiceSummary>
  >({});
  const [quoteForm, setQuoteForm] = useState({
    buyerGstin: "",
    buyerAddress: "",
    currency: "USD",
    quantity: "",
    unit: "kg",
    unitPrice: "",
    discount: "0",
    freight: "0",
    insurance: "0",
    tax: "0",
    validityDays: "15",
    notes: "",
  });

  useEffect(() => {
    if (!inquiryId) {
      return;
    }

    loadInquiry();
  }, [inquiryId]);

  useEffect(() => {
    if (!inquiry) {
      return;
    }

    const sections = QUICK_NAV.map((item) =>
      document.getElementById(item.id),
    ).filter(Boolean) as HTMLElement[];

    if (sections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top -
              b.boundingClientRect.top,
          );

        if (visible[0]?.target.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: "-120px 0px -65% 0px",
        threshold: 0,
      },
    );

    sections.forEach((section) =>
      observer.observe(section),
    );

    return () => observer.disconnect();
  }, [inquiry]);

  async function loadInquiry() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/workspace/inquiries/${inquiryId}`,
        {
          method: "GET",
          cache: "no-store",
        },
      );

      const result: ApiResponse & {
        error?: string;
        message?: string;
      } = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            result.message ||
            "Unable to load inquiry.",
        );
      }

      if (!result.inquiry) {
        throw new Error("Inquiry data was not returned.");
      }

      setInquiry(result.inquiry);
      setQuoteForm((current) => ({
        ...current,
        quantity:
          result.inquiry.quantity !== null
            ? String(result.inquiry.quantity)
            : current.quantity,
        unit: result.inquiry.unit || current.unit,
      }));
      setStatus(result.inquiry.status);
      setPriority(result.inquiry.priority);
      setSalesStage(
        result.inquiry.salesStage ?? SalesStage.NEW,
      );
    } catch (err) {
      console.error("Failed to load Workspace inquiry:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load inquiry.",
      );
    } finally {
      setLoading(false);
    }
  }

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setActiveSection(id);
  }

  async function saveWorkflow() {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `/api/workspace/inquiries/${inquiryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            priority,
            salesStage,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ||
            result?.message ||
            "Unable to update inquiry.",
        );
      }

      if (result?.inquiry) {
        setInquiry(result.inquiry);
        setStatus(result.inquiry.status);
        setPriority(result.inquiry.priority);
        setSalesStage(
          result.inquiry.salesStage ?? SalesStage.NEW,
        );
      } else {
        await loadInquiry();
      }

      setSuccess("Inquiry workflow updated successfully.");

      window.setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("Failed to update inquiry workflow:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update inquiry.",
      );
    } finally {
      setSaving(false);
    }
  }


  async function createQuotation() {
    if (!inquiry || quoteSaving) {
      return;
    }

    const productId = inquiry.linkedProduct?.id;

    if (!productId) {
      setError(
        "This inquiry is not linked to a Website Product. A quotation item must use a Website Product.",
      );
      return;
    }

    const quantity = Number(quoteForm.quantity);
    const unitPrice = Number(quoteForm.unitPrice);

    if (!Number.isFinite(quantity) || quantity <= 0) {
      setError("Enter a valid quotation quantity.");
      return;
    }

    if (!quoteForm.unit.trim()) {
      setError("Enter the quotation unit.");
      return;
    }

    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      setError("Enter a valid unit price.");
      return;
    }

    try {
      setQuoteSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `/api/workspace/inquiries/${inquiry.id}/quotes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            companyName: inquiry.companyName,
            contactPerson: inquiry.contactPerson,
            email: inquiry.email,
            phone: inquiry.phone || undefined,
            buyerGstin:
              quoteForm.buyerGstin.trim().toUpperCase() ||
              undefined,
            buyerAddress:
              quoteForm.buyerAddress.trim() ||
              undefined,
            country: inquiry.country,
            currency: quoteForm.currency.trim().toUpperCase(),
            items: [
              {
                productId,
                description: inquiry.product,
                quantity,
                unit: quoteForm.unit.trim(),
                unitPrice,
              },
            ],
            discount: Number(quoteForm.discount || 0),
            freight: Number(quoteForm.freight || 0),
            insurance: Number(quoteForm.insurance || 0),
            tax: Number(quoteForm.tax || 0),
            validityDays: Number(
              quoteForm.validityDays || 15,
            ),
            notes: quoteForm.notes.trim() || undefined,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok || result?.success === false) {
        throw new Error(
          result?.message ||
            "Unable to create quotation.",
        );
      }

      setQuoteModalOpen(false);
      setSuccess(
        `Quotation ${result.quote?.quoteNumber || ""} created successfully.`,
      );

      await loadInquiry();
    } catch (err) {
      console.error("Failed to create Workspace quotation:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to create quotation.",
      );
    } finally {
      setQuoteSaving(false);
    }
  }

  async function approveQuotation(quoteId: string) {
    if (approvingQuoteId) {
      return;
    }

    const confirmed = window.confirm(
      "Approve this quotation?\n\nOnce approved, it can be used to generate a Proforma Invoice.",
    );

    if (!confirmed) {
      return;
    }

    try {
      setApprovingQuoteId(quoteId);
      setError("");
      setSuccess("");

      const response = await fetch(
        `/api/workspace/quotes/${quoteId}/approve`,
        {
          method: "POST",
          cache: "no-store",
        },
      );

      const result = await response.json();

      if (!response.ok || result?.success === false) {
        throw new Error(
          result?.message ||
            "Unable to approve quotation.",
        );
      }

      setSuccess(
        result?.message ||
          "Quotation approved successfully.",
      );

      await loadInquiry();
    } catch (err) {
      console.error(
        "Failed to approve Workspace quotation:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to approve quotation.",
      );
    } finally {
      setApprovingQuoteId(null);
    }
  }

  async function downloadCommercialPdf(
    type: "quote" | "proforma",
    id: string,
    fallbackFilename: string,
  ) {
    try {
      setError("");
      setSuccess("");

      const endpoint =
        type === "quote"
          ? `/api/workspace/quotes/${id}/pdf`
          : `/api/workspace/proforma-invoices/${id}/pdf`;

      const response = await fetch(endpoint, {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        let message =
          "Unable to generate PDF.";

        try {
          const result =
            await response.json();

          message =
            result?.message || message;
        } catch {
          // PDF endpoint returned a non-JSON error.
        }

        throw new Error(message);
      }

      const blob =
        await response.blob();

      if (!blob.size) {
        throw new Error(
          "The generated PDF is empty.",
        );
      }

      let filename =
        fallbackFilename;

      const disposition =
        response.headers.get(
          "Content-Disposition",
        );

      const match =
        disposition?.match(
          /filename="?([^"]+)"?/i,
        );

      if (match?.[1]) {
        filename = match[1];
      }

      const url =
        window.URL.createObjectURL(blob);

      const anchor =
        document.createElement("a");

      anchor.href = url;
      anchor.download = filename;

      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      window.setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
    } catch (err) {
      console.error(
        "Failed to download commercial PDF:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to download PDF.",
      );
    }
  }

  async function createProformaInvoice(quoteId: string) {
    if (proformaSaving) {
      return;
    }

    const confirmed = window.confirm(
      "Create a Proforma Invoice from this approved quotation?\n\nThe quotation will remain unchanged.",
    );

    if (!confirmed) {
      return;
    }

    try {
      setProformaSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `/api/workspace/quotes/${quoteId}/proforma`,
        {
          method: "POST",
          cache: "no-store",
        },
      );

      const result = await response.json();

      if (!response.ok || result?.success === false) {
        throw new Error(
          result?.message ||
            "Unable to create Proforma Invoice.",
        );
      }

      const piNumber =
        result.proformaInvoice?.piNumber;

      setSuccess(
        piNumber
          ? `Proforma Invoice ${piNumber} created successfully.`
          : "Proforma Invoice created successfully.",
      );

      if (result.proformaInvoice?.id) {
        const createdProformaInvoice: ProformaInvoiceSummary = {
          id: result.proformaInvoice.id,
          piNumber: result.proformaInvoice.piNumber ?? null,
          status: result.proformaInvoice.status ?? null,
          issueDate: result.proformaInvoice.issueDate ?? null,
          paymentDueDate:
            result.proformaInvoice.paymentDueDate ?? null,
          total:
            typeof result.proformaInvoice.total === "number"
              ? result.proformaInvoice.total
              : typeof result.proformaInvoice.grandTotal === "number"
                ? result.proformaInvoice.grandTotal
                : null,
          currency: result.proformaInvoice.currency ?? null,
        };

        createdProformaInvoicesRef.current = {
          ...createdProformaInvoicesRef.current,
          [quoteId]: createdProformaInvoice,
        };

        setCreatedProformaInvoices(
          createdProformaInvoicesRef.current,
        );

        setInquiry((current) => {
          if (!current) {
            return current;
          }

          return {
            ...current,
            quotes: current.quotes?.map((quote) =>
              quote.id === quoteId
                ? {
                    ...quote,
                    proformaInvoice: createdProformaInvoice,
                  }
                : quote,
            ),
          };
        });
      }

      /*
       * Do not immediately reload the inquiry here. The shared inquiry
       * endpoint may return the quotation without its newly-created
       * Proforma Invoice relation. The creation response is authoritative
       * for this action, so merge it into the current UI state immediately.
       */
    } catch (err) {
      console.error(
        "Failed to create Workspace Proforma Invoice:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to create Proforma Invoice.",
      );
    } finally {
      setProformaSaving(false);
    }
  }

  const stages = useMemo(
    () => Object.values(SalesStage),
    [],
  );

  const statuses = useMemo(
    () => Object.values(InquiryStatus),
    [],
  );

  const priorities = useMemo(
    () => Object.values(InquiryPriority),
    [],
  );

  if (loading) {
    return (
      <div className="space-y-5">
        <Link
          href="/app/workspace/inquiries"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Inquiries
        </Link>

        <Card className="p-12 text-center text-sm text-gray-500">
          Loading inquiry...
        </Card>
      </div>
    );
  }

  if (!inquiry) {
    return (
      <div className="space-y-5">
        <Link
          href="/app/workspace/inquiries"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Inquiries
        </Link>

        <Card className="border-red-200 bg-red-50 p-6">
          <h1 className="font-semibold text-red-800">
            Inquiry unavailable
          </h1>

          <p className="mt-1 text-sm text-red-700">
            {error || "The requested inquiry could not be found."}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ======================================================
          HEADER
      ======================================================= */}
      <header
        id="overview"
        className="scroll-mt-24 rounded-xl border bg-white shadow-sm"
      >
        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0">
              <Link
                href="/app/workspace/inquiries"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Inquiries
              </Link>

              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  {inquiry.inquiryNumber}
                </h1>

                <span
                  className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClasses(
                    inquiry.status,
                  )}`}
                >
                  {formatLabel(inquiry.status)}
                </span>

                <span
                  className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${priorityClasses(
                    inquiry.priority,
                  )}`}
                >
                  {formatLabel(inquiry.priority)}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="h-4 w-4" />
                  {inquiry.companyName}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <UserRound className="h-4 w-4" />
                  {inquiry.contactPerson}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {inquiry.country}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setQuoteModalOpen(true);
                }}
                disabled={quoteSaving}
                className="inline-flex items-center justify-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                Create Quotation
              </button>

              {inquiry.quotes?.some(
                (quote) =>
                  quote.status === "APPROVED" &&
                  !(
                    quote.proformaInvoice?.id ||
                    (quote.id &&
                      createdProformaInvoices[quote.id]?.id)
                  ),
              ) ? (
                <button
                  type="button"
                  onClick={() => {
                    const approvedQuote =
                      inquiry.quotes?.find(
                        (quote) =>
                          quote.status === "APPROVED" &&
                          !(
                            quote.proformaInvoice?.id ||
                            (quote.id &&
                              createdProformaInvoices[quote.id]?.id)
                          ),
                      );

                    if (approvedQuote?.id) {
                      createProformaInvoice(
                        approvedQuote.id,
                      );
                    }
                  }}
                  disabled={proformaSaving}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FileText className="h-4 w-4" />
                  {proformaSaving
                    ? "Creating..."
                    : "Create Proforma Invoice"}
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  title="An approved quotation is required."
                  className="inline-flex items-center justify-center gap-2 rounded-lg border bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-400"
                >
                  Create Proforma Invoice
                </button>
              )}
            </div>
          </div>
        </div>

      </header>

        {/* Sticky quick navigation */}
        <nav className="sticky top-0 z-20 border-t bg-white/95 px-2 py-2 shadow-sm backdrop-blur sm:px-4">
          <div className="flex gap-1 overflow-x-auto">
            {QUICK_NAV.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  activeSection === item.id
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>


      {/* Alerts */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* ======================================================
          OVERVIEW
      ======================================================= */}
      <section id="overview-details" className="scroll-mt-24">
        <Card>
          <SectionHeader
            eyebrow="Overview"
            title="Buyer & Requirement"
            description="The key information needed to understand this inquiry at a glance."
            icon={<Building2 className="h-4 w-4" />}
          />

          <div className="grid gap-5 p-5 lg:grid-cols-2 sm:p-6">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Buyer
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                <InfoItem
                  label="Company"
                  value={inquiry.companyName}
                  icon={<Building2 className="h-3.5 w-3.5" />}
                />

                <InfoItem
                  label="Contact"
                  value={inquiry.contactPerson}
                  icon={<UserRound className="h-3.5 w-3.5" />}
                />

                <InfoItem
                  label="Email"
                  value={
                    inquiry.email ? (
                      <a
                        href={`mailto:${inquiry.email}`}
                        className="hover:underline"
                      >
                        {inquiry.email}
                      </a>
                    ) : (
                      "—"
                    )
                  }
                  icon={<Mail className="h-3.5 w-3.5" />}
                />

                <InfoItem
                  label="Phone / WhatsApp"
                  value={
                    inquiry.phone ? (
                      <a
                        href={`tel:${inquiry.phone}`}
                        className="hover:underline"
                      >
                        {inquiry.phone}
                      </a>
                    ) : (
                      "—"
                    )
                  }
                  icon={<Phone className="h-3.5 w-3.5" />}
                />

                <InfoItem
                  label="Country"
                  value={inquiry.country}
                  icon={<MapPin className="h-3.5 w-3.5" />}
                />

                <InfoItem
                  label="Source"
                  value={formatLabel(inquiry.source)}
                />
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Requirement
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                <InfoItem
                  label="Product"
                  value={
                    inquiry.linkedProduct ? (
                      <Link
                        href={`/app/workspace/products/${inquiry.linkedProduct.id}/edit`}
                        className="hover:underline"
                      >
                        {inquiry.linkedProduct.name}
                      </Link>
                    ) : (
                      inquiry.product
                    )
                  }
                />

                <InfoItem
                  label="Quantity"
                  value={
                    inquiry.quantity === null
                      ? "—"
                      : `${inquiry.quantity}${
                          inquiry.unit
                            ? ` ${inquiry.unit}`
                            : ""
                        }`
                  }
                />

                <InfoItem
                  label="Sales Stage"
                  value={formatLabel(inquiry.salesStage)}
                />

                <InfoItem
                  label="Received"
                  value={formatDate(inquiry.createdAt)}
                  icon={
                    <CalendarDays className="h-3.5 w-3.5" />
                  }
                />
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* ======================================================
          SALES
      ======================================================= */}
      <section id="sales" className="scroll-mt-24">
        <Card>
          <SectionHeader
            eyebrow="Sales"
            title="Sales Pipeline"
            description="Move the inquiry through the shared sales lifecycle."
            icon={<ChevronRight className="h-4 w-4" />}
          />

          <div className="p-5 sm:p-6">
            <div className="overflow-x-auto pb-2">
              <div className="flex min-w-max items-center gap-1">
                {stages.map((stage, index) => {
                  const isCurrent = salesStage === stage;
                  const currentIndex = stages.indexOf(
                    salesStage,
                  );
                  const isComplete =
                    currentIndex >= 0 &&
                    index < currentIndex;

                  return (
                    <div
                      key={stage}
                      className="flex items-center"
                    >
                      <button
                        type="button"
                        onClick={() => setSalesStage(stage)}
                        className={`rounded-full border px-3 py-2 text-xs font-medium transition ${
                          isCurrent
                            ? "border-gray-900 bg-gray-900 text-white"
                            : isComplete
                              ? "border-green-200 bg-green-50 text-green-700"
                              : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {isComplete && (
                          <Check className="mr-1 inline h-3 w-3" />
                        )}
                        {formatLabel(stage)}
                      </button>

                      {index < stages.length - 1 && (
                        <ChevronRight className="mx-1 h-4 w-4 text-gray-300" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 rounded-lg border bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Current Sales Stage
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {formatLabel(salesStage)}
                </p>
              </div>

              <button
                type="button"
                onClick={saveWorkflow}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Update Sales Stage"}
              </button>
            </div>
          </div>
        </Card>

        <Card className="mt-5">
          <SectionHeader
            eyebrow="R-CAPTAIN"
            title="Sales Intelligence"
            description="Reserved for the shared R-CAPTAIN sales intelligence layer."
            icon={<Sparkles className="h-4 w-4" />}
          />

          <div className="grid gap-3 p-5 sm:grid-cols-3 sm:p-6">
            <InfoItem
              label="Lead Source"
              value={formatLabel(inquiry.source)}
            />

            <InfoItem
              label="Intent"
              value="Available through R-CAPTAIN analysis"
            />

            <InfoItem
              label="Lead Quality"
              value="Available through R-CAPTAIN scoring"
            />
          </div>
        </Card>
      </section>

      {/* ======================================================
          COMMERCIAL
      ======================================================= */}
      <section id="commercial" className="scroll-mt-24">
        <Card>
          <SectionHeader
            eyebrow="Commercial"
            title="Quotations & Proforma Invoices"
            description="Commercial documents related to this inquiry."
            icon={<FileText className="h-4 w-4" />}
          />

          <div className="grid gap-5 p-5 lg:grid-cols-2 sm:p-6">
            <div className="rounded-xl border p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Quotations
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    Quotations created from this inquiry.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setQuoteModalOpen(true);
                  }}
                  className="rounded-lg border px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Create Quotation
                </button>
              </div>

              <div className="mt-4 space-y-2">
                {inquiry.quotes &&
                inquiry.quotes.length > 0 ? (
                  inquiry.quotes.map((quote) => {
                    const proformaInvoice =
                      quote.proformaInvoice?.id
                        ? quote.proformaInvoice
                        : quote.id
                          ? createdProformaInvoices[quote.id]
                          : undefined;

                    return (
                      <div
                        key={quote.id || quote.quoteNumber}
                        className="rounded-lg bg-gray-50 p-3"
                      >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium text-gray-900">
                          {quote.quoteNumber ||
                            "Quotation"}
                        </span>

                        {quote.status && (
                          <span className="rounded-full border bg-white px-2 py-1 text-[11px] font-medium text-gray-600">
                            {formatLabel(quote.status)}
                          </span>
                        )}
                      </div>

                      <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
                        <p className="text-xs text-gray-500">
                          {quote.createdAt
                            ? formatDate(quote.createdAt)
                            : "Date unavailable"}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {quote.id && (
                            <button
                              type="button"
                              onClick={() =>
                                downloadCommercialPdf(
                                  "quote",
                                  quote.id!,
                                  `${quote.quoteNumber || "quotation"}.pdf`,
                                )
                              }
                              className="rounded-lg border bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                            >
                              Download PDF
                            </button>
                          )}

                          {quote.id &&
                            quote.status !== "APPROVED" &&
                            !proformaInvoice?.id && (
                              <button
                                type="button"
                                onClick={() =>
                                  approveQuotation(
                                    quote.id!,
                                  )
                                }
                                disabled={
                                  approvingQuoteId ===
                                  quote.id
                                }
                                className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <Check className="h-3.5 w-3.5" />
                                {approvingQuoteId ===
                                quote.id
                                  ? "Approving..."
                                  : "Approve Quotation"}
                              </button>
                            )}

                          {quote.status === "APPROVED" &&
                            !proformaInvoice?.id && (
                              <button
                                type="button"
                                onClick={() =>
                                  quote.id &&
                                  createProformaInvoice(
                                    quote.id,
                                  )
                                }
                                disabled={
                                  proformaSaving
                                }
                                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {proformaSaving
                                  ? "Creating..."
                                  : "Create Proforma"}
                              </button>
                            )}
                        </div>
                      </div>

                      {proformaInvoice?.id && (
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2">
                          <div>
                            <p className="text-xs font-semibold text-blue-800">
                              Proforma Invoice{" "}
                              {proformaInvoice.piNumber || ""}
                            </p>
                            <p className="mt-0.5 text-[11px] text-blue-700">
                              {proformaInvoice.status
                                ? formatLabel(
                                    proformaInvoice.status,
                                  )
                                : "Created"}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              downloadCommercialPdf(
                                "proforma",
                                proformaInvoice.id,
                                `${proformaInvoice.piNumber || "proforma-invoice"}.pdf`,
                              )
                            }
                            className="rounded-lg border bg-white px-3 py-1.5 text-xs font-semibold text-blue-800 hover:bg-blue-50"
                          >
                            Download PDF
                          </button>
                        </div>
                      )}

                      {quote.status === "APPROVED" && (
                        <div className="mt-3 rounded-lg border border-green-100 bg-green-50 px-3 py-2 text-xs text-green-700">
                          {proformaInvoice?.id
                            ? "Quotation approved and Proforma Invoice generated."
                            : "Quotation approved and ready for Proforma Invoice creation."}
                        </div>
                      )}
                      </div>
                    );
                  })
                ) : (
                  <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
                    No quotation is linked to this inquiry yet.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-xl border p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Proforma Invoices
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    Proforma documents generated from approved commercial records.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const approvedQuote =
                      inquiry.quotes?.find(
                        (quote) =>
                          quote.status === "APPROVED" &&
                          !(
                            quote.proformaInvoice?.id ||
                            (quote.id &&
                              createdProformaInvoices[quote.id]?.id)
                          ),
                      );

                    if (approvedQuote?.id) {
                      createProformaInvoice(approvedQuote.id);
                    }
                  }}
                  disabled={
                    proformaSaving ||
                    !inquiry.quotes?.some(
                      (quote) =>
                        quote.status === "APPROVED" &&
                        !(
                          quote.proformaInvoice?.id ||
                          (quote.id &&
                            createdProformaInvoices[quote.id]?.id)
                        ),
                    )
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
                >
                  <Plus className="h-3.5 w-3.5" />
                  {proformaSaving ? "Creating..." : "Create Proforma"}
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {inquiry.quotes?.some(
                  (quote) =>
                    quote.proformaInvoice?.id ||
                    (quote.id && createdProformaInvoices[quote.id]?.id),
                ) ? (
                  inquiry.quotes
                    ?.map((quote) => {
                      const proformaInvoice =
                        quote.proformaInvoice?.id
                          ? quote.proformaInvoice
                          : quote.id
                            ? createdProformaInvoices[quote.id]
                            : undefined;

                      if (!proformaInvoice?.id) {
                        return null;
                      }

                      return (
                        <div
                          key={proformaInvoice.id}
                          className="rounded-lg border border-blue-100 bg-blue-50 p-4"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-blue-900">
                                {proformaInvoice.piNumber ||
                                  "Proforma Invoice"}
                              </p>
                              <p className="mt-1 text-xs text-blue-700">
                                {proformaInvoice.status
                                  ? formatLabel(
                                      proformaInvoice.status,
                                    )
                                  : "Created"}
                                {proformaInvoice.issueDate
                                  ? ` · Issued ${formatDate(
                                      proformaInvoice.issueDate,
                                    )}`
                                  : ""}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                downloadCommercialPdf(
                                  "proforma",
                                  proformaInvoice.id,
                                  `${
                                    proformaInvoice.piNumber ||
                                    "proforma-invoice"
                                  }.pdf`,
                                )
                              }
                              className="inline-flex items-center gap-1.5 rounded-lg border bg-white px-3 py-1.5 text-xs font-semibold text-blue-800 hover:bg-blue-50"
                            >
                              <FileText className="h-3.5 w-3.5" />
                              Download PDF
                            </button>
                          </div>

                          <div className="mt-3 grid gap-2 sm:grid-cols-3">
                            <div className="rounded-md bg-white/70 px-3 py-2">
                              <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-500">
                                Proforma No.
                              </p>
                              <p className="mt-0.5 text-xs font-medium text-blue-900">
                                {proformaInvoice.piNumber || "—"}
                              </p>
                            </div>

                            <div className="rounded-md bg-white/70 px-3 py-2">
                              <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-500">
                                Amount
                              </p>
                              <p className="mt-0.5 text-xs font-medium text-blue-900">
                                {typeof proformaInvoice.total === "number"
                                  ? `${proformaInvoice.currency || ""} ${proformaInvoice.total.toLocaleString(
                                      "en-IN",
                                      {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      },
                                    )}`.trim()
                                  : "—"}
                              </p>
                            </div>

                            <div className="rounded-md bg-white/70 px-3 py-2">
                              <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-500">
                                Payment Due
                              </p>
                              <p className="mt-0.5 text-xs font-medium text-blue-900">
                                {proformaInvoice.paymentDueDate
                                  ? formatDate(
                                      proformaInvoice.paymentDueDate,
                                    )
                                  : "—"}
                              </p>
                            </div>
                          </div>

                          <p className="mt-2 text-[11px] text-blue-700">
                            From quotation{" "}
                            {quote.quoteNumber || "—"}
                          </p>
                        </div>
                      );
                    })
                    .filter(Boolean)
                ) : inquiry.quotes?.some(
                    (quote) =>
                      quote.status === "APPROVED" &&
                      !(
                        quote.proformaInvoice?.id ||
                        (quote.id &&
                          createdProformaInvoices[quote.id]?.id)
                      ),
                  ) ? (
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm font-medium text-gray-800">
                      Approved quotation available.
                    </p>
                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Use Create Proforma to generate the shared
                      Proforma Invoice record from the approved quote.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm font-medium text-gray-800">
                      No approved quotation yet.
                    </p>
                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Create a quotation first. Proforma Invoice
                      creation becomes available after the quotation
                      is approved.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* ======================================================
          COMMUNICATION
      ======================================================= */}
      <section id="communication" className="scroll-mt-24">
        <Card>
          <SectionHeader
            eyebrow="Communication"
            title="WhatsApp & R-CAPTAIN"
            description="Customer communication and AI-assisted reply workflow."
            icon={<MessageCircle className="h-4 w-4" />}
          />

          <div className="p-5 sm:p-6">
            <div className="rounded-xl border bg-gray-50 p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-white p-2 text-gray-600 shadow-sm">
                  <MessageCircle className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    WhatsApp Conversation
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Generate, review and send customer communication
                    through the Workspace-safe communication layer.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Conversation
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    {inquiry.whatsappMessages?.length
                      ? `${inquiry.whatsappMessages.length} message(s)`
                      : "No messages available"}
                  </p>
                </div>

                <div className="rounded-lg border bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    AI Reply
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    Workspace adapter pending
                  </p>
                </div>

                <div className="rounded-lg border bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Send
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    Workspace adapter pending
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* ======================================================
          CUSTOMER
      ======================================================= */}
      <section id="customer" className="scroll-mt-24">
        <Card>
          <SectionHeader
            eyebrow="Customer"
            title="Customer Message"
            description="The original message received from the buyer."
            icon={<MessageCircle className="h-4 w-4" />}
          />

          <div className="p-5 sm:p-6">
            <div className="rounded-xl border bg-gray-50 p-5">
              <p className="whitespace-pre-wrap text-sm leading-7 text-gray-700">
                {inquiry.message || "No customer message was provided."}
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* ======================================================
          WORKFLOW
      ======================================================= */}
      <section id="workflow" className="scroll-mt-24">
        <Card>
          <SectionHeader
            eyebrow="Workflow"
            title="Inquiry Status & Priority"
            description="Update the shared inquiry workflow state."
            icon={<Flag className="h-4 w-4" />}
          />

          <div className="grid gap-5 p-5 md:grid-cols-2 sm:p-6">
            <div>
              <label
                htmlFor="workspace-inquiry-status"
                className="block text-sm font-medium text-gray-700"
              >
                Status
              </label>

              <select
                id="workspace-inquiry-status"
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value as InquiryStatus,
                  )
                }
                className="mt-1.5 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
              >
                {statuses.map((item) => (
                  <option key={item} value={item}>
                    {formatLabel(item)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="workspace-inquiry-priority"
                className="block text-sm font-medium text-gray-700"
              >
                Priority
              </label>

              <select
                id="workspace-inquiry-priority"
                value={priority}
                onChange={(event) =>
                  setPriority(
                    event.target.value as InquiryPriority,
                  )
                }
                className="mt-1.5 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
              >
                {priorities.map((item) => (
                  <option key={item} value={item}>
                    {formatLabel(item)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end border-t px-5 py-4 sm:px-6">
            <button
              type="button"
              onClick={saveWorkflow}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Workflow"}
            </button>
          </div>
        </Card>
      </section>

      {/* ======================================================
          FOLLOWUPS
      ======================================================= */}
      <section id="followups" className="scroll-mt-24">
        <Card>
          <SectionHeader
            eyebrow="Workflow"
            title="FollowUps"
            description="Scheduled actions and next steps for this inquiry."
            icon={<CalendarDays className="h-4 w-4" />}
          />

          <div className="p-5 sm:p-6">
            <div className="flex flex-col gap-3 rounded-xl border bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Buyer FollowUp Plan
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Create and track the next customer-facing action without
                  leaving the inquiry.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setError("");
                  setFollowUpModalOpen(true);
                }}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
              >
                <Plus className="h-4 w-4" />
                Create FollowUp
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {inquiry.followUps &&
              inquiry.followUps.length > 0 ? (
                inquiry.followUps.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border p-4"
                  >
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-gray-900">
                            {item.title}
                          </h3>

                          {item.status && (
                            <span className="rounded-full border bg-gray-50 px-2 py-1 text-[11px] font-medium text-gray-600">
                              {formatLabel(item.status)}
                            </span>
                          )}

                          {item.priority && (
                            <span className="rounded-full border bg-gray-50 px-2 py-1 text-[11px] font-medium text-gray-600">
                              {formatLabel(item.priority)}
                            </span>
                          )}
                        </div>

                        {item.description && (
                          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                            {item.description}
                          </p>
                        )}

                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500">
                          {item.actionType && (
                            <span>
                              Action:{" "}
                              <span className="font-medium text-gray-800">
                                {formatLabel(item.actionType)}
                              </span>
                            </span>
                          )}

                          {item.category && (
                            <span>
                              Category:{" "}
                              <span className="font-medium text-gray-800">
                                {formatLabel(item.category)}
                              </span>
                            </span>
                          )}

                          {item.scheduledAt && (
                            <span>
                              Scheduled:{" "}
                              <span className="font-medium text-gray-800">
                                {formatDateTime(item.scheduledAt)}
                              </span>
                            </span>
                          )}

                          {item.dueAt && (
                            <span>
                              Due:{" "}
                              <span className="font-medium text-gray-800">
                                {formatDateTime(item.dueAt)}
                              </span>
                            </span>
                          )}
                        </div>
                      </div>

                      <Link
                        href={`/app/workspace/followups/${item.id}`}
                        className="inline-flex shrink-0 items-center justify-center rounded-lg border px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        Open FollowUp
                      </Link>
                    </div>

                    {item.notes && (
                      <div className="mt-3 rounded-lg bg-gray-50 p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                          Notes
                        </p>
                        <p className="mt-1 whitespace-pre-wrap text-xs leading-5 text-gray-600">
                          {item.notes}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed bg-gray-50 p-6 text-center">
                  <p className="text-sm font-medium text-gray-800">
                    No FollowUps scheduled for this inquiry.
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Create the next call, email, WhatsApp action, or other
                    customer follow-up above.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </section>

      {/* ======================================================
          NOTES
      ======================================================= */}
      <section id="notes" className="scroll-mt-24">
        <Card>
          <SectionHeader
            eyebrow="Internal"
            title="Internal Notes"
            description="Notes associated with the inquiry."
            icon={<StickyNote className="h-4 w-4" />}
          />

          <div className="p-5 sm:p-6">
            <div className="rounded-xl border bg-gray-50 p-4">
              <textarea
                value={note}
                onChange={(event) =>
                  setNote(event.target.value)
                }
                rows={4}
                placeholder="Add an internal note..."
                className="w-full resize-y rounded-lg border bg-white p-3 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
              />

              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  disabled
                  title="Workspace note creation endpoint will be connected before this action is enabled."
                  className="rounded-lg border bg-white px-4 py-2 text-sm font-semibold text-gray-400"
                >
                  Add Note
                </button>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {inquiry.notes &&
              inquiry.notes.length > 0 ? (
                inquiry.notes.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border p-4"
                  >
                    <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
                      {item.note}
                    </p>

                    <p className="mt-2 text-xs text-gray-500">
                      {item.admin?.name ||
                        item.createdBy?.name ||
                        "Internal user"}{" "}
                      · {formatDateTime(item.createdAt)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
                  No internal notes yet.
                </p>
              )}
            </div>
          </div>
        </Card>
      </section>

      {/* ======================================================
          ACTIVITY
      ======================================================= */}
      <section id="activity" className="scroll-mt-24">
        <Card>
          <SectionHeader
            eyebrow="Activity"
            title="Status History"
            description="Timeline of recorded inquiry status changes."
            icon={<Clock3 className="h-4 w-4" />}
          />

          <div className="p-5 sm:p-6">
            {inquiry.statusHistory &&
            inquiry.statusHistory.length > 0 ? (
              <div className="space-y-3">
                {inquiry.statusHistory.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 rounded-xl border p-4"
                  >
                    <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-gray-300" />

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatLabel(item.oldStatus)}{" "}
                        <span className="font-normal text-gray-400">
                          →
                        </span>{" "}
                        {formatLabel(item.newStatus)}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {item.admin?.name || "Workspace activity"}{" "}
                        · {formatDateTime(item.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg bg-gray-50 p-5 text-sm text-gray-500">
                No status changes available.
              </div>
            )}
          </div>
        </Card>
      </section>

      <CreateFollowUpModal
        open={followUpModalOpen}
        inquiryId={inquiry.id}
        inquiryLabel={`${inquiry.inquiryNumber} · ${inquiry.companyName}`}
        onClose={() => setFollowUpModalOpen(false)}
        onCreated={async () => {
          setFollowUpModalOpen(false);
          setSuccess("FollowUp created successfully.");
          await loadInquiry();
        }}
      />

      {/* ======================================================
          CREATE QUOTATION MODAL
      ======================================================= */}
      {quoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-quotation-title"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border bg-white shadow-2xl"
          >
            <div className="border-b px-5 py-4 sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Commercial
                  </p>
                  <h2
                    id="create-quotation-title"
                    className="mt-1 text-xl font-semibold text-gray-900"
                  >
                    Create Quotation
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Create a shared quotation for {inquiry.companyName}.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setQuoteModalOpen(false)}
                  className="rounded-lg px-2 py-1 text-sm text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
              <InfoItem
                label="Product"
                value={inquiry.linkedProduct?.name || inquiry.product}
              />

              <InfoItem
                label="Buyer"
                value={inquiry.companyName}
              />

              <div className="sm:col-span-2 rounded-xl border bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Buyer Billing Details
                </p>
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  These values are saved on the commercial document so the
                  quotation and Proforma Invoice retain the buyer details
                  used at the time of issue.
                </p>
              </div>

              <div>
                <label
                  htmlFor="quotation-buyer-gstin"
                  className="block text-sm font-medium text-gray-700"
                >
                  Buyer GSTIN
                </label>
                <input
                  id="quotation-buyer-gstin"
                  value={quoteForm.buyerGstin}
                  onChange={(event) =>
                    setQuoteForm((current) => ({
                      ...current,
                      buyerGstin:
                        event.target.value.toUpperCase(),
                    }))
                  }
                  placeholder="Optional"
                  className="mt-1.5 w-full rounded-lg border px-3 py-2.5 text-sm uppercase outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                />
              </div>

              <div>
                <label
                  htmlFor="quotation-buyer-country"
                  className="block text-sm font-medium text-gray-700"
                >
                  Buyer Country
                </label>
                <input
                  id="quotation-buyer-country"
                  value={inquiry.country}
                  readOnly
                  className="mt-1.5 w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="quotation-buyer-address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Buyer Address
                </label>
                <textarea
                  id="quotation-buyer-address"
                  rows={3}
                  value={quoteForm.buyerAddress}
                  onChange={(event) =>
                    setQuoteForm((current) => ({
                      ...current,
                      buyerAddress:
                        event.target.value,
                    }))
                  }
                  placeholder="Full billing / registered address"
                  className="mt-1.5 w-full resize-y rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Currency
                </label>
                <input
                  value={quoteForm.currency}
                  onChange={(event) =>
                    setQuoteForm((current) => ({
                      ...current,
                      currency: event.target.value,
                    }))
                  }
                  maxLength={3}
                  className="mt-1.5 w-full rounded-lg border px-3 py-2.5 text-sm uppercase outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  min="0.001"
                  step="0.001"
                  value={quoteForm.quantity}
                  onChange={(event) =>
                    setQuoteForm((current) => ({
                      ...current,
                      quantity: event.target.value,
                    }))
                  }
                  className="mt-1.5 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Unit
                </label>
                <input
                  value={quoteForm.unit}
                  onChange={(event) =>
                    setQuoteForm((current) => ({
                      ...current,
                      unit: event.target.value,
                    }))
                  }
                  placeholder="kg"
                  className="mt-1.5 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Unit Price
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={quoteForm.unitPrice}
                  onChange={(event) =>
                    setQuoteForm((current) => ({
                      ...current,
                      unitPrice: event.target.value,
                    }))
                  }
                  placeholder="0.00"
                  className="mt-1.5 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Discount
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={quoteForm.discount}
                  onChange={(event) =>
                    setQuoteForm((current) => ({
                      ...current,
                      discount: event.target.value,
                    }))
                  }
                  className="mt-1.5 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Freight
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={quoteForm.freight}
                  onChange={(event) =>
                    setQuoteForm((current) => ({
                      ...current,
                      freight: event.target.value,
                    }))
                  }
                  className="mt-1.5 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Insurance
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={quoteForm.insurance}
                  onChange={(event) =>
                    setQuoteForm((current) => ({
                      ...current,
                      insurance: event.target.value,
                    }))
                  }
                  className="mt-1.5 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tax
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={quoteForm.tax}
                  onChange={(event) =>
                    setQuoteForm((current) => ({
                      ...current,
                      tax: event.target.value,
                    }))
                  }
                  className="mt-1.5 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Validity (days)
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={quoteForm.validityDays}
                  onChange={(event) =>
                    setQuoteForm((current) => ({
                      ...current,
                      validityDays: event.target.value,
                    }))
                  }
                  className="mt-1.5 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  rows={3}
                  value={quoteForm.notes}
                  onChange={(event) =>
                    setQuoteForm((current) => ({
                      ...current,
                      notes: event.target.value,
                    }))
                  }
                  placeholder="Commercial notes..."
                  className="mt-1.5 w-full resize-y rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                />
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={() => setQuoteModalOpen(false)}
                disabled={quoteSaving}
                className="rounded-lg border px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={createQuotation}
                disabled={quoteSaving}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FileText className="h-4 w-4" />
                {quoteSaving
                  ? "Creating..."
                  : "Create Quotation"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer navigation */}
      <div className="flex justify-between border-t pt-4">
        <Link
          href="/app/workspace/inquiries"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Inquiries
        </Link>

        <button
          type="button"
          onClick={() => router.refresh()}
          className="text-sm font-medium text-gray-500 hover:text-gray-900"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}
