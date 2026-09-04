/**
 * ============================================================
 * ROOTYM Business Operating Preferences API
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides authenticated tenant-scoped GET and POST
 *          endpoints for Business Operating Preferences.
 * ============================================================
 */

import { NextResponse } from "next/server";

import { requireWorkspaceAccess } from "@/app/lib/workspace/require-workspace-access";
import { getBusinessOperatingPreferences } from "@/app/lib/workspace/business/business-operating-preferences.service";
import { saveBusinessOperatingPreferences } from "@/app/lib/workspace/business/business-operating-preferences-write.service";
import { businessOperatingPreferencesSchema } from "@/lib/validations/business-operating-preferences";

export async function GET() {
  try {
    await requireWorkspaceAccess();

    const preferences = await getBusinessOperatingPreferences();

    return NextResponse.json(preferences);
  } catch (error) {
    console.error(
      "Failed to load Business Operating Preferences:",
      error,
    );

    return NextResponse.json(
      {
        error: "Failed to load Operating Preferences.",
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

    const parsed = businessOperatingPreferencesSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid Operating Preferences data.",
          details: parsed.error.flatten(),
        },
        {
          status: 400,
        },
      );
    }

    try {
      const preferences =
        await saveBusinessOperatingPreferences(parsed.data);

      return NextResponse.json(preferences);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message ===
          "You do not have permission to modify Operating Preferences."
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
      "Failed to save Business Operating Preferences:",
      error,
    );

    return NextResponse.json(
      {
        error: "Failed to save Operating Preferences.",
      },
      {
        status: 500,
      },
    );
  }
}