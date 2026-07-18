"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";

import Card from "@/components/ui/Card";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";

import { faqs } from "@/data/faqs";

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

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
      <SectionContainer className="relative overflow-hidden bg-gray-50">
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
              badge="Frequently Asked Questions"
              title="Answers to Common Buyer Questions"
              description="Find quick answers to the questions most frequently asked by importers before starting an export partnership with ROOTYM."
            />
          </motion.div>

          <div className="mx-auto mt-16 max-w-4xl space-y-5">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <motion.div
                  key={faq.question}
                  initial={{
                    opacity: 0,
                    y: 40,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                    ease: "easeOut",
                  }}
                  whileHover={{
                    y: -4,
                  }}
                >
                  <Card className="group relative overflow-hidden border border-gray-200 bg-white shadow-lg">
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
                      <button
                        type="button"
                        onClick={() =>
                          setOpenIndex(isOpen ? null : index)
                        }
                        className="flex w-full items-center justify-between p-6 text-left"
                      >
                        <motion.span
                          whileHover={{
                            x: 3,
                          }}
                          className="pr-6 text-lg font-semibold text-gray-900 transition-colors group-hover:text-[#2E7D32]"
                        >
                          {faq.question}
                        </motion.span>

                        <motion.div
                          animate={{
                            rotate: isOpen ? 180 : 0,
                          }}
                          transition={{
                            duration: 0.3,
                          }}
                        >
                          <ChevronDown className="h-6 w-6 text-[#2E7D32]" />
                        </motion.div>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{
                              height: 0,
                              opacity: 0,
                            }}
                            animate={{
                              height: "auto",
                              opacity: 1,
                            }}
                            exit={{
                              height: 0,
                              opacity: 0,
                            }}
                            transition={{
                              duration: 0.3,
                              ease: "easeInOut",
                            }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-gray-200 px-6 py-5">
                              <p className="leading-8 text-gray-600">
                                {faq.answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
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
              );
            })}
          </div>
        </div>
      </SectionContainer>
    </motion.section>
  );
}