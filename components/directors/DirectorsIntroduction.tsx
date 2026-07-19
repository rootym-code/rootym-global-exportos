"use client";

import { motion, type Variants } from "framer-motion";
import { Globe, Handshake, Leaf, Target } from "lucide-react";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
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
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const highlights = [
  {
    icon: Globe,
    title: "Global Vision",
    description:
      "Expanding the reach of premium Indian agricultural products into international markets.",
  },
  {
    icon: Handshake,
    title: "Trusted Relationships",
    description:
      "Building long-term partnerships with farmers, buyers, logistics providers, and distributors.",
  },
  {
    icon: Leaf,
    title: "Sustainable Growth",
    description:
      "Supporting responsible sourcing and creating value across the agricultural ecosystem.",
  },
  {
    icon: Target,
    title: "Customer Commitment",
    description:
      "Delivering quality, transparency, and dependable export solutions for every customer.",
  },
];

export default function DirectorsIntroduction() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Section Heading */}
          <motion.div
            variants={itemVariants}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="inline-flex rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-700">
              Leadership
            </span>

            <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Leadership Built on Vision,
              <span className="block text-green-700">
                Integrity & Long-Term Growth
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              ROOTYM was founded with a simple yet ambitious vision—to connect
              India's agricultural excellence with global opportunities. Our
              leadership team combines industry experience, entrepreneurial
              thinking, and a commitment to building sustainable relationships
              that benefit farmers, customers, and international trade partners.
            </p>
          </motion.div>

          {/* Content */}
          <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div variants={itemVariants}>
              <div className="rounded-3xl border border-green-100 bg-gradient-to-br from-green-50 to-white p-10 shadow-sm">
                <h3 className="text-2xl font-bold text-gray-900">
                  Our Leadership Philosophy
                </h3>

                <p className="mt-6 leading-8 text-gray-600">
                  We believe that successful exports are built on trust,
                  consistency, and quality. Every business relationship is
                  approached with transparency, ethical practices, and a
                  long-term commitment to delivering value.
                </p>

                <p className="mt-5 leading-8 text-gray-600">
                  Rather than focusing only on transactions, we aim to build
                  enduring partnerships by understanding customer needs,
                  maintaining product excellence, and continuously improving our
                  processes.
                </p>

                <div className="mt-8 rounded-2xl border border-green-200 bg-white p-6">
                  <p className="text-lg font-semibold italic text-green-800">
                    "Our mission is not just to export products, but to export
                    India's trust, quality, and agricultural excellence to the
                    world."
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={containerVariants}
              className="grid gap-6 sm:grid-cols-2"
            >
              {highlights.map((item) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.title}
                    variants={itemVariants}
                    className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-green-300 hover:shadow-lg"
                  >
                    <div className="inline-flex rounded-xl bg-green-100 p-3">
                      <Icon className="h-6 w-6 text-green-700" />
                    </div>

                    <h3 className="mt-5 text-xl font-semibold text-gray-900">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-gray-600">
                      {item.description}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}