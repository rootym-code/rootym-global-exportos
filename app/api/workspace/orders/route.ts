
/**
 * ============================================================
 * ROOTYM Global ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Customer Workspace API for listing Website-scoped
 *          Store Orders.
 *
 * Security:
 * - Customer Workspace authentication is mandatory.
 * - Website scope comes from requireWorkspaceWebsite().
 * - Never trust websiteId supplied by the browser.
 * - Never expose orders belonging to another Website.
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireWorkspaceWebsite } from "@/app/lib/workspace/website/website-context.service";
import {
  StoreOrderStatus,
  PaymentStatus,
} from "@/lib/generated/prisma";

function isWorkspaceAuthRedirect(error: unknown): boolean {
  return (
    error instanceof Error &&
    "digest" in error &&
    typeof error.digest === "string" &&
    error.digest.startsWith("NEXT_REDIRECT")
  );
}

export async function GET(request: NextRequest) {
  try {
    // Authenticate Workspace and resolve its authorized Website.
    const context = await requireWorkspaceWebsite();
    const websiteId = context.website.id;

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() || undefined;

    const requestedStatus =
      searchParams.get("status")?.trim() || undefined;

    const requestedPaymentStatus =
      searchParams.get("paymentStatus")?.trim() || undefined;

    // The UI uses ALL to mean that no filter is selected.
    const statusFilter =
      requestedStatus?.toUpperCase() === "ALL"
        ? undefined
        : requestedStatus;

    const paymentStatusFilter =
      requestedPaymentStatus?.toUpperCase() === "ALL"
        ? undefined
        : requestedPaymentStatus;

    const page = Math.max(
      1,
      Number(searchParams.get("page") ?? "1") || 1,
    );

    const pageSize = Math.min(
      100,
      Math.max(
        1,
        Number(searchParams.get("pageSize") ?? "25") || 25,
      ),
    );

    // Validate status filters when a specific status is selected.
    if (
      statusFilter &&
      !Object.values(StoreOrderStatus).includes(
        statusFilter as StoreOrderStatus,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid order status.",
        },
        { status: 400 },
      );
    }

    if (
      paymentStatusFilter &&
      !Object.values(PaymentStatus).includes(
        paymentStatusFilter as PaymentStatus,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payment status.",
        },
        { status: 400 },
      );
    }

    // Every query is restricted to the authenticated Website.
    const where = {
      websiteId,
      ...(statusFilter
        ? { status: statusFilter as StoreOrderStatus }
        : {}),
      ...(paymentStatusFilter
        ? { paymentStatus: paymentStatusFilter as PaymentStatus }
        : {}),
      ...(search
        ? {
            OR: [
              {
                orderNumber: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                customerName: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                customerEmail: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),
    };

    const [orders, totalRecords] = await Promise.all([
      prisma.storeOrder.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { items: true },
      }),
      prisma.storeOrder.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        page,
        pageSize,
        totalRecords,
        totalPages: Math.ceil(totalRecords / pageSize),
      },
    });
  } catch (error) {
    if (isWorkspaceAuthRedirect(error)) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer Workspace authentication required.",
          code: "AUTHENTICATION_REQUIRED",
        },
        { status: 401 },
      );
    }

    console.error("Workspace orders GET failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load Workspace orders.",
      },
      { status: 500 },
    );
  }
}
