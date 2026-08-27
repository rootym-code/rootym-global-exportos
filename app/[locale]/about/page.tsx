/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * ============================================================
 * Author: Prem Singh
 * Module          : About Page
 * Feature         : CMS-driven Page Metadata
 *
 * Description
 * ------------------------------------------------------------
 * Uses centralized CMS Company Settings for the About page
 * metadata while preserving the existing page sections.
 * ============================================================
 */

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

import companySettingsService from "@/lib/services/cms/settings/company-settings.service";

export async function generateMetadata(): Promise<Metadata> {
  const settings =
    await companySettingsService.getCompanySettings();

  const companyName =
    settings.company.companyName ||
    settings.company.legalName ||
    "ROOTYM";

  const description =
    settings.company.description ||
    settings.company.tagline ||
    `Learn about ${companyName}, our vision, leadership, export capabilities, premium agricultural products, and commitment to delivering trusted Indian agricultural products to global markets.`;

  return {
    title: `About Us | ${companyName}`,
    description,
    keywords: [
      companyName,
      settings.company.legalName,
      settings.company.tagline,
      "About ROOTYM",
      "Indian Agricultural Exporter",
      "Agricultural Export Company India",
      "Premium Makhana Exporter",
      "Food Export Company",
      "Indian Food Export",
    ].filter(Boolean),
  };
}

export default async function AboutPage() {
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