/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the authenticated customer workspace
 *          context required by the Website Media Library
 *          module without exposing globally scoped media data.
 * ============================================================
 */

import { requireWorkspaceAccess } from "../require-workspace-access";

export type WebsiteMediaStatus =
  | "PREPARING"
  | "READY"
  | "NOT_CONNECTED";

export interface WebsiteMediaOverview {
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

  media: {
    status: WebsiteMediaStatus;
    storageStatus: WebsiteMediaStatus;
    libraryStatus: WebsiteMediaStatus;
  };
}

/**
 * Returns the Media Library context for the
 * currently authenticated customer workspace.
 *
 * Tenant identity is derived exclusively from the
 * authenticated customer session.
 *
 * Existing global Media records are intentionally not
 * queried here because they are not tenant-scoped.
 */
export async function getWebsiteMediaOverview(): Promise<WebsiteMediaOverview> {
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

    media: {
      status: "PREPARING",
      storageStatus: "NOT_CONNECTED",
      libraryStatus: "NOT_CONNECTED",
    },
  };
}

export default getWebsiteMediaOverview;