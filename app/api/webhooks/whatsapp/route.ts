import { NextRequest, NextResponse } from "next/server";

import metaConfigService from "@/lib/services/meta/meta-config.service";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const mode = searchParams.get("hub.mode");
    const verifyToken = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    if (!mode || !verifyToken || !challenge) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing webhook verification parameters.",
        },
        { status: 400 }
      );
    }

    if (mode !== "subscribe") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid webhook mode.",
        },
        { status: 400 }
      );
    }

    const config =
      await metaConfigService.getConfiguration();

    if (verifyToken !== config.verifyToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid verify token.",
        },
        { status: 403 }
      );
    }

    console.log(
      "Meta WhatsApp webhook verified successfully."
    );

    return new NextResponse(challenge, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error) {
    console.error(
      "Webhook verification failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Webhook verification failed.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    console.log(
      "Received WhatsApp Webhook:",
      JSON.stringify(payload, null, 2)
    );

    /**
     * Next Sprint:
     * - Store incoming messages
     * - Update delivery status
     * - Update read receipts
     * - Trigger AI workflow
     */

    return NextResponse.json(
      {
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Webhook processing failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Invalid webhook payload.",
      },
      { status: 400 }
    );
  }
}