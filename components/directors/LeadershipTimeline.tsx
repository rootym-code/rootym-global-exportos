"use client";

import { motion, type Variants } from "framer-motion";
import {
  Briefcase,
  Building2,
  Globe,
  Rocket,
  Sprout,
} from "lucide-react";

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
    y: 32,
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

const timeline = [
  {
    year: "20+ Years",
    title: "Professional Experience",
    description:
      "Extensive experience across technology, leadership and business transformation, building strong foundations in operational excellence and customer-centric delivery.",
    icon: Briefcase,
  },
  {
    year: "2025",
    title: "ROOTYM Founded",
    description:
      "Established ROOTYM Agro Harvest Private Limited with a vision of taking premium Indian agricultural products to international markets while empowering farmers.",
    icon: Building2,
  },
  {
    year: "Today",
    title: "Export Expansion",
    description:
      "Developing trusted global partnerships, strengthening export capabilities and building a premium agricultural brand recognised for quality and reliability.",
    icon: Globe,
  },
  {
    year: "Future",
    title: "Sustainable Growth",
    description:
      "Leveraging technology, innovation and responsible sourcing to create long-term value for customers, partners and farming communities.",
    icon: Sprout,
  },
];

export default function LeadershipTimeline() {
  return (
    <section className="bg-gradient-to-b from-white to-green-50 py-20 lg:py-28">
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
              Leadership Journey
            </span>

            <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Building ROOTYM
              <span className="block text-green-700">
                One Milestone at a Time
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              Every milestone reflects our commitment to excellence,
              entrepreneurship, innovation and building lasting relationships in
              the global agricultural export industry.
            </p>
          </motion.div>

          {/* Timeline */}

          <div className="relative mt-20">
            <div className="absolute left-6 top-0 hidden h-full w-1 rounded-full bg-green-200 lg:block" />

            <div className="space-y-12">
              {timeline.map((item) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.title}
                    variants={itemVariants}
                    className="relative lg:pl-20"
                  >
                    {/* Timeline Dot */}

                    <div className="absolute left-0 top-3 hidden lg:flex h-12 w-12 items-center justify-center rounded-full bg-green-700 text-white shadow-lg">
                      <Icon className="h-6 w-6" />
                    </div>

                    {/* Mobile Icon */}

                    <div className="mb-6 inline-flex rounded-2xl bg-green-100 p-4 lg:hidden">
                      <Icon className="h-6 w-6 text-green-700" />
                    </div>

                    <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-green-300 hover:shadow-xl">
                      <span className="inline-flex rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-700">
                        {item.year}
                      </span>

                      <h3 className="mt-5 text-2xl font-bold text-gray-900">
                        {item.title}
                      </h3>

                      <p className="mt-4 leading-8 text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Future Vision */}

          <motion.div
            variants={itemVariants}
            className="mt-20 overflow-hidden rounded-3xl bg-gradient-to-r from-green-900 via-green-800 to-emerald-800 p-10 text-center text-white shadow-2xl"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
              <Rocket className="h-8 w-8" />
            </div>

            <h3 className="mt-6 text-3xl font-bold">
              Looking Ahead
            </h3>

            <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-green-100">
              Our journey has only begun. We remain committed to building a
              globally trusted agricultural export company that represents the
              quality, diversity and strength of Indian agriculture while
              creating sustainable opportunities for farmers and international
              partners.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}