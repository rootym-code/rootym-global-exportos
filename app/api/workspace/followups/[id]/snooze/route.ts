/**
 * ============================================================
 * ROOTYM Global ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the Customer Workspace API for snoozing
 *          a Website-scoped FollowUp.
 *
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

import {
  snoozeWorkspaceFollowUp,
} from "@/app/lib/workspace/followups/followup-mutation-context.service";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

interface SnoozeFollowUpBody {
  scheduledAt: string;
  reason?: string;
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const { id } =
      await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "FollowUp id is required.",
        },
        {
          status: 400,
        },
      );
    }

    const body =
      (await request.json()) as Partial<SnoozeFollowUpBody>;

    if (!body.scheduledAt) {
      return NextResponse.json(
        {
          success: false,
          message: "scheduledAt is required.",
        },
        {
          status: 400,
        },
      );
    }

    const scheduledAt =
      new Date(body.scheduledAt);

    if (
      Number.isNaN(
        scheduledAt.getTime(),
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid scheduledAt.",
        },
        {
          status: 400,
        },
      );
    }

    const followUp =
      await snoozeWorkspaceFollowUp(
        id,
        {
          scheduledAt,
          reason:
            body.reason,
        },
      );

    return NextResponse.json(
      {
        success: true,
        followUp,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "PATCH /api/workspace/followups/[id]/snooze error:",
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
          "Workspace access required."
            ? 401
            : message ===
                "Follow-up not found."
              ? 404
              : 500,
      },
    );
  }
}
