/**
 * ============================================================
 * ROOTYM Customer Website Products
 * ============================================================
 * Author: Prem Singh
 * Module      : Public Website
 * Feature     : Customer Website Products
 * Purpose     : Reuses the existing premium Products experience
 *               inside a tenant Website while resolving
 *               Website-specific branding and business data.
 * ============================================================
 */

import type { Metadata } from "next";

import { notFound } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import ProductsHero from "@/components/products/ProductsHero";
import ProductPortfolio from "@/components/products/ProductPortfolio";
import BuyerConfidence from "@/components/products/BuyerConfidence";
import ExportJourney from "@/components/products/ExportJourney";
import AIFuture from "@/components/products/AIFuture";
import ProductsCTA from "@/components/products/ProductsCTA";

import prisma from "@/lib/prisma";
import { ProductStatus } from "@/lib/generated/prisma";
import { listProducts } from "@/lib/services/product.service";
import { getSubscriptionAccessStatus } from "@/lib/services/billing/subscription-access.service";

type PageProps = {
  params: Promise<{
    websiteSlug: string;
    locale: string;
  }>;
};

/**
 * ============================================================
 * PUBLIC CUSTOMER WEBSITE PRODUCTS METADATA
 * ============================================================
 *
 * Website Configuration provides Website-specific metadata.
 * Business Profile and Website name remain fallbacks.
 * ============================================================
 */

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { websiteSlug } = await params;

  const website = await prisma.website.findUnique({
    where: {
      slug: websiteSlug,
    },

    select: {
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
          id: true,
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

  const websiteTitle =
    website.configuration?.websiteTitle?.trim() ||
    website.tenant.businessProfile?.businessName?.trim() ||
    website.name;

  const websiteDescription =
    website.configuration?.websiteDescription?.trim() ||
    website.tenant.businessProfile?.description?.trim() ||
    undefined;

  return {
    title: `Products | ${websiteTitle}`,

    description:
      websiteDescription ||
      `Discover premium agricultural products from ${websiteTitle}.`,
  };
}

/**
 * ============================================================
 * PUBLIC CUSTOMER WEBSITE PRODUCTS PAGE
 * ============================================================
 */

export default async function CustomerWebsiteProductsPage({
  params,
}: PageProps) {
  const { websiteSlug, locale } = await params;

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

      /**
       * --------------------------------------------------------
       * WEBSITE BRANDING
       * --------------------------------------------------------
       */

      branding: {
        select: {
          logoMedia: {
            select: {
              fileUrl: true,
            },
          },

          primaryColor: true,
          secondaryColor: true,
          accentColor: true,
          fontFamily: true,
        },
      },

      /**
       * --------------------------------------------------------
       * WEBSITE CONFIGURATION
       * --------------------------------------------------------
       */

      configuration: {
        select: {
          websiteTitle: true,
          tagline: true,
          websiteDescription: true,
        },
      },

      /**
       * --------------------------------------------------------
       * TENANT BUSINESS DATA
       * --------------------------------------------------------
       */

      tenant: {
        select: {
          id: true,
          businessProfile: {
            select: {
              businessName: true,
              legalName: true,
              description: true,
            },
          },

          businessAddress: {
            select: {
              addressLine1: true,
              addressLine2: true,
              city: true,
              state: true,
              postalCode: true,
              country: true,
            },
          },

          businessContactCommunication: {
            select: {
              primaryEmail: true,
              primaryPhone: true,
              whatsapp: true,
              linkedinUrl: true,
              facebookUrl: true,
              instagramUrl: true,
              youtubeUrl: true,
            },
          },
        },
      },
    },
  });

  if (!website || !website.isActive) {
    notFound();
  }

  /**
   * ------------------------------------------------------------
   * SUBSCRIPTION ACCESS
   * ------------------------------------------------------------
   *
   * Expired or unsubscribed customers must not continue serving
   * their public Website through the Products route.
   *
   * This is enforced server-side so the route cannot be bypassed
   * by directly requesting the Products URL.
   * ------------------------------------------------------------
   */

  const subscriptionAccess = await getSubscriptionAccessStatus(
    website.tenant.id,
  );

  const websiteAccessBlocked =
    subscriptionAccess.status === "EXPIRED" ||
    subscriptionAccess.status === "NO_SUBSCRIPTION";

  if (websiteAccessBlocked) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16 text-slate-900">
        <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white px-8 py-12 text-center shadow-sm">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-xl font-semibold text-slate-700">
            R
          </div>

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            ROOTYM Website
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            This Website is currently offline
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-600">
            This customer Website is temporarily unavailable because the
            ROOTYM subscription is not currently active.
          </p>

          <p className="mt-4 text-sm leading-6 text-slate-500">
            The Website owner can restore it by activating a ROOTYM
            subscription.
          </p>
        </div>
      </main>
    );
  }

  /**
   * ------------------------------------------------------------
   * WEBSITE BRANDING
   * ------------------------------------------------------------
   */

  const businessProfile =
    website.tenant.businessProfile;

  const websiteBranding = {
    companyName:
      businessProfile?.businessName?.trim() ||
      website.name,

    logoMediaUrl:
      website.branding?.logoMedia?.fileUrl ?? null,

    primaryColor:
      website.branding?.primaryColor ?? null,

    secondaryColor:
      website.branding?.secondaryColor ?? null,

    accentColor:
      website.branding?.accentColor ?? null,

    fontFamily:
      website.branding?.fontFamily ?? null,
  };

  /**
   * ------------------------------------------------------------
   * BUSINESS IDENTITY
   * ------------------------------------------------------------
   */

  const businessIdentity = {
    businessName:
      businessProfile?.businessName ?? null,

    legalName:
      businessProfile?.legalName ?? null,
  };

  /**
   * ------------------------------------------------------------
   * PUBLISHED PRODUCTS
   * ------------------------------------------------------------
   *
   * Product ownership is Website-scoped.
   *
   * The Product service therefore receives the current Website ID
   * so products belonging to another Website cannot be exposed.
   *
   * ------------------------------------------------------------
   */

  const { items: products } = await listProducts(
    website.id,
    {
      status: ProductStatus.PUBLISHED,
      page: 1,
      pageSize: 100,
    },
  );

  /**
   * ------------------------------------------------------------
   * SERIALIZE PRODUCT DATA FOR CLIENT COMPONENT
   * ------------------------------------------------------------
   *
   * Prisma Decimal instances cannot cross the
   * Server Component -> Client Component boundary.
   *
   * Product quantities and pricing values are therefore converted
   * to primitive numbers before ProductPortfolio receives them.
   *
   * This is intentionally handled at the presentation boundary
   * rather than changing the Product service or Prisma model.
   * ------------------------------------------------------------
   */

  const serializedProducts = products.map((product) => ({
    ...product,

    minOrderQty:
      product.minOrderQty !== null
        ? Number(product.minOrderQty)
        : null,

    maxOrderQty:
      product.maxOrderQty !== null
        ? Number(product.maxOrderQty)
        : null,

    pricing: product.pricing.map((pricing) => ({
      ...pricing,

      price:
        pricing.price !== null
          ? Number(pricing.price)
          : null,
    })),
  }));

  /**
   * ============================================================
   * CUSTOMER WEBSITE PRODUCTS
   * ============================================================
   */

  return (
    <>
      <Navbar
        websiteSlug={websiteSlug}
        websiteBranding={websiteBranding}
      />

      <main className="overflow-x-hidden bg-white">
        <ProductsHero
          websiteCompanyName={
            businessProfile?.businessName
          }

          websiteDescription={
            website.configuration?.websiteDescription
          }
        />

        <ProductPortfolio
          products={serializedProducts}
          websiteSlug={websiteSlug}
        />

        <BuyerConfidence websiteCompanyName={businessProfile?.businessName} />

        <ExportJourney websiteCompanyName={businessProfile?.businessName} />

        <AIFuture />

        <ProductsCTA
          websiteCompanyName={businessProfile?.businessName}
        />
      </main>

      <Footer
        websiteSlug={websiteSlug}
        locale={locale}
        websiteProducts={products.map((product) => ({
          id: product.id,
          name: product.name,
          slug: product.slug,
        }))}
        websiteBranding={websiteBranding}

        websiteConfiguration={
          website.configuration
        }

        businessIdentity={
          businessIdentity
        }

        businessAddress={
          website.tenant.businessAddress
        }

        businessContactCommunication={
          website.tenant
            .businessContactCommunication
        }
      />
    </>
  );
}
