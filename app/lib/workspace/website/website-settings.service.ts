/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the authenticated customer workspace
 *          context and Website Settings configuration services.
 * ============================================================
 */

import prisma from "@/lib/prisma";

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
 * ============================================================
 * Website Configuration
 * ============================================================
 */

export interface WebsiteConfiguration {
  id: string | null;
  websiteId: string;
  websiteTitle: string | null;
  tagline: string | null;
  websiteDescription: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

/**
 * ============================================================
 * Returns the Website Settings context for the currently
 * authenticated customer workspace.
 *
 * Tenant identity is derived exclusively from the authenticated
 * customer session.
 *
 * Business Profile, Business Address and Contact Communication
 * are tenant-scoped and are used to determine configuration
 * readiness.
 *
 * WebsiteBranding is Website-scoped and is used to determine
 * branding readiness.
 *
 * WebsiteConfiguration is Website-scoped and is available
 * through the Website belonging to the authenticated tenant.
 *
 * Global SiteSetting records are intentionally not queried
 * because they are not tenant-scoped.
 * ============================================================
 */
export async function getWebsiteSettingsOverview(): Promise<WebsiteSettingsOverview> {
  const { user, tenant } = await requireWorkspaceAccess();

  const currentSubscription = tenant.subscriptions[0] ?? null;

  const website = await prisma.website.findUnique({
    where: {
      tenantId: tenant.id,
    },
    select: {
      id: true,
      isActive: true,

      branding: {
        select: {
          id: true,
        },
      },
    },
  });

  const [
    businessProfile,
    businessAddress,
    contactCommunication,
  ] = await Promise.all([
    prisma.businessProfile.findUnique({
      where: {
        tenantId: tenant.id,
      },
      select: {
        businessName: true,
        legalName: true,
        email: true,
        phone: true,
        description: true,
      },
    }),

    prisma.businessAddress.findUnique({
      where: {
        tenantId: tenant.id,
      },
      select: {
        addressLine1: true,
        city: true,
        state: true,
        postalCode: true,
        country: true,
      },
    }),

    prisma.businessContactCommunication.findUnique({
      where: {
        tenantId: tenant.id,
      },
      select: {
        primaryEmail: true,
        alternateEmail1: true,
        alternateEmail2: true,
        salesEmail: true,
        infoEmail: true,
        primaryPhone: true,
        alternatePhone: true,
        whatsapp: true,
      },
    }),
  ]);

  /**
   * Website binding is READY only when the authenticated
   * tenant has an active Website record.
   */
  const websiteBindingStatus: WebsiteSettingsStatus =
    website?.isActive ? "READY" : "NOT_CONNECTED";

  /**
   * Contact readiness is based on the tenant-scoped
   * business profile/contact records.
   *
   * We intentionally do not use global SiteSetting values here.
   */
  const hasBusinessContact = Boolean(
    businessProfile?.email?.trim() ||
      businessProfile?.phone?.trim() ||
      contactCommunication?.primaryEmail?.trim() ||
      contactCommunication?.salesEmail?.trim() ||
      contactCommunication?.infoEmail?.trim() ||
      contactCommunication?.primaryPhone?.trim() ||
      contactCommunication?.whatsapp?.trim(),
  );

  const hasBusinessAddress = Boolean(
    businessAddress?.addressLine1?.trim() ||
      businessAddress?.city?.trim() ||
      businessAddress?.state?.trim() ||
      businessAddress?.postalCode?.trim() ||
      businessAddress?.country?.trim(),
  );

  /**
   * Contact settings are considered connected when the tenant
   * has actual business/contact information.
   *
   * Address is also checked because it is part of the Website's
   * customer-facing contact identity.
   */
  const contactStatus: WebsiteSettingsStatus =
    hasBusinessContact || hasBusinessAddress
      ? "READY"
      : "NOT_CONNECTED";

  /**
   * Website-specific branding is now backed by the
   * WebsiteBranding model.
   *
   * A branding record means the Website has a persisted
   * branding configuration. The actual branding fields may
   * still be optional, so this status only indicates that the
   * Website Branding configuration exists.
   */
  const brandingStatus: WebsiteSettingsStatus =
    website?.branding ? "READY" : "NOT_CONNECTED";

  /**
   * The overall Website Settings module remains PREPARING until
   * the actual Website Settings configuration areas and their
   * save flows are implemented.
   */
  const status: WebsiteSettingsStatus = "PREPARING";

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
      billingInterval:
        currentSubscription?.billingInterval ?? null,
    },

    settings: {
      status,
      brandingStatus,
      contactStatus,
      websiteBindingStatus,
    },
  };
}

/**
 * ============================================================
 * Returns the Website Configuration for the authenticated
 * customer workspace.
 *
 * The Website is resolved exclusively through the authenticated
 * tenant. A customer cannot request another tenant's Website
 * configuration through this service.
 *
 * If the WebsiteConfiguration record does not exist yet, the
 * service returns a null-valued configuration object so the
 * caller can present an unconfigured Website cleanly.
 * ============================================================
 */
export async function getWebsiteConfiguration(): Promise<WebsiteConfiguration> {
  const { tenant } = await requireWorkspaceAccess();

  const website = await prisma.website.findUnique({
    where: {
      tenantId: tenant.id,
    },
    select: {
      id: true,

      configuration: {
        select: {
          id: true,
          websiteId: true,
          websiteTitle: true,
          tagline: true,
          websiteDescription: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  if (!website) {
    throw new Error("Website is not connected to this workspace.");
  }

  return {
    id: website.configuration?.id ?? null,
    websiteId: website.id,
    websiteTitle:
      website.configuration?.websiteTitle ?? null,
    tagline: website.configuration?.tagline ?? null,
    websiteDescription:
      website.configuration?.websiteDescription ?? null,
    createdAt:
      website.configuration?.createdAt ?? null,
    updatedAt:
      website.configuration?.updatedAt ?? null,
  };
}

/**
 * ============================================================
 * Saves Website Configuration for the authenticated customer
 * workspace.
 *
 * Website configuration is Website-scoped and is therefore
 * persisted against the Website belonging to the authenticated
 * tenant.
 *
 * Empty strings are normalized to null so an intentionally
 * cleared setting does not leave whitespace-only values in
 * the database.
 * ============================================================
 */
export async function saveWebsiteConfiguration(input: {
  websiteTitle?: string | null;
  tagline?: string | null;
  websiteDescription?: string | null;
}): Promise<WebsiteConfiguration> {
  const { tenant } = await requireWorkspaceAccess();

  const website = await prisma.website.findUnique({
    where: {
      tenantId: tenant.id,
    },
    select: {
      id: true,
    },
  });

  if (!website) {
    throw new Error("Website is not connected to this workspace.");
  }

  const normalizeOptionalText = (
    value: string | null | undefined,
  ): string | null => {
    if (value === null || value === undefined) {
      return null;
    }

    const trimmed = value.trim();

    return trimmed.length > 0 ? trimmed : null;
  };

  const websiteTitle = normalizeOptionalText(
    input.websiteTitle,
  );

  const tagline = normalizeOptionalText(input.tagline);

  const websiteDescription = normalizeOptionalText(
    input.websiteDescription,
  );

  const configuration =
    await prisma.websiteConfiguration.upsert({
      where: {
        websiteId: website.id,
      },

      create: {
        websiteId: website.id,
        websiteTitle,
        tagline,
        websiteDescription,
      },

      update: {
        websiteTitle,
        tagline,
        websiteDescription,
      },

      select: {
        id: true,
        websiteId: true,
        websiteTitle: true,
        tagline: true,
        websiteDescription: true,
        createdAt: true,
        updatedAt: true,
      },
    });

  return configuration;
}

export default getWebsiteSettingsOverview;