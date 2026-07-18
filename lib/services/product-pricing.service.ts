import { Prisma } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";
import type {
  CreateProductPricingInput,
  UpdateProductPricingInput,
} from "@/lib/validations/product-pricing";

export async function listProductPricing(productId: string) {
  return prisma.productPricing.findMany({
    where: {
      productId,
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

export async function getProductPricingById(id: string) {
  return prisma.productPricing.findUnique({
    where: {
      id,
    },
    include: {
      product: {
        select: {
          id: true,
          sku: true,
          name: true,
          defaultUnit: true,
        },
      },
    },
  });
}

export async function getActiveProductPrice(productId: string) {
  const now = new Date();

  return prisma.productPricing.findFirst({
    where: {
      productId,
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
  data: CreateProductPricingInput
) {
  const product = await prisma.product.findUnique({
    where: {
      id: data.productId,
    },
  });

  if (!product) {
    throw new Error("Product not found.");
  }

  return prisma.$transaction(async (tx) => {
    if (data.isActive) {
      await tx.productPricing.updateMany({
        where: {
          productId: data.productId,
          isActive: true,
        },
        data: {
          isActive: false,
        },
      });
    }

    return tx.productPricing.create({
      data: {
        productId: data.productId,
        pricingType: data.pricingType,
        currency: data.currency,
        price: new Prisma.Decimal(data.price),
        validFrom: data.validFrom
          ? new Date(data.validFrom)
          : null,
        validTo: data.validTo
          ? new Date(data.validTo)
          : null,
        isActive: data.isActive,
        remarks: data.remarks || null,
      },
    });
  });
}

export async function updateProductPricing(
  id: string,
  data: UpdateProductPricingInput
) {
  const existing = await prisma.productPricing.findUnique({
    where: {
      id,
    },
  });

  if (!existing) {
    throw new Error("Pricing record not found.");
  }

  return prisma.$transaction(async (tx) => {
    if (data.isActive === true) {
      await tx.productPricing.updateMany({
        where: {
          productId: existing.productId,
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

    return tx.productPricing.update({
      where: {
        id,
      },
      data: {
        ...(data.pricingType !== undefined && {
          pricingType: data.pricingType,
        }),
        ...(data.currency !== undefined && {
          currency: data.currency,
        }),
        ...(data.price !== undefined && {
          price: new Prisma.Decimal(data.price),
        }),
        ...(data.validFrom !== undefined && {
          validFrom: data.validFrom
            ? new Date(data.validFrom)
            : null,
        }),
        ...(data.validTo !== undefined && {
          validTo: data.validTo
            ? new Date(data.validTo)
            : null,
        }),
        ...(data.isActive !== undefined && {
          isActive: data.isActive,
        }),
        ...(data.remarks !== undefined && {
          remarks: data.remarks || null,
        }),
      },
    });
  });
}

export async function deleteProductPricing(id: string) {
  const existing = await prisma.productPricing.findUnique({
    where: {
      id,
    },
  });

  if (!existing) {
    throw new Error("Pricing record not found.");
  }

  return prisma.productPricing.delete({
    where: {
      id,
    },
  });
}