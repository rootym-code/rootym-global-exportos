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

import { MembershipRole } from "@/lib/generated/prisma";
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
      await tx.website.create({
        data: {
          tenantId: tenant.id,
          name: `${tenant.name} Website`,
          slug: tenant.slug,
          isActive: true,
        },
      });

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