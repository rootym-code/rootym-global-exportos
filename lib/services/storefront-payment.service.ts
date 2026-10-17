
import "server-only";

import Razorpay from "razorpay";
import { Prisma } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";
import { decryptSecret } from "@/lib/utils/secret-encryption";

export class StorefrontPaymentError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status = 400,
  ) {
    super(message);
    this.name = "StorefrontPaymentError";
  }
}

type CreateGatewayOrderInput = {
  websiteId: string;
  storeOrderId: string;
};

export async function createRazorpayTestOrder({
  websiteId,
  storeOrderId,
}: CreateGatewayOrderInput) {
  const payment = await prisma.storePaymentConfiguration.findUnique({
    where: { websiteId },
    select: {
      provider: true,
      environment: true,
      publicKeyId: true,
      encryptedKeySecret: true,
      paymentsEnabled: true,
      verifiedAt: true,
    },
  });

  if (
    !payment ||
    payment.provider !== "RAZORPAY" ||
    payment.environment !== "TEST" ||
    !payment.publicKeyId ||
    !payment.encryptedKeySecret ||
    !payment.verifiedAt ||
    !payment.paymentsEnabled
  ) {
    throw new StorefrontPaymentError(
      "Verified Razorpay test credentials are required.",
      "RAZORPAY_TEST_NOT_READY",
      409,
    );
  }

  const order = await prisma.storeOrder.findFirst({
    where: {
      id: storeOrderId,
      websiteId,
    },
    select: {
      id: true,
      orderNumber: true,
      currency: true,
      totalAmount: true,
      providerOrderId: true,
      paymentStatus: true,
      status: true,
    },
  });

  if (!order) {
    throw new StorefrontPaymentError(
      "Store order was not found.",
      "STORE_ORDER_NOT_FOUND",
      404,
    );
  }

  if (order.providerOrderId) {
    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      razorpayOrderId: order.providerOrderId,
      currency: order.currency,
      amount: order.totalAmount,
      publicKeyId: payment.publicKeyId,
    };
  }

  if (
    order.status !== "PENDING_PAYMENT" ||
    order.paymentStatus !== "CREATED" ||
    order.totalAmount.lte(0)
  ) {
    throw new StorefrontPaymentError(
      "This order is not eligible for payment.",
      "STORE_ORDER_NOT_PAYABLE",
      409,
    );
  }

  const amountInPaise = order.totalAmount
    .mul(100)
    .toDecimalPlaces(0, Prisma.Decimal.ROUND_HALF_UP);

  if (!amountInPaise.isInteger() || amountInPaise.lte(0)) {
    throw new StorefrontPaymentError(
      "The order amount is invalid for payment.",
      "INVALID_PAYMENT_AMOUNT",
      400,
    );
  }

  const keySecret = decryptSecret(payment.encryptedKeySecret);

  const razorpay = new Razorpay({
    key_id: payment.publicKeyId,
    key_secret: keySecret,
  });

  const gatewayOrder = await razorpay.orders.create({
    amount: amountInPaise.toNumber(),
    currency: order.currency,
    receipt: order.orderNumber,
    notes: {
      rootymStoreOrderId: order.id,
      rootymOrderNumber: order.orderNumber,
    },
  });

  await prisma.storeOrder.update({
    where: { id: order.id },
    data: {
      providerOrderId: gatewayOrder.id,
      provider: "RAZORPAY",
    },
  });

  return {
    orderId: order.id,
    orderNumber: order.orderNumber,
    razorpayOrderId: gatewayOrder.id,
    currency: order.currency,
    amount: order.totalAmount,
    publicKeyId: payment.publicKeyId,
  };
}
