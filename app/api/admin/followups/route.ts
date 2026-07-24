import { NextRequest, NextResponse } from "next/server";

import followUpService from "@/lib/services/followup/followup.service";
import { createFollowUpSchema } from "@/lib/validations/followup.validation";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get("page") ?? "1");
    const limit = Number(searchParams.get("limit") ?? "20");

    const result = await followUpService.findMany({
      inquiryId: searchParams.get("inquiryId") ?? undefined,
      assignedToId: searchParams.get("assignedToId") ?? undefined,
      status: searchParams.get("status") as any,
      priority: searchParams.get("priority") as any,
      category: searchParams.get("category") as any,
      actionType: searchParams.get("actionType") as any,
      search: searchParams.get("search") ?? undefined,
      fromDate: searchParams.get("fromDate")
        ? new Date(searchParams.get("fromDate")!)
        : undefined,
      toDate: searchParams.get("toDate")
        ? new Date(searchParams.get("toDate")!)
        : undefined,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Follow-up list failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load follow-ups.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validated = createFollowUpSchema.parse(body);

    const followUp = await followUpService.create(validated);

    return NextResponse.json(
      {
        success: true,
        data: followUp,
      },
      {
        status: 201,
      },
    );
  } catch (error: any) {
    console.error("Create follow-up failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message ?? "Unable to create follow-up.",
      },
      {
        status: 400,
      },
    );
  }
}