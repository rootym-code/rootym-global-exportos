
import { NextRequest, NextResponse } from "next/server";

import { ProductStatus } from "@/lib/generated/prisma";
import {
  listProducts,
  getProductById,
} from "@/lib/services/product.service";
import {
  resolveRCaptainContext,
} from "@/lib/services/rcaptain/context.service";

type BuyerQuoteAction =
  | "list_products"
  | "compare_products";

function serializeProduct(product: {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  category: string | null;
  origin: string | null;
  defaultUnit: string;
  minOrderQty: unknown;
  maxOrderQty: unknown;
  featuredImage: { fileUrl: string } | null;
}) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription,
    description: product.description,
    category: product.category,
    origin: product.origin,
    defaultUnit: product.defaultUnit,
    minOrderQty:
      product.minOrderQty == null
        ? null
        : String(product.minOrderQty),
    maxOrderQty:
      product.maxOrderQty == null
        ? null
        : String(product.maxOrderQty),
    imageUrl: product.featuredImage?.fileUrl ?? null,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "A valid request body is required.",
        },
        { status: 400 },
      );
    }

    const input = body as Record<string, unknown>;

    const action = input.action;

    if (
      action !== "list_products" &&
      action !== "compare_products"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Unsupported buyer-quote action.",
        },
        { status: 400 },
      );
    }

    const websiteSlug =
      typeof input.websiteSlug === "string" &&
      input.websiteSlug.trim()
        ? input.websiteSlug.trim()
        : undefined;

    const hostname =
      request.headers
        .get("host")
        ?.split(":")[0]
        .trim()
        .toLowerCase() || undefined;

    const context = await resolveRCaptainContext({
      mode: "BUYER",
      websiteSlug,
      websiteHostname: websiteSlug ? undefined : hostname,
    });

    if (!context.website) {
      return NextResponse.json(
        {
          success: false,
          message: "Website context is required.",
        },
        { status: 400 },
      );
    }

    if (action === "list_products") {
      const result = await listProducts(
        context.website.id,
        {
          status: ProductStatus.PUBLISHED,
          page: 1,
          pageSize: 100,
        },
      );

      return NextResponse.json({
        success: true,
        action,
        products: result.items.map(serializeProduct),
        pagination: result.pagination,
      });
    }

    const productIds = input.productIds;

    if (
      !Array.isArray(productIds) ||
      productIds.length < 2 ||
      productIds.length > 10 ||
      !productIds.every(
        (id) => typeof id === "string" && id.trim().length > 0,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Select between 2 and 10 valid product IDs to compare.",
        },
        { status: 400 },
      );
    }

    const uniqueProductIds = [...new Set(productIds)];

    if (uniqueProductIds.length !== productIds.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Duplicate product IDs are not allowed.",
        },
        { status: 400 },
      );
    }

    const products = await Promise.all(
      uniqueProductIds.map((id) =>
        getProductById(context.website!.id, id as string),
      ),
    );

    if (
      products.some(
        (product) =>
          !product ||
          product.status !== ProductStatus.PUBLISHED,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "One or more selected products are unavailable.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      action,
      products: products.map((product) =>
        serializeProduct(product!),
      ),
    });
  } catch (error) {
    console.error("R-CAPTAIN buyer-quote API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to process the buyer-quote request.",
      },
      { status: 500 },
    );
  }
}
