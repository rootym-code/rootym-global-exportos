/**
 * ============================================================
 * ROOTYM Team & Access Service
 * ============================================================
 * Author: Prem Singh
 * Purpose: Retrieves tenant-scoped workspace membership and
 *          user information for the Team & Access module.
 * ============================================================
 */

import prisma from "@/lib/prisma";

import {
  teamAccessResponseSchema,
  type TeamAccessResponse,
} from "@/lib/validations/team-access";

import { requireWorkspaceAccess } from "../require-workspace-access";

/**
 * Returns the Team & Access members belonging to the
 * currently authenticated customer workspace.
 *
 * Tenant identity is derived exclusively from the
 * authenticated workspace access context.
 */
export async function getTeamAccess(): Promise<TeamAccessResponse> {
  const { tenant } = await requireWorkspaceAccess();

  const memberships = await prisma.membership.findMany({
    where: {
      tenantId: tenant.id,
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
      userId: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
          isActive: true,
        },
      },
    },
  });

  const response: TeamAccessResponse = {
    members: memberships.map((membership) => ({
      membershipId: membership.id,
      userId: membership.user.id,
      name: membership.user.name,
      email: membership.user.email,
      avatarUrl: membership.user.avatarUrl,
      role: membership.role,
      isActive: membership.user.isActive,
      joinedAt: membership.createdAt,
      updatedAt: membership.updatedAt,
    })),
  };

  return teamAccessResponseSchema.parse(response);
}

export default getTeamAccess;