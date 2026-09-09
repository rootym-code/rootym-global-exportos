/**
 * ============================================================
 * ROOTYM Global ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the public ROOTYM Product catalogue API
 *          using Website-scoped Product data.
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

import { ProductStatus } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";
import { listProducts } from "@/lib/services/product.service";

const ROOTYM_WEBSITE_SLUG = "rootym-agro";

export async function GET(request: NextRequest) {
  try {
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
    const pageSize = Number(searchParams.get("pageSize") ?? "100");

    const result = await listProducts(website.id, {
      search,
      category,
      status: status ?? ProductStatus.PUBLISHED,
      page,
      pageSize,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("GET /api/products", error);

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