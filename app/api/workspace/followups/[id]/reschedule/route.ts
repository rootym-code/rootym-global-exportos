/**
 * ============================================================
 * ROOTYM Global ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the Customer Workspace API for
 *          rescheduling a Website-scoped FollowUp.
 *
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

import {
  rescheduleWorkspaceFollowUp,
} from "@/app/lib/workspace/followups/followup-mutation-context.service";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

interface RescheduleFollowUpBody {
  scheduledAt: string;
  dueAt?: string;
  notes?: string;
}

export async function POST(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;

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
      (await request.json()) as Partial<RescheduleFollowUpBody>;

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

    const scheduledAt = new Date(body.scheduledAt);

    if (Number.isNaN(scheduledAt.getTime())) {
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

    let dueAt: Date | undefined;

    if (body.dueAt) {
      dueAt = new Date(body.dueAt);

      if (Number.isNaN(dueAt.getTime())) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid dueAt.",
          },
          {
            status: 400,
          },
        );
      }
    }

    const followUp =
      await rescheduleWorkspaceFollowUp(
        id,
        {
          scheduledAt,
          dueAt,
          notes: body.notes,
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
      "POST /api/workspace/followups/[id]/reschedule error:",
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
          message === "Workspace access required."
            ? 401
            : message === "Follow-up not found."
              ? 404
              : 500,
      },
    );
  }
}
