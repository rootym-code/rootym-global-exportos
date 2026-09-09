/**
 * ============================================================
 * ROOTYM Global ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Renders the ROOTYM public homepage using the
 *          Website-scoped product catalogue.
 * ============================================================
 */

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PremiumHero from "@/components/home/PremiumHero";
import ProductShowcase from "@/components/sections/ProductShowcase";
import PremiumFeatures from "@/components/home/PremiumFeatures";
import PremiumExportProcess from "@/components/home/PremiumExportProcess";
import PremiumCertifications from "@/components/home/PremiumCertifications";
import PremiumGlobalMarkets from "@/components/home/PremiumGlobalMarkets";
import PremiumTestimonials from "@/components/home/PremiumTestimonials";
import PremiumFAQ from "@/components/home/PremiumFAQ";
import PremiumCTA from "@/components/home/PremiumCTA";

import { ProductStatus } from "@/lib/generated/prisma";
import { listProducts } from "@/lib/services/product.service";
import { prisma } from "@/lib/prisma";

const ROOTYM_WEBSITE_SLUG = "rootym-agro";

export default async function Home() {
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
    return null;
  }

  const { items: products } = await listProducts(website.id, {
    status: ProductStatus.PUBLISHED,
    page: 1,
    pageSize: 100,
  });

  return (
    <>
      <Navbar />

      <main className="overflow-x-hidden bg-white">
        <PremiumHero />

        <ProductShowcase products={products} />

        <PremiumFeatures />

        <PremiumExportProcess />

        <PremiumCertifications />

        <PremiumGlobalMarkets />

        <PremiumTestimonials />

        <PremiumFAQ />

        <PremiumCTA />
      </main>

      <Footer />
    </>
  );
}