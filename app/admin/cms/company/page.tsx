"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  Loader2,
} from "lucide-react";

import { DEFAULT_COMPANY_SETTINGS } from "./constants";
import {
  getCompanySettings,
  saveCompanySettings,
} from "./api";

import type { CompanySettings } from "./types";

import CompanyDetails from "./components/CompanyDetails";
import ContactDetails from "./components/ContactDetails";
import BusinessDetails from "./components/BusinessDetails";
import Branding from "./components/Branding";
import SocialLinks from "./components/SocialLinks";
import SaveBar from "./components/SaveBar";

export default function CompanyManagementPage() {
  const [settings, setSettings] =
    useState<CompanySettings>(
      DEFAULT_COMPANY_SETTINGS
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /* ============================================================
     Load Company Settings
  ============================================================ */

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getCompanySettings();

      setSettings(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load company settings."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  /* ============================================================
     Handlers
  ============================================================ */

  const handleChange = (
    section: keyof CompanySettings,
    field: string,
    value: string
  ) => {
    setSettings((previous) => ({
      ...previous,
      [section]: {
        ...previous[section],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSuccess("");
      setError("");

      const updated =
        await saveCompanySettings(settings);

      setSettings(updated);

      setSuccess(
        "Company settings updated successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save company settings."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ============================================================
          Header
      ============================================================ */}

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Company Management
        </h1>

        <p className="mt-2 text-muted-foreground">
          Manage your company profile, business information,
          branding, contact details and social media links.
        </p>
      </div>

      {/* ============================================================
          Loading
      ============================================================ */}

      {loading ? (
        <div className="flex h-72 items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-green-700" />

            <p className="text-sm text-slate-500">
              Loading company settings...
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Error */}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                {error}
              </div>
            </div>
          )}

          {/* Success */}

          {success && (
            <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
              {success}
            </div>
          )}

          {/* Company Details */}

          <CompanyDetails
            settings={settings}
            onChange={handleChange}
          />

          {/* Contact Details */}

          <ContactDetails
            settings={settings}
            onChange={handleChange}
          />

          {/* Business Details */}

          <BusinessDetails
            settings={settings}
            onChange={handleChange}
          />

          {/* Branding */}

          <Branding
            settings={settings}
            onChange={handleChange}
          />

          {/* Social Links */}

          <SocialLinks
            settings={settings}
            onChange={handleChange}
          />

          {/* Save Bar */}

          <SaveBar
            saving={saving}
            onSave={handleSave}
          />
        </div>
      )}
    </div>
  );
}