
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { Prisma } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";
import { authenticateAdmin } from "@/lib/auth";
import { decryptSecret } from "@/lib/utils/secret-encryption";

type RouteContext = {
  params: Promise<{ orderId: string }>;
};

function jsonError(message: string, status: number, code: string) {
  return NextResponse.json(
    { success: false, code, message },
    { status },
  );
}

export async function POST(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    // Require an authenticated, active ROOTYM administrator.
    const auth = await authenticateAdmin(request);

    if (!auth.authenticated) {
        return jsonError(
          auth.error ?? "Administrator authentication is required.",
          auth.status ?? 401,
          "ADMIN_AUTH_REQUIRED",
        );
      }

    const { orderId } = await context.params;

    if (!orderId?.trim()) {
      return jsonError(
        "A valid store order ID is required.",
        400,
        "INVALID_ORDER_ID",
      );
    }

    const order = await prisma.storeOrder.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        websiteId: true,
        orderNumber: true,
        currency: true,
        totalAmount: true,
        provider: true,
        providerOrderId: true,
        providerOrderCreationStatus: true,
        paymentStatus: true,
        status: true,
      },
    });

    if (!order) {
      return jsonError(
        "Store order was not found.",
        404,
        "STORE_ORDER_NOT_FOUND",
      );
    }

    // Never overwrite an existing gateway order association.
    if (order.providerOrderId) {
      return NextResponse.json({
        success: true,
        result: "ALREADY_LINKED",
        message: "This store order already has a gateway order ID.",
        orderNumber: order.orderNumber,
        providerOrderCreationStatus:
          order.providerOrderCreationStatus,
      });
    }

    if (
      order.status !== "PENDING_PAYMENT" ||
      order.paymentStatus !== "CREATED" ||
      order.totalAmount.lte(0)
    ) {
      return jsonError(
        "Only payable, unpaid store orders can be reconciled.",
        409,
        "STORE_ORDER_NOT_PAYABLE",
      );
    }

    if (
      !["UNKNOWN", "IN_PROGRESS", "CREATED"].includes(
        order.providerOrderCreationStatus,
      )
    ) {
      return jsonError(
        "This order is not in a reconciliation-required state.",
        409,
        "RECONCILIATION_NOT_REQUIRED",
      );
    }

    const payment =
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

    // Reconciliation is restricted to verified TEST credentials.
    // paymentsEnabled is intentionally not required here: this route
    // never initiates a payment or enables payments.
    if (
      !payment ||
      payment.provider !== "RAZORPAY" ||
      payment.environment !== "TEST" ||
      !payment.publicKeyId ||
      !payment.encryptedKeySecret ||
      !payment.verifiedAt
    ) {
      return jsonError(
        "Verified Razorpay TEST credentials are required for reconciliation.",
        409,
        "RAZORPAY_TEST_NOT_READY",
      );
    }

    const amountInPaise = order.totalAmount
      .mul(100)
      .toDecimalPlaces(0, Prisma.Decimal.ROUND_HALF_UP);

    if (
      !amountInPaise.isInteger() ||
      amountInPaise.lte(0) ||
      !Number.isSafeInteger(amountInPaise.toNumber())
    ) {
      return jsonError(
        "The local order amount is invalid.",
        400,
        "INVALID_PAYMENT_AMOUNT",
      );
    }

    const razorpay = new Razorpay({
      key_id: payment.publicKeyId,
      key_secret: decryptSecret(payment.encryptedKeySecret),
    });


    const gatewayResult = await razorpay.orders.all({
        receipt: order.orderNumber,
        count: 100,
        skip: 0,
      });
      
      const receiptOrders = gatewayResult.items.filter(
        (gatewayOrder) =>
          gatewayOrder.receipt === order.orderNumber,
      );
      
      // A full page may indicate that the result set is incomplete.
      // Do not risk linking an order based on a partial result set.
      if (gatewayResult.items.length >= 100) {
        return jsonError(
          "Razorpay returned the maximum page size for this receipt. Manual investigation is required before linking an order.",
          409,
          "GATEWAY_SEARCH_INCOMPLETE",
        );
      }
    
    // Multiple orders with the same receipt are ambiguous.
    if (receiptOrders.length > 1) {
      return jsonError(
        "Multiple Razorpay orders share this receipt. Manual investigation is required.",
        409,
        "MULTIPLE_GATEWAY_ORDERS",
      );
    }

    if (receiptOrders.length === 0) {
      // Deliberately do not reset the state to NOT_STARTED.
      return NextResponse.json(
        {
          success: false,
          code: "GATEWAY_ORDER_NOT_FOUND",
          result: "UNRESOLVED",
          message:
            "No matching Razorpay order was found. The order remains blocked from automatic retry.",
          orderNumber: order.orderNumber,
          providerOrderCreationStatus:
            order.providerOrderCreationStatus,
        },
        { status: 409 },
      );
    }

    const gatewayOrder = receiptOrders[0];

    // Require every independent reference to match before linking.
    const matchesLocalOrder =
      gatewayOrder.amount === amountInPaise.toNumber() &&
      gatewayOrder.currency === order.currency &&
      String(gatewayOrder.notes?.rootymStoreOrderId ?? "") ===
        order.id &&
      String(gatewayOrder.notes?.rootymOrderNumber ?? "") ===
        order.orderNumber;

    if (!matchesLocalOrder) {
      return jsonError(
        "The Razorpay order does not match the local order references, amount, or currency. No changes were made.",
        409,
        "GATEWAY_ORDER_MISMATCH",
      );
    }

    // A gateway order marked paid needs a separate payment-status
    // investigation. This endpoint never marks local orders as paid.
    if (gatewayOrder.status === "paid") {
      return NextResponse.json(
        {
          success: false,
          code: "GATEWAY_ORDER_ALREADY_PAID",
          result: "MANUAL_REVIEW_REQUIRED",
          message:
            "Razorpay reports this order as paid. Verify its payment records before changing the local order.",
          orderNumber: order.orderNumber,
        },
        { status: 409 },
      );
    }

    // Atomic compare-and-set prevents overwriting a concurrent update.
    const linked = await prisma.storeOrder.updateMany({
      where: {
        id: order.id,
        websiteId: order.websiteId,
        status: "PENDING_PAYMENT",
        paymentStatus: "CREATED",
        providerOrderId: null,
        providerOrderCreationStatus: {
          in: ["UNKNOWN", "IN_PROGRESS", "CREATED"],
        },
      },
      data: {
        providerOrderId: gatewayOrder.id,
        provider: "RAZORPAY",
        providerOrderCreationStatus: "CREATED",
      },
    });

    if (linked.count !== 1) {
      return jsonError(
        "The local order changed during reconciliation. Reload it and inspect its current state.",
        409,
        "RECONCILIATION_CONFLICT",
      );
    }

    return NextResponse.json({
      success: true,
      result: "RECONCILED",
      message:
        "The existing Razorpay TEST order was verified and linked to the local order.",
      orderNumber: order.orderNumber,
      providerOrderCreationStatus: "CREATED",
    });
  } catch (error) {
    // Do not log gateway credentials, decrypted secrets, or raw SDK errors.
    console.error("Storefront order reconciliation failed.", {
      errorType:
        error instanceof Error ? error.name : "UnknownError",
    });

    return jsonError(
      "Reconciliation could not be completed. The order state has not been intentionally reset.",
      500,
      "RECONCILIATION_FAILED",
    );
  }
}
