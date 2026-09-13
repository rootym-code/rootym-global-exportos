/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * Organization    : ROOTYM Agro Harvest Pvt. Ltd.
 *
 * Feature         : R-CAPTAIN Controlled Live Data
 * Module          : Subscription Tool
 *
 * Author          : Prem Singh
 * Purpose         : Provide R-CAPTAIN with a strictly
 *                   allowlisted subscription and plan summary.
 *
 * Security:
 * • Workspace authentication is mandatory.
 * • Query is scoped to the authenticated Tenant.
 * • Payment-provider identifiers are never returned.
 * • Customer contact and financial credentials are excluded.
 * ============================================================
 */

import { prisma } from "@/lib/prisma";
import { resolveRCaptainContext } from "@/lib/services/rcaptain/context.service";

export type RCaptainSubscriptionSummary = {
  subscription: {
    status: string;
    startedAt: string | null;
    trialStartedAt: string | null;
    trialEndsAt: string | null;
    currentPeriodStart: string | null;
    currentPeriodEnd: string | null;
    canceledAt: string | null;
    amount: number | null;
    billingInterval: string | null;
    currency: string | null;
  } | null;

  plan: {
    code: string;
    name: string;
    description: string | null;
    trialDays: number;
    amount: number;
    billingInterval: string;
    currency: string;
    type: string;
  } | null;

  pendingPlanChange: {
    toPlan: {
      code: string;
      name: string;
    };
    effectiveAt: string;
    status: string;
  } | null;
};

/**
 * Return the authenticated customer's current subscription
 * information in a safe, AI-ready form.
 *
 * This tool is intentionally Workspace-only.
 *
 * The query is scoped directly by the authenticated Tenant ID.
 * No customer email, phone, bank information, payment IDs,
 * Razorpay identifiers, payment metadata, or credentials are
 * returned.
 */
export async function getSubscriptionSummary(): Promise<RCaptainSubscriptionSummary> {
  const context =
    await resolveRCaptainContext({
      mode: "WORKSPACE",
    });

  if (!context.tenant) {
    throw new Error(
      "Authenticated customer Workspace context is required."
    );
  }

  const subscription =
    await prisma.subscription.findFirst({
      where: {
        tenantId: context.tenant.id,
      },

      orderBy: {
        createdAt: "desc",
      },

      select: {
        status: true,
        startedAt: true,
        trialStartedAt: true,
        trialEndsAt: true,
        currentPeriodStart: true,
        currentPeriodEnd: true,
        canceledAt: true,
        amount: true,
        billingInterval: true,
        currency: true,

        plan: {
          select: {
            code: true,
            name: true,
            description: true,
            trialDays: true,
            amount: true,
            billingInterval: true,
            currency: true,
            type: true,
          },
        },
      },
    });

  if (!subscription) {
    return {
      subscription: null,
      plan: null,
      pendingPlanChange: null,
    };
  }

  const pendingPlanChange =
    await prisma.subscriptionPlanChange.findFirst({
      where: {
        tenantId: context.tenant.id,
        subscriptionId: {
          not: undefined,
        },
        effectiveAt: {
          gte: new Date(),
        },
        status: {
          in: [
            "PAYMENT_PENDING",
            "PAYMENT_CONFIRMED",
          ],
        },
      },

      orderBy: {
        effectiveAt: "asc",
      },

      select: {
        effectiveAt: true,
        status: true,

        toPlan: {
          select: {
            code: true,
            name: true,
          },
        },
      },
    });

  return {
    subscription: {
      status:
        subscription.status,

      startedAt:
        subscription.startedAt?.toISOString() ?? null,

      trialStartedAt:
        subscription.trialStartedAt?.toISOString() ?? null,

      trialEndsAt:
        subscription.trialEndsAt?.toISOString() ?? null,

      currentPeriodStart:
        subscription.currentPeriodStart?.toISOString() ?? null,

      currentPeriodEnd:
        subscription.currentPeriodEnd?.toISOString() ?? null,

      canceledAt:
        subscription.canceledAt?.toISOString() ?? null,

      amount:
        subscription.amount ?? null,

      billingInterval:
        subscription.billingInterval ?? null,

      currency:
        subscription.currency ?? null,
    },

    plan: {
      code:
        subscription.plan.code,

      name:
        subscription.plan.name,

      description:
        subscription.plan.description,

      trialDays:
        subscription.plan.trialDays,

      amount:
        subscription.plan.amount,

      billingInterval:
        subscription.plan.billingInterval,

      currency:
        subscription.plan.currency,

      type:
        subscription.plan.type,
    },

    pendingPlanChange:
      pendingPlanChange
        ? {
            toPlan: {
              code:
                pendingPlanChange.toPlan.code,

              name:
                pendingPlanChange.toPlan.name,
            },

            effectiveAt:
              pendingPlanChange.effectiveAt.toISOString(),

            status:
              pendingPlanChange.status,
          }
        : null,
  };
}
