/**
 * ============================================================
 * ROOTYM Global ExportOS
 * ============================================================
 * Author: Prem Singh
 *
 * Purpose:
 * Provides authenticated Admin Product listing and creation.
 *
 * Tenant filtering:
 * - No tenantId = preserve existing ROOTYM website behaviour.
 * - tenantId provided = resolve that tenant's active website.
 *
 * Important:
 * Product service remains Website-scoped.
 * Tenant filtering is therefore resolved to Website ID here.
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";
import { ProductStatus } from "@/lib/generated/prisma";

import { authenticateAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createProductSchema } from "@/lib/validations/product";

import {
  createProduct,
  listProducts,
} from "@/lib/services/product.service";

const ROOTYM_WEBSITE_SLUG = "rootym-agro";

/**
 * ------------------------------------------------------------
 * Resolve the website used by Admin Products.
 *
 * Existing behaviour:
 * Admin Products operated against the ROOTYM website.
 *
 * New behaviour:
 * If tenantId is supplied, resolve the website belonging to
 * that tenant instead.
 * ------------------------------------------------------------
 */
async function getAdminWebsite(tenantId?: string) {
  if (tenantId) {
    const tenant = await prisma.tenant.findUnique({
      where: {
        id: tenantId,
      },
      select: {
        id: true,
        isActive: true,
        website: {
          select: {
            id: true,
            isActive: true,
          },
        },
      },
    });

    if (
      !tenant ||
      !tenant.isActive ||
      !tenant.website ||
      !tenant.website.isActive
    ) {
      return null;
    }

    return tenant.website;
  }

  /**
   * ----------------------------------------------------------
   * No tenant selected.
   *
   * Preserve the original Admin Products behaviour.
   * ----------------------------------------------------------
   */
  const website = await prisma.website.findUnique({
    where: {
      slug: ROOTYM_WEBSITE_SLUG,
    },
    select: {
      id: true,
      isActive: true,
    },
  });

  if (!website || !website.isActive) {
    return null;
  }

  return website;
}

/**
 * ============================================================
 * GET — Admin Product Listing
 * ============================================================
 */
export async function GET(request: NextRequest) {
  try {
    /**
     * ----------------------------------------------------------
     * 1. Authenticate Admin
     * ----------------------------------------------------------
     */
    const auth = await authenticateAdmin(request);

    if (!auth.authenticated) {
      return NextResponse.json(
        {
          success: false,
          message: auth.error,
        },
        {
          status: auth.status ?? 401,
        }
      );
    }

    /**
     * ----------------------------------------------------------
     * 2. Read query parameters
     * ----------------------------------------------------------
     */
    const { searchParams } = new URL(request.url);

    const tenantId =
      searchParams.get("tenantId")?.trim() || undefined;

    const search =
      searchParams.get("search")?.trim() || undefined;

    const category =
      searchParams.get("category")?.trim() || undefined;

    const status =
      (searchParams.get("status") as ProductStatus | null) ??
      undefined;

    const pageParam = Number(
      searchParams.get("page") ?? "1"
    );

    const pageSizeParam = Number(
      searchParams.get("pageSize") ?? "20"
    );

    const page =
      Number.isFinite(pageParam) && pageParam > 0
        ? Math.floor(pageParam)
        : 1;

    const pageSize =
      Number.isFinite(pageSizeParam) && pageSizeParam > 0
        ? Math.floor(pageSizeParam)
        : 20;

    /**
     * ----------------------------------------------------------
     * 3. Resolve Website
     * ----------------------------------------------------------
     *
     * Specific tenant:
     *   tenant → website → products
     *
     * No tenant:
     *   ROOTYM website → products
     *
     * This deliberately preserves the previous working
     * behaviour when "All Customers" is selected.
     * ----------------------------------------------------------
     */
    const website = await getAdminWebsite(tenantId);

    if (!website) {
      return NextResponse.json(
        {
          success: false,
          message: tenantId
            ? "Selected customer workspace does not have an active website."
            : "Website is not available.",
        },
        {
          status: 404,
        }
      );
    }

    /**
     * ----------------------------------------------------------
     * 4. Load Products
     * ----------------------------------------------------------
     */
    const result = await listProducts(website.id, {
      search,
      category,
      status,
      page,
      pageSize,
    });

    /**
     * ----------------------------------------------------------
     * 5. Return response
     * ----------------------------------------------------------
     *
     * Keep the existing response contract unchanged.
     */
    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error(
      "GET /api/admin/products error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch products.",
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * ============================================================
 * POST — Admin Product Creation
 * ============================================================
 *
 * Existing ROOTYM Admin creation behaviour is preserved.
 * Tenant-specific product creation can be handled separately
 * after the listing/filter feature is confirmed working.
 * ============================================================
 */
export async function POST(request: NextRequest) {
  try {
    /**
     * ----------------------------------------------------------
     * 1. Authenticate Admin
     * ----------------------------------------------------------
     */
    const auth = await authenticateAdmin(request);

    if (!auth.authenticated) {
      return NextResponse.json(
        {
          success: false,
          message: auth.error,
        },
        {
          status: auth.status ?? 401,
        }
      );
    }

    /**
     * ----------------------------------------------------------
     * 2. Preserve existing ROOTYM website behaviour
     * ----------------------------------------------------------
     */
    const website = await getAdminWebsite();

    if (!website) {
      return NextResponse.json(
        {
          success: false,
          message: "Website is not available.",
        },
        {
          status: 404,
        }
      );
    }

    /**
     * ----------------------------------------------------------
     * 3. Validate request body
     * ----------------------------------------------------------
     */
    const body = await request.json();

    const parsed = createProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed.",
          errors: parsed.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    /**
     * ----------------------------------------------------------
     * 4. Create Product
     * ----------------------------------------------------------
     */
    const product = await createProduct(
      website.id,
      parsed.data
    );

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully.",
        data: product,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "POST /api/admin/products error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unable to create product.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      {
        status: 400,
      }
    );
  }
}