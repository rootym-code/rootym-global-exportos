"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Globe2,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react";

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

const features = [
  {
    icon: Globe2,
    title: "Global Export Partner",
  },
  {
    icon: Mail,
    title: "Fast Business Response",
  },
  {
    icon: Phone,
    title: "Dedicated Support",
  },
];

export default function ContactCTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-emerald-950 py-24">
      {/* Background */}

      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-green-500/20 blur-3xl" />

        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-green-500/10 blur-3xl" />

        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto max-w-5xl text-center"
        >
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 rounded-full border border-green-400/30 bg-white/10 px-5 py-2 text-sm font-semibold text-green-100 backdrop-blur-md">
              <MessageCircle className="h-4 w-4 text-green-300" />
              Let's Build Long-Term Partnerships
            </span>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="mt-8 text-4xl font-bold tracking-tight text-white md:text-6xl"
          >
            Ready to Source Premium
            <span className="block bg-gradient-to-r from-green-300 via-emerald-200 to-lime-300 bg-clip-text text-transparent">
              Agricultural Products?
            </span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-green-100/90"
          >
            Whether you're an importer, distributor, wholesaler or food
            manufacturer, ROOTYM is committed to providing reliable sourcing,
            export expertise and long-term business partnerships.
          </motion.p>

          {/* CTA Buttons */}

          <motion.div
            variants={itemVariants}
            className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/request-quote"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-semibold text-green-900 shadow-xl transition-all duration-300 hover:scale-105 hover:bg-green-50"
            >
              Request a Quote
              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link
              href="/products"
              className="inline-flex items-center rounded-xl border border-white/20 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20"
            >
              Explore Products
            </Link>
          </motion.div>

          {/* Feature Cards */}

          <motion.div
            variants={containerVariants}
            className="mt-20 grid gap-6 md:grid-cols-3"
          >
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md"
                >
                  <Icon className="mx-auto h-10 w-10 text-green-300" />

                  <h3 className="mt-5 text-xl font-semibold text-white">
                    {feature.title}
                  </h3>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}