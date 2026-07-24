import { NextResponse } from "next/server";

import followUpService from "@/lib/services/followup/followup.service";

export async function GET() {
  try {
    const followUps = await followUpService.getUpcoming();

    return NextResponse.json({
      success: true,
      data: followUps,
    });
  } catch (error: any) {
    console.error("Upcoming follow-ups failed:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ??
          "Unable to load upcoming follow-ups.",
      },
      {
        status: 500,
      },
    );
  }
}