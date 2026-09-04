/**
 * ============================================================
 * ROOTYM Workspace Invitation Acceptance API
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides tenant-independent invitation validation
 *          and acceptance endpoints for authenticated customers.
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

import {
  acceptWorkspaceInvitation,
  getWorkspaceInvitationForAcceptance,
} from "@/app/lib/workspace/business/workspace-invitation-acceptance.service";

import { getCustomerSession } from "@/lib/auth/customer";

/**
 * GET /api/workspace/business/team-access/invite/accept?token=...
 *
 * Validates an invitation token and returns only the information
 * required by the invitation acceptance page.
 *
 * No workspace membership is required for this operation because
 * the invited user does not belong to the workspace yet.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token")?.trim() ?? "";

    if (!token) {
      return NextResponse.json(
        {
          error: "Invitation token is required.",
        },
        {
          status: 400,
        },
      );
    }

    const invitation =
      await getWorkspaceInvitationForAcceptance(token);

    return NextResponse.json(
      {
        invitation: {
          invitationId: invitation.invitationId,
          tenantId: invitation.tenantId,
          tenantName: invitation.tenantName,
          email: invitation.email,
          role: invitation.role,
          expiresAt: invitation.expiresAt,
        },
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to validate workspace invitation.";

    if (message === "Invitation token is required.") {
      return NextResponse.json(
        {
          error: message,
        },
        {
          status: 400,
        },
      );
    }

    if (
      message === "This workspace invitation is invalid." ||
      message ===
        "This workspace invitation has been revoked." ||
      message ===
        "This workspace invitation has already been accepted." ||
      message === "This workspace invitation has expired." ||
      message === "This workspace is no longer active."
    ) {
      return NextResponse.json(
        {
          error: message,
        },
        {
          status: 410,
        },
      );
    }

    console.error(
      "GET /api/workspace/business/team-access/invite/accept failed:",
      error,
    );

    return NextResponse.json(
      {
        error: "Unable to validate workspace invitation.",
      },
      {
        status: 500,
      },
    );
  }
}

/**
 * POST /api/workspace/business/team-access/invite/accept
 *
 * Accepts an invitation for the currently authenticated
 * ROOTYM customer user.
 *
 * The authenticated user's email is verified by the acceptance
 * service against the invitation email before Membership creation.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getCustomerSession(request);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error:
            "You must be signed in to accept this workspace invitation.",
        },
        {
          status: 401,
        },
      );
    }

    const body = await request.json();

    const token =
      typeof body?.token === "string"
        ? body.token.trim()
        : "";

    if (!token) {
      return NextResponse.json(
        {
          error: "Invitation token is required.",
        },
        {
          status: 400,
        },
      );
    }

    const result = await acceptWorkspaceInvitation(
      token,
      session.user.id,
    );

    return NextResponse.json(
      {
        type: "membership",
        message:
          "Workspace invitation accepted successfully.",
        membershipId: result.membershipId,
        tenantId: result.tenantId,
        tenantName: result.tenantName,
        userId: result.userId,
        email: result.email,
        role: result.role,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to accept workspace invitation.";

    if (
      message ===
        "You must be signed in to accept this workspace invitation."
    ) {
      return NextResponse.json(
        {
          error: message,
        },
        {
          status: 401,
        },
      );
    }

    if (
      message === "Invitation token is required." ||
      message === "Authenticated user is required."
    ) {
      return NextResponse.json(
        {
          error: message,
        },
        {
          status: 400,
        },
      );
    }

    if (
      message === "This workspace invitation is invalid." ||
      message ===
        "This workspace invitation has been revoked." ||
      message ===
        "This workspace invitation has already been accepted." ||
      message === "This workspace invitation has expired." ||
      message === "This workspace is no longer active."
    ) {
      return NextResponse.json(
        {
          error: message,
        },
        {
          status: 410,
        },
      );
    }

    if (
      message ===
        "The authenticated ROOTYM user could not be found." ||
      message ===
        "The authenticated ROOTYM user account is inactive."
    ) {
      return NextResponse.json(
        {
          error: message,
        },
        {
          status: 401,
        },
      );
    }

    if (
      message ===
        "The authenticated email address does not match the invitation."
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
        "This user is already a member of the workspace."
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
      "POST /api/workspace/business/team-access/invite/accept failed:",
      error,
    );

    return NextResponse.json(
      {
        error: "Unable to accept workspace invitation.",
      },
      {
        status: 500,
      },
    );
  }
}