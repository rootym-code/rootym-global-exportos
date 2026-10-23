import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireWorkspaceWebsite } from "@/app/lib/workspace/website/website-context.service";

type RouteContext = {
  params: Promise<{ orderId: string }>;
};

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

    // Always scope the lookup to the website authorized for this workspace.
    // Do not accept a website ID from the browser.
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
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.startsWith("NEXT_REDIRECT")
    ) {
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
