/**
 * ============================================================
 * ROOTYM ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Implements the ROOTYM plan-change billing domain
 *          independently of the payment provider while
 *          maintaining separate upcoming ROOTYM billing dates.
 * ============================================================
 */

import prisma from "@/lib/prisma";

import {
  BillingInterval,
  PlanChangeStatus,
  SubscriptionStatus,
} from "@/lib/generated/prisma";

import type {
  BillingPlanChangeProvider,
} from "./providers/types";

function getTargetPlan(
  billingInterval: BillingInterval,
) {
  return prisma.plan.findFirst({
    where: {
      type: "PAID",
      billingInterval,
      isActive: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

function getUpcomingPeriodEnd(
  periodStart: Date,
  billingInterval: BillingInterval,
) {
  const periodEnd =
    new Date(periodStart);

  if (
    billingInterval ===
    BillingInterval.ANNUAL
  ) {
    periodEnd.setFullYear(
      periodEnd.getFullYear() + 1,
    );
  } else {
    periodEnd.setMonth(
      periodEnd.getMonth() + 1,
    );
  }

  return periodEnd;
}

export async function createPaidPlanChange(
  input: {
    tenantId: string;
    billingInterval: BillingInterval;
    provider: BillingPlanChangeProvider;
  },
) {
  if (!input.tenantId) {
    throw new Error(
      "A valid tenant is required.",
    );
  }

  const currentSubscription =
    await prisma.subscription.findFirst({
      where: {
        tenantId: input.tenantId,
        status:
          SubscriptionStatus.ACTIVE,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        plan: true,
      },
    });

  if (!currentSubscription) {
    throw new Error(
      "An active subscription is required to change billing plans.",
    );
  }

  if (
    currentSubscription.billingInterval ===
    input.billingInterval
  ) {
    throw new Error(
      "The selected billing interval is already the current plan.",
    );
  }

  if (
    !currentSubscription.currentPeriodEnd
  ) {
    throw new Error(
      "The current subscription billing period end is not available.",
    );
  }

  if (
    currentSubscription.currentPeriodEnd <=
    new Date()
  ) {
    throw new Error(
      "The current billing period has already ended. Please refresh and try again.",
    );
  }

  const existingPlanChange =
    await prisma.subscriptionPlanChange.findFirst({
      where: {
        subscriptionId:
          currentSubscription.id,
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
    });

  if (existingPlanChange) {
    if (
      existingPlanChange.status ===
      PlanChangeStatus.PAYMENT_PENDING
    ) {
      throw new Error(
        "A plan-change payment is already being processed for this subscription.",
      );
    }

    throw new Error(
      "A plan change has already been paid for this subscription and is waiting for the current billing period to end.",
    );
  }

  const targetPlan =
    await getTargetPlan(
      input.billingInterval,
    );

  if (!targetPlan) {
    throw new Error(
      `No active paid ${input.billingInterval.toLowerCase()} plan was found.`,
    );
  }

  if (!targetPlan.razorpayPlanId) {
    throw new Error(
      `The ${input.billingInterval.toLowerCase()} plan is not mapped to a Razorpay plan.`,
    );
  }

  /**
   * ROOTYM owns the business-effective date and the
   * upcoming ROOTYM billing period.
   *
   * The current subscription remains unchanged until the
   * plan change becomes effective.
   */
  const upcomingPeriodStart =
    currentSubscription.currentPeriodEnd;

  const upcomingPeriodEnd =
    getUpcomingPeriodEnd(
      upcomingPeriodStart,
      input.billingInterval,
    );

  /**
   * Ask the selected payment provider to initialize
   * the plan-change checkout.
   *
   * Provider-specific subscription timing is intentionally
   * not supplied here. The provider owns its own lifecycle
   * dates, while ROOTYM maintains its business-period dates
   * separately.
   *
   * Payment confirmation is handled separately by the
   * provider verification/reconciliation flow.
   */
  const providerResult =
    await input.provider.createPlanChangeCheckout(
      {
        tenantId:
          input.tenantId,
        fromBillingInterval:
          currentSubscription.billingInterval ??
          BillingInterval.MONTHLY,
        toBillingInterval:
          input.billingInterval,
        amount:
          targetPlan.amount,
        currency:
          targetPlan.currency,
        razorpayPlanId:
          targetPlan.razorpayPlanId,
        razorpayCustomerId:
          currentSubscription.razorpayCustomerId ??
          "",
        totalCount:
          input.billingInterval ===
          BillingInterval.ANNUAL
            ? 1
            : 12,
      },
    );

  if (
    providerResult.providerSubscriptionId
  ) {
    /**
     * The provider subscription ID is required by the
     * existing Razorpay verification flow to locate the
     * pending ROOTYM plan change after Checkout.
     */
  }

  /**
   * The current subscription remains unchanged.
   *
   * ROOTYM business state:
   *
   * Monthly ACTIVE
   *      +
   * Annual checkout initialized
   *      =
   * Monthly still ACTIVE
   * until currentPeriodEnd.
   *
   * The upcoming ROOTYM period is stored separately on
   * SubscriptionPlanChange.
   */
  const planChange =
    await prisma.subscriptionPlanChange.create(
      {
        data: {
          tenantId:
            input.tenantId,
          subscriptionId:
            currentSubscription.id,
          razorpaySubscriptionId:
            providerResult.providerSubscriptionId ??
            null,
          fromPlanId:
            currentSubscription.planId,
          toPlanId:
            targetPlan.id,
          effectiveAt:
            currentSubscription.currentPeriodEnd,
          upcomingPeriodStart,
          upcomingPeriodEnd,
          status:
            PlanChangeStatus.PAYMENT_PENDING,
        },
        include: {
          fromPlan: true,
          toPlan: true,
        },
      },
    );

  return {
    planChange,
    subscription:
      currentSubscription,
    provider:
      providerResult.provider,
    checkout: {
      providerCheckoutId:
        providerResult.providerCheckoutId ??
        null,
      providerSubscriptionId:
        providerResult.providerSubscriptionId ??
        null,
      checkoutKey:
        providerResult.checkoutKey ??
        null,
      checkoutUrl:
        providerResult.checkoutUrl ??
        null,
      amount:
        providerResult.amount,
      currency:
        providerResult.currency,
      status:
        providerResult.status,
      metadata:
        providerResult.metadata ??
        null,
    },
  };
}