"use client";

import {
  use,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  FileText,
  Loader2,
} from "lucide-react";

import InquiryStatusBadge from "@/components/admin/InquiryStatusBadge";

import WhatsAppConversationCard from "@/components/admin/communication/WhatsAppConversationCard";

import {
  InquiryStatus,
  SalesStage,
} from "@/lib/generated/prisma";

interface Note {
  id: string;
  note: string;
  createdAt: string;
  admin?: {
    name: string;
  };
}

interface StatusHistory {
  id: string;
  oldStatus: InquiryStatus | null;
  newStatus: InquiryStatus;
  createdAt: string;
  admin?: {
    name: string;
  };
}

interface WhatsAppDraft {
  id: string;
  message: string;
  status:
  | "DRAFT"
  | "APPROVED"
  | "QUEUED"
  | "SENT"
  | "DELIVERED"
  | "READ";
  createdAt?: string;
  updatedAt?: string;
}

interface WhatsAppMessage {
  id: string;
  message: string;
  status:
  | "DRAFT"
  | "APPROVED"
  | "QUEUED"
  | "SENT"
  | "DELIVERED"
  | "READ"
  | "FAILED"
  | "REJECTED";

  createdAt?: string;
  updatedAt?: string;
}


interface Inquiry {
  id: string;
  inquiryNumber: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  country: string;
  product: string;
  quantity: string;
  message: string;
  priority: string;
  status: InquiryStatus;
  salesStage: SalesStage;
  source: string;
  createdAt: string;
  notes: Note[];
  statusHistory: StatusHistory[];
}

export default function InquiryDetailsPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  const [savingStatus, setSavingStatus] =
    useState(false);

  const [savingStage, setSavingStage] =
    useState(false);

  const [savingNote, setSavingNote] =
    useState(false);

  const [creatingQuote, setCreatingQuote] =
    useState(false);

  const [loadingWhatsApp, setLoadingWhatsApp] =
    useState(false);

  const [generating, setGenerating] =
    useState(false);

  const [draft, setDraft] =
    useState<WhatsAppDraft | null>(null);

  const [messages, setMessages] =
    useState<WhatsAppMessage[]>([]);

  const [note, setNote] =
    useState("");

  const [status, setStatus] =
    useState<InquiryStatus>("NEW");

  const [salesStage, setSalesStage] =
    useState<SalesStage>("NEW");

  const [inquiry, setInquiry] =
    useState<Inquiry | null>(null);

  useEffect(() => {
    loadInquiry();
    loadWhatsAppConversation();
  }, []);

  async function loadInquiry() {
    try {
      setLoading(true);

      const res =
        await fetch(
          `/api/admin/inquiries/${id}`
        );

      const data =
        await res.json();

      setInquiry(
        data.inquiry
      );

      setStatus(
        data.inquiry.status
      );

      setSalesStage(
        data.inquiry.salesStage ?? "NEW"
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadWhatsAppConversation() {
    try {
      setLoadingWhatsApp(true);






      const res = await fetch(
        `/api/admin/inquiries/${id}/whatsapp`
      );
      if (!res.ok) {
        throw new Error("Failed to load WhatsApp conversation.");
      }

      const data = await res.json();

      if (!data.success) {
        setDraft(null);
        setMessages([]);
        return;
      }
      const conversation =
        data.messages ?? [];

      setMessages(conversation);

      const latest =
        conversation[conversation.length - 1];

      if (!latest) {
        setDraft(null);
        return;
      }




      setDraft({
        id: latest.id,
        message: latest.message,
        status: latest.status,
        createdAt: latest.createdAt,
        updatedAt: latest.updatedAt,
      });




    } catch (error) {
      console.error(
        "Failed to load WhatsApp conversation",
        error
      );

      setDraft(null);
    } finally {
      setLoadingWhatsApp(false);
    }
  }








  async function handleGenerate() {
    try {
      setGenerating(true);

      const res = await fetch(
        `/api/admin/inquiries/${id}/whatsapp/generate`,
        {
          method: "POST",
        }
      )
      if (!res.ok) {
        throw new Error("Failed to generate WhatsApp draft.");
      }
      ;

      const data = await res.json();

      if (!data.success) {
        return;
      }

      await loadWhatsAppConversation();
    } finally {
      setGenerating(false);
    }
  }


  async function handleEdit(message: string) {
    if (!draft) return;

    try {
      const response = await fetch(
        `/api/admin/communication/whatsapp/${draft.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
          }),
        }
      )

        ;


      if (!response.ok) {
        throw new Error("Failed to update WhatsApp draft.");
      }

      await loadInquiry();
      await loadWhatsAppConversation();

    } catch (error) {
      console.error("Failed to update draft:", error);
    }
  }

  async function handleRegenerate() {
    if (!draft) {



      await handleGenerate();
      return;
    }

    try {
      setGenerating(true);




      const response = await fetch(
        `/api/admin/inquiries/${id}/whatsapp/${draft.id}/regenerate`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to regenerate WhatsApp draft.");
      }

      await loadInquiry();
      await loadWhatsAppConversation();



    } finally {
      setGenerating(false);
    }
  }


  async function handleApprove() {
    if (!draft) {
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/communication/whatsapp/${draft.id}/approve`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to approve WhatsApp draft.");
      }

      await loadInquiry();
      await loadWhatsAppConversation();
    } catch (error) {
      console.error(
        "Failed to approve WhatsApp draft:",
        error
      );
    }
  }


  async function handleSend() {
    if (!draft) {
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/communication/whatsapp/${draft.id}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send WhatsApp message.");
      }

      await loadInquiry();
      await loadWhatsAppConversation();
    } catch (error) {
      console.error(
        "Failed to send WhatsApp message:",
        error
      );
    }
  }



  async function updateStatus() {
    try {
      setSavingStatus(true);




      const response =



        await fetch(
          `/api/admin/inquiries/${id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status,
            }),
          }
        );



      if (!response.ok) {
        throw new Error("Failed to update inquiry status.");
      }

      await loadInquiry();




    } finally {
      setSavingStatus(false);
    }
  }

  async function updateSalesStage() {
    try {
      setSavingStage(true);

      const response = await fetch(
        `/api/admin/inquiries/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            salesStage,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update sales stage.");
      }

      await loadInquiry();
    } finally {
      setSavingStage(false);
    }
  }





  // ===== END OF PART 2 =====
  async function createQuotation() {
    if (!inquiry || creatingQuote) return;

    try {
      setCreatingQuote(true);

      /*
       * The Inquiry stores the requested product as text, while QuoteItem
       * requires a real Product relation. Resolve the inquiry product before
       * creating the draft quotation.
       */
      const productResponse = await fetch(
        `/api/admin/products?search=${encodeURIComponent(
          inquiry.product
        )}&page=1&pageSize=20`,
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      const productResult =
        await productResponse.json();

      if (!productResponse.ok || !productResult.success) {
        throw new Error(
          productResult.message ??
            "Unable to find the requested product."
        );
      }

      const products = Array.isArray(productResult.items)
        ? productResult.items
        : [];

      const requestedProduct = inquiry.product
        .trim()
        .toLowerCase();

      const product =
        products.find(
          (item: { name?: string }) =>
            item.name?.trim().toLowerCase() ===
            requestedProduct
        ) ??
        products.find(
          (item: { name?: string }) =>
            item.name?.trim().toLowerCase().includes(
              requestedProduct
            )
        );

      if (!product?.id) {
        throw new Error(
          `Product "${inquiry.product}" was not found in the ROOTYM product catalogue.`
        );
      }

      const quantityMatch =
        inquiry.quantity.match(/[0-9]+(?:\.[0-9]+)?/);

      const quantity = quantityMatch
        ? Number(quantityMatch[0])
        : 1;

      if (!Number.isFinite(quantity) || quantity <= 0) {
        throw new Error(
          "The inquiry quantity is invalid. Please correct the inquiry before creating a quotation."
        );
      }

      const unitMatch = inquiry.quantity
        .match(/[a-zA-Z]+(?:\s+[a-zA-Z]+)*/);

      const unit =
        unitMatch?.[0]?.trim() ||
        product.defaultUnit ||
        "KG";

      const response = await fetch(
        "/api/admin/quotes",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inquiryId: inquiry.id,
            companyName: inquiry.companyName,
            contactPerson: inquiry.contactPerson,
            email: inquiry.email,
            phone: inquiry.phone,
            country: inquiry.country,
            currency: "USD",
            items: [
              {
                productId: product.id,
                description: inquiry.product,
                quantity,
                unit,
                unitPrice: 0,
              },
            ],
            discount: 0,
            freight: 0,
            insurance: 0,
            tax: 0,
            validityDays: 15,
            notes: inquiry.message || undefined,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success || !result.data?.id) {
        throw new Error(
          result.message ??
            "Unable to create the quotation."
        );
      }

      router.push(
        `/admin/quotes/${result.data.id}/edit`
      );
    } catch (error) {
      console.error(
        "Failed to create quotation:",
        error
      );

      window.alert(
        error instanceof Error
          ? error.message
          : "Unable to create the quotation."
      );
    } finally {
      setCreatingQuote(false);
    }
  }

  async function addNote() {
    if (!note.trim()) return;

    try {
      setSavingNote(true);

      const response = await fetch(
        `/api/admin/inquiries/${id}/notes`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            note,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add note.");
      }
      setNote("");

      await loadInquiry();


      //



    } finally {
      setSavingNote(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-lg border bg-white p-8">
        Loading...
      </div>
    );
  }

  if (!inquiry) {
    return (
      <div className="rounded-lg border bg-white p-8">
        Inquiry not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg border bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {inquiry.inquiryNumber}
            </h1>

            <p className="text-gray-500">
              {inquiry.companyName}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={createQuotation}
              disabled={creatingQuote}
              className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {creatingQuote ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileText className="h-4 w-4" />
              )}

              {creatingQuote
                ? "Creating..."
                : "Create Quotation"}
            </button>

            <InquiryStatusBadge
              status={inquiry.status}
            />
          </div>
        </div>
      </div>

      {/* Buyer Snapshot */}
      <div className="rounded-lg border bg-white p-6">
        <h2 className="mb-5 text-lg font-semibold">
          Buyer Snapshot
        </h2>

        <div className="grid gap-4 md:grid-cols-4">
          <InfoCard
            label="Company"
            value={inquiry.companyName}
          />

          <InfoCard
            label="Contact"
            value={inquiry.contactPerson}
          />

          <InfoCard
            label="WhatsApp"
            value={inquiry.phone}
          />

          <InfoCard
            label="Country"
            value={inquiry.country}
          />
        </div>
      </div>

      {/* Requirement Summary */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-white p-6">
          <h2 className="mb-5 text-lg font-semibold">
            Requirement Summary
          </h2>

          <Row
            label="Product"
            value={inquiry.product}
          />

          <Row
            label="Quantity"
            value={inquiry.quantity}
          />

          <Row
            label="Source"
            value={inquiry.source}
          />

          <Row
            label="Priority"
            value={inquiry.priority}
          />
        </div>

        {/* R-CAPTAIN Intelligence */}
        <div className="rounded-lg border bg-white p-6">
          <h2 className="mb-5 text-lg font-semibold">
            R-CAPTAIN Intelligence
          </h2>

          <Row
            label="Lead Source"
            value="R-CAPTAIN AI"
          />

// ===== END OF PART 3 =====
          <Row
            label="Intent"
            value="BUYING REQUEST"
          />

          <Row
            label="Lead Quality"
            value="HOT"
          />
        </div>
      </div>

      {/* Sales Pipeline */}
      <div className="rounded-lg border bg-white p-6">
        <h2 className="mb-5 text-lg font-semibold">
          Sales Pipeline
        </h2>

        <div className="flex flex-wrap gap-3">
          {Object.values(SalesStage).map(
            (stage) => (
              <button
                key={stage}
                onClick={() =>
                  setSalesStage(stage)
                }
                className={`rounded-full border px-4 py-2 text-sm ${salesStage === stage
                  ? "bg-green-600 text-white"
                  : "bg-white"
                  }`}
              >
                {stage.replaceAll(
                  "_",
                  " "
                )}
              </button>
            )
          )}
        </div>

        <button
          onClick={updateSalesStage}
          disabled={savingStage}
          className="mt-5 rounded-md bg-green-600 px-5 py-2 text-white"
        >
          {savingStage
            ? "Saving..."
            : "Update Sales Stage"}
        </button>
      </div>

      {/* WhatsApp Conversation */}
      <div className="rounded-lg border bg-white p-6">
        <h2 className="mb-3 text-lg font-semibold">
          WhatsApp Conversation
        </h2>

        <p className="mb-4 text-gray-600">
          Generate, edit and send WhatsApp
          messages directly from the inquiry.
        </p>

        <WhatsAppConversationCard
          inquiryId={id}
          loading={loadingWhatsApp}
          generating={generating}
          draft={draft}
          messages={messages}
          onGenerate={handleGenerate}
          onSaveEdit={handleEdit}
          onRegenerate={handleRegenerate}
          onApprove={handleApprove}
          onSend={handleSend}
        />
      </div>

      {/* Customer Message */}
      <div className="rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">
          Customer Message
        </h2>

        <p className="whitespace-pre-wrap text-gray-700">
          {inquiry.message || "-"}
        </p>
      </div>

      {/* Update Status */}
      <div className="rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">
          Update Status
        </h2>

        <div className="flex gap-3">
          <select
            value={status}
            onChange={(e) =>
              setStatus(
                e.target.value as InquiryStatus
              )
            }
            className="flex-1 rounded-md border px-3 py-2"
          >
            {Object.values(
              InquiryStatus
            ).map((item) => (
              <option
                key={item}
                value={item}
              >
                {item.replaceAll(
                  "_",
                  " "
                )}
              </option>
            ))}
          </select>

          <button
            onClick={updateStatus}
            disabled={savingStatus}
            className="rounded-md bg-green-600 px-5 py-2 text-white"
          >
            {savingStatus
              ? "Saving..."
              : "Save"}
          </button>
        </div>
      </div>

// ===== END OF PART 4 =====
      {/* Internal Notes */}
      <div className="rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">
          Internal Notes
        </h2>

        <textarea
          value={note}
          onChange={(e) =>
            setNote(e.target.value)
          }
          rows={4}
          placeholder="Add internal note..."
          className="w-full rounded-md border p-3"
        />

        <button
          onClick={addNote}
          disabled={savingNote}
          className="mt-3 rounded-md bg-blue-600 px-5 py-2 text-white"
        >
          {savingNote
            ? "Saving..."
            : "Add Note"}
        </button>

        <div className="mt-6 space-y-4">
          {inquiry.notes.length === 0 ? (
            <p className="text-sm text-gray-500">
              No internal notes yet.
            </p>
          ) : (
            inquiry.notes.map((item) => (
              <div
                key={item.id}
                className="rounded-md border p-4"
              >
                <p>{item.note}</p>

                <p className="mt-2 text-xs text-gray-500">
                  {item.admin?.name ?? "Admin"}
                  {" • "}
                  {new Date(
                    item.createdAt
                  ).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Status History */}
      <div className="rounded-lg border bg-white p-6">
        <h2 className="mb-5 text-lg font-semibold">
          Status History
        </h2>

        {inquiry.statusHistory.length === 0 ? (
          <p className="text-gray-500">
            No status changes available.
          </p>
        ) : (
          <div className="space-y-4">
            {inquiry.statusHistory.map(
              (item) => (
                <div
                  key={item.id}
                  className="rounded-md border p-4"
                >
                  <div className="font-medium">
                    {(item.oldStatus ?? "-").replaceAll(
                      "_",
                      " "
                    )}

                    {" → "}

                    {item.newStatus.replaceAll(
                      "_",
                      " "
                    )}
                  </div>

                  <div className="mt-2 text-xs text-gray-500">
                    {item.admin?.name ??
                      "Admin"}
                    {" • "}
                    {new Date(
                      item.createdAt
                    ).toLocaleString()}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="mt-1 font-medium">
        {value || "-"}
      </p>
    </div>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex items-center justify-between border-b py-3 last:border-0">
      <span className="font-medium text-gray-600">
        {label}
      </span>

      <span className="text-right">
        {value || "-"}
      </span>
    </div>
  );
}

// ===== END OF FILE =====
