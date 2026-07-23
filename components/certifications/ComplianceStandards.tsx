"use client";

import { motion, type Variants } from "framer-motion";
import {
  CheckCircle2,
  ClipboardCheck,
  Globe2,
  PackageCheck,
  ShieldCheck,
  Truck,
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

const standards = [
  {
    icon: ClipboardCheck,
    title: "Regulatory Compliance",
    description:
      "We comply with applicable export regulations, statutory requirements, and documentation standards to ensure smooth international trade and customs clearance.",
  },
  {
    icon: ShieldCheck,
    title: "Food Safety & Hygiene",
    description:
      "Our products are sourced, handled, and processed with a strong focus on food safety, hygiene, and regulatory compliance, ensuring confidence for global buyers.",
  },
  {
    icon: PackageCheck,
    title: "Quality Inspection",
    description:
      "Each shipment undergoes thorough quality verification to ensure consistency, product integrity, packaging accuracy, and customer satisfaction before dispatch.",
  },
  {
    icon: Truck,
    title: "Export Documentation",
    description:
      "We prepare complete export documentation to support efficient customs processing, regulatory compliance, and timely international shipments.",
  },
  {
    icon: Globe2,
    title: "International Trade Standards",
    description:
      "ROOTYM continuously aligns its sourcing, packaging, quality management, and export practices with internationally accepted business and trade standards.",
  },
  {
    icon: CheckCircle2,
    title: "Continuous Improvement",
    description:
      "We regularly enhance our operational processes, quality systems, and customer service to deliver consistent value and build long-term business relationships.",
  },
];

const commitments = [
  "Transparent Business Practices",
  "Ethical & Responsible Sourcing",
  "Reliable Documentation",
  "Consistent Product Quality",
  "On-Time Export Coordination",
  "Customer-Centric Service",
];

export default function ComplianceStandards() {
  return (
    <section className="bg-gradient-to-b from-green-50 to-white py-20 lg:py-28">
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
              Compliance Standards
            </span>

            <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Our Commitment to
              <span className="block text-green-700">
                Quality, Compliance & Trust
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              Certifications are only one part of our commitment. At ROOTYM, we
              follow structured quality management, responsible sourcing,
              documentation excellence, and internationally aligned export
              practices to build lasting confidence with customers across global
              markets.
            </p>
          </motion.div>

          {/* Standards Grid */}

          <motion.div
            variants={containerVariants}
            className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3"
          >
            {standards.map((item) => {
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

                  <p className="mt-5 leading-7 text-gray-600">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Core Commitments */}

          <motion.div
            variants={itemVariants}
            className="mt-20 rounded-3xl border border-green-100 bg-white p-10 shadow-lg"
          >
            <div className="mx-auto max-w-4xl text-center">
              <h3 className="text-3xl font-bold text-gray-900">
                What Every Global Buyer Can Expect
              </h3>

              <p className="mt-5 text-lg leading-8 text-gray-600">
                Every export order is managed with a focus on consistency,
                transparency, quality assurance, and professional execution from
                enquiry through shipment.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {commitments.map((commitment) => (
                <div
                  key={commitment}
                  className="flex items-center gap-3 rounded-2xl border border-green-100 bg-green-50 p-4"
                >
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-700" />

                  <span className="font-medium text-gray-800">
                    {commitment}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bottom Banner */}

          <motion.div
            variants={itemVariants}
            className="mt-20 rounded-3xl bg-gradient-to-r from-green-900 via-green-800 to-emerald-800 p-10 text-center text-white shadow-2xl"
          >
            <h3 className="text-3xl font-bold">
              Excellence Through Consistency
            </h3>

            <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-green-100">
              While certifications establish credibility, consistent execution
              builds lasting trust. ROOTYM is committed to maintaining high
              standards across sourcing, quality assurance, documentation,
              packaging, logistics, and customer service—ensuring dependable
              partnerships for importers, distributors, wholesalers, retailers,
              and food manufacturers worldwide.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm font-semibold text-green-100">
              <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur-md">
                Export Ready
              </span>

              <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur-md">
                Food Safety Focused
              </span>

              <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur-md">
                Quality Assured
              </span>

              <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur-md">
                Transparent Documentation
              </span>

              <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur-md">
                Global Supply Partner
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

 