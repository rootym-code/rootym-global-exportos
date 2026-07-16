import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import ProductShowcase from "@/components/sections/ProductShowcase";
import WhyChooseRootym from "@/components/sections/WhyChooseRootym";
import ExportProcess from "@/components/sections/ExportProcess";
import Certifications from "@/components/sections/Certifications";

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
    </main>
  );
}