/**
 * ============================================================
 * ROOTYM Global ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Customer Workspace FollowUp creation modal.
 *
 * ============================================================
 */

"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import {
  FollowUpActionType,
  FollowUpCategory,
  FollowUpPriority,
} from "@/lib/generated/prisma";

type CreateFollowUpModalProps = {
  open: boolean;
  inquiryId?: string;
  inquiryLabel?: string;
  onClose: () => void;
  onCreated?: (followUp: unknown) => void;
};

const ACTION_TYPES = Object.values(FollowUpActionType);
const CATEGORIES = Object.values(FollowUpCategory);
const PRIORITIES = Object.values(FollowUpPriority);

const DEFAULT_ACTION_TYPE = ACTION_TYPES[0]!;
const DEFAULT_CATEGORY = CATEGORIES[0]!;
const DEFAULT_PRIORITY = PRIORITIES[0]!;

function formatEnumLabel(value: string) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function toLocalDateTimeValue(date: Date) {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

export default function CreateFollowUpModal({
  open,
  inquiryId,
  inquiryLabel,
  onClose,
  onCreated,
}: CreateFollowUpModalProps) {
  const defaultScheduledAt = useMemo(() => {
    const date = new Date();
    date.setHours(date.getHours() + 1, 0, 0, 0);
    return toLocalDateTimeValue(date);
  }, []);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [actionType, setActionType] =
    useState<FollowUpActionType>(DEFAULT_ACTION_TYPE);
  const [category, setCategory] =
    useState<FollowUpCategory>(DEFAULT_CATEGORY);
  const [priority, setPriority] =
    useState<FollowUpPriority>(DEFAULT_PRIORITY);
  const [scheduledAt, setScheduledAt] = useState(defaultScheduledAt);
  const [dueAt, setDueAt] = useState("");
  const [estimatedMinutes, setEstimatedMinutes] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    setTitle("");
    setDescription("");
    setActionType(DEFAULT_ACTION_TYPE);
    setCategory(DEFAULT_CATEGORY);
    setPriority(DEFAULT_PRIORITY);
    setScheduledAt(defaultScheduledAt);
    setDueAt("");
    setEstimatedMinutes("");
    setNotes("");
    setError("");
    setSubmitting(false);
  }, [open, defaultScheduledAt, inquiryId]);

  if (!open) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!inquiryId) {
      setError("An Inquiry must be selected before creating a FollowUp.");
      return;
    }

    if (!title.trim()) {
      setError("FollowUp title is required.");
      return;
    }

    if (!scheduledAt) {
      setError("Scheduled date and time are required.");
      return;
    }

    if (
      estimatedMinutes &&
      (!Number.isFinite(Number(estimatedMinutes)) ||
        Number(estimatedMinutes) < 0)
    ) {
      setError("Estimated minutes must be a valid positive number.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        "/api/workspace/followups/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inquiryId,
            title: title.trim(),
            description: description.trim() || undefined,
            actionType,
            category,
            priority,
            scheduledAt: new Date(scheduledAt).toISOString(),
            dueAt: dueAt
              ? new Date(dueAt).toISOString()
              : undefined,
            estimatedMinutes: estimatedMinutes
              ? Number(estimatedMinutes)
              : undefined,
            notes: notes.trim() || undefined,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message || "Unable to create FollowUp.",
        );
      }

      onCreated?.(result?.followUp);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create FollowUp.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-followup-title"
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4">
          <div>
            <h2
              id="create-followup-title"
              className="text-lg font-semibold text-gray-900"
            >
              Create FollowUp
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Schedule the next action for this Inquiry.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-50"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {inquiryId && (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Inquiry
              </div>
              <div className="mt-1 text-sm font-medium text-gray-900">
                {inquiryLabel || inquiryId}
              </div>
            </div>
          )}

          {!inquiryId && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              Open this form from an Inquiry to create a FollowUp.
            </div>
          )}

          <section className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                FollowUp Details
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                Define what needs to happen and why.
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Title *
              </label>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Call buyer about quotation"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                rows={3}
                placeholder="What should be discussed or completed?"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Action Type
                </label>
                <select
                  value={actionType}
                  onChange={(event) =>
                    setActionType(
                      event.target.value as FollowUpActionType,
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                  {ACTION_TYPES.map((value) => (
                    <option key={value} value={value}>
                      {formatEnumLabel(value)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(event) =>
                    setCategory(
                      event.target.value as FollowUpCategory,
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                  {CATEGORIES.map((value) => (
                    <option key={value} value={value}>
                      {formatEnumLabel(value)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(event) =>
                    setPriority(
                      event.target.value as FollowUpPriority,
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                  {PRIORITIES.map((value) => (
                    <option key={value} value={value}>
                      {formatEnumLabel(value)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="space-y-4 border-t pt-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Schedule
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                Set when the action should happen and, optionally, when it
                should be completed by.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Scheduled At *
                </label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(event) =>
                    setScheduledAt(event.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Due At
                </label>
                <input
                  type="datetime-local"
                  value={dueAt}
                  onChange={(event) => setDueAt(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Estimated Minutes
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={estimatedMinutes}
                  onChange={(event) =>
                    setEstimatedMinutes(event.target.value)
                  }
                  placeholder="30"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
          </section>

          <section className="space-y-4 border-t pt-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Notes
              </h3>
            </div>

            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={3}
              placeholder="Internal notes for this FollowUp..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            />
          </section>

          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 border-t pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting || !inquiryId}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create FollowUp"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
