
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireWorkspaceWebsite } from "@/app/lib/workspace/website/website-context.service";

type RouteContext = {
  params: Promise<{ orderId: string }>;
};

function isRedirectError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof error.digest === "string" &&
    error.digest.startsWith("NEXT_REDIRECT")
  );
}

export async function GET(
  _request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const context = await requireWorkspaceWebsite();
    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Order ID is required." },
        { status: 400 },
      );
    }

    const order = await prisma.storeOrder.findFirst({
      where: {
        id: orderId,
        websiteId: context.website.id,
      },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        paymentStatus: true,
        currency: true,
        subtotal: true,
        shippingAmount: true,
        discountAmount: true,
        taxAmount: true,
        totalAmount: true,
        shippingRuleName: true,
        taxType: true,
        taxableAmount: true,
        cgstRate: true,
        cgstAmount: true,
        sgstRate: true,
        sgstAmount: true,
        igstRate: true,
        igstAmount: true,
        customerName: true,
        customerEmail: true,
        customerPhone: true,
        courierName: true,
        trackingNumber: true,
        trackingUrl: true,
        shippedAt: true,
        shippingAddress1: true,
        shippingAddress2: true,
        shippingCity: true,
        shippingState: true,
        shippingPostalCode: true,
        shippingCountry: true,
        provider: true,
        providerOrderId: true,
        providerPaymentId: true,
        providerOrderCreationStatus: true,
        paidAt: true,
        paymentFailureReason: true,
        createdAt: true,
        updatedAt: true,
        items: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
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
      return NextResponse.json(
        { success: false, message: "Order not found in this workspace." },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    if (isRedirectError(error)) {
      return NextResponse.json(
        { success: false, message: "Workspace authentication is required." },
        { status: 401 },
      );
    }

    console.error("[Workspace order details] Failed to load order:", error);
    return NextResponse.json(
      { success: false, message: "Unable to load order details." },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const context = await requireWorkspaceWebsite();
    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Order ID is required." },
        { status: 400 },
      );
    }

    if (
      context.membership.role !== "OWNER" &&
      context.membership.role !== "ADMIN"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Only workspace owners and admins can update shipment details.",
        },
        { status: 403 },
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "A valid JSON request body is required." },
        { status: 400 },
      );
    }

    if (
      typeof body !== "object" ||
      body === null ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid shipment details." },
        { status: 400 },
      );
    }

    const data = body as Record<string, unknown>;
    const allowedKeys = new Set([
      "courierName",
      "trackingNumber",
      "trackingUrl",
    ]);

    if (
      Object.keys(data).length !== allowedKeys.size ||
      Object.keys(data).some((key) => !allowedKeys.has(key))
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Provide only courierName, trackingNumber, and trackingUrl.",
        },
        { status: 400 },
      );
    }

    const courierName =
      typeof data.courierName === "string" ? data.courierName.trim() : "";
    const trackingNumber =
      typeof data.trackingNumber === "string"
        ? data.trackingNumber.trim()
        : "";
    const trackingUrl =
      typeof data.trackingUrl === "string" ? data.trackingUrl.trim() : "";

    if (!courierName || !trackingNumber || !trackingUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "Courier name, tracking number, and tracking URL are required.",
        },
        { status: 400 },
      );
    }

    if (
      courierName.length > 120 ||
      trackingNumber.length > 200 ||
      trackingUrl.length > 2048
    ) {
      return NextResponse.json(
        { success: false, message: "One or more shipment fields exceed the allowed length." },
        { status: 400 },
      );
    }

    let parsedTrackingUrl: URL;

    try {
      parsedTrackingUrl = new URL(trackingUrl);
    } catch {
      return NextResponse.json(
        { success: false, message: "Enter a valid tracking URL." },
        { status: 400 },
      );
    }

    if (
      parsedTrackingUrl.protocol !== "https:" &&
      parsedTrackingUrl.protocol !== "http:"
    ) {
      return NextResponse.json(
        { success: false, message: "Tracking URL must use HTTP or HTTPS." },
        { status: 400 },
      );
    }

    const shippedAt = new Date();

    const result = await prisma.storeOrder.updateMany({
      where: {
        id: orderId,
        websiteId: context.website.id,
      },
      data: {
        courierName,
        trackingNumber,
        trackingUrl: parsedTrackingUrl.toString(),
        shippedAt,
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { success: false, message: "Order not found in this workspace." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Shipment details saved successfully.",
      shipment: {
        courierName,
        trackingNumber,
        trackingUrl: parsedTrackingUrl.toString(),
        shippedAt: shippedAt.toISOString(),
      },
    });
  } catch (error) {
    if (isRedirectError(error)) {
      return NextResponse.json(
        { success: false, message: "Workspace authentication is required." },
        { status: 401 },
      );
    }

    console.error("[Workspace order shipment] Failed to save shipment:", error);
    return NextResponse.json(
      { success: false, message: "Unable to save shipment details." },
      { status: 500 },
    );
  }
}
