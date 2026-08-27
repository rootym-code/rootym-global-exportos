/**
 * ============================================================
 * ROOTYM Global Export Platform
 * ============================================================
 * Module      : CMS
 * Feature     : Company Management
 * File        : Branding.tsx
 * Purpose     : Company Branding Section with Media Library
 *               integration for logo and favicon selection.
 * Sprint      : Sprint 10.3
 * Author      : Prem Singh
 * ============================================================
 */

"use client";

import { useState } from "react";

import MediaPicker from "@/components/admin/media/MediaPicker";

import type { CompanySettings } from "../types";

type BrandingAsset = "logo" | "favicon";

interface BrandingProps {
  settings: CompanySettings;
  onChange: (
    section: keyof CompanySettings,
    field: string,
    value: string
  ) => void;
}

interface BrandingMedia {
  id: string;
  fileName: string;
  fileUrl: string;
  altText: string | null;
}

export default function Branding({
  settings,
  onChange,
}: BrandingProps) {
  const [pickerOpen, setPickerOpen] =
    useState(false);

  const [pickerTarget, setPickerTarget] =
    useState<BrandingAsset | null>(null);

  const openMediaPicker = (
    target: BrandingAsset
  ) => {
    setPickerTarget(target);
    setPickerOpen(true);
  };

  const closeMediaPicker = () => {
    setPickerOpen(false);
    setPickerTarget(null);
  };

  const handleMediaSelect = (
    media: BrandingMedia
  ) => {
    if (!pickerTarget) {
      return;
    }

    onChange(
      "company",
      pickerTarget,
      media.fileUrl
    );

    closeMediaPicker();
  };

  const removeAsset = (
    target: BrandingAsset
  ) => {
    onChange(
      "company",
      target,
      ""
    );
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* ============================================================
        Section Header
      ============================================================ */}

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">
          Branding
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Configure your company branding assets that will be used
          throughout the website and customer-facing pages.
        </p>
      </div>

      {/* ============================================================
        Branding Assets
      ============================================================ */}

      <div className="grid gap-6 md:grid-cols-2">

        {/* ============================================================
          Company Logo
        ============================================================ */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Company Logo
          </label>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

            <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-4">
              {settings.company.logo ? (
                <img
                  src={settings.company.logo}
                  alt="Company Logo"
                  className="max-h-28 max-w-full object-contain"
                />
              ) : (
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-500">
                    No logo selected
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Select a logo from the Media Library.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  openMediaPicker("logo")
                }
                className="inline-flex items-center justify-center rounded-xl bg-green-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-200"
              >
                {settings.company.logo
                  ? "Change Logo"
                  : "Select from Media Library"}
              </button>

              {settings.company.logo && (
                <button
                  type="button"
                  onClick={() =>
                    removeAsset("logo")
                  }
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
                >
                  Remove
                </button>
              )}
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Select the primary company logo from your Media Library.
            </p>
          </div>
        </div>

        {/* ============================================================
          Website Favicon
        ============================================================ */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Website Favicon
          </label>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

            <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-4">
              {settings.company.favicon ? (
                <img
                  src={settings.company.favicon}
                  alt="Website Favicon"
                  className="h-16 w-16 object-contain"
                />
              ) : (
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-500">
                    No favicon selected
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Select a favicon from the Media Library.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  openMediaPicker("favicon")
                }
                className="inline-flex items-center justify-center rounded-xl bg-green-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-200"
              >
                {settings.company.favicon
                  ? "Change Favicon"
                  : "Select from Media Library"}
              </button>

              {settings.company.favicon && (
                <button
                  type="button"
                  onClick={() =>
                    removeAsset("favicon")
                  }
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
                >
                  Remove
                </button>
              )}
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Select the website favicon from your Media Library.
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================
        Media Picker
      ============================================================ */}

      <MediaPicker
        open={pickerOpen}
        onClose={closeMediaPicker}
        onSelect={handleMediaSelect}
      />
    </div>
  );
}