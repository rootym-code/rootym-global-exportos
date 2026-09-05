/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the authenticated customer workspace
 *          context required by the Website Pages & Content
 *          module using the tenant-owned Website binding.
 * ============================================================
 */

import prisma from "@/lib/prisma";

import { requireWorkspaceAccess } from "../require-workspace-access";

export type WebsitePagesStatus =
  | "PREPARING"
  | "READY"
  | "NOT_CONNECTED";

export interface WebsitePagesOverview {
  workspace: {
    id: string;
    name: string;
    slug: string;
  };

  owner: {
    id: string;
    name: string;
    email: string;
  };

  subscription: {
    id: string | null;
    status: string | null;
    planName: string | null;
    billingInterval: string | null;
  };

  pages: {
    status: WebsitePagesStatus;
    publishingStatus: WebsitePagesStatus;
    cmsStatus: WebsitePagesStatus;
  };
}

/**
 * ============================================================
 * Returns the Pages & Content context for the
 * currently authenticated customer workspace.
 *
 * Tenant identity is derived exclusively from the
 * authenticated customer session.
 *
 * Website connectivity is resolved through the
 * authenticated tenant's Website relationship.
 *
 * Existing CMS records are queried only when a valid,
 * active Website is established for the tenant.
 * ============================================================
 */
export async function getWebsitePagesOverview(): Promise<WebsitePagesOverview> {
  const { user, tenant } = await requireWorkspaceAccess();

  const currentSubscription = tenant.subscriptions[0] ?? null;

  const website = await prisma.website.findUnique({
    where: {
      tenantId: tenant.id,
    },
    select: {
      id: true,
      isActive: true,
    },
  });

  const websiteConnected = Boolean(website?.isActive);

  return {
    workspace: {
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
    },

    owner: {
      id: user.id,
      name: user.name,
      email: user.email,
    },

    subscription: {
      id: currentSubscription?.id ?? null,
      status: currentSubscription?.status ?? null,
      planName: currentSubscription?.plan?.name ?? null,
      billingInterval: currentSubscription?.billingInterval ?? null,
    },

    pages: {
      status: websiteConnected ? "READY" : "NOT_CONNECTED",
      publishingStatus: websiteConnected ? "READY" : "NOT_CONNECTED",
      cmsStatus: websiteConnected ? "READY" : "NOT_CONNECTED",
    },
  };
}

export default getWebsitePagesOverview;