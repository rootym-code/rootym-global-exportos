/**
 * ============================================================
 * ROOTYM
 * File: app/api/admin/quotes/[id]/status/route.ts
 * Sprint 8.1
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

import { verifyAdminToken } from "@/lib/jwt";
import { quoteManagementService } from "@/lib/services/quote-management.service";
import { quoteStatusSchema } from "@/lib/validators/quote";
import {
  getNextAllowedStatuses,
  isQuoteFinal,
} from "@/lib/utils/quote-status";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

async function authorize(request: NextRequest) {
  const token =
    request.cookies.get("rootym_admin_token")?.value;

  if (!token) {
    return NextResponse.json(
      {
        message: "Unauthorized.",
      },
      {
        status: 401,
      }
    );
  }

  const admin = await verifyAdminToken(token);

  if (!admin) {
    return NextResponse.json(
      {
        message: "Unauthorized.",
      },
      {
        status: 401,
      }
    );
  }

  return admin;
}

/**
 * ============================================================
 * STATUS UPDATE HANDLER
 * ============================================================
 *
 * Shared implementation for both:
 *
 * PATCH /api/admin/quotes/:id/status
 * POST  /api/admin/quotes/:id/status
 *
 * The frontend currently uses POST.
 * PATCH remains supported for REST compatibility.
 * ============================================================
 */

async function updateQuoteStatus(
  request: NextRequest,
  { params }: RouteContext
) {
  const auth = await authorize(request);

  if (auth instanceof NextResponse) {
    return auth;
  }

  try {
    const { id } = await params;

    const body = await request.json();

    const input = quoteStatusSchema.parse(body);

    const quote = await quoteManagementService.get(id);

    if (isQuoteFinal(quote.status)) {
      return NextResponse.json(
        {
          message:
            "Finalized quotes cannot be modified.",
        },
        {
          status: 409,
        }
      );
    }

    const allowedStatuses =
      getNextAllowedStatuses(quote.status);

    if (
      !allowedStatuses.includes(
        input.status
      )
    ) {
      return NextResponse.json(
        {
          message: `Invalid status transition from ${quote.status} to ${input.status}.`,
        },
        {
          status: 400,
        }
      );
    }

    const updated =
      await quoteManagementService.changeStatus(
        id,
        input.status
      );

    /**
     * Future enhancement:
     *
     * await auditService.log(...)
     * await notificationService.notify(...)
     * await emailService.send(...)
     */

    return NextResponse.json({
      success: true,
      message:
        "Quote status updated successfully.",
      data: updated,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to update quote status.",
      },
      {
        status: 400,
      }
    );
  }
}

/**
 * ============================================================
 * PATCH /api/admin/quotes/:id/status
 * ============================================================
 */

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  return updateQuoteStatus(request, context);
}

/**
 * ============================================================
 * POST /api/admin/quotes/:id/status
 * ============================================================
 *
 * The current Quote Details UI sends POST when the admin
 * clicks "Mark as Accepted".
 *
 * Keep POST supported so the existing frontend does not need
 * to be changed.
 * ============================================================
 */

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  return updateQuoteStatus(request, context);
}