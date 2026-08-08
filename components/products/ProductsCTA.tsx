"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";

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

export default function ProductsCTA() {
  const { t } = useTranslation();

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div
          variants={fadeUpVariants}
          className="rounded-3xl bg-gradient-to-r from-[#2E7D32] to-[#43A047] px-8 py-14 text-center shadow-2xl md:px-16"
        >
          <h2 className="text-4xl font-bold text-white md:text-5xl">
            {t("products.cta.title")}
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-green-50">
            {t("products.cta.description")}
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/request-quote">
              <Button className="bg-white px-8 py-3 text-[#2E7D32] hover:bg-green-50">
                {t("products.cta.buttons.quote")}
              </Button>
            </Link>

            <Link href="/contact">
              <Button
                variant="secondary"
                className="border-white bg-transparent px-8 py-3 text-white hover:bg-white/10"
              >
                {t("products.cta.buttons.contact")}
                </Button>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}