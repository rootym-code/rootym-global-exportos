
import "server-only";

import {
  createHmac,
  timingSafeEqual,
} from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

import {
  Prisma,
  StorePaymentEnvironment,
} from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";
import { decryptSecret } from "@/lib/utils/secret-encryption";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RazorpayEntity = {
  id?: unknown;
  order_id?: unknown;
  status?: unknown;
  amount?: unknown;
  amount_paid?: unknown;
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

    const configurations =
      await prisma.storePaymentConfiguration.findMany({
        where: {
          provider: "RAZORPAY",
          OR: [
            { encryptedWebhookSecret: { not: null } },
            { liveEncryptedWebhookSecret: { not: null } },
          ],
        },
        select: {
          websiteId: true,
          publicKeyId: true,
          encryptedKeySecret: true,
          encryptedWebhookSecret: true,
          verifiedAt: true,
          livePublicKeyId: true,
          liveEncryptedKeySecret: true,
          liveEncryptedWebhookSecret: true,
          liveVerifiedAt: true,
        },
      });

    if (configurations.length === 0) {
      console.error(
        "No storefront webhook configurations are available.",
      );

      return NextResponse.json(
        { success: false, message: "Webhook configuration unavailable." },
        { status: 503 },
      );
    }


    let matchedConfiguration:
      | ((typeof configurations)[number] & {
          matchedEnvironment: StorePaymentEnvironment;
        })
      | null = null;

    // Authenticate the raw request before parsing its JSON.
    for (const configuration of configurations) {
      const candidates = [
        {
          environment: StorePaymentEnvironment.TEST,
          encryptedWebhookSecret: configuration.encryptedWebhookSecret,
        },
        {
          environment: StorePaymentEnvironment.LIVE,
          encryptedWebhookSecret: configuration.liveEncryptedWebhookSecret,
        },
      ];

      for (const candidate of candidates) {
        if (!candidate.encryptedWebhookSecret) {
          continue;
        }

        try {
          const secret = decryptSecret(
            candidate.encryptedWebhookSecret,
          );

          if (isValidSignature(rawBody, signature, secret)) {
            matchedConfiguration = {
              ...configuration,
              matchedEnvironment: candidate.environment,
            };
            break;
          }
        } catch {
          console.error(
            "A storefront webhook secret could not be checked.",
          );
        }
      }

      if (matchedConfiguration) {
        break;
      }
    }

    if (!matchedConfiguration) {
      return NextResponse.json(
        { success: false, message: "Invalid webhook signature." },
        { status: 400 },
      );
    }

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

    // An authenticated webhook can only update an order belonging
    // to the website whose webhook secret verified the request.
    const order = await prisma.storeOrder.findFirst({
      where: {
        websiteId: matchedConfiguration.websiteId,
        provider: "RAZORPAY",
        providerOrderId: razorpayOrderId,
      },
      select: {
        id: true,
        websiteId: true,
        currency: true,
        totalAmount: true,
        providerEnvironment: true,
      },
    });

    if (!order) {
      return NextResponse.json({
        success: true,
        message: "Unknown storefront order ignored.",
      });
    }

    if (
      order.providerEnvironment !== matchedConfiguration.matchedEnvironment
    ) {
      console.error(
        "Storefront webhook environment does not match the order environment.",
      );
    
      return NextResponse.json(
        {
          success: false,
          message: "Webhook environment does not match the order.",
        },
        { status: 409 },
      );
    }

    let payment: RazorpayEntity | undefined;

    if (event === "order.paid") {
      // order.paid carries an order entity, not necessarily a payment
      // entity. Verify the order, then fetch its actual payment records.
      const orderEntity = body.payload?.order?.entity;

      if (
        !orderEntity ||
        orderEntity.id !== razorpayOrderId ||
        orderEntity.status !== "paid" ||
        !isValidMoney(
          orderEntity.amount,
          orderEntity.currency,
          order.totalAmount,
          order.currency,
        ) ||
        !isValidMoney(
          orderEntity.amount_paid,
          orderEntity.currency,
          order.totalAmount,
          order.currency,
        )
      ) {
        return NextResponse.json(
          { success: false, message: "Paid order details mismatch." },
          { status: 400 },
        );
      }


      const paymentConfiguration =
        await prisma.storePaymentConfiguration.findUnique({
          where: {
            websiteId: matchedConfiguration.websiteId,
          },
          select: {
            provider: true,
            publicKeyId: true,
            encryptedKeySecret: true,
            verifiedAt: true,
            livePublicKeyId: true,
            liveEncryptedKeySecret: true,
            liveVerifiedAt: true,
          },
        });

      const isLiveOrder =
        order.providerEnvironment === StorePaymentEnvironment.LIVE;

      const publicKeyId = isLiveOrder
        ? paymentConfiguration?.livePublicKeyId
        : paymentConfiguration?.publicKeyId;

      const encryptedKeySecret = isLiveOrder
        ? paymentConfiguration?.liveEncryptedKeySecret
        : paymentConfiguration?.encryptedKeySecret;

      const verifiedAtForEnvironment = isLiveOrder
        ? paymentConfiguration?.liveVerifiedAt
        : paymentConfiguration?.verifiedAt;

      if (
        !paymentConfiguration ||
        paymentConfiguration.provider !== "RAZORPAY" ||
        (
          order.providerEnvironment !== StorePaymentEnvironment.TEST &&
          order.providerEnvironment !== StorePaymentEnvironment.LIVE
        ) ||
        order.providerEnvironment !== matchedConfiguration.matchedEnvironment ||
        !publicKeyId ||
        !encryptedKeySecret ||
        !verifiedAtForEnvironment
      ) {
        console.error(
          "Razorpay credentials are unavailable or do not match the order environment.",
        );

        return NextResponse.json(
          { success: false, message: "Payment verification unavailable." },
          { status: 503 },
        );
      }
      let razorpay: Razorpay;

      try {
        razorpay = new Razorpay({
          key_id: publicKeyId,
          key_secret: decryptSecret(encryptedKeySecret),
        });
      } catch {
        console.error(
          "Razorpay API credentials could not be prepared for reconciliation.",
        );

        return NextResponse.json(
          { success: false, message: "Payment verification unavailable." },
          { status: 503 },
        );
      }

      let gatewayPayments;

      try {
        gatewayPayments =
          await razorpay.orders.fetchPayments(razorpayOrderId);
        } catch (error) {
          console.error(
            "Could not fetch Razorpay payments for a paid order.",
            {
              errorType:
                error instanceof Error ? error.name : "UnknownError",
            },
          );
        
          return NextResponse.json(
          { success: false, message: "Payment verification temporarily unavailable." },
          { status: 503 },
        );
      }

      const capturedPayments = gatewayPayments.items.filter(
        (candidate) =>
          candidate.status === "captured" &&
          candidate.order_id === razorpayOrderId &&
          isNonEmptyString(candidate.id) &&
          isValidMoney(
            candidate.amount,
            candidate.currency,
            order.totalAmount,
            order.currency,
          ),
      );

      if (capturedPayments.length !== 1) {
        console.error(
          "Paid order did not resolve to exactly one matching captured payment.",
        );

        return NextResponse.json(
          {
            success: false,
            message: "Captured payment could not be uniquely verified.",
          },
          { status: 503 },
        );
      }

      const capturedPayment = capturedPayments[0];

      payment = {
        id: capturedPayment.id,
        order_id: capturedPayment.order_id,
        status: capturedPayment.status,
        amount: capturedPayment.amount,
        currency: capturedPayment.currency,
      };
    } else {
      payment = body.payload?.payment?.entity;
    }

    if (
      !payment ||
      !isNonEmptyString(payment.id) ||
      payment.order_id !== razorpayOrderId ||
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
          websiteId: matchedConfiguration.websiteId,
          providerOrderId: razorpayOrderId,
          providerEnvironment: order.providerEnvironment,
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

    // Conditional update makes repeated events safe and prevents a
    // late failure event from downgrading an already captured order.
    await prisma.storeOrder.updateMany({
      where: {
        id: order.id,
        websiteId: matchedConfiguration.websiteId,
        providerOrderId: razorpayOrderId,
        providerEnvironment: order.providerEnvironment,
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
      {
        errorType:
          error instanceof Error ? error.name : "UnknownError",
      },
    );
  
    return NextResponse.json(
      { success: false, message: "Webhook processing failed." },
      { status: 500 },
    );
  }
}
