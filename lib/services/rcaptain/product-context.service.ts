/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * Organization    : ROOTYM Agro Harvest Pvt. Ltd.
 *
 * Module          : R-CAPTAIN Intelligence
 * Component       : Product Context Service
 *
 * Description
 * ------------------------------------------------------------
 * Provides live, Website-scoped product knowledge to R-CAPTAIN.
 *
 * Responsibilities:
 * • Read current products from Prisma
 * • Restrict product knowledge to the target Website
 * • Include only published products for public product context
 * • Prevent cross-tenant product leakage
 * • Convert current DB data into AI-ready context
 *
 * ============================================================
 * Author          : Prem Singh
 * Purpose         : Provide dynamic Website-scoped product context
 *                   for R-CAPTAIN without hardcoded products.
 * ============================================================
 */

import { prisma } from "@/lib/prisma";
import { ProductStatus } from "@/lib/generated/prisma";

export async function getRCaptainProductContext(
  websiteId?: string
): Promise<string> {
  /*
   * Product data is Website-owned. R-CAPTAIN must therefore never
   * execute a global Product query without Website scope.
   *
   * The parameter remains optional temporarily so the existing
   * R-CAPTAIN call chain does not break while Website context is
   * wired into the orchestration layer.
   */
  if (!websiteId) {
    return `
ROOTYM product catalogue is unavailable because no Website context
was supplied to R-CAPTAIN.

Do not invent or assume product information.
Ask the user to provide or select the relevant Website context.
`;
  }

  const products = await prisma.product.findMany({
    where: {
      websiteId,
      status: ProductStatus.PUBLISHED,
    },

    select: {
      id: true,
      sku: true,
      name: true,
      slug: true,
      shortDescription: true,
      description: true,
      category: true,
      origin: true,
      hsCode: true,
      defaultUnit: true,
      minOrderQty: true,
      maxOrderQty: true,
      featuredImageId: true,
      specificationDocumentId: true,

      pricing: {
        where: {
          isActive: true,
        },

        select: {
          pricingType: true,
          currency: true,
          price: true,
          validFrom: true,
          validTo: true,
          remarks: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      },
    },

    orderBy: {
      name: "asc",
    },
  });

  if (!products.length) {
    return `
ROOTYM product catalogue is currently unavailable for this Website.

Do not invent product information, pricing, availability, specifications,
or delivery promises. Ask the user to contact the Website owner for
current product details.
`;
  }

  const now = new Date();

  const context = products
    .map((product, index) => {
      const activePricing = product.pricing.filter((pricing) => {
        const starts =
          !pricing.validFrom || pricing.validFrom <= now;

        const ends =
          !pricing.validTo || pricing.validTo >= now;

        return starts && ends;
      });

      const pricingContext = activePricing.length
        ? activePricing
            .map((pricing) => {
              const price =
                pricing.price !== null
                  ? `${pricing.price.toString()} ${pricing.currency}`
                  : "Price on request";

              return `- ${pricing.pricingType}: ${price}${
                pricing.remarks
                  ? ` (${pricing.remarks})`
                  : ""
              }`;
            })
            .join("\n")
        : "Price available on request.";

      return `
${index + 1}. ${product.name}

Product ID:
${product.id}

SKU:
${product.sku}

Slug:
${product.slug}

Category:
${product.category ?? "Not specified"}

Origin:
${product.origin ?? "Not specified"}

Description:
${
  product.description ??
  product.shortDescription ??
  "No description available."
}

HS Code:
${product.hsCode ?? "Available on request"}

Default Unit:
${product.defaultUnit}

Minimum Order Quantity:
${
  product.minOrderQty !== null
    ? `${product.minOrderQty.toString()} ${product.defaultUnit}`
    : "Contact Website owner"
}

Maximum Order Quantity:
${
  product.maxOrderQty !== null
    ? `${product.maxOrderQty.toString()} ${product.defaultUnit}`
    : "Contact Website owner"
}

Pricing:
${pricingContext}

Featured Image:
${product.featuredImageId ? "Available" : "Not available"}

Specification Document:
${
  product.specificationDocumentId
    ? "Available"
    : "Not available"
}
`;
    })
    .join("\n");

  return `
CURRENT WEBSITE PRODUCT KNOWLEDGE

This information was retrieved live from the Website's current
published product catalogue.

${context}

IMPORTANT:
- Use only the product information supplied above.
- Products are Website-scoped; never infer or expose products belonging to another Website.
- Do not invent products.
- Do not invent prices, specifications, certifications, availability, lead times, or delivery promises.
- Use current pricing only when an active pricing record is present and valid for the current date.
- If pricing is absent or marked as price on request, say that pricing is available on request.
- Ask for destination country and quantity for export enquiries.
- If requested information is not present above, say that it is not currently available and do not guess.
`;
}
