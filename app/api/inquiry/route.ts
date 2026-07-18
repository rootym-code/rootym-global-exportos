/**
 * ============================================================
 * ROOTYM Global Export Platform
 * File: app/api/inquiry/route.ts
 *
 * Public Inquiry API
 * Uses ROOTYM Brain
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

import Brain from "@/lib/brain/engine";
import { createBrainContext } from "@/lib/brain/context";

import { inquirySchema } from "@/lib/validations/inquiry";

import type {
  CreateInquiryPayload,
  CreateInquiryResult,
} from "@/lib/brain/inquiry/CreateInquiryHandler";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const payload = inquirySchema.parse(
      body,
    ) as CreateInquiryPayload;

    const context = createBrainContext(request);

    const result =
      await Brain.execute<
        CreateInquiryPayload,
        CreateInquiryResult
      >(
        "CREATE_INQUIRY",
        payload,
        context,
      );

    return NextResponse.json(
      {
        success: true,
        message:
          "Inquiry submitted successfully.",
        data: result,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "Inquiry submission failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to submit inquiry.",
      },
      {
        status: 400,
      },
    );
  }
}