
import "server-only";

import {
  createHmac,
  timingSafeEqual,
} from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

import { Prisma } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";
import { decryptSecret } from "@/lib/utils/secret-encryption";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RazorpayEntity = {
  id?: unknown;
  order_id?: unknown;
  status?: unknown;
  amount?: unknown;
  currency?: unknown;
  error_description?: unknown;
  error_reason?: unknown;
  error_code?: unknown;
};

type RazorpayWebhookBody = {
  event?: unknown;
  payload?: {
    payment?: { entity?: RazorpayEntity };
    order?: { entity?: RazorpayEntity };
  };
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidSignature(
  rawBody: string,
  receivedSignature: string,
  secret: string,
): boolean {
  if (!/^[a-f0-9]{64}$/i.test(receivedSignature)) {
    return false;
  }

  const expected = createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest();

  const received = Buffer.from(receivedSignature, "hex");

  return (
    expected.length === received.length &&
    timingSafeEqual(expected, received)
  );
}

function getOrderId(body: RazorpayWebhookBody): string | null {
  const payment = body.payload?.payment?.entity;
  const order = body.payload?.order?.entity;

  if (isNonEmptyString(payment?.order_id)) {
    return payment.order_id;
  }

  if (isNonEmptyString(order?.id)) {
    return order.id;
  }

  return null;
}

function isValidMoney(
  amount: unknown,
  currency: unknown,
  expectedAmount: Prisma.Decimal,
  expectedCurrency: string,
): boolean {
  if (
    typeof amount !== "number" ||
    !Number.isSafeInteger(amount) ||
    amount <= 0 ||
    typeof currency !== "string"
  ) {
    return false;
  }

  const expectedPaise = expectedAmount
    .mul(100)
    .toDecimalPlaces(0, Prisma.Decimal.ROUND_HALF_UP);

  return (
    expectedPaise.isInteger() &&
    expectedPaise.toNumber() === amount &&
    currency.toUpperCase() === expectedCurrency.toUpperCase()
  );
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  if (!rawBody || rawBody.length > 1_000_000) {
    return NextResponse.json(
      { success: false, message: "Invalid webhook body." },
      { status: 400 },
    );
  }

  const signature = request.headers.get("x-razorpay-signature");

  if (!signature) {
    return NextResponse.json(
      { success: false, message: "Missing webhook signature." },
      { status: 400 },
    );
  }

  try {
    // Resolve TEST-mode storefront secrets without trusting the request
    // payload. The matching website will be used to scope the order lookup.
    const configurations =
      await prisma.storePaymentConfiguration.findMany({
        where: {
          provider: "RAZORPAY",
          environment: "TEST",
          encryptedWebhookSecret: { not: null },
        },
        select: {
          websiteId: true,
          encryptedWebhookSecret: true,
        },
      });

    if (configurations.length === 0) {
      console.error(
        "No TEST-mode storefront webhook configurations are available.",
      );

      return NextResponse.json(
        { success: false, message: "Webhook configuration unavailable." },
        { status: 503 },
      );
    }

    let matchedWebsiteId: string | null = null;

    // Verify the signature against configured TEST secrets before parsing
    // the JSON or looking up an order. Never log or return secret values.
    for (const configuration of configurations) {
      if (!configuration.encryptedWebhookSecret) {
        continue;
      }

      try {
        const secret = decryptSecret(
          configuration.encryptedWebhookSecret,
        );

        if (isValidSignature(rawBody, signature, secret)) {
          matchedWebsiteId = configuration.websiteId;
          break;
        }
      } catch {
        // A damaged or undecryptable configuration cannot authenticate
        // this request. Continue checking other independent configurations.
        console.error(
          "A storefront webhook secret could not be checked.",
        );
      }
    }

    if (!matchedWebsiteId) {
      return NextResponse.json(
        { success: false, message: "Invalid webhook signature." },
        { status: 400 },
      );
    }

    // Only parse and trust event data after authenticating the raw body.
    let body: RazorpayWebhookBody;

    try {
      body = JSON.parse(rawBody) as RazorpayWebhookBody;
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid JSON." },
        { status: 400 },
      );
    }

    const event = body.event;

    if (!isNonEmptyString(event)) {
      return NextResponse.json(
        { success: false, message: "Missing event type." },
        { status: 400 },
      );
    }

    const supportedEvents = new Set([
      "payment.captured",
      "payment.failed",
      "order.paid",
    ]);

    // A correctly signed but unsupported event does not change payment data.
    if (!supportedEvents.has(event)) {
      return NextResponse.json({
        success: true,
        message: "Event acknowledged.",
      });
    }

    const razorpayOrderId = getOrderId(body);

    if (!razorpayOrderId) {
      return NextResponse.json(
        { success: false, message: "Missing Razorpay order ID." },
        { status: 400 },
      );
    }

    // Scope the order lookup to the website whose secret authenticated
    // this webhook. An order from another website cannot be updated.
    const order = await prisma.storeOrder.findFirst({
      where: {
        websiteId: matchedWebsiteId,
        provider: "RAZORPAY",
        providerOrderId: razorpayOrderId,
      },
      select: {
        id: true,
        websiteId: true,
        currency: true,
        totalAmount: true,
        status: true,
        paymentStatus: true,
      },
    });

    // Validly signed events for unknown orders are safely acknowledged.
    if (!order) {
      return NextResponse.json({
        success: true,
        message: "Unknown storefront order ignored.",
      });
    }

    const payment = body.payload?.payment?.entity;

    if (
      !payment ||
      !isNonEmptyString(payment.id) ||
      !isValidMoney(
        payment.amount,
        payment.currency,
        order.totalAmount,
        order.currency,
      )
    ) {
      console.error(
        "Storefront webhook payment details did not match the order.",
      );

      return NextResponse.json(
        { success: false, message: "Payment details mismatch." },
        { status: 400 },
      );
    }

    if (
      (event === "payment.captured" || event === "order.paid") &&
      payment.status !== "captured"
    ) {
      return NextResponse.json(
        { success: false, message: "Payment is not captured." },
        { status: 400 },
      );
    }

    if (event === "payment.failed" && payment.status !== "failed") {
      return NextResponse.json(
        { success: false, message: "Payment is not marked failed." },
        { status: 400 },
      );
    }

    if (event === "payment.failed") {
      const reason = [
        payment.error_reason,
        payment.error_code,
        payment.error_description,
      ]
        .filter(isNonEmptyString)
        .join(": ")
        .slice(0, 500);

      // Never downgrade a captured payment to FAILED.
      await prisma.storeOrder.updateMany({
        where: {
          id: order.id,
          websiteId: matchedWebsiteId,
          providerOrderId: razorpayOrderId,
          status: "PENDING_PAYMENT",
          paymentStatus: {
            in: ["CREATED", "AUTHORIZED", "FAILED"],
          },
        },
        data: {
          paymentStatus: "FAILED",
          paymentFailureReason: reason || "Payment failed.",
        },
      });

      return NextResponse.json({
        success: true,
        message: "Payment failure event processed.",
      });
    }

    // Conditional update makes repeated captured/paid events safe and
    // prevents an out-of-order failure from downgrading a captured order.
    await prisma.storeOrder.updateMany({
      where: {
        id: order.id,
        websiteId: matchedWebsiteId,
        providerOrderId: razorpayOrderId,
        status: "PENDING_PAYMENT",
        paymentStatus: {
          in: ["CREATED", "AUTHORIZED", "FAILED"],
        },
      },
      data: {
        paymentStatus: "CAPTURED",
        status: "CONFIRMED",
        providerPaymentId: payment.id,
        providerSignatureVerifiedAt: new Date(),
        paidAt: new Date(),
        paymentFailureReason: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Payment event processed.",
    });
  } catch (error) {
    console.error(
      "Storefront Razorpay webhook processing failed.",
      error instanceof Error ? error.message : "Unknown error",
    );

    return NextResponse.json(
      { success: false, message: "Webhook processing failed." },
      { status: 500 },
    );
  }
}
