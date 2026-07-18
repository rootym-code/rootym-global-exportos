import { NextRequest, NextResponse } from "next/server";

import { authenticateAdmin } from "@/lib/auth";
import {
  deleteProductPricing,
  getProductPricingById,
  updateProductPricing,
} from "@/lib/services/product-pricing.service";
import { updateProductPricingSchema } from "@/lib/validations/product-pricing";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
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

    const { id } = await params;

    const pricing = await getProductPricingById(id);

    if (!pricing) {
      return NextResponse.json(
        {
          success: false,
          message: "Pricing record not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: pricing,
    });
  } catch (error) {
    console.error("GET /api/admin/product-pricing/[id]", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch pricing record.",
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

    const { id } = await params;

    const body = await request.json();

    const parsed = updateProductPricingSchema.safeParse(body);

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

    const pricing = await updateProductPricing(id, parsed.data);

    return NextResponse.json({
      success: true,
      message: "Product pricing updated successfully.",
      data: pricing,
    });
  } catch (error) {
    console.error("PUT /api/admin/product-pricing/[id]", error);

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

    const { id } = await params;

    const pricing = await getProductPricingById(id);

    if (!pricing) {
      return NextResponse.json(
        {
          success: false,
          message: "Pricing record not found.",
        },
        { status: 404 }
      );
    }

    await deleteProductPricing(id);

    return NextResponse.json({
      success: true,
      message: "Product pricing deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE /api/admin/product-pricing/[id]", error);

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