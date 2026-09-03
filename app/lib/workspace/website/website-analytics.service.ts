/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the authenticated customer workspace
 *          context required by the Website Analytics &
 *          Integrations module.
 * ============================================================
 */

import { requireWorkspaceAccess } from "../require-workspace-access";

export type WebsiteAnalyticsStatus =
  | "PREPARING"
  | "READY"
  | "NOT_CONNECTED";

export interface WebsiteAnalyticsOverview {
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

  analytics: {
    status: WebsiteAnalyticsStatus;
    analyticsStatus: WebsiteAnalyticsStatus;
    trackingStatus: WebsiteAnalyticsStatus;
    integrationsStatus: WebsiteAnalyticsStatus;
  };
}

/**
 * Returns the Website Analytics & Integrations context for the
 * currently authenticated customer workspace.
 *
 * Tenant identity is derived exclusively from the
 * authenticated customer session.
 *
 * Existing global analytics or integration configuration is
 * intentionally not queried because customer-specific
 * ownership has not yet been established.
 */
export async function getWebsiteAnalyticsOverview(): Promise<WebsiteAnalyticsOverview> {
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

    analytics: {
      status: "PREPARING",
      analyticsStatus: "NOT_CONNECTED",
      trackingStatus: "NOT_CONNECTED",
      integrationsStatus: "NOT_CONNECTED",
    },
  };
}

export default getWebsiteAnalyticsOverview;