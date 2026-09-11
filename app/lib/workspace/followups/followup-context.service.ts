/**
 * ============================================================
 * ROOTYM Global ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the Customer Workspace FollowUp context and
 *          exposes Website-scoped FollowUp read operations.
 *
 * Architecture:
 * - Customer authentication is resolved by requireWorkspaceWebsite().
 * - Website ownership is resolved from the authenticated Workspace.
 * - FollowUps remain in the shared FollowUp table.
 * - Workspace never accepts a websiteId from the browser.
 * - Admin FollowUp APIs and authorization remain unchanged.
 *
 * ============================================================
 */

import prisma from "@/lib/prisma";

import followUpService from "@/lib/services/followup/followup.service";

import type { FollowUpFilters } from "@/lib/services/followup/types";

import { requireWorkspaceWebsite } from "../website/website-context.service";

/**
 * ============================================================
 * Workspace FollowUp Context
 * ============================================================
 */
export interface WorkspaceFollowUpContext {
  website: {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
  };
  tenant: {
    id: string;
    name: string;
    slug: string;
  };
  membership: {
    id: string;
    role: string;
  };
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

/**
 * ============================================================
 * Resolve authenticated Workspace FollowUp context
 *
 * The Website is NEVER accepted from the browser.
 * ============================================================
 */
export async function requireWorkspaceFollowUpContext(): Promise<WorkspaceFollowUpContext> {
  return requireWorkspaceWebsite();
}

/**
 * ============================================================
 * Resolve FollowUp ownership
 *
 * A FollowUp belongs to the Workspace when its Inquiry belongs
 * to the authenticated Workspace Website.
 * ============================================================
 */
async function requireWorkspaceFollowUp(
  followUpId: string,
) {
  const context =
    await requireWorkspaceFollowUpContext();

  const followUp =
    await prisma.followUp.findFirst({
      where: {
        id: followUpId,
        inquiry: {
          websiteId: context.website.id,
        },
      },
      include: {
        inquiry: {
          select: {
            id: true,
            inquiryNumber: true,
            companyName: true,
            contactPerson: true,
            email: true,
            phone: true,
            country: true,
            product: true,
          },
        },
      },
    });

  if (!followUp) {
    throw new Error("Follow-up not found.");
  }

  return {
    context,
    followUp,
  };
}

/**
 * ============================================================
 * List Workspace FollowUps
 *
 * The existing shared FollowUp service does not currently accept
 * websiteId as a filter. Workspace therefore performs the
 * ownership-scoped query here rather than weakening the Admin
 * service or accepting websiteId from the browser.
 * ============================================================
 */
export async function listWorkspaceFollowUps(
  filters: FollowUpFilters = {},
) {
  const context =
    await requireWorkspaceFollowUpContext();

  const page = Math.max(
    1,
    filters.page ?? 1,
  );

  const limit = Math.min(
    100,
    Math.max(
      1,
      filters.limit ?? 10,
    ),
  );

  const where = {
    inquiry: {
      websiteId: context.website.id,
      ...(filters.inquiryId
        ? { id: filters.inquiryId }
        : {}),
    },
    ...(filters.assignedToId
      ? { assignedToId: filters.assignedToId }
      : {}),
    ...(filters.status
      ? { status: filters.status }
      : {}),
    ...(filters.priority
      ? { priority: filters.priority }
      : {}),
    ...(filters.category
      ? { category: filters.category }
      : {}),
    ...(filters.actionType
      ? { actionType: filters.actionType }
      : {}),
    ...(filters.fromDate || filters.toDate
      ? {
          scheduledAt: {
            ...(filters.fromDate
              ? { gte: filters.fromDate }
              : {}),
            ...(filters.toDate
              ? { lte: filters.toDate }
              : {}),
          },
        }
      : {}),
    ...(filters.search
      ? {
          OR: [
            {
              title: {
                contains: filters.search,
                mode: "insensitive" as const,
              },
            },
            {
              description: {
                contains: filters.search,
                mode: "insensitive" as const,
              },
            },
            {
              inquiry: {
                companyName: {
                  contains: filters.search,
                  mode: "insensitive" as const,
                },
              },
            },
          ],
        }
      : {}),
  };

  const [items, total] =
    await Promise.all([
      prisma.followUp.findMany({
        where,
        include: {
          inquiry: {
            select: {
              id: true,
              inquiryNumber: true,
              companyName: true,
              contactPerson: true,
              email: true,
              phone: true,
              country: true,
              product: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          completedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: [
          {
            scheduledAt: "asc",
          },
          {
            createdAt: "desc",
          },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.followUp.count({
        where,
      }),
    ]);

  return {
    items,
    page,
    limit,
    total,
    totalPages:
      Math.max(
        1,
        Math.ceil(total / limit),
      ),
  };
}

/**
 * ============================================================
 * Get one Workspace FollowUp
 *
 * Ownership is checked against Inquiry -> Website before the
 * shared service is called.
 * ============================================================
 */
export async function getWorkspaceFollowUpById(
  followUpId: string,
) {
  await requireWorkspaceFollowUp(
    followUpId,
  );

  return followUpService.getById(
    followUpId,
  );
}

/**
 * ============================================================
 * Export
 * ============================================================
 */
export default {
  requireWorkspaceFollowUpContext,
  listWorkspaceFollowUps,
  getWorkspaceFollowUpById,
};
