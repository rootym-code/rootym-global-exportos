/**
 * ============================================================
 * ROOTYM
 * File: app/api/admin/proforma-invoices/[id]/route.ts
 * Sprint 8.1
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

import { verifyAdminToken } from "@/lib/jwt";
import { proformaInvoiceRepository } from "@/lib/repositories/proforma-invoice.repository";

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
 * ============================================================
 * GET /api/admin/proforma-invoices/:id
 * ============================================================
 *
 * Returns a single Proforma Invoice with:
 *
 * - PI details
 * - Customer details
 * - Original quotation
 * - Inquiry
 * - PI line items
 * - Product details
 *
 * This endpoint is read-only.
 * ============================================================
 */

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  const auth =
    await authorize(request);

  if (auth instanceof NextResponse) {
    return auth;
  }

  try {
    const { id } = await params;

    if (!id?.trim()) {
      return NextResponse.json(
        {
          message:
            "Proforma Invoice ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    const proformaInvoice =
      await proformaInvoiceRepository.findById(
        id
      );

    if (!proformaInvoice) {
      return NextResponse.json(
        {
          message:
            "Proforma Invoice not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      data: proformaInvoice,
    });
  } catch (error) {
    console.error(
      "Unable to load Proforma Invoice:",
      error
    );

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to load Proforma Invoice.",
      },
      {
        status: 500,
      }
    );
  }
}