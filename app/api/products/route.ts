import { NextResponse } from "next/server";
import { ProductStatus } from "@/lib/generated/prisma";

import { listProducts } from "@/lib/services/product.service";

export async function GET() {
  try {
    const result = await listProducts({
      status: ProductStatus.PUBLISHED,
      page: 1,
      pageSize: 100,
    });

    const products = result.items.map((product) => ({
      id: product.id,
      sku: product.sku,
      name: product.name,
      slug: product.slug,

      shortDescription: product.shortDescription,
      description: product.description,

      category: product.category,
      origin: product.origin,
      hsCode: product.hsCode,

      defaultUnit: product.defaultUnit,
      minOrderQty: product.minOrderQty,
      maxOrderQty: product.maxOrderQty,

      featuredImage: product.featuredImage
        ? {
            id: product.featuredImage.id,
            fileName: product.featuredImage.fileName,
            fileUrl: product.featuredImage.fileUrl,
            altText: product.featuredImage.altText,
            title: product.featuredImage.title,
          }
        : null,

      pricing: product.pricing,

      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      data: products,
    });
    return NextResponse.json({
        success: true,
        data: products,
      });
    } catch (error) {
      console.error(
        "GET /api/products",
        error
      );
  
      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to fetch products.",
        },
        {
          status: 500,
        }
      );
    }
  }
  
   