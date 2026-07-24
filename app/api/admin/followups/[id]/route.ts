import { NextRequest, NextResponse } from "next/server";

import followUpService from "@/lib/services/followup/followup.service";
import { updateFollowUpSchema } from "@/lib/validations/followup.validation";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const { id } = await params;

    const followUp = await followUpService.getById(id);

    return NextResponse.json({
      success: true,
      data: followUp,
    });
  } catch (error: any) {
    console.error("Get follow-up failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message ?? "Follow-up not found.",
      },
      {
        status: 404,
      },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const { id } = await params;

    const body = await request.json();

    const validated = updateFollowUpSchema.parse(body);

    const followUp = await followUpService.update(id, validated);

    return NextResponse.json({
      success: true,
      data: followUp,
    });
  } catch (error: any) {
    console.error("Update follow-up failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message ?? "Unable to update follow-up.",
      },
      {
        status: 400,
      },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const { id } = await params;

    await followUpService.delete(id);

    return NextResponse.json({
      success: true,
      message: "Follow-up deleted successfully.",
    });
  } catch (error: any) {
    console.error("Delete follow-up failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message ?? "Unable to delete follow-up.",
      },
      {
        status: 400,
      },
    );
  }
}