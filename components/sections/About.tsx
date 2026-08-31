/**
 * ============================================================
 * ROOTYM ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Presents the ROOTYM AI story, technology vision
 *          and approach to building intelligent business
 *          systems on the public marketing website.
 * ============================================================
 */

"use client";

import Link from "next/link";
import {
  ArrowRight,
  Lightbulb,
  ShieldCheck,
  Target,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

const principles = [
  {
    title: "Business First",
    description:
      "Technology should solve real business problems. We begin with your objectives, workflows and outcomes before choosing the technology.",
    icon: Target,
  },
  {
    title: "Intelligence by Design",
    description:
      "AI and automation are integrated where they create measurable value rather than being added simply because they are available.",
    icon: Lightbulb,
  },
  {
    title: "Built to Scale",
    description:
      "Our platforms are designed with modern cloud architecture so they can evolve as your business, users and requirements grow.",
    icon: Zap,
  },
  {
    title: "Security & Reliability",
    description:
      "Enterprise systems require dependable foundations. Security, reliability and maintainability are considered throughout the solution.",
    icon: ShieldCheck,
  },
];

export default function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-white px-6 py-28 text-slate-900"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-emerald-100/60 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-100/50 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              About ROOTYM AI
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
              Technology with a purpose.
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              ROOTYM AI is focused on building intelligent
              software systems that help organizations operate
              smarter, automate effectively and create better
              digital experiences.
            </p>

            <p className="mt-5 leading-7 text-slate-500">
              We combine artificial intelligence, modern
              application engineering, cloud technologies and
              business process thinking to create platforms that
              are practical today and ready for tomorrow.
            </p>

            <a
  href="https://app.export.rootym.com/login"
  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 font-semibold text-white transition hover:bg-slate-800"
>
  Talk to ROOTYM AI
  <ArrowRight className="h-5 w-5" />
</a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-2xl shadow-slate-900/10 md:p-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-400">
                    Our approach
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold">
                    From idea to intelligent platform.
                  </h3>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
                  <Lightbulb className="h-6 w-6 text-emerald-400" />
                </div>
              </div>

              <div className="mt-10 space-y-5">
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-sm font-bold text-slate-950">
                    1
                  </div>

                  <div>
                    <h4 className="font-semibold">
                      Understand
                    </h4>

                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      Understand the business challenge,
                      users, processes and desired outcomes.
                    </p>
                  </div>
                </div>

                <div className="ml-4 h-6 border-l border-dashed border-slate-700" />

                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-sm font-bold text-slate-950">
                    2
                  </div>

                  <div>
                    <h4 className="font-semibold">
                      Design
                    </h4>

                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      Design the right combination of
                      applications, automation, data and AI.
                    </p>
                  </div>
                </div>

                <div className="ml-4 h-6 border-l border-dashed border-slate-700" />

                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-sm font-bold text-slate-950">
                    3
                  </div>

                  <div>
                    <h4 className="font-semibold">
                      Build
                    </h4>

                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      Develop a scalable and maintainable
                      technology platform around the solution.
                    </p>
                  </div>
                </div>

                <div className="ml-4 h-6 border-l border-dashed border-slate-700" />

                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-sm font-bold text-slate-950">
                    4
                  </div>

                  <div>
                    <h4 className="font-semibold">
                      Evolve
                    </h4>

                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      Continuously improve the platform as
                      your business and technology needs evolve.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-20 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((principle, index) => {
            const Icon = principle.icon;

            return (
              <motion.article
                key={principle.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{
                  once: true,
                  amount: 0.15,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.07,
                }}
                className="rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-slate-900/5"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                  <Icon className="h-5 w-5 text-emerald-600" />
                </div>

                <h3 className="mt-5 font-semibold">
                  {principle.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {principle.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}