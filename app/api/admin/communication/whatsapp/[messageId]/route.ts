import { NextRequest, NextResponse } from "next/server";

import { authenticateAdmin } from "@/lib/auth";

import whatsappService from "@/lib/services/communication/whatsapp.service";

interface RouteContext {
  params: Promise<{
    messageId: string;
  }>;
}

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
          status: auth.status,
        }
      );
    }

    const { messageId } = await params;

    const body = await request.json();

    const message = body.message?.trim();

    if (!message) {
      return NextResponse.json(
        {
          success: false,
          message: "Message content is required.",
        },
        {
          status: 400,
        }
      );
    }

    const draft = await whatsappService.updateDraft(
      messageId,
      message
    );

    return NextResponse.json({
      success: true,
      message: "WhatsApp draft updated successfully.",
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
          status: auth.status,
        }
      );
    }

    const { messageId } = await params;

    await whatsappService.deleteDraft(messageId);

    return NextResponse.json({
      success: true,
      message: "WhatsApp draft deleted successfully.",
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

export async function POST(
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
          status: auth.status,
        }
      );
    }

    const { messageId } = await params;

    const sentMessage =
      await whatsappService.sendDraft(messageId);

    return NextResponse.json({
      success: true,
      message: "WhatsApp message sent successfully.",
      data: sentMessage,
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