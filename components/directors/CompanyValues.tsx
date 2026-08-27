/**
 * ============================================================
 * ROOTYM Global Export Platform
 * ============================================================
 * Author: Prem Singh
 * Module      : Meet The Directors
 * Feature     : Company Values
 * Purpose     : Displays the company's core values and the
 *               principles that guide business decisions
 *               using locale-aware translations.
 * ============================================================
 */

"use client";

import { motion, type Variants } from "framer-motion";

import {
  Award,
  Globe2,
  HeartHandshake,
  Lightbulb,
  ShieldCheck,
  Sprout,
} from "lucide-react";

import { useTranslation } from "@/lib/i18n/context";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
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

const values = [
  {
    key: "integrity",
    icon: ShieldCheck,
  },
  {
    key: "quality",
    icon: Award,
  },
  {
    key: "customer",
    icon: HeartHandshake,
  },
  {
    key: "global",
    icon: Globe2,
  },
  {
    key: "sustainability",
    icon: Sprout,
  },
  {
    key: "innovation",
    icon: Lightbulb,
  },
];

export default function CompanyValues() {
  const { t } = useTranslation();

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {/* Heading */}
          <motion.div
            variants={itemVariants}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="inline-flex rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-700">
              {t("about.directorsCompanyValues.badge")}
            </span>

            <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              {t("about.directorsCompanyValues.title.line1")}
              <span className="block text-green-700">
                {t("about.directorsCompanyValues.title.line2")}
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              {t("about.directorsCompanyValues.description")}
            </p>
          </motion.div>

          {/* Values Grid */}
          <motion.div
            variants={containerVariants}
            className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3"
          >
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <motion.div
                  key={value.key}
                  variants={itemVariants}
                  className="group rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-green-300 hover:shadow-xl"
                >
                  <div className="inline-flex rounded-2xl bg-green-100 p-4 transition-colors duration-300 group-hover:bg-green-700">
                    <Icon className="h-7 w-7 text-green-700 transition-colors duration-300 group-hover:text-white" />
                  </div>

                  <h3 className="mt-6 text-2xl font-bold text-gray-900">
                    {t(
                      `about.directorsCompanyValues.values.${value.key}.title`
                    )}
                  </h3>

                  <p className="mt-4 leading-7 text-gray-600">
                    {t(
                      `about.directorsCompanyValues.values.${value.key}.description`
                    )}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Bottom Statement */}
          <motion.div
            variants={itemVariants}
            className="mt-20 overflow-hidden rounded-3xl bg-gradient-to-r from-green-900 via-green-800 to-emerald-800 p-10 text-center text-white shadow-2xl"
          >
            <h3 className="text-3xl font-bold">
              {t("about.directorsCompanyValues.bottom.title")}
            </h3>

            <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-green-100">
              {t("about.directorsCompanyValues.bottom.description")}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}