import { NextRequest, NextResponse } from "next/server";

import { authenticateAdmin } from "@/lib/auth";
import { QuoteStatus } from "@/lib/generated/prisma";
import {
  getQuoteById,
  updateQuoteStatus,
} from "@/lib/services/quote.service";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

const ALLOWED_STATUSES: QuoteStatus[] = [
  "DRAFT",
  "SENT",
  "ACCEPTED",
  "REJECTED",
  "EXPIRED",
  "CANCELLED",
];

export async function PATCH(
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

    const body = await request.json();

    const status =
      body.status as QuoteStatus | undefined;

    if (!status) {
      return NextResponse.json(
        {
          success: false,
          message: "Quote status is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid quote status.",
        },
        {
          status: 400,
        }
      );
    }

    const quote = await getQuoteById(id);

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

    const updatedQuote =
      await updateQuoteStatus(id, status);

    return NextResponse.json({
      success: true,
      message: `Quotation status updated to ${status}.`,
      data: updatedQuote,
    });
  } catch (error) {
    console.error(
      "PATCH /api/admin/quotes/[id]/status",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to update quotation status.",
      },
      {
        status: 500,
      }
    );
  }
}