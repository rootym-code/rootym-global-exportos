/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides client-side page selection controls and
 *          executes bulk Website CMS page actions.
 * ============================================================
 */

"use client";

import { useEffect, useState } from "react";

type BulkAction =
  | "publish"
  | "draft"
  | "archive";

const ACTION_LABELS: Record<BulkAction, string> = {
  publish: "Publish Selected",
  draft: "Save as Draft",
  archive: "Archive Selected",
};

export default function PageBulkSelection() {
  const [selectedCount, setSelectedCount] =
    useState(0);

  const [totalCount, setTotalCount] =
    useState(0);

  const [processing, setProcessing] =
    useState<BulkAction | null>(null);

  const [message, setMessage] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    const getCheckboxes = () =>
      Array.from(
        document.querySelectorAll<HTMLInputElement>(
          "[data-page-select]",
        ),
      );

    const syncSelection = () => {
      const checkboxes =
        getCheckboxes();

      setTotalCount(
        checkboxes.length,
      );

      setSelectedCount(
        checkboxes.filter(
          (checkbox) =>
            checkbox.checked,
        ).length,
      );
    };

    const handleChange = (
      event: Event,
    ) => {
      const target =
        event.target;

      if (
        target instanceof
          HTMLInputElement &&
        target.matches(
          "[data-page-select]",
        )
      ) {
        syncSelection();
      }
    };

    syncSelection();

    document.addEventListener(
      "change",
      handleChange,
    );

    return () => {
      document.removeEventListener(
        "change",
        handleChange,
      );
    };
  }, []);

  const getSelectedPageIds =
    (): string[] => {
      return Array.from(
        document.querySelectorAll<HTMLInputElement>(
          "[data-page-select]:checked",
        ),
      )
        .map(
          (checkbox) =>
            checkbox.value.trim(),
        )
        .filter(Boolean);
    };

  const toggleAll = (
    checked: boolean,
  ) => {
    const checkboxes =
      Array.from(
        document.querySelectorAll<HTMLInputElement>(
          "[data-page-select]",
        ),
      );

    checkboxes.forEach(
      (checkbox) => {
        checkbox.checked =
          checked;
      },
    );

    setTotalCount(
      checkboxes.length,
    );

    setSelectedCount(
      checked
        ? checkboxes.length
        : 0,
    );

    setMessage(null);
    setError(null);
  };

  const runBulkAction = async (
    action: BulkAction,
  ) => {
    const pageIds =
      getSelectedPageIds();

    if (pageIds.length === 0) {
      setError(
        "Please select at least one page.",
      );
      return;
    }

    setProcessing(action);
    setMessage(null);
    setError(null);

    try {
      const response =
        await fetch(
          "/api/workspace/website/pages/bulk-action",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              action,
              pageIds,
            }),
          },
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ??
            result?.error?.message ??
            "Unable to update the selected pages.",
        );
      }

      setMessage(
        result?.message ??
          `${ACTION_LABELS[action]} completed successfully.`,
      );

      setProcessing(null);

      window.location.reload();
    } catch (error) {
      setProcessing(null);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to update the selected pages.",
      );
    }
  };

  const hasSelection =
    selectedCount > 0;

  return (
    <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              aria-label="Select all pages"
              checked={
                totalCount > 0 &&
                selectedCount ===
                  totalCount
              }
              disabled={processing !== null}
              onChange={(event) =>
                toggleAll(
                  event.target
                    .checked,
                )
              }
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />

            Select All
          </label>

          <span className="text-sm text-slate-500">
            {selectedCount === 0
              ? "No pages selected"
              : `${selectedCount} ${
                  selectedCount === 1
                    ? "page"
                    : "pages"
                } selected`}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={
              !hasSelection ||
              processing !== null
            }
            onClick={() =>
              runBulkAction(
                "publish",
              )
            }
            className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {processing ===
            "publish"
              ? "Publishing..."
              : "Publish Selected"}
          </button>

          <button
            type="button"
            disabled={
              !hasSelection ||
              processing !== null
            }
            onClick={() =>
              runBulkAction(
                "draft",
              )
            }
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {processing === "draft"
              ? "Saving..."
              : "Save as Draft"}
          </button>

          <button
            type="button"
            disabled={
              !hasSelection ||
              processing !== null
            }
            onClick={() =>
              runBulkAction(
                "archive",
              )
            }
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {processing ===
            "archive"
              ? "Archiving..."
              : "Archive Selected"}
          </button>
        </div>
      </div>

      {message && (
        <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
          {message}
        </p>
      )}

      {error && (
        <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}