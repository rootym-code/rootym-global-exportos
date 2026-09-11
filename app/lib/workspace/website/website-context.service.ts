/**
 * ============================================================
 * Author: Prem Singh
 * Purpose: Resolves the Website belonging to the authenticated
 *          customer workspace and provides a reusable Website
 *          context for Website-scoped Workspace modules.
 * ============================================================
 */

import prisma from "@/lib/prisma";
import { requireWorkspaceAccess } from "../require-workspace-access";

export interface WorkspaceWebsiteContext {
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
 * Resolve the Website belonging to the currently authenticated
 * customer workspace.
 *
 * Security boundary:
 * - Tenant identity comes only from requireWorkspaceAccess().
 * - Website is resolved using tenantId.
 * - A caller cannot supply an arbitrary websiteId.
 * - The resolved Website must belong to the authenticated Tenant.
 * ============================================================
 */
export async function requireWorkspaceWebsite(): Promise<WorkspaceWebsiteContext> {
  const { user, tenant, membership } = await requireWorkspaceAccess();

  const website = await prisma.website.findUnique({
    where: {
      tenantId: tenant.id,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      isActive: true,
    },
  });

  if (!website) {
    throw new Error("Website is not connected to this workspace.");
  }

  return {
    website,
    tenant: {
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
    },
    membership: {
      id: membership.id,
      role: membership.role,
    },
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}

export default requireWorkspaceWebsite;