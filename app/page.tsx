import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import ProductShowcase from "@/components/sections/ProductShowcase";
import WhyChooseRootym from "@/components/sections/WhyChooseRootym";
import ExportProcess from "@/components/sections/ExportProcess";
import Certifications from "@/components/sections/Certifications";
import GlobalMarkets from "@/components/sections/GlobalMarkets";
import CallToAction from "@/components/sections/CallToAction";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <Hero />

      {/* Featured Products */}
      <ProductShowcase />

      {/* Why ROOTYM */}
      <WhyChooseRootym />

      {/* Export Process */}
      <ExportProcess />

      {/* Certifications */}
      <Certifications />

      <GlobalMarkets />
      <Testimonials />
      <FAQ />

<CallToAction />
<Footer />
    </main>
    
  );
}