"use client";

import { motion, Variants } from "framer-motion";
import { Globe2, ArrowRight } from "lucide-react";

import Card from "@/components/ui/Card";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";

import { globalMarkets } from "@/data/globalMarkets";

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

export default function GlobalMarkets() {
  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.15,
      }}
    >
      <SectionContainer className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        {/* Ambient Background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              x: [0, 80, 0],
              y: [0, -40, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-green-200/20 blur-[120px]"
          />

          <motion.div
            animate={{
              x: [0, -70, 0],
              y: [0, 60, 0],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-emerald-100/30 blur-[110px]"
          />
        </div>

        <div className="relative">
          <motion.div variants={itemVariants}>
            <SectionHeading
              badge="Global Markets"
              title="Serving International Buyers Across Key Markets"
              description="ROOTYM focuses on supplying premium Indian agricultural products to importers, distributors, wholesalers and retail chains across strategically selected global markets."
            />
          </motion.div>

          <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {globalMarkets.map((market, index) => (
              <motion.div
                key={market.country}
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
              >
                <Card className="group relative h-full overflow-hidden border border-gray-200 bg-white p-8 shadow-lg">
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

                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <motion.span
                        whileHover={{
                          scale: 1.1,
                          rotate: 5,
                        }}
                        className="text-5xl"
                      >
                        {market.flag}
                      </motion.span>

                      <motion.div
                        whileHover={{
                          rotate: 15,
                          scale: 1.1,
                        }}
                        transition={{
                          duration: 0.3,
                        }}
                      >
                        <Globe2 className="h-8 w-8 text-[#2E7D32]" />
                      </motion.div>
                    </div>

                    <motion.h3
                      whileHover={{
                        x: 4,
                      }}
                      className="mt-6 text-2xl font-bold text-gray-900 transition-colors group-hover:text-[#2E7D32]"
                    >
                      {market.country}
                    </motion.h3>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {market.products.map((product) => (
                        <motion.span
                          key={product}
                          whileHover={{
                            y: -2,
                            scale: 1.05,
                          }}
                          transition={{
                            duration: 0.2,
                          }}
                          className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-[#2E7D32]"
                        >
                          {product}
                        </motion.span>
                      ))}
                    </div>

                    <motion.div
                      whileHover={{
                        x: 4,
                      }}
                      className="mt-8 flex items-center justify-between border-t border-gray-100 pt-5"
                    >
                      <span className="text-sm font-medium text-gray-600">
                        Market Focus
                      </span>

                      <ArrowRight className="h-5 w-5 text-[#2E7D32] transition-transform duration-300 group-hover:translate-x-2" />
                    </motion.div>
                  </div>

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
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            variants={itemVariants}
            className="mt-20 overflow-hidden rounded-3xl bg-[#2E7D32] px-8 py-12 text-center text-white shadow-2xl"
          >
            <motion.h3
              whileHover={{
                scale: 1.02,
              }}
              className="text-3xl font-bold"
            >
              Expanding Global Partnerships
            </motion.h3>

            <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-green-100">
              We are continuously expanding our international network and
              welcome inquiries from importers, distributors and food
              businesses looking for a reliable sourcing partner in India.
            </p>
          </motion.div>
        </div>
      </SectionContainer>
    </motion.section>
  );
}