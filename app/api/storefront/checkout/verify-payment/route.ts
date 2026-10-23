
import "server-only";

import {
  createHmac,
  timingSafeEqual,
} from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { Prisma } from "@/lib/generated/prisma";

import prisma from "@/lib/prisma";
import { decryptSecret } from "@/lib/utils/secret-encryption";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type VerifyPaymentRequest = {
  orderId?: unknown;
  razorpay_payment_id?: unknown;
  razorpay_order_id?: unknown;
  razorpay_signature?: unknown;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidSignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  receivedSignature: string,
  keySecret: string,
): boolean {
  if (!/^[a-f0-9]{64}$/i.test(receivedSignature)) {
    return false;
  }

  const expected = createHmac("sha256", keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`, "utf8")
    .digest();

  const received = Buffer.from(receivedSignature, "hex");

  return (
    expected.length === received.length &&
    timingSafeEqual(expected, received)
  );
}

function matchesOrderAmount(
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

function errorResponse(
  message: string,
  status: number,
  code: string,
) {
  return NextResponse.json(
    { success: false, message, code },
    { status },
  );
}

export async function POST(request: NextRequest) {
  let body: VerifyPaymentRequest;

  try {
    body = (await request.json()) as VerifyPaymentRequest;
  } catch {
    return errorResponse(
      "Invalid payment verification request.",
      400,
      "INVALID_JSON",
    );
  }

  const {
    orderId,
    razorpay_payment_id: paymentId,
    razorpay_order_id: razorpayOrderId,
    razorpay_signature: signature,
  } = body;

  if (
    !isNonEmptyString(orderId) ||
    !isNonEmptyString(paymentId) ||
    !isNonEmptyString(razorpayOrderId) ||
    !isNonEmptyString(signature)
  ) {
    return errorResponse(
      "Required payment verification details are missing.",
      400,
      "INVALID_PAYMENT_DETAILS",
    );
  }

  try {
    const order = await prisma.storeOrder.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        websiteId: true,
        status: true,
        paymentStatus: true,
        provider: true,
        providerOrderId: true,
        providerPaymentId: true,
        currency: true,
        totalAmount: true,
      },
    });

    if (
      !order ||
      order.provider !== "RAZORPAY" ||
      order.providerOrderId !== razorpayOrderId
    ) {
      return errorResponse(
        "The payment does not match this ROOTYM order.",
        400,
        "ORDER_MISMATCH",
      );
    }

    // A previously verified payment can safely be retried by the client.
    if (
      order.paymentStatus === "CAPTURED" &&
      order.providerPaymentId === paymentId
    ) {
      return NextResponse.json({
        success: true,
        data: {
          orderId: order.id,
          paymentStatus: "CAPTURED",
        },
      });
    }

    if (
      order.status !== "PENDING_PAYMENT" ||
      !["CREATED", "AUTHORIZED"].includes(order.paymentStatus)
    ) {
      return errorResponse(
        "This order is not eligible for payment verification.",
        409,
        "ORDER_NOT_PAYABLE",
      );
    }

    const configuration =
      await prisma.storePaymentConfiguration.findUnique({
        where: { websiteId: order.websiteId },
        select: {
          provider: true,
          environment: true,
          publicKeyId: true,
          encryptedKeySecret: true,
          verifiedAt: true,
        },
      });

    if (
      !configuration ||
      configuration.provider !== "RAZORPAY" ||
      configuration.environment !== "TEST" ||
      !configuration.publicKeyId ||
      !configuration.encryptedKeySecret ||
      !configuration.verifiedAt
    ) {
      return errorResponse(
        "Verified Razorpay TEST credentials are unavailable.",
        503,
        "PAYMENT_VERIFICATION_UNAVAILABLE",
      );
    }

    const keySecret = decryptSecret(
      configuration.encryptedKeySecret,
    );

    if (
      !isValidSignature(
        razorpayOrderId,
        paymentId,
        signature,
        keySecret,
      )
    ) {
      return errorResponse(
        "Razorpay payment signature verification failed.",
        400,
        "INVALID_PAYMENT_SIGNATURE",
      );
    }

    // A valid signature alone is not enough: independently retrieve
    // the payment from Razorpay and verify its captured status and amount.
    const razorpay = new Razorpay({
      key_id: configuration.publicKeyId,
      key_secret: keySecret,
    });

    let payment;

    try {
      payment = await razorpay.payments.fetch(paymentId);
    } catch {
      return errorResponse(
        "Razorpay could not confirm the payment. Please retry verification.",
        503,
        "GATEWAY_VERIFICATION_UNAVAILABLE",
      );
    }

    if (
      payment.id !== paymentId ||
      payment.order_id !== razorpayOrderId ||
      payment.status !== "captured" ||
      !matchesOrderAmount(
        payment.amount,
        payment.currency,
        order.totalAmount,
        order.currency,
      )
    ) {
      return errorResponse(
        "Payment is not captured or does not match the order amount.",
        409,
        "PAYMENT_NOT_CONFIRMED",
      );
    }

    const verifiedAt = new Date();

    // Conditional update protects against concurrent verification and
    // prevents a late callback from overwriting a different payment.
    const updated = await prisma.storeOrder.updateMany({
      where: {
        id: order.id,
        websiteId: order.websiteId,
        provider: "RAZORPAY",
        providerOrderId: razorpayOrderId,
        status: "PENDING_PAYMENT",
        paymentStatus: {
          in: ["CREATED", "AUTHORIZED"],
        },
        providerPaymentId: null,
      },
      data: {
        providerPaymentId: paymentId,
        providerSignatureVerifiedAt: verifiedAt,
        paidAt: verifiedAt,
        paymentStatus: "CAPTURED",
        status: "CONFIRMED",
        paymentFailureReason: null,
      },
    });

    if (updated.count !== 1) {
      // Another request may have verified the same payment first.
      const latest = await prisma.storeOrder.findUnique({
        where: { id: order.id },
        select: {
          status: true,
          paymentStatus: true,
          providerPaymentId: true,
        },
      });

      if (
        latest?.paymentStatus === "CAPTURED" &&
        latest.providerPaymentId === paymentId
      ) {
        return NextResponse.json({
          success: true,
          data: {
            orderId: order.id,
            paymentStatus: "CAPTURED",
          },
        });
      }

      return errorResponse(
        "The order changed during verification. Refresh the order status before retrying.",
        409,
        "ORDER_STATE_CHANGED",
      );
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully.",
      data: {
        orderId: order.id,
        paymentStatus: "CAPTURED",
      },
    });
  } catch (error) {
    console.error(
      "Storefront payment verification failed.",
      {
        errorType:
          error instanceof Error ? error.name : "UnknownError",
      },
    );

    return errorResponse(
      "Payment verification could not be completed. Please retry.",
      500,
      "PAYMENT_VERIFICATION_FAILED",
    );
  }
}
