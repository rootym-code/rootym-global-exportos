"use client";

import { motion, type Variants } from "framer-motion";
import {
  Award,
  Globe2,
  Handshake,
  Leaf,
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

const features = [
  {
    icon: Handshake,
    title: "about.why.cards.relationships.title",
    description: "about.why.cards.relationships.description",
  },
  {
    icon: Award,
    title: "about.why.cards.quality.title",
    description: "about.why.cards.quality.description",
  },
  {
    icon: Globe2,
    title: "about.why.cards.trade.title",
    description: "about.why.cards.trade.description",
  },
  {
    icon: ShieldCheck,
    title: "about.why.cards.compliance.title",
    description: "about.why.cards.compliance.description",
  },
  {
    icon: Truck,
    title: "about.why.cards.network.title",
    description: "about.why.cards.network.description",
  },
  {
    icon: Leaf,
    title: "about.why.cards.sourcing.title",
    description: "about.why.cards.sourcing.description",
  },
];

export default function WhyChooseRootym() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-white py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.08),transparent_45%)]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
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
              {t("about.why.badge")}
            </span>

            <h2 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              {t("about.why.title.line1")}

              <span className="block text-green-700">
                {t("about.why.title.line2")}
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              {t("about.why.description")}
            </p>
          </motion.div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.title}
                  variants={fadeUpVariants}
                  className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-green-200 hover:shadow-xl"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 transition-colors duration-300 group-hover:bg-green-700">
                    <Icon className="h-8 w-8 text-green-700 transition-colors duration-300 group-hover:text-white" />
                  </div>

                  <h3 className="mt-8 min-h-[64px] text-2xl font-bold text-slate-900">
                    {t(feature.title)}
                  </h3>

                  <p className="mt-4 leading-8 text-slate-600">
                    {t(feature.description)}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Trust Section */}
          <motion.div
            variants={fadeUpVariants}
            className="mt-20 overflow-hidden rounded-3xl border border-green-100 bg-gradient-to-r from-green-700 via-green-600 to-green-700 shadow-xl"
          >
            <div className="grid gap-12 p-10 lg:grid-cols-2 lg:items-center lg:p-14">
              <div className="text-white">
                <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
                  {t("about.why.bottom.badge")}
                </span>

                <h3 className="mt-6 text-4xl font-bold leading-tight">
                  {t("about.why.bottom.title.line1")}
                  <br />
                  {t("about.why.bottom.title.line2")}
                </h3>

                <p className="mt-6 text-lg leading-8 text-green-50">
                  {t("about.why.bottom.description")}
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                  <h4 className="text-3xl font-bold text-white">
                    {t("about.why.bottom.stats.quality.title")}
                  </h4>

                  <p className="mt-3 text-green-100">
                    {t("about.why.bottom.stats.quality.description")}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                  <h4 className="text-3xl font-bold text-white">
                    {t("about.why.bottom.stats.transparency.title")}
                  </h4>

                  <p className="mt-3 text-green-100">
                    {t("about.why.bottom.stats.transparency.description")}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                  <h4 className="text-3xl font-bold text-white">
                    {t("about.why.bottom.stats.execution.title")}
                  </h4>

                  <p className="mt-3 text-green-100">
                    {t("about.why.bottom.stats.execution.description")}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                  <h4 className="text-3xl font-bold text-white">
                    {t("about.why.bottom.stats.growth.title")}
                  </h4>

                  <p className="mt-3 text-green-100">
                    {t("about.why.bottom.stats.growth.description")}
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
