/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the authenticated customer workspace
 *          context required by the Website Pages & Content
 *          module without exposing globally scoped CMS data.
 * ============================================================
 */

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
 * Returns the Pages & Content context for the
 * currently authenticated customer workspace.
 *
 * Tenant identity is derived exclusively from the
 * authenticated customer session.
 *
 * Existing global CMS records are intentionally not
 * queried here because they are not tenant-scoped.
 */
export async function getWebsitePagesOverview(): Promise<WebsitePagesOverview> {
  const { user, tenant } = await requireWorkspaceAccess();

  const currentSubscription = tenant.subscriptions[0] ?? null;

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
      status: "PREPARING",
      publishingStatus: "PREPARING",
      cmsStatus: "NOT_CONNECTED",
    },
  };
}

export default getWebsitePagesOverview;