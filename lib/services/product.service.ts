/**
 * ============================================================
 * ROOTYM ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides Website-scoped Product catalogue operations,
 *          including Product CRUD, pricing access, category
 *          discovery, and Website-safe media validation.
 * ============================================================
 */

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

/**
 * ============================================================
 * Website validation
 * ============================================================
 */

async function ensureWebsiteExists(websiteId: string) {
  if (!websiteId?.trim()) {
    throw new Error("Website context is required.");
  }

  const website = await prisma.website.findUnique({
    where: {
      id: websiteId,
    },
    select: {
      id: true,
      isActive: true,
    },
  });

  if (!website) {
    throw new Error("Website not found.");
  }

  if (!website.isActive) {
    throw new Error("Website is inactive.");
  }

  return website;
}

/**
 * ============================================================
 * Product filtering
 * ============================================================
 */

function buildWhere(
  websiteId: string,
  filters: ProductFilters
): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {
    websiteId,
  };

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.category) {
    where.category = filters.category;
  }

  if (filters.search) {
    const search = filters.search.trim();

    if (search) {
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
  }

  return where;
}

/**
 * ============================================================
 * Featured image validation
 * ============================================================
 *
 * A Product may only use Media belonging to the same Website.
 * This prevents cross-tenant media references.
 */

async function validateFeaturedImage(
  websiteId: string,
  featuredImageId?: string | null
) {
  if (!featuredImageId) {
    return null;
  }

  const media = await prisma.media.findFirst({
    where: {
      id: featuredImageId,
      websiteId,
    },
  });

  if (!media) {
    throw new Error(
      "Selected featured image does not exist in this Website."
    );
  }

  if (media.isDeleted) {
    throw new Error("Selected featured image has been deleted.");
  }

  return media;
}

/**
 * ============================================================
 * Specification document validation
 * ============================================================
 *
 * A Product may only use a DOCUMENT Media record belonging to
 * the same Website. This prevents cross-tenant document
 * references and prevents deleted media from being assigned.
 */
async function validateSpecificationDocument(
  websiteId: string,
  specificationDocumentId?: string | null
) {
  if (!specificationDocumentId) {
    return null;
  }

  const media = await prisma.media.findFirst({
    where: {
      id: specificationDocumentId,
      websiteId,
    },
  });

  if (!media) {
    throw new Error(
      "Selected specification document does not exist in this Website."
    );
  }

  if (media.isDeleted) {
    throw new Error(
      "Selected specification document has been deleted."
    );
  }

  if (
    media.mediaType !== "DOCUMENT" &&
    media.mediaType !== "IMAGE"
  ) {
    throw new Error(
      "Selected specification file must be an image or document."
    );
  }

  return media;
}

/**
 * ============================================================
 * List Products
 * ============================================================
 */

export async function listProducts(
  websiteId: string,
  filters: ProductFilters = {}
) {
  await ensureWebsiteExists(websiteId);

  const page = Math.max(
    DEFAULT_PAGE,
    filters.page ?? DEFAULT_PAGE
  );

  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(
      1,
      filters.pageSize ?? DEFAULT_PAGE_SIZE
    )
  );

  const skip = (page - 1) * pageSize;

  const where = buildWhere(websiteId, filters);

  const [items, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      include: {
        featuredImage: true,
        specificationDocument: true,
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

/**
 * ============================================================
 * Get Product by ID
 * ============================================================
 */

export async function getProductById(
  websiteId: string,
  id: string
) {
  await ensureWebsiteExists(websiteId);

  return prisma.product.findFirst({
    where: {
      id,
      websiteId,
    },
    include: {
      featuredImage: true,
      specificationDocument: true,
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

/**
 * ============================================================
 * Get Product by SKU
 * ============================================================
 *
 * SKU is now unique within a Website, not globally.
 */

export async function getProductBySku(
  websiteId: string,
  sku: string
) {
  await ensureWebsiteExists(websiteId);

  return prisma.product.findFirst({
    where: {
      websiteId,
      sku,
    },
  });
}

/**
 * ============================================================
 * Get Product by Slug
 * ============================================================
 *
 * Slug is now unique within a Website, not globally.
 */

export async function getProductBySlug(
  websiteId: string,
  slug: string
) {
  await ensureWebsiteExists(websiteId);

  return prisma.product.findFirst({
    where: {
      websiteId,
      slug,
    },
    include: {
      featuredImage: true,
      specificationDocument: true,
      pricing: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}

/**
 * ============================================================
 * Create Product
 * ============================================================
 */

export async function createProduct(
  websiteId: string,
  data: CreateProductInput
) {
  await ensureWebsiteExists(websiteId);

  const existingSku = await getProductBySku(
    websiteId,
    data.sku
  );

  if (existingSku) {
    throw new Error(
      "Product SKU already exists in this Website."
    );
  }

  const existingSlug = await getProductBySlug(
    websiteId,
    data.slug
  );

  if (existingSlug) {
    throw new Error(
      "Product slug already exists in this Website."
    );
  }

  await validateFeaturedImage(
    websiteId,
    data.featuredImageId
  );

  await validateSpecificationDocument(
    websiteId,
    data.specificationDocumentId
  );

  return prisma.product.create({
    data: {
      website: {
        connect: {
          id: websiteId,
        },
      },

      sku: data.sku,
      name: data.name,
      slug: data.slug,

      shortDescription:
        data.shortDescription || null,

      description:
        data.description || null,

      category:
        data.category || null,

      origin:
        data.origin || null,

      hsCode:
        data.hsCode || null,

      defaultUnit:
        data.defaultUnit,

      minOrderQty:
        data.minOrderQty !== undefined
          ? new Prisma.Decimal(data.minOrderQty)
          : null,

      maxOrderQty:
        data.maxOrderQty !== undefined
          ? new Prisma.Decimal(data.maxOrderQty)
          : null,

      status:
        data.status,

      featuredImage:
        data.featuredImageId
          ? {
              connect: {
                id: data.featuredImageId,
              },
            }
          : undefined,

      specificationDocument:
        data.specificationDocumentId
          ? {
              connect: {
                id: data.specificationDocumentId,
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

/**
 * ============================================================
 * Update Product
 * ============================================================
 */

export async function updateProduct(
  websiteId: string,
  id: string,
  data: UpdateProductInput
) {
  await ensureWebsiteExists(websiteId);

  const existing = await prisma.product.findFirst({
    where: {
      id,
      websiteId,
    },
  });

  if (!existing) {
    throw new Error("Product not found.");
  }

  if (
    data.sku !== undefined &&
    data.sku !== existing.sku
  ) {
    const skuExists = await getProductBySku(
      websiteId,
      data.sku
    );

    if (skuExists) {
      throw new Error(
        "Product SKU already exists in this Website."
      );
    }
  }

  if (
    data.slug !== undefined &&
    data.slug !== existing.slug
  ) {
    const slugExists = await getProductBySlug(
      websiteId,
      data.slug
    );

    if (slugExists) {
      throw new Error(
        "Product slug already exists in this Website."
      );
    }
  }

  if (data.featuredImageId !== undefined) {
    await validateFeaturedImage(
      websiteId,
      data.featuredImageId
    );
  }

  if (data.specificationDocumentId !== undefined) {
    await validateSpecificationDocument(
      websiteId,
      data.specificationDocumentId
    );
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
        shortDescription:
          data.shortDescription || null,
      }),

      ...(data.description !== undefined && {
        description:
          data.description || null,
      }),

      ...(data.category !== undefined && {
        category:
          data.category || null,
      }),

      ...(data.origin !== undefined && {
        origin:
          data.origin || null,
      }),

      ...(data.hsCode !== undefined && {
        hsCode:
          data.hsCode || null,
      }),

      ...(data.defaultUnit !== undefined && {
        defaultUnit:
          data.defaultUnit,
      }),

      ...(data.minOrderQty !== undefined && {
        minOrderQty:
          data.minOrderQty === null
            ? null
            : new Prisma.Decimal(
                data.minOrderQty
              ),
      }),

      ...(data.maxOrderQty !== undefined && {
        maxOrderQty:
          data.maxOrderQty === null
            ? null
            : new Prisma.Decimal(
                data.maxOrderQty
              ),
      }),

      ...(data.status !== undefined && {
        status:
          data.status,
      }),

      ...(data.featuredImageId !== undefined && {
        featuredImage:
          data.featuredImageId
            ? {
                connect: {
                  id: data.featuredImageId,
                },
              }
            : {
                disconnect: true,
              },
      }),

      ...(data.specificationDocumentId !== undefined && {
        specificationDocument:
          data.specificationDocumentId
            ? {
                connect: {
                  id: data.specificationDocumentId,
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

/**
 * ============================================================
 * Delete Product
 * ============================================================
 */

export async function deleteProduct(
  websiteId: string,
  id: string
) {
  await ensureWebsiteExists(websiteId);

  const existing = await prisma.product.findFirst({
    where: {
      id,
      websiteId,
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
      specificationDocument: true,
    },
  });
}

/**
 * ============================================================
 * List Product Categories
 * ============================================================
 */

export async function listProductCategories(
  websiteId: string
) {
  await ensureWebsiteExists(websiteId);

  const categories =
    await prisma.product.findMany({
      where: {
        websiteId,
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
    .filter(
      (c): c is string => Boolean(c)
    );
}