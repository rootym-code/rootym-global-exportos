"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Globe2,
  MapPinned,
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

const markets = [
  "United Arab Emirates",
  "Saudi Arabia",
  "Sri Lanka",
  "Europe",
  "Africa",
  "Asia-Pacific",
];

export default function GlobalPresence() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.08),transparent_50%)]" />

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
              Global Markets
            </span>

            <h2 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Connecting Indian Agriculture

              <span className="block text-green-700">
                to Global Markets
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              ROOTYM works with international buyers by delivering premium
              Indian agricultural products through trusted sourcing,
              export-ready processes, quality assurance, and dependable
              logistics support.
            </p>
          </motion.div>
          <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Left */}

            <motion.div
              variants={fadeUpVariants}
              className="rounded-3xl border border-green-100 bg-white p-10 shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100">
                  <Globe2 className="h-8 w-8 text-green-700" />
                </div>

                <div>
                  <h3 className="text-3xl font-bold text-slate-900">
                    Target Export Markets
                  </h3>

                  <p className="mt-2 text-slate-600">
                    Building long-term partnerships across key international
                    markets.
                  </p>
                </div>
              </div>

              <div className="mt-10 grid gap-4">
                {markets.map((market) => (
                  <div
                    key={market}
                    className="flex items-center gap-4 rounded-2xl border border-green-100 bg-green-50 p-4"
                  >
                    <MapPinned className="h-6 w-6 text-green-700" />

                    <span className="font-medium text-slate-800">
                      {market}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                href="/request-quote"
                className="mt-10 inline-flex items-center gap-2 rounded-xl bg-green-700 px-6 py-4 font-semibold text-white transition hover:bg-green-800"
              >
                Request an Export Quote

                <ArrowRight className="h-5 w-5" />
              </Link>
            </motion.div>

            {/* Right */}
            <motion.div
              variants={fadeUpVariants}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-green-900 p-10 text-white shadow-2xl"
            >
              {/* Decorative Background */}

              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-green-500/10 blur-3xl" />
              <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

              <div className="relative">
                <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full border border-white/20 bg-white/5">
                  <Globe2 className="h-20 w-20 text-green-300" />
                </div>

                <div className="mt-10 grid gap-5">
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur">
                    <div className="flex items-start gap-4">
                      <Ship className="mt-1 h-8 w-8 text-green-300" />

                      <div>
                        <h4 className="text-xl font-semibold">
                          Export Logistics
                        </h4>

                        <p className="mt-2 leading-7 text-slate-300">
                          Coordinated export logistics supported by trusted
                          freight, documentation, and supply chain partners
                          for reliable international deliveries.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur">
                    <div className="flex items-start gap-4">
                      <Globe2 className="mt-1 h-8 w-8 text-green-300" />

                      <div>
                        <h4 className="text-xl font-semibold">
                          Buyer Partnerships
                        </h4>

                        <p className="mt-2 leading-7 text-slate-300">
                          Building lasting relationships with importers,
                          wholesalers, distributors, retailers, and food
                          manufacturers across international markets.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur">
                    <div className="flex items-start gap-4">
                      <MapPinned className="mt-1 h-8 w-8 text-green-300" />

                      <div>
                        <h4 className="text-xl font-semibold">
                          From India to the World
                        </h4>

                        <p className="mt-2 leading-7 text-slate-300">
                          Delivering premium Indian agricultural products with
                          a strong focus on quality, transparency, compliance,
                          and customer satisfaction.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 rounded-2xl border border-green-400/20 bg-green-500/10 p-6 text-center">
                  <h4 className="text-2xl font-bold">
                    Rooted in India. Trusted Worldwide.
                  </h4>

                  <p className="mt-3 leading-7 text-green-100">
                    We continue to expand our international footprint by
                    delivering dependable sourcing, export-quality products,
                    and responsive customer support for buyers around the
                    world.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}