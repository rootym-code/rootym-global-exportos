/**
 * ============================================================
 * ROOTYM Customer Website Branding
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides tenant-safe Website Branding configuration
 *          with Website Media Library asset selection.
 * ============================================================
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CheckCircle2,
  Image as ImageIcon,
  Loader2,
  Palette,
  Save,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import WebsiteMediaPicker from "@/componenet/admin/media/WebsiteMediaPicker";

import type { MediaDto } from "@/lib/types/media";

interface WebsiteBrandingMedia {
  id: string;
  fileName: string;
  fileUrl: string;
  mimeType: string | null;
  width: number | null;
  height: number | null;
  altText: string | null;
  title: string | null;
}

interface WebsiteBrandingData {
  id: string;
  websiteId: string;
  logoMediaId: string | null;
  faviconMediaId: string | null;
  ogImageMediaId: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  accentColor: string | null;
  fontFamily: string | null;
  logoMedia: WebsiteBrandingMedia | null;
  faviconMedia: WebsiteBrandingMedia | null;
  ogImageMedia: WebsiteBrandingMedia | null;
}

interface WebsiteBrandingResponse {
  success: boolean;
  message?: string;
  data?: {
    website: {
      id: string;
      name: string;
      slug: string;
    };
    branding: WebsiteBrandingData | null;
  };
}

interface WebsiteBrandingFormProps {
  canEdit: boolean;
}

interface MediaSelectionCardProps {
  label: string;
  description: string;
  media: WebsiteBrandingMedia | null;
  onSelect: () => void;
  onRemove: () => void;
  disabled: boolean;
}

function MediaSelectionCard({
  label,
  description,
  media,
  onSelect,
  onRemove,
  disabled,
}: MediaSelectionCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white">
          {media?.fileUrl ? (
            <img
              src={media.fileUrl}
              alt={
                media.altText ||
                media.title ||
                media.fileName ||
                label
              }
              className="h-full w-full object-contain"
            />
          ) : (
            <ImageIcon className="h-8 w-8 text-slate-300" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900">
            {label}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>

          {media ? (
            <p
              className="mt-2 truncate text-xs font-medium text-slate-700"
              title={media.fileName}
            >
              {media.title || media.fileName}
            </p>
          ) : (
            <p className="mt-2 text-xs font-medium text-slate-400">
              Not selected
            </p>
          )}

          {media?.width && media?.height ? (
            <p className="mt-1 text-[11px] text-slate-400">
              {media.width} × {media.height}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onSelect}
            disabled={disabled}
          >
            {media ? "Change" : "Select"}
          </Button>

          {media ? (
            <button
              type="button"
              onClick={onRemove}
              disabled={disabled}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={`Remove ${label}`}
              title={`Remove ${label}`}
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function WebsiteBrandingForm({
  canEdit,
}: WebsiteBrandingFormProps) {
  const [branding, setBranding] =
    useState<WebsiteBrandingData | null>(null);

  const [logoMedia, setLogoMedia] =
    useState<WebsiteBrandingMedia | null>(null);

  const [faviconMedia, setFaviconMedia] =
    useState<WebsiteBrandingMedia | null>(null);

  const [ogImageMedia, setOgImageMedia] =
    useState<WebsiteBrandingMedia | null>(null);

  const [primaryColor, setPrimaryColor] = useState("#0f172a");
  const [secondaryColor, setSecondaryColor] = useState("#64748b");
  const [accentColor, setAccentColor] = useState("#059669");
  const [fontFamily, setFontFamily] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [picker, setPicker] = useState<
    "logo" | "favicon" | "ogImage" | null
  >(null);

  const loadBranding = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      const response = await fetch(
        "/api/workspace/website/branding",
        {
          credentials: "include",
          cache: "no-store",
        },
      );

      const result: WebsiteBrandingResponse =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ??
            "Unable to load Website Branding.",
        );
      }

      const currentBranding = result.data?.branding ?? null;

      setBranding(currentBranding);

      setLogoMedia(currentBranding?.logoMedia ?? null);
      setFaviconMedia(currentBranding?.faviconMedia ?? null);
      setOgImageMedia(currentBranding?.ogImageMedia ?? null);

      setPrimaryColor(
        currentBranding?.primaryColor ?? "#0f172a",
      );

      setSecondaryColor(
        currentBranding?.secondaryColor ?? "#64748b",
      );

      setAccentColor(
        currentBranding?.accentColor ?? "#059669",
      );

      setFontFamily(currentBranding?.fontFamily ?? "");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load Website Branding.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBranding();
  }, [loadBranding]);

  const handleMediaSelect = (media: MediaDto) => {
    const selectedMedia: WebsiteBrandingMedia = {
      id: media.id,
      fileName: media.fileName,
      fileUrl: media.fileUrl,
      mimeType: media.mimeType,
      width: media.width,
      height: media.height,
      altText: media.altText,
      title: media.title,
    };

    if (picker === "logo") {
      setLogoMedia(selectedMedia);
    }

    if (picker === "favicon") {
      setFaviconMedia(selectedMedia);
    }

    if (picker === "ogImage") {
      setOgImageMedia(selectedMedia);
    }

    setPicker(null);
  };

  const handleSave = async () => {
    if (!canEdit) return;

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const response = await fetch(
        "/api/workspace/website/branding",
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            logoMediaId: logoMedia?.id ?? null,
            faviconMediaId: faviconMedia?.id ?? null,
            ogImageMediaId: ogImageMedia?.id ?? null,
            primaryColor: primaryColor.trim() || null,
            secondaryColor: secondaryColor.trim() || null,
            accentColor: accentColor.trim() || null,
            fontFamily: fontFamily.trim() || null,
          }),
        },
      );

      const result: WebsiteBrandingResponse =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ??
            "Unable to save Website Branding.",
        );
      }

      const savedBranding = result.data?.branding ?? null;

      setBranding(savedBranding);

      setLogoMedia(savedBranding?.logoMedia ?? null);
      setFaviconMedia(savedBranding?.faviconMedia ?? null);
      setOgImageMedia(savedBranding?.ogImageMedia ?? null);

      setPrimaryColor(
        savedBranding?.primaryColor ?? "#0f172a",
      );

      setSecondaryColor(
        savedBranding?.secondaryColor ?? "#64748b",
      );

      setAccentColor(
        savedBranding?.accentColor ?? "#059669",
      );

      setFontFamily(savedBranding?.fontFamily ?? "");

      setSuccessMessage(
        result.message ??
          "Website Branding saved successfully.",
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save Website Branding.",
      );
    } finally {
      setSaving(false);
    }
  };

  const clearMedia = (
    type: "logo" | "favicon" | "ogImage",
  ) => {
    if (type === "logo") {
      setLogoMedia(null);
    }

    if (type === "favicon") {
      setFaviconMedia(null);
    }

    if (type === "ogImage") {
      setOgImageMedia(null);
    }
  };

  if (loading) {
    return (
      <section className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <div className="flex min-h-[280px] items-center justify-center">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading Website Branding...
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                  <Palette className="h-5 w-5 text-emerald-600" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                    Website Identity
                  </p>

                  <h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                    Website Branding
                  </h3>
                </div>
              </div>

              <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-500">
                Configure the visual identity used by this
                customer Website. Branding assets are selected
                directly from this Website&apos;s Media Library.
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
            <MediaSelectionCard
              label="Website Logo"
              description="Primary logo displayed across the customer Website."
              media={logoMedia}
              onSelect={() => setPicker("logo")}
              onRemove={() => clearMedia("logo")}
              disabled={!canEdit || saving}
            />

            <MediaSelectionCard
              label="Favicon"
              description="Small Website icon used by browsers and browser tabs."
              media={faviconMedia}
              onSelect={() => setPicker("favicon")}
              onRemove={() => clearMedia("favicon")}
              disabled={!canEdit || saving}
            />

            <MediaSelectionCard
              label="Open Graph Image"
              description="Social sharing image used when Website pages are shared."
              media={ogImageMedia}
              onSelect={() => setPicker("ogImage")}
              onRemove={() => clearMedia("ogImage")}
              disabled={!canEdit || saving}
            />
          </div>

          <div className="border-t border-slate-200 pt-6">
            <div className="mb-5">
              <p className="text-sm font-semibold text-slate-900">
                Visual Identity
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Define the core colors and preferred font family
                for the customer Website.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label
                  htmlFor="website-primary-color"
                  className="text-sm font-semibold text-slate-800"
                >
                  Primary Color
                </label>

                <div className="mt-2 flex gap-2">
                  <input
                    id="website-primary-color"
                    type="color"
                    value={primaryColor}
                    onChange={(event) =>
                      setPrimaryColor(event.target.value)
                    }
                    disabled={!canEdit || saving}
                    className="h-11 w-14 cursor-pointer rounded-lg border border-slate-200 bg-white p-1 disabled:cursor-not-allowed"
                  />

                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(event) =>
                      setPrimaryColor(event.target.value)
                    }
                    disabled={!canEdit || saving}
                    maxLength={7}
                    placeholder="#0F172A"
                    className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium uppercase text-slate-800 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="website-secondary-color"
                  className="text-sm font-semibold text-slate-800"
                >
                  Secondary Color
                </label>

                <div className="mt-2 flex gap-2">
                  <input
                    id="website-secondary-color"
                    type="color"
                    value={secondaryColor}
                    onChange={(event) =>
                      setSecondaryColor(event.target.value)
                    }
                    disabled={!canEdit || saving}
                    className="h-11 w-14 cursor-pointer rounded-lg border border-slate-200 bg-white p-1 disabled:cursor-not-allowed"
                  />

                  <input
                    type="text"
                    value={secondaryColor}
                    onChange={(event) =>
                      setSecondaryColor(event.target.value)
                    }
                    disabled={!canEdit || saving}
                    maxLength={7}
                    placeholder="#64748B"
                    className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium uppercase text-slate-800 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="website-accent-color"
                  className="text-sm font-semibold text-slate-800"
                >
                  Accent Color
                </label>

                <div className="mt-2 flex gap-2">
                  <input
                    id="website-accent-color"
                    type="color"
                    value={accentColor}
                    onChange={(event) =>
                      setAccentColor(event.target.value)
                    }
                    disabled={!canEdit || saving}
                    className="h-11 w-14 cursor-pointer rounded-lg border border-slate-200 bg-white p-1 disabled:cursor-not-allowed"
                  />

                  <input
                    type="text"
                    value={accentColor}
                    onChange={(event) =>
                      setAccentColor(event.target.value)
                    }
                    disabled={!canEdit || saving}
                    maxLength={7}
                    placeholder="#059669"
                    className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium uppercase text-slate-800 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:bg-slate-50"
                  />
                </div>
              </div>
            </div>

            <div className="mt-5">
              <label
                htmlFor="website-font-family"
                className="text-sm font-semibold text-slate-800"
              >
                Font Family
              </label>

              <input
                id="website-font-family"
                type="text"
                value={fontFamily}
                onChange={(event) =>
                  setFontFamily(event.target.value)
                }
                disabled={!canEdit || saving}
                maxLength={100}
                placeholder="e.g. Inter, Arial, sans-serif"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:bg-slate-50"
              />

              <p className="mt-1.5 text-xs text-slate-400">
                Maximum 100 characters.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs leading-5 text-slate-500">
              {branding
                ? "Existing Website Branding configuration loaded."
                : "No Website Branding configuration has been saved yet."}
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
                    Save Branding
                  </>
                )}
              </Button>
            ) : null}
          </div>
        </div>
      </section>

      <WebsiteMediaPicker
        open={picker !== null}
        selectedId={
          picker === "logo"
            ? logoMedia?.id
            : picker === "favicon"
              ? faviconMedia?.id
              : picker === "ogImage"
                ? ogImageMedia?.id
                : null
        }
        onClose={() => setPicker(null)}
        onSelect={handleMediaSelect}
      />
    </>
  );
}