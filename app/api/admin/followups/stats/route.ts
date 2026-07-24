import { NextResponse } from "next/server";

import followUpService from "@/lib/services/followup/followup.service";

export async function GET() {
  try {
    const [
      pending,
      today,
      upcoming,
      overdue,
      summary,
    ] = await Promise.all([
      followUpService.getPending(),
      followUpService.getToday(),
      followUpService.getUpcoming(),
      followUpService.getOverdue(),
      followUpService.getDashboardSummary(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        summary,
        pendingCount: pending.length,
        todayCount: today.length,
        upcomingCount: upcoming.length,
        overdueCount: overdue.length,
      },
    });
  } catch (error: any) {
    console.error("Follow-up stats failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message ?? "Unable to load follow-up statistics.",
      },
      {
        status: 500,
      },
    );
  }
}