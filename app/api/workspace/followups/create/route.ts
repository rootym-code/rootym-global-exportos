/**
 * ============================================================
 * ROOTYM Global ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the Customer Workspace API for creating a
 *          FollowUp against a Website-owned Inquiry.
 *
 * Architecture:
 * - Workspace Website is resolved from authenticated context.
 * - Inquiry ownership is validated before creation.
 * - websiteId is never accepted from the browser.
 * - Existing shared FollowUp creation business logic is reused.
 *
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

import followUpService from "@/lib/services/followup/followup.service";

import type {
  CreateFollowUpInput,
} from "@/lib/services/followup/types";

import {
  requireWorkspaceFollowUpContext,
} from "@/app/lib/workspace/followups/followup-context.service";

export async function POST(
  request: NextRequest,
) {
  try {
    const context =
      await requireWorkspaceFollowUpContext();

    const body =
      (await request.json()) as CreateFollowUpInput;

    if (!body.inquiryId) {
      return NextResponse.json(
        {
          success: false,
          message: "inquiryId is required.",
        },
        {
          status: 400,
        },
      );
    }

    const inquiry =
      await prisma.inquiry.findFirst({
        where: {
          id: body.inquiryId,
          websiteId:
            context.website.id,
        },
        select: {
          id: true,
        },
      });

    if (!inquiry) {
      return NextResponse.json(
        {
          success: false,
          message: "Inquiry not found.",
        },
        {
          status: 404,
        },
      );
    }

    const followUp =
      await followUpService.create(
        body,
      );

    return NextResponse.json(
      {
        success: true,
        followUp,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "POST /api/workspace/followups/create error:",
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
