"use client";

import { motion, type Variants } from "framer-motion";
import { Sparkles } from "lucide-react";

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
    title: "products.aiFuture.cards.market.title",
    description:
      "products.aiFuture.cards.market.description",
  },
  {
    title: "products.aiFuture.cards.recommendation.title",
    description:
      "products.aiFuture.cards.recommendation.description",
  },
  {
    title: "products.aiFuture.cards.assistance.title",
    description:
      "products.aiFuture.cards.assistance.description",
  },
];

export default function AIFuture() {
  const { t } = useTranslation();

  return (
    <section className="bg-gradient-to-br from-green-950 via-green-900 to-emerald-950 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto max-w-5xl text-center text-white"
        >
          <motion.div variants={fadeUpVariants}>
            <div className="inline-flex items-center gap-2 rounded-full border border-green-300/30 bg-white/10 px-5 py-2 text-sm font-semibold text-green-100 backdrop-blur">
              <Sparkles className="h-4 w-4 text-green-300" />

              {t("products.aiFuture.badge")}
            </div>

            <h2 className="mt-8 text-4xl font-bold md:text-6xl">
              {t("products.aiFuture.title.line1")}

              <span className="block bg-gradient-to-r from-green-300 via-emerald-200 to-lime-300 bg-clip-text text-transparent">
                {t("products.aiFuture.title.line2")}
              </span>
            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-green-100">
              {t("products.aiFuture.description")}
            </p>



            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {features.map((feature) => (
                <motion.div
                  key={feature.title}
                  variants={fadeUpVariants}
                >
                  <AIBox
                    title={t(feature.title)}
                    description={t(feature.description)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>


  );
}

function AIBox({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:bg-white/10">
      <h3 className="text-xl font-bold text-white">
        {title}
      </h3>

      <p className="mt-4 leading-7 text-green-100">
        {description}
      </p>
    </div>
  );
}