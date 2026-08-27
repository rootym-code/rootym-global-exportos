/**
 * ============================================================
 * ROOTYM Global Export Platform
 * ============================================================
 * Author: Prem Singh
 * Module      : About
 * Feature     : Directors Introduction
 * Purpose     : Displays the leadership philosophy and company
 *               vision using CMS-managed company identity and
 *               locale-aware translations.
 * ============================================================
 */

"use client";

import { motion, type Variants } from "framer-motion";

import { Globe, Handshake, Leaf, Target } from "lucide-react";

import { useTranslation } from "@/lib/i18n/context";

import { useCompanySettings } from "@/lib/cms/company-settings";

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

const highlights = [
  {
    key: "globalVision",
    icon: Globe,
  },
  {
    key: "trustedRelationships",
    icon: Handshake,
  },
  {
    key: "sustainableGrowth",
    icon: Leaf,
  },
  {
    key: "customerCommitment",
    icon: Target,
  },
];

export default function DirectorsIntroduction() {
  const { t } = useTranslation();

  const { companyName } = useCompanySettings();

  const resolvedCompanyName = companyName || "ROOTYM";

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Section Heading */}
          <motion.div
            variants={itemVariants}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="inline-flex rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-700">
              {t("about.directorsIntroduction.badge")}
            </span>

            <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              {t("about.directorsIntroduction.title.line1")}

              <span className="block text-green-700">
                {t("about.directorsIntroduction.title.line2")}
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-600">
  {t("about.directorsIntroduction.description").replace(
    "{companyName}",
    resolvedCompanyName
  )}
</p>
          </motion.div>

          {/* Content */}
          <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div variants={itemVariants}>
              <div className="rounded-3xl border border-green-100 bg-gradient-to-br from-green-50 to-white p-10 shadow-sm">
                <h3 className="text-2xl font-bold text-gray-900">
                  {t("about.directorsIntroduction.philosophy.title")}
                </h3>

                <p className="mt-6 leading-8 text-gray-600">
                  {t(
                    "about.directorsIntroduction.philosophy.paragraph1"
                  )}
                </p>

                <p className="mt-5 leading-8 text-gray-600">
                  {t(
                    "about.directorsIntroduction.philosophy.paragraph2"
                  )}
                </p>

                <div className="mt-8 rounded-2xl border border-green-200 bg-white p-6">
                  <p className="text-lg font-semibold italic text-green-800">
                    &quot;
                    {t(
                      "about.directorsIntroduction.philosophy.quote"
                    )}
                    &quot;
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={containerVariants}
              className="grid gap-6 sm:grid-cols-2"
            >
              {highlights.map((item) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.key}
                    variants={itemVariants}
                    className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-green-300 hover:shadow-lg"
                  >
                    <div className="inline-flex rounded-xl bg-green-100 p-3">
                      <Icon className="h-6 w-6 text-green-700" />
                    </div>

                    <h3 className="mt-5 text-xl font-semibold text-gray-900">
                      {t(
                        `about.directorsIntroduction.highlights.${item.key}.title`
                      )}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-gray-600">
                      {t(
                        `about.directorsIntroduction.highlights.${item.key}.description`
                      )}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}