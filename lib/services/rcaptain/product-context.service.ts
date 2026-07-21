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
 * Converts ROOTYM product catalogue into AI knowledge context.
 *
 * Used by:
 * • R-CAPTAIN
 * • Gemini AI Provider
 *
 * Flow:
 *
 * Prisma Product
 *        |
 *        ↓
 * Product Context
 *        |
 *        ↓
 * Gemini Prompt
 *
 * ============================================================
 */

import { prisma } from "@/lib/prisma";
import { ProductStatus } from "@/lib/generated/prisma";


export async function getRCaptainProductContext(): Promise<string> {

  const products =
    await prisma.product.findMany({

      where: {
        status: ProductStatus.PUBLISHED,
      },

      select: {

        name: true,

        shortDescription: true,

        description: true,

        category: true,

        origin: true,

        hsCode: true,

        defaultUnit: true,

        minOrderQty: true,

        maxOrderQty: true,

      },

      orderBy: {
        name: "asc",
      },

    });


  if (!products.length) {

    return `
ROOTYM product catalogue is currently unavailable.
Ask the buyer to contact ROOTYM for product details.
`;

  }


  const context = products
    .map(
      (product, index) => {

        return `
${index + 1}. ${product.name}

Category:
${product.category ?? "Not specified"}

Origin:
${product.origin ?? "India"}

Description:
${
  product.description ??
  product.shortDescription ??
  "No description available."
}

HS Code:
${product.hsCode ?? "Available on request"}

Minimum Order Quantity:
${
  product.minOrderQty
    ? `${product.minOrderQty.toString()} ${product.defaultUnit}`
    : "Contact ROOTYM"
}

Maximum Order Quantity:
${
  product.maxOrderQty
    ? `${product.maxOrderQty.toString()} ${product.defaultUnit}`
    : "Contact ROOTYM"
}

`;

      }
    )
    .join("\n");


  return `
ROOTYM PRODUCT KNOWLEDGE DATABASE

${context}

IMPORTANT:
- Use only this product information.
- Do not invent prices.
- Do not promise availability.
- Ask buyers for destination country and quantity for export enquiries.
`;

}