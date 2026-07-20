"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const fadeUpVariants: Variants = {
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
    },
  },
};

const directors = [
  {
    name: "Prem Chand Singh",
    designation: "Founder & Director",
    image: "/images/directors/prem-singh.webp",
    description:
      "Prem Chand Singh founded ROOTYM with the vision of connecting premium Indian agricultural products with global buyers. Drawing on extensive leadership experience in technology and business, he focuses on building trusted sourcing networks, export excellence, and long-term international partnerships.",
  },
  {
    name: "Anjali Singh",
    designation: "Co-Founder & Director",
    image: "/images/directors/anjali-singh.webp",
    description:
      "Anjali Singh oversees strategic planning, operations, compliance, and customer relationships, ensuring every export engagement reflects ROOTYM's commitment to quality, transparency, and dependable service.",
  },
];

export default function LeadershipPreview() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.08),transparent_45%)]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div
            variants={fadeUpVariants}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="inline-flex rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
              Leadership Team
            </span>

            <h2 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Leadership Built on

              <span className="block text-green-700">
                Trust & Commitment
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              ROOTYM's leadership combines business experience, technology
              expertise, operational excellence, and a shared commitment to
              delivering reliable export solutions for customers worldwide.
            </p>
          </motion.div>
          <div className="mt-16 grid gap-10 lg:grid-cols-2">
            {directors.map((director) => (
              <motion.div
                key={director.name}
                variants={fadeUpVariants}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="relative h-96 overflow-hidden">
                  <Image
                    src={director.image}
                    alt={director.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-8">
                    <h3 className="text-3xl font-bold text-white">
                      {director.name}
                    </h3>

                    <p className="mt-2 text-lg text-green-200">
                      {director.designation}
                    </p>
                  </div>
                </div>

                <div className="p-8">
                  <p className="leading-8 text-slate-600">
                    {director.description}
                  </p>

                  <div className="mt-8">
                    <Link
                      href="/meet-the-directors"
                      className="inline-flex items-center gap-2 font-semibold text-green-700 transition hover:text-green-800"
                    >
                      View Full Profile
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            variants={fadeUpVariants}
            className="mt-20 overflow-hidden rounded-3xl border border-green-100 bg-gradient-to-r from-green-700 via-green-600 to-green-700 shadow-xl"
          >
            <div className="grid gap-10 p-10 lg:grid-cols-2 lg:items-center lg:p-14">
              <div className="text-white">
                <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
                  Committed Leadership
                </span>

                <h3 className="mt-6 text-4xl font-bold leading-tight">
                  Leading with Integrity.
                  <br />
                  Growing with Purpose.
                </h3>

                <p className="mt-6 text-lg leading-8 text-green-50">
                  ROOTYM is led by professionals committed to responsible
                  sourcing, export excellence, transparent business practices,
                  and long-term relationships with customers, suppliers, and
                  farming communities.
                </p>

                <Link
                  href="/meet-the-directors"
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 font-semibold text-green-700 transition-all duration-300 hover:scale-105"
                >
                  Meet the Directors

                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                  <h4 className="text-3xl font-bold text-white">
                    Strategic Leadership
                  </h4>

                  <p className="mt-3 text-green-100">
                    Guiding ROOTYM with long-term vision, responsible
                    decisions, and customer-first thinking.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                  <h4 className="text-3xl font-bold text-white">
                    Innovation
                  </h4>

                  <p className="mt-3 text-green-100">
                    Leveraging technology and modern processes to improve
                    sourcing, quality, and export operations.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                  <h4 className="text-3xl font-bold text-white">
                    Integrity
                  </h4>

                  <p className="mt-3 text-green-100">
                    Building lasting relationships through transparency,
                    ethical practices, and dependable execution.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                  <h4 className="text-3xl font-bold text-white">
                    Global Partnerships
                  </h4>

                  <p className="mt-3 text-green-100">
                    Expanding ROOTYM's international presence while creating
                    lasting value for buyers, suppliers, and communities.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}