/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the customer-facing WhatsApp Business
 *          integration page with connection status and
 *          secure connection management.
 * ============================================================
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CheckCircle2,
  MessageCircle,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Unplug,
} from "lucide-react";

interface WhatsAppIntegration {
  id: string;
  phoneNumberId: string;
  businessAccountId: string;
  displayPhoneNumber: string | null;
  verifiedName: string | null;
  status: string;
  connectedAt: string | null;
  lastVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface WhatsAppIntegrationResponse {
  success: boolean;
  connected: boolean;
  integration: WhatsAppIntegration | null;
  message?: string;
}

export default function WhatsAppIntegrationPage() {
  const [integration, setIntegration] =
    useState<WhatsAppIntegration | null>(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [disconnecting, setDisconnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadIntegration = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "/api/workspace/integrations/whatsapp",
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const data =
        (await response.json()) as WhatsAppIntegrationResponse;

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to load WhatsApp integration."
        );
      }

      setIntegration(data.integration);
      setConnected(data.connected);
    } catch (err) {
      console.error(
        "Failed to load WhatsApp integration:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load WhatsApp integration."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadIntegration();
  }, [loadIntegration]);

  const handleDisconnect = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to disconnect WhatsApp from your ROOTYM workspace?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDisconnecting(true);
      setError(null);

      const response = await fetch(
        "/api/workspace/integrations/whatsapp",
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data =
        (await response.json()) as WhatsAppIntegrationResponse;

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to disconnect WhatsApp."
        );
      }

      setIntegration(data.integration);
      setConnected(false);
    } catch (err) {
      console.error(
        "Failed to disconnect WhatsApp integration:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to disconnect WhatsApp."
      );
    } finally {
      setDisconnecting(false);
    }
  };

  return (
    <div className="min-h-full bg-slate-50 p-6 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100">
                <MessageCircle className="h-6 w-6 text-green-700" />
              </div>

              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                  WhatsApp Integration
                </h1>

                <p className="text-sm text-slate-500">
                  Connect your WhatsApp Business account to
                  your ROOTYM workspace.
                </p>
              </div>
            </div>
          </div>

          <span className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">
            Customer Workspace
          </span>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Main Integration Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  WhatsApp Business
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Manage the WhatsApp Business connection
                  used by your ROOTYM workspace.
                </p>
              </div>

              {!loading && (
                <div
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                    connected
                      ? "bg-green-50 text-green-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      connected
                        ? "bg-green-500"
                        : "bg-slate-400"
                    }`}
                  />
                  {connected
                    ? "Connected"
                    : "Not Connected"}
                </div>
              )}
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex min-h-52 flex-col items-center justify-center text-center">
                <RefreshCw className="mb-3 h-7 w-7 animate-spin text-slate-400" />

                <p className="text-sm font-medium text-slate-700">
                  Checking WhatsApp connection...
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Please wait.
                </p>
              </div>
            ) : connected && integration ? (
              <div className="space-y-6">
                {/* Connected State */}
                <div className="rounded-xl border border-green-200 bg-green-50 p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>

                    <div>
                      <h3 className="font-semibold text-green-900">
                        WhatsApp Business is connected
                      </h3>

                      <p className="mt-1 text-sm text-green-800">
                        Your WhatsApp Business account is
                        connected to this ROOTYM workspace.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Account Details */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 p-4">
                    <div className="mb-2 flex items-center gap-2 text-slate-500">
                      <Smartphone className="h-4 w-4" />

                      <span className="text-xs font-medium uppercase tracking-wide">
                        Phone Number
                      </span>
                    </div>

                    <p className="font-medium text-slate-900">
                      {integration.displayPhoneNumber ||
                        "Connected number"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-4">
                    <div className="mb-2 flex items-center gap-2 text-slate-500">
                      <MessageCircle className="h-4 w-4" />

                      <span className="text-xs font-medium uppercase tracking-wide">
                        Business Name
                      </span>
                    </div>

                    <p className="font-medium text-slate-900">
                      {integration.verifiedName ||
                        "WhatsApp Business"}
                    </p>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-slate-600" />

                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      Secure connection
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Your WhatsApp credentials are managed
                      securely by ROOTYM. Sensitive connection
                      credentials are never displayed in this
                      workspace.
                    </p>
                  </div>
                </div>

                {/* Disconnect */}
                <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      Disconnect WhatsApp
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Disconnect this WhatsApp Business account
                      from your ROOTYM workspace.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleDisconnect}
                    disabled={disconnecting}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {disconnecting ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Unplug className="h-4 w-4" />
                    )}

                    {disconnecting
                      ? "Disconnecting..."
                      : "Disconnect"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex min-h-64 flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50">
                  <MessageCircle className="h-8 w-8 text-green-600" />
                </div>

                <h3 className="text-lg font-semibold text-slate-900">
                  Connect WhatsApp Business
                </h3>

                <p className="mt-2 max-w-lg text-sm leading-6 text-slate-500">
                  Connect your WhatsApp Business account to
                  communicate with customers and manage
                  WhatsApp conversations from your ROOTYM
                  workspace.
                </p>

                <button
                  type="button"
                  disabled
                  className="mt-6 inline-flex cursor-not-allowed items-center gap-2 rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white opacity-60"
                  title="WhatsApp connection flow is being implemented"
                >
                  <MessageCircle className="h-4 w-4" />
                  Connect WhatsApp
                </button>

                <p className="mt-3 text-xs text-slate-400">
                  Secure Meta connection setup will be
                  available in the next integration step.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Information Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <ShieldCheck className="mb-3 h-5 w-5 text-green-600" />

            <h3 className="text-sm font-semibold text-slate-900">
              Secure
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Your connection is associated with your
              customer workspace and protected by Workspace
              authentication.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <MessageCircle className="mb-3 h-5 w-5 text-green-600" />

            <h3 className="text-sm font-semibold text-slate-900">
              Customer Communication
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Use your connected WhatsApp Business account
              for customer communication workflows.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <RefreshCw className="mb-3 h-5 w-5 text-green-600" />

            <h3 className="text-sm font-semibold text-slate-900">
              Workspace Managed
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Integration status can be viewed and managed
              directly from your ROOTYM Workspace.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}