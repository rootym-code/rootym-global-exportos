/**
 * ============================================================
 * ROOTYM Workspace Invitation Acceptance Service
 * ============================================================
 * Author: Prem Singh
 * Purpose: Validates workspace invitations and completes
 *          tenant membership creation through token- or
 *          invitation-ID-based acceptance flows.
 * ============================================================
 */

import { createHash } from "crypto";

import prisma from "@/lib/prisma";

import type { MembershipRole } from "@/lib/validations/team-access";

export type WorkspaceInvitationAcceptanceDetails = {
  invitationId: string;
  tenantId: string;
  tenantName: string;
  email: string;
  role: MembershipRole;
  expiresAt: Date;
};

export type AcceptWorkspaceInvitationResult = {
  invitationId: string;
  membershipId: string;
  tenantId: string;
  tenantName: string;
  userId: string;
  email: string;
  role: MembershipRole;
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function hashInvitationToken(token: string): string {
  return createHash("sha256")
    .update(token)
    .digest("hex");
}

function validateToken(token: string): string {
  const normalizedToken = token.trim();

  if (!normalizedToken) {
    throw new Error("Invitation token is required.");
  }

  return normalizedToken;
}

function validateUserId(userId: string): string {
  const normalizedUserId = userId.trim();

  if (!normalizedUserId) {
    throw new Error("Authenticated user is required.");
  }

  return normalizedUserId;
}

function validateInvitationId(
  invitationId: string,
): string {
  const normalizedInvitationId =
    invitationId.trim();

  if (!normalizedInvitationId) {
    throw new Error("Workspace invitation is required.");
  }

  return normalizedInvitationId;
}

async function acceptInvitationForUser(
  invitationId: string,
  userId: string,
): Promise<AcceptWorkspaceInvitationResult> {
  return prisma.$transaction(
    async (tx) => {
      const invitation =
        await tx.workspaceInvitation.findUnique({
          where: {
            id: invitationId,
          },
          select: {
            id: true,
            tenantId: true,
            email: true,
            role: true,
            expiresAt: true,
            acceptedAt: true,
            revokedAt: true,
            tenant: {
              select: {
                id: true,
                name: true,
                isActive: true,
              },
            },
          },
        });

      if (!invitation) {
        throw new Error(
          "This workspace invitation is invalid.",
        );
      }

      if (invitation.revokedAt) {
        throw new Error(
          "This workspace invitation has been revoked.",
        );
      }

      if (invitation.acceptedAt) {
        throw new Error(
          "This workspace invitation has already been accepted.",
        );
      }

      if (invitation.expiresAt <= new Date()) {
        throw new Error(
          "This workspace invitation has expired.",
        );
      }

      if (!invitation.tenant.isActive) {
        throw new Error(
          "This workspace is no longer active.",
        );
      }

      const user = await tx.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          email: true,
          isActive: true,
        },
      });

      if (!user) {
        throw new Error(
          "The authenticated ROOTYM user could not be found.",
        );
      }

      if (!user.isActive) {
        throw new Error(
          "The authenticated ROOTYM user account is inactive.",
        );
      }

      const invitationEmail = normalizeEmail(
        invitation.email,
      );

      const authenticatedUserEmail =
        normalizeEmail(user.email);

      if (
        authenticatedUserEmail !==
        invitationEmail
      ) {
        throw new Error(
          "The authenticated email address does not match the invitation.",
        );
      }

      const existingMembership =
        await tx.membership.findUnique({
          where: {
            userId_tenantId: {
              userId: user.id,
              tenantId: invitation.tenantId,
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

      const membership = await tx.membership.create({
        data: {
          userId: user.id,
          tenantId: invitation.tenantId,
          role: invitation.role,
        },
        select: {
          id: true,
          role: true,
        },
      });

      await tx.workspaceInvitation.update({
        where: {
          id: invitation.id,
        },
        data: {
          acceptedAt: new Date(),
        },
      });

      return {
        invitationId: invitation.id,
        membershipId: membership.id,
        tenantId: invitation.tenantId,
        tenantName: invitation.tenant.name,
        userId: user.id,
        email: user.email,
        role: membership.role,
      };
    },
    {
      isolationLevel: "Serializable",
    },
  );
}

/**
 * ============================================================
 * Token-based invitation lookup
 * ============================================================
 */
export async function getWorkspaceInvitationForAcceptance(
  token: string,
): Promise<WorkspaceInvitationAcceptanceDetails> {
  const normalizedToken = validateToken(token);
  const tokenHash = hashInvitationToken(normalizedToken);

  const invitation =
    await prisma.workspaceInvitation.findUnique({
      where: {
        tokenHash,
      },
      select: {
        id: true,
        email: true,
        role: true,
        expiresAt: true,
        acceptedAt: true,
        revokedAt: true,
        tenantId: true,
        tenant: {
          select: {
            id: true,
            name: true,
            isActive: true,
          },
        },
      },
    });

  if (!invitation) {
    throw new Error(
      "This workspace invitation is invalid.",
    );
  }

  if (invitation.revokedAt) {
    throw new Error(
      "This workspace invitation has been revoked.",
    );
  }

  if (invitation.acceptedAt) {
    throw new Error(
      "This workspace invitation has already been accepted.",
    );
  }

  if (invitation.expiresAt <= new Date()) {
    throw new Error(
      "This workspace invitation has expired.",
    );
  }

  if (!invitation.tenant.isActive) {
    throw new Error(
      "This workspace is no longer active.",
    );
  }

  return {
    invitationId: invitation.id,
    tenantId: invitation.tenantId,
    tenantName: invitation.tenant.name,
    email: invitation.email,
    role: invitation.role,
    expiresAt: invitation.expiresAt,
  };
}

/**
 * ============================================================
 * Invitation-ID validation for OAuth
 * ============================================================
 *
 * The OAuth flow deliberately carries only the invitation ID,
 * never the raw invitation bearer token.
 *
 * This performs the same invitation-state validation as the
 * token-based lookup before Google identity processing continues.
 * ============================================================
 */
export async function getWorkspaceInvitationById(
  invitationId: string,
): Promise<WorkspaceInvitationAcceptanceDetails> {
  const normalizedInvitationId =
    validateInvitationId(invitationId);

  const invitation =
    await prisma.workspaceInvitation.findUnique({
      where: {
        id: normalizedInvitationId,
      },
      select: {
        id: true,
        email: true,
        role: true,
        expiresAt: true,
        acceptedAt: true,
        revokedAt: true,
        tenantId: true,
        tenant: {
          select: {
            id: true,
            name: true,
            isActive: true,
          },
        },
      },
    });

  if (!invitation) {
    throw new Error(
      "This workspace invitation is invalid.",
    );
  }

  if (invitation.revokedAt) {
    throw new Error(
      "This workspace invitation has been revoked.",
    );
  }

  if (invitation.acceptedAt) {
    throw new Error(
      "This workspace invitation has already been accepted.",
    );
  }

  if (invitation.expiresAt <= new Date()) {
    throw new Error(
      "This workspace invitation has expired.",
    );
  }

  if (!invitation.tenant.isActive) {
    throw new Error(
      "This workspace is no longer active.",
    );
  }

  return {
    invitationId: invitation.id,
    tenantId: invitation.tenantId,
    tenantName: invitation.tenant.name,
    email: invitation.email,
    role: invitation.role,
    expiresAt: invitation.expiresAt,
  };
}

/**
 * ============================================================
 * Token-based invitation acceptance
 * ============================================================
 */
export async function acceptWorkspaceInvitation(
  token: string,
  userId: string,
): Promise<AcceptWorkspaceInvitationResult> {
  const normalizedToken = validateToken(token);
  const normalizedUserId = validateUserId(userId);

  const tokenHash =
    hashInvitationToken(normalizedToken);

  const invitation =
    await prisma.workspaceInvitation.findUnique({
      where: {
        tokenHash,
      },
      select: {
        id: true,
      },
    });

  if (!invitation) {
    throw new Error(
      "This workspace invitation is invalid.",
    );
  }

  return acceptInvitationForUser(
    invitation.id,
    normalizedUserId,
  );
}

/**
 * ============================================================
 * Invitation-ID-based acceptance
 * ============================================================
 */
export async function acceptWorkspaceInvitationById(
  invitationId: string,
  userId: string,
): Promise<AcceptWorkspaceInvitationResult> {
  const normalizedInvitationId =
    validateInvitationId(invitationId);

  const normalizedUserId =
    validateUserId(userId);

  return acceptInvitationForUser(
    normalizedInvitationId,
    normalizedUserId,
  );
}

export default acceptWorkspaceInvitation;