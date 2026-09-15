/**
 * Author: Prem Singh
 * Purpose: Admin API for retrieving a GST billing invoice and marking it as sent.
 */

import { NextRequest, NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/auth";
import {
  getBillingInvoiceForAdmin,
  markBillingInvoiceAsSent,
} from "@/lib/services/billing/billing-invoice-admin.service";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const admin = await authenticateAdmin(request);

    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await context.params;

    const invoice = await getBillingInvoiceForAdmin(id);

    if (!invoice) {
      return NextResponse.json(
        {
          success: false,
          error: "Billing invoice not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      invoice,
    });
  } catch (error) {
    console.error("[Admin Billing Invoice] GET error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load billing invoice.",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const admin = await authenticateAdmin(request);

    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await context.params;

    let body: { action?: string } = {};

    try {
      body = await request.json();
    } catch {
      // Empty request body is handled by the action validation below.
    }

    if (body.action !== "mark_sent") {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid action. Expected "mark_sent".',
        },
        { status: 400 },
      );
    }

    const invoice = await markBillingInvoiceAsSent(id);

    return NextResponse.json({
      success: true,
      invoice,
      message: "Billing invoice marked as sent.",
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update billing invoice.";

    console.error("[Admin Billing Invoice] PATCH error:", error);

    if (message === "Billing invoice not found.") {
      return NextResponse.json(
        {
          success: false,
          error: message,
        },
        { status: 404 },
      );
    }

    if (
      message === "Only a generated invoice can be marked as sent." ||
      message === "Invoice ID is required."
    ) {
      return NextResponse.json(
        {
          success: false,
          error: message,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update billing invoice.",
      },
      { status: 500 },
    );
  }
}
