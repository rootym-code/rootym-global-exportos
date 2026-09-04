/**
 * ============================================================
 * ROOTYM Team & Access API
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides a tenant-scoped GET endpoint for retrieving
 *          workspace membership and Team & Access information.
 * ============================================================
 */

import { NextResponse } from "next/server";

import { getTeamAccess } from "@/app/lib/workspace/business/team-access.service";
import { requireWorkspaceAccess } from "@/app/lib/workspace/require-workspace-access";

/**
 * GET /api/workspace/business/team-access
 *
 * Returns the Team & Access members for the currently
 * authenticated customer workspace.
 */
export async function GET() {
  try {
    await requireWorkspaceAccess();

    const data = await getTeamAccess();

    return NextResponse.json(data, {
      status: 200,
    });
  } catch (error) {
    console.error(
      "GET /api/workspace/business/team-access failed:",
      error,
    );

    return NextResponse.json(
      {
        error: "Unable to load Team & Access information.",
      },
      {
        status: 500,
      },
    );
  }
}