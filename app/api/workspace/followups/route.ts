/**
 * ============================================================
 * ROOTYM Global ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the Customer Workspace API for listing
 *          Website-scoped FollowUps.
 *
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

import {
  FollowUpActionType,
  FollowUpCategory,
  FollowUpPriority,
  FollowUpStatus,
} from "@/lib/generated/prisma";

import {
  listWorkspaceFollowUps,
} from "@/app/lib/workspace/followups/followup-context.service";

function enumValue<T extends string>(
  value: string | null,
  values: readonly T[],
) {
  return value && values.includes(value as T)
    ? (value as T)
    : undefined;
}

export async function GET(
  request: NextRequest,
) {
  try {
    const { searchParams } =
      new URL(request.url);

    const pageValue = Number(
      searchParams.get("page") ?? "1",
    );

    const limitValue = Number(
      searchParams.get("limit") ?? "10",
    );

    const fromDateValue =
      searchParams.get("fromDate");

    const toDateValue =
      searchParams.get("toDate");

    const filters = {
      page:
        Number.isFinite(pageValue) &&
        pageValue > 0
          ? pageValue
          : 1,

      limit:
        Number.isFinite(limitValue) &&
        limitValue > 0
          ? limitValue
          : 10,

      inquiryId:
        searchParams.get("inquiryId") ??
        undefined,

      assignedToId:
        searchParams.get("assignedToId") ??
        undefined,

      search:
        searchParams.get("search") ??
        undefined,

      status: enumValue(
        searchParams.get("status"),
        Object.values(FollowUpStatus),
      ),

      priority: enumValue(
        searchParams.get("priority"),
        Object.values(FollowUpPriority),
      ),

      category: enumValue(
        searchParams.get("category"),
        Object.values(FollowUpCategory),
      ),

      actionType: enumValue(
        searchParams.get("actionType"),
        Object.values(FollowUpActionType),
      ),

      fromDate: fromDateValue
        ? new Date(fromDateValue)
        : undefined,

      toDate: toDateValue
        ? new Date(toDateValue)
        : undefined,
    };

    if (
      filters.fromDate &&
      Number.isNaN(filters.fromDate.getTime())
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid fromDate.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      filters.toDate &&
      Number.isNaN(filters.toDate.getTime())
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid toDate.",
        },
        {
          status: 400,
        },
      );
    }

    const result =
      await listWorkspaceFollowUps(
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
      "GET /api/workspace/followups error:",
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
