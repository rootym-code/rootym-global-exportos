"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Globe2, Leaf } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                Animations                                  */
/* -------------------------------------------------------------------------- */

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const fadeUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

/* -------------------------------------------------------------------------- */
/*                               About Hero                                   */
/* -------------------------------------------------------------------------- */

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-green-50 to-emerald-100">
      {/* Animated Background */}

      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -left-24 -top-28 h-96 w-96 rounded-full bg-green-300/20 blur-3xl"
        />

        <motion.div
          animate={{
            x: [0, -50, 20, 0],
            y: [0, 20, -20, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-0 top-16 h-[420px] w-[420px] rounded-full bg-emerald-400/15 blur-3xl"
        />
      </div>

      <div className="relative mx-auto flex min-h-[78vh] max-w-7xl items-center px-6 py-24 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-4xl"
        >
          {/* Breadcrumb */}

          <motion.div
            variants={fadeUpVariants}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/80 px-5 py-2 text-sm font-medium text-green-700 backdrop-blur"
          >
            <Link
              href="/"
              className="transition-colors hover:text-green-900"
            >
              Home
            </Link>

            <ArrowRight className="h-4 w-4" />

            <span className="font-semibold text-[#2E7D32]">
              About Us
            </span>
          </motion.div>

          {/* Tagline */}

          <motion.div
            variants={fadeUpVariants}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#2E7D32]/10 px-5 py-2 text-sm font-semibold text-[#2E7D32]"
          >
            <Leaf className="h-4 w-4" />

            Rooted in India. Trusted Worldwide.
          </motion.div>

          {/* Heading */}

          <motion.h1
            variants={fadeUpVariants}
            className="text-5xl font-black leading-tight tracking-tight text-slate-900 md:text-6xl lg:text-7xl"
          >
            Building Global Trust

            <br />

            <span className="bg-gradient-to-r from-[#2E7D32] to-[#43A047] bg-clip-text text-transparent">
              Through Premium Agricultural Exports
            </span>
          </motion.h1>

          {/* Description */}

          <motion.p
            variants={fadeUpVariants}
            className="mt-8 max-w-3xl text-lg leading-9 text-slate-600 md:text-xl"
          >
            ROOTYM Agro Harvest Private Limited is committed to delivering
            premium-quality Indian agricultural products to international
            markets with transparency, sustainability, and world-class export
            standards.

            <br />
            <br />

            Our mission is to bridge Indian farmers with global buyers through
            technology, quality assurance, and trusted partnerships.
          </motion.p>
                    {/* Action Buttons */}

                    <motion.div
            variants={fadeUpVariants}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link
              href="/request-quote"
              className="inline-flex items-center gap-2 rounded-xl bg-[#2E7D32] px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#256B29] hover:shadow-xl"
            >
              Request Quote

              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-green-200 bg-white/80 px-8 py-4 font-semibold text-[#2E7D32] backdrop-blur transition-all duration-300 hover:border-[#2E7D32] hover:bg-white"
            >
              Contact Us
            </Link>
          </motion.div>

          {/* Statistics */}

          <motion.div
            variants={fadeUpVariants}
            className="mt-14 grid gap-5 sm:grid-cols-3"
          >
            <div className="rounded-2xl border border-white/70 bg-white/70 p-6 shadow-lg backdrop-blur">
              <div className="text-3xl font-black text-[#2E7D32]">
                100%
              </div>

              <p className="mt-2 text-sm font-medium text-slate-600">
                Quality Focused Export Operations
              </p>
            </div>

            <div className="rounded-2xl border border-white/70 bg-white/70 p-6 shadow-lg backdrop-blur">
              <div className="text-3xl font-black text-[#2E7D32]">
                APEDA
              </div>

              <p className="mt-2 text-sm font-medium text-slate-600">
                Registered Export Organization
              </p>
            </div>

            <div className="rounded-2xl border border-white/70 bg-white/70 p-6 shadow-lg backdrop-blur">
              <div className="flex items-center gap-2 text-3xl font-black text-[#2E7D32]">
                <Globe2 className="h-8 w-8" />

                Global
              </div>

              <p className="mt-2 text-sm font-medium text-slate-600">
                Connecting Indian Agriculture with International Buyers
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Fade */}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}