/**
 * Author: Prem Singh
 * Purpose: Provides the authenticated SaaS workspace entry page and subscription status.
 */

import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

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
    return null;
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(date);
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

  const isTrialing =
    subscription?.status ===
    SubscriptionStatus.TRIALING;

  const isActive =
    subscription?.status ===
    SubscriptionStatus.ACTIVE;

  const trialEndsAt =
    subscription?.trialEndsAt ?? null;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

        <header className="mb-10 flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-600">
              ROOTYM SaaS
            </p>

            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              Welcome, {membership.user.name}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {membership.user.email}
            </p>
          </div>

          <div className="rounded-full bg-white px-4 py-2 text-sm font-medium shadow-sm ring-1 ring-slate-200">
            Owner
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">

          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">

            <p className="text-sm font-medium text-slate-500">
              Workspace
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              {membership.tenant.name}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {membership.tenant.slug}
            </p>

            <div className="mt-8">

              {!subscription && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">

                  <h3 className="font-semibold text-amber-900">
                    Choose how you want to start
                  </h3>

                  <p className="mt-2 text-sm text-amber-800">
                    You can start with the available
                    free trial or subscribe immediately.
                  </p>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">

                    <form
                      action="/api/auth/trial"
                      method="POST"
                    >
                      <button
                        type="submit"
                        className="w-full rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 sm:w-auto"
                      >
                        Start Free Trial
                      </button>
                    </form>

                    <Link
                      href="/billing"
                      className="w-full rounded-lg bg-slate-900 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto"
                    >
                      Subscribe Now
                    </Link>

                  </div>

                  <p className="mt-3 text-xs text-slate-500">
                    Subscription billing will be
                    handled through Razorpay.
                  </p>

                </div>
              )}

              {isTrialing && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">

                  <div className="flex items-center gap-2">

                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

                    <h3 className="font-semibold text-emerald-900">
                      Free trial is active
                    </h3>

                  </div>

                  <p className="mt-3 text-sm text-emerald-800">
                    Your ROOTYM free trial is
                    currently active.
                  </p>

                  {trialEndsAt && (
                    <p className="mt-2 text-sm font-medium text-emerald-900">
                      Trial ends on{" "}
                      {formatDate(trialEndsAt)}.
                    </p>
                  )}

                  <Link
                    href="/billing"
                    className="mt-5 inline-block rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    View Subscription
                  </Link>

                </div>
              )}

              {isActive && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">

                  <div className="flex items-center gap-2">

                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

                    <h3 className="font-semibold text-emerald-900">
                      Subscription active
                    </h3>

                  </div>

                  <p className="mt-3 text-sm text-emerald-800">
                    Your ROOTYM subscription is
                    active and your workspace is
                    ready to use.
                  </p>

                  {subscription.plan && (
                    <p className="mt-2 text-sm font-medium text-emerald-900">
                      Plan:{" "}
                      {subscription.plan.name}
                    </p>
                  )}

                </div>
              )}

            </div>
          </div>

          <aside className="rounded-2xl bg-slate-900 p-8 text-white shadow-sm">

            <p className="text-sm font-medium text-emerald-400">
              Your ROOTYM workspace
            </p>

            <h2 className="mt-3 text-2xl font-semibold">
              Build your digital presence.
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-300">
              Your workspace will become the
              control center for your website,
              business content, branding, domain
              and deployment.
            </p>

            <div className="mt-8 space-y-3 text-sm text-slate-300">

              <div className="rounded-lg bg-white/5 px-4 py-3">
                Website & marketing content
              </div>

              <div className="rounded-lg bg-white/5 px-4 py-3">
                Business configuration
              </div>

              <div className="rounded-lg bg-white/5 px-4 py-3">
                Domain & deployment
              </div>

              <div className="rounded-lg bg-white/5 px-4 py-3">
                Subscription & billing
              </div>

            </div>

          </aside>

        </section>

        <footer className="mt-10 border-t border-slate-200 pt-6">

          <div className="flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">

            <span>
              ROOTYM SaaS
            </span>

            <div className="flex gap-5">

              <Link
                href="/settings"
                className="hover:text-slate-900"
              >
                Settings
              </Link>

              <Link
                href="/billing"
                className="hover:text-slate-900"
              >
                Billing
              </Link>

            </div>

          </div>

        </footer>

      </div>
    </main>
  );
}