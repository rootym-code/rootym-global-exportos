/**
 * ============================================================
 * ROOTYM Global ExportOS
 * ============================================================
 * Module  : R-CAPTAIN Intelligence
 * Component: Context Service
 *
 * Author: Prem Singh
 *
 * Purpose:
 * Provides the central execution context for R-CAPTAIN while
 * keeping Marketing, Buyer, and Workspace access boundaries
 * separate.
 *
 * Security:
 * • Marketing mode is anonymous.
 * • Buyer mode is Website-scoped.
 * • Workspace mode uses the existing authenticated
 *   Customer Workspace authorization boundary.
 * • This service does not expose unrestricted database access.
 * ============================================================
 */

import prisma from "@/lib/prisma";
import {
  requireWorkspaceAccess,
} from "@/app/lib/workspace/require-workspace-access";

export type RCaptainMode =
  | "MARKETING"
  | "BUYER"
  | "WORKSPACE";

export type RCaptainContext = {
  mode: RCaptainMode;

  website: {
    id: string;
    slug: string;
    name: string;
  } | null;

  tenant: {
    id: string;
    name: string;
  } | null;

  user: {
    id: string;
    name: string | null;
    email: string;
  } | null;

  permissions: {
    authenticated: boolean;
    canAccessWorkspace: boolean;
  };
};

export type ResolveRCaptainContextInput = {
  mode: RCaptainMode;
  websiteSlug?: string;
};

/**
 * Resolve R-CAPTAIN execution context.
 *
 * IMPORTANT:
 * The caller must explicitly declare the intended mode.
 * We do not infer Workspace authorization from a browser flag.
 */
export async function resolveRCaptainContext(
  input: ResolveRCaptainContextInput
): Promise<RCaptainContext> {

  if (input.mode === "MARKETING") {
    return {
      mode: "MARKETING",

      website: null,

      tenant: null,

      user: null,

      permissions: {
        authenticated: false,
        canAccessWorkspace: false,
      },
    };
  }

  if (input.mode === "BUYER") {
    if (!input.websiteSlug) {
      throw new Error(
        "Website slug is required for Buyer R-CAPTAIN context."
      );
    }

    const website =
      await prisma.website.findUnique({
        where: {
          slug: input.websiteSlug,
        },

        select: {
          id: true,
          slug: true,
          name: true,
          isActive: true,
        },
      });

    if (!website || !website.isActive) {
      throw new Error(
        "R-CAPTAIN Website context could not be resolved."
      );
    }

    return {
      mode: "BUYER",

      website: {
        id: website.id,
        slug: website.slug,
        name: website.name,
      },

      tenant: null,

      user: null,

      permissions: {
        authenticated: false,
        canAccessWorkspace: false,
      },
    };
  }

  /*
   * Workspace mode MUST use the established authentication
   * and authorization boundary. Do not duplicate JWT,
   * membership, tenant, or account validation here.
   */
  const workspace =
    await requireWorkspaceAccess();

  const website =
    await prisma.website.findUnique({
      where: {
        tenantId: workspace.tenant.id,
      },

      select: {
        id: true,
        slug: true,
        name: true,
        isActive: true,
      },
    });

  if (!website || !website.isActive) {
    throw new Error(
      "Authenticated customer Website could not be resolved."
    );
  }

  return {
    mode: "WORKSPACE",

    website: {
      id: website.id,
      slug: website.slug,
      name: website.name,
    },

    tenant: {
      id: workspace.tenant.id,
      name: workspace.tenant.name,
    },

    user: {
      id: workspace.user.id,
      name: workspace.user.name,
      email: workspace.user.email,
    },

    permissions: {
      authenticated: true,
      canAccessWorkspace: true,
    },
  };
}
