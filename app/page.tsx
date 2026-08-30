/**
 * ============================================================
 * ROOTYM ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the public ROOTYM AI marketing homepage
 *          for export.rootym.com.
 * ============================================================
 */
import MarketingNavbar from "@/components/layout/MarketingNavbar";
import Hero from "@/components/sections/Hero";
import ApplicationScreenshots from "@/components/sections/ApplicationScreenshots";
import Solutions from "@/components/sections/Solutions";
import Products from "@/components/sections/Products";
import Industries from "@/components/sections/Industries";
import About from "@/components/sections/About";
import Technologies from "@/components/sections/Technologies";
import WhyRootym from "@/components/sections/WhyRootym";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main
      id="top"
      className="min-h-screen bg-slate-950"
    >
      <MarketingNavbar />

      <Hero />

      <ApplicationScreenshots />

      <Solutions />

      <Products />

      <Industries />

      <About />

      <Technologies />

      <WhyRootym />

      <CTA />

      <Footer />
    </main>
  );
}