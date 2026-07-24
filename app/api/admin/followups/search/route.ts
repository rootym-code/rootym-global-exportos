import { NextRequest, NextResponse } from "next/server";

import followUpService from "@/lib/services/followup/followup.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("q") ?? "";

    const page = Number(searchParams.get("page") ?? "1");

    const limit = Number(searchParams.get("limit") ?? "20");

    const result = await followUpService.findMany({
      search: query,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Search follow-ups failed:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ??
          "Unable to search follow-ups.",
      },
      {
        status: 500,
      },
    );
  }
}