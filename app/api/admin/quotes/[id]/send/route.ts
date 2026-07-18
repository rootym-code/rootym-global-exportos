/**
 * ============================================================
 * ROOTYM Quote Email API
 * File: app/api/admin/quotes/[id]/send/route.ts
 * Sprint 8
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

import { authenticateAdmin } from "@/lib/auth";
import { quoteEmailService } from "@/lib/services/quote-email.service";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

interface RequestBody {
  to?: string;
  cc?: string | string[];
  bcc?: string | string[];
}

export async function POST(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    /**
     * --------------------------------------------------------
     * Authentication
     * --------------------------------------------------------
     */

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



    /**
     * --------------------------------------------------------
     * Parameters
     * --------------------------------------------------------
     */

    const { id } = await params;

    let body: RequestBody = {};

    try {
      body = await request.json();
    } catch {
      body = {};
    }

    /**
     * --------------------------------------------------------
     * Send Email
     * --------------------------------------------------------
     */

    const result = await quoteEmailService.send({
      quoteId: id,
      to: body.to,
      cc: body.cc,
      bcc: body.bcc,
    });

    return NextResponse.json({
      success: true,
      message: "Quotation emailed successfully.",
      data: {
        messageId: result.messageId,
        accepted: result.accepted,
        rejected: result.rejected,
        response: result.response,
      },
    });
  } catch (error) {
    console.error(
      "POST /api/admin/quotes/[id]/send",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to send quotation email.",
      },
      {
        status: 500,
      }
    );
  }
}