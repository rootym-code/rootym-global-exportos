/**
 * ============================================================
 * ROOTYM Global ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Generates and downloads a Website-scoped quotation
 *          PDF from Customer Workspace using shared commercial
 *          data and tenant/Website seller identity.
 * ============================================================
 */

import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

import { quoteGenerator } from "@/lib/pdf";

import { getCommercialSellerProfile } from "@/lib/services/commercial-document-profile.service";

import { requireWorkspaceWebsite } from "@/app/lib/workspace/website/website-context.service";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  _request: Request,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;

    const workspace = await requireWorkspaceWebsite();

    const quote = await prisma.quote.findFirst({
      where: {
        id,
        websiteId: workspace.website.id,
      },
      include: {
        inquiry: true,
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
        { status: 404 },
      );
    }

    const seller =
      await getCommercialSellerProfile(
        workspace.website.id,
      );

    const pdf = await quoteGenerator.generateBuffer({
      quoteNumber: quote.quoteNumber,
      quoteDate: quote.createdAt,
      validUntil:
        quote.validUntil ?? quote.createdAt,

      buyerName:
        quote.contactPerson,

      buyerCompany:
        quote.companyName,

      buyerAddress:
        quote.buyerAddress ?? "",

      buyerCountry:
        quote.country,

      buyerGstin:
        quote.buyerGstin ?? "",

      seller,

      currency:
        quote.currency,

      subtotal:
        quote.subtotal,

      discount:
        quote.discount,

      freight:
        quote.freight,

      insurance:
        quote.insurance,

      tax:
        quote.tax,

      grandTotal:
        quote.grandTotal,

      notes:
        quote.notes,

      items:
        quote.items.map((item) => ({
          description:
            item.product?.name ??
            item.description ??
            "Product",

          quantity:
            Number(item.quantity),

          unit:
            item.unit,

          unitPrice:
            item.unitPrice,

          lineTotal:
            item.lineTotal,
        })),
    });

    return new NextResponse(pdf as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${quote.quoteNumber}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error(
      "GET /api/workspace/quotes/[id]/pdf",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to generate quotation PDF.",
      },
      { status: 500 },
    );
  }
}
