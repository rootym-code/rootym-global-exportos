
import "server-only";

import Razorpay from "razorpay";
import {
  Prisma,
  StorePaymentEnvironment,
} from "@/lib/generated/prisma";
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

function payableOrderError() {
  return new StorefrontPaymentError(
    "This order is not eligible for payment.",
    "STORE_ORDER_NOT_PAYABLE",
    409,
  );
}

function creationInProgressError() {
  return new StorefrontPaymentError(
    "Razorpay order creation is still marked as in progress. Wait briefly and retry the request. If the issue persists, reconcile the existing Razorpay order before attempting payment again.",
    "RAZORPAY_ORDER_CREATION_IN_PROGRESS",
    409,
  );
}

function reconciliationRequiredError() {
  return new StorefrontPaymentError(
    "The payment order creation outcome is uncertain. Reconciliation is required before retrying.",
    "RAZORPAY_ORDER_RECONCILIATION_REQUIRED",
    409,
  );
}

async function markCreationUnknown(
  websiteId: string,
  storeOrderId: string,
) {
  try {
    await prisma.storeOrder.updateMany({
      where: {
        id: storeOrderId,
        websiteId,
        providerOrderId: null,
        providerOrderCreationStatus: "IN_PROGRESS",
      },
      data: {
        providerOrderCreationStatus: "UNKNOWN",
      },
    });
  } catch (error) {
    // Preserve the original failure. If the database is unavailable,
    // the attempt may remain IN_PROGRESS and must not be retried blindly.
    console.error(
      "Failed to mark storefront Razorpay order creation as UNKNOWN.",
      {
        websiteId,
        storeOrderId,
        error,
      },
    );
  }
}

export async function createRazorpayOrder({
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
    !payment.publicKeyId ||
    !payment.encryptedKeySecret ||
    !payment.verifiedAt ||
    !payment.paymentsEnabled
  ) {
    throw new StorefrontPaymentError(
      "Verified and enabled Razorpay credentials are required.",
      "RAZORPAY_NOT_READY",
      409,
    );
  }

  if (
    payment.environment !== StorePaymentEnvironment.TEST &&
    payment.environment !== StorePaymentEnvironment.LIVE
  ) {
    throw new StorefrontPaymentError(
      "The configured Razorpay environment is invalid.",
      "RAZORPAY_ENVIRONMENT_INVALID",
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
      providerEnvironment: true,
      providerOrderId: true,
      providerOrderCreationStatus: true,
      providerOrderCreationStartedAt: true,
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

    // Never use credentials from one environment for an order
  // created under the other environment.
  if (order.providerEnvironment !== payment.environment) {
    throw new StorefrontPaymentError(
      "This order belongs to a different Razorpay environment. It cannot be paid using the currently configured credentials.",
      "RAZORPAY_ENVIRONMENT_MISMATCH",
      409,
    );
  }

  if (
    order.status !== "PENDING_PAYMENT" ||
    order.paymentStatus !== "CREATED" ||
    order.totalAmount.lte(0)
  ) {
    console.error("[Storefront payment eligibility check failed]", {
      websiteId,
      storeOrderId,
      status: order.status,
      paymentStatus: order.paymentStatus,
      totalAmount: order.totalAmount.toString(),
      providerOrderCreationStatus: order.providerOrderCreationStatus,
      hasProviderOrderId: Boolean(order.providerOrderId),
    });
  
    throw payableOrderError();
  }

  // Reuse an existing gateway order only for a still-payable ROOTYM order.
  if (order.providerOrderId) {
    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      razorpayOrderId: order.providerOrderId,
      currency: order.currency,
      amount: order.totalAmount,
      publicKeyId: payment.publicKeyId,
      environment: payment.environment,
    };
  }

  // An uncertain or abandoned attempt must not create another gateway order.
  if (order.providerOrderCreationStatus === "UNKNOWN") {
    throw reconciliationRequiredError();
  }


  if (order.providerOrderCreationStatus === "IN_PROGRESS") {
    const staleBefore = new Date(Date.now() - 5 * 60 * 1000);
  

    const recovered = await prisma.storeOrder.updateMany({
      where: {
        id: order.id,
        websiteId,
        status: "PENDING_PAYMENT",
        paymentStatus: "CREATED",
        providerOrderId: null,
        providerOrderCreationStatus: "IN_PROGRESS",
        providerEnvironment: order.providerEnvironment,
        OR: [
          { providerOrderCreationStartedAt: null },
          { providerOrderCreationStartedAt: { lt: staleBefore } },
        ],
      },
      data: {
        providerOrderCreationStatus: "UNKNOWN",
      },
    });

  
    if (recovered.count === 1) {
      throw reconciliationRequiredError();
    }
  
    // Another request may have changed the state while we were recovering.
    const latest = await prisma.storeOrder.findFirst({
      where: {
        id: order.id,
        websiteId,
      },
      select: {
        providerOrderId: true,
        providerOrderCreationStatus: true,
      },
    });
  
    if (
      latest?.providerOrderCreationStatus === "UNKNOWN" ||
      latest?.providerOrderCreationStatus === "CREATED"
    ) {
      throw reconciliationRequiredError();
    }
  
    if (latest?.providerOrderId) {
      throw reconciliationRequiredError();
    }
  
    throw creationInProgressError();
  }
  

  if (order.providerOrderCreationStatus === "CREATED") {
    throw reconciliationRequiredError();
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

  // Complete local preparation before claiming creation, so a local
  // decryption/configuration failure does not leave a claimed attempt.
  const keySecret = decryptSecret(payment.encryptedKeySecret);

  const razorpay = new Razorpay({
    key_id: payment.publicKeyId,
    key_secret: keySecret,
  });

  // Atomic compare-and-set: only one concurrent request can claim creation.
  const claim = await prisma.storeOrder.updateMany({
    where: {
      id: order.id,
      websiteId,
      status: "PENDING_PAYMENT",
      paymentStatus: "CREATED",
      providerOrderId: null,
      providerOrderCreationStatus: "NOT_STARTED",
      providerEnvironment: order.providerEnvironment,
    },
    data: {
      providerOrderCreationStatus: "IN_PROGRESS",
      providerOrderCreationStartedAt: new Date(),
    },
  });

  if (claim.count !== 1) {
    // Another request may have completed between our initial read and claim.
    const latest = await prisma.storeOrder.findFirst({
      where: {
        id: order.id,
        websiteId,
      },
      select: {
        providerOrderId: true,
        providerOrderCreationStatus: true,
        paymentStatus: true,
        status: true,
        totalAmount: true,
      },
    });

    if (
      !latest ||
      latest.status !== "PENDING_PAYMENT" ||
      latest.paymentStatus !== "CREATED" ||
      latest.totalAmount.lte(0)
    ) {
      throw payableOrderError();
    }

    if (latest.providerOrderId) {
      return {
        orderId: order.id,
        orderNumber: order.orderNumber,
        razorpayOrderId: latest.providerOrderId,
        currency: order.currency,
        amount: order.totalAmount,
        publicKeyId: payment.publicKeyId,
        environment: payment.environment,
      };
    }

    if (latest.providerOrderCreationStatus === "UNKNOWN") {
      throw reconciliationRequiredError();
    }

    if (latest.providerOrderCreationStatus === "IN_PROGRESS") {
      throw creationInProgressError();
    }

    throw new StorefrontPaymentError(
      "Payment order creation could not be claimed. Please retry.",
      "RAZORPAY_ORDER_CREATION_NOT_CLAIMED",
      409,
    );
  }

  let gatewayOrder: {
    id: string;
  };

  try {
    gatewayOrder = await razorpay.orders.create({
      amount: amountInPaise.toNumber(),
      currency: order.currency,
      receipt: order.orderNumber,
      notes: {
        rootymStoreOrderId: order.id,
        rootymOrderNumber: order.orderNumber,
      },
    });
  } catch (error) {
    // A gateway error may occur after Razorpay has created the order but
    // before ROOTYM receives the response. Treat the outcome as uncertain.
    await markCreationUnknown(websiteId, order.id);

    console.error("Razorpay storefront order creation failed.", {
      websiteId,
      storeOrderId: order.id,
      errorType:
        error instanceof Error ? error.name : "UnknownError",
    });

    throw new StorefrontPaymentError(
      "Razorpay order creation could not be confirmed. Reconciliation is required before retrying.",
      "RAZORPAY_ORDER_CREATION_UNKNOWN",
      503,
    );
  }

  try {
    const saved = await prisma.storeOrder.updateMany({
      where: {
        id: order.id,
        websiteId,
        status: "PENDING_PAYMENT",
        paymentStatus: "CREATED",
        providerOrderId: null,
        providerEnvironment: order.providerEnvironment,
        providerOrderCreationStatus: {
          in: ["IN_PROGRESS", "UNKNOWN"],
        },
      },
      data: {
        providerOrderId: gatewayOrder.id,
        provider: "RAZORPAY",
        providerOrderCreationStatus: "CREATED",
      },
    });

    if (saved.count !== 1) {
      // Reconciliation may have linked this same gateway order concurrently.
      // Treat that outcome as success only if the local order is still payable
      // and the exact gateway order ID has been saved.
      const latest = await prisma.storeOrder.findFirst({
        where: {
          id: order.id,
          websiteId,
        },
        select: {
          providerOrderId: true,
          status: true,
          paymentStatus: true,
        },
      });

      const alreadyLinkedToSameOrder =
        latest?.providerOrderId === gatewayOrder.id &&
        latest.status === "PENDING_PAYMENT" &&
        latest.paymentStatus === "CREATED";

      if (!alreadyLinkedToSameOrder) {
        throw new Error(
          "Gateway order was created but could not be saved to the expected ROOTYM order.",
        );
      }
    }
  } catch (error) {
    // Razorpay may have an order even though ROOTYM could not persist its ID.
    // Never automatically create another gateway order for this attempt.
    await markCreationUnknown(websiteId, order.id);

    console.error(
      "Razorpay order was created but could not be persisted in ROOTYM.",
      {
        websiteId,
        storeOrderId: order.id,
        razorpayOrderId: gatewayOrder.id,
        error,
      },
    );

    throw new StorefrontPaymentError(
      "Razorpay created an order, but ROOTYM could not confirm its saved state. Reconciliation is required before retrying.",
      "RAZORPAY_ORDER_SAVE_UNCONFIRMED",
      503,
    );
  }

  return {
    orderId: order.id,
    orderNumber: order.orderNumber,
    razorpayOrderId: gatewayOrder.id,
    currency: order.currency,
    amount: order.totalAmount,
    publicKeyId: payment.publicKeyId,
    environment: payment.environment,
  };
}
