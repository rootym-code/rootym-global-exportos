"use client";

import { use, useEffect, useState } from "react";
import InquiryStatusBadge from "@/components/admin/InquiryStatusBadge";
import { InquiryStatus } from "@/lib/generated/prisma";

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
  createdAt: string;
  notes: Note[];
  statusHistory: StatusHistory[];
}

export default function InquiryDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [loading, setLoading] = useState(true);

  const [savingStatus, setSavingStatus] =
    useState(false);

  const [savingNote, setSavingNote] =
    useState(false);

  const [note, setNote] = useState("");

  const [status, setStatus] =
    useState<InquiryStatus>("NEW");

  const [inquiry, setInquiry] =
    useState<Inquiry | null>(null);

  useEffect(() => {
    loadInquiry();
  }, []);

  async function loadInquiry() {
    try {
      setLoading(true);

      const res = await fetch(
        `/api/admin/inquiries/${id}`
      );

      const data = await res.json();

      setInquiry(data.inquiry);

      setStatus(data.inquiry.status);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus() {
    try {
      setSavingStatus(true);

      await fetch(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      });

      await loadInquiry();
    } finally {
      setSavingStatus(false);
    }
  }

  async function addNote() {
    if (!note.trim()) return;

    try {
      setSavingNote(true);

      await fetch(
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

      setNote("");

      await loadInquiry();
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

          <InquiryStatusBadge
            status={inquiry.status}
          />

        </div>

      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        <div className="rounded-lg border bg-white p-6">

          <h2 className="mb-5 text-lg font-semibold">
            Inquiry Details
          </h2>

          <Row
            label="Contact"
            value={inquiry.contactPerson}
          />

          <Row
            label="Email"
            value={inquiry.email}
          />

          <Row
            label="Phone"
            value={inquiry.phone}
          />

          <Row
            label="Country"
            value={inquiry.country}
          />

          <Row
            label="Product"
            value={inquiry.product}
          />

          <Row
            label="Quantity"
            value={inquiry.quantity}
          />

          <Row
            label="Priority"
            value={inquiry.priority}
          />

        </div>

        <div className="space-y-6">

          <div className="rounded-lg border bg-white p-6">

            <h2 className="mb-4 text-lg font-semibold">
              Customer Message
            </h2>

            <p className="whitespace-pre-wrap text-gray-700">
              {inquiry.message}
            </p>

          </div>

          <div className="rounded-lg border bg-white p-6">

            <h2 className="mb-4 text-lg font-semibold">
              Update Status
            </h2>

            <div className="flex gap-3">

              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target
                      .value as InquiryStatus
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
                className="rounded-md bg-green-600 px-5 py-2 font-medium text-white hover:bg-green-700 disabled:opacity-50"
              >
                {savingStatus
                  ? "Saving..."
                  : "Save"}
              </button>

            </div>

          </div>
          <div className="rounded-lg border bg-white p-6">

<h2 className="mb-4 text-lg font-semibold">
  Internal Notes
</h2>

<textarea
  value={note}
  onChange={(e) => setNote(e.target.value)}
  rows={4}
  placeholder="Add internal note..."
  className="w-full rounded-md border p-3 outline-none focus:border-green-600"
/>

<button
  onClick={addNote}
  disabled={savingNote}
  className="mt-3 rounded-md bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
>
  {savingNote ? "Saving..." : "Add Note"}
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
          {item.admin?.name ?? "Admin"} •{" "}
          {new Date(
            item.createdAt
          ).toLocaleString()}
        </p>
      </div>
    ))
  )}

</div>

</div>

</div>

</div>

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

{inquiry.statusHistory.map((item) => (
  <div
    key={item.id}
    className="rounded-md border p-4"
  >
    <div className="font-medium">
      {(item.oldStatus ?? "-").replaceAll(
        "_",
        " "
      )}{" "}
      →{" "}
      {item.newStatus.replaceAll(
        "_",
        " "
      )}
    </div>

    <div className="mt-2 text-xs text-gray-500">
      {item.admin?.name ?? "Admin"} •{" "}
      {new Date(
        item.createdAt
      ).toLocaleString()}
    </div>
  </div>
))}

</div>
)}

</div>

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