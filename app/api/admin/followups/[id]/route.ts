import { NextRequest, NextResponse } from "next/server";

import { authenticateAdmin } from "@/lib/auth";

import followUpService from "@/lib/services/followup/followup.service";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
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

    const followUp =
      await followUpService.getById(id);

    return NextResponse.json({
      success: true,
      followUp,
    });

  } catch (error) {
    console.error(
      "GET /api/admin/followups/[id] error:",
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
            "Follow-up not found."
            ? 404
            : 500,
      },
    );
  }
}