"use client";

import { motion, Variants } from "framer-motion";

import Card from "@/components/ui/Card";
import IconBox from "@/components/ui/IconBox";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";

import { certifications } from "@/data/certifications";

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

export default function Certifications() {
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
      <SectionContainer className="relative overflow-hidden bg-white">
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
              badge="Certifications & Compliance"
              title="Built on Trust. Backed by Compliance."
              description="ROOTYM follows internationally recognized export practices and maintains the registrations required to support reliable agricultural exports."
            />
          </motion.div>

          <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {certifications.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
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
                      {/* Icon */}
                      <motion.div
                        whileHover={{
                          rotate: 8,
                          scale: 1.08,
                        }}
                        transition={{
                          duration: 0.3,
                        }}
                      >
                        <IconBox>
                          <Icon className="h-8 w-8" />
                        </IconBox>
                      </motion.div>

                      {/* Title */}
                      <motion.h3
                        whileHover={{
                          x: 4,
                        }}
                        className="mt-8 text-2xl font-bold text-gray-900 transition-colors group-hover:text-[#2E7D32]"
                      >
                        {item.title}
                      </motion.h3>

                      {/* Description */}
                      <p className="mt-4 leading-7 text-gray-600">
                        {item.description}
                      </p>
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