import { NextRequest, NextResponse } from "next/server";

import { authenticateAdmin } from "@/lib/auth";
import { getDashboardData } from "@/lib/services/dashboard/dashboard.service";

export async function GET(request: NextRequest) {
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

  try {
    const dashboardData = await getDashboardData();

    return NextResponse.json({
      success: true,
      admin: auth.admin,
      ...dashboardData,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load dashboard.",
      },
      {
        status: 500,
      }
    );
  }
}