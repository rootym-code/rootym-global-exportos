/**
 * ============================================================
 * ROOTYM Team Membership Service
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides tenant-scoped Team & Access membership
 *          update and removal operations with server-side
 *          role authorization and ownership protection.
 * ============================================================
 */

import prisma from "@/lib/prisma";

import {
  membershipRoleSchema,
  type MembershipRole,
} from "@/lib/validations/team-access";

import { requireWorkspaceAccess } from "../require-workspace-access";

export type UpdateWorkspaceMemberInput = {
  membershipId: string;
  role: MembershipRole;
};

export type UpdateWorkspaceMemberResult = {
  membershipId: string;
  userId: string;
  role: MembershipRole;
  email: string;
};

export type RemoveWorkspaceMemberResult = {
  membershipId: string;
  userId: string;
  email: string;
};

/**
 * ============================================================
 * Update workspace member role.
 * ============================================================
 *
 * Authorization:
 *
 * OWNER:
 *   - Can change ADMIN ↔ MEMBER.
 *   - Cannot transfer ownership through this operation.
 *
 * ADMIN:
 *   - Can change MEMBER → ADMIN.
 *   - Cannot modify OWNER or ADMIN.
 *
 * MEMBER:
 *   - Cannot modify workspace members.
 *
 * Tenant identity is derived exclusively from the
 * authenticated workspace access context.
 * ============================================================
 */
export async function updateWorkspaceMember(
  input: UpdateWorkspaceMemberInput,
): Promise<UpdateWorkspaceMemberResult> {
  const { tenant, membership } =
    await requireWorkspaceAccess();

  const membershipId =
    input.membershipId.trim();

  if (!membershipId) {
    throw new Error(
      "Membership ID is required.",
    );
  }

  const role =
    membershipRoleSchema.parse(
      input.role,
    );

  if (
    membership.role !== "OWNER" &&
    membership.role !== "ADMIN"
  ) {
    throw new Error(
      "You do not have permission to update workspace members.",
    );
  }

  const targetMembership =
    await prisma.membership.findFirst({
      where: {
        id: membershipId,
        tenantId: tenant.id,
      },
      select: {
        id: true,
        userId: true,
        role: true,
        user: {
          select: {
            email: true,
          },
        },
      },
    });

  if (!targetMembership) {
    throw new Error(
      "Workspace membership not found.",
    );
  }

  if (
    targetMembership.userId ===
    membership.userId
  ) {
    throw new Error(
      "You cannot update your own workspace membership.",
    );
  }

  if (
    targetMembership.role === "OWNER"
  ) {
    throw new Error(
      "The workspace owner cannot be modified.",
    );
  }

  if (
    role === "OWNER"
  ) {
    throw new Error(
      "Ownership transfer is not supported by this operation.",
    );
  }

  if (
    membership.role === "ADMIN" &&
    targetMembership.role !== "MEMBER"
  ) {
    throw new Error(
      "Administrators can only update workspace members.",
    );
  }

  const updatedMembership =
    await prisma.membership.update({
      where: {
        id: targetMembership.id,
      },
      data: {
        role,
      },
      select: {
        id: true,
        userId: true,
        role: true,
        user: {
          select: {
            email: true,
          },
        },
      },
    });

  return {
    membershipId:
      updatedMembership.id,
    userId:
      updatedMembership.userId,
    role:
      updatedMembership.role,
    email:
      updatedMembership.user.email,
  };
}

/**
 * ============================================================
 * Remove workspace member.
 * ============================================================
 *
 * Authorization:
 *
 * OWNER:
 *   - Can remove ADMIN and MEMBER.
 *
 * ADMIN:
 *   - Can remove MEMBER only.
 *
 * MEMBER:
 *   - Cannot remove workspace members.
 *
 * The User record is deliberately preserved.
 * Only the tenant-scoped Membership record is removed.
 * ============================================================
 */
export async function removeWorkspaceMember(
  membershipId: string,
): Promise<RemoveWorkspaceMemberResult> {
  const { tenant, membership } =
    await requireWorkspaceAccess();

  const normalizedMembershipId =
    membershipId.trim();

  if (!normalizedMembershipId) {
    throw new Error(
      "Membership ID is required.",
    );
  }

  if (
    membership.role !== "OWNER" &&
    membership.role !== "ADMIN"
  ) {
    throw new Error(
      "You do not have permission to remove workspace members.",
    );
  }

  const targetMembership =
    await prisma.membership.findFirst({
      where: {
        id: normalizedMembershipId,
        tenantId: tenant.id,
      },
      select: {
        id: true,
        userId: true,
        role: true,
        user: {
          select: {
            email: true,
          },
        },
      },
    });

  if (!targetMembership) {
    throw new Error(
      "Workspace membership not found.",
    );
  }

  if (
    targetMembership.userId ===
    membership.userId
  ) {
    throw new Error(
      "You cannot remove your own workspace membership.",
    );
  }

  if (
    targetMembership.role === "OWNER"
  ) {
    throw new Error(
      "The workspace owner cannot be removed.",
    );
  }

  if (
    membership.role === "ADMIN" &&
    targetMembership.role !== "MEMBER"
  ) {
    throw new Error(
      "Administrators can only remove workspace members.",
    );
  }

  await prisma.membership.delete({
    where: {
      id: targetMembership.id,
    },
  });

  return {
    membershipId:
      targetMembership.id,
    userId:
      targetMembership.userId,
    email:
      targetMembership.user.email,
  };
}

export default updateWorkspaceMember;