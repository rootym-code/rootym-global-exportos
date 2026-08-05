"use client";

import { motion, type Variants } from "framer-motion";
import {
  Building2,
  FileBadge,
  Globe2,
  Rocket,
} from "lucide-react";

import { useTranslation } from "@/lib/i18n/context";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeUpVariants: Variants = {
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

const milestones = [
  {
    year: "Dec 2025",
    icon: Building2,
    title: "about.timeline.milestones.established.title",
    description:
      "about.timeline.milestones.established.description",
  },
  {
    year: "2026",
    icon: FileBadge,
    title: "about.timeline.milestones.readiness.title",
    description:
      "about.timeline.milestones.readiness.description",
  },
  {
    year: "2026",
    icon: Globe2,
    title: "about.timeline.milestones.partnerships.title",
    description:
      "about.timeline.milestones.partnerships.description",
  },
  {
    year: "Future",
    icon: Rocket,
    title: "about.timeline.milestones.future.title",
    description:
      "about.timeline.milestones.future.description",
  },
];

export default function CompanyTimeline() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-white py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.08),transparent_50%)]" />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div
            variants={fadeUpVariants}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="inline-flex rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
              {t("about.timeline.badge")}
            </span>

            <h2 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              {t("about.timeline.title.line1")}

              <span className="block text-green-700">
                {t("about.timeline.title.line2")}
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              {t("about.timeline.description")}
            </p>
          </motion.div>

          <div className="relative mt-20">
            <div className="absolute left-6 top-0 hidden h-full w-1 rounded-full bg-green-100 md:block" />

            <div className="space-y-12">
              {milestones.map((item) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.title}
                    variants={fadeUpVariants}
                    className="relative flex flex-col gap-6 md:flex-row md:gap-10"
                  >
                    <div className="relative flex-shrink-0">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-700 shadow-lg">
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                    </div>

                    <div className="flex-1 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:shadow-xl">
                      <span className="inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                        {item.year}
                      </span>

                      <h3 className="mt-5 text-2xl font-bold text-slate-900">
                        {t(item.title)}
                      </h3>

                      <p className="mt-4 leading-8 text-slate-600">
                        {t(item.description)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Closing Vision Section */}

          <motion.div
            variants={fadeUpVariants}
            className="mt-20 overflow-hidden rounded-3xl border border-green-100 bg-gradient-to-r from-green-700 via-green-600 to-green-700 shadow-xl"
          >
            <div className="grid gap-10 p-10 lg:grid-cols-2 lg:items-center lg:p-14">
              <div className="text-white">
                <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
                  {t("about.timeline.bottom.badge")}
                </span>

                <h3 className="mt-6 text-4xl font-bold leading-tight">
                  {t("about.timeline.bottom.title.line1")}
                  <br />
                  {t("about.timeline.bottom.title.line2")}
                  <br />
                  {t("about.timeline.bottom.title.line3")}
                </h3>

                <p className="mt-6 text-lg leading-8 text-green-50">
                  {t("about.timeline.bottom.description")}
                </p>
              </div>

              <div className="space-y-5">
                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                  <h4 className="text-2xl font-bold text-white">
                    {t("about.timeline.bottom.cards.global.title")}
                  </h4>

                  <p className="mt-3 leading-7 text-green-100">
                    {t("about.timeline.bottom.cards.global.description")}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                  <h4 className="text-2xl font-bold text-white">
                    {t("about.timeline.bottom.cards.farmers.title")}
                  </h4>

                  <p className="mt-3 leading-7 text-green-100">
                    {t("about.timeline.bottom.cards.farmers.description")}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                  <h4 className="text-2xl font-bold text-white">
                    {t("about.timeline.bottom.cards.excellence.title")}
                  </h4>

                  <p className="mt-3 leading-7 text-green-100">
                    {t("about.timeline.bottom.cards.excellence.description")}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}