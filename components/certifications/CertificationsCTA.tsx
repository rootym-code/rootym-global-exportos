"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Globe2,
  Mail,
  MessageSquareText,
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

const contactCards = [
  {
    icon: Mail,
    title: "Email Our Export Team",
    description:
      "Share your product requirements, destination country, and sourcing needs. Our export specialists will respond with detailed information and the next steps.",
  },
  {
    icon: Phone,
    title: "Speak With Our Specialists",
    description:
      "Discuss bulk orders, private labeling, documentation, packaging, logistics, and long-term sourcing opportunities with our experienced team.",
  },
  {
    icon: MessageSquareText,
    title: "Fast Business Response",
    description:
      "We aim to respond promptly to all business enquiries, helping importers and distributors move forward with confidence.",
  },
];

export default function CertificationsCTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-emerald-950 py-24">
      {/* Background Effects */}

      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-green-500/20 blur-3xl" />

        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-green-600/10 blur-3xl" />

        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      {/* Background Grid */}

      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto max-w-5xl text-center"
        >
          {/* Badge */}

          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 rounded-full border border-green-400/30 bg-white/10 px-5 py-2 text-sm font-semibold text-green-100 backdrop-blur-md"
          >
            <Globe2 className="h-4 w-4 text-green-300" />
            Trusted Export Partner • Certified Operations • Global Trade Ready
          </motion.div>

          {/* Heading */}

          <motion.h2
            variants={itemVariants}
            className="mt-8 text-4xl font-bold tracking-tight text-white md:text-6xl"
          >
            Ready to Build a
            <span className="block bg-gradient-to-r from-green-300 via-emerald-200 to-lime-300 bg-clip-text text-transparent">
              Long-Term Global Partnership?
            </span>
          </motion.h2>

          {/* Description */}

          <motion.p
            variants={itemVariants}
            className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-green-100/90"
          >
            ROOTYM combines regulatory compliance, quality assurance, ethical
            sourcing, and export expertise to deliver premium Indian
            agricultural products to international buyers. Whether you are an
            importer, distributor, wholesaler, retailer, or food manufacturer,
            our team is ready to support your sourcing requirements with
            dependable service and transparent communication.
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
              href="/contact"
              className="inline-flex items-center rounded-xl border border-white/20 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20"
            >
              Contact Our Team
            </Link>
          </motion.div>

          {/* Trust Statement */}

          <motion.p
            variants={itemVariants}
            className="mx-auto mt-8 max-w-4xl text-sm font-medium tracking-wide text-green-200/80 md:text-base"
          >
            APEDA Registered • IEC Certified • FSSAI Licensed • MSME Registered
            • Startup India Recognized
          </motion.p>

          {/* Contact Cards */}

          <motion.div
            variants={containerVariants}
            className="mt-20 grid gap-6 md:grid-cols-3"
          >
            {contactCards.map((card) => {
              const Icon = card.icon;

              return (
                <motion.div
                  key={card.title}
                  variants={itemVariants}
                  className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition-all duration-300 hover:border-green-400/30 hover:bg-white/10"
                >
                  <Icon className="mx-auto h-10 w-10 text-green-300" />

                  <h3 className="mt-5 text-xl font-semibold text-white">
                    {card.title}
                  </h3>

                  <p className="mt-4 leading-7 text-green-100/80">
                    {card.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

 