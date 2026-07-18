import { NextRequest, NextResponse } from "next/server";

import { authenticateAdmin } from "@/lib/auth";
import { QuoteStatus } from "@/lib/generated/prisma";
import {
  createQuote,
  listQuotes,
} from "@/lib/services/quote.service";
import { createQuoteSchema } from "@/lib/validation/quote";

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status") as QuoteStatus | null;

    const search = (
      searchParams.get("search") ?? ""
    )
      .trim()
      .toLowerCase();

    let quotes = await listQuotes();

    if (status) {
      quotes = quotes.filter(
        (quote) => quote.status === status
      );
    }

    if (search) {
      quotes = quotes.filter((quote) =>
        [
          quote.quoteNumber,
          quote.companyName,
          quote.contactPerson,
          quote.email,
          quote.country,
        ]
          .filter(Boolean)
          .some((value) =>
            value.toLowerCase().includes(search)
          )
      );
    }

    return NextResponse.json({
      success: true,
      quotes,
      pagination: {
        page: 1,
        totalPages: 1,
        totalRecords: quotes.length,
      },
    });
  } catch (error) {
    console.error(
      "GET /api/admin/quotes",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to fetch quotations.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();

    const parsed =
      createQuoteSchema.safeParse(body);

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

    const quote = await createQuote(
      parsed.data
    );

    return NextResponse.json(
      {
        success: true,
        message:
          "Quotation created successfully.",
        data: quote,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "POST /api/admin/quotes",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to create quotation.",
      },
      {
        status: 400,
      }
    );
  }
}