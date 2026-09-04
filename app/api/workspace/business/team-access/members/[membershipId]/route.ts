/**
 * ============================================================
 * ROOTYM Workspace Member Update API
 * ============================================================
 * Author: Prem Singh
 * Purpose: Updates a tenant-scoped workspace member role while
 *          enforcing server-side Team & Access authorization.
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

import {
  membershipRoleSchema,
} from "@/lib/validations/team-access";

import {
    removeWorkspaceMember,
    updateWorkspaceMember,
  } from "@/app/lib/workspace/business/team-membership.service";

type RouteContext = {
  params: Promise<{
    membershipId: string;
  }>;
};

/**
 * ============================================================
 * Update workspace member role.
 * ============================================================
 */
export async function PATCH(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const { membershipId } =
      await context.params;

    if (!membershipId?.trim()) {
      return NextResponse.json(
        {
          error:
            "Membership ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          error:
            "Invalid JSON request body.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      typeof body !== "object" ||
      body === null ||
      !("role" in body)
    ) {
      return NextResponse.json(
        {
          error:
            "Membership role is required.",
        },
        {
          status: 400,
        },
      );
    }

    const roleResult =
      membershipRoleSchema.safeParse(
        body.role,
      );

    if (!roleResult.success) {
      return NextResponse.json(
        {
          error:
            "Invalid membership role.",
        },
        {
          status: 400,
        },
      );
    }

    const result =
      await updateWorkspaceMember({
        membershipId,
        role:
          roleResult.data,
      });

    return NextResponse.json(
      {
        success: true,
        message:
          "Workspace member updated successfully.",
        membership: result,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to update workspace member.";

    if (
      message.includes(
        "do not have permission",
      )
    ) {
      return NextResponse.json(
        {
          error: message,
        },
        {
          status: 403,
        },
      );
    }

    if (
      message.includes(
        "cannot be modified",
      ) ||
      message.includes(
        "cannot update your own",
      ) ||
      message.includes(
        "Ownership transfer",
      ) ||
      message.includes(
        "Administrators can only",
      )
    ) {
      return NextResponse.json(
        {
          error: message,
        },
        {
          status: 403,
        },
      );
    }

    if (
      message.includes(
        "membership not found",
      )
    ) {
      return NextResponse.json(
        {
          error: message,
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      {
        error:
          "Unable to update workspace member.",
      },
      {
        status: 500,
      },
    );
  }
}

/**
 * ============================================================
 * Remove workspace member.
 * ============================================================
 */
export async function DELETE(
    request: NextRequest,
    context: RouteContext,
  ) {
    try {
      const { membershipId } =
        await context.params;
  
      if (!membershipId?.trim()) {
        return NextResponse.json(
          {
            error:
              "Membership ID is required.",
          },
          {
            status: 400,
          },
        );
      }
  
      const result =
        await removeWorkspaceMember(
          membershipId,
        );
  
      return NextResponse.json(
        {
          success: true,
          message:
            "Workspace member removed successfully.",
          membership: result,
        },
        {
          status: 200,
        },
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to remove workspace member.";
  
      if (
        message.includes(
          "do not have permission",
        ) ||
        message.includes(
          "cannot remove your own",
        ) ||
        message.includes(
          "cannot be removed",
        ) ||
        message.includes(
          "Administrators can only",
        )
      ) {
        return NextResponse.json(
          {
            error: message,
          },
          {
            status: 403,
          },
        );
      }
  
      if (
        message.includes(
          "membership not found",
        )
      ) {
        return NextResponse.json(
          {
            error: message,
          },
          {
            status: 404,
          },
        );
      }
  
      return NextResponse.json(
        {
          error:
            "Unable to remove workspace member.",
        },
        {
          status: 500,
        },
      );
    }
  }