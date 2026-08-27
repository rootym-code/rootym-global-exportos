/**
 * ============================================================
 * ROOTYM Global Export Platform
 * ============================================================
 * Author: Prem Singh
 * Module      : Contact
 * Feature     : Contact Page
 * Purpose     : Displays the contact page using CMS-managed
 *               company identity in page metadata.
 * ============================================================
 */

import type { Metadata } from "next";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import {
  BusinessHours,
  ContactCTA,
  ContactForm,
  ContactHero,
  ContactInformation,
  FAQContact,
  OfficeLocations,
} from "@/components/contact";

import siteSettingService from "@/lib/services/cms/site-setting.service";

export async function generateMetadata(): Promise<Metadata> {
  const settings =
    await siteSettingService.getCompanySettings();

  const companyName =
    settings.company.companyName.trim() || "ROOTYM";

  const legalName =
    settings.company.legalName.trim() || companyName;

  return {
    title: `Contact Us | ${legalName}`,

    description:
      `Get in touch with ${legalName} for agricultural exports, bulk sourcing, OEM/private label opportunities, international partnerships, distributor enquiries, and global trade collaborations. Our team is ready to assist businesses worldwide.`,

    keywords: [
      `Contact ${companyName}`,
      "Agricultural Exporter India",
      "Bulk Food Supplier",
      "Export Enquiry",
      "International Trade",
      "Fox Nuts Export",
      "Makhana Exporter",
      "Onion Export",
      "Rice Export",
      "Potato Products Export",
      "Indian Agricultural Products",
      `${companyName} Agro Harvest`,
    ],
  };
}

export default function ContactPage() {
  return (
    <>
      <Navbar />

      <main className="overflow-hidden">
        <ContactHero />

        <ContactInformation />

        <ContactForm />

        <OfficeLocations />

        <BusinessHours />

        <FAQContact />

        <ContactCTA />
      </main>

      <Footer />
    </>
  );
}