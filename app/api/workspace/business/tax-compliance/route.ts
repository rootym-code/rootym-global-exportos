/**
 * ============================================================
 * ROOTYM Business Tax & Compliance API
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides authenticated tenant-scoped read and write
 *          operations for Tax & Compliance configuration.
 * ============================================================
 */

import { NextResponse } from "next/server";

import { requireWorkspaceAccess } from "@/app/lib/workspace/require-workspace-access";
import { getBusinessTaxCompliance } from "@/app/lib/workspace/business/business-tax-compliance.service";
import { saveBusinessTaxCompliance } from "@/app/lib/workspace/business/business-tax-compliance-write.service";
import { businessTaxComplianceSchema } from "@/lib/validations/business-tax-compliance";

export async function GET() {
  try {
    await requireWorkspaceAccess();

    const data = await getBusinessTaxCompliance();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Failed to fetch business tax compliance:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch Tax & Compliance configuration.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    await requireWorkspaceAccess();

    const body = await request.json();

    const parsed = businessTaxComplianceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed.",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const data = await saveBusinessTaxCompliance(parsed.data);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Failed to save business tax compliance:", error);

    if (
      error instanceof Error &&
      error.message ===
        "You do not have permission to modify Tax & Compliance."
    ) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 403 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to save Tax & Compliance configuration.",
      },
      { status: 500 },
    );
  }
}