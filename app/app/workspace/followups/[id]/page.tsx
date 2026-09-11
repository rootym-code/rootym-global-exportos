"use client";

/**
 * ============================================================
 * ROOTYM Global ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Customer Workspace FollowUp detail page.
 *
 * ============================================================
 */

import Link from "next/link";
import { use, useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Moon,
  RotateCcw,
} from "lucide-react";

import {
  FollowUpPriority,
  FollowUpResult,
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

interface TimelineItem {
  id: string;
  action: string;
  title: string;
  description: string | null;
  createdAt: string;
  actorType: string;
  performedBy?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

interface TimelineResponse {
  success: boolean;
  activities: TimelineItem[];
  message?: string;
}

function statusBadge(
  status: FollowUpStatus,
) {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-700";
    case "PENDING":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function priorityBadge(
  priority: FollowUpPriority,
) {
  switch (priority) {
    case "URGENT":
      return "bg-red-100 text-red-700";
    case "HIGH":
      return "bg-orange-100 text-orange-700";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

const FOLLOW_UP_RESULTS = Object.values(FollowUpResult);

function formatEnumLabel(value: string) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function toDateTimeLocal(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (number: number) =>
    number.toString().padStart(2, "0");

  return `${date.getFullYear()}-${pad(
    date.getMonth() + 1,
  )}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
}

function formatDate(
  value: string | null,
) {
  if (!value) {
    return "-";
  }

  return new Date(
    value,
  ).toLocaleString();
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="text-sm text-gray-500">
        {label}
      </div>

      <div className="mt-2 text-lg font-semibold text-slate-900">
        {value}
      </div>
    </div>
  );
}

export default function WorkspaceFollowUpDetailPage({
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

  const [timeline, setTimeline] =
    useState<TimelineItem[]>([]);

  const [activityTitle, setActivityTitle] =
    useState("");

  const [activityDescription, setActivityDescription] =
    useState("");

  const [activityLoading, setActivityLoading] =
    useState(false);

  const [activityError, setActivityError] =
    useState("");

  const [activitySuccess, setActivitySuccess] =
    useState("");

  const [actionModal, setActionModal] =
    useState<"complete" | "reschedule" | "snooze" | null>(
      null,
    );

  const [actionLoading, setActionLoading] =
    useState(false);

  const [actionError, setActionError] =
    useState("");

  const [actionSuccess, setActionSuccess] =
    useState("");

  const [completeResult, setCompleteResult] =
    useState<string>("");

  const [completeNotes, setCompleteNotes] =
    useState("");

  const [actualMinutes, setActualMinutes] =
    useState("");

  const [rescheduleAt, setRescheduleAt] =
    useState("");

  const [rescheduleDueAt, setRescheduleDueAt] =
    useState("");

  const [rescheduleNotes, setRescheduleNotes] =
    useState("");

  const [snoozeAt, setSnoozeAt] =
    useState("");

  const [snoozeReason, setSnoozeReason] =
    useState("");

  useEffect(() => {
    loadFollowUp();
    loadTimeline();
  }, [id]);

  async function loadFollowUp() {
    try {
      setLoading(true);
      setError("");

      const response =
        await fetch(
          `/api/workspace/followups/${id}`,
        );

      const result =
        (await response.json()) as ApiResponse;

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ??
            "Unable to load FollowUp.",
        );
      }

      setFollowUp(
        result.followUp,
      );
    } catch (err) {
      console.error(
        "Workspace FollowUp loading error:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load FollowUp.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadTimeline() {
    try {
      const response =
        await fetch(
          `/api/workspace/followups/${id}/timeline`,
        );

      const result =
        (await response.json()) as TimelineResponse;

      if (
        response.ok &&
        result.success
      ) {
        setTimeline(
          result.activities ?? [],
        );
      }
    } catch (err) {
      console.error(
        "Workspace FollowUp timeline loading error:",
        err,
      );
    }
  }

  async function submitActivityUpdate(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const title = activityTitle.trim();
    const description = activityDescription.trim();

    setActivityError("");
    setActivitySuccess("");

    if (!title) {
      setActivityError("Please enter an activity title.");
      return;
    }

    if (!description) {
      setActivityError(
        "Please describe what happened or what the buyer communication was about.",
      );
      return;
    }

    try {
      setActivityLoading(true);

      const response = await fetch(
        `/api/workspace/followups/${id}/timeline`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
          }),
        },
      );

      const result = (await response.json()) as {
        success: boolean;
        message?: string;
      };

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ??
            "Unable to add activity update.",
        );
      }

      setActivityTitle("");
      setActivityDescription("");
      setActivitySuccess(
        "Activity update added to the FollowUp timeline.",
      );

      await loadTimeline();
    } catch (err) {
      console.error(
        "Workspace FollowUp activity update error:",
        err,
      );

      setActivityError(
        err instanceof Error
          ? err.message
          : "Unable to add activity update.",
      );
    } finally {
      setActivityLoading(false);
    }
  }

  function openActionModal(
    action: "complete" | "reschedule" | "snooze",
  ) {
    setActionError("");
    setActionSuccess("");

    if (action === "complete") {
      setCompleteResult(
        FOLLOW_UP_RESULTS[0] ?? "",
      );
      setCompleteNotes("");
      setActualMinutes("");
    }

    if (action === "reschedule") {
      setRescheduleAt(
        toDateTimeLocal(
          followUp?.scheduledAt ?? null,
        ),
      );
      setRescheduleDueAt(
        toDateTimeLocal(
          followUp?.dueAt ?? null,
        ),
      );
      setRescheduleNotes("");
    }

    if (action === "snooze") {
      setSnoozeAt(
        toDateTimeLocal(
          followUp?.scheduledAt ?? null,
        ),
      );
      setSnoozeReason("");
    }

    setActionModal(action);
  }

  function closeActionModal() {
    if (actionLoading) {
      return;
    }

    setActionModal(null);
    setActionError("");
  }

  async function submitAction() {
    if (!actionModal) {
      return;
    }

    setActionLoading(true);
    setActionError("");
    setActionSuccess("");

    try {
      let endpoint = "";
      let payload: Record<string, unknown> = {};

      if (actionModal === "complete") {
        if (!completeResult) {
          throw new Error(
            "Please select a FollowUp result.",
          );
        }

        payload = {
          result: completeResult,
          notes: completeNotes.trim() || undefined,
          actualMinutes: actualMinutes
            ? Number(actualMinutes)
            : undefined,
        };

        endpoint = `/api/workspace/followups/${id}/complete`;
      }

      if (actionModal === "reschedule") {
        if (!rescheduleAt) {
          throw new Error(
            "Please select the new scheduled date and time.",
          );
        }

        payload = {
          scheduledAt: new Date(
            rescheduleAt,
          ).toISOString(),
          dueAt: rescheduleDueAt
            ? new Date(
                rescheduleDueAt,
              ).toISOString()
            : undefined,
          notes: rescheduleNotes.trim() || undefined,
        };

        endpoint = `/api/workspace/followups/${id}/reschedule`;
      }

      if (actionModal === "snooze") {
        if (!snoozeAt) {
          throw new Error(
            "Please select the new snooze date and time.",
          );
        }

        payload = {
          scheduledAt: new Date(
            snoozeAt,
          ).toISOString(),
          reason: snoozeReason.trim() || undefined,
        };

        endpoint = `/api/workspace/followups/${id}/snooze`;
      }

      const response = await fetch(
        endpoint,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const result = (await response.json()) as {
        success: boolean;
        message?: string;
      };

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ??
            "Unable to update FollowUp.",
        );
      }

      const successMessage =
        actionModal === "complete"
          ? "FollowUp completed successfully."
          : actionModal === "reschedule"
            ? "FollowUp rescheduled successfully."
            : "FollowUp snoozed successfully.";

      setActionModal(null);
      setActionSuccess(successMessage);

      await Promise.all([
        loadFollowUp(),
        loadTimeline(),
      ]);
    } catch (err) {
      console.error(
        "Workspace FollowUp action error:",
        err,
      );

      setActionError(
        err instanceof Error
          ? err.message
          : "Unable to update FollowUp.",
      );
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center text-gray-500">
        Loading FollowUp...
      </div>
    );
  }

  if (error || !followUp) {
    return (
      <div className="rounded-xl border bg-white p-10">
        <h2 className="text-xl font-semibold text-red-600">
          Unable to load FollowUp
        </h2>

        <p className="mt-2 text-gray-600">
          {error ||
            "FollowUp not found."}
        </p>

        <Link
          href="/app/workspace/followups"
          className="mt-6 inline-flex items-center gap-2 rounded-md border px-4 py-2 hover:bg-gray-100"
        >
          <ArrowLeft size={16} />
          Back to FollowUps
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Link
            href="/app/workspace/followups"
            className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black"
          >
            <ArrowLeft size={16} />
            Back to FollowUps
          </Link>

          <h1 className="text-2xl font-bold text-slate-900 lg:text-3xl">
            {followUp.title}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {followUp.inquiry.inquiryNumber} ·{" "}
            {followUp.inquiry.companyName}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(
              followUp.status,
            )}`}
          >
            {followUp.status}
          </span>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityBadge(
              followUp.priority,
            )}`}
          >
            {followUp.priority}
          </span>
        </div>
      </div>

      {actionSuccess && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {actionSuccess}
        </div>
      )}

      {followUp.status !== "COMPLETED" && (
        <section className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                FollowUp Actions
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Update the outcome or change when this FollowUp should be handled.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  openActionModal("complete")
                }
                className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                <CheckCircle2 size={16} />
                Complete
              </button>

              <button
                type="button"
                onClick={() =>
                  openActionModal("reschedule")
                }
                className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
              >
                <RotateCcw size={16} />
                Reschedule
              </button>

              <button
                type="button"
                onClick={() =>
                  openActionModal("snooze")
                }
                className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
              >
                <Moon size={16} />
                Snooze
              </button>
            </div>
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
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
          value={formatDate(
            followUp.scheduledAt,
          )}
        />

        <SummaryCard
          label="Category"
          value={followUp.category}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <CalendarClock
                size={20}
                className="text-gray-500"
              />

              <h2 className="text-xl font-semibold text-slate-900">
                FollowUp Details
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <SummaryCard
                label="Action Type"
                value={
                  followUp.actionType
                }
              />

              <SummaryCard
                label="Scheduled"
                value={formatDate(
                  followUp.scheduledAt,
                )}
              />

              <SummaryCard
                label="Due"
                value={formatDate(
                  followUp.dueAt,
                )}
              />

              <SummaryCard
                label="Estimated Time"
                value={
                  followUp.estimatedMinutes !==
                  null
                    ? `${followUp.estimatedMinutes} min`
                    : "-"
                }
              />
            </div>
          </section>

          <section className="rounded-xl border bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">
              Description
            </h2>

            <p className="whitespace-pre-wrap text-gray-700">
              {followUp.description ||
                "No description available."}
            </p>
          </section>

          <section className="rounded-xl border bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">
              Notes
            </h2>

            <p className="whitespace-pre-wrap text-gray-700">
              {followUp.notes ||
                "No notes available."}
            </p>
          </section>

          <section className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <Clock3
                size={20}
                className="text-gray-500"
              />

              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Activity Timeline
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Review the history of this FollowUp and record important
                  buyer communication, responses, or progress.
                </p>
              </div>
            </div>

            <form
              onSubmit={submitActivityUpdate}
              className="mb-6 rounded-lg border bg-gray-50 p-4"
            >
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Add Activity Update
                </h3>

                <p className="mt-1 text-sm text-gray-600">
                  Use this to record what happened during a call, WhatsApp
                  message, email, quotation discussion, buyer response, or
                  other important interaction. These updates become part of
                  the permanent FollowUp history.
                </p>
              </div>

              {activityError && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {activityError}
                </div>
              )}

              {activitySuccess && (
                <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {activitySuccess}
                </div>
              )}

              <div className="mt-4 space-y-4">
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-slate-700">
                    Activity Title
                  </span>

                  <input
                    type="text"
                    value={activityTitle}
                    onChange={(event) =>
                      setActivityTitle(event.target.value)
                    }
                    placeholder="e.g. Buyer requested revised quotation"
                    className="w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:border-green-600"
                    disabled={activityLoading}
                    maxLength={200}
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-slate-700">
                    Activity Description
                  </span>

                  <textarea
                    value={activityDescription}
                    onChange={(event) =>
                      setActivityDescription(event.target.value)
                    }
                    placeholder="Describe what happened, what the buyer said, or what action was taken..."
                    rows={4}
                    className="w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:border-green-600"
                    disabled={activityLoading}
                    maxLength={2000}
                  />
                </label>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={activityLoading}
                    className="rounded-md bg-green-600 px-5 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {activityLoading
                      ? "Saving..."
                      : "Add Update"}
                  </button>
                </div>
              </div>
            </form>

            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
                History
              </h3>

              {timeline.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No activity history available yet.
                </p>
              ) : (
                <div className="space-y-5">
                  {timeline.map(
                    (item) => (
                      <div
                        key={item.id}
                        className="border-l-2 pl-4"
                      >
                        <div className="font-semibold text-slate-900">
                          {item.title}
                        </div>

                        <div className="mt-1 text-sm text-gray-600">
                          {item.description ||
                            "No description"}
                        </div>

                        <div className="mt-1 text-xs text-gray-400">
                          {formatDate(
                            item.createdAt,
                          )}{" "}
                          ·{" "}
                          {item.actorType}
                        </div>

                        {item.performedBy && (
                          <div className="mt-1 text-xs text-gray-500">
                            By:{" "}
                            {
                              item.performedBy
                                .name
                            }
                          </div>
                        )}
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-xl border bg-white p-5 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold text-slate-900">
              Buyer / Inquiry
            </h2>

            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500">
                  Inquiry Number
                </div>

                <div className="mt-1 font-medium">
                  {
                    followUp.inquiry
                      .inquiryNumber
                  }
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500">
                  Company
                </div>

                <div className="mt-1 font-medium">
                  {
                    followUp.inquiry
                      .companyName
                  }
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500">
                  Contact Person
                </div>

                <div className="mt-1 font-medium">
                  {
                    followUp.inquiry
                      .contactPerson
                  }
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500">
                  Email
                </div>

                <div className="mt-1 break-words font-medium">
                  {followUp.inquiry.email}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500">
                  Phone
                </div>

                <div className="mt-1 font-medium">
                  {followUp.inquiry.phone}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500">
                  Country
                </div>

                <div className="mt-1 font-medium">
                  {followUp.inquiry.country}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500">
                  Product
                </div>

                <div className="mt-1 font-medium">
                  {followUp.inquiry.product}
                </div>
              </div>

              <Link
                href={`/app/workspace/inquiries/${followUp.inquiry.id}`}
                className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
              >
                <ExternalLink size={16} />
                Open Inquiry
              </Link>
            </div>
          </section>

          <section className="rounded-xl border bg-white p-5 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold text-slate-900">
              FollowUp Information
            </h2>

            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500">
                  Assigned To
                </div>

                <div className="mt-1 font-medium">
                  {followUp.assignedTo
                    ?.name ??
                    "Unassigned"}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500">
                  Created At
                </div>

                <div className="mt-1 font-medium">
                  {formatDate(
                    followUp.createdAt,
                  )}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500">
                  Completed At
                </div>

                <div className="mt-1 font-medium">
                  {formatDate(
                    followUp.completedAt,
                  )}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500">
                  Actual Time
                </div>

                <div className="mt-1 font-medium">
                  {followUp.actualMinutes !==
                  null
                    ? `${followUp.actualMinutes} min`
                    : "-"}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-xl font-semibold text-slate-900">
              Status
            </h2>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle2
                size={18}
              />

              {followUp.status ===
              "COMPLETED"
                ? "This FollowUp is completed."
                : "This FollowUp is pending action."}
            </div>
          </section>
        </div>
      </div>

      {actionModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {actionModal === "complete"
                    ? "Complete FollowUp"
                    : actionModal === "reschedule"
                      ? "Reschedule FollowUp"
                      : "Snooze FollowUp"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {actionModal === "complete"
                    ? "Record the result of this FollowUp."
                    : actionModal === "reschedule"
                      ? "Choose the new date and time for this FollowUp."
                      : "Choose when this FollowUp should appear again."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeActionModal}
                disabled={actionLoading}
                className="rounded-md px-2 py-1 text-xl text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {actionError && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {actionError}
              </div>
            )}

            <div className="mt-5 space-y-4">
              {actionModal === "complete" && (
                <>
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-slate-700">
                      Result
                    </span>
                    <select
                      value={completeResult}
                      onChange={(event) =>
                        setCompleteResult(
                          event.target.value,
                        )
                      }
                      className="w-full rounded-md border px-3 py-2 text-sm"
                      disabled={actionLoading}
                    >
                      {FOLLOW_UP_RESULTS.map(
                        (result) => (
                          <option
                            key={result}
                            value={result}
                          >
                            {formatEnumLabel(result)}
                          </option>
                        ),
                      )}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-slate-700">
                      Actual Minutes
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={actualMinutes}
                      onChange={(event) =>
                        setActualMinutes(
                          event.target.value,
                        )
                      }
                      className="w-full rounded-md border px-3 py-2 text-sm"
                      placeholder="Optional"
                      disabled={actionLoading}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-slate-700">
                      Notes
                    </span>
                    <textarea
                      value={completeNotes}
                      onChange={(event) =>
                        setCompleteNotes(
                          event.target.value,
                        )
                      }
                      rows={4}
                      className="w-full rounded-md border px-3 py-2 text-sm"
                      placeholder="Add the outcome or any important notes..."
                      disabled={actionLoading}
                    />
                  </label>
                </>
              )}

              {actionModal === "reschedule" && (
                <>
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-slate-700">
                      Scheduled At
                    </span>
                    <input
                      type="datetime-local"
                      value={rescheduleAt}
                      onChange={(event) =>
                        setRescheduleAt(
                          event.target.value,
                        )
                      }
                      className="w-full rounded-md border px-3 py-2 text-sm"
                      disabled={actionLoading}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-slate-700">
                      Due At
                    </span>
                    <input
                      type="datetime-local"
                      value={rescheduleDueAt}
                      onChange={(event) =>
                        setRescheduleDueAt(
                          event.target.value,
                        )
                      }
                      className="w-full rounded-md border px-3 py-2 text-sm"
                      disabled={actionLoading}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-slate-700">
                      Notes
                    </span>
                    <textarea
                      value={rescheduleNotes}
                      onChange={(event) =>
                        setRescheduleNotes(
                          event.target.value,
                        )
                      }
                      rows={4}
                      className="w-full rounded-md border px-3 py-2 text-sm"
                      placeholder="Optional reschedule note..."
                      disabled={actionLoading}
                    />
                  </label>
                </>
              )}

              {actionModal === "snooze" && (
                <>
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-slate-700">
                      Snooze Until
                    </span>
                    <input
                      type="datetime-local"
                      value={snoozeAt}
                      onChange={(event) =>
                        setSnoozeAt(
                          event.target.value,
                        )
                      }
                      className="w-full rounded-md border px-3 py-2 text-sm"
                      disabled={actionLoading}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-slate-700">
                      Reason
                    </span>
                    <textarea
                      value={snoozeReason}
                      onChange={(event) =>
                        setSnoozeReason(
                          event.target.value,
                        )
                      }
                      rows={4}
                      className="w-full rounded-md border px-3 py-2 text-sm"
                      placeholder="Optional reason for snoozing..."
                      disabled={actionLoading}
                    />
                  </label>
                </>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeActionModal}
                disabled={actionLoading}
                className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={submitAction}
                disabled={actionLoading}
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {actionLoading
                  ? "Saving..."
                  : actionModal === "complete"
                    ? "Complete FollowUp"
                    : actionModal === "reschedule"
                      ? "Reschedule"
                      : "Snooze"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
