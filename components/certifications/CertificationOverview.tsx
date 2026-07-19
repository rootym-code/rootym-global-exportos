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
    subtitle: "Agricultural & Processed Food Products Export Development Authority",
    description:
      "Registered exporter enabling international trade of agricultural and processed food products in compliance with Indian export regulations.",
  },
  {
    icon: BadgeCheck,
    title: "Import Export Code (IEC)",
    subtitle: "Director General of Foreign Trade",
    description:
      "Official authorization to conduct import and export business, enabling seamless international trade operations.",
  },
  {
    icon: ShieldCheck,
    title: "FSSAI License",
    subtitle: "Food Safety & Standards Authority of India",
    description:
      "Ensures compliance with food safety regulations and reinforces our commitment to delivering safe and quality food products.",
  },
  {
    icon: Building2,
    title: "MSME Registration",
    subtitle: "Ministry of Micro, Small & Medium Enterprises",
    description:
      "Recognized as a registered MSME, strengthening our commitment to innovation, quality and sustainable business growth.",
  },
  {
    icon: Award,
    title: "Startup India Recognition",
    subtitle: "Department for Promotion of Industry & Internal Trade",
    description:
      "Recognized as an innovative startup committed to technology-driven agricultural exports and business excellence.",
  },
  {
    icon: FileCheck2,
    title: "Quality Commitment",
    subtitle: "Internal Quality Assurance",
    description:
      "Every shipment follows rigorous quality checks, documentation standards and customer-specific compliance requirements.",
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
          {/* Heading */}

          <motion.div
            variants={itemVariants}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="inline-flex rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-700">
              Our Certifications
            </span>

            <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Building Trust Through
              <span className="block text-green-700">
                Compliance & Quality
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our registrations, certifications and regulatory compliance
              demonstrate our commitment to quality, transparency and global
              export standards. These credentials strengthen customer
              confidence and support smooth international trade.
            </p>
          </motion.div>

          {/* Cards */}

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

                  <p className="mt-2 text-sm font-medium text-green-700">
                    {item.subtitle}
                  </p>

                  <p className="mt-5 leading-7 text-gray-600">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Bottom Statement */}

          <motion.div
            variants={itemVariants}
            className="mt-20 rounded-3xl bg-gradient-to-r from-green-900 via-green-800 to-emerald-800 p-10 text-center text-white shadow-2xl"
          >
            <h3 className="text-3xl font-bold">
              Compliance is the Foundation of Global Trade
            </h3>

            <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-green-100">
              Every certification reflects our dedication to responsible
              business practices, regulatory compliance, quality assurance and
              building long-term confidence with customers across international
              markets.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}