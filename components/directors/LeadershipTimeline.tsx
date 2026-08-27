/**
 * ============================================================
 * ROOTYM Global Export Platform
 * ============================================================
 * Author: Prem Singh
 * Module      : Meet The Directors
 * Feature     : Leadership Timeline
 * Purpose     : Displays the company's leadership journey and
 *               milestones using locale-aware translations
 *               and CMS-managed company identity.
 * ============================================================
 */

"use client";

import { motion, type Variants } from "framer-motion";

import {
  Briefcase,
  Building2,
  Globe,
  Rocket,
  Sprout,
} from "lucide-react";

import { useCompanySettings } from "@/lib/cms/company-settings";
import { useTranslation } from "@/lib/i18n/context";

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
    y: 32,
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

const timeline = [
  {
    key: "experience",
    icon: Briefcase,
  },
  {
    key: "founded",
    icon: Building2,
  },
  {
    key: "today",
    icon: Globe,
  },
  {
    key: "future",
    icon: Sprout,
  },
];

export default function LeadershipTimeline() {
  const { companyName } = useCompanySettings();
  const { t } = useTranslation();

  const resolvedCompanyName = companyName || "ROOTYM";

  return (
    <section className="bg-gradient-to-b from-white to-green-50 py-20 lg:py-28">
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
              {t("about.directorsLeadershipTimeline.badge")}
            </span>

            <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              {t("about.directorsLeadershipTimeline.title.line1")}
              <span className="block text-green-700">
                {t("about.directorsLeadershipTimeline.title.line2")}
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              {t("about.directorsLeadershipTimeline.description")}
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative mt-20">
            <div className="absolute left-6 top-0 hidden h-full w-1 rounded-full bg-green-200 lg:block" />

            <div className="space-y-12">
              {timeline.map((item) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.key}
                    variants={itemVariants}
                    className="relative lg:pl-20"
                  >
                    {/* Timeline Dot */}
                    <div className="absolute left-0 top-3 hidden h-12 w-12 items-center justify-center rounded-full bg-green-700 text-white shadow-lg lg:flex">
                      <Icon className="h-6 w-6" />
                    </div>

                    {/* Mobile Icon */}
                    <div className="mb-6 inline-flex rounded-2xl bg-green-100 p-4 lg:hidden">
                      <Icon className="h-6 w-6 text-green-700" />
                    </div>

                    <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-green-300 hover:shadow-xl">
                      <span className="inline-flex rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-700">
                        {t(
                          `about.directorsLeadershipTimeline.timeline.${item.key}.year`
                        )}
                      </span>

                      <h3 className="mt-5 text-2xl font-bold text-gray-900">
                        {t(
                          `about.directorsLeadershipTimeline.timeline.${item.key}.title`
                        )}
                      </h3>

                      <p className="mt-4 leading-8 text-gray-600">
                        {t(
                          `about.directorsLeadershipTimeline.timeline.${item.key}.description`
                        )}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Future Vision */}
          <motion.div
            variants={itemVariants}
            className="mt-20 overflow-hidden rounded-3xl bg-gradient-to-r from-green-900 via-green-800 to-emerald-800 p-10 text-center text-white shadow-2xl"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
              <Rocket className="h-8 w-8" />
            </div>

            <h3 className="mt-6 text-3xl font-bold">
              {t("about.directorsLeadershipTimeline.futureVision.title")}
            </h3>

            <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-green-100">
              {t("about.directorsLeadershipTimeline.futureVision.description")}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}