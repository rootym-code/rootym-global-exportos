import { NextRequest, NextResponse } from "next/server";

import { authenticateAdmin } from "@/lib/auth";
import {
  deleteQuote,
  getQuoteById,
  updateQuote,
} from "@/lib/services/quote.service";
import { updateQuoteSchema } from "@/lib/validation/quote";

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

    return NextResponse.json({
      success: true,
      data: quote,
    });
  } catch (error) {
    console.error(
      "GET /api/admin/quotes/[id]",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch quotation.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(
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

    const parsed =
      updateQuoteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed.",
          errors: parsed.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const quote = await updateQuote(
      id,
      parsed.data
    );

    return NextResponse.json({
      success: true,
      message:
        "Quotation updated successfully.",
      data: quote,
    });
  } catch (error) {
    console.error(
      "PUT /api/admin/quotes/[id]",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to update quotation.",
      },
      {
        status: 400,
      }
    );
  }
}

export async function DELETE(
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

    await deleteQuote(id);

    return NextResponse.json({
      success: true,
      message:
        "Quotation deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE /api/admin/quotes/[id]",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to delete quotation.",
      },
      {
        status: 400,
      }
    );
  }
}