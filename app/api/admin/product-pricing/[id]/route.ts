/**
 * ============================================================
 * ROOTYM Global ExportOS
 * ============================================================
 * Author      : Prem Singh
 * Module      : Admin Product Pricing API
 * Feature     : Website-scoped Product Pricing
 * File        : app/api/admin/product-pricing/[id]/route.ts
 * Purpose     : Provides authenticated Admin API operations
 *               for Product Pricing within the ROOTYM Website
 *               context.
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

import { authenticateAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  deleteProductPricing,
  getProductPricingById,
  updateProductPricing,
} from "@/lib/services/product-pricing.service";
import { updateProductPricingSchema } from "@/lib/validations/product-pricing";

const ROOTYM_WEBSITE_SLUG = "rootym-agro";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

async function getRootymWebsiteId() {
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
    throw new Error(
      "ROOTYM Website is not available."
    );
  }

  return website.id;
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

    const websiteId =
      await getRootymWebsiteId();

    const { id } = await params;

    const pricing =
      await getProductPricingById(
        websiteId,
        id
      );

    if (!pricing) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Pricing record not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: pricing,
    });
  } catch (error) {
    console.error(
      "GET /api/admin/product-pricing/[id]",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to fetch pricing record.",
      },
      { status: 500 }
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

    const websiteId =
      await getRootymWebsiteId();

    const { id } = await params;

    const body = await request.json();

    const parsed =
      updateProductPricingSchema.safeParse(
        body
      );

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Validation failed.",
          errors:
            parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const pricing =
      await updateProductPricing(
        websiteId,
        id,
        parsed.data
      );

    return NextResponse.json({
      success: true,
      message:
        "Product pricing updated successfully.",
      data: pricing,
    });
  } catch (error) {
    console.error(
      "PUT /api/admin/product-pricing/[id]",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unable to update pricing.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 400 }
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

    const websiteId =
      await getRootymWebsiteId();

    const { id } = await params;

    const pricing =
      await getProductPricingById(
        websiteId,
        id
      );

    if (!pricing) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Pricing record not found.",
        },
        { status: 404 }
      );
    }

    await deleteProductPricing(
      websiteId,
      id
    );

    return NextResponse.json({
      success: true,
      message:
        "Product pricing deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE /api/admin/product-pricing/[id]",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unable to delete pricing.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 400 }
    );
  }
}