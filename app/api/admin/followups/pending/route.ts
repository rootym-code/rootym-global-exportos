import { NextResponse } from "next/server";

import followUpService from "@/lib/services/followup/followup.service";

export async function GET() {
  try {
    const followUps = await followUpService.getPending();

    return NextResponse.json({
      success: true,
      data: followUps,
    });
  } catch (error: any) {
    console.error("Pending follow-ups failed:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ??
          "Unable to load pending follow-ups.",
      },
      {
        status: 500,
      },
    );
  }
}