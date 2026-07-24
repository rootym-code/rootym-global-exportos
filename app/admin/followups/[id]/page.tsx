"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

import {
  FollowUpPriority,
  FollowUpStatus,
} from "@/lib/generated/prisma";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

interface FollowUpDetail {
  id: string;
  title: string;
  description: string | null;
  notes: string | null;

  status: FollowUpStatus;
  priority: FollowUpPriority;

  actionType: string;
  category: string;

  scheduledAt: string;
  dueAt: string | null;

  estimatedMinutes: number | null;
  actualMinutes: number | null;

  createdAt: string;
  completedAt: string | null;

  inquiry: {
    id: string;
    inquiryNumber: string;
    companyName: string;
    contactPerson: string;
    email: string;
    phone: string;
    country: string;
    product: string;
  };

  assignedTo?: {
    id: string;
    name: string;
    email: string;
  } | null;

  completedBy?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

interface ApiResponse {
  success: boolean;
  followUp: FollowUpDetail;
  message?: string;
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border bg-white p-5">
      <div className="text-sm text-gray-500">
        {label}
      </div>

      <div className="mt-2 text-lg font-semibold">
        {value}
      </div>
    </div>
  );
}

export default function FollowUpDetailPage({
  params,
}: PageProps) {
  const { id } = use(params);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [followUp, setFollowUp] =
    useState<FollowUpDetail | null>(
      null,
    );

  useEffect(() => {
    loadFollowUp();
  }, [id]);

  async function loadFollowUp() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/admin/followups/${id}`,
      );

      const result =
        (await response.json()) as ApiResponse;

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ??
            "Unable to load follow-up.",
        );
      }

      setFollowUp(result.followUp);

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unexpected error",
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-lg border bg-white p-10 text-center">
        Loading follow-up...
      </div>
    );
  }

  if (error || !followUp) {
    return (
      <div className="rounded-lg border bg-white p-10">
        <h2 className="text-xl font-semibold text-red-600">
          Failed to load follow-up
        </h2>

        <p className="mt-2 text-gray-600">
          {error}
        </p>

        <Link
          href="/admin/followups"
          className="mt-6 inline-flex items-center gap-2 rounded-md border px-4 py-2 hover:bg-gray-100"
        >
          <ArrowLeft size={16} />
          Back
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>

          <Link
            href="/admin/followups"
            className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black"
          >
            <ArrowLeft size={16} />
            Back to FollowUps
          </Link>

          <h1 className="text-3xl font-bold">
            {followUp.title}
          </h1>

        </div>

      </div>

      <div className="grid gap-4 md:grid-cols-4">

        <SummaryCard
          label="Status"
          value={followUp.status}
        />

        <SummaryCard
          label="Priority"
          value={followUp.priority}
        />

        <SummaryCard
          label="Scheduled"
          value={new Date(
            followUp.scheduledAt,
          ).toLocaleString()}
        />

        <SummaryCard
          label="Category"
          value={followUp.category}
        />

      </div>

      <div className="rounded-lg border bg-white p-6">

        <h2 className="mb-5 text-xl font-semibold">
          Inquiry Information
        </h2>

        <div className="grid gap-5 md:grid-cols-2">

          <div>
            <div className="text-sm text-gray-500">
              Inquiry Number
            </div>

            <div className="font-medium">
              {followUp.inquiry.inquiryNumber}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500">
              Company
            </div>

            <div className="font-medium">
              {followUp.inquiry.companyName}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500">
              Contact Person
            </div>

            <div className="font-medium">
              {followUp.inquiry.contactPerson}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500">
              Email
            </div>

            <div className="font-medium">
              {followUp.inquiry.email}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500">
              Phone
            </div>

            <div className="font-medium">
              {followUp.inquiry.phone}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500">
              Country
            </div>

            <div className="font-medium">
              {followUp.inquiry.country}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500">
              Product
            </div>

            <div className="font-medium">
              {followUp.inquiry.product}
            </div>
          </div>
          </div>

</div>

<div className="rounded-lg border bg-white p-6">

  <h2 className="mb-5 text-xl font-semibold">
    FollowUp Information
  </h2>

  <div className="grid gap-5 md:grid-cols-2">

    <div>
      <div className="text-sm text-gray-500">
        Action Type
      </div>

      <div className="font-medium">
        {followUp.actionType}
      </div>
    </div>

    <div>
      <div className="text-sm text-gray-500">
        Category
      </div>

      <div className="font-medium">
        {followUp.category}
      </div>
    </div>

    <div>
      <div className="text-sm text-gray-500">
        Assigned To
      </div>

      <div className="font-medium">
        {followUp.assignedTo?.name ??
          "Unassigned"}
      </div>
    </div>

    <div>
      <div className="text-sm text-gray-500">
        Completed By
      </div>

      <div className="font-medium">
        {followUp.completedBy?.name ??
          "-"}
      </div>
    </div>

    <div>
      <div className="text-sm text-gray-500">
        Estimated Minutes
      </div>

      <div className="font-medium">
        {followUp.estimatedMinutes ??
          "-"}
      </div>
    </div>

    <div>
      <div className="text-sm text-gray-500">
        Actual Minutes
      </div>

      <div className="font-medium">
        {followUp.actualMinutes ??
          "-"}
      </div>
    </div>

    <div>
      <div className="text-sm text-gray-500">
        Created At
      </div>

      <div className="font-medium">
        {new Date(
          followUp.createdAt,
        ).toLocaleString()}
      </div>
    </div>

    <div>
      <div className="text-sm text-gray-500">
        Completed At
      </div>

      <div className="font-medium">
        {followUp.completedAt
          ? new Date(
              followUp.completedAt,
            ).toLocaleString()
          : "-"}
      </div>
    </div>

  </div>

</div>

<div className="rounded-lg border bg-white p-6">

  <h2 className="mb-4 text-xl font-semibold">
    Description
  </h2>

  <p className="whitespace-pre-wrap text-gray-700">
    {followUp.description ||
      "No description available."}
  </p>

</div>

<div className="rounded-lg border bg-white p-6">

  <h2 className="mb-4 text-xl font-semibold">
    Internal Notes
  </h2>

  <p className="whitespace-pre-wrap text-gray-700">
    {followUp.notes ||
      "No notes available."}
  </p>

</div>

<div className="rounded-lg border bg-white p-6">

  <h2 className="mb-5 text-xl font-semibold">
    Action Panel
  </h2>

  <div className="grid gap-3 md:grid-cols-4">

    <button
      type="button"
      disabled
      className="rounded-md bg-green-600 px-4 py-3 font-medium text-white opacity-50"
    >
      ✓ Complete
    </button>

    <button
      type="button"
      disabled
      className="rounded-md bg-amber-500 px-4 py-3 font-medium text-white opacity-50"
    >
      🕒 Snooze
    </button>

    <button
      type="button"
      disabled
      className="rounded-md bg-blue-600 px-4 py-3 font-medium text-white opacity-50"
    >
      📅 Reschedule
    </button>

    <button
      type="button"
      disabled
      className="rounded-md bg-purple-600 px-4 py-3 font-medium text-white opacity-50"
    >
      👤 Assign
    </button>

  </div>

  <p className="mt-4 text-sm text-gray-500">
    Action workflows will be enabled in the
    next milestone.
  </p>

</div>

</div>
);
}