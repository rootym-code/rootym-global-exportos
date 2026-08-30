/**
 * Author: Prem Singh
 * Purpose: Starts the optional 30-day SaaS trial for an existing customer tenant.
 */

import prisma from "@/lib/prisma";
import { SubscriptionStatus } from "@/lib/generated/prisma";

const TRIAL_PLAN_CODE = "TRIAL_30_DAYS";
const TRIAL_DAYS = 30;

export async function startTrial(tenantId: string) {
  if (!tenantId) {
    throw new Error(
      "A valid tenant is required to start a trial."
    );
  }

  return prisma.$transaction(async (tx) => {
    /*
     * 1. Verify that the tenant exists and is active.
     */
    const tenant = await tx.tenant.findUnique({
      where: {
        id: tenantId,
      },
    });

    if (!tenant) {
      throw new Error("Tenant not found.");
    }

    if (!tenant.isActive) {
      throw new Error(
        "This workspace is inactive."
      );
    }

    /*
     * 2. Prevent starting a trial when the tenant
     *    already has an active subscription.
     */
    const activeSubscription =
      await tx.subscription.findFirst({
        where: {
          tenantId,
          status: SubscriptionStatus.ACTIVE,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    if (activeSubscription) {
      throw new Error(
        "This workspace already has an active subscription."
      );
    }

    /*
     * 3. Prevent starting another trial when the
     *    tenant has an existing trial subscription.
     *
     *    This deliberately checks TRIALING and EXPIRED.
     *    An expired trial cannot be restarted.
     */
    const existingTrial =
      await tx.subscription.findFirst({
        where: {
          tenantId,
          plan: {
            code: TRIAL_PLAN_CODE,
          },
          status: {
            in: [
              SubscriptionStatus.TRIALING,
              SubscriptionStatus.EXPIRED,
            ],
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    if (existingTrial) {
      if (
        existingTrial.status ===
        SubscriptionStatus.TRIALING
      ) {
        throw new Error(
          "This workspace already has an active free trial."
        );
      }

      throw new Error(
        "This workspace has already used its free trial. Please subscribe to continue."
      );
    }

    /*
     * 4. Resolve the ROOTYM 30-day trial plan.
     *
     *    The plan is created automatically if it does
     *    not yet exist in a fresh environment.
     */
    const plan = await tx.plan.upsert({
      where: {
        code: TRIAL_PLAN_CODE,
      },
      update: {
        name: "30-Day Free Trial",
        description:
          "Optional 30-day ROOTYM SaaS trial for new customers.",
        trialDays: TRIAL_DAYS,
        isActive: true,
      },
      create: {
        code: TRIAL_PLAN_CODE,
        name: "30-Day Free Trial",
        description:
          "Optional 30-day ROOTYM SaaS trial for new customers.",
        trialDays: TRIAL_DAYS,
        isActive: true,
      },
    });

    if (!plan.isActive) {
      throw new Error(
        "The ROOTYM trial plan is currently unavailable."
      );
    }

    /*
     * 5. Calculate the trial period.
     */
    const trialStartedAt = new Date();

    const trialEndsAt =
      new Date(trialStartedAt);

    trialEndsAt.setDate(
      trialEndsAt.getDate() +
        plan.trialDays
    );

    /*
     * 6. Create the tenant's trial subscription.
     */
    const subscription =
      await tx.subscription.create({
        data: {
          tenantId,
          planId: plan.id,
          status:
            SubscriptionStatus.TRIALING,

          startedAt: trialStartedAt,

          trialStartedAt,

          trialEndsAt,

          currentPeriodStart:
            trialStartedAt,

          currentPeriodEnd:
            trialEndsAt,
        },

        include: {
          plan: true,
          tenant: true,
        },
      });

    return subscription;
  });
}