/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the authenticated Customer Workspace home
 *          with tenant identity, customer information,
 *          subscription overview and application navigation.
 * ============================================================
 */

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  CircleUserRound,
  Globe2,
  LayoutDashboard,
  PackageOpen,
  ServerCog,
  Settings,
  ShieldCheck,
  CreditCard,
} from "lucide-react";

import prisma from "@/lib/prisma";

import {
  requireWorkspaceAccess,
} from "@/app/lib/workspace/require-workspace-access";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

function formatSubscriptionStatus(
  status: string | undefined
) {
  if (!status) {
    return "No subscription";
  }

  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase()
    );
}

export default async function CustomerWorkspacePage() {
  const workspace = await requireWorkspaceAccess();
  const { membership } = workspace;

  /*
   * Subscription data remains scoped to the authenticated
   * workspace tenant. The shared workspace authorization helper
   * has already established the trusted tenant context.
   */
  const currentSubscription =
    await prisma.subscription.findFirst({
      where: {
        tenantId: membership.tenant.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        plan: true,
      },
    });

  const subscriptionStatus = currentSubscription
    ? formatSubscriptionStatus(
        String(currentSubscription.status)
      )
    : "No subscription";

  const subscriptionPlan =
    currentSubscription?.plan?.name ?? "No active plan";

  const workspaceModules = [
    {
      title: "Website & Marketing",
      description:
        "Manage your ROOTYM website, marketing content and customer-facing presence.",
      icon: Globe2,
      href: "/app/workspace/website",
      status: "Preparing",
    },
    {
      title: "Business Configuration",
      description:
        "Configure business information, operating preferences and workspace settings.",
      icon: Building2,
      href: "/app/workspace/business",
      status: "Preparing",
    },
    {
      title: "ExportOS Applications",
      description:
        "Access the ROOTYM ExportOS applications connected to this workspace.",
      icon: PackageOpen,
      href: "/app/workspace/applications",
      status: "Preparing",
    },
    {
      title: "Domain & Deployment",
      description:
        "Manage domains, deployment configuration and future production controls.",
      icon: ServerCog,
      href: "/app/workspace/deployment",
      status: "Preparing",
    },
  ];

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
                <LayoutDashboard className="h-5 w-5 text-white" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                  ROOTYM
                </p>

                <p className="text-lg font-bold">
                  Customer Workspace
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/app"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Control Center
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
            WORKSPACE HEADER
            ===================================================== */}

        <section className="rounded-3xl bg-slate-950 p-7 text-white shadow-sm sm:p-9">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-400">
                <Building2 className="h-4 w-4" />
                Workspace
              </div>

              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                {membership.tenant.name}
              </h1>

              <p className="mt-2 text-sm text-slate-400">
                {membership.tenant.slug}
              </p>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Your ROOTYM workspace is the central environment
                for managing your business, applications,
                configuration and deployment services.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/10">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                {String(membership.role)}
              </div>

              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300 ring-1 ring-emerald-400/20">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Active
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            WORKSPACE OVERVIEW
            ===================================================== */}

        <section className="mt-8">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
              Workspace Overview
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              Your workspace at a glance
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                  <Building2 className="h-5 w-5 text-slate-700" />
                </div>

                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Workspace Status
              </p>

              <p className="mt-2 text-xl font-bold">
                Active
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                <CircleUserRound className="h-5 w-5 text-slate-700" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Customer
              </p>

              <p className="mt-2 truncate text-xl font-bold">
                {membership.user.name}
              </p>

              <p className="mt-1 truncate text-xs text-slate-500">
                {membership.user.email}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                <CreditCard className="h-5 w-5 text-slate-700" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Subscription
              </p>

              <p className="mt-2 truncate text-xl font-bold">
                {subscriptionPlan}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {subscriptionStatus}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                <ShieldCheck className="h-5 w-5 text-slate-700" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Membership
              </p>

              <p className="mt-2 text-xl font-bold">
                {String(membership.role)}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Workspace access role
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            APPLICATIONS
            ===================================================== */}

        <section className="mt-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
              Workspace Applications
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              Manage your ROOTYM environment
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Your workspace provides a single access point for
              ROOTYM business applications and operational
              services.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {workspaceModules.map((module) => {
              const Icon = module.icon;

              return (
                <div
                  id={
                    module.title === "Website & Marketing"
                      ? "website-marketing"
                      : module.title ===
                          "Business Configuration"
                        ? "business-configuration"
                        : module.title ===
                            "ExportOS Applications"
                          ? "exportos-applications"
                          : "domain-deployment"
                  }
                  key={module.title}
                  className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-100">
                      <Icon className="h-6 w-6 text-emerald-600" />
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500">
                      {module.status}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-bold">
                    {module.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {module.description}
                  </p>

                  <div className="mt-6">
                    <Link
                      href={module.href}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
                    >
                      View workspace area
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =====================================================
            ACCOUNT INFORMATION
            ===================================================== */}

        <section className="mt-8">
          <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
                  Workspace Information
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  Workspace identity
                </h2>
              </div>

              <Link
                href="/settings"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <Settings className="h-4 w-4" />
                Workspace Settings
              </Link>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Workspace
                </p>

                <p className="mt-2 text-sm font-semibold">
                  {membership.tenant.name}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Workspace Slug
                </p>

                <p className="mt-2 break-all text-sm font-semibold">
                  {membership.tenant.slug}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Customer
                </p>

                <p className="mt-2 text-sm font-semibold">
                  {membership.user.name}
                </p>

                <p className="mt-1 break-all text-xs text-slate-500">
                  {membership.user.email}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Created
                </p>

                <p className="mt-2 text-sm font-semibold">
                  {formatDate(membership.tenant.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            SUBSCRIPTION
            ===================================================== */}

        <section className="mt-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-emerald-600" />

                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
                    Subscription
                  </p>
                </div>

                <h2 className="mt-2 text-2xl font-bold">
                  {subscriptionPlan}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Status: {subscriptionStatus}
                </p>
              </div>

              <Link
                href="/app/billing"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Manage Billing
                <ArrowRight className="h-4 w-4" />
              </Link>
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
                ROOTYM Customer Workspace
              </span>

              <span className="ml-2">
                · {membership.tenant.name}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-5">
              <Link
                href="/app"
                className="inline-flex items-center gap-1.5 transition hover:text-slate-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Control Center
              </Link>

              <Link
                href="/app/billing"
                className="inline-flex items-center gap-1.5 transition hover:text-slate-900"
              >
                <CreditCard className="h-4 w-4" />
                Billing
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