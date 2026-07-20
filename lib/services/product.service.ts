import { Prisma, ProductStatus } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";
import type {
  CreateProductInput,
  UpdateProductInput,
} from "@/lib/validations/product";

export interface ProductFilters {
  search?: string;
  status?: ProductStatus;
  category?: string;
  page?: number;
  pageSize?: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

function buildWhere(filters: ProductFilters): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {};

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.category) {
    where.category = filters.category;
  }

  if (filters.search) {
    const search = filters.search.trim();

    where.OR = [
      {
        name: {
          contains: search,
          mode: Prisma.QueryMode.insensitive,
        },
      },
      {
        sku: {
          contains: search,
          mode: Prisma.QueryMode.insensitive,
        },
      },
      {
        slug: {
          contains: search,
          mode: Prisma.QueryMode.insensitive,
        },
      },
      {
        category: {
          contains: search,
          mode: Prisma.QueryMode.insensitive,
        },
      },
    ];
  }

  return where;
}

async function validateFeaturedImage(
  featuredImageId?: string | null
) {
  if (!featuredImageId) {
    return null;
  }

  const media = await prisma.media.findUnique({
    where: {
      id: featuredImageId,
    },
  });

  if (!media) {
    throw new Error("Selected featured image does not exist.");
  }

  if (media.isDeleted) {
    throw new Error("Selected featured image has been deleted.");
  }

  return media;
}

export async function listProducts(filters: ProductFilters = {}) {
  const page = Math.max(DEFAULT_PAGE, filters.page ?? DEFAULT_PAGE);

  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, filters.pageSize ?? DEFAULT_PAGE_SIZE)
  );

  const skip = (page - 1) * pageSize;

  const where = buildWhere(filters);

  const [items, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      include: {
        featuredImage: true,
        pricing: {
          where: {
            isActive: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: pageSize,
    }),

    prisma.product.count({
      where,
    }),
  ]);

  return {
    items,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      featuredImage: true,
      pricing: {
        orderBy: {
          createdAt: "desc",
        },
      },
      quoteItems: {
        select: {
          id: true,
          quoteId: true,
        },
      },
    },
  });
}

export async function getProductBySku(sku: string) {
  return prisma.product.findUnique({
    where: {
      sku,
    },
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: {
      slug,
    },
  });
}
export async function createProduct(data: CreateProductInput) {
  const existingSku = await getProductBySku(data.sku);

  if (existingSku) {
    throw new Error("Product SKU already exists.");
  }

  const existingSlug = await getProductBySlug(data.slug);

  if (existingSlug) {
    throw new Error("Product slug already exists.");
  }

  await validateFeaturedImage(data.featuredImageId);

  return prisma.product.create({
    data: {
      sku: data.sku,
      name: data.name,
      slug: data.slug,
      shortDescription: data.shortDescription || null,
      description: data.description || null,
      category: data.category || null,
      origin: data.origin || null,
      hsCode: data.hsCode || null,
      defaultUnit: data.defaultUnit,
      minOrderQty:
        data.minOrderQty !== undefined
          ? new Prisma.Decimal(data.minOrderQty)
          : null,
      maxOrderQty:
        data.maxOrderQty !== undefined
          ? new Prisma.Decimal(data.maxOrderQty)
          : null,
      status: data.status,

      featuredImage:
        data.featuredImageId
          ? {
              connect: {
                id: data.featuredImageId,
              },
            }
          : undefined,
    },

    include: {
      featuredImage: true,
      pricing: true,
    },
  });
}

export async function updateProduct(
  id: string,
  data: UpdateProductInput
) {
  const existing = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  if (!existing) {
    throw new Error("Product not found.");
  }

  if (data.sku && data.sku !== existing.sku) {
    const skuExists = await getProductBySku(data.sku);

    if (skuExists) {
      throw new Error("Product SKU already exists.");
    }
  }

  if (data.slug && data.slug !== existing.slug) {
    const slugExists = await getProductBySlug(data.slug);

    if (slugExists) {
      throw new Error("Product slug already exists.");
    }
  }

  if (data.featuredImageId !== undefined) {
    await validateFeaturedImage(data.featuredImageId);
  }

  return prisma.product.update({
    where: {
      id,
    },
    data: {
      ...(data.sku !== undefined && {
        sku: data.sku,
      }),

      ...(data.name !== undefined && {
        name: data.name,
      }),

      ...(data.slug !== undefined && {
        slug: data.slug,
      }),

      ...(data.shortDescription !== undefined && {
        shortDescription: data.shortDescription || null,
      }),

      ...(data.description !== undefined && {
        description: data.description || null,
      }),

      ...(data.category !== undefined && {
        category: data.category || null,
      }),

      ...(data.origin !== undefined && {
        origin: data.origin || null,
      }),

      ...(data.hsCode !== undefined && {
        hsCode: data.hsCode || null,
      }),

      ...(data.defaultUnit !== undefined && {
        defaultUnit: data.defaultUnit,
      }),

      ...(data.minOrderQty !== undefined && {
        minOrderQty:
          data.minOrderQty === null
            ? null
            : new Prisma.Decimal(data.minOrderQty),
      }),

      ...(data.maxOrderQty !== undefined && {
        maxOrderQty:
          data.maxOrderQty === null
            ? null
            : new Prisma.Decimal(data.maxOrderQty),
      }),

      ...(data.status !== undefined && {
        status: data.status,
      }),

      ...(data.featuredImageId !== undefined && {
        featuredImage: data.featuredImageId
          ? {
              connect: {
                id: data.featuredImageId,
              },
            }
          : {
              disconnect: true,
            },
      }),
    },

    include: {
      featuredImage: true,
      pricing: true,
    },
  });
}
export async function deleteProduct(id: string) {
  const existing = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      quoteItems: {
        select: {
          id: true,
        },
        take: 1,
      },
    },
  });

  if (!existing) {
    throw new Error("Product not found.");
  }

  if (existing.quoteItems.length > 0) {
    throw new Error(
      "Product cannot be deleted because it is used in quotation(s)."
    );
  }

  await prisma.productPricing.deleteMany({
    where: {
      productId: id,
    },
  });

  return prisma.product.delete({
    where: {
      id,
    },
    include: {
      featuredImage: true,
    },
  });
}

export async function listProductCategories() {
  const categories = await prisma.product.findMany({
    where: {
      category: {
        not: null,
      },
    },
    distinct: ["category"],
    select: {
      category: true,
    },
    orderBy: {
      category: "asc",
    },
  });

  return categories
    .map((c) => c.category)
    .filter((c): c is string => Boolean(c));
}

// END OF FILE