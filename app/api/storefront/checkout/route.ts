
import { NextRequest } from "next/server";

import ApiResponse from "@/lib/api/api-response";
import handleApiError from "@/lib/api/handle-api-error";
import {
  CheckoutError,
  createStoreOrder,
  type CreateCheckoutInput,
} from "@/lib/services/storefront-checkout.service";

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

    const order = await createStoreOrder(body as CreateCheckoutInput);

    return ApiResponse.created({
      message:
        "Order created. Payment has not been initiated; checkout is not complete until the Razorpay flow is implemented.",
      data: order,
    });
  } catch (error) {
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
