/**
 * ============================================================
 * ROOTYM Global ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the Customer Workspace API for a
 *          Website-scoped FollowUp dashboard summary.
 *
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

import {
  FollowUpStatus,
} from "@/lib/generated/prisma";

import prisma from "@/lib/prisma";

import {
  requireWorkspaceFollowUpContext,
} from "@/app/lib/workspace/followups/followup-context.service";

export async function GET(
  _request: NextRequest,
) {
  try {
    const context =
      await requireWorkspaceFollowUpContext();

    const now = new Date();

    const startOfToday =
      new Date(now);

    startOfToday.setHours(
      0,
      0,
      0,
      0,
    );

    const endOfToday =
      new Date(startOfToday);

    endOfToday.setDate(
      endOfToday.getDate() + 1,
    );

    const [pending, overdue, today, upcoming, completed] =
      await Promise.all([
        prisma.followUp.count({
          where: {
            inquiry: {
              websiteId: context.website.id,
            },
            status: FollowUpStatus.PENDING,
          },
        }),

        prisma.followUp.count({
          where: {
            inquiry: {
              websiteId: context.website.id,
            },
            status: FollowUpStatus.PENDING,
            scheduledAt: {
              lt: now,
            },
          },
        }),

        prisma.followUp.count({
          where: {
            inquiry: {
              websiteId: context.website.id,
            },
            status: FollowUpStatus.PENDING,
            scheduledAt: {
              gte: startOfToday,
              lt: endOfToday,
            },
          },
        }),

        prisma.followUp.count({
          where: {
            inquiry: {
              websiteId: context.website.id,
            },
            status: FollowUpStatus.PENDING,
            scheduledAt: {
              gte: endOfToday,
            },
          },
        }),

        prisma.followUp.count({
          where: {
            inquiry: {
              websiteId: context.website.id,
            },
            status: FollowUpStatus.COMPLETED,
          },
        }),
      ]);

    return NextResponse.json({
      success: true,
      summary: {
        pending,
        overdue,
        today,
        upcoming,
        completed,
      },
    });
  } catch (error) {
    console.error(
      "GET /api/workspace/followups/dashboard error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Internal Server Error",
      },
      {
        status:
          error instanceof Error &&
          error.message ===
            "Workspace access required."
            ? 401
            : 500,
      },
    );
  }
}
