import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import PremiumHero from "@/components/home/PremiumHero";
import PremiumFeatures from "@/components/home/PremiumFeatures";
import PremiumExportProcess from "@/components/home/PremiumExportProcess";
import PremiumCertifications from "@/components/home/PremiumCertifications";
import PremiumGlobalMarkets from "@/components/home/PremiumGlobalMarkets";
import PremiumTestimonials from "@/components/home/PremiumTestimonials";
import PremiumFAQ from "@/components/home/PremiumFAQ";
import PremiumCTA from "@/components/home/PremiumCTA";
import ProductShowcase from "@/components/sections/ProductShowcase";

export default function Home() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* Premium Hero */}
      <PremiumHero />

      {/* Products */}
      <ProductShowcase />

      {/* Premium Features */}
      <PremiumFeatures />

      {/* Export Journey */}
      <PremiumExportProcess />

      {/* Certifications */}
      <PremiumCertifications />

      {/* Global Presence */}
      <PremiumGlobalMarkets />

      {/* Testimonials */}
      <PremiumTestimonials />

      {/* FAQ */}
      <PremiumFAQ />

      {/* CTA */}
      <PremiumCTA />

      <Footer />
    </main>
  );
}