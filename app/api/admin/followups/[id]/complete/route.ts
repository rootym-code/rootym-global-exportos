import { NextRequest, NextResponse } from "next/server";

import followUpService from "@/lib/services/followup/followup.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const assignedToId = searchParams.get("assignedToId");

    if (!assignedToId) {
      return NextResponse.json(
        {
          success: false,
          message: "assignedToId is required.",
        },
        {
          status: 400,
        },
      );
    }

    const result = await followUpService.findMany({
      assignedToId,
      status: undefined,
      page: 1,
      limit: 100,
    });

    return NextResponse.json({
      success: true,
      data: result.items,
    });
  } catch (error: any) {
    console.error("My follow-ups failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message ?? "Unable to load assigned follow-ups.",
      },
      {
        status: 500,
      },
    );
  }
}