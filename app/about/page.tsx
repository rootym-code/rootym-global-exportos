import type { Metadata } from "next";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import AboutHero from "@/components/about/AboutHero";
import CompanyStory from "@/components/about/CompanyStory";
import VisionMission from "@/components/about/VisionMission";
import ExportProducts from "@/components/about/ExportProducts";
import WhyChooseRootym from "@/components/about/WhyChooseRootym";
import CompanyStats from "@/components/about/CompanyStats";
import CompanyTimeline from "@/components/about/CompanyTimeline";
import LeadershipPreview from "@/components/about/LeadershipPreview";
import GlobalPresence from "@/components/about/GlobalPresence";
import AboutCTA from "@/components/about/AboutCTA";

export const metadata: Metadata = {
  title: "About Us | ROOTYM Agro Harvest Private Limited",
  description:
    "Learn about ROOTYM Agro Harvest Private Limited, our vision, leadership, export capabilities, premium agricultural products, and commitment to delivering trusted Indian agricultural products to global markets.",
  keywords: [
    "ROOTYM",
    "About ROOTYM",
    "Indian Agricultural Exporter",
    "Agricultural Export Company India",
    "Premium Makhana Exporter",
    "Food Export Company",
    "Indian Food Export",
  ],
};

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="overflow-x-hidden bg-white">
        <AboutHero />

        <CompanyStory />

        <VisionMission />

        <ExportProducts />

        <WhyChooseRootym />

        <CompanyStats />

        <CompanyTimeline />

        <LeadershipPreview />

        <GlobalPresence />

        <AboutCTA />
      </main>

      <Footer />
    </>
  );
}