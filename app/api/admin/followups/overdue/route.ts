import { NextResponse } from "next/server";

import followUpService from "@/lib/services/followup/followup.service";

export async function GET() {
  try {
    const followUps = await followUpService.getOverdue();

    return NextResponse.json({
      success: true,
      data: followUps,
    });
  } catch (error: any) {
    console.error("Overdue follow-ups failed:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ??
          "Unable to load overdue follow-ups.",
      },
      {
        status: 500,
      },
    );
  }
}