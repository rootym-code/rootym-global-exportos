import { NextRequest, NextResponse } from "next/server";

import { authenticateAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  StoreOrderPaymentStatus,
  StoreOrderStatus,
} from "@/lib/generated/prisma";

export const dynamic = "force-dynamic";

const DEFAULT_PAGE_SIZE = 25;
const MAX_PAGE_SIZE = 100;

export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate the admin.
    const auth = await authenticateAdmin(request);

    if (!auth.authenticated) {
      return NextResponse.json(
        {
          success: false,
          error: auth.error ?? "Authentication required.",
        },
        { status: auth.status ?? 401 }
      );
    }

    // 2. Read and validate query parameters.
    const { searchParams } = new URL(request.url);

    const search = (searchParams.get("search") ?? "").trim();
    const statusFilter = searchParams.get("status") ?? "ALL";
    const paymentFilter = searchParams.get("paymentStatus") ?? "ALL";

    const requestedPage = Number(searchParams.get("page") ?? "1");
    const requestedPageSize = Number(
      searchParams.get("pageSize") ?? String(DEFAULT_PAGE_SIZE)
    );

    const page =
      Number.isSafeInteger(requestedPage) && requestedPage > 0
        ? requestedPage
        : 1;

    const pageSize =
      Number.isSafeInteger(requestedPageSize) && requestedPageSize > 0
        ? Math.min(requestedPageSize, MAX_PAGE_SIZE)
        : DEFAULT_PAGE_SIZE;

    // 3. Validate status filters against the actual Prisma enums.
    const validOrderStatuses = Object.values(StoreOrderStatus) as string[];
    const validPaymentStatuses = Object.values(
      StoreOrderPaymentStatus
    ) as string[];

    if (
      statusFilter !== "ALL" &&
      !validOrderStatuses.includes(statusFilter)
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid order status filter." },
        { status: 400 }
      );
    }

    if (
      paymentFilter !== "ALL" &&
      !validPaymentStatuses.includes(paymentFilter)
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid payment status filter." },
        { status: 400 }
      );
    }

    // 4. Build the database filters.
    const where = {
      ...(statusFilter !== "ALL" && {
        status: statusFilter as StoreOrderStatus,
      }),

      ...(paymentFilter !== "ALL" && {
        paymentStatus: paymentFilter as StoreOrderPaymentStatus,
      }),

      ...(search.length > 0 && {
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
          {
            customerPhone: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            shippingCity: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            shippingPostalCode: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
        ],
      }),
    };

    // 5. Fetch the requested page and total count.
    const [orders, total] = await prisma.$transaction([
      prisma.storeOrder.findMany({
        where,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,

        select: {
          id: true,
          websiteId: true,
          orderNumber: true,
          status: true,
          paymentStatus: true,
          currency: true,
          subtotal: true,
          shippingAmount: true,
          discountAmount: true,
          taxAmount: true,
          totalAmount: true,
          customerName: true,
          customerEmail: true,
          customerPhone: true,
          shippingCity: true,
          shippingState: true,
          shippingPostalCode: true,
          shippingCountry: true,
          provider: true,
          providerOrderId: true,
          providerPaymentId: true,
          paidAt: true,
          paymentFailureReason: true,
          createdAt: true,
          updatedAt: true,

          website: {
            select: {
              name: true,
              slug: true,
            },
          },

          items: {
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
      }),

      prisma.storeOrder.count({ where }),
    ]);

    // 6. Return the response in the format expected by the admin UI.
    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      },
    });
  } catch (error) {
    console.error("[Admin Storefront Orders GET]", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load orders.",
      },
      { status: 500 }
    );
  }
}