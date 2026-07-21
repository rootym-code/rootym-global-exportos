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
 * Provides live product knowledge to R-CAPTAIN.
 *
 * Responsibilities:
 * • Fetch published products
 * • Prepare AI context
 * • Remove hardcoded product dependency
 * ============================================================
 */

import { ProductStatus } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";


/**
 * Builds product knowledge context
 * for R-CAPTAIN AI prompt.
 */
export async function getRCaptainProductContext() {

  const products =
    await prisma.product.findMany({

      where: {
        status: ProductStatus.PUBLISHED,
      },

      select: {

        name: true,

        category: true,

        description: true,

        shortDescription: true,

        origin: true,

        hsCode: true,

        defaultUnit: true,

      },

      orderBy: {
        name: "asc",
      },

    });


  if (products.length === 0) {

    return `
ROOTYM PRODUCT KNOWLEDGE:

No published products are currently available.
`;

  }


  const context = products
    .map(
      (product, index) => {

        return `
${index + 1}. ${product.name}

Category:
${product.category ?? "Agricultural Product"}

Origin:
${product.origin ?? "India"}

Description:
${product.description ??
 product.shortDescription ??
 "Premium agricultural product from India."}

Packaging:
${product.defaultUnit ?? "Export packaging available"}

HS Code:
${product.hsCode ?? "Not specified"}

`;

      }
    )
    .join("\n");


  return `
ROOTYM PRODUCT KNOWLEDGE
========================

${context}

Use this information when answering buyer questions.
Only mention products present in this knowledge base.
`;

}


// END OF FILE