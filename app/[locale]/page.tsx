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

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-background">
      <Navbar />

      {/* Hero */}
      <PremiumHero />

      {/* Featured Products */}
      <ProductShowcase />

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

      <Footer />
    </main>
  );
}