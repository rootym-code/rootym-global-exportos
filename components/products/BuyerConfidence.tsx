"use client";

import { motion, type Variants } from "framer-motion";
import {
  BadgeCheck,
  Globe2,
  Package,
  ShieldCheck,
  Sparkles,
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
    icon: BadgeCheck,
    title: "products.buyerConfidence.cards.verified.title",
    description:
      "products.buyerConfidence.cards.verified.description",
  },
  {
    icon: ShieldCheck,
    title: "products.buyerConfidence.cards.quality.title",
    description:
      "products.buyerConfidence.cards.quality.description",
  },
  {
    icon: Package,
    title: "products.buyerConfidence.cards.packaging.title",
    description:
      "products.buyerConfidence.cards.packaging.description",
  },
  {
    icon: Truck,
    title: "products.buyerConfidence.cards.logistics.title",
    description:
      "products.buyerConfidence.cards.logistics.description",
  },
  {
    icon: Globe2,
    title: "products.buyerConfidence.cards.global.title",
    description:
      "products.buyerConfidence.cards.global.description",
  },
  {
    icon: Sparkles,
    title: "products.buyerConfidence.cards.ai.title",
    description:
      "products.buyerConfidence.cards.ai.description",
  },
];

export default function BuyerConfidence() {
  const { t } = useTranslation();

  return (
    <section className="bg-[#F8FBF8] py-24">
      <div className="mx-auto max-w-7xl px-6">
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
            <span className="font-semibold uppercase tracking-[0.25em] text-[#2E7D32]">
              {t("products.buyerConfidence.badge")}
            </span>

            <h2 className="mt-4 text-4xl font-bold text-gray-900">
              {t("products.buyerConfidence.title")}
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              {t("products.buyerConfidence.description")}
            </p>
          </motion.div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.title}
                  variants={fadeUpVariants}
                >
                  <FeatureCard
                    icon={<Icon className="h-7 w-7" />}
                    title={t(feature.title)}
                    description={t(feature.description)}
                  />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-green-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className="inline-flex rounded-2xl bg-green-100 p-4 text-[#2E7D32]">
        {icon}
      </div>

      <h3 className="mt-6 text-2xl font-bold text-gray-900">
        {title}
      </h3>

      <p className="mt-4 leading-7 text-gray-600">
        {description}
      </p>
    </div>
  );
}