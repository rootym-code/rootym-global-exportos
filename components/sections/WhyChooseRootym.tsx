"use client";

import { motion, Variants } from "framer-motion";
import {
  Leaf,
  PackageCheck,
  Ship,
  FileCheck,
  ShieldCheck,
  Handshake,
} from "lucide-react";

const features = [
  {
    icon: Leaf,
    title: "Direct Farm Sourcing",
    description:
      "We work closely with trusted growers across India to deliver fresh, high-quality agricultural products.",
  },
  {
    icon: PackageCheck,
    title: "Export Packaging",
    description:
      "Customized retail and bulk packaging designed to meet international buyer requirements.",
  },
  {
    icon: Ship,
    title: "Global Logistics",
    description:
      "Reliable sea and air freight support with shipment coordination from India to worldwide destinations.",
  },
  {
    icon: FileCheck,
    title: "Export Documentation",
    description:
      "Comprehensive export documentation support including commercial invoices, packing lists and shipment paperwork.",
  },
  {
    icon: ShieldCheck,
    title: "Quality Assurance",
    description:
      "Each shipment is carefully inspected to ensure export-quality standards before dispatch.",
  },
  {
    icon: Handshake,
    title: "Dedicated Buyer Support",
    description:
      "Our team supports importers from the first inquiry through shipment and after-sales assistance.",
  },
];

const sectionVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
      when: "beforeChildren",
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
      duration: 0.55,
      ease: "easeOut",
    },
  },
};

export default function WhyChooseRootym() {
  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.15,
      }}
      className="relative overflow-hidden bg-gradient-to-b from-white via-white to-green-50 py-28"
    >
      {/* Ambient Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, -50, 0],
            scale: [1, 1.12, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-green-200/30 blur-[120px]"
        />

        <motion.div
          animate={{
            x: [0, -70, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-emerald-100/40 blur-[120px]"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Heading */}
        <motion.div
          variants={itemVariants}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.span
            whileHover={{
              scale: 1.05,
            }}
            transition={{
              duration: 0.3,
            }}
            className="inline-flex rounded-full bg-green-100 px-5 py-2 text-sm font-semibold text-[#2E7D32]"
          >
            Why Choose ROOTYM
          </motion.span>

          <motion.h2
            variants={itemVariants}
            className="mt-6 text-5xl font-bold text-gray-900"
          >
            Trusted Export Partner for Global Importers
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mt-6 text-lg leading-8 text-gray-600"
          >
            We combine trusted sourcing, export expertise, quality assurance,
            and buyer-focused support to make importing agricultural products
            from India simple, transparent, and reliable.
          </motion.p>
        </motion.div>

        {/* Feature Cards */}
        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{
                  opacity: 0,
                  y: 60,
                  scale: 0.96,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                viewport={{
                  once: true,
                  amount: 0.2,
                }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.08,
                  ease: "easeOut",
                }}
                whileHover={{
                  y: -12,
                  transition: {
                    duration: 0.25,
                  },
                }}
                className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 shadow-lg"
              >
                {/* Hover Glow */}
                <motion.div
                  initial={{
                    opacity: 0,
                  }}
                  whileHover={{
                    opacity: 1,
                  }}
                  transition={{
                    duration: 0.35,
                  }}
                  className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-100/30 via-transparent to-emerald-100/20"
                />

                <div className="relative">
                  <motion.div
                    whileHover={{
                      rotate: 6,
                      scale: 1.08,
                    }}
                    transition={{
                      duration: 0.3,
                    }}
                    className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 transition-colors group-hover:bg-[#2E7D32]"
                  >
                    <Icon className="h-8 w-8 text-[#2E7D32] transition-colors group-hover:text-white" />
                  </motion.div>

                  <motion.h3
                    whileHover={{
                      x: 4,
                    }}
                    className="mt-8 text-2xl font-bold text-gray-900 transition-colors group-hover:text-[#2E7D32]"
                  >
                    {feature.title}
                  </motion.h3>

                  <p className="mt-4 leading-7 text-gray-600">
                    {feature.description}
                  </p>
                </div>

                {/* Bottom Accent */}
                <motion.div
                  initial={{
                    scaleX: 0,
                  }}
                  whileHover={{
                    scaleX: 1,
                  }}
                  transition={{
                    duration: 0.35,
                  }}
                  className="absolute bottom-0 left-0 h-1 w-full origin-left bg-gradient-to-r from-[#2E7D32] via-green-500 to-emerald-400"
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}