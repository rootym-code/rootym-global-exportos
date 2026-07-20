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

              Why Buyers Trust Us
            </div>

            <h2 className="mt-6 text-4xl font-black text-slate-900 md:text-5xl">
              Built on Trust.
              <br />
              Driven by Quality.
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              Choosing the right export partner is just as important as
              choosing the right product. ROOTYM combines disciplined
              processes, quality assurance, and transparent business
              practices to help international buyers source premium
              Indian agricultural products with confidence.
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
              <h3 className="text-3xl font-bold text-slate-900">
  From Technology Leadership to Global Agriculture
</h3>
<motion.div
  variants={fadeUpVariants}
  className="grid gap-6"
></motion.div>
<div className="rounded-3xl border border-green-100 bg-gradient-to-br from-green-50 to-white p-8 shadow-lg transition-shadow duration-300 hover:shadow-xl">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2E7D32] text-white">
                  <Sprout className="h-7 w-7" />
                </div>

                <h3 className="text-2xl font-bold text-slate-900">
                  Supporting Farmers
                </h3>

                <p className="mt-4 leading-8 text-slate-600">
                  Strong global supply chains begin at the source. We
                  collaborate with farmers, producer groups, and trusted
                  suppliers to encourage responsible sourcing,
                  consistent quality, sustainable agricultural
                  practices, and long-term value creation.
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
                  We aim to become the preferred sourcing partner for
                  importers, distributors, wholesalers, retailers, and
                  food manufacturers by delivering premium Indian
                  agricultural products with reliability, compliance,
                  transparency, and responsive customer service.
                </p>
              </div>

              <div className="rounded-3xl border border-[#2E7D32]/10 bg-[#2E7D32] p-8 text-white shadow-xl">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold">
                      Our Promise
                    </h3>

                    <p className="mt-4 leading-8 text-green-100">
                      Every shipment is handled with the same commitment
                      to quality, compliance, ethical sourcing, and
                      customer satisfaction that we would expect from our
                      own global supply partners. Our success is measured
                      by the long-term relationships we build with buyers
                      around the world.
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