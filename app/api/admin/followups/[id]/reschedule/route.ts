import { NextRequest, NextResponse } from "next/server";

import followUpService from "@/lib/services/followup/followup.service";
import { rescheduleFollowUpSchema } from "@/lib/validations/followup.validation";

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

    const validated = rescheduleFollowUpSchema.parse(body);

    const followUp = await followUpService.reschedule(
      id,
      validated,
    );

    return NextResponse.json({
      success: true,
      data: followUp,
    });
  } catch (error: any) {
    console.error("Reschedule follow-up failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message ?? "Unable to reschedule follow-up.",
      },
      {
        status: 400,
      },
    );
  }
}