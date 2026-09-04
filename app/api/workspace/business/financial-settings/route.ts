/**
 * ============================================================
 * ROOTYM Business Financial Settings API
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides authenticated tenant-scoped GET and POST
 *          endpoints for Business Financial Settings.
 * ============================================================
 */

import { NextResponse } from "next/server";

import { requireWorkspaceAccess } from "@/app/lib/workspace/require-workspace-access";
import { getBusinessFinancialSettings } from "@/app/lib/workspace/business/business-financial-settings.service";
import { saveBusinessFinancialSettings } from "@/app/lib/workspace/business/business-financial-settings-write.service";
import { businessFinancialSettingsSchema } from "@/lib/validations/business-financial-settings";

export async function GET() {
  try {
    await requireWorkspaceAccess();

    const settings = await getBusinessFinancialSettings();

    return NextResponse.json(settings);
  } catch (error) {
    console.error(
      "Failed to load Business Financial Settings:",
      error,
    );

    return NextResponse.json(
      {
        error: "Failed to load Financial Settings.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: Request) {
  try {
    await requireWorkspaceAccess();

    const body = await request.json();

    const parsed = businessFinancialSettingsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid Financial Settings data.",
          details: parsed.error.flatten(),
        },
        {
          status: 400,
        },
      );
    }

    try {
      const settings = await saveBusinessFinancialSettings(parsed.data);

      return NextResponse.json(settings);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message ===
          "You do not have permission to modify Financial Settings."
      ) {
        return NextResponse.json(
          {
            error: error.message,
          },
          {
            status: 403,
          },
        );
      }

      throw error;
    }
  } catch (error) {
    console.error(
      "Failed to save Business Financial Settings:",
      error,
    );

    return NextResponse.json(
      {
        error: "Failed to save Financial Settings.",
      },
      {
        status: 500,
      },
    );
  }
}