"use client";

import { motion, type Variants } from "framer-motion";
import {
  Award,
  BadgeCheck,
  Building2,
  FileCheck2,
  Globe2,
  ShieldCheck,
} from "lucide-react";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const certifications = [
  {
    icon: Globe2,
    title: "APEDA Registration",
    subtitle:
      "Agricultural & Processed Food Products Export Development Authority",
    description:
      "ROOTYM is registered with APEDA, enabling the export of agricultural and processed food products while complying with India's export regulations and international trade requirements.",
  },
  {
    icon: BadgeCheck,
    title: "Import Export Code (IEC)",
    subtitle: "Director General of Foreign Trade (DGFT)",
    description:
      "Our Import Export Code authorizes us to conduct international trade, facilitating seamless import and export operations with buyers across global markets.",
  },
  {
    icon: ShieldCheck,
    title: "FSSAI License",
    subtitle: "Food Safety & Standards Authority of India",
    description:
      "Our FSSAI license demonstrates compliance with India's food safety regulations and reinforces our commitment to delivering safe, hygienic, and high-quality agricultural products.",
  },
  {
    icon: Building2,
    title: "MSME Registration",
    subtitle: "Ministry of Micro, Small & Medium Enterprises",
    description:
      "As a registered MSME, ROOTYM is committed to innovation, sustainable growth, operational excellence, and delivering long-term value to customers and business partners.",
  },
  {
    icon: Award,
    title: "Startup India Recognition",
    subtitle:
      "Department for Promotion of Industry & Internal Trade (DPIIT)",
    description:
      "Recognized under the Startup India initiative, ROOTYM leverages innovation, technology, and modern business practices to strengthen India's agricultural export ecosystem.",
  },
  {
    icon: FileCheck2,
    title: "Quality Assurance",
    subtitle: "Inspection, Documentation & Export Readiness",
    description:
      "Every shipment undergoes quality verification, documentation review, and customer-specific compliance checks to ensure consistent product quality and smooth international deliveries.",
  },
];

export default function CertificationOverview() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {/* Section Heading */}

          <motion.div
            variants={itemVariants}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="inline-flex rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-700">
              Certifications & Registrations
            </span>

            <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Building Trust Through
              <span className="block text-green-700">
                Compliance, Quality & Transparency
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              At ROOTYM, regulatory compliance is an integral part of our
              business. Our registrations, certifications, and quality
              management practices demonstrate our commitment to responsible
              sourcing, food safety, transparent documentation, and reliable
              global agricultural exports.
            </p>
          </motion.div>

          {/* Certification Cards */}

          <motion.div
            variants={containerVariants}
            className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3"
          >
            {certifications.map((item) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  variants={itemVariants}
                  className="group rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-green-300 hover:shadow-xl"
                >
                  <div className="inline-flex rounded-2xl bg-green-100 p-4 transition-colors duration-300 group-hover:bg-green-700">
                    <Icon className="h-7 w-7 text-green-700 transition-colors duration-300 group-hover:text-white" />
                  </div>

                  <h3 className="mt-6 text-2xl font-bold text-gray-900">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm font-semibold text-green-700">
                    {item.subtitle}
                  </p>

                  <p className="mt-5 leading-7 text-gray-600">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Trust Banner */}

          <motion.div
            variants={itemVariants}
            className="mt-20 rounded-3xl bg-gradient-to-r from-green-900 via-green-800 to-emerald-800 p-10 text-center text-white shadow-2xl"
          >
            <h3 className="text-3xl font-bold">
              Compliance is the Foundation of Global Trade
            </h3>

            <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-green-100">
              Every certification reflects our commitment to quality assurance,
              regulatory compliance, ethical sourcing, and transparent business
              practices. These standards help us build long-term partnerships
              with importers, distributors, retailers, food manufacturers, and
              wholesale buyers across international markets.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm font-semibold text-green-100">
              <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur-md">
                APEDA Registered
              </span>

              <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur-md">
                IEC Certified
              </span>

              <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur-md">
                FSSAI Licensed
              </span>

              <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur-md">
                MSME Registered
              </span>

              <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur-md">
                Startup India Recognized
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

 