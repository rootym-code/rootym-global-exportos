"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Globe2,
  Package,
  MapPin,
} from "lucide-react";

import { useTranslation } from "@/lib/i18n/context";

/* -------------------------------------------------------------------------- */
/*                                Animations                                  */
/* -------------------------------------------------------------------------- */

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
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

export default function ExportProducts() {
  const { t } = useTranslation();

  const products = [
    {
      key: "makhana",
      image: "/images/products/makhana.webp",
    },
    {
      key: "onion",
      image: "/images/products/onion.webp",
    },
    {
      key: "potato",
      image: "/images/products/potato.webp",
    },
    {
      key: "rice",
      image: "/images/products/rice.webp",
    },
    {
      key: "wheat",
      image: "/images/products/wheat.webp",
    },
    {
      key: "fries",
      image: "/images/products/french-fries.webp",
    },
  ];

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {/* Section Header */}

          <motion.div
            variants={fadeUpVariants}
            className="mx-auto mb-16 max-w-3xl text-center"
          >
            <span className="inline-flex rounded-full bg-[#2E7D32]/10 px-5 py-2 text-sm font-semibold text-[#2E7D32]">
              {t("about.exportProducts.badge")}
            </span>

            <h2 className="mt-6 text-4xl font-black text-slate-900 md:text-5xl">
              {t("about.exportProducts.title")}
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              {t("about.exportProducts.description")}
            </p>
          </motion.div>

          {/* Products */}

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <motion.div
                key={product.key}
                variants={fadeUpVariants}
                className="group overflow-hidden rounded-3xl border border-green-100 bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={t(
                      `about.exportProducts.products.${product.key}.name`
                    )}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-slate-900">
                    {t(
                      `about.exportProducts.products.${product.key}.name`
                    )}
                  </h3>

                  <p className="mt-4 leading-7 text-slate-600">
                    {t(
                      `about.exportProducts.products.${product.key}.description`
                    )}
                  </p>

                  <div className="mt-6 space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-[#2E7D32]" />

                      <span>
                        <strong>
                          {t("about.exportProducts.labels.origin")}:
                        </strong>{" "}
                        {t(
                          `about.exportProducts.products.${product.key}.origin`
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Package className="h-4 w-4 text-[#2E7D32]" />

                      <span>
                        <strong>
                          {t("about.exportProducts.labels.packaging")}:
                        </strong>{" "}
                        {t(
                          `about.exportProducts.products.${product.key}.packaging`
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Globe2 className="h-4 w-4 text-[#2E7D32]" />

                      <span>
                        <strong>
                          {t("about.exportProducts.labels.markets")}:
                        </strong>{" "}
                        {t(
                          `about.exportProducts.products.${product.key}.markets`
                        )}
                      </span>
                    </div>
                  </div>

                  <Link
                    href="/request-quote"
                    className="mt-8 inline-flex items-center gap-2 font-semibold text-[#2E7D32] transition-all hover:gap-3"
                  >
                    {t("about.exportProducts.buttons.quote")}

                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
                    {/* Bottom Information */}

                    <motion.div
            variants={fadeUpVariants}
            className="mt-20 rounded-3xl border border-green-100 bg-gradient-to-r from-green-700 to-green-600 p-10 text-white shadow-xl"
          >
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
                  {t("about.exportProducts.bottom.badge")}
                </span>

                <h3 className="mt-6 text-4xl font-bold">
                  {t("about.exportProducts.bottom.title.line1")}
                  <br />
                  {t("about.exportProducts.bottom.title.line2")}
                  <br />
                  {t("about.exportProducts.bottom.title.line3")}
                </h3>

                <p className="mt-6 text-lg leading-8 text-green-50">
                  {t("about.exportProducts.bottom.description")}
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                  <h4 className="text-3xl font-bold">100%</h4>

                  <p className="mt-2 text-green-100">
                    {t("about.exportProducts.bottom.stats.quality")}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                  <h4 className="text-3xl font-bold">
                    {t("about.exportProducts.bottom.stats.networkValue")}
                  </h4>

                  <p className="mt-2 text-green-100">
                    {t("about.exportProducts.bottom.stats.network")}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                  <h4 className="text-3xl font-bold">
                    {t("about.exportProducts.bottom.stats.globalValue")}
                  </h4>

                  <p className="mt-2 text-green-100">
                    {t("about.exportProducts.bottom.stats.global")}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                  <h4 className="text-3xl font-bold">
                    {t("about.exportProducts.bottom.stats.supportValue")}
                  </h4>

                  <p className="mt-2 text-green-100">
                    {t("about.exportProducts.bottom.stats.support")}
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