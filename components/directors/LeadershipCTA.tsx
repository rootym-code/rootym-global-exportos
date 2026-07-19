"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Mail, Phone } from "lucide-react";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
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

export default function LeadershipCTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-emerald-900 py-24">
      {/* Background Glow */}

      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-green-500/20 blur-3xl" />

        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="absolute right-0 top-10 h-72 w-72 rounded-full bg-lime-400/10 blur-3xl" />
      </div>

      {/* Grid */}

      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <motion.div
        className="relative mx-auto max-w-5xl px-6 text-center lg:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.span
          variants={itemVariants}
          className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-green-200 backdrop-blur"
        >
          Let's Build Together
        </motion.span>

        <motion.h2
          variants={itemVariants}
          className="mt-8 text-4xl font-bold tracking-tight text-white md:text-5xl"
        >
          Partner With ROOTYM
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-green-100"
        >
          Whether you're an international buyer, importer, distributor,
          wholesaler or strategic partner, our leadership team is committed to
          building long-term business relationships founded on trust, quality
          and transparency.
        </motion.p>

        {/* CTA Buttons */}

        <motion.div
          variants={itemVariants}
          className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/request-quote"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 font-semibold text-green-900 transition-all duration-300 hover:scale-105 hover:bg-green-50"
          >
            Request a Quote
            <ArrowRight className="h-5 w-5" />
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center rounded-xl border border-white/20 bg-white/10 px-7 py-4 font-semibold text-white backdrop-blur transition-all duration-300 hover:bg-white/20"
          >
            Contact Us
          </Link>
        </motion.div>

        {/* Contact Cards */}

        <motion.div
          variants={itemVariants}
          className="mt-16 grid gap-6 md:grid-cols-2"
        >
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <Mail className="h-6 w-6 text-green-200" />
            </div>

            <h3 className="mt-5 text-xl font-semibold text-white">
              Email Us
            </h3>

            <p className="mt-3 text-green-100">
              Reach our export team for product inquiries, quotations and
              international business discussions.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <Phone className="h-6 w-6 text-green-200" />
            </div>

            <h3 className="mt-5 text-xl font-semibold text-white">
              Let's Connect
            </h3>

            <p className="mt-3 text-green-100">
              Our team is ready to discuss your sourcing requirements and help
              build a reliable long-term partnership.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}