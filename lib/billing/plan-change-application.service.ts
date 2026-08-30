/**
 * Author: Prem Singh
 * Purpose: Applies confirmed ROOTYM subscription plan changes when their effective date is reached.
 */

import prisma from "@/lib/prisma";

import {
  BillingInterval,
  PlanChangeStatus,
  SubscriptionStatus,
} from "@/lib/generated/prisma";

function getPeriodEnd(
  start: Date,
  billingInterval: BillingInterval,
) {
  const end = new Date(start);

  if (
    billingInterval ===
    BillingInterval.ANNUAL
  ) {
    end.setFullYear(
      end.getFullYear() + 1,
    );
  } else {
    end.setMonth(
      end.getMonth() + 1,
    );
  }

  return end;
}

export async function applyDuePlanChange(
  input: {
    tenantId: string;
    now?: Date;
  },
) {
  if (!input.tenantId) {
    throw new Error(
      "A valid tenant is required.",
    );
  }

  const now =
    input.now ?? new Date();

  /*
   * Find the oldest confirmed plan change
   * whose effective date has been reached.
   *
   * Only PAYMENT_CONFIRMED changes are eligible.
   *
   * PAYMENT_PENDING must never be applied.
   */
  const planChange =
    await prisma.subscriptionPlanChange.findFirst(
      {
        where: {
          tenantId:
            input.tenantId,

          status:
            PlanChangeStatus.PAYMENT_CONFIRMED,

          effectiveAt: {
            lte: now,
          },
        },

        orderBy: {
          effectiveAt: "asc",
        },

        include: {
          subscription: true,
          fromPlan: true,
          toPlan: true,
        },
      },
    );

  /*
   * Nothing is due.
   *
   * This is a normal idempotent result and should
   * not be treated as an error by the API.
   */
  if (!planChange) {
    return {
      applied: false,
      reason:
        "NO_DUE_PLAN_CHANGE" as const,
      planChange: null,
      subscription: null,
    };
  }

  /*
   * The subscription associated with the scheduled
   * change must still be active.
   */
  if (
    planChange.subscription.status !==
    SubscriptionStatus.ACTIVE
  ) {
    throw new Error(
      "The subscription associated with the scheduled plan change is not active.",
    );
  }

  /*
   * The subscription must still represent the
   * original plan from which this change was created.
   *
   * This prevents silently applying a stale plan
   * change after another billing operation has already
   * modified the subscription.
   */
  if (
    planChange.subscription.planId !==
    planChange.fromPlanId
  ) {
    throw new Error(
      "The scheduled plan change no longer matches the subscription's current plan.",
    );
  }

  /*
   * The target plan must have a valid billing interval.
   */
  if (
    !planChange.toPlan.billingInterval
  ) {
    throw new Error(
      "The target plan does not have a valid billing interval.",
    );
  }

  const targetBillingInterval =
    planChange.toPlan
      .billingInterval;

  const nextPeriodEnd =
    getPeriodEnd(
      planChange.effectiveAt,
      targetBillingInterval,
    );

  /*
   * Apply the plan change and mark it APPLIED
   * inside the same database transaction.
   *
   * The conditional status update acts as the
   * concurrency/idempotency guard:
   *
   * PAYMENT_CONFIRMED -> APPLIED
   *
   * Only one concurrent execution can successfully
   * perform that transition.
   */
  const result =
    await prisma.$transaction(
      async (tx) => {
        const claimed =
          await tx.subscriptionPlanChange.updateMany(
            {
              where: {
                id:
                  planChange.id,

                tenantId:
                  input.tenantId,

                status:
                  PlanChangeStatus.PAYMENT_CONFIRMED,

                effectiveAt: {
                  lte: now,
                },
              },

              data: {
                status:
                  PlanChangeStatus.APPLIED,
              },
            },
          );

        /*
         * Another worker/request may have applied
         * this plan change between the initial lookup
         * and this transaction.
         *
         * Treat that as an idempotent no-op.
         */
        if (claimed.count === 0) {
          return {
            applied: false,
            planChange: null,
            subscription: null,
          };
        }

        /*
         * Update the currently effective subscription
         * only after successfully claiming the plan
         * change.
         */
        const updatedSubscription =
          await tx.subscription.updateMany(
            {
              where: {
                id:
                  planChange.subscriptionId,

                tenantId:
                  input.tenantId,

                status:
                  SubscriptionStatus.ACTIVE,

                planId:
                  planChange.fromPlanId,
              },

              data: {
                planId:
                  planChange.toPlanId,

                billingInterval:
                  targetBillingInterval,

                amount:
                  planChange.toPlan.amount,

                currency:
                  planChange.toPlan.currency,

                currentPeriodStart:
                  planChange.effectiveAt,

                currentPeriodEnd:
                  nextPeriodEnd,

                /*
                 * Only replace the current Razorpay
                 * subscription when the plan change has
                 * a provider subscription ID.
                 *
                 * TEST provider plan changes currently
                 * have no provider subscription ID, so
                 * the existing value must be preserved.
                 */
                ...(planChange.razorpaySubscriptionId
                  ? {
                      razorpaySubscriptionId:
                        planChange.razorpaySubscriptionId,
                    }
                  : {}),
              },
            },
          );

        /*
         * If the subscription could not be updated,
         * throw so the transaction rolls back.
         *
         * This also restores the plan change from
         * APPLIED back to PAYMENT_CONFIRMED.
         */
        if (
          updatedSubscription.count !== 1
        ) {
          throw new Error(
            "The subscription could not be updated while applying the scheduled plan change.",
          );
        }

        const appliedPlanChange =
          await tx.subscriptionPlanChange.findUnique(
            {
              where: {
                id:
                  planChange.id,
              },

              include: {
                fromPlan: true,
                toPlan: true,
              },
            },
          );

        const subscription =
          await tx.subscription.findUnique(
            {
              where: {
                id:
                  planChange.subscriptionId,
              },

              include: {
                plan: true,
              },
            },
          );

        return {
          applied: true,
          planChange:
            appliedPlanChange,
          subscription,
        };
      },
    );

  return {
    applied:
      result.applied,

    reason:
      result.applied
        ? ("APPLIED" as const)
        : ("ALREADY_APPLIED" as const),

    planChange:
      result.planChange,

    subscription:
      result.subscription,
  };
}