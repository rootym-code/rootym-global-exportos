/**
 * Author: Prem Singh
 * Purpose: Admin API for listing GST billing invoices with optional status and search filters.
 */

import { NextRequest, NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/auth";
import { listBillingInvoicesForAdmin } from "@/lib/services/billing/billing-invoice-admin.service";

export async function GET(request: NextRequest) {
  try {
    const admin = await authenticateAdmin(request);

    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);

    const statusParam = searchParams.get("status")?.trim().toUpperCase();
    const search = searchParams.get("search")?.trim();

    const allowedStatuses = new Set([
      "PENDING",
      "GENERATED",
      "SENT",
      "FAILED",
    ]);

    if (statusParam && !allowedStatuses.has(statusParam)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid invoice status.",
        },
        { status: 400 },
      );
    }

    const invoices = await listBillingInvoicesForAdmin({
      status: statusParam
        ? (statusParam as "PENDING" | "GENERATED" | "SENT" | "FAILED")
        : undefined,
      search: search || undefined,
    });

    return NextResponse.json({
      success: true,
      invoices,
    });
  } catch (error) {
    console.error("[Admin Billing Invoices] GET error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load billing invoices.",
      },
      { status: 500 },
    );
  }
}
