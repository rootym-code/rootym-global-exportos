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
import Section from "@/components/ui/section";
import SectionHeader from "@/components/ui/section-header";
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
<Section
  background="gradient"
  spacing="xl"
  className="relative overflow-hidden"
>
  <motion.div
    variants={sectionVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{
      once: true,
      amount: 0.15,
    }}
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
      <div className="relative">
      <motion.div variants={itemVariants}>
  <SectionHeader
    align="center"
    eyebrow="Premium Agricultural Exports"
    title="Fresh From India. Ready For Global Markets."
    description="Carefully sourced agricultural products for importers, wholesalers, distributors and supermarket chains across global markets."
  />
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
  className="
  group
  relative
  overflow-hidden
  rounded-[32px]
  border
  border-white/40
  bg-white/80
  backdrop-blur-xl
  shadow-[0_10px_50px_rgba(0,0,0,0.08)]
  transition-all
  duration-500
  hover:-translate-y-2
  hover:shadow-[0_20px_70px_rgba(34,197,94,0.18)]
  "
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
                className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-emerald-300/20 via-transparent to-green-100/20"
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
                <div className="relative h-72 cursor-pointer overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-lime-50">
                  <motion.div
     whileHover={{
      scale: 1.06,
      rotate: -0.5,
      y: -4,
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

              <div className="relative p-8 space-y-2">
                <Link href={`/products/${product.slug}`}>
                  <motion.h3
                    whileHover={{
                      x: 4,
                    }}
                    className="cursor-pointer text-2xl font-bold tracking-tight text-slate-900 transition-all duration-300 hover:text-primary"
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
                  className="mt-8 flex flex-wrap gap-3"
                >
                  <motion.span
                    whileHover={{
                      y: -3,
                      scale: 1.05,
                    }}
                    transition={{
                      duration: 0.2,
                    }}
                  className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold tracking-wide text-emerald-700"
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
className="rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5 text-xs font-semibold tracking-wide text-sky-700"
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
                    className="rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-semibold tracking-wide text-amber-700"
                  >
                    Premium Quality
                  </motion.span>
                </motion.div>

                {/* CTA Buttons */}
                <div className="mt-10 grid grid-cols-2 gap-4">
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
  className="h-12 w-full rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
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
                  <Button className="h-12 w-full rounded-xl bg-gradient-to-r from-primary to-emerald-600 font-semibold shadow-lg transition-all duration-300 hover:shadow-xl">
                      Request Quote
                    </Button>
                  </motion.div>
                </div>

                {/* Footer */}
                <div className="mt-8 flex items-center justify-between border-t border-border/50 pt-6">
                  <motion.div
                    whileHover={{
                      x: 3,
                    }}
                    className="flex items-center gap-2 text-sm font-semibold text-primary"
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
                    <ArrowRight className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary" />
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
                className="absolute bottom-0 left-0 h-1.5 w-full origin-left rounded-full bg-gradient-to-r from-primary via-emerald-500 to-lime-400"
              />
            </motion.div>
          ))}
        </div>
      </div>
      </motion.div>
</Section>


  );
}