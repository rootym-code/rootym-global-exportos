"use client";

import { motion, type Variants } from "framer-motion";
import {
  BadgeCheck,
  Boxes,
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
      "Products are sourced from trusted suppliers and undergo quality verification before shipment.",
  },
  {
    icon: FileCheck2,
    title: "Complete Documentation",
    description:
      "Accurate export documentation helps ensure efficient customs clearance and international trade compliance.",
  },
  {
    icon: Ship,
    title: "Reliable Export Logistics",
    description:
      "Working with experienced logistics partners to ensure safe and timely international deliveries.",
  },
  {
    icon: BadgeCheck,
    title: "Regulatory Compliance",
    description:
      "Business processes are aligned with applicable export regulations and customer-specific requirements.",
  },
  {
    icon: Globe2,
    title: "Global Market Readiness",
    description:
      "Prepared to serve buyers across multiple international markets with professionalism and consistency.",
  },
  {
    icon: Boxes,
    title: "Packaging Excellence",
    description:
      "Export-ready packaging solutions designed to protect product quality throughout the supply chain.",
  },
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
          {/* Heading */}

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
                Beyond Every Shipment
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              Every export shipment represents our commitment to quality,
              compliance, reliability and long-term customer satisfaction. Our
              processes are designed to minimize risk while maximizing trust.
            </p>
          </motion.div>

          {/* Assurance Grid */}

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

                  <p className="mt-4 leading-7 text-gray-600">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Export Commitment */}

          <motion.div
            variants={itemVariants}
            className="mt-20 rounded-3xl bg-gradient-to-r from-green-900 via-green-800 to-emerald-800 p-10 shadow-2xl"
          >
            <div className="mx-auto max-w-5xl text-center">
              <h3 className="text-3xl font-bold text-white">
                Our Export Commitment
              </h3>

              <p className="mt-6 text-lg leading-8 text-green-100">
                At ROOTYM, exporting is more than moving products across
                borders. It is about building trust, maintaining quality,
                ensuring compliance, and creating lasting relationships with
                customers around the world. Every shipment reflects our
                dedication to excellence and our vision of making Indian
                agricultural products globally respected.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}