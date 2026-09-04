/**
 * ============================================================
 * ROOTYM Business Export Credentials API
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides authenticated GET and POST endpoints for
 *          tenant-scoped export credentials configuration.
 * ============================================================
 */

import { NextResponse } from "next/server";

import { getBusinessExportCredentials } from "@/app/lib/workspace/business/business-export-credentials.service";
import { saveBusinessExportCredentials } from "@/app/lib/workspace/business/business-export-credentials-write.service";
import { businessExportCredentialsSchema } from "@/lib/validations/business-export-credentials";

export async function GET() {
  try {
    const data = await getBusinessExportCredentials();

    return NextResponse.json({
      data,
    });
  } catch (error) {
    console.error(
      "Failed to retrieve business export credentials:",
      error,
    );

    return NextResponse.json(
      {
        error: "Failed to retrieve Export Credentials.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = businessExportCredentialsSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid Export Credentials data.",
          details: validation.error.flatten(),
        },
        {
          status: 400,
        },
      );
    }

    const data = await saveBusinessExportCredentials(validation.data);

    return NextResponse.json({
      data,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        "You do not have permission to modify Export Credentials."
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

    console.error(
      "Failed to save business export credentials:",
      error,
    );

    return NextResponse.json(
      {
        error: "Failed to save Export Credentials.",
      },
      {
        status: 500,
      },
    );
  }
}