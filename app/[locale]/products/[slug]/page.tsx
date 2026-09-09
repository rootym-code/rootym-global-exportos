/**
 * ============================================================
 * ROOTYM Global ExportOS
 * ============================================================
 * Author      : Prem Singh
 * Module      : Product Management
 * Feature     : Website-scoped Product Detail
 * Purpose     : Displays a public Website-scoped product detail
 *               page with active Product Pricing.
 * ============================================================
 */

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  MapPin,
  Package,
  Ship,
} from "lucide-react";

import { Button } from "@/components/ui/Button";

import {
  getProductBySlug,
} from "@/lib/services/product.service";

import {
  getActiveProductPrice,
} from "@/lib/services/product-pricing.service";

import prisma from "@/lib/prisma";

type PageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

const ROOTYM_WEBSITE_SLUG = "rootym-agro";

function getProductImageUrl(fileUrl?: string | null) {
  if (!fileUrl) {
    return "/images/products/placeholder.png";
  }

  if (fileUrl.startsWith("http")) {
    return fileUrl;
  }

  return `${process.env.NEXT_PUBLIC_SITE_URL}${fileUrl}`;
}

function formatPrice(
  pricing: Awaited<
    ReturnType<typeof getActiveProductPrice>
  >
) {
  if (!pricing) {
    return "Price on Request";
  }

  if (
    pricing.pricingType === "FIXED" &&
    pricing.price !== null
  ) {
    const price = Number(pricing.price);

    if (!Number.isNaN(price)) {
      return `${pricing.currency} ${price.toFixed(2)}`;
    }
  }

  if (
    pricing.pricingType === "MARKET" &&
    pricing.price !== null
  ) {
    const price = Number(pricing.price);

    if (!Number.isNaN(price)) {
      return `${pricing.currency} ${price.toFixed(2)}`;
    }
  }

  return "Price on Request";
}

export default async function ProductPage({
  params,
}: PageProps) {
  const { locale, slug } = await params;

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
    notFound();
  }

  const product = await getProductBySlug(
    website.id,
    slug
  );

  if (!product) {
    notFound();
  }

  const activePricing = await getActiveProductPrice(
    website.id,
    product.id
  );

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

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-7xl px-6 py-14">
        <Link
          href="/products"
          className="mb-10 inline-flex items-center gap-2 text-[#2E7D32] hover:underline"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Products
        </Link>

        <div className="grid gap-14 lg:grid-cols-2">
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

          <div>
            <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-[#2E7D32]">
              {product.category ??
                "Agricultural Product"}
            </span>

            <h1 className="mt-6 text-5xl font-bold text-gray-900">
              {product.name}
            </h1>

            <p className="mt-4 text-lg leading-8 text-gray-600">
              {description}
            </p>

            {/* Product Pricing */}
            <div className="mt-8 rounded-2xl bg-white p-6 shadow-md">
              <p className="text-sm font-medium text-gray-500">
                Price
              </p>

              <p className="mt-2 text-3xl font-bold text-[#2E7D32]">
                {priceDisplay}
              </p>

              {activePricing?.pricingType ===
                "MARKET" && (
                <p className="mt-2 text-sm text-gray-500">
                  Latest market pricing may vary.
                </p>
              )}

              {activePricing?.pricingType ===
                "FIXED" &&
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

            <div className="mt-10 space-y-5">
              <InfoRow
                icon={
                  <MapPin className="h-5 w-5" />
                }
                title="Origin"
                value={
                  product.origin ?? "India"
                }
              />

              <InfoRow
                icon={
                  <Package className="h-5 w-5" />
                }
                title="Packaging"
                value={packaging}
              />

              <InfoRow
                icon={
                  <Ship className="h-5 w-5" />
                }
                title="Availability"
                value={availability}
              />
            </div>

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

            <div className="mt-12 flex flex-col gap-4 sm:flex-row">
              <Link href={`/${locale}/request-quote`}>
                <Button>
                  Request Quotation
                </Button>
              </Link>

              <Button variant="secondary">
                Download Specification
              </Button>
            </div>

            <div className="mt-12 rounded-2xl bg-white p-6 shadow">
              <div className="flex items-center gap-3">
                <BadgeCheck className="h-6 w-6 text-[#2E7D32]" />

                <h3 className="text-lg font-semibold">
                  Why Buy From ROOTYM?
                </h3>
              </div>

              <ul className="mt-5 space-y-3 text-gray-600">
                <li>
                  ✓ Direct sourcing from trusted
                  farmers
                </li>

                <li>
                  ✓ Export documentation assistance
                </li>

                <li>
                  ✓ Quality inspection before
                  shipment
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

function Badge({ text }: { text: string }) {
  return (
    <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-[#2E7D32]">
      {text}
    </span>
  );
}