/**
 * ============================================================
 * ROOTYM Global ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the Customer Workspace API for completing
 *          a Website-scoped FollowUp.
 *
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

import {
  FollowUpResult,
} from "@/lib/generated/prisma";

import {
  completeWorkspaceFollowUp,
} from "@/app/lib/workspace/followups/followup-mutation-context.service";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

interface CompleteFollowUpBody {
  result: FollowUpResult;
  notes?: string;
  actualMinutes?: number;
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
      (await request.json()) as Partial<CompleteFollowUpBody>;

    if (
      !body.result ||
      !Object.values(FollowUpResult).includes(
        body.result,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "A valid follow-up result is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      body.actualMinutes !== undefined &&
      (
        !Number.isFinite(
          body.actualMinutes,
        ) ||
        body.actualMinutes < 0
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "actualMinutes must be a non-negative number.",
        },
        {
          status: 400,
        },
      );
    }

    const result =
      await completeWorkspaceFollowUp(
        id,
        {
          result:
            body.result,

          notes:
            body.notes,

          actualMinutes:
            body.actualMinutes,
        },
      );

    return NextResponse.json(
      {
        success: true,
        followUp:
          result.followUp,
        outcome:
          result.outcome,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "PATCH /api/workspace/followups/[id]/complete error:",
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
