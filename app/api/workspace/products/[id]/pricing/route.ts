/**
 * ============================================================
 * Author: Prem Singh
 * Purpose: Customer Workspace Product Pricing collection API.
 *          Provides Website-scoped pricing retrieval and
 *          creation through the shared Product Pricing service.
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

import {
  createWorkspaceProductPricing,
  listWorkspaceProductPricing,
} from "@/app/lib/workspace/products/product-pricing-workspace.service";

import { createProductPricingSchema } from "@/lib/validations/product-pricing";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

/**
 * ============================================================
 * GET /api/workspace/products/:id/pricing
 * ============================================================
 */
export async function GET(
  _request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID is required.",
        },
        { status: 400 },
      );
    }

    const pricing = await listWorkspaceProductPricing(id);

    return NextResponse.json({
      success: true,
      data: pricing,
    });
  } catch (error) {
    console.error(
      "GET /api/workspace/products/[id]/pricing",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to fetch pricing.",
      },
      { status: 500 },
    );
  }
}

/**
 * ============================================================
 * POST /api/workspace/products/:id/pricing
 *
 * Product ownership is determined by the URL.
 *
 * The authenticated Website is determined by the Workspace
 * context adapter.
 *
 * The request body cannot change the Product association.
 * ============================================================
 */
export async function POST(
  request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID is required.",
        },
        { status: 400 },
      );
    }

    const body = await request.json();

    const parsed = createProductPricingSchema.safeParse({
      ...body,
      productId: id,
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed.",
          errors: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const pricing = await createWorkspaceProductPricing(
      parsed.data,
    );

    return NextResponse.json(
      {
        success: true,
        message: "Product pricing created successfully.",
        data: pricing,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "POST /api/workspace/products/[id]/pricing",
      error,
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
      { status: 400 },
    );
  }
}