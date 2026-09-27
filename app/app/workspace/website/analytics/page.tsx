"use client";

/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Purpose:
 *   Marketing & Tracking configuration page for the customer
 *   website.
 *
 * Scope:
 *   - Google Tag Manager
 *   - Google Analytics / Google Tag
 *   - Google Search Console
 *   - Meta Pixel
 *
 * Important:
 *   This page is configuration-focused.
 *   ROOTYM does not recreate Google or Meta reporting here.
 * ============================================================
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Code2,
  Globe2,
  LayoutDashboard,
  Loader2,
  Megaphone,
  Search,
  Settings,
  ShieldCheck,
  Tag,
} from "lucide-react";

type IntegrationStatus = "NOT_CONFIGURED" | "CONFIGURED";

type TrackingIntegration = {
  id: string;
  title: string;
  description: string;
  purpose: string;
  icon: typeof Tag;
  status: IntegrationStatus;
  fieldLabel: string;
  fieldPlaceholder: string;
  helpText: string;
  fieldKey:
    | "gtmContainerId"
    | "googleAnalyticsMeasurementId"
    | "searchConsoleVerificationCode"
    | "metaPixelId";
};

type Configuration = {
  gtmContainerId: string | null;
  googleAnalyticsMeasurementId: string | null;
  searchConsoleVerificationCode: string | null;
  metaPixelId: string | null;
};

type Website = {
  id: string;
  name: string;
  slug: string;
};

const integrations: TrackingIntegration[] = [
  {
    id: "google-tag-manager",
    title: "Google Tag Manager",
    description:
      "Manage website tracking and marketing tags from one Google Tag Manager container.",
    purpose:
      "GTM acts as the tag management layer for your website. It can deploy Google, Meta and other supported marketing tags without repeatedly changing website code.",
    icon: Tag,
    status: "NOT_CONFIGURED",
    fieldLabel: "GTM Container ID",
    fieldPlaceholder: "GTM-XXXXXXX",
    helpText:
      "Enter the Google Tag Manager container ID that belongs to your business.",
    fieldKey: "gtmContainerId",
  },
  {
    id: "google-analytics",
    title: "Google Analytics",
    description:
      "Measure visitors, traffic sources, page activity and website events using Google Analytics.",
    purpose:
      "The Google Tag sends measurement data to your Google Analytics property. ROOTYM enables the website connection; Google provides the analytics and reporting.",
    icon: BarChart3,
    status: "NOT_CONFIGURED",
    fieldLabel: "Google Analytics Measurement ID",
    fieldPlaceholder: "G-XXXXXXXXXX",
    helpText:
      "Enter the GA4 Measurement ID associated with your Google Analytics property.",
    fieldKey: "googleAnalyticsMeasurementId",
  },
  {
    id: "google-search-console",
    title: "Google Search Console",
    description:
      "Connect your website to Google Search Console to monitor search visibility and indexing.",
    purpose:
      "Search Console is independent of Google Analytics. It helps you understand how your website appears in Google Search, including search queries, impressions, clicks and indexing.",
    icon: Search,
    status: "NOT_CONFIGURED",
    fieldLabel: "Search Console Verification",
    fieldPlaceholder: "Verification value",
    helpText:
      "Enter the Search Console verification value that will be used for your website.",
    fieldKey: "searchConsoleVerificationCode",
  },
  {
    id: "meta-pixel",
    title: "Meta Pixel",
    description:
      "Prepare your website for Meta advertising, conversion tracking and audience measurement.",
    purpose:
      "The Meta Pixel sends supported website events to Meta so that Meta Ads can measure website activity and use eligible events for advertising and optimization.",
    icon: Megaphone,
    status: "NOT_CONFIGURED",
    fieldLabel: "Meta Pixel ID",
    fieldPlaceholder: "XXXXXXXXXXXXXXXX",
    helpText:
      "Enter the Meta Pixel ID associated with your Meta Business account.",
    fieldKey: "metaPixelId",
  },
];

function getStatusLabel(status: IntegrationStatus) {
  return status === "CONFIGURED" ? "Configured" : "Not configured";
}

function getStatusClasses(status: IntegrationStatus) {
  if (status === "CONFIGURED") {
    return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  }

  return "bg-slate-100 text-slate-500 ring-slate-200";
}

function getStatusIcon(status: IntegrationStatus) {
  return status === "CONFIGURED" ? CheckCircle2 : ShieldCheck;
}

function emptyConfiguration(): Configuration {
  return {
    gtmContainerId: null,
    googleAnalyticsMeasurementId: null,
    searchConsoleVerificationCode: null,
    metaPixelId: null,
  };
}

export default function WebsiteAnalyticsPage() {
  const [website, setWebsite] = useState<Website | null>(null);
  const [configuration, setConfiguration] =
    useState<Configuration>(emptyConfiguration());

  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<
    TrackingIntegration["fieldKey"] | null
  >(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadConfiguration() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          "/api/workspace/website/configuration",
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          },
        );

        const payload = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            payload?.message ??
              "Unable to load Website Configuration.",
          );
        }

        const loadedWebsite = payload?.data?.website;
        const loadedConfiguration =
          payload?.data?.configuration;

        if (cancelled) {
          return;
        }

        setWebsite(
          loadedWebsite
            ? {
                id: loadedWebsite.id,
                name: loadedWebsite.name,
                slug: loadedWebsite.slug,
              }
            : null,
        );

        setConfiguration({
          gtmContainerId:
            loadedConfiguration?.gtmContainerId ?? null,
          googleAnalyticsMeasurementId:
            loadedConfiguration?.googleAnalyticsMeasurementId ??
            null,
          searchConsoleVerificationCode:
            loadedConfiguration?.searchConsoleVerificationCode ??
            null,
          metaPixelId:
            loadedConfiguration?.metaPixelId ?? null,
        });
      } catch (loadError) {
        if (cancelled) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load Marketing & Tracking configuration.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadConfiguration();

    return () => {
      cancelled = true;
    };
  }, []);

  async function saveIntegration(
    fieldKey: TrackingIntegration["fieldKey"],
  ) {
    try {
      setSavingKey(fieldKey);
      setError(null);
      setSuccess(null);

      const response = await fetch(
        "/api/workspace/website/configuration",
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            [fieldKey]: configuration[fieldKey],
          }),
        },
      );

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          payload?.message ??
            "Unable to save the tracking configuration.",
        );
      }

      const savedConfiguration =
        payload?.data?.configuration;

      if (savedConfiguration) {
        setConfiguration({
          gtmContainerId:
            savedConfiguration.gtmContainerId ?? null,
          googleAnalyticsMeasurementId:
            savedConfiguration.googleAnalyticsMeasurementId ??
            null,
          searchConsoleVerificationCode:
            savedConfiguration.searchConsoleVerificationCode ??
            null,
          metaPixelId:
            savedConfiguration.metaPixelId ?? null,
        });
      }

      const integration = integrations.find(
        (item) => item.fieldKey === fieldKey,
      );

      setSuccess(
        `${integration?.title ?? "Tracking configuration"} saved successfully.`,
      );
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save the tracking configuration.",
      );
    } finally {
      setSavingKey(null);
    }
  }

  function updateConfiguration(
    fieldKey: TrackingIntegration["fieldKey"],
    value: string,
  ) {
    setConfiguration((current) => ({
      ...current,
      [fieldKey]: value || null,
    }));

    setError(null);
    setSuccess(null);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-10">
        {/* =====================================================
            TOP NAVIGATION
            ===================================================== */}

        <header className="mb-8">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950">
                <Tag className="h-5 w-5 text-white" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                  ROOTYM
                </p>

                <p className="text-lg font-bold">
                  Marketing & Tracking
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/app/workspace/website"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Website & Marketing
              </Link>

              <Link
                href="/app/workspace"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <LayoutDashboard className="h-4 w-4" />
                Workspace
              </Link>

              <Link
                href="/settings"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </div>
          </div>
        </header>

        {/* =====================================================
            MODULE HEADER
            ===================================================== */}

        <section className="rounded-3xl bg-slate-950 p-7 text-white shadow-sm sm:p-9">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-400">
                <Tag className="h-4 w-4" />
                Website & Marketing
              </div>

              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Marketing & Tracking
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Configure the Google and Meta services that help your
                website get discovered, measured and used for
                advertising — all from one place.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/10">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Customer Workspace
              </div>

              <div className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 ring-1 ring-white/10">
                Website Services
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            WEBSITE CONTEXT
            ===================================================== */}

        <section className="mt-8">
          <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
                  Website
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  {website?.name ??
                    (loading ? "Loading..." : "Customer Website")}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  {website?.slug ?? ""}
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-5 py-4 ring-1 ring-slate-200">
                <Globe2 className="h-5 w-5 text-slate-600" />

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Website Tracking
                  </p>

                  <p className="text-xs text-slate-500">
                    Google & Meta configuration
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            INTRODUCTION
            ===================================================== */}

        <section className="mt-8">
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-7 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-emerald-100">
                <Globe2 className="h-5 w-5 text-emerald-600" />
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
                  Website Tracking
                </p>

                <h2 className="mt-2 text-xl font-bold text-slate-900">
                  Connect your website to Google and Meta
                </h2>

                <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-600">
                  ROOTYM provides the website configuration needed to
                  connect your external marketing and measurement
                  services. Google and Meta remain responsible for
                  their own analytics, search and advertising
                  platforms.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            GLOBAL FEEDBACK
            ===================================================== */}

        {(error || success) && (
          <section className="mt-8">
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {success && !error && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
                {success}
              </div>
            )}
          </section>
        )}

        {/* =====================================================
            INTEGRATIONS
            ===================================================== */}

        <section className="mt-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
              Integrations
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              Configure your website tracking
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              All supported services are managed from this single
              page. No separate integration pages are required.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {integrations.map((integration) => {
              const Icon = integration.icon;

              const value =
                configuration[integration.fieldKey] ?? "";

              const status: IntegrationStatus = value.trim()
                ? "CONFIGURED"
                : "NOT_CONFIGURED";

              const StatusIcon = getStatusIcon(status);

              const isSaving =
                savingKey === integration.fieldKey;

              return (
                <div
                  key={integration.id}
                  className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200"
                >
                  <div className="flex items-start justify-between gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-100">
                      <Icon className="h-6 w-6 text-emerald-600" />
                    </div>

                    <div
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${getStatusClasses(
                        status,
                      )}`}
                    >
                      <StatusIcon className="h-3.5 w-3.5" />
                      {getStatusLabel(status)}
                    </div>
                  </div>

                  <h3 className="mt-6 text-xl font-bold">
                    {integration.title}
                  </h3>

                  <p className="mt-3 text-sm font-medium leading-6 text-slate-700">
                    {integration.description}
                  </p>

                  <div className="mt-5 rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      What it does
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {integration.purpose}
                    </p>
                  </div>

                  <div className="mt-6">
                    <label
                      htmlFor={`${integration.id}-value`}
                      className="block text-sm font-semibold text-slate-800"
                    >
                      {integration.fieldLabel}
                    </label>

                    <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                      <input
                        id={`${integration.id}-value`}
                        type="text"
                        value={value}
                        onChange={(event) =>
                          updateConfiguration(
                            integration.fieldKey,
                            event.target.value,
                          )
                        }
                        placeholder={
                          integration.fieldPlaceholder
                        }
                        disabled={loading || isSaving}
                        className="h-11 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          void saveIntegration(
                            integration.fieldKey,
                          )
                        }
                        disabled={loading || isSaving}
                        className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Saving
                          </>
                        ) : (
                          <>
                            {value.trim() ? "Save" : "Clear"}
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </div>

                    <p className="mt-2 text-xs leading-5 text-slate-400">
                      {integration.helpText}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =====================================================
            HOW THE SERVICES WORK TOGETHER
            ===================================================== */}

        <section className="mt-8">
          <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950">
                <Code2 className="h-5 w-5 text-white" />
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
                  How it works
                </p>

                <h2 className="mt-2 text-xl font-bold">
                  ROOTYM connects your website. Google and Meta do
                  the reporting.
                </h2>

                <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-500">
                  ROOTYM is not intended to replace Google Analytics,
                  Google Search Console or Meta Ads reporting. The
                  purpose of this module is to make the ROOTYM website
                  ready to send the required tracking information to
                  those external platforms.
                </p>

                <div className="mt-7 grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
                    <div className="flex items-center gap-3">
                      <Tag className="h-5 w-5 text-slate-700" />
                      <p className="font-semibold">GTM</p>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      Manages website tags such as Google and Meta
                      tracking tags.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="h-5 w-5 text-slate-700" />
                      <p className="font-semibold">
                        Google Analytics
                      </p>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      Measures visitors, traffic and website activity
                      through the tenant&apos;s Google Analytics
                      property.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
                    <div className="flex items-center gap-3">
                      <Search className="h-5 w-5 text-slate-700" />
                      <p className="font-semibold">
                        Search Console
                      </p>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      Measures how the website performs in Google
                      Search and helps identify indexing issues.
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
                  <div className="flex items-center gap-3">
                    <Megaphone className="h-5 w-5 text-slate-700" />
                    <p className="font-semibold">Meta Pixel</p>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    Sends supported website events to Meta for
                    advertising measurement, audience building and
                    campaign optimization.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            IMPORTANT NOTE
            ===================================================== */}

        <section className="mt-8">
          <div className="rounded-3xl border border-slate-200 bg-slate-100 p-7 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200">
                <ShieldCheck className="h-5 w-5 text-slate-700" />
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-600">
                  Scope
                </p>

                <h2 className="mt-2 text-xl font-bold text-slate-900">
                  External platforms remain the source of analytics
                  and advertising reports
                </h2>

                <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-600">
                  Google Analytics provides analytics reports.
                  Google Search Console provides Google Search
                  performance reports. Meta provides advertising and
                  event reports. ROOTYM only manages the website-side
                  configuration required to connect these services.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            FOOTER NAVIGATION
            ===================================================== */}

        <footer className="mt-10 border-t border-slate-200 pt-6">
          <div className="flex flex-col gap-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="font-semibold text-slate-700">
                ROOTYM Marketing & Tracking
              </span>

              <span className="ml-2">
                · {website?.name ?? ""}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-5">
              <Link
                href="/app/workspace/website"
                className="inline-flex items-center gap-1.5 transition hover:text-slate-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Website & Marketing
              </Link>

              <Link
                href="/app/workspace"
                className="inline-flex items-center gap-1.5 transition hover:text-slate-900"
              >
                <LayoutDashboard className="h-4 w-4" />
                Workspace
              </Link>

              <Link
                href="/settings"
                className="inline-flex items-center gap-1.5 transition hover:text-slate-900"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}