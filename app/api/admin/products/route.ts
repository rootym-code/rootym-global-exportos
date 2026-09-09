/**
 * ============================================================
 * ROOTYM Global ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides authenticated Admin Product listing and
 *          creation using the current ROOTYM Website context.
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

async function getAdminWebsite() {
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

export async function GET(request: NextRequest) {
  try {
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

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") ?? undefined;
    const category = searchParams.get("category") ?? undefined;
    const status =
      (searchParams.get("status") as ProductStatus | null) ?? undefined;

    const page = Number(searchParams.get("page") ?? "1");
    const pageSize = Number(searchParams.get("pageSize") ?? "20");

    const result = await listProducts(website.id, {
      search,
      category,
      status,
      page,
      pageSize,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("GET /api/admin/products", error);

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

export async function POST(request: NextRequest) {
  try {
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
    console.error("POST /api/admin/products", error);

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