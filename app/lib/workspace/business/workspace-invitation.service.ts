/**
 * ============================================================
 * ROOTYM Workspace Invitation Service
 * ============================================================
 * Author: Prem Singh
 * Purpose: Creates tenant-scoped workspace invitations or
 *          memberships while enforcing Team & Access role rules.
 * ============================================================
 */

import { createHash, randomBytes } from "crypto";

import prisma from "@/lib/prisma";

import { requireWorkspaceAccess } from "../require-workspace-access";

import type { MembershipRole } from "@/lib/validations/team-access";

const INVITATION_EXPIRY_DAYS = 7;

export type CreateWorkspaceInvitationInput = {
  email: string;
  role: MembershipRole;
};

export type CreateWorkspaceInvitationResult =
  | {
      type: "membership";
      membershipId: string;
      userId: string;
      role: MembershipRole;
      email: string;
    }
  | {
      type: "invitation";
      invitationId: string;
      email: string;
      role: MembershipRole;
      expiresAt: Date;
      invitationToken: string;
    };

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function createInvitationToken(): {
  token: string;
  tokenHash: string;
} {
  const token = randomBytes(32).toString("hex");

  const tokenHash = createHash("sha256")
    .update(token)
    .digest("hex");

  return {
    token,
    tokenHash,
  };
}

/**
 * Creates a tenant-scoped membership for an existing ROOTYM user,
 * or creates an invitation for an email address that does not yet
 * have a ROOTYM user account.
 *
 * OWNER and ADMIN can invite members.
 * Only OWNER can assign the OWNER role.
 */
export async function createWorkspaceInvitation(
  input: CreateWorkspaceInvitationInput,
): Promise<CreateWorkspaceInvitationResult> {
  const { tenant, membership } = await requireWorkspaceAccess();

  const email = normalizeEmail(input.email);
  const role = input.role;

  if (!email) {
    throw new Error("Email address is required.");
  }

  if (membership.role !== "OWNER" && membership.role !== "ADMIN") {
    throw new Error(
      "You do not have permission to add workspace members.",
    );
  }

  if (role === "OWNER" && membership.role !== "OWNER") {
    throw new Error(
      "Only the workspace owner can assign the OWNER role.",
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
      isActive: true,
    },
  });

  if (existingUser) {
    const existingMembership =
      await prisma.membership.findUnique({
        where: {
          userId_tenantId: {
            userId: existingUser.id,
            tenantId: tenant.id,
          },
        },
        select: {
          id: true,
          role: true,
        },
      });

    if (existingMembership) {
      throw new Error(
        "This user is already a member of the workspace.",
      );
    }

    if (!existingUser.isActive) {
      throw new Error(
        "This ROOTYM user account is inactive and cannot be added.",
      );
    }

    const newMembership = await prisma.membership.create({
      data: {
        userId: existingUser.id,
        tenantId: tenant.id,
        role,
      },
      select: {
        id: true,
        userId: true,
        role: true,
      },
    });

    return {
      type: "membership",
      membershipId: newMembership.id,
      userId: newMembership.userId,
      role: newMembership.role,
      email: existingUser.email,
    };
  }

  const existingInvitation =
    await prisma.workspaceInvitation.findFirst({
      where: {
        tenantId: tenant.id,
        email,
        acceptedAt: null,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      select: {
        id: true,
      },
    });

  if (existingInvitation) {
    throw new Error(
      "An active invitation already exists for this email address.",
    );
  }

  const { token, tokenHash } = createInvitationToken();

  const expiresAt = new Date(
    Date.now() +
      INVITATION_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
  );

  const invitation = await prisma.workspaceInvitation.create({
    data: {
      tenantId: tenant.id,
      invitedById: membership.userId,
      email,
      role,
      tokenHash,
      expiresAt,
    },
    select: {
      id: true,
      email: true,
      role: true,
      expiresAt: true,
    },
  });

  return {
    type: "invitation",
    invitationId: invitation.id,
    email: invitation.email,
    role: invitation.role,
    expiresAt: invitation.expiresAt,
    invitationToken: token,
  };
}

export default createWorkspaceInvitation;