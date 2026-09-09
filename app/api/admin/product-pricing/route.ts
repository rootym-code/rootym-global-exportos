/**
 * ============================================================
 * ROOTYM Global ExportOS
 * ============================================================
 * Author      : Prem Singh
 * Module      : Admin Product Pricing API
 * Feature     : Website-scoped Product Pricing
 * File        : app/api/admin/product-pricing/route.ts
 * Purpose     : Provides authenticated Admin API operations
 *               for Product Pricing within the ROOTYM Website
 *               context.
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

import { authenticateAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createProductPricingSchema } from "@/lib/validations/product-pricing";
import {
  createProductPricing,
  listProductPricing,
} from "@/lib/services/product-pricing.service";

const ROOTYM_WEBSITE_SLUG = "rootym-agro";

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
    throw new Error("ROOTYM Website is not available.");
  }

  return website.id;
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

    const { searchParams } = new URL(request.url);

    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          message: "productId is required.",
        },
        { status: 400 }
      );
    }

    const websiteId = await getRootymWebsiteId();

    const pricing = await listProductPricing(
      websiteId,
      productId
    );

    return NextResponse.json({
      success: true,
      data: pricing,
    });
  } catch (error) {
    console.error("GET /api/admin/product-pricing", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch pricing.",
      },
      { status: 500 }
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

    const body = await request.json();

    const parsed =
      createProductPricingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed.",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const websiteId = await getRootymWebsiteId();

    const pricing = await createProductPricing(
      websiteId,
      parsed.data
    );

    return NextResponse.json(
      {
        success: true,
        message:
          "Product pricing created successfully.",
        data: pricing,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "POST /api/admin/product-pricing",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unable to create pricing.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 400 }
    );
  }
}