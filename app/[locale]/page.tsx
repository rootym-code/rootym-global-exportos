/**
 * Author: Prem Singh
 * Purpose: Loads all published products for the Home page product carousel.
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

export default async function Home() {
  const { items: products } = await listProducts({
    status: ProductStatus.PUBLISHED,
    page: 1,
    pageSize: 100,
  });

  return (
    <>
      <Navbar />

      <main className="overflow-x-hidden bg-white">
        {/* Hero */}
        <PremiumHero />

        {/* Featured Products */}
        <ProductShowcase products={products} />

        {/* Why ROOTYM */}
        <PremiumFeatures />

        {/* Export Process */}
        <PremiumExportProcess />

        {/* Certifications */}
        <PremiumCertifications />

        {/* Global Presence */}
        <PremiumGlobalMarkets />

        {/* Testimonials */}
        <PremiumTestimonials />

        {/* FAQ */}
        <PremiumFAQ />

        {/* Call To Action */}
        <PremiumCTA />
      </main>

      <Footer />
    </>
  );
}