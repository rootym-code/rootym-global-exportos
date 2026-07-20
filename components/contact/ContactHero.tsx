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

const contactHighlights = [
  {
    icon: Mail,
    value: "< 24 Hrs",
    label: "Average Response Time",
  },
  {
    icon: Globe2,
    value: "Worldwide",
    label: "Export Support",
  },
  {
    icon: Phone,
    value: "B2B",
    label: "Dedicated Buyer Assistance",
  },
  {
    icon: MessageCircle,
    value: "Long-Term",
    label: "Business Partnerships",
  },
];

export default function ContactHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-emerald-950">
      {/* Background */}

      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-24 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-green-500/20 blur-3xl" />

        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-green-500/10 blur-3xl" />

        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      {/* Grid */}

      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <div className="relative mx-auto flex min-h-[82vh] max-w-7xl items-center px-6 py-24 lg:px-8">
        <motion.div
          className="mx-auto max-w-4xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}

          <motion.div
            variants={itemVariants}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-green-400/30 bg-white/10 px-5 py-2 text-sm font-medium text-green-100 backdrop-blur-md"
          >
            <MessageCircle className="h-4 w-4 text-green-300" />
            Global Export Enquiries • Bulk Orders • Strategic Partnerships
          </motion.div>

          {/* Heading */}

          <motion.h1
            variants={itemVariants}
            className="text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl"
          >
            Let's Grow Your
            <span className="block bg-gradient-to-r from-green-300 via-emerald-200 to-lime-300 bg-clip-text text-transparent">
              Global Business Together
            </span>
          </motion.h1>

          {/* Description */}

          <motion.p
            variants={itemVariants}
            className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-green-100/90 md:text-xl"
          >
            Whether you're an importer, distributor, wholesaler, retailer, or
            food manufacturer, ROOTYM is ready to become your trusted sourcing
            partner for premium Indian agricultural products. Our experienced
            team is committed to providing responsive communication, consistent
            quality, and reliable export solutions tailored to your business.
          </motion.p>

          {/* CTA */}

          <motion.div
            variants={itemVariants}
            className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/request-quote"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 font-semibold text-green-900 shadow-xl transition-all duration-300 hover:scale-105 hover:bg-green-50"
            >
              Request a Quote
              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link
              href="#contact-form"
              className="inline-flex items-center rounded-xl border border-white/20 bg-white/10 px-7 py-4 font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20"
            >
              Send an Enquiry
            </Link>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="mt-5 text-sm text-green-200/80"
          >
            We welcome enquiries from importers, distributors, retailers,
            private label brands, and international sourcing partners.
          </motion.p>

          {/* Highlights */}

          <motion.div
            variants={itemVariants}
            className="mt-20 grid grid-cols-2 gap-6 lg:grid-cols-4"
          >
            {contactHighlights.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:border-green-400/30 hover:bg-white/10"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                    <Icon className="h-6 w-6 text-green-300" />
                  </div>

                  <h3 className="mt-5 text-2xl font-bold text-white">
                    {item.value}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-green-100/80">
                    {item.label}
                  </p>
                </div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}