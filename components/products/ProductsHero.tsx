"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  BadgeCheck,
  Globe2,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
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

const trustCards = [
  {
    icon: ShieldCheck,
    title: "products.hero.cards.quality.title",
    subtitle: "products.hero.cards.quality.subtitle",
  },
  {
    icon: BadgeCheck,
    title: "products.hero.cards.export.title",
    subtitle: "products.hero.cards.export.subtitle",
  },
  {
    icon: Truck,
    title: "products.hero.cards.logistics.title",
    subtitle: "products.hero.cards.logistics.subtitle",
  },
  {
    icon: Globe2,
    title: "products.hero.cards.trade.title",
    subtitle: "products.hero.cards.trade.subtitle",
  },
];

export default function ProductsHero() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden border-b border-green-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#DCFCE7,transparent_40%),radial-gradient(circle_at_bottom_left,#ECFDF5,transparent_40%)]" />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6 py-24 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div variants={fadeUpVariants}>
            <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/80 px-5 py-2 text-sm font-semibold text-[#2E7D32] shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4" />

              {t("products.hero.badge")}
            </div>

            <h1 className="mt-8 max-w-5xl text-5xl font-extrabold leading-tight tracking-tight text-gray-900 lg:text-7xl">
              {t("products.hero.title.line1")}

              <span className="block bg-gradient-to-r from-[#2E7D32] to-[#43A047] bg-clip-text text-transparent">
                {t("products.hero.title.line2")}
              </span>
            </h1>

            <p className="mt-8 mx-auto max-w-3xl text-xl leading-9 text-gray-600">
              {t("products.hero.description")}
            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <Link href="/request-quote">
                <Button className="px-8 py-3">
                  {t("products.hero.buttons.quote")}
                </Button>
              </Link>

              <Link href="#portfolio">
                <Button
                  variant="secondary"
                  className="px-8 py-3"
                >
                  {t("products.hero.buttons.explore")}
                </Button>
              </Link>
            </div>

            <div className="mt-16 grid w-full max-w-5xl gap-5 md:grid-cols-4">
            {trustCards.map((card) => {
                const Icon = card.icon;

                return (
                  <motion.div
                    key={card.title}
                    variants={fadeUpVariants}
                  >
                    <TrustCard
                      icon={<Icon className="h-6 w-6" />}
                      title={t(card.title)}
                      subtitle={t(card.subtitle)}
                    />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function TrustCard({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex justify-center text-[#2E7D32]">
        {icon}
      </div>

      <h3 className="mt-4 text-center font-bold text-gray-900">
        {title}
      </h3>

      <p className="mt-1 text-center text-sm text-gray-600">
        {subtitle}
      </p>
    </div>
  );
}