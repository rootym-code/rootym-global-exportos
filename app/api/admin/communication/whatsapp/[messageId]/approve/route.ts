import { NextRequest, NextResponse } from "next/server";

import { authenticateAdmin } from "@/lib/auth";

import whatsappService from "@/lib/services/communication/whatsapp.service";

interface RouteContext {
  params: Promise<{
    messageId: string;
  }>;
}

export async function POST(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const auth = await authenticateAdmin(request);

    if (!auth.authenticated || !auth.admin) {
      return NextResponse.json(
        {
          success: false,
          message: auth.error ?? "Unauthorized.",
        },
        {
          status: auth.status,
        }
      );
    }

    const { messageId } = await params;

    const draft = await whatsappService.approveDraft(
      messageId,
      auth.admin.email
    );

    return NextResponse.json({
      success: true,
      message: "WhatsApp draft approved successfully.",
      draft,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}