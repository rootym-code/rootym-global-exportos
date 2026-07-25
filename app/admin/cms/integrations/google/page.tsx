"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

import { DEFAULT_GOOGLE_SETTINGS } from "./constants";
import {
  getGoogleSettings,
  saveGoogleSettings,
} from "./api";

import type { GoogleSettings } from "./types";

export default function GoogleIntegrationPage() {
  const [settings, setSettings] =
    useState<GoogleSettings>(
      DEFAULT_GOOGLE_SETTINGS
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
     Load Settings
  ============================================================ */

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getGoogleSettings();

      setSettings(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load Google settings."
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
    field: keyof GoogleSettings,
    value: string
  ) => {
    setSettings((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updated =
        await saveGoogleSettings(settings);

      setSettings(updated);

      setSuccess(
        "Google settings updated successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save Google settings."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Google Integrations
        </h1>

        <p className="mt-2 text-muted-foreground">
          Configure Google Analytics, Google Tag Manager,
          Search Console, Business Profile and reCAPTCHA.
        </p>
      </div>

      {loading ? (
        <div className="flex h-72 items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-green-700" />

            <p className="text-sm text-slate-500">
              Loading Google settings...
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                {error}
              </div>
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
              {success}
            </div>
          )}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-6">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Google Analytics Measurement ID
                </label>

                <input
                  type="text"
                  value={settings.ga4MeasurementId}
                  onChange={(e) =>
                    handleChange(
                      "ga4MeasurementId",
                      e.target.value
                    )
                  }
                  placeholder="G-XXXXXXXXXX"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Google Tag Manager ID
                </label>

                <input
                  type="text"
                  value={settings.gtmContainerId}
                  onChange={(e) =>
                    handleChange(
                      "gtmContainerId",
                      e.target.value
                    )
                  }
                  placeholder="GTM-XXXXXXX"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Search Console Verification
                </label>

                <textarea
                  rows={3}
                  value={settings.searchConsoleVerification}
                  onChange={(e) =>
                    handleChange(
                      "searchConsoleVerification",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Google Business Profile URL
                </label>

                <input
                  type="url"
                  value={settings.businessProfileUrl}
                  onChange={(e) =>
                    handleChange(
                      "businessProfileUrl",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  reCAPTCHA Site Key
                </label>

                <input
                  type="text"
                  value={settings.recaptchaSiteKey}
                  onChange={(e) =>
                    handleChange(
                      "recaptchaSiteKey",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  reCAPTCHA Secret Key
                </label>

                <input
                  type="password"
                  value={settings.recaptchaSecretKey}
                  onChange={(e) =>
                    handleChange(
                      "recaptchaSecretKey",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-xl bg-green-700 px-6 py-3 font-medium text-white hover:bg-green-800 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Google Settings"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}