/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides one single-page custom-domain deployment
 *          workflow with subscription-aware access control.
 * ============================================================
 */

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Globe2,
  LayoutDashboard,
  LockKeyhole,
  ServerCog,
  Settings,
 } from "lucide-react";

import { requireWorkspaceAccess } from "@/app/lib/workspace/require-workspace-access";
import { getSubscriptionAccessStatus } from "@/lib/services/billing/subscription-access.service";
import DeploymentDomainWorkflow from "@/app/app/workspace/deployment/components/DeploymentDomainWorkflow";

function formatDate(value: Date | null) {
  if (!value) return null;

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

export default async function DomainDeploymentPage() {
  const workspace = await requireWorkspaceAccess();
  const { membership } = workspace;

  const subscriptionAccess = await getSubscriptionAccessStatus(
    membership.tenant.id
  );

  const isTrial =
    subscriptionAccess.subscriptionStatus === "TRIALING";

  const isPaid =
    !isTrial &&
    subscriptionAccess.subscriptionStatus === "ACTIVE" &&
    (subscriptionAccess.status === "ACTIVE" ||
      subscriptionAccess.status === "EXPIRING");

  const isExpiring =
    isPaid && subscriptionAccess.status === "EXPIRING";

  const trialEnd = formatDate(subscriptionAccess.trialEndsAt);
  const paidEnd = formatDate(subscriptionAccess.effectiveEndAt);

  const accessLabel = isTrial
    ? "Free Trial"
    : isPaid
      ? isExpiring
        ? "Paid · Expiring Soon"
        : "Paid · Active"
      : subscriptionAccess.status === "NO_SUBSCRIPTION"
        ? "No Subscription"
        : "Subscription Required";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-5 py-7 lg:px-7 lg:py-8">
        {/* =====================================================
            SIMPLE PAGE HEADER
            ===================================================== */}
        <header className="mb-7">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950">
                <ServerCog className="h-5 w-5 text-white" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                  ROOTYM
                </p>
                <h1 className="text-xl font-bold">
                  Custom Domain Deployment
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/app/workspace"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <ArrowLeft className="h-4 w-4" />
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
            SINGLE DEPLOYMENT CONTROL CENTER
            ===================================================== */}
        <section className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
          {/* Header */}
          <div className="bg-slate-950 px-6 py-7 text-white sm:px-8 sm:py-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                  <Globe2 className="h-4 w-4" />
                  One deployment workflow
                </div>

                <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                  Take your website live
                </h2>

                <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
                  Everything required to connect your custom domain, verify
                  DNS, prepare production, secure the domain and publish the
                  website is managed here.
                </p>
              </div>

              <div
                className={`inline-flex shrink-0 items-center gap-2 self-start rounded-full px-4 py-2 text-sm font-semibold ${
                  isPaid
                    ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/20"
                    : "bg-white/10 text-slate-300 ring-1 ring-white/10"
                }`}
              >
                {isPaid ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <LockKeyhole className="h-4 w-4" />
                )}
                {accessLabel}
              </div>
            </div>
          </div>

          {/* Workspace context — deliberately compact and inside the
              deployment workflow rather than being a separate card. */}
          <div className="border-b border-slate-200 px-6 py-5 sm:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                  Website Workspace
                </p>
                <p className="mt-1 text-base font-bold">
                  {membership.tenant.name}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {membership.tenant.slug}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                {isTrial && trialEnd ? (
                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-600">
                    Trial ends {trialEnd}
                  </span>
                ) : null}

                {isPaid && paidEnd ? (
                  <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700 ring-1 ring-emerald-100">
                    Access through {paidEnd}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          {/* Trial / subscription gate */}
          {!isPaid ? (
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-7 sm:px-8">
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                      <LockKeyhole className="h-5 w-5" />
                    </div>

                    <div>
                      <h3 className="text-lg font-bold">
                        Custom Domain Deployment is locked
                      </h3>

                      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                        {isTrial
                          ? "You can build and prepare your website during the free trial. Connecting your own domain and publishing it requires a paid ROOTYM subscription."
                          : "A paid ROOTYM subscription is required to connect a custom domain and publish your website."}
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/app/billing"
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    {isTrial ? "Upgrade Subscription" : "View Subscription"}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ) : null}

          {/* =====================================================
              DOMAIN DEPLOYMENT WORKFLOW
              The connected-domain component is the single source of
              deployment stages. Each domain owns its own lifecycle.
              ===================================================== */}
          <div className="px-6 py-7 sm:px-8 sm:py-8">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                Connected Domains
              </p>

              <h3 className="mt-2 text-2xl font-bold">
                One place to get your website live
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Connect and manage each custom domain independently. ROOTYM
                reveals the next deployment action only after the required
                readiness check for that domain is complete.
              </p>
            </div>

            <DeploymentDomainWorkflow enabled={isPaid} />
          </div>

          {/* Bottom context bar */}
          <div className="border-t border-slate-200 bg-slate-50 px-6 py-5 sm:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <ServerCog className="h-4 w-4" />
                <span>
                  {isPaid
                    ? "Your paid workspace is eligible for custom-domain deployment."
                    : "Custom-domain deployment becomes available with a paid subscription."}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/app/workspace"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Workspace
                </Link>

                <Link
                  href="/app/billing"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
                >
                  Billing
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
