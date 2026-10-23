
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email/sendEmail";
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
          message:
            "Only workspace owners and admins can update shipment details.",
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
          message:
            "Provide only courierName, trackingNumber, and trackingUrl.",
        },
        { status: 400 },
      );
    }

    const courierName =
      typeof data.courierName === "string"
        ? data.courierName.trim()
        : "";

    const trackingNumber =
      typeof data.trackingNumber === "string"
        ? data.trackingNumber.trim()
        : "";

    const trackingUrl =
      typeof data.trackingUrl === "string"
        ? data.trackingUrl.trim()
        : "";

    if (!courierName || !trackingNumber || !trackingUrl) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Courier name, tracking number, and tracking URL are required.",
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
        {
          success: false,
          message:
            "One or more shipment fields exceed the allowed length.",
        },
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
        {
          success: false,
          message: "Tracking URL must use HTTP or HTTPS.",
        },
        { status: 400 },
      );
    }

    const normalizedTrackingUrl = parsedTrackingUrl.toString();

    // Load the current order within the authorized website.
    const existingOrder = await prisma.storeOrder.findFirst({
      where: {
        id: orderId,
        websiteId: context.website.id,
      },
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        customerEmail: true,
        courierName: true,
        trackingNumber: true,
        trackingUrl: true,
        shippedAt: true,
        shipmentEmailSentAt: true,
        shipmentEmailError: true,
      },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { success: false, message: "Order not found in this workspace." },
        { status: 404 },
      );
    }

    const shipmentChanged =
      existingOrder.courierName !== courierName ||
      existingOrder.trackingNumber !== trackingNumber ||
      existingOrder.trackingUrl !== normalizedTrackingUrl;

    // Keep the original shipment date when the details are unchanged.
    const shippedAt =
      shipmentChanged || !existingOrder.shippedAt
        ? new Date()
        : existingOrder.shippedAt;

    // Save shipment details first. Email errors must never undo this save.
    const result = await prisma.storeOrder.updateMany({
      where: {
        id: orderId,
        websiteId: context.website.id,
      },
      data: {
        courierName,
        trackingNumber,
        trackingUrl: normalizedTrackingUrl,
        shippedAt,
        ...(shipmentChanged
          ? {
              shipmentEmailSentAt: null,
              shipmentEmailError: null,
            }
          : {}),
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { success: false, message: "Order not found in this workspace." },
        { status: 404 },
      );
    }

    // Skip a duplicate email when the current shipment was already notified.
    // An unsent or previously failed notification can be retried by saving again.
    const shouldSendEmail =
      shipmentChanged || existingOrder.shipmentEmailSentAt === null;

    if (!shouldSendEmail) {
      return NextResponse.json({
        success: true,
        message: "Shipment details saved. No changes detected; no duplicate email was sent.",
        emailNotification: {
          status: "skipped",
          message: "The current shipment notification was already sent.",
        },
        shipment: {
          courierName,
          trackingNumber,
          trackingUrl: normalizedTrackingUrl,
          shippedAt: shippedAt.toISOString(),
        },
      });
    }

    const customerEmail = existingOrder.customerEmail.trim();

    try {
      if (!customerEmail) {
        throw new Error("The order has no customer email address.");
      }

      const escapeHtml = (value: string) =>
        value.replace(/[&<>"']/g, (character) => {
          const entities: Record<string, string> = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
          };

          return entities[character];
        });

      const shipmentDate = shippedAt.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Kolkata",
      });

      const emailSubject = `Shipment ${shipmentChanged ? "update" : "notification"} for order ${existingOrder.orderNumber}`;

      const emailText = [
        `Dear ${existingOrder.customerName},`,
        "",
        shipmentChanged
          ? "Your shipment details have been updated."
          : "Your order shipment details are available.",
        "",
        `Order number: ${existingOrder.orderNumber}`,
        `Courier: ${courierName}`,
        `Tracking number: ${trackingNumber}`,
        `Shipment date: ${shipmentDate}`,
        `Track your shipment: ${normalizedTrackingUrl}`,
        "",
        "Thank you for shopping with us.",
        "ROOTYM",
      ].join("\n");

      const emailHtml = `
        <div style="font-family:Arial,sans-serif;color:#1f2937;line-height:1.6;max-width:600px;margin:0 auto">
          <h2 style="color:#047857">Your shipment ${shipmentChanged ? "has been updated" : "is ready to track"}</h2>
          <p>Dear ${escapeHtml(existingOrder.customerName)},</p>
          <p>
            ${shipmentChanged
              ? "The shipment details for your order have been updated."
              : "Your order shipment details are available below."}
          </p>
          <table style="border-collapse:collapse;width:100%;margin:20px 0">
            <tr>
              <td style="padding:8px;border-bottom:1px solid #e5e7eb"><strong>Order number</strong></td>
              <td style="padding:8px;border-bottom:1px solid #e5e7eb">${escapeHtml(existingOrder.orderNumber)}</td>
            </tr>
            <tr>
              <td style="padding:8px;border-bottom:1px solid #e5e7eb"><strong>Courier</strong></td>
              <td style="padding:8px;border-bottom:1px solid #e5e7eb">${escapeHtml(courierName)}</td>
            </tr>
            <tr>
              <td style="padding:8px;border-bottom:1px solid #e5e7eb"><strong>Tracking number</strong></td>
              <td style="padding:8px;border-bottom:1px solid #e5e7eb">${escapeHtml(trackingNumber)}</td>
            </tr>
            <tr>
              <td style="padding:8px;border-bottom:1px solid #e5e7eb"><strong>Shipment date</strong></td>
              <td style="padding:8px;border-bottom:1px solid #e5e7eb">${escapeHtml(shipmentDate)}</td>
            </tr>
          </table>
          <p>
            <a href="${escapeHtml(normalizedTrackingUrl)}"
               style="display:inline-block;background:#047857;color:#ffffff;padding:12px 20px;text-decoration:none;border-radius:6px">
              Track your shipment
            </a>
          </p>
          <p>Thank you for shopping with us.</p>
          <p><strong>ROOTYM</strong></p>
        </div>
      `;

      await sendEmail({
        to: customerEmail,
        subject: emailSubject,
        text: emailText,
        html: emailHtml,
      });

      // Record success only after the SMTP service resolves successfully.
      await prisma.storeOrder.updateMany({
        where: {
          id: orderId,
          websiteId: context.website.id,
        },
        data: {
          shipmentEmailSentAt: new Date(),
          shipmentEmailError: null,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Shipment details saved and customer email sent successfully.",
        emailNotification: {
          status: "sent",
          recipient: customerEmail,
        },
        shipment: {
          courierName,
          trackingNumber,
          trackingUrl: normalizedTrackingUrl,
          shippedAt: shippedAt.toISOString(),
        },
      });
    } catch (emailError) {
      const errorMessage =
        emailError instanceof Error
          ? emailError.message
          : "Unknown email delivery error.";

      console.error(
        "[Workspace shipment email] Notification failed:",
        {
          orderId,
          orderNumber: existingOrder.orderNumber,
          error: errorMessage,
        },
      );

      // Keep the shipment saved and record the notification failure.
      try {
        await prisma.storeOrder.updateMany({
          where: {
            id: orderId,
            websiteId: context.website.id,
          },
          data: {
            shipmentEmailError: errorMessage.slice(0, 1000),
          },
        });
      } catch (trackingError) {
        console.error(
          "[Workspace shipment email] Failed to record notification error:",
          trackingError,
        );
      }

      return NextResponse.json({
        success: true,
        message: "Shipment details were saved, but the customer email could not be sent.",
        emailNotification: {
          status: "failed",
          message:
            "The shipment is saved. Please check the email configuration or delivery error before retrying.",
        },
        shipment: {
          courierName,
          trackingNumber,
          trackingUrl: normalizedTrackingUrl,
          shippedAt: shippedAt.toISOString(),
        },
      });
    }
  } catch (error) {
    if (isRedirectError(error)) {
      return NextResponse.json(
        { success: false, message: "Workspace authentication is required." },
        { status: 401 },
      );
    }

    console.error(
      "[Workspace order shipment] Failed to save shipment:",
      error,
    );

    return NextResponse.json(
      { success: false, message: "Unable to save shipment details." },
      { status: 500 },
    );
  }
}
