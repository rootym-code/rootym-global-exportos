/**
 * Author: Prem Singh
 * Purpose: Provides the authenticated customer workspace context
 *          required by the Website Overview module.
 */

import { requireWorkspaceAccess } from "../require-workspace-access";

export type WebsiteOverviewStatus =
  | "PREPARING"
  | "READY"
  | "NOT_CONNECTED";

export interface WebsiteOverview {
  workspace: {
    id: string;
    name: string;
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

  website: {
    status: WebsiteOverviewStatus;
    publishingStatus: WebsiteOverviewStatus;
    domainStatus: WebsiteOverviewStatus;
    cmsStatus: WebsiteOverviewStatus;
  };
}

/**
 * Returns the website overview context for the
 * currently authenticated customer workspace.
 *
 * Tenant identity is derived exclusively from the
 * authenticated customer session.
 */
export async function getWebsiteOverview(): Promise<WebsiteOverview> {
  const { user, tenant } = await requireWorkspaceAccess();

  const currentSubscription = tenant.subscriptions[0] ?? null;

  return {
    workspace: {
      id: tenant.id,
      name: tenant.name,
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

    website: {
      status: "PREPARING",
      publishingStatus: "PREPARING",
      domainStatus: "NOT_CONNECTED",
      cmsStatus: "NOT_CONNECTED",
    },
  };
}

export default getWebsiteOverview;