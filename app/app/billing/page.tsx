/**
 * Author: Prem Singh
 * Purpose: Provides the ROOTYM SaaS billing page with the single paid plan, monthly/annual billing options, active-subscription plan changes, and scheduled plan-change state.
 */

import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import prisma from "@/lib/prisma";

import {
  BillingInterval,
  PlanChangeStatus,
  SubscriptionStatus,
} from "@/lib/generated/prisma";

import {
  verifyCustomerToken,
  CUSTOMER_AUTH_COOKIE_NAME,
} from "@/lib/auth/customer-jwt";

import BillingCheckout from "./components/BillingCheckout";
import BillingPlanChangeButton from "./components/BillingPlanChangeButton";

const MONTHLY_PRICE = 15999;
const ANNUAL_PRICE = 189999;

async function getSession() {
  const cookieStore = await cookies();

  const token = cookieStore.get(
    CUSTOMER_AUTH_COOKIE_NAME,
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
  date: Date | null | undefined,
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

function getSubscriptionMessage(
  status: SubscriptionStatus,
) {
  switch (status) {
    case SubscriptionStatus.PENDING:
      return {
        title: "Payment is awaiting confirmation",
        description:
          "Your Razorpay subscription has been created. Complete the payment process and wait for confirmation.",
        className:
          "border-amber-200 bg-amber-50 text-amber-900",
      };

    case SubscriptionStatus.TRIALING:
      return {
        title: "Your free trial is active",
        description:
          "Your 30-day ROOTYM trial is currently active. You can subscribe before the trial ends.",
        className:
          "border-emerald-200 bg-emerald-50 text-emerald-900",
      };

    case SubscriptionStatus.ACTIVE:
      return {
        title: "Your subscription is active",
        description:
          "Your ROOTYM SaaS subscription is active and your workspace is ready to use.",
        className:
          "border-emerald-200 bg-emerald-50 text-emerald-900",
      };

    case SubscriptionStatus.PAST_DUE:
      return {
        title: "Payment requires attention",
        description:
          "Your subscription has a payment issue. Please complete the required payment action.",
        className:
          "border-red-200 bg-red-50 text-red-900",
      };

    case SubscriptionStatus.CANCELED:
      return {
        title: "Subscription canceled",
        description:
          "Your ROOTYM SaaS subscription has been canceled.",
        className:
          "border-slate-200 bg-slate-50 text-slate-900",
      };

    case SubscriptionStatus.EXPIRED:
      return {
        title: "Subscription expired",
        description:
          "Your ROOTYM SaaS subscription is no longer active.",
        className:
          "border-slate-200 bg-slate-50 text-slate-900",
      };

    default:
      return {
        title: "Subscription status",
        description:
          "Review your ROOTYM billing information below.",
        className:
          "border-slate-200 bg-slate-50 text-slate-900",
      };
  }
}

export default async function BillingPage() {
  const session = await getSession();

  if (!session) {
    redirect(
      "/app/login?error=authentication_required",
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
      "/app/login?error=account_inactive",
    );
  }

  const subscription =
    membership.tenant.subscriptions[0] ??
    null;

  /*
   * A paid plan change is represented separately from
   * the active subscription.
   *
   * The active subscription intentionally remains unchanged
   * until the plan change reaches its effectiveAt date.
   *
   * PAYMENT_PENDING and PAYMENT_CONFIRMED are both considered
   * active plan-change states for the billing UI.
   */
  const planChange = subscription
    ? await prisma.subscriptionPlanChange.findFirst({
        where: {
          subscriptionId: subscription.id,
          status: {
            in: [
              PlanChangeStatus.PAYMENT_PENDING,
              PlanChangeStatus.PAYMENT_CONFIRMED,
            ],
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          toPlan: true,
        },
      })
    : null;

  const status =
    subscription?.status ?? null;

  const isActive =
    status === SubscriptionStatus.ACTIVE;

  const isTrialing =
    status === SubscriptionStatus.TRIALING;

  const isPending =
    status === SubscriptionStatus.PENDING;

  const isPastDue =
    status === SubscriptionStatus.PAST_DUE;

  /*
   * Initial checkout remains available during
   * the active trial.
   *
   * Once a paid subscription is active, the
   * alternate plan uses the dedicated plan-change
   * workflow instead of initial checkout.
   *
   * An existing pending/confirmed plan change also
   * prevents another purchase from being initiated.
   */
  const checkoutDisabled =
    isActive ||
    isPending ||
    isPastDue ||
    Boolean(planChange);

  const isCurrentMonthly =
    isActive &&
    subscription?.billingInterval ===
      BillingInterval.MONTHLY;

  const isCurrentAnnual =
    isActive &&
    subscription?.billingInterval ===
      BillingInterval.ANNUAL;

  const isScheduledAnnual =
    planChange?.toPlan.billingInterval ===
    BillingInterval.ANNUAL;

  const isScheduledMonthly =
    planChange?.toPlan.billingInterval ===
    BillingInterval.MONTHLY;

  const isPlanChangePaymentPending =
    planChange?.status ===
    PlanChangeStatus.PAYMENT_PENDING;

  const isPlanChangePaymentConfirmed =
    planChange?.status ===
    PlanChangeStatus.PAYMENT_CONFIRMED;

  const trialEndsAt =
    subscription?.trialEndsAt ?? null;

  const currentPeriodEnd =
    subscription?.currentPeriodEnd ?? null;

  const planChangeEffectiveAt =
    planChange?.effectiveAt ?? null;

  const statusMessage =
    status
      ? getSubscriptionMessage(status)
      : null;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
        <header className="mb-10 flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
             href="/"
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
            >
              ← ROOTYM SaaS
            </Link>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              Billing & Subscription
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage your ROOTYM SaaS subscription.
            </p>
          </div>

          <div className="rounded-full bg-white px-4 py-2 text-sm font-medium shadow-sm ring-1 ring-slate-200">
            {membership.tenant.name}
          </div>
        </header>

        {statusMessage && (
          <section
            className={`mb-8 rounded-2xl border p-6 ${statusMessage.className}`}
          >
            <h2 className="font-semibold">
              {statusMessage.title}
            </h2>

            <p className="mt-2 text-sm">
              {statusMessage.description}
            </p>

            {isTrialing &&
              trialEndsAt && (
                <p className="mt-3 text-sm font-medium">
                  Trial ends on{" "}
                  {formatDate(trialEndsAt)}.
                </p>
              )}

            {isActive &&
              currentPeriodEnd && (
                <p className="mt-3 text-sm font-medium">
                  Current billing period ends on{" "}
                  {formatDate(
                    currentPeriodEnd,
                  )}
                  .
                </p>
              )}

            {isActive &&
              planChange &&
              planChangeEffectiveAt && (
                <div className="mt-4 rounded-xl border border-emerald-300 bg-white/60 px-4 py-3">
                  <p className="text-sm font-semibold">
                    {isPlanChangePaymentConfirmed
                      ? "A billing plan change is scheduled."
                      : "A billing plan change payment is being processed."}
                  </p>

                  <p className="mt-1 text-sm">
                    {isScheduledAnnual
                      ? "Your Annual plan"
                      : "Your Monthly plan"}{" "}
                    will become effective on{" "}
                    <span className="font-semibold">
                      {formatDate(
                        planChangeEffectiveAt,
                      )}
                    </span>
                    .
                  </p>
                </div>
              )}
          </section>
        )}

        <section className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col gap-5 border-b border-slate-200 pb-7 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600">
                  ROOTYM SaaS
                </p>

                <h2 className="mt-2 text-3xl font-semibold">
                  One powerful plan
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                  Everything you need to build and
                  manage your digital business presence
                  from one ROOTYM workspace.
                </p>
              </div>

              <div className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                Single Plan
              </div>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {/* Monthly */}
              <div
                className={`rounded-2xl border p-6 ${
                  isScheduledMonthly
                    ? "border-amber-400 bg-amber-50/30"
                    : "border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    Monthly
                  </h3>

                  <div className="flex items-center gap-2">
                    {isCurrentMonthly && (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                        Current
                      </span>
                    )}

                    {isScheduledMonthly && (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                        Scheduled
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-5">
                  <span className="text-4xl font-bold tracking-tight">
                    {formatCurrency(
                      MONTHLY_PRICE,
                    )}
                  </span>

                  <span className="ml-2 text-sm text-slate-500">
                    / month
                  </span>
                </div>

                <p className="mt-3 text-sm text-slate-500">
                  Flexible monthly billing.
                </p>

                {isScheduledMonthly &&
                  planChangeEffectiveAt && (
                    <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4">
                      <p className="text-sm font-semibold text-amber-900">
                        Monthly plan scheduled
                      </p>

                      <p className="mt-1 text-xs leading-5 text-amber-800">
                        This plan will become effective
                        on{" "}
                        <span className="font-semibold">
                          {formatDate(
                            planChangeEffectiveAt,
                          )}
                        </span>
                        .
                      </p>
                    </div>
                  )}

                {isCurrentAnnual ? (
                  <BillingPlanChangeButton
                    billingInterval="MONTHLY"
                  />
                ) : (
                  !isActive &&
                  !isPending &&
                  !isPastDue &&
                  !planChange && (
                    <BillingCheckout
                      billingInterval="MONTHLY"
                      price={MONTHLY_PRICE}
                      disabled={
                        checkoutDisabled
                      }
                      current={
                        isCurrentMonthly
                      }
                    />
                  )
                )}
              </div>

              {/* Annual */}
              <div
                className={`relative rounded-2xl border-2 p-6 ${
                  isScheduledAnnual
                    ? "border-amber-400 bg-amber-50/20"
                    : "border-emerald-500"
                }`}
              >
                <div className="absolute -top-3 left-5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                  Best Value
                </div>

                <div className="flex items-center justify-between pt-1">
                  <h3 className="text-lg font-semibold">
                    Annual
                  </h3>

                  <div className="flex items-center gap-2">
                    {isCurrentAnnual && (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                        Current
                      </span>
                    )}

                    {isScheduledAnnual && (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                        Scheduled
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-5">
                  <span className="text-4xl font-bold tracking-tight">
                    {formatCurrency(
                      ANNUAL_PRICE,
                    )}
                  </span>

                  <span className="ml-2 text-sm text-slate-500">
                    / year
                  </span>
                </div>

                <p className="mt-3 text-sm text-slate-500">
                  One annual payment.
                </p>

                {isScheduledAnnual &&
                  planChangeEffectiveAt && (
                    <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4">
                      <p className="text-sm font-semibold text-amber-900">
                        Annual plan scheduled
                      </p>

                      <p className="mt-1 text-xs leading-5 text-amber-800">
                        {isPlanChangePaymentConfirmed
                          ? "Payment confirmed. "
                          : "Payment is being processed. "}
                        This plan will become effective
                        on{" "}
                        <span className="font-semibold">
                          {formatDate(
                            planChangeEffectiveAt,
                          )}
                        </span>
                        .
                      </p>
                    </div>
                  )}

                {isCurrentMonthly &&
                !planChange ? (
                  <BillingPlanChangeButton
                    billingInterval="ANNUAL"
                  />
                ) : (
                  !isActive &&
                  !isPending &&
                  !isPastDue &&
                  !planChange && (
                    <BillingCheckout
                      billingInterval="ANNUAL"
                      price={ANNUAL_PRICE}
                      disabled={
                        checkoutDisabled
                      }
                      current={
                        isCurrentAnnual
                      }
                    />
                  )
                )}
              </div>
            </div>

            <div className="mt-8 rounded-xl bg-slate-50 p-5">
              <h3 className="font-semibold">
                Included with ROOTYM SaaS
              </h3>

              <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                <div>
                  ✓ Website & marketing content
                </div>

                <div>
                  ✓ Business configuration
                </div>

                <div>
                  ✓ Branding management
                </div>

                <div>
                  ✓ Domain & deployment
                </div>

                <div>
                  ✓ SaaS workspace management
                </div>

                <div>
                  ✓ Subscription & billing
                </div>
              </div>
            </div>
          </div>

          <aside className="rounded-2xl bg-slate-900 p-7 text-white shadow-sm">
            <p className="text-sm font-medium text-emerald-400">
              Workspace
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              {membership.tenant.name}
            </h2>

            <p className="mt-2 break-all text-sm text-slate-400">
              {membership.user.email}
            </p>

            <div className="mt-7 border-t border-white/10 pt-6">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Subscription
              </p>

              <p className="mt-2 text-sm font-medium">
                {subscription
                  ? subscription.plan.name
                  : "No subscription"}
              </p>

              {subscription && (
                <div className="mt-4 space-y-2 text-sm text-slate-300">
                  <div className="flex justify-between gap-4">
                    <span>Status</span>

                    <span className="font-medium text-white">
                      {subscription.status}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span>Billing</span>

                    <span className="font-medium text-white">
                      {subscription.billingInterval ===
                      BillingInterval.ANNUAL
                        ? "Annual"
                        : subscription.billingInterval ===
                            BillingInterval.MONTHLY
                          ? "Monthly"
                          : "—"}
                    </span>
                  </div>

                  {subscription.amount !==
                    null && (
                    <div className="flex justify-between gap-4">
                      <span>Amount</span>

                      <span className="font-medium text-white">
                        {formatCurrency(
                          subscription.amount,
                        )}
                      </span>
                    </div>
                  )}

                  {isActive &&
                    currentPeriodEnd && (
                      <div className="flex justify-between gap-4">
                        <span>Period Ends</span>

                        <span className="font-medium text-white">
                          {formatDate(
                            currentPeriodEnd,
                          )}
                        </span>
                      </div>
                    )}
                </div>
              )}
            </div>

            {planChange &&
              planChangeEffectiveAt && (
                <div className="mt-8 border-t border-white/10 pt-6">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Scheduled Change
                  </p>

                  <p className="mt-2 text-sm font-semibold text-white">
                    {planChange.toPlan.name}
                  </p>

                  <div className="mt-4 space-y-2 text-sm text-slate-300">
                    <div className="flex justify-between gap-4">
                      <span>Status</span>

                      <span className="font-medium text-white">
                        {isPlanChangePaymentConfirmed
                          ? "Payment Confirmed"
                          : isPlanChangePaymentPending
                            ? "Payment Pending"
                            : planChange.status}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span>Billing</span>

                      <span className="font-medium text-white">
                        {planChange.toPlan
                          .billingInterval ===
                        BillingInterval.ANNUAL
                          ? "Annual"
                          : planChange.toPlan
                                .billingInterval ===
                              BillingInterval.MONTHLY
                            ? "Monthly"
                            : "—"}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span>Effective</span>

                      <span className="font-medium text-white">
                        {formatDate(
                          planChangeEffectiveAt,
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}

            <div className="mt-8 border-t border-white/10 pt-6">
              <p className="text-sm leading-6 text-slate-400">
                ROOTYM offers one SaaS plan with
                monthly or annual billing. You can
                change your billing interval by
                completing payment for the new plan.
                The new plan becomes effective when
                the current billing period ends.
              </p>
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
             href="/"
                className="hover:text-slate-900"
              >
                Workspace
              </Link>

              <Link
           href="/settings"
                className="hover:text-slate-900"
              >
                Settings
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}