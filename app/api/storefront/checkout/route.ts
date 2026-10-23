
import { NextRequest } from "next/server";

import ApiResponse from "@/lib/api/api-response";
import handleApiError from "@/lib/api/handle-api-error";
import {
  CheckoutError,
  createStoreOrder,
  type CreateCheckoutInput,
} from "@/lib/services/storefront-checkout.service";
import prisma from "@/lib/prisma";
import { createGuestOrderAccessToken } from "@/lib/services/guest-order-access.service";
import {
  StorefrontPaymentError,
  createRazorpayTestOrder,
} from "@/lib/services/storefront-payment.service";

export async function POST(request: NextRequest) {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return ApiResponse.error({
        message: "Request body must contain valid JSON.",
        code: "INVALID_JSON",
        status: 400,
      });
    }

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body)
    ) {
      return ApiResponse.error({
        message: "A valid checkout request is required.",
        code: "INVALID_CHECKOUT_REQUEST",
        status: 400,
      });
    }

    const checkoutInput = body as CreateCheckoutInput;

    const order = await createStoreOrder(checkoutInput);

    const website = await prisma.website.findFirst({
      where: {
        slug: checkoutInput.websiteSlug,
        isActive: true,
      },
      select: {
        id: true,
        storePayment: {
          select: {
            paymentsEnabled: true,
            verifiedAt: true,
          },
        },
      },
    });

    if (!website) {
      return ApiResponse.error({
        message: "This store is unavailable.",
        code: "STORE_NOT_FOUND",
        status: 404,
      });
    }

    const guestAccessToken = createGuestOrderAccessToken(
      order.id,
      website.id,
    );

    // Local order creation is complete. Do not initiate payment
    // unless payment activation and verification are both present.
    if (
      !website.storePayment?.paymentsEnabled ||
      !website.storePayment?.verifiedAt
    ) {
      return ApiResponse.created({
        message:
          "Order created successfully. Online payment is not enabled yet.",
        data: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          paymentStatus: "NOT_INITIATED",
          currency: order.currency,
          guestAccessToken,
          subtotal: order.subtotal.toString(),
          shippingAmount: order.shippingAmount.toString(),
          taxAmount: order.taxAmount.toString(),
          discountAmount: order.discountAmount.toString(),
          totalAmount: order.totalAmount.toString(),
        },
      });
    }

    const payment = await createRazorpayTestOrder({
      websiteId: website.id,
      storeOrderId: order.id,
    });

    const amountInPaise = Math.round(Number(payment.amount) * 100);

    return ApiResponse.created({
      message: "Order created. Continue to Razorpay TEST checkout.",
      data: {
        orderId: payment.orderId,
        orderNumber: payment.orderNumber,
        razorpayOrderId: payment.razorpayOrderId,
        publicKeyId: payment.publicKeyId,
        amount: amountInPaise,
        currency: payment.currency,
        guestAccessToken,
        subtotal: order.subtotal.toString(),
        shippingAmount: order.shippingAmount.toString(),
        taxAmount: order.taxAmount.toString(),
        discountAmount: order.discountAmount.toString(),
        totalAmount: order.totalAmount.toString(),
      },
    });

  } catch (error) {
    if (error instanceof StorefrontPaymentError) {
      return ApiResponse.error({
        message: error.message,
        code: error.code,
        status: error.status,
      });
    }

    if (error instanceof CheckoutError) {
      return ApiResponse.error({
        message: error.message,
        code: error.code,
        status: error.status,
      });
    }

    return handleApiError(error);
  }
}
