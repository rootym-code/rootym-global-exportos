/**
 * ============================================================
 * ROOTYM Quote PDF Download API
 * File: app/api/admin/quotes/[id]/pdf/route.ts
 * Sprint 8
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

import { authenticateAdmin } from "@/lib/auth";
import { quoteGenerator } from "@/lib/pdf";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const auth = await authenticateAdmin(request);

    if (!auth.authenticated) {
      return NextResponse.json(
        {
          success: false,
          message: auth.error,
        },
        {
          status: auth.status ?? 401,
        }
      );
    }

    const { id } = await params;

    const quote = await prisma.quote.findUnique({
      where: {
        id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!quote) {
      return NextResponse.json(
        {
          success: false,
          message: "Quotation not found.",
        },
        {
          status: 404,
        }
      );
    }

    const pdf = await quoteGenerator.generateBuffer({
      quoteNumber: quote.quoteNumber,

      quoteDate: quote.createdAt,

      validUntil: new Date(
        quote.createdAt.getTime() +
          quote.validityDays *
            24 *
            60 *
            60 *
            1000
      ),

      buyerName: quote.contactPerson,
      buyerCompany: quote.companyName,
      buyerAddress: "",
      buyerCountry: quote.country,

      currency: quote.currency,

      subtotal: quote.subtotal,
      discount: quote.discount,
      freight: quote.freight,
      insurance: quote.insurance,
      tax: quote.tax,
      grandTotal: quote.grandTotal,

      notes: quote.notes ?? "",

      items: quote.items.map((item) => ({
        description:
          item.product?.name ??
          item.description ??
          "",
        quantity: Number(item.quantity),
        unit: item.unit,
        unitPrice: item.unitPrice,
        lineTotal: item.lineTotal,
      })),
    });

    return new NextResponse(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${quote.quoteNumber}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error(
      "GET /api/admin/quotes/[id]/pdf",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to generate quotation PDF.",
      },
      {
        status: 500,
      }
    );
  }
}