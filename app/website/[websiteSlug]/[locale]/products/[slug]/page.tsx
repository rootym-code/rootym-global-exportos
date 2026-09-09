/**
 * ============================================================
 * ROOTYM Customer Website Product Detail
 * ============================================================
 * Author: Prem Singh
 * Module      : Public Website
 * Feature     : Customer Website Product Detail
 * Purpose     : Reuses the existing premium Product Detail
 *               experience inside a tenant Website while
 *               displaying Website-scoped active Product Pricing
 *               and an available Buyer Specification Sheet.
 * ============================================================
 */

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import {
  ArrowLeft,
  BadgeCheck,
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
 * PRODUCT SPECIFICATION DOCUMENT
 * ============================================================
 *
 * The specification is owned by the Website-scoped Product and
 * resolved from its linked Media record. No product-name mapping
 * or hard-coded public download path is used.
 * ============================================================
 */

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
  pricing: Awaited<ReturnType<typeof getActiveProductPrice>>
) {
  if (!pricing) {
    return "Price on Request";
  }

  if (pricing.price !== null && pricing.price !== undefined) {
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

  const product = await getProductBySlug(website.id, slug);

  if (!product) {
    notFound();
  }

  /**
   * ------------------------------------------------------------
   * Resolve active Website-scoped Product Pricing
   * ------------------------------------------------------------
   *
   * Only an active pricing record belonging to this Website
   * and Product is eligible for display.
   *
   * The pricing service also evaluates the pricing validity
   * period using validFrom and validTo.
   * ------------------------------------------------------------
   */

  const activePricing = await getActiveProductPrice(
    website.id,
    product.id
  );

  /**
   * ------------------------------------------------------------
   * Product Presentation Data
   * ------------------------------------------------------------
   */

  const imageUrl = getProductImageUrl(
    product.featuredImage?.fileUrl
  );

  const description =
    product.description ??
    "Premium export-quality agricultural product sourced directly from trusted farms across India and prepared for international markets with strict quality control.";

  const packaging = product.defaultUnit
    ? `Available in ${product.defaultUnit} units`
    : "Export packaging available";

  const availability = "Available for Export";

  const priceDisplay = formatPrice(activePricing);

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
   * Request Quote uses the existing locale-scoped
   * Request Quote page.
   *
   * Example:
   * /en/request-quote
   * ------------------------------------------------------------
   */

  const requestQuoteHref =
    `/${locale}/request-quote`;

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
              {product.category ?? "Agricultural Product"}
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
                value={product.origin ?? "India"}
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
                PRODUCT BADGES
                ================================================== */}

            <div className="mt-10 flex flex-wrap gap-3">
              <Badge text="APEDA Registered" />

              <Badge text="Export Ready" />

              <Badge text="Premium Quality" />

              <Badge text="Global Logistics" />

              {product.hsCode && (
                <Badge
                  text={`HS Code: ${product.hsCode}`}
                />
              )}
            </div>

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

            {/* ==================================================
                WHY ROOTYM
                ================================================== */}

            <div className="mt-12 rounded-2xl bg-white p-6 shadow">
              <div className="flex items-center gap-3">
                <BadgeCheck className="h-6 w-6 text-[#2E7D32]" />

                <h3 className="text-lg font-semibold">
                  Why Buy From ROOTYM?
                </h3>
              </div>

              <ul className="mt-5 space-y-3 text-gray-600">
                <li>
                  ✓ Direct sourcing from trusted farmers
                </li>

                <li>
                  ✓ Export documentation assistance
                </li>

                <li>
                  ✓ Quality inspection before shipment
                </li>

                <li>
                  ✓ Worldwide logistics support
                </li>

                <li>
                  ✓ Dedicated importer assistance
                </li>
              </ul>
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

/**
 * ============================================================
 * PRODUCT BADGE
 * ============================================================
 */

function Badge({
  text,
}: {
  text: string;
}) {
  return (
    <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-[#2E7D32]">
      {text}
    </span>
  );
}