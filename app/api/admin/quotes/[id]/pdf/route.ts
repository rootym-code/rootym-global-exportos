/**
 * ============================================================
 * ROOTYM
 * File: app/api/admin/quotes/[id]/pdf/route.ts
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
 * GET /api/admin/quotes/:id/pdf
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

    /**
     * ==========================================================
     * Future Production Implementation
     * ==========================================================
     *
     * const pdf = await quotePdfService.generate(quote);
     *
     * return new NextResponse(pdf, {
     *   headers: {
     *     "Content-Type": "application/pdf",
     *     "Content-Disposition":
     *       `inline; filename="${quote.quoteNumber}.pdf"`
     *   }
     * });
     *
     * ==========================================================
     */

    return NextResponse.json({
      success: true,

      preview: true,

      quoteNumber: quote.quoteNumber,

      downloadName: `${quote.quoteNumber}.pdf`,

      message:
        "PDF generation service is ready for integration.",

      quote: {
        id: quote.id,

        quoteNumber: quote.quoteNumber,

        status: quote.status,

        companyName: quote.companyName,

        contactPerson: quote.contactPerson,

        email: quote.email,

        phone: quote.phone,

        country: quote.country,

        currency: quote.currency,

        validityDays: quote.validityDays,

        subtotal: quote.subtotal,

        discount: quote.discount,

        freight: quote.freight,

        insurance: quote.insurance,

        tax: quote.tax,

        grandTotal: quote.grandTotal,

        notes: quote.notes,

        items: quote.items,

        createdAt: quote.createdAt,

        updatedAt: quote.updatedAt,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to generate quote PDF.",
      },
      {
        status: 400,
      }
    );
  }
}
