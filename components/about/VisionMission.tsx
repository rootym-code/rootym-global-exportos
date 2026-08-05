"use client";

import { motion, type Variants } from "framer-motion";
import { Eye, Target, CheckCircle2 } from "lucide-react";
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

export default function VisionMission() {
  const { t } = useTranslation();

  return (
    <section className="bg-gradient-to-b from-slate-50 to-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Header */}

          <motion.div
            variants={fadeUpVariants}
            className="mx-auto mb-16 max-w-3xl text-center"
          >
            <span className="inline-flex items-center rounded-full bg-[#2E7D32]/10 px-5 py-2 text-sm font-semibold text-[#2E7D32]">
              {t("about.visionMission.badge")}
            </span>

            <h2 className="mt-6 text-4xl font-black text-slate-900 md:text-5xl">
              {t("about.visionMission.title")}
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              {t("about.visionMission.description")}
            </p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Vision */}

            <motion.div
              variants={fadeUpVariants}
              className="rounded-3xl border border-green-100 bg-white p-10 shadow-lg transition-shadow duration-300 hover:shadow-xl"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2E7D32] text-white">
                <Eye className="h-8 w-8" />
              </div>

              <h3 className="text-3xl font-bold text-slate-900">
                {t("about.visionMission.vision.title")}
              </h3>

              <p className="mt-6 text-lg leading-8 text-slate-600">
                {t("about.visionMission.vision.description")}
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-[#2E7D32]" />

                  <p className="text-slate-600">
                    {t("about.visionMission.vision.points.point1")}
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-[#2E7D32]" />

                  <p className="text-slate-600">
                    {t("about.visionMission.vision.points.point2")}
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-[#2E7D32]" />

                  <p className="text-slate-600">
                    {t("about.visionMission.vision.points.point3")}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Mission */}

            <motion.div
              variants={fadeUpVariants}
              className="rounded-3xl border border-green-100 bg-gradient-to-br from-[#2E7D32] to-[#43A047] p-10 text-white shadow-xl"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                <Target className="h-8 w-8" />
              </div>

              <h3 className="text-3xl font-bold">
                {t("about.visionMission.mission.title")}
              </h3>

              <p className="mt-6 text-lg leading-8 text-green-50">
                {t("about.visionMission.mission.description")}
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-green-200" />

                  <p>
                    {t("about.visionMission.mission.points.point1")}
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-green-200" />

                  <p>
                    {t("about.visionMission.mission.points.point2")}
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-green-200" />

                  <p>
                    {t("about.visionMission.mission.points.point3")}
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-green-200" />

                  <p>
                    {t("about.visionMission.mission.points.point4")}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Statement */}

          <motion.div
            variants={fadeUpVariants}
            className="mx-auto mt-20 max-w-5xl rounded-3xl border border-green-100 bg-white p-10 text-center shadow-lg"
          >
            <h3 className="text-3xl font-bold text-slate-900">
              {t("about.visionMission.bottom.title")}
            </h3>

            <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-slate-600">
              {t("about.visionMission.bottom.description")}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}