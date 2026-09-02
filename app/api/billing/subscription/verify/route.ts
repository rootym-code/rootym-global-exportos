/**
 * Author: Prem Singh
 * Purpose: Verifies Razorpay subscription payments, reconciles authoritative payment state, and supports both initial paid subscriptions and paid future plan changes.
 */

import { createHmac, timingSafeEqual } from "node:crypto";

import {
  NextRequest,
  NextResponse,
} from "next/server";

import prisma from "@/lib/prisma";

import {
  PaymentStatus,
  PlanChangeStatus,
  SubscriptionStatus,
} from "@/lib/generated/prisma";

import {
  getCustomerSession,
} from "@/lib/auth/customer";

import {
  getRazorpayPayment,
  getRazorpaySubscription,
} from "@/lib/services/billing/razorpay";

interface VerifyRequestBody {
  razorpayPaymentId?: string;
  razorpaySubscriptionId?: string;
  razorpaySignature?: string;
}

interface RazorpayPayment {
  id: string;
  entity?: string;
  amount?: number;
  currency?: string;
  status?: string;
  order_id?: string | null;
  invoice_id?: string | null;
  subscription_id?: string | null;
  error_code?: string | null;
  error_description?: string | null;
  created_at?: number;
}

interface RazorpaySubscription {
  id: string;
  entity?: string;
  plan_id?: string;
  customer_id?: string;
  status?: string;
  current_start?: number | null;
  current_end?: number | null;
  charge_at?: number | null;
  start_at?: number | null;
  end_at?: number | null;
  total_count?: number;
  paid_count?: number;
  remaining_count?: number;
}

function verifySubscriptionSignature(
  subscriptionId: string,
  paymentId: string,
  signature: string,
  secret: string
) {
  const generatedSignature =
    createHmac(
      "sha256",
      secret
    )
      .update(
        `${paymentId}|${subscriptionId}`
      )
      .digest("hex");

  const generatedBuffer =
    Buffer.from(
      generatedSignature,
      "utf8"
    );

  const receivedBuffer =
    Buffer.from(
      signature,
      "utf8"
    );

  if (
    generatedBuffer.length !==
    receivedBuffer.length
  ) {
    return false;
  }

  return timingSafeEqual(
    generatedBuffer,
    receivedBuffer
  );
}

function toDateFromUnix(
  value: number | null | undefined
) {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    return null;
  }

  return new Date(
    value * 1000
  );
}

function getPaymentStatus(
  status: string | undefined
): PaymentStatus {
  if (status === "captured") {
    return PaymentStatus.CAPTURED;
  }

  if (status === "failed") {
    return PaymentStatus.FAILED;
  }

  if (status === "authorized") {
    return PaymentStatus.AUTHORIZED;
  }

  return PaymentStatus.CREATED;
}

export async function POST(
  request: NextRequest
) {
  try {
    /*
     * 1. Authenticate the ROOTYM SaaS customer.
     */
    const session =
      await getCustomerSession(request);

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Customer authentication is required.",
        },
        {
          status: 401,
        }
      );
    }

    /*
     * 2. Validate Razorpay configuration.
     */
    const razorpaySecret =
      process.env
        .RAZORPAY_KEY_SECRET;

    if (!razorpaySecret) {
      console.error(
        "RAZORPAY_KEY_SECRET is not configured."
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Payment verification is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * 3. Read the Razorpay Checkout response.
     */
    let body: VerifyRequestBody;

    try {
      body =
        (await request.json()) as
          VerifyRequestBody;
    } catch {
      return NextResponse.json(
        {
          success: false,
          message:
            "A valid JSON request body is required.",
        },
        {
          status: 400,
        }
      );
    }

    const razorpayPaymentId =
      body.razorpayPaymentId?.trim();

    const razorpaySubscriptionId =
      body.razorpaySubscriptionId?.trim();

    const razorpaySignature =
      body.razorpaySignature?.trim();

    if (
      !razorpayPaymentId ||
      !razorpaySubscriptionId ||
      !razorpaySignature
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Razorpay payment verification details are incomplete.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * 4. Verify the Checkout signature before
     *    trusting the supplied payment relationship.
     */
    const signatureValid =
      verifySubscriptionSignature(
        razorpaySubscriptionId,
        razorpayPaymentId,
        razorpaySignature,
        razorpaySecret
      );

    if (!signatureValid) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid Razorpay payment signature.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * 5. Retrieve authoritative payment and
     *    subscription state directly from Razorpay.
     */
    const razorpayPayment =
      await getRazorpayPayment(
        razorpayPaymentId
      ) as RazorpayPayment;

    if (
      !razorpayPayment ||
      razorpayPayment.id !==
        razorpayPaymentId
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The Razorpay payment could not be verified.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      razorpayPayment.subscription_id &&
      razorpayPayment.subscription_id !==
        razorpaySubscriptionId
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The Razorpay payment does not belong to this subscription.",
        },
        {
          status: 400,
        }
      );
    }

    const paymentStatus =
      getPaymentStatus(
        razorpayPayment.status
      );

    /*
     * Failed and uncertain payments are deliberately
     * not treated as successful.
     *
     * The caller can safely retry only after Razorpay
     * confirms that the previous attempt failed.
     */
    if (
      paymentStatus !==
      PaymentStatus.CAPTURED
    ) {
      const existingPayment =
        await prisma.payment.findUnique({
          where: {
            providerPaymentId:
              razorpayPaymentId,
          },
        });

      if (
        existingPayment &&
        existingPayment.tenantId !==
          session.tenant.id
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Payment does not belong to this workspace.",
          },
          {
            status: 403,
          }
        );
      }

      /*
       * Determine whether this is a normal
       * subscription or a plan-change payment.
       */
      const planChange =
        await prisma.subscriptionPlanChange.findFirst({
          where: {
            razorpaySubscriptionId,
            tenantId:
              session.tenant.id,
          },
        });

      const subscription =
        planChange
          ? await prisma.subscription.findFirst({
              where: {
                id:
                  planChange.subscriptionId,
                tenantId:
                  session.tenant.id,
              },
              include: {
                plan: true,
              },
            })
          : await prisma.subscription.findFirst({
              where: {
                razorpaySubscriptionId,
                tenantId:
                  session.tenant.id,
              },
              include: {
                plan: true,
              },
            });

      if (!subscription) {
        return NextResponse.json(
          {
            success: false,
            message:
              "ROOTYM subscription could not be matched to this Razorpay payment.",
          },
          {
            status: 404,
          }
        );
      }

      /*
       * Persist the authoritative failed/authorized
       * payment state without activating or changing
       * the current subscription.
       */
      await prisma.$transaction(
        async (tx) => {
          if (existingPayment) {
            await tx.payment.update({
              where: {
                id:
                  existingPayment.id,
              },
              data: {
                subscriptionId:
                  planChange
                    ? subscription.id
                    : subscription.id,

                planChangeId:
                  planChange?.id ??
                  existingPayment.planChangeId ??
                  null,

                providerSubscriptionId:
                  razorpaySubscriptionId,

                providerOrderId:
                  razorpayPayment.order_id ??
                  existingPayment.providerOrderId ??
                  null,

                providerInvoiceId:
                  razorpayPayment.invoice_id ??
                  existingPayment.providerInvoiceId ??
                  null,

                amount:
                  razorpayPayment.amount ??
                  existingPayment.amount ??
                  0,

                currency:
                  razorpayPayment.currency ??
                  existingPayment.currency ??
                  "INR",

                status:
                  paymentStatus,

                paidAt:
                  null,

                failureCode:
                  razorpayPayment.error_code ??
                  null,

                failureReason:
                  razorpayPayment.error_description ??
                  null,
              },
            });
          } else {
            await tx.payment.create({
              data: {
                tenantId:
                  session.tenant.id,

                subscriptionId:
                  subscription.id,

                planChangeId:
                  planChange?.id ??
                  null,

                provider:
                  "RAZORPAY",

                providerPaymentId:
                  razorpayPaymentId,

                providerOrderId:
                  razorpayPayment.order_id ??
                  null,

                providerInvoiceId:
                  razorpayPayment.invoice_id ??
                  null,

                providerSubscriptionId:
                  razorpaySubscriptionId,

                amount:
                  razorpayPayment.amount ??
                  subscription.amount ??
                  0,

                currency:
                  razorpayPayment.currency ??
                  subscription.currency ??
                  "INR",

                status:
                  paymentStatus,

                paidAt:
                  null,

                failureCode:
                  razorpayPayment.error_code ??
                  null,

                failureReason:
                  razorpayPayment.error_description ??
                  null,
              },
            });
          }

          if (planChange) {
            if (
              paymentStatus ===
              PaymentStatus.FAILED
            ) {
              if (
                planChange.status !==
                PlanChangeStatus.APPLIED
              ) {
                await tx.subscriptionPlanChange.update({
                  where: {
                    id:
                      planChange.id,
                  },
                  data: {
                    status:
                      PlanChangeStatus.PAYMENT_FAILED,
                  },
                });
              }
            }
          }
        }
      );

      return NextResponse.json(
        {
          success: false,
          message:
            paymentStatus ===
            PaymentStatus.FAILED
              ? "Razorpay payment failed. Your current plan has not been changed and you can retry the payment."
              : `Razorpay payment is not yet captured. Current payment status: ${
                  razorpayPayment.status ??
                  "unknown"
                }. No plan change has been applied.`,
          data: {
            paymentStatus,
            razorpayPaymentStatus:
              razorpayPayment.status ??
              null,
            planChangeId:
              planChange?.id ??
              null,
          },
        },
        {
          status: 409,
        }
      );
    }

    /*
     * 6. Retrieve and verify the Razorpay subscription.
     */
    const razorpaySubscription =
      await getRazorpaySubscription(
        razorpaySubscriptionId
      ) as RazorpaySubscription;

    if (
      !razorpaySubscription ||
      razorpaySubscription.id !==
        razorpaySubscriptionId
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The Razorpay subscription could not be verified.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * 7. Locate either:
     *
     *    A. the normal pending ROOTYM subscription, or
     *    B. the paid future plan change.
     */
    const planChange =
      await prisma.subscriptionPlanChange.findFirst({
        where: {
          razorpaySubscriptionId,
          tenantId:
            session.tenant.id,
        },
        include: {
          subscription: {
            include: {
              plan: true,
            },
          },
          toPlan: true,
          fromPlan: true,
        },
      });

    if (planChange) {
      /*
       * A plan-change payment must match the target
       * Razorpay plan, not the currently effective plan.
       */
      if (
        razorpaySubscription.plan_id &&
        razorpaySubscription.plan_id !==
          planChange.toPlan.razorpayPlanId
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "The Razorpay subscription plan does not match the requested ROOTYM target plan.",
          },
          {
            status: 400,
          }
        );
      }

      /*
       * Captured payment is sufficient to confirm
       * the plan change. The current subscription
       * remains untouched until effectiveAt.
       */
      if (
        planChange.status ===
        PlanChangeStatus.APPLIED
      ) {
        return NextResponse.json(
          {
            success: true,
            message:
              "This plan change has already been applied.",
            data: {
              planChangeId:
                planChange.id,
              status:
                planChange.status,
              currentPlan: {
                code:
                  planChange.fromPlan.code,
                name:
                  planChange.fromPlan.name,
              },
              targetPlan: {
                code:
                  planChange.toPlan.code,
                name:
                  planChange.toPlan.name,
              },
              effectiveAt:
                planChange.effectiveAt,
            },
          },
          {
            status: 200,
          }
        );
      }

      await prisma.$transaction(
        async (tx) => {
          await tx.subscriptionPlanChange.update({
            where: {
              id:
                planChange.id,
            },
            data: {
              razorpayStartAt:
                toDateFromUnix(
                  razorpaySubscription.start_at
                ),

              razorpayEndAt:
                toDateFromUnix(
                  razorpaySubscription.end_at
                ),

              razorpayCurrentStart:
                toDateFromUnix(
                  razorpaySubscription.current_start
                ),

              razorpayCurrentEnd:
                toDateFromUnix(
                  razorpaySubscription.current_end
                ),
            },
          });
        }
      );

      const existingPayment =
        await prisma.payment.findUnique({
          where: {
            providerPaymentId:
              razorpayPaymentId,
          },
        });

      if (
        existingPayment &&
        existingPayment.tenantId !==
          session.tenant.id
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Payment does not belong to this workspace.",
          },
          {
            status: 403,
          }
        );
      }

      await prisma.$transaction(
        async (tx) => {
          if (existingPayment) {
            await tx.payment.update({
              where: {
                id:
                  existingPayment.id,
              },
              data: {
                subscriptionId:
                  planChange.subscriptionId,

                planChangeId:
                  planChange.id,

                providerSubscriptionId:
                  razorpaySubscriptionId,

                providerOrderId:
                  razorpayPayment.order_id ??
                  null,

                providerInvoiceId:
                  razorpayPayment.invoice_id ??
                  null,

                amount:
                  razorpayPayment.amount ??
                  planChange.toPlan.amount,

                currency:
                  razorpayPayment.currency ??
                  planChange.toPlan.currency,

                status:
                  PaymentStatus.CAPTURED,

                paidAt:
                  new Date(),

                failureCode:
                  null,

                failureReason:
                  null,
              },
            });
          } else {
            await tx.payment.create({
              data: {
                tenantId:
                  session.tenant.id,

                subscriptionId:
                  planChange.subscriptionId,

                planChangeId:
                  planChange.id,

                provider:
                  "RAZORPAY",

                providerPaymentId:
                  razorpayPaymentId,

                providerOrderId:
                  razorpayPayment.order_id ??
                  null,

                providerInvoiceId:
                  razorpayPayment.invoice_id ??
                  null,

                providerSubscriptionId:
                  razorpaySubscriptionId,

                amount:
                  razorpayPayment.amount ??
                  planChange.toPlan.amount,

                currency:
                  razorpayPayment.currency ??
                  planChange.toPlan.currency,

                status:
                  PaymentStatus.CAPTURED,

                paidAt:
                  new Date(),
              },
            });
          }

          if (
            planChange.status !==
            PlanChangeStatus.PAYMENT_CONFIRMED
          ) {
            await tx.subscriptionPlanChange.update({
              where: {
                id:
                  planChange.id,
              },
              data: {
                status:
                  PlanChangeStatus.PAYMENT_CONFIRMED,
              },
            });
          }
        }
      );

      return NextResponse.json(
        {
          success: true,
          message:
            "Payment verified. Your new plan has been paid for and will become effective when the current billing period ends.",
          data: {
            planChangeId:
              planChange.id,

            status:
              PlanChangeStatus.PAYMENT_CONFIRMED,

            currentPlan: {
              code:
                planChange.fromPlan.code,
              name:
                planChange.fromPlan.name,
            },

            targetPlan: {
              code:
                planChange.toPlan.code,
              name:
                planChange.toPlan.name,
            },

            effectiveAt:
              planChange.effectiveAt,

            paymentStatus:
              PaymentStatus.CAPTURED,
          },
        },
        {
          status: 200,
        }
      );
    }

    /*
     * 8. Normal initial paid subscription flow.
     */
    const subscription =
      await prisma.subscription.findFirst({
        where: {
          razorpaySubscriptionId,
          tenantId:
            session.tenant.id,
        },
        include: {
          plan: true,
        },
      });

    if (!subscription) {
      return NextResponse.json(
        {
          success: false,
          message:
            "ROOTYM subscription not found.",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * Idempotency for an already active initial
     * subscription.
     */
    if (
      subscription.status ===
      SubscriptionStatus.ACTIVE
    ) {
      return NextResponse.json(
        {
          success: true,
          message:
            "Subscription is already active.",
          data: {
            subscriptionId:
              subscription.id,

            status:
              subscription.status,

            plan: {
              code:
                subscription.plan.code,
              name:
                subscription.plan.name,
            },
          },
        },
        {
          status: 200,
        }
      );
    }

    if (
      subscription.status !==
      SubscriptionStatus.PENDING
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This subscription is not awaiting payment verification.",
        },
        {
          status: 409,
        }
      );
    }

    /*
     * Initial subscription must match its configured
     * ROOTYM Razorpay plan.
     */
    if (
      razorpaySubscription.plan_id &&
      razorpaySubscription.plan_id !==
        subscription.plan.razorpayPlanId
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The Razorpay subscription plan does not match the ROOTYM plan.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Razorpay must report the subscription as active
     * before ROOTYM activates the local subscription.
     */
    if (
      razorpaySubscription.status !==
      "active"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            `Razorpay subscription is not active. Current subscription status: ${
              razorpaySubscription.status ??
              "unknown"
            }.`,
        },
        {
          status: 409,
        }
      );
    }

    const existingPayment =
      await prisma.payment.findUnique({
        where: {
          providerPaymentId:
            razorpayPaymentId,
        },
      });

    if (
      existingPayment &&
      existingPayment.tenantId !==
        subscription.tenantId
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Payment does not belong to this workspace.",
        },
        {
          status: 403,
        }
      );
    }

    /*
     * 9. Activate the initial subscription and
     *    record the captured payment atomically.
     */
    const result =
      await prisma.$transaction(
        async (tx) => {
          const updatedSubscription =
            await tx.subscription.update({
              where: {
                id:
                  subscription.id,
              },

              data: {
                status:
                  SubscriptionStatus.ACTIVE,

                currentPeriodStart:
                  toDateFromUnix(
                    razorpaySubscription.current_start
                  ),

                currentPeriodEnd:
                  toDateFromUnix(
                    razorpaySubscription.current_end
                  ),

                razorpayStartAt:
                  toDateFromUnix(
                    razorpaySubscription.start_at
                  ),

                razorpayEndAt:
                  toDateFromUnix(
                    razorpaySubscription.end_at
                  ),

                razorpayCurrentStart:
                  toDateFromUnix(
                    razorpaySubscription.current_start
                  ),

                razorpayCurrentEnd:
                  toDateFromUnix(
                    razorpaySubscription.current_end
                  ),
              },

              include: {
                plan: true,
                tenant: true,
              },
            });

          if (existingPayment) {
            await tx.payment.update({
              where: {
                id:
                  existingPayment.id,
              },

              data: {
                subscriptionId:
                  subscription.id,

                planChangeId:
                  null,

                providerSubscriptionId:
                  razorpaySubscriptionId,

                providerOrderId:
                  razorpayPayment.order_id ??
                  null,

                providerInvoiceId:
                  razorpayPayment.invoice_id ??
                  null,

                amount:
                  razorpayPayment.amount ??
                  subscription.amount ??
                  0,

                currency:
                  razorpayPayment.currency ??
                  subscription.currency ??
                  "INR",

                status:
                  PaymentStatus.CAPTURED,

                paidAt:
                  new Date(),

                failureCode:
                  null,

                failureReason:
                  null,
              },
            });
          } else {
            await tx.payment.create({
              data: {
                tenantId:
                  subscription.tenantId,

                subscriptionId:
                  subscription.id,

                provider:
                  "RAZORPAY",

                providerPaymentId:
                  razorpayPaymentId,

                providerOrderId:
                  razorpayPayment.order_id ??
                  null,

                providerInvoiceId:
                  razorpayPayment.invoice_id ??
                  null,

                providerSubscriptionId:
                  razorpaySubscriptionId,

                amount:
                  razorpayPayment.amount ??
                  subscription.amount ??
                  0,

                currency:
                  razorpayPayment.currency ??
                  subscription.currency ??
                  "INR",

                status:
                  PaymentStatus.CAPTURED,

                paidAt:
                  new Date(),
              },
            });
          }

          return updatedSubscription;
        }
      );

    return NextResponse.json(
      {
        success: true,

        message:
          "Payment verified and subscription activated.",

        data: {
          subscriptionId:
            result.id,

          status:
            result.status,

          plan: {
            code:
              result.plan.code,

            name:
              result.plan.name,
          },
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "POST /api/billing/subscription/verify",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unable to verify the Razorpay payment.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      {
        status: 500,
      }
    );
  }
}
