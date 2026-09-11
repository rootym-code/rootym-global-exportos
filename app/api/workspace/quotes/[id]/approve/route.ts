/**
 * ============================================================
 * ROOTYM Global ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Customer Workspace quotation approval endpoint.
 *          Enforces Website ownership and updates the shared
 *          quotation record without using Admin authentication.
 * ============================================================
 */

import { NextResponse } from "next/server";

import { QuoteStatus } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";

import { requireWorkspaceWebsite } from "@/app/lib/workspace/website/website-context.service";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

/**
 * POST /api/workspace/quotes/[id]/approve
 *
 * Approves a quotation owned by the authenticated Workspace Website.
 *
 * The same Quote record is updated that is visible from the Admin
 * quotation workflow, so approval is bidirectional across portals.
 */
export async function POST(
  _request: Request,
  context: RouteContext,
) {
  try {
    const workspace = await requireWorkspaceWebsite();
    const { id } = await context.params;

    const quote = await prisma.quote.findFirst({
      where: {
        id,
        inquiry: {
          websiteId: workspace.website.id,
        },
      },
      select: {
        id: true,
        quoteNumber: true,
        status: true,
      },
    });

    if (!quote) {
      return NextResponse.json(
        {
          success: false,
          message: "Quote not found.",
        },
        { status: 404 },
      );
    }

    if (quote.status === QuoteStatus.APPROVED) {
      return NextResponse.json({
        success: true,
        message: "Quotation is already approved.",
        data: {
          id: quote.id,
          quoteNumber: quote.quoteNumber,
          status: quote.status,
        },
      });
    }

    const approvedQuote = await prisma.quote.update({
      where: {
        id: quote.id,
      },
      data: {
        status: QuoteStatus.APPROVED,
      },
      select: {
        id: true,
        quoteNumber: true,
        status: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Quotation approved successfully.",
      data: approvedQuote,
    });
  } catch (error) {
    console.error(
      "POST /api/workspace/quotes/[id]/approve",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unable to approve quotation.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 },
    );
  }
}
