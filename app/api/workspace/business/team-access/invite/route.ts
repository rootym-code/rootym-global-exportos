/**
 * ============================================================
 * ROOTYM Workspace Invitation API
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides a tenant-scoped endpoint for creating
 *          workspace memberships or email invitations.
 * ============================================================
 */

import { NextResponse } from "next/server";

import { createWorkspaceInvitation } from "@/app/lib/workspace/business/workspace-invitation.service";
import { requireWorkspaceAccess } from "@/app/lib/workspace/require-workspace-access";

import { membershipRoleSchema } from "@/lib/validations/team-access";

export async function POST(request: Request) {
  try {
    await requireWorkspaceAccess();

    const body = await request.json();

    const email =
      typeof body?.email === "string"
        ? body.email.trim()
        : "";

    const roleResult = membershipRoleSchema.safeParse(
      body?.role,
    );

    if (!email) {
      return NextResponse.json(
        {
          error: "Email address is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (!roleResult.success) {
      return NextResponse.json(
        {
          error: "A valid workspace role is required.",
        },
        {
          status: 400,
        },
      );
    }

    const result = await createWorkspaceInvitation({
      email,
      role: roleResult.data,
    });

    if (result.type === "membership") {
      return NextResponse.json(
        {
          type: "membership",
          message: "Workspace member added successfully.",
          membershipId: result.membershipId,
          userId: result.userId,
          email: result.email,
          role: result.role,
        },
        {
          status: 201,
        },
      );
    }

    return NextResponse.json(
      {
        type: "invitation",
        message: "Workspace invitation created successfully.",
        invitationId: result.invitationId,
        email: result.email,
        role: result.role,
        expiresAt: result.expiresAt,
        invitationToken: result.invitationToken,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to create workspace invitation.";

    if (
      message ===
        "You do not have permission to add workspace members." ||
      message ===
        "Only the workspace owner can assign the OWNER role."
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
      message ===
        "This user is already a member of the workspace." ||
      message ===
        "An active invitation already exists for this email address." ||
      message ===
        "This ROOTYM user account is inactive and cannot be added."
    ) {
      return NextResponse.json(
        {
          error: message,
        },
        {
          status: 409,
        },
      );
    }

    console.error(
      "POST /api/workspace/business/team-access/invite failed:",
      error,
    );

    return NextResponse.json(
      {
        error: "Unable to create workspace invitation.",
      },
      {
        status: 500,
      },
    );
  }
}