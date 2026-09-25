/**
 * ============================================================
 * ROOTYM Customer Website Homepage
 * ============================================================
 * Author: Prem Singh
 * Module      : Public Website
 * Feature     : Customer Website Homepage
 * Purpose     : Resolves a Website-owned homepage and renders
 *               the reusable premium customer Website experience,
 *               with server-side subscription access enforcement.
 * ============================================================
 */

import type { Metadata } from "next";

import { notFound } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomerWebsiteHomepage from "@/components/public/CustomerWebsiteHomepage";

import prisma from "@/lib/prisma";

import cmsPageService from "@/lib/services/cms/page.service";

import {
  CmsPageLayout,
  CmsPageStatus,
  ProductStatus,
} from "@/lib/generated/prisma";

import { listProducts } from "@/lib/services/product.service";

import {
  getSubscriptionAccessStatus,
} from "@/lib/services/billing/subscription-access.service";

type PageProps = {
  params: Promise<{
    websiteSlug: string;
    locale: string;
  }>;
};

/**
 * ============================================================
 * PUBLIC WEBSITE HOMEPAGE METADATA
 * ============================================================
 *
 * The homepage is resolved from the Website-owned CMS page
 * explicitly marked with isHomePage = true.
 *
 * Priority:
 *
 * Title:
 *   1. CMS translation metaTitle
 *   2. CMS translation title
 *   3. Website Configuration websiteTitle
 *   4. Business Profile businessName
 *   5. Website name
 *
 * Description:
 *   1. CMS translation metaDescription
 *   2. Website Configuration websiteDescription
 *   3. Business Profile description
 * ============================================================
 */

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { websiteSlug, locale } = await params;

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

  /**
   * ------------------------------------------------------------
   * Website-wide metadata defaults
   * ------------------------------------------------------------
   */

  const websiteTitle =
    website.configuration?.websiteTitle?.trim() ||
    website.tenant.businessProfile?.businessName?.trim() ||
    website.name;

  const websiteDescription =
    website.configuration?.websiteDescription?.trim() ||
    website.tenant.businessProfile?.description?.trim() ||
    undefined;

  /**
   * ------------------------------------------------------------
   * Resolve the Website homepage
   * ------------------------------------------------------------
   */

  const page = await cmsPageService.getHomePage(website.id);

  if (!page || page.status !== CmsPageStatus.PUBLISHED) {
    return {
      title: websiteTitle,
      description: websiteDescription,
    };
  }

  /**
   * ------------------------------------------------------------
   * Resolve locale-specific homepage translation
   * ------------------------------------------------------------
   */

  /**
   * ------------------------------------------------------------
   * Resolve locale-specific homepage translation
   * ------------------------------------------------------------
   *
   * Prefer the requested locale. If that locale does not have
   * a published translation, fall back to English and then to
   * the first published Website translation so a valid tenant
   * homepage URL does not return a 404 simply because a locale
   * translation has not been published yet.
   * ------------------------------------------------------------
   */

  const translation =
    page.translations.find(
      (item) =>
        item.isPublished &&
        item.language.code.toLowerCase() ===
          locale.toLowerCase(),
    ) ||
    page.translations.find(
      (item) =>
        item.isPublished &&
        item.language.code.toLowerCase() === "en",
    ) ||
    page.translations.find(
      (item) => item.isPublished,
    );

  if (!translation) {
    return {
      title: websiteTitle,
      description: websiteDescription,
    };
  }

  /**
   * ------------------------------------------------------------
   * Homepage title
   * ------------------------------------------------------------
   */

  const pageTitle =
    translation.metaTitle?.trim() ||
    translation.title?.trim() ||
    "";

  const resolvedTitle =
    pageTitle &&
    pageTitle.toLowerCase() !== websiteTitle.toLowerCase()
      ? `${pageTitle} | ${websiteTitle}`
      : pageTitle || websiteTitle;

  /**
   * ------------------------------------------------------------
   * Homepage description
   * ------------------------------------------------------------
   */

  const resolvedDescription =
    translation.metaDescription?.trim() ||
    websiteDescription;

  return {
    title: resolvedTitle,
    description: resolvedDescription,
  };
}

/**
 * ============================================================
 * PUBLIC WEBSITE HOMEPAGE
 * ============================================================
 */

export default async function CustomerWebsiteHomepagePage({
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
       *
       * These values belong to the Website and are independent
       * from ROOTYM global Company Settings.
       * --------------------------------------------------------
       */

      configuration: {
        select: {
          websiteTitle: true,
          tagline: true,
          websiteDescription: true,
          companyDescription: true,
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
   * Customer Websites remain available while the tenant has an
   * active trial or active paid subscription. Once subscription
   * access expires, the public Website is taken offline.
   *
   * This is enforced server-side so expired customers cannot
   * continue serving their Website by bypassing the UI.
   * ------------------------------------------------------------
   */

  const subscriptionAccess =
    await getSubscriptionAccessStatus(
      website.tenant.id,
    );

  const websiteAccessBlocked =
    subscriptionAccess.status === "EXPIRED" ||
    subscriptionAccess.status === "NO_SUBSCRIPTION";

  if (websiteAccessBlocked) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16 text-slate-900">
        <div className="w-full max-w-2xl rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200 sm:p-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
            <span className="text-xl font-bold">R</span>
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
            ROOTYM Website
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            This Website is currently offline
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
            This customer Website is temporarily unavailable because
            the ROOTYM subscription is not currently active.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            The Website owner can restore it by activating a ROOTYM
            subscription.
          </p>
        </div>
      </main>
    );
  }

  /**
   * ------------------------------------------------------------
   * WEBSITE-SCOPED HOMEPAGE
   * ------------------------------------------------------------
   *
   * The homepage is determined by the CMS page explicitly
   * marked as isHomePage = true for this Website.
   * ------------------------------------------------------------
   */

  const page = await cmsPageService.getHomePage(website.id);

  /**
   * ------------------------------------------------------------
   * DEFAULT WEBSITE HOMEPAGE FALLBACK
   * ------------------------------------------------------------
   *
   * A newly created Website does not need a CMS homepage just to
   * expose the standard customer Website. CMS pages remain an
   * optional customization layer.
   *
   * If a published Website-owned CMS homepage exists, it continues
   * to control the homepage. Otherwise the reusable premium
   * CustomerWebsiteHomepage is rendered as the default homepage.
   * ------------------------------------------------------------
   */

  const publishedHomePage =
    page?.status === CmsPageStatus.PUBLISHED
      ? page
      : null;

  /**
   * ------------------------------------------------------------
   * LOCALE-SPECIFIC HOMEPAGE TRANSLATION
   * ------------------------------------------------------------
   */

  /**
   * ------------------------------------------------------------
   * Resolve locale-specific homepage translation
   * ------------------------------------------------------------
   *
   * Prefer the requested locale. If it is not published, use
   * English and then the first published Website translation.
   * ------------------------------------------------------------
   */

  const translation =
    publishedHomePage?.translations.find(
      (item) =>
        item.isPublished &&
        item.language.code.toLowerCase() ===
          locale.toLowerCase(),
    ) ||
    publishedHomePage?.translations.find(
      (item) =>
        item.isPublished &&
        item.language.code.toLowerCase() === "en",
    ) ||
    publishedHomePage?.translations.find(
      (item) => item.isPublished,
    );

  if (publishedHomePage && !translation) {
    notFound();
  }

  /**
   * ============================================================
   * WEBSITE BRANDING
   * ============================================================
   *
   * Business Profile remains the business identity source.
   *
   * Website Title is used for Website metadata and is not
   * substituted for the actual business name.
   * ============================================================
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
   * ============================================================
   * BUSINESS IDENTITY
   * ============================================================
   */

  const businessIdentity = {
    businessName:
      businessProfile?.businessName ?? null,

    legalName:
      businessProfile?.legalName ?? null,
  };

  /**
   * ============================================================
   * WEBSITE TENANT CONTACT INFORMATION
   * ============================================================
   *
   * These values are passed to the customer homepage CTA so
   * the CTA displays the Website tenant's contact details
   * instead of the global ROOTYM contact details.
   * ============================================================
   */

  const businessContact =
    website.tenant.businessContactCommunication;

  const websiteCompanyName =
    businessProfile?.businessName ?? null;

  const websiteEmail =
    businessContact?.primaryEmail ?? null;

  const websitePhone =
    businessContact?.primaryPhone ?? null;

  const websiteDescription =
    website.configuration?.websiteDescription ?? null;

  /**
   * ============================================================
   * HOMEPAGE PRODUCTS
   * ============================================================
   *
   * Product ownership is currently global in the existing
   * Product model. Until tenant-specific Product ownership is
   * implemented, reuse the existing published product source.
   *
   * This keeps the homepage component reusable without adding
   * an incorrect tenantId assumption to the current schema.
   * ============================================================
   */

  const { items: products } = await listProducts(website.id, {
    status: ProductStatus.PUBLISHED,
    page: 1,
    pageSize: 100,
  });

  /**
   * ============================================================
   * WEBSITE LAYOUT
   * ============================================================
   */

  if (
    !publishedHomePage ||
    publishedHomePage.layout === CmsPageLayout.WEBSITE
  ) {
    return (
      <>
        <Navbar
          websiteSlug={websiteSlug}
          websiteBranding={websiteBranding}
        />

<CustomerWebsiteHomepage
  products={products}
  websiteConfiguration={
    website.configuration
  }
  websiteCompanyName={
    website.tenant.businessProfile?.businessName
  }
  websiteEmail={
    website.tenant.businessContactCommunication
      ?.primaryEmail
  }
  websitePhone={
    website.tenant.businessContactCommunication
      ?.primaryPhone
  }
/>

        <Footer
          websiteSlug={websiteSlug}
          locale={locale}
          websiteBranding={websiteBranding}
          websiteConfiguration={
            website.configuration
          }
          businessIdentity={businessIdentity}
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

  /**
   * ------------------------------------------------------------
   * Standalone homepage fallback
   * ------------------------------------------------------------
   *
   * The premium homepage composition is still rendered for a
   * standalone homepage so the Website-owned homepage remains
   * visually consistent.
   * ------------------------------------------------------------
   */

  return (
<CustomerWebsiteHomepage
  products={products}
  websiteConfiguration={
    website.configuration
  }
  websiteCompanyName={
    website.tenant.businessProfile?.businessName
  }
  websiteEmail={
    website.tenant.businessContactCommunication
      ?.primaryEmail
  }
  websitePhone={
    website.tenant.businessContactCommunication
      ?.primaryPhone
  }
/>
  );
}