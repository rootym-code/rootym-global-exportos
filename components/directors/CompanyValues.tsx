"use client";

import { motion, type Variants } from "framer-motion";
import {
  Award,
  Globe2,
  HeartHandshake,
  Lightbulb,
  ShieldCheck,
  Sprout,
} from "lucide-react";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
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
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const values = [
  {
    icon: ShieldCheck,
    title: "Integrity",
    description:
      "We conduct every business relationship with honesty, transparency and accountability.",
  },
  {
    icon: Award,
    title: "Quality Excellence",
    description:
      "Maintaining high quality standards from sourcing to international delivery.",
  },
  {
    icon: HeartHandshake,
    title: "Customer Commitment",
    description:
      "Building long-term partnerships by consistently delivering value and reliability.",
  },
  {
    icon: Globe2,
    title: "Global Mindset",
    description:
      "Creating opportunities that connect Indian agriculture with international markets.",
  },
  {
    icon: Sprout,
    title: "Sustainability",
    description:
      "Supporting responsible agricultural practices that benefit farmers and future generations.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "Continuously improving our products, processes and customer experience.",
  },
];

export default function CompanyValues() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {/* Heading */}

          <motion.div
            variants={itemVariants}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="inline-flex rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-700">
              Core Values
            </span>

            <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Values That Shape
              <span className="block text-green-700">
                Every Decision We Make
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our values define how we work, collaborate, and grow. They guide
              our relationships with farmers, customers, employees, logistics
              partners, suppliers and global buyers.
            </p>
          </motion.div>

          {/* Values Grid */}

          <motion.div
            variants={containerVariants}
            className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3"
          >
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <motion.div
                  key={value.title}
                  variants={itemVariants}
                  className="group rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-green-300 hover:shadow-xl"
                >
                  <div className="inline-flex rounded-2xl bg-green-100 p-4 transition-colors duration-300 group-hover:bg-green-700">
                    <Icon className="h-7 w-7 text-green-700 transition-colors duration-300 group-hover:text-white" />
                  </div>

                  <h3 className="mt-6 text-2xl font-bold text-gray-900">
                    {value.title}
                  </h3>

                  <p className="mt-4 leading-7 text-gray-600">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Bottom Statement */}

          <motion.div
            variants={itemVariants}
            className="mt-20 overflow-hidden rounded-3xl bg-gradient-to-r from-green-900 via-green-800 to-emerald-800 p-10 text-center text-white shadow-2xl"
          >
            <h3 className="text-3xl font-bold">
              Our Values Are Our Competitive Advantage
            </h3>

            <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-green-100">
              Markets evolve, technologies advance, and customer expectations
              continue to grow. What remains constant is our commitment to doing
              business with integrity, delivering exceptional quality, fostering
              innovation, and building lasting relationships founded on trust.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}