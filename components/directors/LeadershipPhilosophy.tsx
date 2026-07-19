"use client";

import { motion, type Variants } from "framer-motion";
import {
  Compass,
  Globe,
  Handshake,
  Leaf,
  ShieldCheck,
  TrendingUp,
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

const principles = [
  {
    icon: Handshake,
    title: "Trust First",
    description:
      "Every business relationship begins with transparency, honesty, and long-term commitment.",
  },
  {
    icon: ShieldCheck,
    title: "Quality Without Compromise",
    description:
      "Consistent product quality and compliance remain at the center of every shipment.",
  },
  {
    icon: Globe,
    title: "Global Perspective",
    description:
      "Connecting Indian agricultural excellence with international buyers through reliable exports.",
  },
  {
    icon: Leaf,
    title: "Responsible Growth",
    description:
      "Supporting sustainable agriculture while creating value for farmers and customers alike.",
  },
  {
    icon: TrendingUp,
    title: "Continuous Improvement",
    description:
      "Learning, innovating and improving every process to deliver better customer experiences.",
  },
  {
    icon: Compass,
    title: "Purpose Driven Leadership",
    description:
      "Making decisions guided by ethics, vision, customer success and long-term business value.",
  },
];

export default function LeadershipPhilosophy() {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-20 lg:py-28">
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
              Leadership Philosophy
            </span>

            <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Principles That Guide
              <span className="block text-green-700">
                Every Business Decision
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              At ROOTYM, leadership extends beyond managing operations. It is
              about creating lasting value for customers, empowering farmers,
              strengthening partnerships, and building a globally respected
              Indian export brand.
            </p>
          </motion.div>

          {/* Philosophy Quote */}

          <motion.div
            variants={itemVariants}
            className="mx-auto mt-14 max-w-5xl rounded-3xl border border-green-200 bg-gradient-to-r from-green-900 to-emerald-800 p-10 text-center text-white shadow-xl"
          >
            <p className="text-xl font-medium leading-9 md:text-2xl">
              "Leadership is measured not by the number of shipments we export,
              but by the trust we build, the farmers we empower, and the value
              we create for customers across the world."
            </p>
          </motion.div>

          {/* Principles */}

          <motion.div
            variants={containerVariants}
            className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          >
            {principles.map((principle) => {
              const Icon = principle.icon;

              return (
                <motion.div
                  key={principle.title}
                  variants={itemVariants}
                  className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-green-300 hover:shadow-xl"
                >
                  <div className="inline-flex rounded-2xl bg-green-100 p-4">
                    <Icon className="h-7 w-7 text-green-700" />
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-gray-900">
                    {principle.title}
                  </h3>

                  <p className="mt-4 leading-7 text-gray-600">
                    {principle.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Closing */}

          <motion.div
            variants={itemVariants}
            className="mx-auto mt-20 max-w-4xl text-center"
          >
            <p className="text-lg leading-8 text-gray-600">
              These principles shape every interaction at ROOTYM—from sourcing
              agricultural products and maintaining quality standards to serving
              international buyers with professionalism, transparency and
              consistency. They represent the foundation upon which the company
              continues to grow.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}