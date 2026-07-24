import { NextRequest, NextResponse } from "next/server";

import followUpService from "@/lib/services/followup/followup.service";

type RouteContext = {
  params: Promise<{
    inquiryId: string;
  }>;
};

export async function GET(
  _request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const { inquiryId } = await params;

    const followUps = await followUpService.getByInquiry(
      inquiryId,
    );

    return NextResponse.json({
      success: true,
      data: followUps,
    });
  } catch (error: any) {
    console.error("Inquiry follow-ups failed:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ??
          "Unable to load inquiry follow-ups.",
      },
      {
        status: 500,
      },
    );
  }
}