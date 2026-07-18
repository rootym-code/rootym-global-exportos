/**
 * File: components/sections/ProductShowcase.tsx
 * ROOTYM Frontend Sprint 007
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import {
  MapPin,
  Package,
  BadgeCheck,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { products } from "@/data/products";

const sectionVariants: Variants = {
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
      when: "beforeChildren",
      staggerChildren: 0.12,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut",
    },
  },
};




export default function ProductShowcase() {
  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.15,
      }}
      className="relative overflow-hidden"
    >
      {/* Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, -40, 0],
            scale: [1, 1.12, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-green-200/30 blur-[120px]"
        />

        <motion.div
          animate={{
            x: [0, -60, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-emerald-100/40 blur-[110px]"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-24">
        <motion.div
          variants={itemVariants}
          className="text-center"
        >
         
         <motion.span
  whileHover={{
    scale: 1.05,
  }}
  transition={{
    duration: 0.4,
    ease: "easeOut",
  }}
  className="inline-flex rounded-full bg-green-100 px-5 py-2 text-sm font-semibold text-[#2E7D32]"
>


            Featured Export Products
          </motion.span>

          <motion.h2
            variants={itemVariants}
            className="mt-6 text-5xl font-bold text-gray-900"
          >
            Fresh From India. Ready For Global Markets.
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600"
          >
            Carefully sourced agricultural products for importers,
            wholesalers, distributors and supermarkets across the world.
          </motion.p>
        </motion.div>
        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
{products.map((product, index) => (
    
<motion.div
  key={product.id}
  initial={{
    opacity: 0,
    y: 60,
    scale: 0.96,
  }}
  whileInView={{
    opacity: 1,
    y: 0,
    scale: 1,
  }}
  viewport={{
    once: true,
    amount: 0.2,
  }}
  transition={{
    duration: 0.6,
    delay: index * 0.08,
    ease: "easeOut",
  }}
  whileHover={{
    y: -12,
    transition: {
      duration: 0.25,
    },
  }}
  className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg"
>


            
              {/* Hover Glow */}
              <motion.div
                initial={{
                  opacity: 0,
                }}
                whileHover={{
                  opacity: 1,
                }}
                transition={{
                  duration: 0.35,
                }}
                className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-100/30 via-transparent to-emerald-100/20"
              />

              {/* Top Badges */}
              <div className="relative flex justify-between px-6 pt-6">
                <motion.span
                  whileHover={{
                    scale: 1.08,
                  }}
                  className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-[#2E7D32]"
                >
                  ● {product.availability}
                </motion.span>

                <motion.span
                  whileHover={{
                    scale: 1.05,
                  }}
                  className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600"
                >
                  {product.category}
                </motion.span>
              </div>

              <Link href={`/products/${product.slug}`}>
                <div className="relative h-72 cursor-pointer overflow-hidden bg-gradient-to-br from-green-50 via-white to-green-50">
                  <motion.div
                    whileHover={{
                      scale: 1.08,
                      rotate: -1,
                    }}
                    transition={{
                      duration: 0.45,
                    }}
                    className="h-full w-full"
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-8"
                    />
                  </motion.div>
                </div>
              </Link>

              <div className="relative p-8">
                <Link href={`/products/${product.slug}`}>
                  <motion.h3
                    whileHover={{
                      x: 4,
                    }}
                    className="cursor-pointer text-2xl font-bold text-gray-900 transition-colors hover:text-[#2E7D32]"
                  >
                    {product.name}
                  </motion.h3>
                </Link>

                <div className="mt-6 space-y-4">
                  <motion.div
                    whileHover={{
                      x: 4,
                    }}
                    className="flex items-center gap-3"
                  >
                    <MapPin className="h-5 w-5 text-[#2E7D32]" />

                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        Origin
                      </p>

                      <p className="font-semibold text-gray-800">
                        {product.origin}
                      </p>
                    </div>
                  </motion.div>
                  <motion.div
                    whileHover={{
                      x: 4,
                    }}
                    className="flex items-center gap-3"
                  >
                    <Package className="h-5 w-5 text-[#2E7D32]" />

                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        Packaging
                      </p>

                      <p className="font-semibold text-gray-800">
                        {product.packaging}
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Export Badges */}
                <motion.div
                  variants={itemVariants}
                  className="mt-6 flex flex-wrap gap-2"
                >
                  <motion.span
                    whileHover={{
                      y: -3,
                      scale: 1.05,
                    }}
                    transition={{
                      duration: 0.2,
                    }}
                    className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-[#2E7D32]"
                  >
                    APEDA
                  </motion.span>

                  <motion.span
                    whileHover={{
                      y: -3,
                      scale: 1.05,
                    }}
                    transition={{
                      duration: 0.2,
                    }}
                    className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700"
                  >
                    Export Ready
                  </motion.span>

                  <motion.span
                    whileHover={{
                      y: -3,
                      scale: 1.05,
                    }}
                    transition={{
                      duration: 0.2,
                    }}
                    className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700"
                  >
                    Premium Quality
                  </motion.span>
                </motion.div>

                {/* CTA Buttons */}
                <div className="mt-8 grid grid-cols-2 gap-3">
                  <motion.div
                    whileHover={{
                      scale: 1.03,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                  >
                    <Link href={`/products/${product.slug}`}>
                      <Button
                        variant="secondary"
                        className="w-full"
                      >
                        View Details
                      </Button>
                    </Link>
                  </motion.div>

                  <motion.div
                    whileHover={{
                      scale: 1.03,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                  >
                    <Button className="w-full">
                      Request Quote
                    </Button>
                  </motion.div>
                </div>

                {/* Footer */}
                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5">
                  <motion.div
                    whileHover={{
                      x: 3,
                    }}
                    className="flex items-center gap-2 text-sm font-medium text-[#2E7D32]"
                  >
                    <BadgeCheck className="h-4 w-4" />
                    Ready for Export
                  </motion.div>

                  <motion.div
                    whileHover={{
                      x: 6,
                    }}
                    transition={{
                      duration: 0.2,
                    }}
                  >
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-[#2E7D32]" />
                  </motion.div>
                </div>
              </div>

              {/* Bottom Accent */}
              {/* Bottom Accent */}
              <motion.div
                initial={{
                  scaleX: 0,
                }}
                whileHover={{
                  scaleX: 1,
                }}
                transition={{
                  duration: 0.35,
                }}
                className="absolute bottom-0 left-0 h-1 w-full origin-left bg-gradient-to-r from-[#2E7D32] via-green-500 to-emerald-400"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>


  );
}