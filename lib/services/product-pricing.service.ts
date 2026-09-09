/**
 * ============================================================
 * ROOTYM Global ExportOS
 * ============================================================
 * Author      : Prem Singh
 * Module      : Product Management
 * Feature     : Website-scoped Product Pricing
 * File        : lib/services/product-pricing.service.ts
 * Purpose     : Provides Website-safe Product Pricing
 *               operations and supports both fixed-price and
 *               market/price-on-request pricing.
 * ============================================================
 */

import { Prisma } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";

import type {
  CreateProductPricingInput,
  UpdateProductPricingInput,
} from "@/lib/validations/product-pricing";

async function getWebsiteProduct(
  websiteId: string,
  productId: string
) {
  if (!websiteId?.trim()) {
    throw new Error("Website context is required.");
  }

  if (!productId?.trim()) {
    throw new Error("Product is required.");
  }

  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      websiteId,
    },
    select: {
      id: true,
      websiteId: true,
      sku: true,
      name: true,
      defaultUnit: true,
    },
  });

  if (!product) {
    throw new Error(
      "Product not found for this Website."
    );
  }

  return product;
}

export async function listProductPricing(
  websiteId: string,
  productId: string
) {
  await getWebsiteProduct(
    websiteId,
    productId
  );

  return prisma.productPricing.findMany({
    where: {
      productId,
      product: {
        websiteId,
      },
    },
    orderBy: [
      {
        isActive: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });
}

export async function getProductPricingById(
  websiteId: string,
  id: string
) {
  if (!websiteId?.trim()) {
    throw new Error("Website context is required.");
  }

  if (!id?.trim()) {
    throw new Error(
      "Pricing record is required."
    );
  }

  return prisma.productPricing.findFirst({
    where: {
      id,
      product: {
        websiteId,
      },
    },
    include: {
      product: {
        select: {
          id: true,
          sku: true,
          name: true,
          defaultUnit: true,
          websiteId: true,
        },
      },
    },
  });
}

export async function getActiveProductPrice(
  websiteId: string,
  productId: string
) {
  await getWebsiteProduct(
    websiteId,
    productId
  );

  const now = new Date();

  return prisma.productPricing.findFirst({
    where: {
      productId,
      product: {
        websiteId,
      },
      isActive: true,
      OR: [
        {
          validFrom: null,
          validTo: null,
        },
        {
          validFrom: {
            lte: now,
          },
          validTo: null,
        },
        {
          validFrom: null,
          validTo: {
            gte: now,
          },
        },
        {
          validFrom: {
            lte: now,
          },
          validTo: {
            gte: now,
          },
        },
      ],
    },
    orderBy: [
      {
        validFrom: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });
}

export async function createProductPricing(
  websiteId: string,
  data: CreateProductPricingInput
) {
  const product = await getWebsiteProduct(
    websiteId,
    data.productId
  );

  return prisma.$transaction(
    async (tx) => {
      if (data.isActive) {
        await tx.productPricing.updateMany({
          where: {
            productId: product.id,
            product: {
              websiteId,
            },
            isActive: true,
          },
          data: {
            isActive: false,
          },
        });
      }

      return tx.productPricing.create({
        data: {
          productId: product.id,

          pricingType:
            data.pricingType,

          currency:
            data.currency,

          /**
           * FIXED pricing contains a Decimal price.
           *
           * MARKET pricing may intentionally have
           * no price, representing Price on Request /
           * latest market price.
           */
          price:
            data.price !== undefined
              ? new Prisma.Decimal(
                  data.price
                )
              : null,

          validFrom:
            data.validFrom
              ? new Date(
                  data.validFrom
                )
              : null,

          validTo:
            data.validTo
              ? new Date(
                  data.validTo
                )
              : null,

          isActive:
            data.isActive,

          remarks:
            data.remarks || null,
        },
      });
    }
  );
}

export async function updateProductPricing(
  websiteId: string,
  id: string,
  data: UpdateProductPricingInput
) {
  const existing =
    await getProductPricingById(
      websiteId,
      id
    );

  if (!existing) {
    throw new Error(
      "Pricing record not found for this Website."
    );
  }

  return prisma.$transaction(
    async (tx) => {
      if (data.isActive === true) {
        await tx.productPricing.updateMany({
          where: {
            productId:
              existing.productId,
            product: {
              websiteId,
            },
            isActive: true,
            NOT: {
              id,
            },
          },
          data: {
            isActive: false,
          },
        });
      }

      /**
       * If an existing price is changed to MARKET
       * without supplying a price, explicitly clear
       * the old fixed price.
       *
       * This prevents an old fixed price from remaining
       * attached to a Price-on-Request record.
       */
      const shouldClearPrice =
        data.pricingType === "MARKET" &&
        data.price === undefined;

      return tx.productPricing.update({
        where: {
          id,
        },
        data: {
          ...(data.pricingType !==
            undefined && {
            pricingType:
              data.pricingType,
          }),

          ...(data.currency !==
            undefined && {
            currency:
              data.currency,
          }),

          ...(data.price !==
            undefined && {
            price:
              new Prisma.Decimal(
                data.price
              ),
          }),

          ...(shouldClearPrice && {
            price: null,
          }),

          ...(data.validFrom !==
            undefined && {
            validFrom:
              data.validFrom
                ? new Date(
                    data.validFrom
                  )
                : null,
          }),

          ...(data.validTo !==
            undefined && {
            validTo:
              data.validTo
                ? new Date(
                    data.validTo
                  )
                : null,
          }),

          ...(data.isActive !==
            undefined && {
            isActive:
              data.isActive,
          }),

          ...(data.remarks !==
            undefined && {
            remarks:
              data.remarks || null,
          }),
        },
      });
    }
  );
}

export async function deleteProductPricing(
  websiteId: string,
  id: string
) {
  const existing =
    await getProductPricingById(
      websiteId,
      id
    );

  if (!existing) {
    throw new Error(
      "Pricing record not found for this Website."
    );
  }

  return prisma.productPricing.delete({
    where: {
      id,
    },
  });
}