"use client";

import { motion, Variants } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Mail,
  PhoneCall,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import SectionContainer from "@/components/ui/SectionContainer";

const benefits = [
  "APEDA Registered Exporter",
  "End-to-End Export Documentation",
  "Global Shipping Assistance",
  "Dedicated Buyer Support",
];

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

export default function CallToAction() {
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
      <SectionContainer className="relative overflow-hidden">
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
        </div>

        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-[36px] bg-gradient-to-r from-[#1B5E20] via-[#2E7D32] to-[#388E3C] shadow-2xl"
        >
          {/* Decorative Glow */}
          <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-green-300/10 blur-3xl" />

          <div className="relative grid items-center gap-12 px-8 py-16 lg:grid-cols-2 lg:px-16">
            {/* Left */}
            <motion.div variants={itemVariants}>
              <motion.span
                whileHover={{
                  scale: 1.05,
                }}
                className="inline-flex rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur"
              >
                Ready to Source from India?
              </motion.span>

              <motion.h2
                variants={itemVariants}
                className="mt-6 text-4xl font-bold leading-tight text-white lg:text-5xl"
              >
                Let&apos;s Build Your Next
                <br />
                Export Partnership
              </motion.h2>

              <motion.p
                variants={itemVariants}
                className="mt-6 max-w-xl text-lg leading-8 text-green-100"
              >
                Whether you&apos;re an importer, distributor, supermarket or food
                processor, ROOTYM is ready to supply premium Indian agricultural
                products with dependable quality, documentation and logistics
                support.
              </motion.p>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {benefits.map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{
                      opacity: 0,
                      y: 30,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.08,
                    }}
                    whileHover={{
                      y: -4,
                      scale: 1.02,
                    }}
                    className="flex items-center gap-3 rounded-xl bg-white/10 p-3 backdrop-blur"
                  >
                    <CheckCircle2 className="h-5 w-5 text-green-200" />

                    <span className="font-medium text-white">
                      {item}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right */}
            <motion.div
              variants={itemVariants}
              whileHover={{
                y: -6,
              }}
              transition={{
                duration: 0.3,
              }}
              className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-2xl"
            >
              {/* Card Glow */}
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
                <h3 className="text-2xl font-bold text-gray-900">
                  Start Your Export Inquiry
                </h3>

                <p className="mt-3 text-gray-600">
                  Tell us your product requirements and our export team will
                  respond with pricing, packaging options and shipment details.
                </p>

                <div className="mt-8 space-y-4">
                  <motion.div
                    whileHover={{
                      scale: 1.02,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                  >
                    <Button className="w-full justify-center">
                      Request Export Quote
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{
                      scale: 1.02,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                  >
                    <Button
                      variant="secondary"
                      className="w-full justify-center"
                    >
                      Schedule Consultation
                    </Button>
                  </motion.div>
                </div>

                <div className="mt-10 border-t border-gray-100 pt-6">
                  <motion.div
                    whileHover={{
                      x: 4,
                    }}
                    className="flex items-center gap-3"
                  >
                    <Mail className="h-5 w-5 text-[#2E7D32]" />

                    <span className="text-gray-700">
                      prem@rootym.in
                    </span>
                  </motion.div>

                  <motion.div
                    whileHover={{
                      x: 4,
                    }}
                    className="mt-4 flex items-center gap-3"
                  >
                    <PhoneCall className="h-5 w-5 text-[#2E7D32]" />

                    <span className="text-gray-700">
                      +91 98735 29752
                    </span>
                  </motion.div>

                  <motion.div
                    whileHover={{
                      x: 4,
                    }}
                    className="mt-6 flex items-center justify-between rounded-xl bg-green-50 p-4"
                  >
                    <div>
                      <p className="font-semibold text-[#2E7D32]">
                        Typical Response Time
                      </p>

                      <p className="text-sm text-gray-600">
                        Within 24 Business Hours
                      </p>
                    </div>

                    <ArrowRight className="h-6 w-6 text-[#2E7D32] transition-transform duration-300 group-hover:translate-x-2" />
                  </motion.div>
                </div>
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
            </motion.div>
          </div>
        </motion.div>
      </SectionContainer>
    </motion.section>
  );
}