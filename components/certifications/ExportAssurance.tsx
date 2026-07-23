"use client";

import { motion, type Variants } from "framer-motion";
import {
  BadgeCheck,
  Boxes,
  CheckCircle2,
  FileCheck2,
  Globe2,
  ShieldCheck,
  Ship,
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

const assurances = [
  {
    icon: ShieldCheck,
    title: "Quality Assurance",
    description:
      "Every product is sourced from trusted suppliers and undergoes comprehensive quality verification to ensure consistency, freshness, and customer satisfaction before shipment.",
  },
  {
    icon: FileCheck2,
    title: "Complete Export Documentation",
    description:
      "We prepare accurate export documentation to facilitate efficient customs clearance, regulatory compliance, and hassle-free international trade operations.",
  },
  {
    icon: Ship,
    title: "Reliable Export Logistics",
    description:
      "Working with experienced logistics partners, we coordinate secure, efficient, and timely shipments to customers across international markets.",
  },
  {
    icon: BadgeCheck,
    title: "Regulatory Compliance",
    description:
      "Our export processes are aligned with applicable regulations, customer specifications, and international trade requirements to minimize risk and ensure confidence.",
  },
  {
    icon: Globe2,
    title: "Global Market Readiness",
    description:
      "ROOTYM is prepared to serve importers, distributors, wholesalers, retailers, and food manufacturers with dependable products and professional export services.",
  },
  {
    icon: Boxes,
    title: "Export-Ready Packaging",
    description:
      "Packaging solutions are designed to protect product quality throughout storage, handling, transportation, and international delivery while meeting buyer requirements.",
  },
];

const exportProcess = [
  "Trusted Supplier Selection",
  "Product Quality Inspection",
  "Professional Packaging",
  "Export Documentation",
  "Customs & Regulatory Compliance",
  "International Shipping",
];

export default function ExportAssurance() {
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
              Export Assurance
            </span>

            <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Delivering Confidence
              <span className="block text-green-700">
                With Every Shipment
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              Every export order represents our commitment to quality,
              compliance, reliability, and customer satisfaction. From sourcing
              to final delivery, our processes are designed to reduce risk,
              maintain product integrity, and build long-term partnerships with
              buyers across the world.
            </p>
          </motion.div>

          {/* Assurance Cards */}

          <motion.div
            variants={containerVariants}
            className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3"
          >
            {assurances.map((item) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  variants={itemVariants}
                  className="group rounded-3xl border border-gray-200 bg-gradient-to-br from-white to-green-50 p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-green-300 hover:shadow-xl"
                >
                  <div className="inline-flex rounded-2xl bg-green-100 p-4 transition-colors duration-300 group-hover:bg-green-700">
                    <Icon className="h-7 w-7 text-green-700 transition-colors duration-300 group-hover:text-white" />
                  </div>

                  <h3 className="mt-6 text-2xl font-bold text-gray-900">
                    {item.title}
                  </h3>

                  <p className="mt-5 leading-7 text-gray-600">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Export Workflow */}

          <motion.div
            variants={itemVariants}
            className="mt-20 rounded-3xl border border-green-100 bg-green-50 p-10"
          >
            <div className="mx-auto max-w-4xl text-center">
              <h3 className="text-3xl font-bold text-gray-900">
                Our Export Assurance Process
              </h3>

              <p className="mt-5 text-lg leading-8 text-gray-600">
                Every shipment follows a structured workflow to ensure product
                quality, regulatory compliance, documentation accuracy, and
                dependable international delivery.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {exportProcess.map((step) => (
                <div
                  key={step}
                  className="flex items-center gap-3 rounded-2xl border border-green-100 bg-white p-4 shadow-sm"
                >
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-700" />

                  <span className="font-medium text-gray-800">{step}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Export Commitment */}

          <motion.div
            variants={itemVariants}
            className="mt-20 rounded-3xl bg-gradient-to-r from-green-900 via-green-800 to-emerald-800 p-10 shadow-2xl"
          >
            <div className="mx-auto max-w-5xl text-center">
              <h3 className="text-3xl font-bold text-white">
                Our Commitment to Global Buyers
              </h3>

              <p className="mt-6 text-lg leading-8 text-green-100">
                At ROOTYM, exporting is more than delivering products across
                borders—it is about building trust through quality, regulatory
                compliance, transparent communication, and dependable service.
                Every shipment reflects our dedication to strengthening
                long-term partnerships and promoting premium Indian agricultural
                products in international markets.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm font-semibold text-green-100">
                <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur-md">
                  Quality Verified
                </span>

                <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur-md">
                  Export Documentation
                </span>

                <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur-md">
                  Reliable Logistics
                </span>

                <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur-md">
                  Global Compliance
                </span>

                <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur-md">
                  Long-Term Partnership
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

 