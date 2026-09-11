/**
 * ============================================================
 * ROOTYM Global ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the Customer Workspace API for reading and
 *          adding customer-authored activity updates to a
 *          Website-scoped FollowUp timeline.
 *
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

import {
  ActivityActorType,
  ActivityEntityType,
} from "@/lib/generated/prisma";
import activityService from "@/lib/services/activity/activity.service";
import {
  requireWorkspaceFollowUpContext,
} from "@/app/lib/workspace/followups/followup-context.service";
import prisma from "@/lib/prisma";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

interface CreateWorkspaceTimelineActivityBody {
  title: string;
  description: string;
}

function isWorkspaceAuthRedirect(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest?: unknown }).digest === "string" &&
    (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

async function getOwnedFollowUp(
  id: string,
  websiteId: string,
) {
  return await prisma.followUp.findFirst({
    where: {
      id,
      inquiry: {
        websiteId,
      },
    },
    select: {
      id: true,
      inquiryId: true,
    },
  });
}

export async function GET(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const workspaceContext =
      await requireWorkspaceFollowUpContext();

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

    const followUp = await getOwnedFollowUp(
      id,
      workspaceContext.website.id,
    );

    if (!followUp) {
      return NextResponse.json(
        {
          success: false,
          message: "FollowUp not found.",
        },
        {
          status: 404,
        },
      );
    }

    const activities =
      await activityService.getTimeline(
        ActivityEntityType.FOLLOWUP,
        followUp.id,
      );

    return NextResponse.json({
      success: true,
      activities,
    });
  } catch (error) {
    if (isWorkspaceAuthRedirect(error)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Customer Workspace authentication required.",
          code: "AUTHENTICATION_REQUIRED",
        },
        {
          status: 401,
        },
      );
    }

    console.error(
      "GET /api/workspace/followups/[id]/timeline error:",
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
            : 500,
      },
    );
  }
}

export async function POST(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const workspaceContext =
      await requireWorkspaceFollowUpContext();

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

    const followUp = await getOwnedFollowUp(
      id,
      workspaceContext.website.id,
    );

    if (!followUp) {
      return NextResponse.json(
        {
          success: false,
          message: "FollowUp not found.",
        },
        {
          status: 404,
        },
      );
    }

    const body =
      (await request.json()) as Partial<CreateWorkspaceTimelineActivityBody>;

    const title = body.title?.trim() ?? "";
    const description = body.description?.trim() ?? "";

    if (!title) {
      return NextResponse.json(
        {
          success: false,
          message: "Activity title is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (!description) {
      return NextResponse.json(
        {
          success: false,
          message: "Activity description is required.",
        },
        {
          status: 400,
        },
      );
    }

    const activity =
      await activityService.create({
        entityType:
          ActivityEntityType.FOLLOWUP,
        entityId: followUp.id,
        action: "MANUAL_UPDATE",
        title,
        description,
        metadata: {
          followUpId: followUp.id,
          inquiryId: followUp.inquiryId,
          workspaceUserId:
            workspaceContext.user.id,
        },
        actorType:
          ActivityActorType.CUSTOMER,
      });

    return NextResponse.json(
      {
        success: true,
        activity,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    if (isWorkspaceAuthRedirect(error)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Customer Workspace authentication required.",
          code: "AUTHENTICATION_REQUIRED",
        },
        {
          status: 401,
        },
      );
    }

    console.error(
      "POST /api/workspace/followups/[id]/timeline error:",
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
            : 500,
      },
    );
  }
}
