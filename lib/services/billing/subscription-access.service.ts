/**
 * ============================================================
 * ROOTYM Subscription Lifecycle & Expiry Control
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides one tenant-scoped source of truth for
 *          subscription lifecycle and workspace access status.
 * ============================================================
 */

import prisma from "@/lib/prisma";
import { SubscriptionStatus } from "@/lib/generated/prisma";

export type SubscriptionAccessStatus =
  | "ACTIVE"
  | "EXPIRING"
  | "EXPIRED"
  | "NO_SUBSCRIPTION";

export interface SubscriptionAccessResult {
  hasSubscription: boolean;
  status: SubscriptionAccessStatus;
  subscriptionStatus: SubscriptionStatus | null;
  subscriptionId: string | null;
  planId: string | null;
  planName: string | null;
  planCode: string | null;
  billingInterval: string | null;
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  trialEndsAt: Date | null;
  effectiveEndAt: Date | null;
  daysRemaining: number | null;
  expiresWithinDays: boolean;
}

const EXPIRING_THRESHOLD_DAYS = 7;

function getDaysRemaining(
  effectiveEndAt: Date | null,
  now: Date
): number | null {
  if (!effectiveEndAt) {
    return null;
  }

  const millisecondsRemaining =
    effectiveEndAt.getTime() - now.getTime();

  if (millisecondsRemaining <= 0) {
    return 0;
  }

  return Math.ceil(
    millisecondsRemaining / (24 * 60 * 60 * 1000)
  );
}

function getEffectiveEndAt(subscription: {
  status: SubscriptionStatus;
  trialEndsAt: Date | null;
  currentPeriodEnd: Date | null;
  razorpayCurrentEnd: Date | null;
}): Date | null {
  if (subscription.status === SubscriptionStatus.TRIALING) {
    return subscription.trialEndsAt;
  }

  if (
    subscription.status === SubscriptionStatus.ACTIVE ||
    subscription.status === SubscriptionStatus.PAST_DUE
  ) {
    return (
      subscription.currentPeriodEnd ??
      subscription.razorpayCurrentEnd
    );
  }

  return null;
}

/**
 * Returns the tenant's latest subscription lifecycle state.
 *
 * The query is strictly tenant scoped.
 * PENDING, CANCELED and EXPIRED are not active access states.
 * PAST_DUE remains usable until its effective billing-period end.
 */
export async function getSubscriptionAccessStatus(
  tenantId: string,
  now: Date = new Date()
): Promise<SubscriptionAccessResult> {
  if (!tenantId) {
    throw new Error(
      "A valid tenant is required to resolve subscription access."
    );
  }

  const subscription = await prisma.subscription.findFirst({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      planId: true,
      status: true,
      trialEndsAt: true,
      currentPeriodStart: true,
      currentPeriodEnd: true,
      razorpayCurrentEnd: true,
      billingInterval: true,
      plan: {
        select: {
          id: true,
          code: true,
          name: true,
        },
      },
    },
  });

  if (!subscription) {
    return {
      hasSubscription: false,
      status: "NO_SUBSCRIPTION",
      subscriptionStatus: null,
      subscriptionId: null,
      planId: null,
      planName: null,
      planCode: null,
      billingInterval: null,
      currentPeriodStart: null,
      currentPeriodEnd: null,
      trialEndsAt: null,
      effectiveEndAt: null,
      daysRemaining: null,
      expiresWithinDays: false,
    };
  }

  const effectiveEndAt = getEffectiveEndAt(subscription);
  const daysRemaining = getDaysRemaining(effectiveEndAt, now);

  let accessStatus: SubscriptionAccessStatus;

  if (
    subscription.status === SubscriptionStatus.TRIALING ||
    subscription.status === SubscriptionStatus.ACTIVE ||
    subscription.status === SubscriptionStatus.PAST_DUE
  ) {
    if (
      effectiveEndAt &&
      effectiveEndAt.getTime() <= now.getTime()
    ) {
      accessStatus = "EXPIRED";
    } else if (
      daysRemaining !== null &&
      daysRemaining <= EXPIRING_THRESHOLD_DAYS
    ) {
      accessStatus = "EXPIRING";
    } else {
      accessStatus = "ACTIVE";
    }
  } else {
    accessStatus = "EXPIRED";
  }

  return {
    hasSubscription: true,
    status: accessStatus,
    subscriptionStatus: subscription.status,
    subscriptionId: subscription.id,
    planId: subscription.plan.id,
    planName: subscription.plan.name,
    planCode: subscription.plan.code,
    billingInterval: subscription.billingInterval,
    currentPeriodStart: subscription.currentPeriodStart,
    currentPeriodEnd: subscription.currentPeriodEnd,
    trialEndsAt: subscription.trialEndsAt,
    effectiveEndAt,
    daysRemaining,
    expiresWithinDays:
      daysRemaining !== null &&
      daysRemaining <= EXPIRING_THRESHOLD_DAYS,
  };
}
