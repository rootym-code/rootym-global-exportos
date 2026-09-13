/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * Organization    : ROOTYM Agro Harvest Pvt. Ltd.
 *
 * Feature         : R-CAPTAIN Controlled Live Data
 * Module          : Website Status Tool
 *
 * Author          : Prem Singh
 * Purpose         : Provide R-CAPTAIN with a safe, tenant-scoped
 *                   Website readiness and configuration summary.
 *
 * Security:
 * • Workspace authentication is mandatory.
 * • Every Website-related query is scoped by the authenticated
 *   Tenant/Website ID.
 * • No raw customer PII or financial credentials are returned.
 * • Only readiness/status information is exposed to AI.
 * ============================================================
 */

import { prisma } from "@/lib/prisma";
import { resolveRCaptainContext } from "@/lib/services/rcaptain/context.service";

export type RCaptainWebsiteStatus = {
  website: {
    exists: boolean;
    active: boolean;
    name: string | null;
    slug: string | null;
  };

  configuration: {
    exists: boolean;
    websiteTitleConfigured: boolean;
    taglineConfigured: boolean;
    descriptionConfigured: boolean;
  };

  branding: {
    exists: boolean;
    logoConfigured: boolean;
    faviconConfigured: boolean;
  };

  pages: {
    total: number;
    published: number;
    draft: number;
    hasHome: boolean;
    hasProducts: boolean;
    hasRequestQuote: boolean;
    hasContact: boolean;
  };

  products: {
    total: number;
    published: number;
  };

  navigation: {
    status: "AVAILABLE" | "NOT_AVAILABLE_IN_CURRENT_CLIENT";
    configured: boolean;
    itemCount: number;
  };

  readiness: {
    ready: boolean;
    blockers: string[];
    warnings: string[];
  };
};

/**
 * Return a controlled Website readiness summary for the
 * authenticated customer's Workspace.
 *
 * This implementation deliberately uses separate scalar/relation
 * queries instead of selecting Website relations directly. The
 * current generated Prisma client exposes Website scalar fields
 * while its Website relation selections are not available to this
 * module.
 *
 * Sensitive information is never selected:
 * • business email / phone
 * • addresses
 * • GSTIN / IEC / Udyam / RCMC / AD Code
 * • bank details
 * • payment-provider identifiers
 * • credentials or secrets
 */
export async function getWebsiteStatus(): Promise<RCaptainWebsiteStatus> {
  const context =
    await resolveRCaptainContext({
      mode: "WORKSPACE",
    });

  if (!context.tenant) {
    throw new Error(
      "Authenticated customer Workspace context is required."
    );
  }

  const website = await prisma.website.findUnique({
    where: {
      tenantId: context.tenant.id,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      isActive: true,
    },
  });

  if (!website) {
    return {
      website: {
        exists: false,
        active: false,
        name: null,
        slug: null,
      },

      configuration: {
        exists: false,
        websiteTitleConfigured: false,
        taglineConfigured: false,
        descriptionConfigured: false,
      },

      branding: {
        exists: false,
        logoConfigured: false,
        faviconConfigured: false,
      },

      pages: {
        total: 0,
        published: 0,
        draft: 0,
        hasHome: false,
        hasProducts: false,
        hasRequestQuote: false,
        hasContact: false,
      },

      products: {
        total: 0,
        published: 0,
      },

      navigation: {
        status: "NOT_AVAILABLE_IN_CURRENT_CLIENT",
        configured: false,
        itemCount: 0,
      },

      readiness: {
        ready: false,
        blockers: ["Website is not configured."],
        warnings: [],
      },
    };
  }

  const [
    configuration,
    branding,
    pages,
    totalProducts,
    publishedProducts,
  ] = await Promise.all([
    prisma.websiteConfiguration.findUnique({
      where: {
        websiteId: website.id,
      },
      select: {
        websiteTitle: true,
        tagline: true,
        websiteDescription: true,
      },
    }),

    prisma.websiteBranding.findUnique({
      where: {
        websiteId: website.id,
      },
      select: {
        logoMediaId: true,
        faviconMediaId: true,
      },
    }),

    prisma.cmsPage.findMany({
      where: {
        websiteId: website.id,
      },
      select: {
        slug: true,
        status: true,
      },
    }),

    prisma.product.count({
      where: {
        websiteId: website.id,
      },
    }),

    prisma.product.count({
      where: {
        websiteId: website.id,
        status: "PUBLISHED",
      },
    }),
  ]);

  const publishedPageStatus = "PUBLISHED";

  const publishedPages =
    pages.filter(
      (page) => page.status === publishedPageStatus
    ).length;

  const draftPages =
    pages.filter(
      (page) => page.status !== publishedPageStatus
    ).length;

  const hasHome = pages.some(
    (page) =>
      page.slug.toLowerCase() === "home"
  );

  const hasProducts = pages.some(
    (page) =>
      page.slug.toLowerCase() === "products"
  );

  const hasRequestQuote = pages.some(
    (page) =>
      page.slug.toLowerCase() === "request-quote"
  );

  const hasContact = pages.some(
    (page) =>
      page.slug.toLowerCase() === "contact"
  );

  const configurationExists =
    configuration !== null;

  const brandingExists =
    branding !== null;

  const websiteTitleConfigured =
    Boolean(
      configuration?.websiteTitle?.trim()
    );

  const taglineConfigured =
    Boolean(
      configuration?.tagline?.trim()
    );

  const descriptionConfigured =
    Boolean(
      configuration?.websiteDescription?.trim()
    );

  const logoConfigured =
    Boolean(branding?.logoMediaId);

  const faviconConfigured =
    Boolean(branding?.faviconMediaId);

  /*
   * The current generated Prisma client does not expose a Website
   * navigation relation. Do not fall back to a global Menu query,
   * because that could create a cross-tenant data leak.
   *
   * Navigation can be added to this tool once the generated client
   * exposes the Website -> Menu relation.
   */
  const navigation = {
    status:
      "NOT_AVAILABLE_IN_CURRENT_CLIENT" as const,
    configured: false,
    itemCount: 0,
  };

  const blockers: string[] = [];
  const warnings: string[] = [];

  if (!website.isActive) {
    blockers.push("Website is inactive.");
  }

  if (!configurationExists) {
    blockers.push("Website configuration is missing.");
  }

  if (!websiteTitleConfigured) {
    blockers.push("Website title is not configured.");
  }

  if (!hasHome) {
    blockers.push("Home page is missing.");
  }

  if (!hasProducts) {
    blockers.push("Products page is missing.");
  }

  if (!hasRequestQuote) {
    blockers.push("Request Quote page is missing.");
  }

  if (!hasContact) {
    blockers.push("Contact page is missing.");
  }

  if (publishedProducts === 0) {
    warnings.push(
      "No published products are available."
    );
  }

  if (!brandingExists) {
    warnings.push(
      "Website branding is not configured."
    );
  } else {
    if (!logoConfigured) {
      warnings.push(
        "Website logo is not configured."
      );
    }

    if (!faviconConfigured) {
      warnings.push(
        "Website favicon is not configured."
      );
    }
  }

  if (!taglineConfigured) {
    warnings.push(
      "Website tagline is not configured."
    );
  }

  if (!descriptionConfigured) {
    warnings.push(
      "Website description is not configured."
    );
  }

  warnings.push(
    "Navigation status is not available through the current generated Prisma client."
  );

  return {
    website: {
      exists: true,
      active: website.isActive,
      name: website.name,
      slug: website.slug,
    },

    configuration: {
      exists: configurationExists,
      websiteTitleConfigured,
      taglineConfigured,
      descriptionConfigured,
    },

    branding: {
      exists: brandingExists,
      logoConfigured,
      faviconConfigured,
    },

    pages: {
      total: pages.length,
      published: publishedPages,
      draft: draftPages,
      hasHome,
      hasProducts,
      hasRequestQuote,
      hasContact,
    },

    products: {
      total: totalProducts,
      published: publishedProducts,
    },

    navigation,

    readiness: {
      ready: blockers.length === 0,
      blockers,
      warnings,
    },
  };
}
