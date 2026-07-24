import { NextRequest, NextResponse } from "next/server";

import followUpService from "@/lib/services/followup/followup.service";
import { assignFollowUpSchema } from "@/lib/validations/followup.validation";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const { id } = await params;

    const body = await request.json();

    const validated = assignFollowUpSchema.parse(body);

    const followUp = await followUpService.assign(id, validated);

    return NextResponse.json({
      success: true,
      data: followUp,
    });
  } catch (error: any) {
    console.error("Assign follow-up failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message ?? "Unable to assign follow-up.",
      },
      {
        status: 400,
      },
    );
  }
}