import { NextRequest, NextResponse } from "next/server";

import { authenticateAdmin } from "@/lib/auth";

import followUpService from "@/lib/services/followup/followup.service";

import type {
  SnoozeFollowUpInput,
} from "@/lib/services/followup/types";


interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}


export async function PATCH(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const auth =
      await authenticateAdmin(request);

    if (!auth.authenticated) {
      return NextResponse.json(
        {
          success: false,
          message: auth.error,
        },
        {
          status: auth.status,
        },
      );
    }

    const { id } =
      await context.params;

    const body =
      (await request.json()) as SnoozeFollowUpInput;

    const followUp =
      await followUpService.snooze(
        id,
        body,
      );

    return NextResponse.json({
      success: true,
      followUp,
    });

  } catch (error) {
    console.error(
      "PATCH /api/admin/followups/[id]/snooze error:",
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
        status: 500,
      },
    );
  }
}