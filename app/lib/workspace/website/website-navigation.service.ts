/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the authenticated customer workspace
 *          context required by the Website Navigation &
 *          Menus module without exposing globally scoped
 *          CMS navigation data.
 * ============================================================
 */

import { requireWorkspaceAccess } from "../require-workspace-access";

export type WebsiteNavigationStatus =
  | "PREPARING"
  | "READY"
  | "NOT_CONNECTED";

export interface WebsiteNavigationOverview {
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

  navigation: {
    status: WebsiteNavigationStatus;
    menuStatus: WebsiteNavigationStatus;
    websiteBindingStatus: WebsiteNavigationStatus;
  };
}

/**
 * Returns the Navigation & Menus context for the
 * currently authenticated customer workspace.
 *
 * Tenant identity is derived exclusively from the
 * authenticated customer session.
 *
 * Existing global Menu and MenuItem records are
 * intentionally not queried here because they are
 * not tenant-scoped.
 */
export async function getWebsiteNavigationOverview(): Promise<WebsiteNavigationOverview> {
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

    navigation: {
      status: "PREPARING",
      menuStatus: "NOT_CONNECTED",
      websiteBindingStatus: "NOT_CONNECTED",
    },
  };
}

export default getWebsiteNavigationOverview;