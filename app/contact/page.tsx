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
    "Contact ROOTYM Agro Harvest Private Limited for agricultural exports, bulk sourcing, international partnerships and business enquiries.",
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