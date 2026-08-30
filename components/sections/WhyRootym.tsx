/**
 * ============================================================
 * ROOTYM ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Communicates the key reasons businesses choose
 *          ROOTYM AI for intelligent technology solutions.
 * ============================================================
 */

"use client";

import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Handshake,
  LockKeyhole,
  Rocket,
  Settings2,
} from "lucide-react";
import { motion } from "framer-motion";

const reasons = [
  {
    title: "Business-led technology",
    description:
      "We start with the business problem, operational reality and desired outcome—not technology for technology's sake.",
    icon: Settings2,
  },
  {
    title: "AI where it matters",
    description:
      "We identify practical opportunities for AI and automation that can improve productivity, customer experience and decision-making.",
    icon: BrainCircuit,
  },
  {
    title: "Built for growth",
    description:
      "Modern architecture gives your applications the flexibility to evolve as your users, processes and business requirements grow.",
    icon: Rocket,
  },
  {
    title: "Security by design",
    description:
      "Reliable technology requires strong foundations. Security, access control and maintainability are considered from the beginning.",
    icon: LockKeyhole,
  },
  {
    title: "A long-term technology partner",
    description:
      "We aim to build lasting relationships, continuously improving technology as your organization changes and grows.",
    icon: Handshake,
  },
];

const commitments = [
  "Clear communication",
  "Practical solutions",
  "Scalable architecture",
  "Continuous improvement",
  "Outcome-focused delivery",
  "Long-term partnership",
];

export default function WhyRootym() {
  return (
    <section
      id="why-rootym"
      className="relative overflow-hidden bg-white px-6 py-28 text-slate-900"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/3 top-0 h-96 w-96 rounded-full bg-emerald-100/50 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-100/50 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
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
              Why ROOTYM
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
              Technology that works for your business.
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              The best technology is not simply impressive. It
              should make your organization more capable,
              efficient and ready for what comes next.
            </p>

            <p className="mt-5 leading-7 text-slate-500">
              ROOTYM AI combines business understanding with
              modern engineering, artificial intelligence and
              automation to create practical digital systems
              that deliver lasting value.
            </p>

            <Link
              href="#contact"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 font-semibold text-white transition hover:bg-slate-800"
            >
              Start a Conversation
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>

          <div className="space-y-5">
            {reasons.map((reason, index) => {
              const Icon = reason.icon;

              return (
                <motion.article
                  key={reason.title}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.07,
                  }}
                  className="group flex gap-5 rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-x-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-slate-900/5 md:p-7"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50">
                    <Icon className="h-6 w-6 text-emerald-600" />
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold">
                      {reason.title}
                    </h3>

                    <p className="mt-2 leading-7 text-slate-500">
                      {reason.description}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{ duration: 0.6 }}
          className="mt-20 overflow-hidden rounded-[2rem] bg-slate-950 p-8 text-white md:p-10"
        >
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-emerald-400">
                Our commitment
              </p>

              <h3 className="mt-3 text-2xl font-semibold md:text-3xl">
                Build technology you can grow with.
              </h3>

              <p className="mt-4 leading-7 text-slate-400">
                From the first conversation to continuous
                improvement, our focus stays on creating
                technology that delivers practical business value.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {commitments.map((commitment) => (
                <div
                  key={commitment}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3.5"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />

                  <span className="text-sm text-slate-300">
                    {commitment}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}