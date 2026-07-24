import { NextResponse } from "next/server";

import followUpService from "@/lib/services/followup/followup.service";

export async function GET() {
  try {
    const followUps = await followUpService.getToday();

    return NextResponse.json({
      success: true,
      data: followUps,
    });
  } catch (error: any) {
    console.error("Today's follow-ups failed:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ??
          "Unable to load today's follow-ups.",
      },
      {
        status: 500,
      },
    );
  }
}