/**
 * ============================================================
 * ROOTYM SaaS Customer Workspace Service
 * ============================================================
 * Author: Prem Singh
 * Purpose: Creates SaaS customer identities, tenants, websites,
 *          and owner memberships without automatically starting
 *          a trial, while also supporting invitation-based
 *          identity resolution without creating an unintended
 *          workspace.
 * ============================================================
 */

import prisma from "@/lib/prisma";
import {
  CmsPageStatus,
  MembershipRole,
} from "@/lib/generated/prisma";
import type { Prisma } from "@/lib/generated/prisma";

function createTenantSlug(
  name: string,
  email: string,
): string {
  const source =
    name?.trim() ||
    email.split("@")[0] ||
    "workspace";

  const slug = source
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  return slug || "workspace";
}

async function getUniqueTenantSlug(
  tx: Prisma.TransactionClient,
  name: string,
  email: string,
): Promise<string> {
  const base = createTenantSlug(
    name,
    email,
  );

  let slug = base;
  let suffix = 2;

  while (
    await tx.tenant.findUnique({
      where: {
        slug,
      },
    })
  ) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

/**
 * ============================================================
 * Provision the four ROOTYM default Website pages.
 * ============================================================
 *
 * Default pages:
 * - Home
 * - Products
 * - Request Quote
 * - Contact
 *
 * This is deliberately Website-scoped. The CMS schema now
 * permits the same page slug to exist on different Websites.
 *
 * Existing pages are never overwritten.
 * An existing custom homepage is never replaced.
 * ============================================================
 */
async function provisionDefaultWebsitePages(
  tx: Prisma.TransactionClient,
  websiteId: string,
): Promise<void> {
  const defaultLanguage =
    await tx.language.findFirst({
      where: {
        isDefault: true,
        isActive: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
    });

  if (!defaultLanguage) {
    throw new Error(
      "No active default language is configured. Please configure the default Language before creating a customer workspace.",
    );
  }

  const existingHomepage =
    await tx.cmsPage.findFirst({
      where: {
        websiteId,
        isHomePage: true,
      },
      select: {
        id: true,
      },
    });

  const defaultPages = [
    {
      title: "Home",
      slug: "home",
      isHomePage: !existingHomepage,
      showInMenu: true,
    },
    {
      title: "Products",
      slug: "products",
      isHomePage: false,
      showInMenu: true,
    },
    {
      title: "Request Quote",
      slug: "request-quote",
      isHomePage: false,
      showInMenu: true,
    },
    {
      title: "Contact",
      slug: "contact",
      isHomePage: false,
      showInMenu: true,
    },
  ];

  for (const defaultPage of defaultPages) {
    const existingPage =
      await tx.cmsPage.findUnique({
        where: {
          websiteId_slug: {
            websiteId,
            slug: defaultPage.slug,
          },
        },
        select: {
          id: true,
        },
      });

    if (existingPage) {
      continue;
    }

    const page =
      await tx.cmsPage.create({
        data: {
          websiteId,
          title: defaultPage.title,
          slug: defaultPage.slug,
          status: CmsPageStatus.PUBLISHED,
          isHomePage: defaultPage.isHomePage,
          showInMenu: defaultPage.showInMenu,
          publishedAt: new Date(),
          translations: {
            create: {
              languageId:
                defaultLanguage.id,
              title: defaultPage.title,
              slug: defaultPage.slug,
              isPublished: true,
            },
          },
        },
        select: {
          id: true,
          slug: true,
        },
      });

    console.log(
      "Provisioned default Website page:",
      {
        websiteId,
        pageId: page.id,
        slug: page.slug,
      },
    );
  }
}

/**
 * ============================================================
 * Resolve or create the ROOTYM customer identity only.
 * ============================================================
 *
 * This function deliberately does not create a Tenant,
 * Website, or Membership. It is used when an existing
 * invitation determines which workspace the customer
 * must join.
 * ============================================================
 */
export async function resolveCustomerIdentity(
  input: {
    email: string;
    name: string;
    avatarUrl?: string | null;
    provider: string;
    providerAccountId: string;
    providerEmail?: string | null;
  },
) {
  const normalizedEmail =
    input.email.toLowerCase().trim();

  if (!normalizedEmail) {
    throw new Error(
      "A valid customer email is required.",
    );
  }

  if (!input.providerAccountId) {
    throw new Error(
      "A valid authentication provider account is required.",
    );
  }

  return prisma.$transaction(async (tx) => {
    const existingIdentity =
      await tx.authIdentity.findUnique({
        where: {
          provider_providerAccountId: {
            provider: input.provider,
            providerAccountId:
              input.providerAccountId,
          },
        },
        include: {
          user: true,
        },
      });

    let user =
      existingIdentity?.user ?? null;

    if (!user) {
      user = await tx.user.findUnique({
        where: {
          email: normalizedEmail,
        },
      });
    }

    if (!user) {
      user = await tx.user.create({
        data: {
          email: normalizedEmail,
          name:
            input.name?.trim() ||
            normalizedEmail.split("@")[0],
          avatarUrl:
            input.avatarUrl ?? null,
          emailVerifiedAt: new Date(),
        },
      });
    } else if (!user.isActive) {
      throw new Error(
        "This customer account is inactive. Please contact ROOTYM support.",
      );
    }

    if (existingIdentity) {
      await tx.authIdentity.update({
        where: {
          id: existingIdentity.id,
        },
        data: {
          providerEmail:
            input.providerEmail ??
            normalizedEmail,
        },
      });
    } else {
      await tx.authIdentity.create({
        data: {
          userId: user.id,
          provider: input.provider,
          providerAccountId:
            input.providerAccountId,
          providerEmail:
            input.providerEmail ??
            normalizedEmail,
        },
      });
    }

    return {
      user,
    };
  });
}

export async function createCustomerWorkspace(
  input: {
    email: string;
    name: string;
    avatarUrl?: string | null;
    provider: string;
    providerAccountId: string;
    providerEmail?: string | null;
  },
) {
  const normalizedEmail =
    input.email.toLowerCase().trim();

  if (!normalizedEmail) {
    throw new Error(
      "A valid customer email is required.",
    );
  }

  if (!input.providerAccountId) {
    throw new Error(
      "A valid authentication provider account is required.",
    );
  }

  return prisma.$transaction(async (tx) => {
    /**
     * 1. Find the authentication identity first.
     */
    const existingIdentity =
      await tx.authIdentity.findUnique({
        where: {
          provider_providerAccountId: {
            provider: input.provider,
            providerAccountId:
              input.providerAccountId,
          },
        },
        include: {
          user: true,
        },
      });

    let user =
      existingIdentity?.user ?? null;

    /**
     * 2. If this authentication identity is new,
     *    try matching an existing SaaS customer by email.
     */
    if (!user) {
      user = await tx.user.findUnique({
        where: {
          email: normalizedEmail,
        },
      });
    }

    /**
     * 3. Create the customer if this is a completely
     *    new SaaS account.
     */
    if (!user) {
      user = await tx.user.create({
        data: {
          email: normalizedEmail,
          name:
            input.name?.trim() ||
            normalizedEmail.split("@")[0],
          avatarUrl:
            input.avatarUrl ?? null,
          emailVerifiedAt: new Date(),
        },
      });
    } else if (!user.isActive) {
      throw new Error(
        "This customer account is inactive. Please contact ROOTYM support.",
      );
    }

    /**
     * 4. Create or update the authentication identity.
     */
    if (existingIdentity) {
      await tx.authIdentity.update({
        where: {
          id: existingIdentity.id,
        },
        data: {
          providerEmail:
            input.providerEmail ??
            normalizedEmail,
        },
      });
    } else {
      await tx.authIdentity.create({
        data: {
          userId: user.id,
          provider: input.provider,
          providerAccountId:
            input.providerAccountId,
          providerEmail:
            input.providerEmail ??
            normalizedEmail,
        },
      });
    }

    /**
     * 5. Resolve the customer's existing workspace.
     *
     * Phase 1 supports the initial single-workspace
     * model. A subsequent login reuses the existing
     * membership instead of creating another tenant.
     */
    let membership =
      await tx.membership.findFirst({
        where: {
          userId: user.id,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

    /**
     * 6. Create the initial workspace when this is the
     *    customer's first SaaS login.
     *
     * User
     *   ↓
     * Tenant
     *   ├── Website
     *   └── OWNER membership
     *
     * No subscription is created here.
     */
    if (!membership) {
      const tenantSlug =
        await getUniqueTenantSlug(
          tx,
          user.name,
          user.email,
        );

      const tenant =
        await tx.tenant.create({
          data: {
            name: `${user.name}'s Workspace`,
            slug: tenantSlug,
            isActive: true,
          },
        });

      /**
       * 7. Provision the customer Website as part
       *    of the same initial workspace transaction.
       *
       * Website is the tenant-owned root entity for
       * Website & Marketing. It must not be created
       * lazily by an individual Website module.
       */
      const website =
        await tx.website.create({
          data: {
            tenantId: tenant.id,
            name: `${tenant.name} Website`,
            slug: tenant.slug,
            isActive: true,
          },
        });

      /**
       * 8. Provision the standard Website pages in the
       *    same transaction so every newly created
       *    customer workspace starts with the baseline
       *    Website structure.
       */
      await provisionDefaultWebsitePages(
        tx,
        website.id,
      );

      membership =
        await tx.membership.create({
          data: {
            userId: user.id,
            tenantId: tenant.id,
            role: MembershipRole.OWNER,
          },
        });
    }

    return {
      user,
      membership,
    };
  });
}
