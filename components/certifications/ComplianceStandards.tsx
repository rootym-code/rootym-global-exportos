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
      "Compliance with applicable export regulations, documentation requirements and statutory obligations.",
  },
  {
    icon: ShieldCheck,
    title: "Food Safety",
    description:
      "Products are sourced and handled following food safety practices to meet customer and regulatory expectations.",
  },
  {
    icon: PackageCheck,
    title: "Quality Inspection",
    description:
      "Each shipment undergoes quality verification before dispatch to ensure consistency and customer satisfaction.",
  },
  {
    icon: Truck,
    title: "Export Documentation",
    description:
      "Accurate documentation supports smooth customs clearance and international trade operations.",
  },
  {
    icon: Globe2,
    title: "International Standards",
    description:
      "Continuous alignment with internationally accepted quality and export best practices.",
  },
  {
    icon: CheckCircle2,
    title: "Continuous Improvement",
    description:
      "Regular review and enhancement of processes to maintain operational excellence and customer confidence.",
  },
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
              Our Commitment To
              <span className="block text-green-700">
                Quality & Compliance
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              Beyond certifications, we follow structured quality processes,
              documentation standards and responsible business practices that
              support reliable international trade.
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

                  <p className="mt-4 leading-7 text-gray-600">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
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
              Certifications establish credibility, while consistent execution
              builds trust. Our focus is to maintain high standards throughout
              sourcing, quality assurance, documentation, logistics and customer
              service.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}