/**
 * ============================================================
 * ROOTYM Global ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Customer Workspace Product collection API.
 *          Provides Website-scoped Product listing and creation
 *          through the shared Product domain service.
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

import {
  createWorkspaceProduct,
  listWorkspaceProducts,
} from "@/app/lib/workspace/products/product-workspace.service";

import {
  createProductSchema,
  productStatusSchema,
} from "@/lib/validations/product";

/**
 * ============================================================
 * GET /api/workspace/products
 *
 * Lists Products belonging to the Website connected to the
 * authenticated Customer Workspace.
 *
 * Supported query parameters:
 * - search
 * - category
 * - status
 * - page
 * - pageSize
 * ============================================================
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() || undefined;
    const category = searchParams.get("category")?.trim() || undefined;

    const statusParam = searchParams.get("status")?.trim() || undefined;

    let status;

    if (statusParam) {
      const parsedStatus = productStatusSchema.safeParse(statusParam);

      if (!parsedStatus.success) {
        return NextResponse.json(
          {
            error: "Invalid product status.",
            details: parsedStatus.error.flatten(),
          },
          { status: 400 },
        );
      }

      status = parsedStatus.data;
    }

    const pageValue = Number(searchParams.get("page") || "1");
    const pageSizeValue = Number(searchParams.get("pageSize") || "20");

    const page =
      Number.isFinite(pageValue) && pageValue > 0
        ? Math.floor(pageValue)
        : 1;

    const pageSize =
      Number.isFinite(pageSizeValue) && pageSizeValue > 0
        ? Math.min(Math.floor(pageSizeValue), 100)
        : 20;

    const result = await listWorkspaceProducts({
      search,
      category,
      status,
      page,
      pageSize,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(
      "[Workspace Products GET] Failed to list products:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load products.",
      },
      { status: 500 },
    );
  }
}

/**
 * ============================================================
 * POST /api/workspace/products
 *
 * Creates a Product for the Website connected to the
 * authenticated Customer Workspace.
 *
 * Website ownership is derived server-side.
 * ============================================================
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = createProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product data.",
          errors: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const product = await createWorkspaceProduct(parsed.data);

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully.",
        data: product,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "[Workspace Products POST] Failed to create product:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create product.",
      },
      { status: 500 },
    );
  }
}
