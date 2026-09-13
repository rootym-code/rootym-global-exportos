/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * Organization    : ROOTYM Agro Harvest Pvt. Ltd.
 *
 * Feature         : R-CAPTAIN Controlled Live Data
 * Module          : Products Summary Tool
 *
 * Author          : Prem Singh
 * Purpose         : Provide R-CAPTAIN with a safe, Website-scoped
 *                   product catalogue readiness summary.
 *
 * Security:
 * • Workspace authentication is mandatory.
 * • Product queries are scoped to the authenticated Website.
 * • No customer PII, financial credentials, or payment data
 *   is returned.
 * • Product records are summarized rather than dumped into AI.
 * ============================================================
 */

import { prisma } from "@/lib/prisma";
import { resolveRCaptainContext } from "@/lib/services/rcaptain/context.service";

export type RCaptainProductsSummary = {
  websiteId: string;
  total: number;
  published: number;
  draft: number;
  archivedOrInactive: number;

  readiness: {
    ready: boolean;
    blockers: string[];
    warnings: string[];
  };

  catalogue: {
    withDescription: number;
    withoutDescription: number;
    withHsCode: number;
    withoutHsCode: number;
    withPricing: number;
    withoutPricing: number;
  };
};

/**
 * Return a controlled product-catalogue summary for the
 * authenticated customer's Website.
 *
 * Only aggregate/readiness information is returned.
 * Individual product records are intentionally not exposed
 * by this tool.
 */
export async function getProductsSummary(): Promise<RCaptainProductsSummary> {
  const context =
    await resolveRCaptainContext({
      mode: "WORKSPACE",
    });

  if (!context.website) {
    throw new Error(
      "Authenticated customer Website context is required."
    );
  }

  const websiteId = context.website.id;

  const [
    total,
    published,
    draft,
    archivedOrInactive,
    withDescription,
    withoutDescription,
    withHsCode,
    withoutHsCode,
    withPricing,
    withoutPricing,
  ] = await Promise.all([
    prisma.product.count({
      where: {
        websiteId,
      },
    }),

    prisma.product.count({
      where: {
        websiteId,
        status: "PUBLISHED",
      },
    }),

    prisma.product.count({
      where: {
        websiteId,
        status: "DRAFT",
      },
    }),

    prisma.product.count({
      where: {
        websiteId,
        status: {
          notIn: ["PUBLISHED", "DRAFT"],
        },
      },
    }),

    prisma.product.count({
      where: {
        websiteId,
        description: {
          not: null,
        },
      },
    }),

    prisma.product.count({
      where: {
        websiteId,
        OR: [
          {
            description: null,
          },
          {
            description: "",
          },
        ],
      },
    }),

    prisma.product.count({
      where: {
        websiteId,
        hsCode: {
          not: null,
        },
      },
    }),

    prisma.product.count({
      where: {
        websiteId,
        OR: [
          {
            hsCode: null,
          },
          {
            hsCode: "",
          },
        ],
      },
    }),

    prisma.product.count({
      where: {
        websiteId,
        pricing: {
          some: {},
        },
      },
    }),

    prisma.product.count({
      where: {
        websiteId,
        pricing: {
          none: {},
        },
      },
    }),
  ]);

  const blockers: string[] = [];
  const warnings: string[] = [];

  if (total === 0) {
    blockers.push(
      "No products have been added to the Website catalogue."
    );
  }

  if (published === 0 && total > 0) {
    blockers.push(
      "No products are currently published."
    );
  }

  if (withoutDescription > 0) {
    warnings.push(
      `${withoutDescription} product(s) do not have a description.`
    );
  }

  if (withoutHsCode > 0) {
    warnings.push(
      `${withoutHsCode} product(s) do not have an HSN/HS code.`
    );
  }

  if (withoutPricing > 0) {
    warnings.push(
      `${withoutPricing} product(s) do not have pricing configured.`
    );
  }

  return {
    websiteId,

    total,
    published,
    draft,
    archivedOrInactive,

    readiness: {
      ready:
        blockers.length === 0,

      blockers,
      warnings,
    },

    catalogue: {
      withDescription,
      withoutDescription,
      withHsCode,
      withoutHsCode,
      withPricing,
      withoutPricing,
    },
  };
}
