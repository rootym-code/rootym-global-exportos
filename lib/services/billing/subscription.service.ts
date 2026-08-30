/**
 * Author: Prem Singh
 * Purpose: Creates ROOTYM SaaS Razorpay subscriptions, supports immediate trial-to-paid conversion, and supports paid plan changes that become effective at the current period end.
 */

import prisma from "@/lib/prisma";

import {
  BillingInterval,
  MembershipRole,
  PlanChangeStatus,
  SubscriptionStatus,
} from "@/lib/generated/prisma";

import {
  getRootymPaidPlan,
} from "./plan.service";

import {
  razorpayRequest,
} from "./razorpay";

interface RazorpaySubscriptionResponse {
  id: string;
  entity?: string;
  status?: string;
  plan_id?: string;
  customer_id?: string;
  total_count?: number;
  paid_count?: number;
  remaining_count?: number;
  current_start?: number | null;
  current_end?: number | null;
  charge_at?: number | null;
  start_at?: number | null;
  end_at?: number | null;
  created_at?: number;
}

interface RazorpayCustomerResponse {
  id: string;
  entity?: string;
  name?: string;
  email?: string;
  contact?: string;
  notes?: Record<string, string>;
}

async function getOrCreateBillingCustomer(
  tenantId: string,
  email: string,
  name: string
) {
  const existingCustomer =
    await prisma.billingCustomer.findUnique({
      where: {
        tenantId,
      },
    });

  if (existingCustomer) {
    return existingCustomer;
  }

  const customer =
    await razorpayRequest<RazorpayCustomerResponse>(
      "/customers",
      {
        method: "POST",
        body: {
          name,
          email,
          notes: {
            rootymTenantId: tenantId,
          },
        },
      }
    );

  if (!customer.id) {
    throw new Error(
      "Razorpay customer ID was not returned."
    );
  }

  return prisma.billingCustomer.create({
    data: {
      tenantId,
      provider: "RAZORPAY",
      providerCustomerId:
        customer.id,
      email,
      name,
    },
  });
}

async function getTenantWithOwner(
  tenantId: string
) {
  const tenant =
    await prisma.tenant.findUnique({
      where: {
        id: tenantId,
      },
      include: {
        memberships: {
          where: {
            role: MembershipRole.OWNER,
          },
          orderBy: {
            createdAt: "asc",
          },
          take: 1,
          include: {
            user: true,
          },
        },
      },
    });

  if (!tenant) {
    throw new Error(
      "Tenant not found."
    );
  }

  if (!tenant.isActive) {
    throw new Error(
      "This workspace is inactive."
    );
  }

  const owner =
    tenant.memberships[0]?.user;

  if (!owner) {
    throw new Error(
      "No workspace owner was found."
    );
  }

  return {
    tenant,
    owner,
  };
}

async function createRazorpaySubscriptionForPlan(
  tenantId: string,
  plan: {
    id: string;
    code: string;
    razorpayPlanId: string | null;
  },
  billingInterval: BillingInterval
) {
  if (!plan.razorpayPlanId) {
    throw new Error(
      `The ROOTYM ${billingInterval.toLowerCase()} plan is not connected to a Razorpay plan.`
    );
  }

  const razorpaySubscription =
    await razorpayRequest<RazorpaySubscriptionResponse>(
      "/subscriptions",
      {
        method: "POST",
        body: {
          plan_id:
            plan.razorpayPlanId,

          total_count:
            billingInterval ===
            BillingInterval.MONTHLY
              ? 120
              : 10,

          quantity: 1,

          customer_notify: true,

          notes: {
            rootymTenantId:
              tenantId,

            rootymPlanCode:
              plan.code,

            rootymBillingInterval:
              billingInterval,
          },
        },
      }
    );

  if (!razorpaySubscription.id) {
    throw new Error(
      "Razorpay subscription ID was not returned."
    );
  }

  if (
    razorpaySubscription.plan_id &&
    razorpaySubscription.plan_id !==
      plan.razorpayPlanId
  ) {
    throw new Error(
      "Razorpay returned a different plan than the selected ROOTYM billing plan."
    );
  }

  return razorpaySubscription;
}

export async function createRazorpaySubscription(
  input: {
    tenantId: string;
    billingInterval: BillingInterval;
  }
) {
  if (!input.tenantId) {
    throw new Error(
      "A valid tenant is required."
    );
  }

  const {
    tenant,
    owner,
  } =
    await getTenantWithOwner(
      input.tenantId
    );

  /*
   * Find the current subscription state.
   *
   * An active trial is intentionally allowed to
   * convert immediately to a paid subscription.
   *
   * Pending, active, and past-due subscriptions
   * continue to block a new initial checkout.
   */
  const existingSubscription =
    await prisma.subscription.findFirst({
      where: {
        tenantId: input.tenantId,
        status: {
          in: [
            SubscriptionStatus.PENDING,
            SubscriptionStatus.TRIALING,
            SubscriptionStatus.ACTIVE,
            SubscriptionStatus.PAST_DUE,
          ],
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

  if (
    existingSubscription?.status ===
    SubscriptionStatus.PENDING
  ) {
    throw new Error(
      "This workspace already has a pending payment subscription."
    );
  }

  if (
    existingSubscription?.status ===
    SubscriptionStatus.ACTIVE
  ) {
    throw new Error(
      "This workspace already has an active subscription. Use the plan-change flow to change billing plans."
    );
  }

  if (
    existingSubscription?.status ===
    SubscriptionStatus.PAST_DUE
  ) {
    throw new Error(
      "This workspace has a past-due subscription that requires attention."
    );
  }

  const trialSubscription =
    existingSubscription?.status ===
    SubscriptionStatus.TRIALING
      ? existingSubscription
      : null;

  /*
   * Resolve the single ROOTYM SaaS paid plan
   * for the selected billing interval.
   */
  const plan =
    await getRootymPaidPlan(
      input.billingInterval
    );

  if (!plan.razorpayPlanId) {
    throw new Error(
      `The ROOTYM ${input.billingInterval.toLowerCase()} plan is not connected to a Razorpay plan.`
    );
  }

  /*
   * Resolve the Razorpay customer associated
   * with this ROOTYM tenant.
   */
  const billingCustomer =
    await getOrCreateBillingCustomer(
      input.tenantId,
      owner.email,
      owner.name ||
        owner.email.split("@")[0]
    );

  /*
   * Create the Razorpay subscription.
   */
  const razorpaySubscription =
    await createRazorpaySubscriptionForPlan(
      input.tenantId,
      plan,
      input.billingInterval
    );

  /*
   * Commit the local billing transition.
   *
   * If the customer was on the 30-day trial:
   *
   *   TRIALING → EXPIRED
   *
   * The new paid subscription starts as PENDING
   * and becomes ACTIVE only after successful
   * Razorpay payment verification/webhook processing.
   */
  const subscription =
    await prisma.$transaction(
      async (tx) => {
        const latestSubscription =
          await tx.subscription.findFirst({
            where: {
              tenantId: input.tenantId,
              status: {
                in: [
                  SubscriptionStatus.PENDING,
                  SubscriptionStatus.TRIALING,
                  SubscriptionStatus.ACTIVE,
                  SubscriptionStatus.PAST_DUE,
                ],
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          });

        if (
          latestSubscription &&
          latestSubscription.id !==
            trialSubscription?.id
        ) {
          if (
            latestSubscription.status ===
            SubscriptionStatus.PENDING
          ) {
            throw new Error(
              "This workspace already has a pending payment subscription."
            );
          }

          if (
            latestSubscription.status ===
            SubscriptionStatus.ACTIVE
          ) {
            throw new Error(
              "This workspace already has an active subscription. Use the plan-change flow to change billing plans."
            );
          }

          if (
            latestSubscription.status ===
            SubscriptionStatus.PAST_DUE
          ) {
            throw new Error(
              "This workspace has a past-due subscription that requires attention."
            );
          }

          if (
            latestSubscription.status ===
            SubscriptionStatus.TRIALING
          ) {
            throw new Error(
              "This workspace has another active trial subscription."
            );
          }
        }

        if (trialSubscription) {
          await tx.subscription.update({
            where: {
              id: trialSubscription.id,
            },
            data: {
              status:
                SubscriptionStatus.EXPIRED,
            },
          });
        }

        return tx.subscription.create({
          data: {
            tenantId:
              input.tenantId,

            planId:
              plan.id,

            status:
              SubscriptionStatus.PENDING,

            billingInterval:
              input.billingInterval,

            startedAt:
              new Date(),

            currentPeriodStart:
              null,

            currentPeriodEnd:
              null,

            amount:
              plan.amount,

            currency:
              plan.currency,

            razorpayCustomerId:
              billingCustomer.providerCustomerId,

            razorpaySubscriptionId:
              razorpaySubscription.id,
          },

          include: {
            plan: true,
            tenant: true,
          },
        });
      }
    );

  return {
    subscription,

    razorpay: {
      subscriptionId:
        razorpaySubscription.id,

      customerId:
        billingCustomer.providerCustomerId,

      status:
        razorpaySubscription.status ??
        "created",
    },
  };
}

/**
 * Author: Prem Singh
 * Purpose: Creates a paid future plan change while keeping the current subscription effective until its existing billing period ends.
 */
export async function createRazorpayPlanChange(
  input: {
    tenantId: string;
    billingInterval: BillingInterval;
  }
) {
  if (!input.tenantId) {
    throw new Error(
      "A valid tenant is required."
    );
  }

  const {
    tenant,
    owner,
  } =
    await getTenantWithOwner(
      input.tenantId
    );

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
      "An active subscription is required to change billing plans."
    );
  }

  if (
    currentSubscription.billingInterval ===
    input.billingInterval
  ) {
    throw new Error(
      "The selected billing interval is already the current plan."
    );
  }

  if (!currentSubscription.currentPeriodEnd) {
    throw new Error(
      "The current subscription billing period end is not available."
    );
  }

  if (
    currentSubscription.currentPeriodEnd <=
    new Date()
  ) {
    throw new Error(
      "The current billing period has already ended. Please refresh and try again."
    );
  }

  /*
   * A plan change cannot be stacked.
   *
   * Because the new plan is paid immediately, an existing
   * confirmed change must be completed at the current period
   * end before another plan change can be requested.
   */
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
        "A plan-change payment is already being processed for this subscription."
      );
    }

    throw new Error(
      "A plan change has already been paid for this subscription and is waiting for the current billing period to end."
    );
  }

  const targetPlan =
    await getRootymPaidPlan(
      input.billingInterval
    );

  if (!targetPlan.razorpayPlanId) {
    throw new Error(
      `The ROOTYM ${input.billingInterval.toLowerCase()} plan is not connected to a Razorpay plan.`
    );
  }

  /*
   * The existing Razorpay customer is reused.
   * A separate Razorpay subscription is created for
   * the new plan because the new plan is paid immediately,
   * while the existing subscription remains effective
   * until currentPeriodEnd.
   */
  const billingCustomer =
    await getOrCreateBillingCustomer(
      input.tenantId,
      owner.email,
      owner.name ||
        owner.email.split("@")[0]
    );

  const razorpaySubscription =
    await createRazorpaySubscriptionForPlan(
      input.tenantId,
      targetPlan,
      input.billingInterval
    );

  /*
   * Record the future plan change without modifying
   * the currently effective Subscription.planId.
   */
  const planChange =
    await prisma.subscriptionPlanChange.create({
      data: {
        tenantId:
          tenant.id,

        subscriptionId:
          currentSubscription.id,

        fromPlanId:
          currentSubscription.planId,

        toPlanId:
          targetPlan.id,

        effectiveAt:
          currentSubscription.currentPeriodEnd,

        razorpaySubscriptionId:
          razorpaySubscription.id,

        status:
          PlanChangeStatus.PAYMENT_PENDING,
      },

      include: {
        fromPlan: true,
        toPlan: true,
      },
    });

  return {
    planChange,

    subscription:
      currentSubscription,

    razorpay: {
      subscriptionId:
        razorpaySubscription.id,

      customerId:
        billingCustomer.providerCustomerId,

      status:
        razorpaySubscription.status ??
        "created",
    },
  };
}

export function getRazorpayCheckoutKey() {
  const keyId =
    process.env.RAZORPAY_KEY_ID;

  if (!keyId) {
    throw new Error(
      "RAZORPAY_KEY_ID is not configured."
    );
  }

  return keyId;
}
