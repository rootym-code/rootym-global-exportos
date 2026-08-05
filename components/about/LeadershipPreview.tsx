"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";

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

const directors = [
  {
    key: "prem",
    image: "/images/leadership/founder-prem-chand-singh.webp",
  },
  {
    key: "anjali",
    image: "/images/directors/anjali-singh.webp",
  },
];

export default function LeadershipPreview() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-slate-50 py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.08),transparent_45%)]" />

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
              {t("about.leadership.badge")}
            </span>

            <h2 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              {t("about.leadership.title.line1")}

              <span className="block text-green-700">
                {t("about.leadership.title.line2")}
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              {t("about.leadership.description")}
            </p>
          </motion.div>

          <div className="mt-16 grid gap-10 lg:grid-cols-2">
            {directors.map((director) => (
              <motion.div
                key={director.key}
                variants={fadeUpVariants}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="relative h-96 overflow-hidden">
                  <Image
                    src={director.image}
                    alt={t(`about.leadership.directors.${director.key}.name`)}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-8">
                    <h3 className="text-3xl font-bold text-white">
                      {t(`about.leadership.directors.${director.key}.name`)}
                    </h3>

                    <p className="mt-2 text-lg text-green-200">
                      {t(
                        `about.leadership.directors.${director.key}.designation`
                      )}
                    </p>
                  </div>
                </div>

                <div className="p-8">
                  <p className="leading-8 text-slate-600">
                    {t(
                      `about.leadership.directors.${director.key}.description`
                    )}
                  </p>

                  <div className="mt-8">
                    <Link
                      href="/meet-the-directors"
                      className="inline-flex items-center gap-2 font-semibold text-green-700 transition hover:text-green-800"
                    >
                      {t("about.leadership.viewProfile")}

                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}

          <motion.div
            variants={fadeUpVariants}
            className="mt-20 overflow-hidden rounded-3xl border border-green-100 bg-gradient-to-r from-green-700 via-green-600 to-green-700 shadow-xl"
          >
            <div className="grid gap-10 p-10 lg:grid-cols-2 lg:items-center lg:p-14">
              <div className="text-white">
                <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
                  {t("about.leadership.bottom.badge")}
                </span>

                <h3 className="mt-6 text-4xl font-bold leading-tight">
                  {t("about.leadership.bottom.title.line1")}
                  <br />
                  {t("about.leadership.bottom.title.line2")}
                </h3>

                <p className="mt-6 text-lg leading-8 text-green-50">
                  {t("about.leadership.bottom.description")}
                </p>

                <Link
                  href="/meet-the-directors"
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 font-semibold text-green-700 transition-all duration-300 hover:scale-105"
                >
                  {t("about.leadership.bottom.button")}

                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                  <h4 className="text-3xl font-bold text-white">
                    {t("about.leadership.bottom.cards.leadership.title")}
                  </h4>

                  <p className="mt-3 text-green-100">
                    {t("about.leadership.bottom.cards.leadership.description")}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                  <h4 className="text-3xl font-bold text-white">
                    {t("about.leadership.bottom.cards.innovation.title")}
                  </h4>

                  <p className="mt-3 text-green-100">
                    {t("about.leadership.bottom.cards.innovation.description")}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                  <h4 className="text-3xl font-bold text-white">
                    {t("about.leadership.bottom.cards.integrity.title")}
                  </h4>

                  <p className="mt-3 text-green-100">
                    {t("about.leadership.bottom.cards.integrity.description")}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                  <h4 className="text-3xl font-bold text-white">
                    {t("about.leadership.bottom.cards.partnerships.title")}
                  </h4>

                  <p className="mt-3 text-green-100">
                    {t("about.leadership.bottom.cards.partnerships.description")}
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