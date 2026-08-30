/**
 * Author: Prem Singh
 * Purpose: Receives, verifies, stores, and processes Razorpay subscription webhook events for ROOTYM SaaS billing, including immediate trial-to-paid conversion.
 */

import {
  createHmac,
  timingSafeEqual,
} from "node:crypto";

import {
  NextRequest,
  NextResponse,
} from "next/server";

import prisma from "@/lib/prisma";

import {
  PaymentStatus,
  PlanChangeStatus,
  PlanType,
  SubscriptionStatus,
} from "@/lib/generated/prisma";

import type {
  Prisma,
} from "@/lib/generated/prisma";

interface RazorpaySubscriptionEntity {
  id?: string;
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
  notes?: Record<string, string>;
}

interface RazorpayPaymentEntity {
  id?: string;
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

interface RazorpayWebhookPayload {
  entity?: string;
  account_id?: string;
  event?: string;
  contains?: string[];
  payload?: {
    subscription?: {
      entity?: RazorpaySubscriptionEntity;
    };
    payment?: {
      entity?: RazorpayPaymentEntity;
    };
  };
  created_at?: number;
}

function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  secret: string
) {
  const expectedSignature =
    createHmac(
      "sha256",
      secret
    )
      .update(rawBody)
      .digest("hex");

  const expectedBuffer =
    Buffer.from(
      expectedSignature,
      "utf8"
    );

  const receivedBuffer =
    Buffer.from(
      signature,
      "utf8"
    );

  if (
    expectedBuffer.length !==
    receivedBuffer.length
  ) {
    return false;
  }

  return timingSafeEqual(
    expectedBuffer,
    receivedBuffer
  );
}

function toDate(
  timestamp?: number | null
) {
  if (
    typeof timestamp !==
      "number" ||
    !Number.isFinite(timestamp) ||
    timestamp <= 0
  ) {
    return null;
  }

  return new Date(
    timestamp * 1000
  );
}

function getSubscriptionId(
  payload: RazorpayWebhookPayload
) {
  return (
    payload.payload
      ?.subscription?.entity?.id ??
    payload.payload
      ?.payment?.entity?.subscription_id ??
    null
  );
}

/**
 * Author: Prem Singh
 * Purpose: Maps Razorpay subscription lifecycle events to the corresponding ROOTYM subscription status.
 */
function getSubscriptionStatus(
  event: string
): SubscriptionStatus | null {
  switch (event) {
    case "subscription.activated":
    case "subscription.resumed":
      return SubscriptionStatus.ACTIVE;

    /*
     * Razorpay pending means the subscription is
     * awaiting authorization/payment completion.
     *
     * It is NOT a past-due subscription.
     */
    case "subscription.pending":
      return SubscriptionStatus.PENDING;

    case "subscription.halted":
      return SubscriptionStatus.PAST_DUE;

    case "subscription.cancelled":
      return SubscriptionStatus.CANCELED;

    case "subscription.completed":
      return SubscriptionStatus.EXPIRED;

    default:
      return null;
  }
}

/**
 * Author: Prem Singh
 * Purpose: Prevents an older Razorpay lifecycle event from downgrading an already active ROOTYM subscription.
 */
function shouldApplySubscriptionStatus(
  currentStatus: SubscriptionStatus,
  newStatus: SubscriptionStatus
) {
  if (
    currentStatus ===
    SubscriptionStatus.ACTIVE
  ) {
    return (
      newStatus ===
      SubscriptionStatus.ACTIVE
    );
  }

  if (
    currentStatus ===
    SubscriptionStatus.CANCELED
  ) {
    return (
      newStatus ===
      SubscriptionStatus.CANCELED
    );
  }

  if (
    currentStatus ===
    SubscriptionStatus.EXPIRED
  ) {
    return (
      newStatus ===
      SubscriptionStatus.EXPIRED
    );
  }

  return true;
}

async function processPayment(
  tenantId: string,
  subscriptionId: string | null,
  planChangeId: string | null,
  payment: RazorpayPaymentEntity
) {
  if (!payment.id) {
    return;
  }

  const existingPayment =
    await prisma.payment.findUnique({
      where: {
        providerPaymentId:
          payment.id,
      },
    });

  /*
   * Payment processing is idempotent.
   *
   * Once a payment is captured, a duplicate
   * webhook must not alter it.
   */
  if (
    existingPayment &&
    existingPayment.status ===
      PaymentStatus.CAPTURED
  ) {
    return;
  }

  const paymentStatus =
    payment.status === "captured"
      ? PaymentStatus.CAPTURED
      : payment.status === "failed"
        ? PaymentStatus.FAILED
        : payment.status ===
            "authorized"
          ? PaymentStatus.AUTHORIZED
          : PaymentStatus.CREATED;

  const paidAt =
    paymentStatus ===
    PaymentStatus.CAPTURED
      ? toDate(
          payment.created_at
        )
      : null;

  const failedAt =
    paymentStatus ===
    PaymentStatus.FAILED
      ? toDate(
          payment.created_at
        )
      : null;

  const commonData = {
    subscriptionId:
      subscriptionId ??
      existingPayment?.subscriptionId ??
      null,

    planChangeId:
      planChangeId ??
      existingPayment?.planChangeId ??
      null,

    providerOrderId:
      payment.order_id ??
      existingPayment?.providerOrderId ??
      null,

    providerInvoiceId:
      payment.invoice_id ??
      existingPayment?.providerInvoiceId ??
      null,

    providerSubscriptionId:
      payment.subscription_id ??
      existingPayment?.providerSubscriptionId ??
      null,

    amount:
      payment.amount ??
      existingPayment?.amount ??
      0,

    currency:
      payment.currency ??
      existingPayment?.currency ??
      "INR",

    status:
      paymentStatus,

    paidAt,

    failedAt,

    failureCode:
      payment.error_code ??
      null,

    failureReason:
      payment.error_description ??
      null,
  };

  if (existingPayment) {
    await prisma.payment.update({
      where: {
        id: existingPayment.id,
      },

      data: commonData,
    });

    return;
  }

  await prisma.payment.create({
    data: {
      tenantId,

      ...commonData,

      provider:
        "RAZORPAY",

      providerPaymentId:
        payment.id,
    },
  });
}

/**
 * Author: Prem Singh
 * Purpose: Reconciles a plan-change payment with its future ROOTYM plan change without changing the currently effective subscription.
 */
async function processPlanChangePayment(
  planChangeId: string,
  paymentStatus: PaymentStatus
) {
  const planChange =
    await prisma.subscriptionPlanChange.findUnique({
      where: {
        id: planChangeId,
      },
    });

  if (!planChange) {
    throw new Error(
      `ROOTYM plan change ${planChangeId} was not found.`
    );
  }

  if (
    paymentStatus ===
    PaymentStatus.CAPTURED
  ) {
    if (
      planChange.status ===
      PlanChangeStatus.APPLIED
    ) {
      return;
    }

    if (
      planChange.status ===
      PlanChangeStatus.PAYMENT_CONFIRMED
    ) {
      return;
    }

    await prisma.subscriptionPlanChange.update({
      where: {
        id: planChange.id,
      },

      data: {
        status:
          PlanChangeStatus.PAYMENT_CONFIRMED,
      },
    });

    return;
  }

  if (
    paymentStatus ===
    PaymentStatus.FAILED
  ) {
    /*
     * A failed plan-change payment never changes
     * the currently effective subscription.
     */
    if (
      planChange.status ===
      PlanChangeStatus.APPLIED
    ) {
      return;
    }

    await prisma.subscriptionPlanChange.update({
      where: {
        id: planChange.id,
      },

      data: {
        status:
          PlanChangeStatus.PAYMENT_FAILED,
      },
    });
  }
}


/**
 * Author: Prem Singh
 * Purpose: Expires the tenant's historical ROOTYM trial when a paid Razorpay subscription becomes active.
 */
async function expireTrialSubscription(
  tenantId: string,
  paidSubscriptionId: string
) {
  await prisma.subscription.updateMany({
    where: {
      tenantId,

      status:
        SubscriptionStatus.TRIALING,

      plan: {
        type:
          PlanType.TRIAL,
      },

      NOT: {
        id:
          paidSubscriptionId,
      },
    },

    data: {
      status:
        SubscriptionStatus.EXPIRED,
    },
  });
}

async function processWebhook(
  event: string,
  payload: RazorpayWebhookPayload
) {
  const subscriptionEntity =
    payload.payload
      ?.subscription?.entity;

  const paymentEntity =
    payload.payload
      ?.payment?.entity;

  const razorpaySubscriptionId =
    getSubscriptionId(payload);

  /*
   * Payment-only webhook events can be handled
   * through the subscription_id contained in the
   * payment entity.
   */
  if (!razorpaySubscriptionId) {
    return;
  }

  /*
   * A Razorpay subscription can represent either:
   *
   * 1. The currently effective ROOTYM subscription.
   * 2. A future paid plan change.
   *
   * Check the plan-change reference first so a
   * plan-change payment is never mistaken for a
   * normal subscription activation.
   */
  const planChange =
    await prisma.subscriptionPlanChange.findFirst({
      where: {
        razorpaySubscriptionId,
      },
      include: {
        subscription: true,
      },
    });

  if (planChange) {
    if (!paymentEntity?.id) {
      return;
    }

    const paymentStatus =
      paymentEntity.status ===
        "captured"
        ? PaymentStatus.CAPTURED
        : paymentEntity.status ===
            "failed"
          ? PaymentStatus.FAILED
          : paymentEntity.status ===
              "authorized"
            ? PaymentStatus.AUTHORIZED
            : PaymentStatus.CREATED;

    /*
     * Store the payment against the plan change.
     * The current Subscription remains untouched.
     */
    await processPayment(
      planChange.tenantId,
      planChange.subscriptionId,
      planChange.id,
      paymentEntity
    );

    /*
     * Only captured or failed are definitive.
     * Authorized/created/unknown states do not
     * commit or fail the plan change.
     */
    await processPlanChangePayment(
      planChange.id,
      paymentStatus
    );

    return;
  }

  const subscription =
    await prisma.subscription.findUnique({
      where: {
        razorpaySubscriptionId,
      },
    });

  if (!subscription) {
    throw new Error(
      `ROOTYM subscription not found for Razorpay subscription ${razorpaySubscriptionId}.`
    );
  }

  /*
   * 1. Process payment information first.
   */
  if (paymentEntity) {
    await processPayment(
      subscription.tenantId,
      subscription.id,
      null,
      paymentEntity
    );
  }

  /*
   * 2. Resolve subscription lifecycle status.
   */
  const newStatus =
    getSubscriptionStatus(event);

  if (!newStatus) {
    return;
  }

  /*
   * 3. Protect the local subscription from
   *    stale/out-of-order lifecycle events.
   */
  if (
    !shouldApplySubscriptionStatus(
      subscription.status,
      newStatus
    )
  ) {
    return;
  }

  const currentStart =
    toDate(
      subscriptionEntity
        ?.current_start
    );

  const currentEnd =
    toDate(
      subscriptionEntity
        ?.current_end
    );

  const endedAt =
    toDate(
      subscriptionEntity?.end_at
    );

  /*
   * 4. Update the paid ROOTYM subscription
   *    and, when activated, close the old trial
   *    in the same database transaction.
   */
  await prisma.$transaction(
    async (tx) => {
      await tx.subscription.update({
        where: {
          id: subscription.id,
        },

        data: {
          status:
            newStatus,

          razorpayCustomerId:
            subscriptionEntity
              ?.customer_id ??
            subscription.razorpayCustomerId,

          currentPeriodStart:
            currentStart ??
            subscription.currentPeriodStart,

          currentPeriodEnd:
            currentEnd ??
            subscription.currentPeriodEnd,

          canceledAt:
            newStatus ===
            SubscriptionStatus.CANCELED
              ? endedAt ??
                new Date()
              : subscription.canceledAt,
        },
      });

      /*
       * Only an ACTIVE paid subscription can
       * complete the trial-to-paid conversion.
       */
      if (
        newStatus ===
        SubscriptionStatus.ACTIVE
      ) {
        await tx.subscription.updateMany({
          where: {
            tenantId:
              subscription.tenantId,

            status:
              SubscriptionStatus.TRIALING,

            plan: {
              type:
                PlanType.TRIAL,
            },

            NOT: {
              id:
                subscription.id,
            },
          },

          data: {
            status:
              SubscriptionStatus.EXPIRED,
          },
        });
      }
    }
  );
}


export async function POST(
  request: NextRequest
) {
  const webhookSecret =
    process.env
      .RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error(
      "RAZORPAY_WEBHOOK_SECRET is not configured."
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Webhook configuration is incomplete.",
      },
      {
        status: 500,
      }
    );
  }

  /*
   * Razorpay requires the raw request body for
   * webhook signature verification.
   *
   * Do NOT call request.json() before verification.
   */
  const rawBody =
    await request.text();

  const signature =
    request.headers.get(
      "x-razorpay-signature"
    );

  if (!signature) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Razorpay webhook signature is missing.",
      },
      {
        status: 400,
      }
    );
  }

  if (
    !verifyWebhookSignature(
      rawBody,
      signature,
      webhookSecret
    )
  ) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Invalid Razorpay webhook signature.",
      },
      {
        status: 400,
      }
    );
  }

  let payload:
    RazorpayWebhookPayload;

  let payloadJson:
    Prisma.InputJsonValue;

  try {
    payloadJson =
      JSON.parse(rawBody) as
        Prisma.InputJsonValue;

    payload =
      payloadJson as
        RazorpayWebhookPayload;
  } catch {
    return NextResponse.json(
      {
        success: false,
        message:
          "Invalid Razorpay webhook payload.",
      },
      {
        status: 400,
      }
    );
  }

  const eventId =
    request.headers.get(
      "x-razorpay-event-id"
    );

  const event =
    payload.event;

  if (!event) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Razorpay webhook event is missing.",
      },
      {
        status: 400,
      }
    );
  }

  /*
   * Razorpay provides an event ID that should be
   * used for duplicate-event protection.
   */
  if (!eventId) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Razorpay webhook event ID is missing.",
      },
      {
        status: 400,
      }
    );
  }

  const existingEvent =
    await prisma.billingWebhookEvent.findUnique(
      {
        where: {
          eventId,
        },
      }
    );

  if (existingEvent) {
    if (
      existingEvent.status ===
      "PROCESSED"
    ) {
      return NextResponse.json(
        {
          success: true,
          message:
            "Webhook already processed.",
        },
        {
          status: 200,
        }
      );
    }

    /*
     * An earlier attempt exists but was not
     * successfully processed.
     *
     * Continue processing instead of creating
     * a duplicate webhook record.
     */
  } else {
    await prisma.billingWebhookEvent.create({
      data: {
        provider:
          "RAZORPAY",

        eventId,

        eventType:
          event,

        status:
          "RECEIVED",

        payload:
          payloadJson,
      },
    });
  }

  try {
    await processWebhook(
      event,
      payload
    );

    await prisma.billingWebhookEvent.update({
      where: {
        eventId,
      },

      data: {
        status:
          "PROCESSED",

        processedAt:
          new Date(),

        errorMessage:
          null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Razorpay webhook processed successfully.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to process Razorpay webhook.";

    console.error(
      "Razorpay webhook processing failed:",
      error
    );

    await prisma.billingWebhookEvent.update({
      where: {
        eventId,
      },

      data: {
        status:
          "FAILED",

        errorMessage:
          message,
      },
    });

    /*
     * Return a non-2xx response so Razorpay can
     * retry the webhook delivery.
     */
    return NextResponse.json(
      {
        success: false,
        message:
          "Razorpay webhook processing failed.",
      },
      {
        status: 500,
      }
    );
  }
}