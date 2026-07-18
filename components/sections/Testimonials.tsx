"use client";

import { motion, Variants } from "framer-motion";
import { Quote, Star } from "lucide-react";

import Card from "@/components/ui/Card";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";

import { testimonials } from "@/data/testimonials";

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

export default function Testimonials() {
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
      <SectionContainer className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
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
              badge="Testimonials"
              title="Building Long-Term Relationships with Global Buyers"
              description="Our commitment is to provide reliable sourcing, transparent communication and dependable export support for every international customer."
            />
          </motion.div>

          <div className="mt-20 grid gap-8 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
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
                <Card className="group relative flex h-full flex-col overflow-hidden border border-gray-200 bg-white p-8 shadow-lg">
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

                  <div className="relative flex h-full flex-col">
                    {/* Quote Icon */}
                    <motion.div
                      whileHover={{
                        rotate: -10,
                        scale: 1.08,
                      }}
                      transition={{
                        duration: 0.3,
                      }}
                    >
                      <Quote className="h-10 w-10 text-[#2E7D32]" />
                    </motion.div>

                    {/* Rating */}
                    <div className="mt-6 flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.div
                          key={star}
                          whileHover={{
                            scale: 1.25,
                            rotate: 12,
                          }}
                          transition={{
                            duration: 0.2,
                          }}
                        >
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        </motion.div>
                      ))}
                    </div>

                    {/* Testimonial */}
                    <motion.p
                      whileHover={{
                        x: 2,
                      }}
                      className="mt-6 flex-grow text-lg italic leading-8 text-gray-600"
                    >
                      &ldquo;{testimonial.message}&rdquo;
                    </motion.p>

                    {/* Author */}
                    <div className="mt-8 border-t border-gray-100 pt-6">
                      <motion.h3
                        whileHover={{
                          x: 4,
                        }}
                        className="text-lg font-bold text-gray-900 transition-colors group-hover:text-[#2E7D32]"
                      >
                        {testimonial.name}
                      </motion.h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {testimonial.designation}
                      </p>

                      <p className="mt-1 text-sm font-medium text-[#2E7D32]">
                        {testimonial.country}
                      </p>
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
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionContainer>
    </motion.section>
  );
}