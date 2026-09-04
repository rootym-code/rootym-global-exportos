/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the authenticated API endpoint for creating
 *          or updating the tenant-scoped primary business address.
 * ============================================================
 */

import { NextResponse } from "next/server";

import { businessAddressSchema } from "@/lib/validations/business-address";

import saveBusinessAddress from "@/app/lib/workspace/business/business-address-write.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validationResult = businessAddressSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed.",
          details: validationResult.error.flatten(),
        },
        { status: 400 },
      );
    }

    const businessAddress = await saveBusinessAddress(
      validationResult.data,
    );

    return NextResponse.json({
      success: true,
      data: businessAddress,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        "You do not have permission to modify the Business Address."
    ) {
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 403 },
      );
    }

    console.error(
      "Business Address API error:",
      error,
    );

    return NextResponse.json(
      {
        error: "Unable to save the Business Address.",
      },
      { status: 500 },
    );
  }
}