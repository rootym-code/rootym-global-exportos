"use client";

import { motion, type Variants } from "framer-motion";
import {
  BadgeCheck,
  Boxes,
  CheckCircle2,
  FileCheck2,
  Globe2,
  ShieldCheck,
  Ship,
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

const assuranceKeys = [
  {
    icon: ShieldCheck,
    key: "quality",
  },
  {
    icon: FileCheck2,
    key: "documentation",
  },
  {
    icon: Ship,
    key: "logistics",
  },
  {
    icon: BadgeCheck,
    key: "compliance",
  },
  {
    icon: Globe2,
    key: "market",
  },
  {
    icon: Boxes,
    key: "packaging",
  },
];

const exportProcessKeys = [
  "supplierSelection",
  "qualityInspection",
  "packaging",
  "documentation",
  "compliance",
  "shipping",
];

const commitmentKeys = [
  "qualityVerified",
  "documentation",
  "logistics",
  "compliance",
  "partnership",
];

export default function ExportAssurance() {
  const { t } = useTranslation();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      {/* Section Heading */}

      <motion.div
        variants={itemVariants}
        className="mx-auto max-w-3xl text-center"
      >
        <span className="inline-flex rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-700">
          {t("exportAssurance.badge")}
        </span>

        <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
          {t("exportAssurance.title.line1")}
          <span className="block text-green-700">
            {t("exportAssurance.title.line2")}
          </span>
        </h2>

        <p className="mt-6 text-lg leading-8 text-gray-600">
          {t("exportAssurance.description")}
        </p>
      </motion.div>

      {/* Assurance Cards */}

      <motion.div
        variants={containerVariants}
        className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3"
      >
        {assuranceKeys.map((item) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.key}
              variants={itemVariants}
              className="group rounded-3xl border border-gray-200 bg-gradient-to-br from-white to-green-50 p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-green-300 hover:shadow-xl"
            >
              <div className="inline-flex rounded-2xl bg-green-100 p-4 transition-colors duration-300 group-hover:bg-green-700">
                <Icon className="h-7 w-7 text-green-700 transition-colors duration-300 group-hover:text-white" />
              </div>

              <h3 className="mt-6 text-2xl font-bold text-gray-900">
                {t(`exportAssurance.cards.${item.key}.title`)}
              </h3>

              <p className="mt-5 leading-7 text-gray-600">
                {t(`exportAssurance.cards.${item.key}.description`)}
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Export Workflow */}

      <motion.div
        variants={itemVariants}
        className="mt-20 rounded-3xl border border-green-100 bg-green-50 p-10"
      >
        <div className="mx-auto max-w-4xl text-center">
          <h3 className="text-3xl font-bold text-gray-900">
            {t("exportAssurance.process.title")}
          </h3>

          <p className="mt-5 text-lg leading-8 text-gray-600">
            {t("exportAssurance.process.description")}
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {exportProcessKeys.map((step) => (
            <div
              key={step}
              className="flex items-center gap-3 rounded-2xl border border-green-100 bg-white p-4 shadow-sm"
            >
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-700" />

              <span className="font-medium text-gray-800">
                {t(`exportAssurance.process.steps.${step}`)}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Export Commitment */}

      <motion.div
        variants={itemVariants}
        className="mt-20 rounded-3xl bg-gradient-to-r from-green-900 via-green-800 to-emerald-800 p-10 shadow-2xl"
      >
        <div className="mx-auto max-w-5xl text-center">
          <h3 className="text-3xl font-bold text-white">
            {t("exportAssurance.commitment.title")}
          </h3>

          <p className="mt-6 text-lg leading-8 text-green-100">
            {t("exportAssurance.commitment.description")}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm font-semibold text-green-100">
            {commitmentKeys.map((key) => (
              <span
                key={key}
                className="rounded-full bg-white/10 px-4 py-2 backdrop-blur-md"
              >
                {t(`exportAssurance.commitment.tags.${key}`)}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}