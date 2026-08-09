/**
 * ============================================================
 * ROOTYM
 * File: app/api/admin/quotes/[id]/proforma/route.ts
 * Sprint 8.1
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

import { verifyAdminToken } from "@/lib/jwt";
import { quoteManagementService } from "@/lib/services/quote-management.service";
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
 * POST /api/admin/quotes/:id/proforma
 * ============================================================
 *
 * Creates a Proforma Invoice from an APPROVED quotation.
 *
 * Business rules:
 * 1. Admin must be authenticated.
 * 2. Quote must exist.
 * 3. Quote must be APPROVED.
 * 4. Only one PI may exist for a quotation.
 * 5. PI numbering uses the existing PI NumberSequence.
 * 6. Quote itself is never modified.
 * ============================================================
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

    /**
     * Verify that the quotation exists.
     */
    const quote =
      await quoteManagementService.get(id);

    /**
     * Only approved quotations can become
     * Proforma Invoices.
     */
    if (quote.status !== "APPROVED") {
      return NextResponse.json(
        {
          message:
            "Only approved quotations can be converted to a Proforma Invoice.",
        },
        {
          status: 400,
        }
      );
    }

    /**
     * Prevent duplicate PI creation.
     *
     * If a PI already exists, return the existing
     * PI instead of creating another one.
     */
    const existing =
      await proformaInvoiceRepository.findByQuoteId(
        id
      );

    if (existing) {
      return NextResponse.json({
        success: true,
        message:
          "A Proforma Invoice already exists for this quotation.",
        data: {
          id: existing.id,
          piNumber: existing.piNumber,
          status: existing.status,
          existing: true,
        },
      });
    }

    /**
     * Generate the next PI sequence number.
     *
     * The repository maintains a separate
     * PROFORMA_INVOICE NumberSequence.
     */
    const sequence =
      await proformaInvoiceRepository.nextSequence();

    const year =
      new Date().getFullYear();

    const piNumber =
      `PI-${year}-${sequence
        .toString()
        .padStart(6, "0")}`;

    /**
     * Create the PI as an independent snapshot
     * of the approved quotation.
     */
    const created =
      await proformaInvoiceRepository.createFromApprovedQuote(
        id,
        piNumber
      );

    return NextResponse.json(
      {
        success: true,
        message:
          "Proforma Invoice created successfully.",
        data: {
          id: created.id,
          piNumber: created.piNumber,
          status: created.status,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Unable to create Proforma Invoice:",
      error
    );

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to create Proforma Invoice.",
      },
      {
        status: 400,
      }
    );
  }
}