/**
 * ============================================================
 * ROOTYM SaaS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the authenticated ROOTYM SaaS Customer
 *          Settings page for account, workspace, membership
 *          and subscription information.
 *
 *          Customer authentication is isolated from the
 *          ROOTYM Admin authentication system.
 * ============================================================
 */

import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  CreditCard,
  LogOut,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";

import prisma from "@/lib/prisma";

import {
  CUSTOMER_AUTH_COOKIE_NAME,
  verifyCustomerToken,
} from "@/lib/auth/customer-jwt";

import { SubscriptionStatus } from "@/lib/generated/prisma";

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

function formatDate(
  date: Date | null | undefined
) {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getSubscriptionStatusLabel(
  status: SubscriptionStatus | null | undefined
) {
  switch (status) {
    case SubscriptionStatus.TRIALING:
      return "Trial Active";

    case SubscriptionStatus.ACTIVE:
      return "Active";

    case SubscriptionStatus.PENDING:
      return "Payment Pending";

    case SubscriptionStatus.PAST_DUE:
      return "Payment Attention Required";

    case SubscriptionStatus.CANCELED:
      return "Canceled";

    case SubscriptionStatus.EXPIRED:
      return "Expired";

    default:
      return "Not Started";
  }
}

function getSubscriptionStatusClassName(
  status: SubscriptionStatus | null | undefined
) {
  switch (status) {
    case SubscriptionStatus.TRIALING:
    case SubscriptionStatus.ACTIVE:
      return "border-emerald-200 bg-emerald-50 text-emerald-800";

    case SubscriptionStatus.PENDING:
    case SubscriptionStatus.PAST_DUE:
      return "border-amber-200 bg-amber-50 text-amber-800";

    case SubscriptionStatus.CANCELED:
    case SubscriptionStatus.EXPIRED:
      return "border-slate-200 bg-slate-100 text-slate-700";

    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

function getRoleLabel(role: string) {
  switch (role) {
    case "OWNER":
      return "Owner";

    case "ADMIN":
      return "Administrator";

    case "MEMBER":
      return "Member";

    default:
      return role;
  }
}

export default async function CustomerSettingsPage() {
  const session = await getSession();

  /*
   * SaaS customers must authenticate through the
   * dedicated customer login route.
   *
   * This remains completely separate from /admin/login.
   */
  if (!session) {
    redirect(
      "/login?error=authentication_required"
    );
  }

  /*
   * Resolve the customer's membership using all three
   * identifiers contained in the signed customer JWT.
   *
   * This prevents a valid customer token from being used
   * against another user's membership or another tenant.
   */
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

  /*
   * Customer and tenant must both remain active.
   */
  if (
    !membership ||
    !membership.user.isActive ||
    !membership.tenant.isActive
  ) {
    redirect(
      "/login?error=account_inactive"
    );
  }

  const user = membership.user;
  const tenant = membership.tenant;

  const subscription =
    tenant.subscriptions[0] ?? null;

  /*
   * Server-side logout action.
   *
   * The customer JWT is deleted before redirecting
   * the customer back to the SaaS login page.
   */
  async function signOut() {
    "use server";

    const cookieStore = await cookies();

    cookieStore.delete(
      CUSTOMER_AUTH_COOKIE_NAME
    );

    redirect("/login");
  }

  const subscriptionStatus =
    subscription?.status ?? null;

  const subscriptionStatusLabel =
    getSubscriptionStatusLabel(
      subscriptionStatus
    );

  const subscriptionStatusClassName =
    getSubscriptionStatusClassName(
      subscriptionStatus
    );

  const roleLabel = getRoleLabel(
    membership.role
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
        {/* =====================================================
            HEADER
            ===================================================== */}
        <header className="mb-10 flex flex-col gap-5 border-b border-slate-200 pb-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                aria-label="Back to ROOTYM SaaS workspace"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>

              <div>
                <p className="text-sm font-medium text-emerald-600">
                  ROOTYM SaaS
                </p>

                <h1 className="text-3xl font-semibold tracking-tight">
                  Customer Settings
                </h1>
              </div>
            </div>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              Manage and review your ROOTYM account,
              workspace membership and subscription
              information.
            </p>
          </div>

          <form action={signOut}>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </form>
        </header>

        {/* =====================================================
            ACCOUNT
            ===================================================== */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <User className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-semibold">
                  Account
                </h2>

                <p className="text-sm text-slate-500">
                  Your ROOTYM customer identity.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 px-6 py-6 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Name
              </p>

              <p className="mt-2 text-sm font-medium text-slate-900">
                {user.name || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Email
              </p>

              <div className="mt-2 flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-400" />

                <p className="text-sm font-medium text-slate-900">
                  {user.email}
                </p>
              </div>

              {user.emailVerifiedAt && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Email verified
                </div>
              )}
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Account Status
              </p>

              <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Active
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Account Created
              </p>

              <p className="mt-2 text-sm font-medium text-slate-900">
                {formatDate(user.createdAt)}
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            WORKSPACE
            ===================================================== */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Building2 className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-semibold">
                  Workspace
                </h2>

                <p className="text-sm text-slate-500">
                  Your ROOTYM SaaS workspace details.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 px-6 py-6 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Workspace Name
              </p>

              <p className="mt-2 text-sm font-medium text-slate-900">
                {tenant.name}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Workspace Slug
              </p>

              <p className="mt-2 font-mono text-sm font-medium text-slate-900">
                {tenant.slug}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Your Role
              </p>

              <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                <ShieldCheck className="h-3.5 w-3.5" />
                {roleLabel}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Workspace Status
              </p>

              <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Active
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Workspace Created
              </p>

              <p className="mt-2 text-sm font-medium text-slate-900">
                {formatDate(tenant.createdAt)}
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            SUBSCRIPTION
            ===================================================== */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                <CreditCard className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-semibold">
                  Subscription
                </h2>

                <p className="text-sm text-slate-500">
                  Current ROOTYM SaaS subscription information.
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-6">
            {subscription ? (
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Plan
                  </p>

                  <p className="mt-2 text-sm font-medium text-slate-900">
                    {subscription.plan?.name ??
                      "ROOTYM SaaS"}
                  </p>

                  {subscription.plan?.description && (
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {subscription.plan.description}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Status
                  </p>

                  <div
                    className={`mt-2 inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${subscriptionStatusClassName}`}
                  >
                    {subscriptionStatusLabel}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Started
                  </p>

                  <p className="mt-2 text-sm font-medium text-slate-900">
                    {formatDate(subscription.startedAt)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Trial Ends
                  </p>

                  <p className="mt-2 text-sm font-medium text-slate-900">
                    {formatDate(subscription.trialEndsAt)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Current Period Start
                  </p>

                  <p className="mt-2 text-sm font-medium text-slate-900">
                    {formatDate(
                      subscription.currentPeriodStart
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Current Period End
                  </p>

                  <p className="mt-2 text-sm font-medium text-slate-900">
                    {formatDate(
                      subscription.currentPeriodEnd
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
                <p className="text-sm font-semibold text-amber-900">
                  No subscription found
                </p>

                <p className="mt-1 text-sm leading-6 text-amber-800">
                  Your workspace does not currently have a
                  subscription record.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* =====================================================
            ACTIONS
            ===================================================== */}
        <section className="grid gap-4 md:grid-cols-2">
          <Link
            href="/"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  SaaS Workspace
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Return to your ROOTYM workspace.
                </p>
              </div>

              <ArrowLeft className="h-5 w-5 rotate-180 text-slate-400 transition group-hover:text-slate-700" />
            </div>
          </Link>

          <Link
        href="/app/billing"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Billing & Subscription
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  View billing and subscription options.
                </p>
              </div>

              <CreditCard className="h-5 w-5 text-slate-400 transition group-hover:text-slate-700" />
            </div>
          </Link>
        </section>

        {/* =====================================================
            FOOTER
            ===================================================== */}
        <footer className="mt-10 border-t border-slate-200 pt-6">
          <div className="flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="font-semibold text-slate-700">
                ROOTYM SaaS
              </span>

              <span className="ml-2">
                · {tenant.name}
              </span>
            </div>

            <div className="flex flex-wrap gap-5">
              <Link
                href="/"
                className="hover:text-slate-900"
              >
                Workspace
              </Link>

              <Link
              href="/app/billing"
                className="hover:text-slate-900"
              >
                Billing
              </Link>

              <span className="font-medium text-slate-700">
                Settings
              </span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}