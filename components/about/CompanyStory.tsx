"use client";

import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Globe2,
  Leaf,
  Sprout,
} from "lucide-react";

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

export default function CompanyStory() {
  return (
    <section className="relative overflow-hidden bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Section Header */}

          <motion.div
            variants={fadeUpVariants}
            className="mb-16 text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-[#2E7D32]/10 px-5 py-2 text-sm font-semibold text-[#2E7D32]">
              <Building2 className="h-4 w-4" />
              Our Story
            </div>

            <h2 className="mt-6 text-4xl font-black text-slate-900 md:text-5xl">
              ROOTYM's Journey
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              ROOTYM Agro Harvest Private Limited was founded with a clear
              purpose—to connect the richness of Indian agriculture with buyers
              across the globe through trust, quality, and innovation.
            </p>
          </motion.div>

          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* Left Content */}

            <motion.div
              variants={fadeUpVariants}
              className="space-y-6"
            >
              <h3 className="text-3xl font-bold text-slate-900">
                From Technology Leadership to Global Agriculture
              </h3>

              <p className="text-lg leading-8 text-slate-600">
                ROOTYM was established after more than two decades of experience
                in enterprise technology and quality management. That background
                shaped our commitment to structured processes, operational
                excellence, and customer satisfaction.
              </p>

              <p className="text-lg leading-8 text-slate-600">
                Today, we apply the same discipline to agricultural exports by
                working closely with farmers, processors, logistics partners,
                and international buyers to deliver products that consistently
                meet global expectations.
              </p>

              <p className="text-lg leading-8 text-slate-600">
                Every shipment reflects our core values of transparency,
                traceability, food safety, and long-term relationships.
              </p>

              <div className="flex items-center gap-3 rounded-2xl border border-green-100 bg-green-50 p-5">
                <Leaf className="h-8 w-8 text-[#2E7D32]" />

                <div>
                  <h4 className="font-semibold text-slate-900">
                    Rooted in Indian Agriculture
                  </h4>

                  <p className="mt-1 text-sm text-slate-600">
                    Delivering authentic Indian agricultural products while
                    supporting farmers and sustainable sourcing practices.
                  </p>
                </div>
              </div>
            </motion.div>
                        {/* Right Content */}

                        <motion.div
              variants={fadeUpVariants}
              className="grid gap-6"
            >
              <div className="rounded-3xl border border-green-100 bg-gradient-to-br from-green-50 to-white p-8 shadow-lg transition-shadow duration-300 hover:shadow-xl">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2E7D32] text-white">
                  <Sprout className="h-7 w-7" />
                </div>

                <h3 className="text-2xl font-bold text-slate-900">
                  Supporting Farmers
                </h3>

                <p className="mt-4 leading-8 text-slate-600">
                  We believe that strong global trade begins with strong
                  partnerships at the source. By working closely with farmers
                  and trusted suppliers, we promote responsible sourcing,
                  consistent quality, and sustainable agricultural practices.
                </p>
              </div>

              <div className="rounded-3xl border border-green-100 bg-gradient-to-br from-white to-green-50 p-8 shadow-lg transition-shadow duration-300 hover:shadow-xl">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2E7D32] text-white">
                  <Globe2 className="h-7 w-7" />
                </div>

                <h3 className="text-2xl font-bold text-slate-900">
                  Building Global Partnerships
                </h3>

                <p className="mt-4 leading-8 text-slate-600">
                  Our objective is to become a trusted export partner for
                  distributors, wholesalers, retailers, and food manufacturers
                  by delivering premium Indian agricultural products with
                  reliability, compliance, and transparency.
                </p>
              </div>

              <div className="rounded-3xl border border-[#2E7D32]/10 bg-[#2E7D32] p-8 text-white shadow-xl">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold">
                      Our Commitment
                    </h3>

                    <p className="mt-4 leading-8 text-green-100">
                      Every order represents our commitment to quality,
                      compliance, ethical sourcing, customer satisfaction,
                      and long-term international business relationships.
                    </p>
                  </div>

                  <ArrowRight className="mt-1 h-8 w-8 shrink-0" />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}