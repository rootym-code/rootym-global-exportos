import { NextRequest, NextResponse } from "next/server";

import { authenticateAdmin } from "@/lib/auth";

import followUpService from "@/lib/services/followup/followup.service";


export async function GET(
  request: NextRequest,
) {
  try {
    const auth =
      await authenticateAdmin(request);

    if (!auth.authenticated) {
      return NextResponse.json(
        {
          success: false,
          message: auth.error,
        },
        {
          status: auth.status,
        },
      );
    }

    const summary =
      await followUpService.getDashboardSummary();

    return NextResponse.json({
      success: true,
      summary,
    });

  } catch (error) {
    console.error(
      "GET /api/admin/followups/dashboard error:",
      error,
    );

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
      },
    );
  }
}