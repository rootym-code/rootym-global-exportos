"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

import { DEFAULT_WHATSAPP_SETTINGS } from "./constants";
import {
  getWhatsAppSettings,
  saveWhatsAppSettings,
} from "./api";

import type { WhatsAppSettings } from "./types";

export default function WhatsAppIntegrationPage() {
  const [settings, setSettings] =
    useState<WhatsAppSettings>(
      DEFAULT_WHATSAPP_SETTINGS
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
        await getWhatsAppSettings();

      setSettings(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load WhatsApp settings."
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
    field: keyof WhatsAppSettings,
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
        await saveWhatsAppSettings(settings);

      setSettings(updated);

      setSuccess(
        "WhatsApp settings updated successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save WhatsApp settings."
      );
    } finally {
      setSaving(false);
    }
  };

  const renderInput = (
    label: string,
    field: keyof WhatsAppSettings,
    type: string = "text",
    placeholder?: string
  ) => (
    <div>
      <label className="mb-2 block text-sm font-medium">
        {label}
      </label>

      <input
        type={type}
        value={settings[field]}
        onChange={(e) =>
          handleChange(field, e.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-300 px-4 py-3"
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          WhatsApp Cloud API
        </h1>

        <p className="mt-2 text-muted-foreground">
          Configure Meta WhatsApp Cloud API credentials used
          for messaging, webhooks and automation.
        </p>
      </div>

      {loading ? (
        <div className="flex h-72 items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-green-700" />

            <p className="text-sm text-slate-500">
              Loading WhatsApp settings...
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

              {renderInput(
                "Meta App ID",
                "metaAppId"
              )}

              {renderInput(
                "Meta App Secret",
                "metaAppSecret",
                "password"
              )}

              {renderInput(
                "Business Account ID",
                "businessAccountId"
              )}

              {renderInput(
                "Phone Number ID",
                "phoneNumberId"
              )}

              {renderInput(
                "Access Token",
                "accessToken",
                "password"
              )}

              {renderInput(
                "Verify Token",
                "verifyToken"
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-xl bg-green-700 px-6 py-3 font-medium text-white hover:bg-green-800 disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : "Save WhatsApp Settings"}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}