"use client";

import { motion, type Variants } from "framer-motion";
import {
  Building2,
  Globe2,
  PackageCheck,
  Users,
} from "lucide-react";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
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

const stats = [
  {
    icon: Building2,
    value: "2025",
    title: "Founded",
    description:
      "Established with a clear vision to become a trusted global supplier of premium Indian agricultural products.",
  },
  {
    icon: Globe2,
    value: "Global",
    title: "Market Reach",
    description:
      "Supporting importers, wholesalers, distributors, retailers, and food manufacturers across international markets.",
  },
  {
    icon: PackageCheck,
    value: "6+",
    title: "Core Product Categories",
    description:
      "A curated portfolio of premium agricultural and food products prepared for global sourcing requirements.",
  },
  {
    icon: Users,
    value: "100%",
    title: "Buyer Commitment",
    description:
      "Focused on transparency, responsive communication, and long-term partnerships built on trust.",
  },
];

export default function CompanyStats() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.06),transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
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
              Buyer Confidence
            </span>

            <h2 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Built for

              <span className="block text-green-700">
                Global Trade
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              ROOTYM combines trusted sourcing, export-ready operations,
              and customer-focused service to help international buyers
              build reliable supply partnerships with India.
            </p>
          </motion.div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <motion.div
                  key={stat.title}
                  variants={fadeUpVariants}
                  className="group rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-green-200 hover:shadow-xl"
                >
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 transition-colors duration-300 group-hover:bg-green-700">
                    <Icon className="h-10 w-10 text-green-700 transition-colors duration-300 group-hover:text-white" />
                  </div>

                  <h3 className="mt-8 text-5xl font-extrabold text-green-700">
                    {stat.value}
                  </h3>

                  <h4 className="mt-4 min-h-[64px] text-2xl font-bold text-slate-900">
                    {stat.title}
                  </h4>

                  <p className="mt-4 leading-7 text-slate-600">
                    {stat.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Achievement Banner */}
          <motion.div
            variants={fadeUpVariants}
            className="mt-20 overflow-hidden rounded-3xl border border-green-100 bg-gradient-to-r from-green-700 via-green-600 to-green-700 shadow-xl"
          >
            <div className="grid gap-10 p-10 lg:grid-cols-2 lg:items-center lg:p-14">
              <div className="text-white">
                <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
                  Growing with Our Global Partners
                </span>

                <h3 className="mt-6 text-4xl font-bold leading-tight">
                  Building Confidence.
                  <br />
                  Delivering Consistency.
                  <br />
                  Growing Together.
                </h3>

                <p className="mt-6 text-lg leading-8 text-green-50">
                  ROOTYM continues to strengthen its network of trusted
                  farmers, manufacturers, logistics partners, and global
                  buyers. Our focus is to deliver consistent quality,
                  reliable supply, and transparent export solutions that
                  create long-term value across the agricultural supply
                  chain.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                  <h4 className="text-3xl font-bold text-white">
                    Verified Sourcing
                  </h4>

                  <p className="mt-3 text-green-100">
                    Reliable sourcing through trusted suppliers and farming
                    communities.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                  <h4 className="text-3xl font-bold text-white">
                    Flexible Supply
                  </h4>

                  <p className="mt-3 text-green-100">
                    Scalable sourcing capabilities to support growing global
                    requirements.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                  <h4 className="text-3xl font-bold text-white">
                    Export Compliance
                  </h4>

                  <p className="mt-3 text-green-100">
                    Focused on documentation, quality assurance, and
                    international trade requirements.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                  <h4 className="text-3xl font-bold text-white">
                    Continuous Improvement
                  </h4>

                  <p className="mt-3 text-green-100">
                    Investing in technology, innovation, and sustainable growth
                    to serve customers worldwide.
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