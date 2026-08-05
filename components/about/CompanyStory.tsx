"use client";

import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Globe2,
  Sprout,
} from "lucide-react";

import { useTranslation } from "@/lib/i18n/context";

/* -------------------------------------------------------------------------- */
/*                                Animations                                  */
/* -------------------------------------------------------------------------- */

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

export default function CompanyStory() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Section Header */}

          <motion.div
            variants={fadeUpVariants}
            className="mb-16 text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-[#2E7D32]/10 px-5 py-2 text-sm font-semibold text-[#2E7D32]">
              <Building2 className="h-4 w-4" />

              {t("about.story.badge")}
            </div>

            <h2 className="mt-6 text-4xl font-black text-slate-900 md:text-5xl">
              {t("about.story.title.line1")}
              <br />
              {t("about.story.title.line2")}
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              {t("about.story.description")}
            </p>
          </motion.div>

          <div className="grid items-center gap-16 lg:grid-cols-2">
            <motion.div
              variants={fadeUpVariants}
              className="space-y-6"
            >
              <h3 className="text-3xl font-bold text-slate-900">
                {t("about.story.heading")}
              </h3>

              <div className="rounded-3xl border border-green-100 bg-gradient-to-br from-green-50 to-white p-8 shadow-lg transition-shadow duration-300 hover:shadow-xl">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2E7D32] text-white">
                  <Sprout className="h-7 w-7" />
                </div>

                <h3 className="text-2xl font-bold text-slate-900">
                  {t("about.story.cards.farmers.title")}
                </h3>

                <p className="mt-4 leading-8 text-slate-600">
                  {t("about.story.cards.farmers.description")}
                </p>
              </div>

              <div className="rounded-3xl border border-green-100 bg-gradient-to-br from-white to-green-50 p-8 shadow-lg transition-shadow duration-300 hover:shadow-xl">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2E7D32] text-white">
                  <Globe2 className="h-7 w-7" />
                </div>

                <h3 className="text-2xl font-bold text-slate-900">
                  {t("about.story.cards.global.title")}
                </h3>

                <p className="mt-4 leading-8 text-slate-600">
                  {t("about.story.cards.global.description")}
                </p>
              </div>

              <div className="rounded-3xl border border-[#2E7D32]/10 bg-[#2E7D32] p-8 text-white shadow-xl">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold">
                      {t("about.story.promise.title")}
                    </h3>

                    <p className="mt-4 leading-8 text-green-100">
                      {t("about.story.promise.description")}
                    </p>
                  </div>

                  <ArrowRight className="mt-1 h-8 w-8 shrink-0" />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}