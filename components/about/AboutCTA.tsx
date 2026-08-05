"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Mail, Phone } from "lucide-react";

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

export default function AboutCTA() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-slate-900 py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.18),transparent_45%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.12),transparent_40%)]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div
            variants={fadeUpVariants}
            className="overflow-hidden rounded-[36px] bg-gradient-to-r from-green-700 via-green-600 to-green-700 p-10 shadow-2xl lg:p-16"
          >
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

              {/* Left Content */}

              <div className="text-white">
                <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
                  {t("about.cta.badge")}
                </span>

                <h2 className="mt-6 text-4xl font-bold leading-tight md:text-5xl">
                  {t("about.cta.title.line1")}
                  <br />
                  {t("about.cta.title.line2")}
                </h2>

                <p className="mt-6 max-w-xl text-lg leading-8 text-green-50">
                  {t("about.cta.description")}
                </p>

                <div className="mt-10 flex flex-wrap gap-4">
                  <Link
                    href="/request-quote"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 font-semibold text-green-700 transition hover:scale-105"
                  >
                    {t("about.cta.buttons.quote")}

                    <ArrowRight className="h-5 w-5" />
                  </Link>

                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-7 py-4 font-semibold text-white backdrop-blur transition hover:bg-white/10"
                  >
                    {t("about.cta.buttons.contact")}
                  </Link>
                </div>
              </div>

              {/* Right Content */}

              <div className="grid gap-6">

                <div className="rounded-3xl bg-white/10 p-8 backdrop-blur">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                      <Mail className="h-7 w-7 text-white" />
                    </div>

                    <div>
                      <p className="text-sm uppercase tracking-wide text-green-100">
                        {t("about.cta.contact.email")}
                      </p>

                      <h3 className="mt-1 text-xl font-semibold text-white">
                        sales@rootym.com
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl bg-white/10 p-8 backdrop-blur">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                      <Phone className="h-7 w-7 text-white" />
                    </div>

                    <div>
                      <p className="text-sm uppercase tracking-wide text-green-100">
                        {t("about.cta.contact.business")}
                      </p>

                      <h3 className="mt-1 text-xl font-semibold text-white">
                        {t("about.cta.contact.support")}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl bg-white/10 p-8 backdrop-blur">
                  <h3 className="text-2xl font-bold text-white">
                    {t("about.cta.partner.title")}
                  </h3>

                  <ul className="mt-6 space-y-4 text-green-50">
                  <li className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full bg-white" />

                      <span>
                        {t("about.cta.partner.points.point1")}
                      </span>
                    </li>

                    <li className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full bg-white" />

                      <span>
                        {t("about.cta.partner.points.point2")}
                      </span>
                    </li>

                    <li className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full bg-white" />

                      <span>
                        {t("about.cta.partner.points.point3")}
                      </span>
                    </li>

                    <li className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full bg-white" />

                      <span>
                        {t("about.cta.partner.points.point4")}
                      </span>
                    </li>

                  </ul>
                </div>

              </div>

            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}