/**
 * ============================================================
 * ROOTYM SaaS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the authenticated ROOTYM SaaS Control Page
 *          for customer account, workspace, subscription,
 *          plan, billing and workspace access management.
 * ============================================================
 */

import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  CircleDollarSign,
  Clock3,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import prisma from "@/lib/prisma";

import {
  CUSTOMER_AUTH_COOKIE_NAME,
  verifyCustomerToken,
} from "@/lib/auth/customer-jwt";

import {
  BillingInterval,
  SubscriptionStatus,
} from "@/lib/generated/prisma";

const MONTHLY_PRICE = 15999;
const ANNUAL_PRICE = 189999;

async function getSession() {
  const cookieStore = await cookies();

  const token = cookieStore.get(
    CUSTOMER_AUTH_COOKIE_NAME
  )?.value;

  if (!token) {
    return null;
  }

  try {
    return await verifyCustomerToken(token);
  } catch {
    return null;
  }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(
  date: Date | null | undefined
) {
  if (!date) {
    return null;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getStatusDetails(
  status: SubscriptionStatus | null
) {
  switch (status) {
    case SubscriptionStatus.TRIALING:
      return {
        label: "Trial Active",
        title: "Your free trial is active",
        description:
          "Your 30-day ROOTYM SaaS trial is currently active.",
        className:
          "border-emerald-200 bg-emerald-50 text-emerald-900",
        dotClassName: "bg-emerald-500",
      };

    case SubscriptionStatus.ACTIVE:
      return {
        label: "Subscription Active",
        title: "Your subscription is active",
        description:
          "Your ROOTYM SaaS subscription is active and your workspace is ready to use.",
        className:
          "border-emerald-200 bg-emerald-50 text-emerald-900",
        dotClassName: "bg-emerald-500",
      };

    case SubscriptionStatus.PENDING:
      return {
        label: "Payment Pending",
        title: "Payment is awaiting confirmation",
        description:
          "Your Razorpay subscription has been created. Complete the payment process and wait for confirmation.",
        className:
          "border-amber-200 bg-amber-50 text-amber-900",
        dotClassName: "bg-amber-500",
      };

    case SubscriptionStatus.PAST_DUE:
      return {
        label: "Payment Attention",
        title: "Payment requires attention",
        description:
          "Your subscription has a payment issue. Please review your billing information.",
        className:
          "border-red-200 bg-red-50 text-red-900",
        dotClassName: "bg-red-500",
      };

    case SubscriptionStatus.CANCELED:
      return {
        label: "Canceled",
        title: "Subscription canceled",
        description:
          "Your ROOTYM SaaS subscription has been canceled.",
        className:
          "border-slate-200 bg-slate-50 text-slate-900",
        dotClassName: "bg-slate-400",
      };

    case SubscriptionStatus.EXPIRED:
      return {
        label: "Expired",
        title: "Subscription expired",
        description:
          "Your ROOTYM SaaS subscription is no longer active.",
        className:
          "border-slate-200 bg-slate-50 text-slate-900",
        dotClassName: "bg-slate-400",
      };

    default:
      return {
        label: "Not Started",
        title: "Choose how you want to start",
        description:
          "Start the available free trial or select a paid ROOTYM SaaS plan.",
        className:
          "border-amber-200 bg-amber-50 text-amber-900",
        dotClassName: "bg-amber-500",
      };
  }
}

function getBillingIntervalLabel(
  interval: BillingInterval | null | undefined
) {
  if (interval === BillingInterval.MONTHLY) {
    return "Monthly";
  }

  if (interval === BillingInterval.ANNUAL) {
    return "Annual";
  }

  return "—";
}

export default async function AppPage() {
  const session = await getSession();

  /*
   * SaaS customers must authenticate through
   * the dedicated /login route.
   *
   * This remains separate from /admin/login.
   */
  if (!session) {
    redirect(
      "/login?error=authentication_required"
    );
  }

  const membership =
    await prisma.membership.findFirst({
      where: {
        id: session.membershipId,
        userId: session.userId,
        tenantId: session.tenantId,
      },
      include: {
        user: true,
        tenant: {
          include: {
            subscriptions: {
              orderBy: {
                createdAt: "desc",
              },
              take: 1,
              include: {
                plan: true,
              },
            },
          },
        },
      },
    });

  if (
    !membership ||
    !membership.user.isActive ||
    !membership.tenant.isActive
  ) {
    redirect(
      "/login?error=account_inactive"
    );
  }

  const subscription =
    membership.tenant.subscriptions[0] ??
    null;

  const status =
    subscription?.status ?? null;

  const statusDetails =
    getStatusDetails(status);

  const isTrialing =
    status === SubscriptionStatus.TRIALING;

  const isActive =
    status === SubscriptionStatus.ACTIVE;

  const isPending =
    status === SubscriptionStatus.PENDING;

  const isPastDue =
    status === SubscriptionStatus.PAST_DUE;

  const isInactive =
    status === SubscriptionStatus.CANCELED ||
    status === SubscriptionStatus.EXPIRED;

  const trialEndsAt =
    subscription?.trialEndsAt ?? null;

  const currentPeriodEnd =
    subscription?.currentPeriodEnd ?? null;

  const billingInterval =
    subscription?.billingInterval ?? null;

  const planName =
    subscription?.plan?.name ??
    "No paid plan selected";

  /*
   * Server-side logout action.
   *
   * The customer JWT is cleared before redirecting
   * the user back to the dedicated SaaS login page.
   *
   * This avoids leaving the customer on a JSON response
   * after clicking Sign Out.
   */
  async function signOut() {
    "use server";

    const cookieStore = await cookies();

    cookieStore.delete(
      CUSTOMER_AUTH_COOKIE_NAME
    );

    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

        {/* =====================================================
            ACCOUNT / WORKSPACE HEADER
            ===================================================== */}

        <header className="mb-8 border-b border-slate-200 pb-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
                ROOTYM SaaS Control Center
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Welcome, {membership.user.name}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                {membership.user.email}
              </p>
            </div>

            <div className="flex items-center gap-3">

              <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm ring-1 ring-slate-200">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                Owner
              </div>

              <Link
                href="/settings"
                aria-label="Open account settings"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm ring-1 ring-slate-200 transition hover:text-slate-900"
              >
                <Settings className="h-4 w-4" />
              </Link>

            </div>
          </div>
        </header>

        {/* =====================================================
            WORKSPACE IDENTITY + STATUS
            ===================================================== */}

        <section className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">

          <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 sm:p-8">

            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">

              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                  <Building2 className="h-4 w-4 text-emerald-500" />
                  Workspace
                </div>

                <h2 className="mt-3 text-2xl font-bold tracking-tight">
                  {membership.tenant.name}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  {membership.tenant.slug}
                </p>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Workspace Active
              </div>

            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Account
                </p>

                <p className="mt-2 text-sm font-semibold">
                  {membership.user.isActive
                    ? "Active"
                    : "Inactive"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Workspace
                </p>

                <p className="mt-2 text-sm font-semibold">
                  {membership.tenant.isActive
                    ? "Active"
                    : "Inactive"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Role
                </p>

                <p className="mt-2 text-sm font-semibold">
                  Owner
                </p>
              </div>

            </div>
          </div>

          {/* ===================================================
              CUSTOMER WORKSPACE DESTINATION
              =================================================== */}

          <aside className="rounded-3xl bg-slate-950 p-7 text-white shadow-sm sm:p-8">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 ring-1 ring-emerald-400/20">
              <LayoutDashboard className="h-6 w-6 text-emerald-400" />
            </div>

            <p className="mt-6 text-sm font-semibold text-emerald-400">
              CUSTOMER WORKSPACE
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Your ROOTYM workspace
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-300">
              Your workspace will become the central
              place to manage your website, business
              configuration, applications, domain and
              deployment.
            </p>

            <div className="mt-7 space-y-2">

              <div className="rounded-xl bg-white/5 px-4 py-3 text-sm text-slate-300">
                Website & marketing
              </div>

              <div className="rounded-xl bg-white/5 px-4 py-3 text-sm text-slate-300">
                Business configuration
              </div>

              <div className="rounded-xl bg-white/5 px-4 py-3 text-sm text-slate-300">
                ExportOS applications
              </div>

              <div className="rounded-xl bg-white/5 px-4 py-3 text-sm text-slate-300">
                Domain & deployment
              </div>

            </div>

            <button
              type="button"
              disabled
              className="mt-7 inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-white/10 px-5 py-3.5 text-sm font-semibold text-slate-400 ring-1 ring-white/10"
              title="Customer Workspace will be connected in Phase C"
            >
              Go to Workspace
              <ArrowRight className="h-4 w-4" />
            </button>

            <p className="mt-3 text-center text-xs text-slate-500">
              Workspace application connection will be enabled in Phase C.
            </p>

          </aside>
        </section>

        {/* =====================================================
            SUBSCRIPTION STATUS
            ===================================================== */}

        <section className="mt-6">

          <div
            className={`rounded-3xl border p-7 sm:p-8 ${statusDetails.className}`}
          >

            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

              <div className="flex gap-4">

                <div className="mt-1">
                  <span
                    className={`block h-3 w-3 rounded-full ${statusDetails.dotClassName}`}
                  />
                </div>

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.16em] opacity-70">
                    Subscription Status
                  </p>

                  <h2 className="mt-2 text-2xl font-bold">
                    {statusDetails.title}
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 opacity-80">
                    {statusDetails.description}
                  </p>

                  {isTrialing &&
                    trialEndsAt && (
                      <div className="mt-4 flex items-center gap-2 text-sm font-semibold">
                        <Clock3 className="h-4 w-4" />
                        Trial ends on{" "}
                        {formatDate(trialEndsAt)}
                      </div>
                    )}

                  {isActive &&
                    currentPeriodEnd && (
                      <div className="mt-4 flex items-center gap-2 text-sm font-semibold">
                        <Clock3 className="h-4 w-4" />
                        Current billing period ends on{" "}
                        {formatDate(currentPeriodEnd)}
                      </div>
                    )}

                </div>
              </div>

              <span className="inline-flex w-fit items-center rounded-full bg-white/70 px-4 py-2 text-xs font-bold">
                {statusDetails.label}
              </span>

            </div>

            {(isPending || isPastDue) && (
              <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-current/10 bg-white/50 p-5 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex gap-3">

                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />

                  <div>
                    <p className="font-semibold">
                      Billing action required
                    </p>

                    <p className="mt-1 text-sm opacity-80">
                      Open Billing & Subscription to review or complete the payment process.
                    </p>
                  </div>

                </div>

                <Link
                  href="/app/billing"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Open Billing
                  <ArrowRight className="h-4 w-4" />
                </Link>

              </div>
            )}

            {isInactive && (
              <div className="mt-6">
                <Link
                  href="/app/billing"
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Choose a Plan
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}

          </div>
        </section>

        {/* =====================================================
            PLAN SELECTION
            ===================================================== */}

        <section className="mt-6">

          <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 sm:p-8">

            <div className="flex flex-col gap-4 border-b border-slate-200 pb-7 sm:flex-row sm:items-start sm:justify-between">

              <div>

                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
                  <Sparkles className="h-4 w-4" />
                  Plan Selection
                </div>

                <h2 className="mt-2 text-2xl font-bold tracking-tight">
                  Choose the ROOTYM plan that fits you
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  ROOTYM currently provides one SaaS offering with
                  flexible monthly and annual billing options.
                </p>

              </div>

              <Link
                href="/app/billing"
                className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Manage Plans
                <ArrowRight className="h-4 w-4" />
              </Link>

            </div>

            <div className="mt-7 grid gap-5 md:grid-cols-2">

              {/* Monthly plan */}

              <div
                className={`rounded-2xl border p-6 ${
                  billingInterval ===
                  BillingInterval.MONTHLY
                    ? "border-emerald-400 bg-emerald-50/40"
                    : "border-slate-200"
                }`}
              >

                <div className="flex items-center justify-between gap-3">

                  <div>

                    <p className="text-sm font-semibold text-slate-500">
                      ROOTYM SaaS
                    </p>

                    <h3 className="mt-1 text-xl font-bold">
                      Monthly
                    </h3>

                  </div>

                  {billingInterval ===
                    BillingInterval.MONTHLY &&
                    isActive && (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                        Current
                      </span>
                    )}

                </div>

                <div className="mt-6">

                  <span className="text-3xl font-bold">
                    {formatCurrency(MONTHLY_PRICE)}
                  </span>

                  <span className="ml-2 text-sm text-slate-500">
                    / month
                  </span>

                </div>

                <p className="mt-3 text-sm text-slate-500">
                  Flexible monthly billing through Razorpay.
                </p>

                <Link
                  href="/app/billing"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                >
                  {billingInterval ===
                    BillingInterval.MONTHLY &&
                  isActive
                    ? "Manage Current Plan"
                    : "Select Monthly"}
                  <ArrowRight className="h-4 w-4" />
                </Link>

              </div>

              {/* Annual plan */}

              <div className="relative rounded-2xl border-2 border-emerald-500 p-6">

                <div className="absolute -top-3 left-5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white">
                  Best Value
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">

                  <div>

                    <p className="text-sm font-semibold text-slate-500">
                      ROOTYM SaaS
                    </p>

                    <h3 className="mt-1 text-xl font-bold">
                      Annual
                    </h3>

                  </div>

                  {billingInterval ===
                    BillingInterval.ANNUAL &&
                    isActive && (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                        Current
                      </span>
                    )}

                </div>

                <div className="mt-6">

                  <span className="text-3xl font-bold">
                    {formatCurrency(ANNUAL_PRICE)}
                  </span>

                  <span className="ml-2 text-sm text-slate-500">
                    / year
                  </span>

                </div>

                <p className="mt-3 text-sm text-slate-500">
                  One annual payment through Razorpay.
                </p>

                <Link
                  href="/app/billing"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  {billingInterval ===
                    BillingInterval.ANNUAL &&
                  isActive
                    ? "Manage Current Plan"
                    : "Select Annual"}
                  <ArrowRight className="h-4 w-4" />
                </Link>

              </div>

            </div>
          </div>
        </section>

        {/* =====================================================
            BILLING / PAYMENT STATUS
            ===================================================== */}

        <section className="mt-6 grid gap-6 lg:grid-cols-2">

          <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 sm:p-8">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                <CreditCard className="h-5 w-5 text-slate-700" />
              </div>

              <div>

                <p className="text-sm font-semibold text-slate-500">
                  Billing
                </p>

                <h2 className="text-xl font-bold">
                  Billing & Payments
                </h2>

              </div>
            </div>

            <div className="mt-7 space-y-4">

              <div className="flex items-center justify-between border-b border-slate-100 pb-4">

                <span className="text-sm text-slate-500">
                  Current plan
                </span>

                <span className="text-sm font-semibold text-slate-900">
                  {subscription
                    ? planName
                    : "Not selected"}
                </span>

              </div>

              <div className="flex items-center justify-between border-b border-slate-100 pb-4">

                <span className="text-sm text-slate-500">
                  Billing interval
                </span>

                <span className="text-sm font-semibold text-slate-900">
                  {getBillingIntervalLabel(
                    billingInterval
                  )}
                </span>

              </div>

              <div className="flex items-center justify-between border-b border-slate-100 pb-4">

                <span className="text-sm text-slate-500">
                  Payment provider
                </span>

                <span className="text-sm font-semibold text-slate-900">
                  Razorpay
                </span>

              </div>

              <div className="flex items-center justify-between">

                <span className="text-sm text-slate-500">
                  Payment status
                </span>

                <span className="inline-flex items-center gap-2 text-sm font-semibold">

                  <span
                    className={`h-2 w-2 rounded-full ${
                      isPending
                        ? "bg-amber-500"
                        : isPastDue
                        ? "bg-red-500"
                        : isActive ||
                          isTrialing
                        ? "bg-emerald-500"
                        : "bg-slate-400"
                    }`}
                  />

                  {isPending
                    ? "Pending"
                    : isPastDue
                    ? "Action Required"
                    : isActive
                    ? "Active"
                    : isTrialing
                    ? "Trial"
                    : "Inactive"}

                </span>

              </div>

            </div>

            <Link
              href="/app/billing"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Open Billing & Subscription
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>

          <div className="rounded-3xl bg-slate-900 p-7 text-white shadow-sm sm:p-8">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15">
              <CircleDollarSign className="h-5 w-5 text-emerald-400" />
            </div>

            <p className="mt-6 text-sm font-semibold text-emerald-400">
              ACCOUNT OVERVIEW
            </p>

            <h2 className="mt-2 text-xl font-bold">
              Your ROOTYM account
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              Manage your subscription, billing and
              account preferences from the SaaS Control
              Center.
            </p>

            <div className="mt-7 space-y-3">

              <Link
                href="/app/billing"
                className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
              >
                <span>Billing & Subscription</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/settings"
                className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
              >
                <span>Account Settings</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

            </div>
          </div>

        </section>

        {/* =====================================================
            FOOTER ACTIONS
            ===================================================== */}

        <footer className="mt-10 border-t border-slate-200 pt-6">

          <div className="flex flex-col gap-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <span className="font-semibold text-slate-700">
                ROOTYM SaaS
              </span>

              <span className="ml-2">
                · {membership.tenant.name}
              </span>

            </div>

            <div className="flex flex-wrap items-center gap-5">

              <Link
                href="/settings"
                className="inline-flex items-center gap-1.5 transition hover:text-slate-900"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>

              <Link
                href="/app/billing"
                className="inline-flex items-center gap-1.5 transition hover:text-slate-900"
              >
                <CreditCard className="h-4 w-4" />
                Billing
              </Link>

              <form action={signOut}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 transition hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </form>

            </div>
          </div>
        </footer>

      </div>
    </main>
  );
}