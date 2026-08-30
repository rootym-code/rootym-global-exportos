/**
 * Author: Prem Singh
 * Purpose: Implements the ROOTYM plan-change billing domain independently of the payment provider.
 */

import prisma from "@/lib/prisma";
import type { Prisma } from "@/lib/generated/prisma";

import {
  BillingInterval,
  PaymentStatus,
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

  /*
   * Ask the selected payment provider to process
   * the immediate plan-change payment.
   *
   * The provider does not modify ROOTYM billing data.
   */
  const providerResult =
    await input.provider.createPlanChangePayment(
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
      },
    );

  /*
   * The current subscription remains unchanged.
   *
   * This is the critical business rule:
   *
   * Monthly ACTIVE
   *      +
   * Annual payment captured
   *      =
   * Monthly still ACTIVE
   * until currentPeriodEnd.
   */
  const result =
    await prisma.$transaction(
      async (tx) => {
        const planChange =
          await tx.subscriptionPlanChange.create(
            {
              data: {
                tenantId:
                  input.tenantId,

                subscriptionId:
                  currentSubscription.id,

                fromPlanId:
                  currentSubscription.planId,

                toPlanId:
                  targetPlan.id,

                effectiveAt:
                  currentSubscription.currentPeriodEnd!,

                status:
                  providerResult.status ===
                  "CAPTURED"
                    ? PlanChangeStatus.PAYMENT_CONFIRMED
                    : PlanChangeStatus.PAYMENT_PENDING,
              },

              include: {
                fromPlan: true,

                toPlan: true,
              },
            },
          );

        const payment =
          await tx.payment.create({
            data: {
              tenantId:
                input.tenantId,

              subscriptionId:
                currentSubscription.id,

              planChangeId:
                planChange.id,

              provider:
                providerResult.provider,

              providerPaymentId:
                providerResult.providerPaymentId,

              providerSubscriptionId:
                providerResult.providerSubscriptionId ??
                null,

              amount:
                providerResult.amount,

              currency:
                providerResult.currency,

              status:
                providerResult.status ===
                "CAPTURED"
                  ? PaymentStatus.CAPTURED
                  : providerResult.status ===
                      "FAILED"
                    ? PaymentStatus.FAILED
                    : providerResult.status ===
                        "AUTHORIZED"
                      ? PaymentStatus.AUTHORIZED
                      : PaymentStatus.CREATED,

              paidAt:
                providerResult.paidAt ??
                null,

              failedAt:
                providerResult.status ===
                "FAILED"
                  ? new Date()
                  : null,

              failureCode:
                providerResult.failureCode ??
                null,

                failureReason:
                providerResult.failureReason ??
                null,
              
                metadata:
                providerResult.metadata
                  ? (providerResult.metadata as Prisma.InputJsonValue)
                  : undefined,
            },
          });

        return {
          planChange,

          payment,

          subscription:
            currentSubscription,
        };
      },
    );

  return {
    planChange:
      result.planChange,

    payment:
      result.payment,

    subscription:
      result.subscription,

    provider:
      providerResult.provider,
  };
}