/**
 * ============================================================
 * ROOTYM Global Export Platform
 * ============================================================
 * Author: Prem Singh
 * Module      : Meet The Directors
 * Feature     : Leadership Philosophy
 * Purpose     : Displays leadership principles and philosophy
 *               using locale-aware translations and CMS company identity.
 * ============================================================
 */

"use client";

import { motion, type Variants } from "framer-motion";

import {
  Compass,
  Globe,
  Handshake,
  Leaf,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import { useCompanySettings } from "@/lib/cms/company-settings";
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

const principles = [
  {
    key: "trust",
    icon: Handshake,
  },
  {
    key: "quality",
    icon: ShieldCheck,
  },
  {
    key: "global",
    icon: Globe,
  },
  {
    key: "responsible",
    icon: Leaf,
  },
  {
    key: "improvement",
    icon: TrendingUp,
  },
  {
    key: "purpose",
    icon: Compass,
  },
];

export default function LeadershipPhilosophy() {
  const { companyName } = useCompanySettings();
  const { t } = useTranslation();

  const resolvedCompanyName = companyName || "ROOTYM";

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-20 lg:py-28">
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
              {t("about.directorsLeadershipPhilosophy.badge")}
            </span>

            <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              {t("about.directorsLeadershipPhilosophy.title.line1")}

              <span className="block text-green-700">
                {t("about.directorsLeadershipPhilosophy.title.line2")}
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              {t(
                "about.directorsLeadershipPhilosophy.description.beforeCompany"
              )}
              {resolvedCompanyName}
              {t(
                "about.directorsLeadershipPhilosophy.description.afterCompany"
              )}
            </p>
          </motion.div>

          {/* Philosophy Quote */}
          <motion.div
            variants={itemVariants}
            className="mx-auto mt-14 max-w-5xl rounded-3xl border border-green-200 bg-gradient-to-r from-green-900 to-emerald-800 p-10 text-center text-white shadow-xl"
          >
            <p className="text-xl font-medium leading-9 md:text-2xl">
              &quot;{t("about.directorsLeadershipPhilosophy.quote")}&quot;
            </p>
          </motion.div>

          {/* Principles */}
          <motion.div
            variants={containerVariants}
            className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          >
            {principles.map((principle) => {
              const Icon = principle.icon;

              return (
                <motion.div
                  key={principle.key}
                  variants={itemVariants}
                  className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-green-300 hover:shadow-xl"
                >
                  <div className="inline-flex rounded-2xl bg-green-100 p-4">
                    <Icon className="h-7 w-7 text-green-700" />
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-gray-900">
                    {t(
                      `about.directorsLeadershipPhilosophy.principles.${principle.key}.title`
                    )}
                  </h3>

                  <p className="mt-4 leading-7 text-gray-600">
                    {t(
                      `about.directorsLeadershipPhilosophy.principles.${principle.key}.description`
                    )}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Closing */}
          <motion.div
            variants={itemVariants}
            className="mx-auto mt-20 max-w-4xl text-center"
          >
            <p className="text-lg leading-8 text-gray-600">
              {t("about.directorsLeadershipPhilosophy.closing.beforeCompany")}
              {resolvedCompanyName}
              {t("about.directorsLeadershipPhilosophy.closing.afterCompany")}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}