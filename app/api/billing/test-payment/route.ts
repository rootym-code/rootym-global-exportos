/**
 * Author: Prem Singh
 * Purpose: Provides a temporary local billing payment simulator for testing ROOTYM subscription state transitions without Razorpay.
 */

import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

import {
  BillingInterval,
  PaymentStatus,
  SubscriptionStatus,
} from "@/lib/generated/prisma";

import {
  verifyCustomerToken,
  CUSTOMER_AUTH_COOKIE_NAME,
} from "@/lib/auth/customer-jwt";

import { cookies } from "next/headers";

function getPeriodEnd(
  start: Date,
  billingInterval: BillingInterval,
) {
  const end = new Date(start);

  if (billingInterval === BillingInterval.ANNUAL) {
    end.setFullYear(end.getFullYear() + 1);
  } else {
    end.setMonth(end.getMonth() + 1);
  }

  return end;
}

export async function POST(
  request: Request,
) {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get(
      CUSTOMER_AUTH_COOKIE_NAME,
    )?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication is required.",
        },
        {
          status: 401,
        },
      );
    }

    const session =
      await verifyCustomerToken(token);

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid customer session.",
        },
        {
          status: 401,
        },
      );
    }

    const body =
      (await request.json()) as {
        billingInterval?: string;
      };

    const billingInterval =
      body.billingInterval === "ANNUAL"
        ? BillingInterval.ANNUAL
        : body.billingInterval === "MONTHLY"
          ? BillingInterval.MONTHLY
          : null;

    if (!billingInterval) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A valid billing interval is required.",
        },
        {
          status: 400,
        },
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
          tenant: true,
        },
      });

    if (
      !membership ||
      !membership.user.isActive ||
      !membership.tenant.isActive
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The customer account is inactive.",
        },
        {
          status: 403,
        },
      );
    }

    /*
     * Resolve the ROOTYM paid plan for the
     * selected billing interval.
     */
    const plan =
      await prisma.plan.findFirst({
        where: {
          type: "PAID",
          billingInterval,
          isActive: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

    if (!plan) {
      return NextResponse.json(
        {
          success: false,
          message:
            `No active paid ${billingInterval.toLowerCase()} plan was found.`,
        },
        {
          status: 404,
        },
      );
    }

    const existingSubscription =
      await prisma.subscription.findFirst({
        where: {
          tenantId: session.tenantId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    /*
     * An already-active subscription should not be
     * recreated by the temporary payment simulator.
     */
    if (
      existingSubscription?.status ===
      SubscriptionStatus.ACTIVE
    ) {
      return NextResponse.json(
        {
          success: true,
          message:
            "The ROOTYM subscription is already active.",
          data: {
            subscriptionId:
              existingSubscription.id,
            status:
              existingSubscription.status,
          },
        },
      );
    }

    const now = new Date();

    const result =
      await prisma.$transaction(
        async (tx) => {
          /*
           * If the customer is still on the free trial,
           * retain the trial historically but close it
           * before activating the paid subscription.
           */
          if (
            existingSubscription?.status ===
            SubscriptionStatus.TRIALING
          ) {
            await tx.subscription.update({
              where: {
                id: existingSubscription.id,
              },
              data: {
                status:
                  SubscriptionStatus.EXPIRED,
              },
            });
          }

          let subscription =
            existingSubscription;

          /*
           * Reuse an existing PENDING subscription if
           * Razorpay had already created one.
           *
           * This lets the temporary button also recover
           * a subscription that became stuck in PENDING.
           */
          if (
            subscription?.status ===
            SubscriptionStatus.PENDING
          ) {
            const currentPeriodEnd =
              getPeriodEnd(
                now,
                billingInterval,
              );

            subscription =
              await tx.subscription.update({
                where: {
                  id: subscription.id,
                },
                data: {
                  planId: plan.id,
                  status:
                    SubscriptionStatus.ACTIVE,
                  billingInterval,
                  currentPeriodStart: now,
                  currentPeriodEnd,
                  amount: plan.amount,
                  currency: plan.currency,
                },
                include: {
                  plan: true,
                },
              });
          } else {
            const currentPeriodEnd =
              getPeriodEnd(
                now,
                billingInterval,
              );

            subscription =
              await tx.subscription.create({
                data: {
                  tenantId:
                    session.tenantId,
                  planId: plan.id,
                  status:
                    SubscriptionStatus.ACTIVE,
                  billingInterval,
                  startedAt: now,
                  currentPeriodStart: now,
                  currentPeriodEnd,
                  amount: plan.amount,
                  currency: plan.currency,
                },
                include: {
                  plan: true,
                },
              });
          }

          /*
           * Do not create duplicate simulated payments
           * when the button is accidentally clicked twice.
           */
          const existingPayment =
            await tx.payment.findFirst({
              where: {
                tenantId:
                  session.tenantId,
                subscriptionId:
                  subscription.id,
                provider: "TEST",
                status:
                  PaymentStatus.CAPTURED,
              },
              orderBy: {
                createdAt: "desc",
              },
            });

          const payment =
            existingPayment ??
            await tx.payment.create({
              data: {
                tenantId:
                  session.tenantId,
                subscriptionId:
                  subscription.id,
                provider: "TEST",
                providerPaymentId:
                  `test_payment_${subscription.id}`,
                amount:
                  plan.amount,
                currency:
                  plan.currency,
                status:
                  PaymentStatus.CAPTURED,
                paidAt: now,
                metadata: {
                  testMode: true,
                  simulated: true,
                  billingInterval,
                },
              },
            });

          return {
            subscription,
            payment,
          };
        },
      );

    return NextResponse.json({
      success: true,
      message:
        "Test payment completed successfully. Your ROOTYM subscription is now active.",
      data: {
        subscriptionId:
          result.subscription.id,
        status:
          result.subscription.status,
        billingInterval:
          result.subscription.billingInterval,
        amount:
          result.subscription.amount,
        currency:
          result.subscription.currency,
        paymentId:
          result.payment.id,
      },
    });
  } catch (error) {
    console.error(
      "POST /api/billing/test-payment",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to complete the temporary test payment.",
      },
      {
        status: 500,
      },
    );
  }
}