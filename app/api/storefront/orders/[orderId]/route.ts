
import { NextRequest } from "next/server";

import ApiResponse from "@/lib/api/api-response";
import handleApiError from "@/lib/api/handle-api-error";
import prisma from "@/lib/prisma";
import { verifyGuestOrderAccessToken } from "@/lib/services/guest-order-access.service";

type RouteContext = {
  params: Promise<{
    orderId: string;
  }>;
};

export async function GET(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const { orderId } = await context.params;
    const token = request.nextUrl.searchParams.get("token");

    if (!orderId || !token) {
      return ApiResponse.error({
        message: "Order access information is required.",
        code: "ORDER_ACCESS_REQUIRED",
        status: 400,
      });
    }

    const order = await prisma.storeOrder.findUnique({
      where: {
        id: orderId,
      },
      select: {
        id: true,
        websiteId: true,
        orderNumber: true,
        status: true,
        paymentStatus: true,
        currency: true,
        subtotal: true,
        shippingAmount: true,
        taxAmount: true,
        discountAmount: true,
        totalAmount: true,
        createdAt: true,
        items: {
          select: {
            productName: true,
            productSku: true,
            unit: true,
            quantity: true,
            unitPrice: true,
            lineTotal: true,
          },
        },
      },
    });

    if (!order) {
      return ApiResponse.error({
        message: "Order not found.",
        code: "ORDER_NOT_FOUND",
        status: 404,
      });
    }

    let tokenIsValid = false;

    try {
      tokenIsValid = verifyGuestOrderAccessToken(
        order.id,
        order.websiteId,
        token,
      );
    } catch (error) {
      // A missing or invalid server secret is a configuration error,
      // not a reason to disclose order information.
      return handleApiError(error);
    }

    if (!tokenIsValid) {
      return ApiResponse.error({
        message: "Order access could not be verified.",
        code: "INVALID_ORDER_ACCESS",
        status: 403,
      });
    }

    return ApiResponse.success({
      message: "Order retrieved successfully.",
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        currency: order.currency,
        subtotal: order.subtotal.toString(),
        shippingAmount: order.shippingAmount.toString(),
        taxAmount: order.taxAmount.toString(),
        discountAmount: order.discountAmount.toString(),
        totalAmount: order.totalAmount.toString(),
        createdAt: order.createdAt.toISOString(),
        items: order.items.map((item) => ({
          productName: item.productName,
          productSku: item.productSku,
          unit: item.unit,
          quantity: item.quantity,
          unitPrice: item.unitPrice.toString(),
          lineTotal: item.lineTotal.toString(),
        })),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
