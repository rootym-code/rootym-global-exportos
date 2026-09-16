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
  ShieldCheck,
  CloudCog,
  Workflow,
} from "lucide-react";

import { requireWorkspaceAccess } from "@/app/lib/workspace/require-workspace-access";
import { getSubscriptionAccessStatus } from "@/lib/services/billing/subscription-access.service";

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

  const steps = [
    {
      number: "01",
      title: "Connect Domain",
      description:
        "Enter the custom domain you want to use for this ROOTYM website.",
      icon: Globe2,
    },
    {
      number: "02",
      title: "Verify DNS",
      description:
        "ROOTYM will show the DNS records required to connect the domain and verify ownership.",
      icon: ShieldCheck,
    },
    {
      number: "03",
      title: "Prepare Production",
      description:
        "ROOTYM checks the website and prepares its production deployment target.",
      icon: CloudCog,
    },
    {
      number: "04",
      title: "Secure Domain",
      description:
        "Complete SSL and secure-domain readiness before the website is published.",
      icon: LockKeyhole,
    },
    {
      number: "05",
      title: "Publish Website",
      description:
        "Publish the approved website to the verified custom domain.",
      icon: Workflow,
    },
  ];

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

          {/* Domain workflow */}
          <div className="px-6 py-7 sm:px-8 sm:py-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                  Deployment Steps
                </p>

                <h3 className="mt-2 text-2xl font-bold">
                  One place to get your website live
                </h3>
              </div>

              <div
                className={`inline-flex items-center gap-2 self-start rounded-full px-3 py-1.5 text-xs font-semibold ${
                  isPaid
                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                    : "bg-slate-100 text-slate-400 ring-1 ring-slate-200"
                }`}
              >
                {isPaid ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <LockKeyhole className="h-3.5 w-3.5" />
                )}
                {isPaid ? "Deployment enabled" : "Upgrade required"}
              </div>
            </div>

            <div className="mt-7 divide-y divide-slate-200 rounded-2xl border border-slate-200">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isFirst = index === 0;

                return (
                  <div
                    key={step.number}
                    className={`flex flex-col gap-5 px-5 py-6 sm:flex-row sm:items-center sm:px-6 ${
                      isPaid ? "bg-white" : "bg-slate-50/70"
                    }`}
                  >
                    <div className="flex shrink-0 items-center gap-4 sm:w-52">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl ring-1 ${
                          isPaid
                            ? "bg-emerald-50 text-emerald-600 ring-emerald-100"
                            : "bg-white text-slate-400 ring-slate-200"
                        }`}
                      >
                        {isPaid ? (
                          <Icon className="h-5 w-5" />
                        ) : (
                          <LockKeyhole className="h-5 w-5" />
                        )}
                      </div>

                      <div>
                        <p className="text-xs font-bold text-slate-400">
                          STEP {step.number}
                        </p>
                        <p className="mt-1 font-bold text-slate-900">
                          {step.title}
                        </p>
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-6 text-slate-600">
                        {step.description}
                      </p>
                    </div>

                    <div className="shrink-0 sm:w-44 sm:text-right">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                          isPaid
                            ? "text-emerald-700"
                            : "text-slate-400"
                        }`}
                      >
                        {isPaid ? (
                          isFirst ? (
                            <>
                              Start here
                              <ChevronRight className="h-3.5 w-3.5" />
                            </>
                          ) : (
                            "Available after previous step"
                          )
                        ) : (
                          "Locked until upgrade"
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Paid customer entry point */}
            {isPaid ? (
              <div className="mt-7 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
                      Ready to begin
                    </p>
                    <h4 className="mt-2 text-lg font-bold text-slate-900">
                      Connect your custom domain
                    </h4>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      The domain connection, DNS instructions, verification,
                      production readiness, SSL and publishing controls will
                      stay in this same workflow.
                    </p>
                  </div>

                  <div className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200">
                    <Globe2 className="h-4 w-4" />
                    Domain setup
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            ) : null}
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
