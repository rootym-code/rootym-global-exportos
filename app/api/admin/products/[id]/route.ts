/**
 * ============================================================
 * ROOTYM Global ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides authenticated Admin Product retrieval,
 *          update, and deletion using the current ROOTYM
 *          Website context.
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

import { authenticateAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  deleteProduct,
  getProductById,
  updateProduct,
} from "@/lib/services/product.service";
import { updateProductSchema } from "@/lib/validations/product";

const ROOTYM_WEBSITE_SLUG = "rootym-agro";

interface RouteContext {
  params: Promise<{ id: string }>;
}

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

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
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

    const { id } = await params;

    const product = await getProductById(
      website.id,
      id
    );

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(
      "GET /api/admin/products/[id]",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch product.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
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

    const { id } = await params;
    const body = await request.json();

    const parsed = updateProductSchema.safeParse(body);

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

    const product = await updateProduct(
      website.id,
      id,
      parsed.data
    );

    return NextResponse.json({
      success: true,
      message: "Product updated successfully.",
      data: product,
    });
  } catch (error) {
    console.error(
      "PUT /api/admin/products/[id]",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unable to update product.";

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

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
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

    const { id } = await params;

    await deleteProduct(
      website.id,
      id
    );

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE /api/admin/products/[id]",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unable to delete product.";

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