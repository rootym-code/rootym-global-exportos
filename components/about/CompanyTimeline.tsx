"use client";

import { motion, type Variants } from "framer-motion";
import {
  Building2,
  FileBadge,
  Globe2,
  Rocket,
} from "lucide-react";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeUpVariants: Variants = {
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
    },
  },
};

const milestones = [
  {
    year: "Dec 2025",
    icon: Building2,
    title: "ROOTYM Established",
    description:
      "ROOTYM Agro Harvest Private Limited was established with the vision of connecting premium Indian agricultural products with international buyers through trusted sourcing and professional export services.",
  },
  {
    year: "2026",
    icon: FileBadge,
    title: "Building Export Readiness",
    description:
      "Strengthened export capabilities through essential registrations, regulatory compliance, and internationally aligned business processes.",
  },
  {
    year: "2026",
    icon: Globe2,
    title: "Expanding Global Partnerships",
    description:
      "Building relationships with importers, logistics partners, manufacturers, and sourcing networks to support reliable international trade.",
  },
  {
    year: "Future",
    icon: Rocket,
    title: "Future Growth",
    description:
      "Expanding our product portfolio, strengthening supply partnerships, and becoming a trusted sourcing partner for buyers across global markets.",
  },
];

export default function CompanyTimeline() {
  return (
    <section className="relative overflow-hidden bg-white py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.08),transparent_50%)]" />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div
            variants={fadeUpVariants}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="inline-flex rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
              ROOTYM Journey
            </span>

            <h2 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Building Trust

              <span className="block text-green-700">
                One Milestone at a Time
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Every milestone reflects our commitment to building a trusted
              agricultural export company through compliance, quality,
              responsible sourcing, and long-term global partnerships.
            </p>
          </motion.div>
          <div className="relative mt-20">
            <div className="absolute left-6 top-0 hidden h-full w-1 rounded-full bg-green-100 md:block" />

            <div className="space-y-12">
              {milestones.map((item) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.title}
                    variants={fadeUpVariants}
                    className="relative flex flex-col gap-6 md:flex-row md:gap-10"
                  >
                    <div className="relative flex-shrink-0">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-700 shadow-lg">
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                    </div>

                    <div className="flex-1 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:shadow-xl">
                      <span className="inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                        {item.year}
                      </span>

                      <h3 className="mt-5 text-2xl font-bold text-slate-900">
                        {item.title}
                      </h3>

                      <p className="mt-4 leading-8 text-slate-600">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Closing Vision Section */}
          <motion.div
            variants={fadeUpVariants}
            className="mt-20 overflow-hidden rounded-3xl border border-green-100 bg-gradient-to-r from-green-700 via-green-600 to-green-700 shadow-xl"
          >
            <div className="grid gap-10 p-10 lg:grid-cols-2 lg:items-center lg:p-14">
              <div className="text-white">
                <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
                  Our Future Vision
                </span>

                <h3 className="mt-6 text-4xl font-bold leading-tight">
                  Growing Together
                  <br />
                  with Our Global Partners
                </h3>

                <p className="mt-6 text-lg leading-8 text-green-50">
                  Our journey has only begun. ROOTYM continues to strengthen
                  partnerships with farmers, manufacturers, logistics
                  providers, and international buyers while focusing on
                  consistent quality, responsible sourcing, and dependable
                  export solutions for global markets.
                </p>
              </div>

              <div className="space-y-5">
                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                  <h4 className="text-2xl font-bold text-white">
                    Expand Global Reach
                  </h4>

                  <p className="mt-3 leading-7 text-green-100">
                    Building stronger presence across international markets
                    through trusted partnerships and reliable export
                    capabilities.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                  <h4 className="text-2xl font-bold text-white">
                    Strengthen Farming Communities
                  </h4>

                  <p className="mt-3 leading-7 text-green-100">
                    Creating sustainable opportunities for Indian farmers
                    through responsible sourcing and long-term partnerships.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                  <h4 className="text-2xl font-bold text-white">
                    Deliver Consistent Excellence
                  </h4>

                  <p className="mt-3 leading-7 text-green-100">
                    Providing export-quality products backed by transparency,
                    compliance, and exceptional customer service.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}