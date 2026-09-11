/**
 * ============================================================
 * ROOTYM Global ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the Customer Workspace API for retrieving
 *          one Website-scoped FollowUp.
 *
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

import {
  getWorkspaceFollowUpById,
} from "@/app/lib/workspace/followups/followup-context.service";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const { id } =
      await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Follow-up ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    const followUp =
      await getWorkspaceFollowUpById(
        id,
      );

    return NextResponse.json({
      success: true,
      followUp,
    });
  } catch (error) {
    console.error(
      "GET /api/workspace/followups/[id] error:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Internal Server Error";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      {
        status:
          message ===
          "Follow-up not found."
            ? 404
            : message ===
                "Workspace access required."
              ? 401
              : 500,
      },
    );
  }
}
