/**
 * ============================================================
 * ROOTYM Global Export Platform
 * ============================================================
 * Author: Prem Singh
 * Module      : About
 * Feature     : Directors Hero
 * Purpose     : Displays the leadership introduction section
 *               using CMS-managed company identity and
 *               locale-aware translations.
 * ============================================================
 */

"use client";

import Link from "next/link";

import { motion, type Variants } from "framer-motion";

import { ArrowRight, Users } from "lucide-react";

import { useCompanySettings } from "@/lib/cms/company-settings";

import { useTranslation } from "@/lib/i18n/context";

const fadeUp: Variants = {
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

const fadeContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export default function DirectorsHero() {
  const { companyName } = useCompanySettings();

  const { t } = useTranslation();

  const resolvedCompanyName = companyName || "ROOTYM";

  const heroDescription = t("about.directorsHero.description").replace(
    "{companyName}",
    resolvedCompanyName,
  );

  const stats = [
    {
      value: t("about.directorsHero.stats.experience.value"),
      label: t("about.directorsHero.stats.experience.label"),
    },
    {
      value: t("about.directorsHero.stats.vision.value"),
      label: t("about.directorsHero.stats.vision.label"),
    },
    {
      value: t("about.directorsHero.stats.quality.value"),
      label: t("about.directorsHero.stats.quality.label"),
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-emerald-950">
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-20 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-green-500/20 blur-3xl" />

        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-lime-400/10 blur-3xl" />
      </div>

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <div className="relative mx-auto flex min-h-[82vh] max-w-7xl items-center px-6 py-24 lg:px-8">
        <motion.div
          className="mx-auto max-w-4xl text-center"
          variants={fadeContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div
            variants={fadeUp}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-green-400/30 bg-white/10 px-5 py-2 text-sm font-medium text-green-100 backdrop-blur-md"
          >
            <Users className="h-4 w-4 text-green-300" />

            {t("about.directorsHero.badge")}
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={fadeUp}
            className="text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl"
          >
            {t("about.directorsHero.title.line1")}

            <span className="block bg-gradient-to-r from-green-300 via-emerald-200 to-lime-300 bg-clip-text text-transparent">
              {t("about.directorsHero.title.line2")}
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-green-100/90 md:text-xl"
          >
            {heroDescription}
          </motion.p>

          {/* CTA */}
          <motion.div
            variants={fadeUp}
            className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/request-quote"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 font-semibold text-green-900 shadow-xl transition-all duration-300 hover:scale-105 hover:bg-green-50"
            >
              {t("about.directorsHero.buttons.quote")}

              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center rounded-xl border border-white/20 bg-white/10 px-7 py-4 font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20"
            >
              {t("about.directorsHero.buttons.contact")}
            </Link>
          </motion.div>

          {/* Bottom Stats */}
          <motion.div
            variants={fadeUp}
            className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-3"
          >
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
              >
                <h3 className="text-3xl font-bold text-white">
                  {item.value}
                </h3>

                <p className="mt-2 text-sm text-green-100/80">
                  {item.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}