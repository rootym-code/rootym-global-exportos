/**
 * ============================================================
 * ROOTYM
 * File: app/api/admin/quotes/[id]/send/route.ts
 * Sprint 8.1
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

import { verifyAdminToken } from "@/lib/jwt";
import { quoteManagementService } from "@/lib/services/quote-management.service";
import { sendQuoteSchema } from "@/lib/validators/quote";

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
 * POST /api/admin/quotes/:id/send
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

    const body = await request.json();

    const input =
      sendQuoteSchema.parse(body);

    const quote =
      await quoteManagementService.get(id);

    /**
     * ==========================================================
     * Future implementation
     * ==========================================================
     *
     * 1. Generate PDF
     *    const pdf = await pdfService.generateQuote(id);
     *
     * 2. Upload PDF (optional)
     *
     * 3. Send Email
     *    await mailService.send({
     *      to: input.to,
     *      cc: input.cc,
     *      subject: input.subject,
     *      html: input.message,
     *      attachments: [...]
     *    });
     *
     * 4. Update Quote Status
     *    if (quote.status === "DRAFT") {
     *      await quoteManagementService.changeStatus(
     *        id,
     *        "SENT"
     *      );
     *    }
     *
     * 5. Create Timeline Entry
     *
     * 6. Create Audit Log
     *
     * 7. Save Email History
     *
     * ==========================================================
     */

    return NextResponse.json({
      success: true,

      message:
        "Quote send request accepted.",

      data: {
        quoteId: quote.id,

        quoteNumber:
          quote.quoteNumber,

        to: input.to,

        cc: input.cc ?? null,

        subject: input.subject,

        queuedAt:
          new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to send quote.",
      },
      {
        status: 400,
      }
    );
  }
}