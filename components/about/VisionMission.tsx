"use client";

import { motion, type Variants } from "framer-motion";
import { Eye, Target, CheckCircle2 } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                Animations                                  */
/* -------------------------------------------------------------------------- */

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
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

export default function VisionMission() {
  return (
    <section className="bg-gradient-to-b from-slate-50 to-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Header */}

          <motion.div
            variants={fadeUpVariants}
            className="mx-auto mb-16 max-w-3xl text-center"
          >
            <span className="inline-flex items-center rounded-full bg-[#2E7D32]/10 px-5 py-2 text-sm font-semibold text-[#2E7D32]">
              Our Purpose
            </span>

            <h2 className="mt-6 text-4xl font-black text-slate-900 md:text-5xl">
              Vision & Mission
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Our purpose is to create lasting value for farmers, buyers,
              partners, and communities through responsible agricultural
              exports and technology-driven business practices.
            </p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Vision */}

            <motion.div
              variants={fadeUpVariants}
              className="rounded-3xl border border-green-100 bg-white p-10 shadow-lg transition-shadow duration-300 hover:shadow-xl"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2E7D32] text-white">
                <Eye className="h-8 w-8" />
              </div>

              <h3 className="text-3xl font-bold text-slate-900">
                Our Vision
              </h3>

              <p className="mt-6 text-lg leading-8 text-slate-600">
                To become one of India's most trusted agricultural export
                companies by delivering premium-quality products, sustainable
                sourcing practices, and long-term partnerships across global
                markets.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-[#2E7D32]" />
                  <p className="text-slate-600">
                    Build long-term international business relationships.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-[#2E7D32]" />
                  <p className="text-slate-600">
                    Promote sustainable and ethical agricultural exports.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-[#2E7D32]" />
                  <p className="text-slate-600">
                    Deliver consistent quality that global buyers can trust.
                  </p>
                </div>
              </div>
            </motion.div>
                        {/* Mission */}

                        <motion.div
              variants={fadeUpVariants}
              className="rounded-3xl border border-green-100 bg-gradient-to-br from-[#2E7D32] to-[#43A047] p-10 text-white shadow-xl"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                <Target className="h-8 w-8" />
              </div>

              <h3 className="text-3xl font-bold">
                Our Mission
              </h3>

              <p className="mt-6 text-lg leading-8 text-green-50">
                To connect Indian farmers and trusted manufacturers with global
                buyers by delivering premium agricultural products through
                quality assurance, transparent business practices, innovation,
                and exceptional customer service.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-green-200" />

                  <p>
                    Deliver export-quality agricultural products that meet
                    international standards.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-green-200" />

                  <p>
                    Support farmers through responsible sourcing and sustainable
                    partnerships.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-green-200" />

                  <p>
                    Build long-term relationships based on trust, transparency,
                    and consistent product quality.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-green-200" />

                  <p>
                    Use technology to simplify export operations and enhance
                    customer experience.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Statement */}

          <motion.div
            variants={fadeUpVariants}
            className="mx-auto mt-20 max-w-5xl rounded-3xl border border-green-100 bg-white p-10 text-center shadow-lg"
          >
            <h3 className="text-3xl font-bold text-slate-900">
              Our Commitment to Excellence
            </h3>

            <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-slate-600">
              At ROOTYM, every shipment represents our commitment to quality,
              compliance, integrity, and customer satisfaction. We strive to
              create lasting value for our partners while showcasing the
              excellence of Indian agriculture in international markets.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}