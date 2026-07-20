import { NextRequest, NextResponse } from "next/server";

import { generateRCaptainResponse } from "@/lib/r-captain/engine";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const message = body?.message;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        {
          error: "Message is required",
        },
        {
          status: 400,
        },
      );
    }

    const response = await generateRCaptainResponse(message);

    return NextResponse.json({
      response,
    });
  } catch (error) {
    console.error("R-CAPTAIN API Error:", error);

    return NextResponse.json(
      {
        error: "Unable to process R-CAPTAIN request",
      },
      {
        status: 500,
      },
    );
  }
}