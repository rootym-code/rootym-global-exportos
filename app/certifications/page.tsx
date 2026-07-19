import type { Metadata } from "next";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import {
  CertificationsHero,
  CertificationOverview,
  ComplianceStandards,
  ExportAssurance,
  CertificationsCTA,
} from "@/components/certifications";

export const metadata: Metadata = {
  title: "Certifications | ROOTYM",
  description:
    "Explore ROOTYM's certifications, export compliance, food safety standards, regulatory registrations, and commitment to quality for international agricultural trade.",
};

export default function CertificationsPage() {
  return (
    <>
      <Navbar />

      <main className="overflow-hidden">
        <CertificationsHero />

        <CertificationOverview />

        <ComplianceStandards />

        <ExportAssurance />

        <CertificationsCTA />
      </main>

      <Footer />
    </>
  );
}