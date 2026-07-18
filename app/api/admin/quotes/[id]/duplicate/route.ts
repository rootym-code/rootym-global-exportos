/**
 * ============================================================
 * ROOTYM
 * File: app/api/admin/quotes/[id]/duplicate/route.ts
 * Sprint 8.1
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

import { verifyAdminToken } from "@/lib/jwt";
import { quoteManagementService } from "@/lib/services/quote-management.service";

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
 * POST /api/admin/quotes/:id/duplicate
 * ------------------------------------------------------------
 */

export async function POST(
  request: NextRequest,
  { params }: RouteContext
) {
  const auth = await authorize(request);

  if (auth instanceof NextResponse) {
    return auth;
  }

  try {
    const { id } = await params;

    const existing =
      await quoteManagementService.get(id);

    const duplicated =
      await quoteManagementService.create({
        inquiryId: existing.inquiryId,

        status: "DRAFT",

        companyName:
          existing.companyName,

        contactPerson:
          existing.contactPerson,

        email:
          existing.email,

        phone:
          existing.phone,

        country:
          existing.country,

        currency:
          existing.currency,

        validityDays:
          existing.validityDays,

        notes:
          existing.notes,

        subtotal:
          existing.subtotal,

        discount:
          existing.discount,

        freight:
          existing.freight,

        insurance:
          existing.insurance,

        tax:
          existing.tax,

        grandTotal:
          existing.grandTotal,

        items: existing.items.map(
          (item) => ({
            productId:
              item.productId,

            description:
              item.description,

            quantity:
              item.quantity,

            unit:
              item.unit,

            unitPrice:
              item.unitPrice,

            lineTotal:
              item.lineTotal,
          })
        ),
      });

    return NextResponse.json(
      {
        success: true,
        message:
          "Quote duplicated successfully.",
        data: duplicated,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to duplicate quote.",
      },
      {
        status: 400,
      }
    );
  }
}