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
  title: "Certifications & Export Compliance | ROOTYM",
  description:
    "Discover ROOTYM's export certifications, regulatory registrations, food safety compliance, and quality assurance standards. Trusted Indian exporter of premium agricultural products for global markets.",
  keywords: [
    "ROOTYM certifications",
    "Export compliance",
    "APEDA registered exporter",
    "IEC certificate India",
    "FSSAI exporter",
    "MSME certified",
    "Startup India",
    "Indian agricultural exporter",
    "Food safety compliance",
    "Global agricultural exports",
    "Export documentation",
    "Quality assurance",
  ],
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