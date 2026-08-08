"use client";

import { motion, type Variants } from "framer-motion";
import {
  CheckCircle2,
  ClipboardCheck,
  Globe2,
  PackageCheck,
  ShieldCheck,
  Truck,
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

const standards = [
  {
    icon: ClipboardCheck,
    key: "regulatory",
  },
  {
    icon: ShieldCheck,
    key: "foodSafety",
  },
  {
    icon: PackageCheck,
    key: "quality",
  },
  {
    icon: Truck,
    key: "documentation",
  },
  {
    icon: Globe2,
    key: "international",
  },
  {
    icon: CheckCircle2,
    key: "improvement",
  },
];

const commitmentKeys = [
  "transparency",
  "ethicalSourcing",
  "documentation",
  "quality",
  "coordination",
  "customerService",
];

export default function ComplianceStandards() {
  const { t } = useTranslation();

  return (
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
          {t("certifications.compliance.badge")}
        </span>

        <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
          {t("certifications.compliance.title.line1")}

          <span className="block text-green-700">
            {t("certifications.compliance.title.line2")}
          </span>
        </h2>

        <p className="mt-6 text-lg leading-8 text-gray-600">
          {t("certifications.compliance.description")}
        </p>
      </motion.div>

      {/* Standards Grid */}

      <motion.div
        variants={containerVariants}
        className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3"
      >
        {standards.map((item) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.key}
              variants={itemVariants}
              className="group rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-green-300 hover:shadow-xl"
            >
              <div className="inline-flex rounded-2xl bg-green-100 p-4 transition-colors duration-300 group-hover:bg-green-700">
                <Icon className="h-7 w-7 text-green-700 transition-colors duration-300 group-hover:text-white" />
              </div>

              <h3 className="mt-6 text-2xl font-bold text-gray-900">
                {t(`certifications.compliance.standards.${item.key}.title`)}
              </h3>

              <p className="mt-5 leading-7 text-gray-600">
                {t(
                  `certifications.compliance.standards.${item.key}.description`,
                )}
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Core Commitments */}

      <motion.div
        variants={itemVariants}
        className="mt-20 rounded-3xl border border-green-100 bg-white p-10 shadow-lg"
      >
        <div className="mx-auto max-w-4xl text-center">
          <h3 className="text-3xl font-bold text-gray-900">
            {t("certifications.compliance.commitments.title")}
          </h3>

          <p className="mt-5 text-lg leading-8 text-gray-600">
            {t("certifications.compliance.commitments.description")}
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {commitmentKeys.map((key) => (
            <div
              key={key}
              className="flex items-center gap-3 rounded-2xl border border-green-100 bg-green-50 p-4"
            >
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-700" />

              <span className="font-medium text-gray-800">
                {t(`certifications.compliance.commitments.items.${key}`)}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Bottom Banner */}

      <motion.div
        variants={itemVariants}
        className="mt-20 rounded-3xl bg-gradient-to-r from-green-900 via-green-800 to-emerald-800 p-10 text-center text-white shadow-2xl"
      >
        <h3 className="text-3xl font-bold">
          {t("certifications.compliance.banner.title")}
        </h3>

        <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-green-100">
          {t("certifications.compliance.banner.description")}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm font-semibold text-green-100">
          <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur-md">
            {t("certifications.compliance.banner.badges.exportReady")}
          </span>

          <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur-md">
            {t("certifications.compliance.banner.badges.foodSafety")}
          </span>

          <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur-md">
            {t("certifications.compliance.banner.badges.quality")}
          </span>

          <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur-md">
            {t("certifications.compliance.banner.badges.documentation")}
          </span>

          <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur-md">
            {t("certifications.compliance.banner.badges.globalPartner")}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}