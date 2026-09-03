/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the authenticated customer workspace
 *          context required by the Website Settings module
 *          without exposing globally scoped CMS settings.
 * ============================================================
 */

import { requireWorkspaceAccess } from "../require-workspace-access";

export type WebsiteSettingsStatus =
  | "PREPARING"
  | "READY"
  | "NOT_CONNECTED";

export interface WebsiteSettingsOverview {
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

  settings: {
    status: WebsiteSettingsStatus;
    brandingStatus: WebsiteSettingsStatus;
    contactStatus: WebsiteSettingsStatus;
    websiteBindingStatus: WebsiteSettingsStatus;
  };
}

/**
 * Returns the Website Settings context for the
 * currently authenticated customer workspace.
 *
 * Tenant identity is derived exclusively from the
 * authenticated customer session.
 *
 * Existing global SiteSetting records are intentionally
 * not queried because they are not tenant-scoped.
 */
export async function getWebsiteSettingsOverview(): Promise<WebsiteSettingsOverview> {
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

    settings: {
      status: "PREPARING",
      brandingStatus: "NOT_CONNECTED",
      contactStatus: "NOT_CONNECTED",
      websiteBindingStatus: "NOT_CONNECTED",
    },
  };
}

export default getWebsiteSettingsOverview;