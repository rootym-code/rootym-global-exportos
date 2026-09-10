/**
 * ============================================================
 * Customer Website Product Detail
 * ============================================================
 * Author: Prem Singh
 * Module      : Public Website
 * Feature     : Customer Website Product Detail
 * Purpose     : Displays a Website-scoped Product with its
 *               active pricing and Buyer Specification Sheet
 *               using tenant-neutral customer-facing content.
 * ============================================================
 */

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import {
  ArrowLeft,
  MapPin,
  Package,
  Ship,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { getProductBySlug } from "@/lib/services/product.service";
import { getActiveProductPrice } from "@/lib/services/product-pricing.service";
import prisma from "@/lib/prisma";

type PageProps = {
  params: Promise<{
    websiteSlug: string;
    locale: string;
    slug: string;
  }>;
};

/**
 * ============================================================
 * PUBLIC CUSTOMER WEBSITE PRODUCT METADATA
 * ============================================================
 */

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { websiteSlug, slug } = await params;

  const website = await prisma.website.findUnique({
    where: {
      slug: websiteSlug,
    },

    select: {
      id: true,
      name: true,
      isActive: true,

      configuration: {
        select: {
          websiteTitle: true,
          websiteDescription: true,
        },
      },

      tenant: {
        select: {
          businessProfile: {
            select: {
              businessName: true,
              description: true,
            },
          },
        },
      },
    },
  });

  if (!website || !website.isActive) {
    return {};
  }

  const product = await getProductBySlug(website.id, slug);

  if (!product) {
    return {};
  }

  const websiteTitle =
    website.configuration?.websiteTitle?.trim() ||
    website.tenant.businessProfile?.businessName?.trim() ||
    website.name;

  const websiteDescription =
    website.configuration?.websiteDescription?.trim() ||
    website.tenant.businessProfile?.description?.trim() ||
    undefined;

  return {
    title: `${product.name} | ${websiteTitle}`,
    description:
      product.description?.trim() ||
      websiteDescription ||
      `Discover ${product.name} from ${websiteTitle}.`,
  };
}

/**
 * ============================================================
 * PRODUCT IMAGE RESOLVER
 * ============================================================
 */

function getProductImageUrl(fileUrl?: string | null) {
  if (!fileUrl) {
    return "/images/products/placeholder.png";
  }

  if (fileUrl.startsWith("http")) {
    return fileUrl;
  }

  return `${process.env.NEXT_PUBLIC_SITE_URL}${fileUrl}`;
}

/**
 * ============================================================
 * PRODUCT PRICE FORMATTER
 * ============================================================
 *
 * FIXED pricing:
 *   Displays the configured currency and price.
 *
 * MARKET pricing:
 *   Displays the configured price when one exists.
 *   Otherwise displays Price on Request.
 *
 * No active pricing:
 *   Displays Price on Request.
 * ============================================================
 */

function formatPrice(
  pricing: Awaited<ReturnType<typeof getActiveProductPrice>>,
) {
  if (!pricing) {
    return "Price on Request";
  }

  if (
    pricing.price !== null &&
    pricing.price !== undefined
  ) {
    const price = Number(pricing.price);

    if (!Number.isNaN(price)) {
      return `${pricing.currency} ${price.toFixed(2)}`;
    }
  }

  return "Price on Request";
}

/**
 * ============================================================
 * PUBLIC CUSTOMER WEBSITE PRODUCT PAGE
 * ============================================================
 */

export default async function CustomerWebsiteProductPage({
  params,
}: PageProps) {
  const { websiteSlug, locale, slug } = await params;

  /**
   * ------------------------------------------------------------
   * Resolve Website
   * ------------------------------------------------------------
   */

  const website = await prisma.website.findUnique({
    where: {
      slug: websiteSlug,
    },

    select: {
      id: true,
      name: true,
      isActive: true,
    },
  });

  if (!website || !website.isActive) {
    notFound();
  }

  /**
   * ------------------------------------------------------------
   * Resolve Product within the Website boundary
   * ------------------------------------------------------------
   *
   * Products are Website-owned.
   *
   * The current Website is therefore always part of the
   * Product lookup to prevent products from another Website
   * from being exposed.
   * ------------------------------------------------------------
   */

  const product = await getProductBySlug(
    website.id,
    slug,
  );

  if (!product) {
    notFound();
  }

  /**
   * ------------------------------------------------------------
   * Resolve active Website-scoped Product Pricing
   * ------------------------------------------------------------
   */

  const activePricing = await getActiveProductPrice(
    website.id,
    product.id,
  );

  /**
   * ------------------------------------------------------------
   * Product Presentation Data
   * ------------------------------------------------------------
   */

  const imageUrl = getProductImageUrl(
    product.featuredImage?.fileUrl,
  );

  const description =
    product.description?.trim() ||
    "Product information is available on request.";

  const packaging = product.defaultUnit
    ? `Available in ${product.defaultUnit} units`
    : "Packaging information available on request";

  const availability =
    "Availability subject to confirmation";

  const priceDisplay =
    formatPrice(activePricing);

  /**
   * ------------------------------------------------------------
   * Buyer Specification Sheet
   * ------------------------------------------------------------
   *
   * The specification document is loaded from the current
   * Website-scoped Product. Only a non-deleted Media record
   * with a usable file URL is exposed to the customer.
   * ------------------------------------------------------------
   */

  const specificationDocument =
    product.specificationDocument &&
    !product.specificationDocument.isDeleted &&
    Boolean(product.specificationDocument.fileUrl)
      ? product.specificationDocument
      : null;

  /**
   * ------------------------------------------------------------
   * Customer Website Navigation
   * ------------------------------------------------------------
   */

  const productsHref =
    `/website/${websiteSlug}/${locale}/products`;

  /**
   * ------------------------------------------------------------
   * Tenant Request Quote route
   * ------------------------------------------------------------
   *
   * Keep the buyer inside the current Website and carry the
   * Product ID so the Request Quote page can preselect the
   * Product that the buyer is enquiring about.
   * ------------------------------------------------------------
   */

  const requestQuoteHref =
    `/website/${websiteSlug}/${locale}/request-quote?productId=${encodeURIComponent(product.id)}`;

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-7xl px-6 py-14">
        <Link
          href={productsHref}
          className="mb-10 inline-flex items-center gap-2 text-[#2E7D32] hover:underline"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Products
        </Link>

        <div className="grid gap-14 lg:grid-cols-2">
          {/* ==================================================
              LEFT
              ================================================== */}

          <div className="rounded-3xl bg-white p-8 shadow-xl">
            <div className="relative aspect-square">
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain"
                priority
                unoptimized
              />
            </div>
          </div>

          {/* ==================================================
              RIGHT
              ================================================== */}

          <div>
            <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-[#2E7D32]">
              {product.category ?? "Product"}
            </span>

            <h1 className="mt-6 text-5xl font-bold text-gray-900">
              {product.name}
            </h1>

            <p className="mt-4 text-lg leading-8 text-gray-600">
              {description}
            </p>

            {/* ==================================================
                PRODUCT PRICING
                ================================================== */}

            <div className="mt-8 rounded-2xl bg-white p-6 shadow-md">
              <p className="text-sm font-medium text-gray-500">
                Price
              </p>

              <p className="mt-2 text-3xl font-bold text-[#2E7D32]">
                {priceDisplay}
              </p>

              {activePricing?.pricingType === "MARKET" && (
                <p className="mt-2 text-sm text-gray-500">
                  Latest market pricing may vary.
                </p>
              )}

              {activePricing?.pricingType === "FIXED" &&
                product.defaultUnit && (
                  <p className="mt-2 text-sm text-gray-500">
                    Per {product.defaultUnit}
                  </p>
                )}

              {!activePricing && (
                <p className="mt-2 text-sm text-gray-500">
                  Contact us for the latest quotation.
                </p>
              )}
            </div>

            {/* ==================================================
                PRODUCT INFORMATION
                ================================================== */}

            <div className="mt-10 space-y-5">
              <InfoRow
                icon={<MapPin className="h-5 w-5" />}
                title="Origin"
                value={
                  product.origin?.trim() ||
                  "Origin not specified"
                }
              />

              <InfoRow
                icon={<Package className="h-5 w-5" />}
                title="Packaging"
                value={packaging}
              />

              <InfoRow
                icon={<Ship className="h-5 w-5" />}
                title="Availability"
                value={availability}
              />
            </div>

            {/* ==================================================
                PRODUCT IDENTIFIERS
                ================================================== */}

            {product.hsCode && (
              <div className="mt-10">
                <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700">
                  HS Code: {product.hsCode}
                </span>
              </div>
            )}

            {/* ==================================================
                ACTIONS
                ================================================== */}

            <div className="mt-12 flex flex-col gap-4 sm:flex-row">
              <Link href={requestQuoteHref}>
                <Button>
                  Request Quotation
                </Button>
              </Link>

              {specificationDocument && (
                <a
                  href={specificationDocument.fileUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition hover:bg-gray-50"
                >
                  Download Specification
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/**
 * ============================================================
 * INFORMATION ROW
 * ============================================================
 */

function InfoRow({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm">
      <div className="text-[#2E7D32]">
        {icon}
      </div>

      <div>
        <p className="text-sm text-gray-500">
          {title}
        </p>

        <p className="font-semibold text-gray-900">
          {value}
        </p>
      </div>
    </div>
  );
}