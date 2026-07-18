/**
 * File: components/sections/Hero.tsx
 * ROOTYM Frontend Sprint 007
 */

"use client";

import { motion } from "framer-motion";

import { Button } from "@/components/ui/Button";
import {
  fadeUp,
  heroReveal,
  hoverLiftScale,
  cardViewport,
} from "@/lib/motion";

import TrustBadge from "./TrustBadge";
import StatCard from "./StatCard";
import GlobalExportPanel from "@/components/animations/GlobalExportPanel";

const trustItems = [
  "APEDA Registered Exporter",
  "Export Documentation Support",
  "Global Logistics Assistance",
  "Quality Assured Supply",
];

const stats = [
  { value: "25+", label: "Export Products" },
  { value: "18+", label: "Target Countries" },
  { value: "99.9%", label: "On-Time Delivery" },
  { value: "24/7", label: "Buyer Support" },
];

export default function Hero() {
  return (
    <section className="relative mx-auto max-w-7xl overflow-hidden px-6 pb-24 pt-32">
      <motion.div
        aria-hidden
        className="absolute -left-36 -top-36 h-[420px] w-[420px] rounded-full bg-green-200 blur-3xl"
        animate={{ scale: [1, 1.08, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute right-[-10rem] top-20 h-[520px] w-[520px] rounded-full bg-emerald-100 blur-3xl"
        animate={{ scale: [1.08, 1, 1.08], opacity: [0.08, 0.18, 0.08] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative grid items-center gap-16 lg:grid-cols-2">
        <motion.div
          variants={heroReveal}
          initial="hidden"
          animate="visible"
        >
          <motion.span
            variants={fadeUp}
            {...hoverLiftScale}
            className="inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-[#2E7D32]"
          >
            Trusted Indian Export Partner
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="mt-6 text-5xl font-extrabold leading-tight tracking-tight text-gray-900 lg:text-7xl"
          >
            Source Premium Indian Agricultural Products with Confidence
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-8 text-lg leading-8 text-gray-600 lg:text-xl"
          >
            ROOTYM partners with importers, distributors, supermarkets and food
            processors worldwide to source premium fruits, vegetables, grains,
            spices and value-added food products from India with reliable
            sourcing, export documentation support and dependable global
            logistics.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <motion.div {...hoverLiftScale}>
              <Button>Request a Quote</Button>
            </motion.div>

            <motion.div {...hoverLiftScale}>
              <Button variant="secondary">
                Browse Export Products
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-12 grid gap-4 sm:grid-cols-2"
          >
            {trustItems.map((item) => (
              <motion.div key={item} {...hoverLiftScale}>
                <TrustBadge text={item} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <GlobalExportPanel />
        </motion.div>
      </div>

      <motion.div
        className="mt-24 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        variants={heroReveal}
        initial="hidden"
        whileInView="visible"
        viewport={cardViewport}
      >
        {stats.map((stat) => (
          <motion.div key={stat.label} {...hoverLiftScale}>
            <StatCard value={stat.value} label={stat.label} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
