/**
 * ============================================================
 * Author: Prem Singh
 * Purpose: Customer Workspace Product item API.
 *          Provides Website-scoped Product retrieval, update,
 *          and deletion through the shared Product domain
 *          service.
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

import {
  deleteWorkspaceProduct,
  getWorkspaceProductById,
  updateWorkspaceProduct,
} from "@/app/lib/workspace/products/product-workspace.service";

import { updateProductSchema } from "@/lib/validations/product";

/**
 * ============================================================
 * GET /api/workspace/products/:id
 * ============================================================
 */
export async function GET(
  _request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required." },
        { status: 400 },
      );
    }

    const product = await getWorkspaceProductById(id);

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error(
      "[Workspace Products GET] Failed to load product:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load product.",
      },
      { status: 500 },
    );
  }
}

/**
 * ============================================================
 * PUT /api/workspace/products/:id
 *
 * Updates a Product belonging to the Website connected to the
 * authenticated Customer Workspace.
 * ============================================================
 */
export async function PUT(
  request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required." },
        { status: 400 },
      );
    }

    const body = await request.json();

    const parsed = updateProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid product data.",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const product = await updateWorkspaceProduct(id, parsed.data);

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error(
      "[Workspace Products PUT] Failed to update product:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update product.",
      },
      { status: 500 },
    );
  }
}

/**
 * ============================================================
 * DELETE /api/workspace/products/:id
 * ============================================================
 */
export async function DELETE(
  _request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required." },
        { status: 400 },
      );
    }

    await deleteWorkspaceProduct(id);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "[Workspace Products DELETE] Failed to delete product:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete product.",
      },
      { status: 500 },
    );
  }
}