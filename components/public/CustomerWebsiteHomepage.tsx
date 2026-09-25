/**
 * ============================================================
 * ROOTYM Customer Website Homepage
 * ============================================================
 * Author: Prem Singh
 * Module      : Public Website
 * Feature     : Customer Website Homepage Composition
 * Purpose     : Composes the reusable premium homepage sections
 *               and passes Website-specific configuration,
 *               business identity, contact information and
 *               Website routing context into homepage components.
 * ============================================================
 */

"use client";

import PremiumHero from "@/components/home/PremiumHero";

import ProductShowcase from "@/components/sections/ProductShowcase";

import PremiumFeatures from "@/components/home/PremiumFeatures";

import PremiumExportProcess from "@/components/home/PremiumExportProcess";

import PremiumCertifications from "@/components/home/PremiumCertifications";

import PremiumGlobalMarkets from "@/components/home/PremiumGlobalMarkets";

import PremiumTestimonials from "@/components/home/PremiumTestimonials";

import PremiumFAQ from "@/components/home/PremiumFAQ";

import PremiumCTA from "@/components/home/PremiumCTA";

import ProductPortfolio from "@/components/products/ProductPortfolio";

type CustomerWebsiteHomepageProps = {
  products: {
    id: string;
    name: string;
    slug: string;
    category: string | null;
    origin: string | null;
    defaultUnit: string | null;
    featuredImage?: {
      fileUrl: string;
    } | null;
  }[];

  /**
   * ============================================================
   * Website-level configuration.
   * ============================================================
   *
   * These values belong to the Website and therefore override
   * the reusable homepage component's global fallbacks.
   * ============================================================
   */
  websiteConfiguration?: {
    websiteTitle?: string | null;
    tagline?: string | null;
    websiteDescription?: string | null;
    companyDescription?: string | null;
  } | null;

  /**
   * ============================================================
   * Website tenant's Business Profile name.
   * ============================================================
   *
   * This is passed separately because business identity belongs
   * to the tenant Business Profile, while tagline and
   * descriptions belong to Website Configuration.
   * ============================================================
   */
  websiteCompanyName?: string | null;

  /**
   * Website tenant's primary business email.
   */
  websiteEmail?: string | null;

  /**
   * Website tenant's primary business phone.
   */
  websitePhone?: string | null;

  /**
   * Customer Website slug.
   *
   * Used to keep product navigation inside the customer
   * Website instead of sending visitors to the global route.
   */
  websiteSlug?: string | null;
};

export default function CustomerWebsiteHomepage({
  products,
  websiteConfiguration,
  websiteCompanyName,
  websiteEmail,
  websitePhone,
  websiteSlug,
}: CustomerWebsiteHomepageProps) {
  return (
    <main className="overflow-x-hidden bg-white">
      <PremiumHero
        websiteCompanyName={websiteCompanyName}
        websiteTagline={websiteConfiguration?.tagline}
        websiteDescription={
          websiteConfiguration?.websiteDescription
        }
        companyDescription={
          websiteConfiguration?.companyDescription
        }
      />

      <ProductShowcase products={products} />

      <PremiumFeatures
        websiteCompanyName={websiteCompanyName}
      />

      <PremiumExportProcess
        websiteCompanyName={websiteCompanyName}
      />

      <PremiumCertifications
        websiteCompanyName={websiteCompanyName}
      />

      <PremiumGlobalMarkets
        websiteCompanyName={websiteCompanyName}
      />

      <PremiumTestimonials
        websiteCompanyName={websiteCompanyName}
      />

      <PremiumFAQ
        websiteCompanyName={websiteCompanyName}
      />

      <PremiumCTA
        websiteCompanyName={websiteCompanyName}
        websiteDescription={
          websiteConfiguration?.websiteDescription
        }
        websiteEmail={websiteEmail}
        websitePhone={websitePhone}
      />

      {/**
       * ProductPortfolio is intentionally not rendered here.
       *
       * The homepage continues to use ProductShowcase.
       *
       * ProductPortfolio is used by the dedicated customer
       * Website Products page and receives websiteSlug there.
       */}
    </main>
  );
}