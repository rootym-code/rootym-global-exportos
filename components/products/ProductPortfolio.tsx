/**
 * ============================================================
 * ROOTYM Customer Website Product Portfolio
 * ============================================================
 * Author: Prem Singh
 * Module      : Products
 * Feature     : Product Portfolio
 * Purpose     : Displays the reusable product portfolio inside
 *               a customer Website while preserving the existing
 *               premium product presentation and Website routing.
 * ============================================================
 */

"use client";

import Image from "next/image";
import Link from "next/link";

import { motion, type Variants } from "framer-motion";

import {
  ArrowRight,
  Package,
} from "lucide-react";

import { useTranslation } from "@/lib/i18n/context";

type ProductPortfolioProps = {
  products: any[];

  /**
   * Customer Website slug.
   *
   * When provided, product links remain inside the customer's
   * Website instead of navigating to the global ROOTYM route.
   */
  websiteSlug?: string | null;

  /**
   * Website tenant's Business Profile name.
   *
   * Available for Website-specific presentation where required.
   */
  websiteCompanyName?: string | null;
};

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

function getProductImageUrl(
  fileUrl?: string | null,
) {
  if (!fileUrl) {
    return "/images/products/placeholder.png";
  }

  return fileUrl;
}

export default function ProductPortfolio({
  products,
  websiteSlug,
}: ProductPortfolioProps) {
  const { t, locale } = useTranslation();

  return (
    <section
      id="portfolio"
      className="mx-auto max-w-7xl px-6 py-24"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.15,
        }}
      >
        <motion.div
          variants={fadeUpVariants}
          className="max-w-3xl"
        >
          <span className="font-semibold uppercase tracking-[0.25em] text-[#2E7D32]">
            {t("products.portfolio.badge")}
          </span>

          <h2 className="mt-4 text-4xl font-bold text-gray-900">
            {t("products.portfolio.title")}
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            {t("products.portfolio.description")}
          </p>
        </motion.div>

        <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {products
            .filter(
              (product) =>
                product?.id &&
                product?.name,
            )
            .map((product) => {
              /**
               * --------------------------------------------------
               * Website-scoped product route
               * --------------------------------------------------
               *
               * Customer Website:
               * /website/{websiteSlug}/{locale}/products/{slug}
               *
               * Global Website:
               * /{locale}/products/{slug}
               *
               * The fallback preserves the existing global
               * Products experience.
               * --------------------------------------------------
               */

              const productHref = websiteSlug
                ? `/website/${websiteSlug}/${locale}/products/${product.slug}`
                : `/${locale}/products/${product.slug}`;

              return (
                <motion.div
                  key={product.slug}
                  variants={fadeUpVariants}
                >
                  <Link
                    href={productHref}
                    className="group"
                  >
                    <article className="overflow-hidden rounded-3xl border border-green-100 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl">
                      <div className="relative aspect-[4/3] bg-[#F8FBF8]">
                        <Image
                          src={getProductImageUrl(
                            product.featuredImage?.fileUrl,
                          )}
                          alt={product.name}
                          fill
                          sizes="(max-width:768px) 100vw, 33vw"
                          className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      <div className="p-7">
                        {product.category && (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-[#2E7D32]">
                            {product.category}
                          </span>
                        )}

                        <h3 className="mt-5 text-2xl font-bold text-gray-900">
                          {product.name}
                        </h3>

                        {product.origin && (
                          <div className="mt-6 flex items-center gap-3 text-gray-600">
                            <Package className="h-5 w-5 text-[#2E7D32]" />

                            <span>
                              {product.origin}
                            </span>
                          </div>
                        )}

                        <div className="mt-8 inline-flex items-center gap-2 font-semibold text-[#2E7D32]">
                          {t(
                            "products.portfolio.viewDetails",
                          )}

                          <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                      </div>
                    </article>
                  </Link>
                </motion.div>
              );
            })}
        </div>
      </motion.div>
    </section>
  );
}