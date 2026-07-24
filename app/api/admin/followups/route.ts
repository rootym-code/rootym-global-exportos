import { NextRequest, NextResponse } from "next/server";

import { authenticateAdmin } from "@/lib/auth";

import {
  FollowUpStatus,
  FollowUpPriority,
  FollowUpCategory,
  FollowUpActionType,
} from "@/lib/generated/prisma";

import followUpService from "@/lib/services/followup/followup.service";

import type {
  FollowUpFilters,
  CreateFollowUpInput,
} from "@/lib/services/followup/types";


export async function GET(
  request: NextRequest,
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

    const { searchParams } =
      new URL(request.url);

    const filters: FollowUpFilters = {
      page: Number(
        searchParams.get("page") ?? "1",
      ),

      limit: Number(
        searchParams.get("limit") ?? "10",
      ),

      search:
        searchParams.get("search") ??
        undefined,

      status:
        Object.values(FollowUpStatus).includes(
          searchParams.get("status") as FollowUpStatus,
        )
          ? (searchParams.get("status") as FollowUpStatus)
          : undefined,

      priority:
        Object.values(FollowUpPriority).includes(
          searchParams.get("priority") as FollowUpPriority,
        )
          ? (searchParams.get("priority") as FollowUpPriority)
          : undefined,

      category:
        Object.values(FollowUpCategory).includes(
          searchParams.get("category") as FollowUpCategory,
        )
          ? (searchParams.get("category") as FollowUpCategory)
          : undefined,

          actionType:
          Object.values(FollowUpActionType).includes(
            searchParams.get("actionType") as FollowUpActionType,
          )
            ? (searchParams.get("actionType") as FollowUpActionType)
            : undefined,

      assignedToId:
        searchParams.get("assignedToId") ??
        undefined,
    };

    const result =
      await followUpService.findMany(
        filters,
      );

    return NextResponse.json({
      success: true,
      followUps: result.items,
      pagination: {
        page: result.page,
        limit: result.limit,
        totalRecords: result.total,
        totalPages: result.totalPages,
      },
    });

  } catch (error) {
    console.error(
      "GET /api/admin/followups error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(
  request: NextRequest,
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

    const body =
      (await request.json()) as CreateFollowUpInput;

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
      "POST /api/admin/followups error:",
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