/**
 * ============================================================
 * ROOTYM ExportOS — Admin Inquiries API
 * ============================================================
 *
 * Purpose:
 * Provides ROOTYM Admin with a searchable and paginated
 * list of customer inquiries.
 *
 * Tenant filtering:
 * - No tenantId = All Customers
 * - tenantId = selected customer workspace
 * - Filtering is performed server-side through:
 *
 *     Tenant
 *       ↓
 *     Website
 *       ↓
 *     Inquiry
 *
 * Security:
 * - Uses the existing ROOTYM Admin JWT authentication system.
 * - Does not create a second authentication mechanism.
 * - Tenant filtering is enforced server-side.
 *
 * Search:
 * - Company name
 * - Contact person
 * - Email
 * - Inquiry number
 *
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { authenticateAdmin } from "@/lib/auth";

import {
  InquiryPriority,
  InquiryStatus,
} from "@/lib/generated/prisma";

export async function GET(request: NextRequest) {
  try {
    /**
     * ==========================================================
     * 1. Authenticate Admin
     * ==========================================================
     */

    const auth = await authenticateAdmin(request);

    if (!auth.authenticated) {
      return NextResponse.json(
        {
          success: false,
          message: auth.error,
        },
        {
          status: auth.status,
        }
      );
    }

    /**
     * ==========================================================
     * 2. Read query parameters
     * ==========================================================
     */

    const { searchParams } = new URL(request.url);

    const page = Number(
      searchParams.get("page") ?? "1"
    );

    const limit = Number(
      searchParams.get("limit") ?? "10"
    );

    const search =
      searchParams.get("search")?.trim() ?? "";

    const status =
      searchParams.get("status")?.trim() ?? "";

    const priority =
      searchParams.get("priority")?.trim() ?? "";

    /**
     * Selected customer workspace.
     *
     * null / empty = All Customers
     */
    const tenantId =
      searchParams.get("tenantId")?.trim() ?? "";

    /**
     * ==========================================================
     * 3. Build inquiry filter
     * ==========================================================
     */

    const where: any = {};

    /**
     * ----------------------------------------------------------
     * Search
     * ----------------------------------------------------------
     */

    if (search) {
      where.OR = [
        {
          companyName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          contactPerson: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          inquiryNumber: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    /**
     * ----------------------------------------------------------
     * Status
     * ----------------------------------------------------------
     */

    if (
      status &&
      Object.values(InquiryStatus).includes(
        status as InquiryStatus
      )
    ) {
      where.status = status;
    }

    /**
     * ----------------------------------------------------------
     * Priority
     * ----------------------------------------------------------
     */

    if (
      priority &&
      Object.values(InquiryPriority).includes(
        priority as InquiryPriority
      )
    ) {
      where.priority = priority;
    }

    /**
     * ----------------------------------------------------------
     * Tenant / Customer Workspace
     * ----------------------------------------------------------
     *
     * Inquiry does not directly contain tenantId.
     *
     * The ownership chain is:
     *
     * Inquiry → Website → Tenant
     *
     * Therefore tenant filtering must happen through the
     * Website relation.
     *
     * The tenant must also be active.
     *
     * Legacy inquiries without websiteId naturally remain
     * visible under "All Customers", but will not appear
     * when a specific tenant is selected.
     */

    if (tenantId) {
      where.website = {
        is: {
          tenant: {
            id: tenantId,
            isActive: true,
          },
        },
      };
    }

    /**
     * ==========================================================
     * 4. Pagination safety
     * ==========================================================
     */

    const safePage =
      Number.isFinite(page) && page > 0
        ? Math.floor(page)
        : 1;

    const safeLimit =
      Number.isFinite(limit) &&
      limit > 0 &&
      limit <= 100
        ? Math.floor(limit)
        : 10;

    /**
     * ==========================================================
     * 5. Count matching inquiries
     * ==========================================================
     */

    const total = await prisma.inquiry.count({
      where,
    });

    /**
     * ==========================================================
     * 6. Load matching inquiries
     * ==========================================================
     */

    const inquiries =
      await prisma.inquiry.findMany({
        where,

        orderBy: {
          createdAt: "desc",
        },

        skip: (safePage - 1) * safeLimit,

        take: safeLimit,
      });

    /**
     * ==========================================================
     * 7. Return result
     * ==========================================================
     */

    return NextResponse.json({
      success: true,

      inquiries,

      pagination: {
        page: safePage,
        limit: safeLimit,
        totalRecords: total,
        totalPages: Math.ceil(
          total / safeLimit
        ),
      },
    });
  } catch (error) {
    console.error(
      "GET /api/admin/inquiries error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}