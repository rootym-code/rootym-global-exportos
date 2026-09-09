/**
 * ============================================================
 * ROOTYM Customer Website Configuration
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides tenant-safe Website Configuration editing
 *          for customer-facing Website identity and metadata.
 * ============================================================
 */

"use client";

import { useCallback, useEffect, useState } from "react";

import {
  CheckCircle2,
  Globe2,
  Loader2,
  Save,
} from "lucide-react";

import { Button } from "@/components/ui/Button";

interface WebsiteConfigurationData {
  id: string;
  websiteId: string;
  websiteTitle: string | null;
  tagline: string | null;
  websiteDescription: string | null;
  createdAt: string;
  updatedAt: string;
}

interface WebsiteConfigurationResponse {
  success: boolean;
  message?: string;
  data?: {
    website: {
      id: string;
      name: string;
      slug: string;
    };
    configuration: WebsiteConfigurationData | null;
  };
}

interface WebsiteConfigurationFormProps {
  canEdit: boolean;
}

export default function WebsiteConfigurationForm({
  canEdit,
}: WebsiteConfigurationFormProps) {
  const [configuration, setConfiguration] =
    useState<WebsiteConfigurationData | null>(null);

  const [websiteTitle, setWebsiteTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [websiteDescription, setWebsiteDescription] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadConfiguration = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      const response = await fetch(
        "/api/workspace/website/configuration",
        {
          credentials: "include",
          cache: "no-store",
        },
      );

      const result: WebsiteConfigurationResponse =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ??
            "Unable to load Website Configuration.",
        );
      }

      const currentConfiguration =
        result.data?.configuration ?? null;

      setConfiguration(currentConfiguration);

      setWebsiteTitle(
        currentConfiguration?.websiteTitle ?? "",
      );

      setTagline(currentConfiguration?.tagline ?? "");

      setWebsiteDescription(
        currentConfiguration?.websiteDescription ?? "",
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load Website Configuration.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadConfiguration();
  }, [loadConfiguration]);

  const handleSave = async () => {
    if (!canEdit) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const response = await fetch(
        "/api/workspace/website/configuration",
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            websiteTitle: websiteTitle.trim() || null,
            tagline: tagline.trim() || null,
            websiteDescription:
              websiteDescription.trim() || null,
          }),
        },
      );

      const result: WebsiteConfigurationResponse =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ??
            "Unable to save Website Configuration.",
        );
      }

      const savedConfiguration =
        result.data?.configuration ?? null;

      setConfiguration(savedConfiguration);

      setWebsiteTitle(
        savedConfiguration?.websiteTitle ?? "",
      );

      setTagline(savedConfiguration?.tagline ?? "");

      setWebsiteDescription(
        savedConfiguration?.websiteDescription ?? "",
      );

      setSuccessMessage(
        result.message ??
          "Website Configuration saved successfully.",
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save Website Configuration.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <div className="flex min-h-[280px] items-center justify-center">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading Website Configuration...
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 sm:p-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                <Globe2 className="h-5 w-5 text-emerald-600" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                  Website Identity
                </p>

                <h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                  Website Configuration
                </h3>
              </div>
            </div>

            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-500">
              Configure the customer-facing Website title,
              tagline and description. These values belong to
              this Website and are independent from ROOTYM global
              Company Settings.
            </p>
          </div>

          {!canEdit ? (
            <span className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
              View only
            </span>
          ) : (
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Editable
            </span>
          )}
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {successMessage ? (
          <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {successMessage}
          </div>
        ) : null}

        <div className="grid gap-5">
          <div>
            <label
              htmlFor="website-title"
              className="text-sm font-semibold text-slate-800"
            >
              Website Title
            </label>

            <input
              id="website-title"
              type="text"
              value={websiteTitle}
              onChange={(event) =>
                setWebsiteTitle(event.target.value)
              }
              disabled={!canEdit || saving}
              maxLength={200}
              placeholder="e.g. ROOTYM Agro Harvest"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:bg-slate-50"
            />

            <p className="mt-1.5 text-xs text-slate-400">
              Maximum 200 characters.
            </p>
          </div>

          <div>
            <label
              htmlFor="website-tagline"
              className="text-sm font-semibold text-slate-800"
            >
              Tagline
            </label>

            <input
              id="website-tagline"
              type="text"
              value={tagline}
              onChange={(event) =>
                setTagline(event.target.value)
              }
              disabled={!canEdit || saving}
              maxLength={300}
              placeholder="e.g. Rooted in India. Trusted Worldwide."
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:bg-slate-50"
            />

            <p className="mt-1.5 text-xs text-slate-400">
              Maximum 300 characters.
            </p>
          </div>

          <div>
            <label
              htmlFor="website-description"
              className="text-sm font-semibold text-slate-800"
            >
              Website Description
            </label>

            <textarea
              id="website-description"
              value={websiteDescription}
              onChange={(event) =>
                setWebsiteDescription(event.target.value)
              }
              disabled={!canEdit || saving}
              maxLength={2000}
              rows={5}
              placeholder="Describe the business and what customers can expect from this Website."
              className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:bg-slate-50"
            />

            <p className="mt-1.5 text-xs text-slate-400">
              Maximum 2000 characters.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs leading-5 text-slate-500">
            {configuration
              ? "Existing Website Configuration loaded."
              : "No Website Configuration has been saved yet."}
          </div>

          {canEdit ? (
            <Button
              type="button"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Configuration
                </>
              )}
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}