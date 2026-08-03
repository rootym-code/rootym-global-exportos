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

export const metadata: Metadata = {
  title: "Contact Us | ROOTYM Agro Harvest Private Limited",
  description:
    "Get in touch with ROOTYM Agro Harvest Private Limited for agricultural exports, bulk sourcing, OEM/private label opportunities, international partnerships, distributor enquiries, and global trade collaborations. Our team is ready to assist businesses worldwide.",
  keywords: [
    "Contact ROOTYM",
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
    "ROOTYM Agro Harvest",
  ],
};

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