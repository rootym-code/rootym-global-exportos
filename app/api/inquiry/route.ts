import { NextRequest, NextResponse } from "next/server";
import { createInquiry } from "@/lib/services/inquiry.service";
import { inquirySchema } from "@/lib/validations/inquiry";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = inquirySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed.",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const inquiry = await createInquiry(validation.data, {
      ipAddress:
        request.headers.get("x-forwarded-for") ??
        request.headers.get("x-real-ip") ??
        undefined,

      userAgent: request.headers.get("user-agent") ?? undefined,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Inquiry submitted successfully.",
        inquiry,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Inquiry API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
      },
      { status: 500 }
    );
  }
}