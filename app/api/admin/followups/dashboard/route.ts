import { NextResponse } from "next/server";

import followUpService from "@/lib/services/followup/followup.service";

export async function GET() {
  try {
    const summary = await followUpService.getDashboardSummary();

    return NextResponse.json({
      success: true,
      data: summary,
    });
  } catch (error: any) {
    console.error("Follow-up dashboard failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message ?? "Unable to load follow-up dashboard.",
      },
      {
        status: 500,
      },
    );
  }
}