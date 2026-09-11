/**
 * ============================================================
 * Author: Prem Singh
 * Purpose: Customer Workspace Product Pricing item API.
 *          Provides Website-scoped pricing retrieval, update,
 *          and deletion through the shared Product Pricing
 *          domain service.
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

import {
  deleteWorkspaceProductPricing,
  getWorkspaceProductPricingById,
  updateWorkspaceProductPricing,
} from "@/app/lib/workspace/products/product-pricing-workspace.service";

import { updateProductPricingSchema } from "@/lib/validations/product-pricing";

interface RouteContext {
  params: Promise<{
    id: string;
    pricingId: string;
  }>;
}

/**
 * ============================================================
 * GET /api/workspace/products/:id/pricing/:pricingId
 * ============================================================
 */
export async function GET(
  _request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const { id, pricingId } = await params;

    if (!id || !pricingId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product ID and Pricing ID are required.",
        },
        { status: 400 },
      );
    }

    const pricing =
      await getWorkspaceProductPricingById(pricingId);

    /*
     * Website ownership is enforced by the shared service.
     * The additional Product ID check protects the nested
     * Workspace route from exposing a pricing record through
     * the wrong Product URL.
     */
    if (!pricing || pricing.productId !== id) {
      return NextResponse.json(
        {
          success: false,
          message: "Pricing record not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: pricing,
    });
  } catch (error) {
    console.error(
      "GET /api/workspace/products/[id]/pricing/[pricingId]",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to fetch pricing record.",
      },
      { status: 500 },
    );
  }
}

/**
 * ============================================================
 * PUT /api/workspace/products/:id/pricing/:pricingId
 * ============================================================
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const { id, pricingId } = await params;

    if (!id || !pricingId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product ID and Pricing ID are required.",
        },
        { status: 400 },
      );
    }

    /*
     * Verify that the pricing record belongs to the Product
     * identified by the nested URL.
     */
    const existing =
      await getWorkspaceProductPricingById(pricingId);

    if (!existing || existing.productId !== id) {
      return NextResponse.json(
        {
          success: false,
          message: "Pricing record not found.",
        },
        { status: 404 },
      );
    }

    const body = await request.json();

    const parsed = updateProductPricingSchema.safeParse(body);

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

    const pricing =
      await updateWorkspaceProductPricing(
        pricingId,
        parsed.data,
      );

    return NextResponse.json({
      success: true,
      message: "Product pricing updated successfully.",
      data: pricing,
    });
  } catch (error) {
    console.error(
      "PUT /api/workspace/products/[id]/pricing/[pricingId]",
      error,
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
      { status: 400 },
    );
  }
}

/**
 * ============================================================
 * DELETE /api/workspace/products/:id/pricing/:pricingId
 * ============================================================
 */
export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const { id, pricingId } = await params;

    if (!id || !pricingId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product ID and Pricing ID are required.",
        },
        { status: 400 },
      );
    }

    /*
     * Verify the nested Product → Pricing relationship before
     * deleting the record.
     */
    const existing =
      await getWorkspaceProductPricingById(pricingId);

    if (!existing || existing.productId !== id) {
      return NextResponse.json(
        {
          success: false,
          message: "Pricing record not found.",
        },
        { status: 404 },
      );
    }

    await deleteWorkspaceProductPricing(pricingId);

    return NextResponse.json({
      success: true,
      message: "Product pricing deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE /api/workspace/products/[id]/pricing/[pricingId]",
      error,
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
      { status: 400 },
    );
  }
}