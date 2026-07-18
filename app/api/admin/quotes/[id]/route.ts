/**
 * ============================================================
 * ROOTYM
 * File: app/api/admin/quotes/[id]/route.ts
 * Sprint 8.1
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

import { quoteManagementService } from "@/lib/services/quote-management.service";
import { verifyAdminToken } from "@/lib/jwt";

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

  const admin =
    await verifyAdminToken(token);

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
 * ------------------------------------------------------------
 * GET /api/admin/quotes/:id
 * ------------------------------------------------------------
 */

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  const auth = await authorize(request);

  if (auth instanceof NextResponse) {
    return auth;
  }

  try {
    const { id } = await params;

    const quote =
      await quoteManagementService.get(id);

    return NextResponse.json(quote);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to load quote.",
      },
      {
        status: 404,
      }
    );
  }
}

/**
 * ------------------------------------------------------------
 * PUT /api/admin/quotes/:id
 * ------------------------------------------------------------
 */

export async function PUT(
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

    const quote =
      await quoteManagementService.update(
        id,
        body
      );

    return NextResponse.json(quote);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to update quote.",
      },
      {
        status: 400,
      }
    );
  }
}

/**
 * ------------------------------------------------------------
 * DELETE /api/admin/quotes/:id
 * ------------------------------------------------------------
 */

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  const auth = await authorize(request);

  if (auth instanceof NextResponse) {
    return auth;
  }

  try {
    const { id } = await params;

    await quoteManagementService.delete(id);

    return NextResponse.json({
      success: true,
      message:
        "Quote deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to delete quote.",
      },
      {
        status: 400,
      }
    );
  }
}