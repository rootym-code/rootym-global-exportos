/**
 * ============================================================
 * ROOTYM ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the ROOTYM admin interface for configuring
 *          billing providers independently across development,
 *          staging and production environments.
 * ============================================================
 */

"use client";

import {
  useEffect,
  useState,
} from "react";

type Environment =
  | "DEVELOPMENT"
  | "STAGING"
  | "PRODUCTION";

interface ProviderConfiguration {
  name: string;
  displayName: string;
  enabled: boolean;
  sortOrder: number;
  configured: boolean;
  supportsPlanChange: boolean;
}

const environments: Array<{
  value: Environment;
  label: string;
  description: string;
}> = [
  {
    value: "DEVELOPMENT",
    label: "Development",
    description:
      "Used for local development and integration testing.",
  },
  {
    value: "STAGING",
    label: "Staging",
    description:
      "Used for pre-production validation and testing.",
  },
  {
    value: "PRODUCTION",
    label: "Production",
    description:
      "Used for live customer payments.",
  },
];

export default function BillingProvidersPage() {
  const [
    environment,
    setEnvironment,
  ] = useState<Environment>(
    "DEVELOPMENT",
  );

  const [
    providers,
    setProviders,
  ] = useState<
    ProviderConfiguration[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState<string | null>(
    null,
  );

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );

  async function loadProviders(
    selectedEnvironment: Environment,
  ) {
    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      const response =
        await fetch(
          `/api/admin/billing/providers?environment=${selectedEnvironment}`,
          {
            method: "GET",
            cache: "no-store",
          },
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ??
            "Unable to load provider configuration.",
        );
      }

      setProviders(
        result.data.providers,
      );
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load provider configuration.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProviders(
      environment,
    );
  }, [environment]);

  function updateProvider(
    providerName: string,
    changes: Partial<ProviderConfiguration>,
  ) {
    setProviders(
      (current) =>
        current.map(
          (provider) =>
            provider.name ===
            providerName
              ? {
                  ...provider,
                  ...changes,
                }
              : provider,
        ),
    );
  }

  async function saveConfiguration() {
    try {
      setSaving(true);
      setError(null);
      setMessage(null);

      const response =
        await fetch(
          "/api/admin/billing/providers",
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              environment,
              providers:
                providers.map(
                  (provider) => ({
                    provider:
                      provider.name,
                    enabled:
                      provider.enabled,
                    displayName:
                      provider.displayName,
                    sortOrder:
                      provider.sortOrder,
                  }),
                ),
            }),
          },
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ??
            "Unable to save provider configuration.",
        );
      }

      setMessage(
        "Billing-provider configuration saved successfully.",
      );

      await loadProviders(
        environment,
      );
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save provider configuration.",
      );
    } finally {
      setSaving(false);
    }
  }

  const selectedEnvironment =
    environments.find(
      (item) =>
        item.value === environment,
    );

  return (
    <div className="space-y-8">
      {/* Header */}

      <div>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-700">
              Billing
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Billing Providers
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Configure which payment providers are
              available to customers in each ROOTYM
              deployment environment.
            </p>
          </div>

          <button
            type="button"
            onClick={
              saveConfiguration
            }
            disabled={
              saving ||
              loading
            }
            className="inline-flex items-center justify-center rounded-xl bg-[#1B5E20] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : "Save Configuration"}
          </button>
        </div>
      </div>

      {/* Environment selector */}

      <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        <div className="grid gap-2 md:grid-cols-3">
          {environments.map(
            (item) => {
              const active =
                item.value ===
                environment;

              return (
                <button
                  key={
                    item.value
                  }
                  type="button"
                  onClick={() =>
                    setEnvironment(
                      item.value,
                    )
                  }
                  className={`rounded-xl px-5 py-4 text-left transition ${
                    active
                      ? "bg-[#1B5E20] text-white shadow-sm"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="font-semibold">
                    {item.label}
                  </div>

                  <div
                    className={`mt-1 text-xs leading-5 ${
                      active
                        ? "text-green-100"
                        : "text-slate-500"
                    }`}
                  >
                    {item.description}
                  </div>
                </button>
              );
            },
          )}
        </div>
      </div>

      {/* Environment information */}

      <div className="rounded-2xl border border-green-200 bg-green-50 px-5 py-4">
        <div className="text-sm font-semibold text-green-900">
          {selectedEnvironment?.label}
        </div>

        <div className="mt-1 text-sm text-green-800">
          {selectedEnvironment?.description}
        </div>
      </div>

      {/* Messages */}

      {message && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* Provider list */}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
          Loading billing providers...
        </div>
      ) : providers.length ===
        0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
          No billing providers are
          registered in the application.
        </div>
      ) : (
        <div className="space-y-5">
          {providers.map(
            (provider) => (
              <div
                key={
                  provider.name
                }
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-semibold text-slate-900">
                        {
                          provider.displayName
                        }
                      </h2>

                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        {
                          provider.name
                        }
                      </span>

                      {provider.supportsPlanChange && (
                        <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                          Plan changes supported
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      {
                        provider.name ===
                        "TEST"
                          ? "Local payment simulator for development and end-to-end billing testing."
                          : provider.name ===
                            "RAZORPAY"
                          ? "Razorpay payment gateway integration."
                          : "Registered ROOTYM billing provider."
                      }
                    </p>
                  </div>

                  <label className="inline-flex shrink-0 cursor-pointer items-center gap-3">
                    <span className="text-sm font-medium text-slate-600">
                      Enabled
                    </span>

                    <input
                      type="checkbox"
                      checked={
                        provider.enabled
                      }
                      onChange={(
                        event,
                      ) =>
                        updateProvider(
                          provider.name,
                          {
                            enabled:
                              event
                                .target
                                .checked,
                          },
                        )
                      }
                      className="h-5 w-5 rounded border-slate-300 text-green-700 focus:ring-green-600"
                    />
                  </label>
                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">
                      Display Name
                    </span>

                    <input
                      type="text"
                      value={
                        provider.displayName
                      }
                      onChange={(
                        event,
                      ) =>
                        updateProvider(
                          provider.name,
                          {
                            displayName:
                              event
                                .target
                                .value,
                          },
                        )
                      }
                      className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">
                      Sort Order
                    </span>

                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={
                        provider.sortOrder
                      }
                      onChange={(
                        event,
                      ) =>
                        updateProvider(
                          provider.name,
                          {
                            sortOrder:
                              Number(
                                event
                                  .target
                                  .value,
                              ),
                          },
                        )
                      }
                      className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                    />
                  </label>
                </div>

                <div className="mt-5 border-t border-slate-100 pt-4">
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500">
                    <span>
                      Registry:{" "}
                      <strong className="text-slate-700">
                        Registered
                      </strong>
                    </span>

                    <span>
                      Database configuration:{" "}
                      <strong className="text-slate-700">
                        {provider.configured
                          ? "Configured"
                          : "Not configured"}
                      </strong>
                    </span>

                    <span>
                      Environment:{" "}
                      <strong className="text-slate-700">
                        {environment}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      )}

      {/* Architecture note */}

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <h3 className="font-semibold text-slate-900">
          Provider configuration model
        </h3>

        <div className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
          <p>
            The application registry determines
            which payment providers ROOTYM supports.
          </p>

          <p>
            This screen determines which registered
            providers are enabled for the selected
            environment.
          </p>

          <p>
            Provider credentials are deployment
            secrets and are not stored in this
            configuration.
          </p>
        </div>
      </div>
    </div>
  );
}