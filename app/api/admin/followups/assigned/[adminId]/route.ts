import { NextRequest, NextResponse } from "next/server";

import followUpService from "@/lib/services/followup/followup.service";

type RouteContext = {
  params: Promise<{
    adminId: string;
  }>;
};

export async function GET(
  _request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const { adminId } = await params;

    const result = await followUpService.findMany({
      assignedToId: adminId,
      page: 1,
      limit: 100,
    });

    return NextResponse.json({
      success: true,
      data: result.items,
    });
  } catch (error: any) {
    console.error("Assigned follow-ups failed:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ??
          "Unable to load assigned follow-ups.",
      },
      {
        status: 500,
      },
    );
  }
}