/**
 * ============================================================
 * ROOTYM ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Presents ROOTYM AI's core enterprise solution
 *          capabilities on the public marketing website.
 * ============================================================
 */

"use client";

import Link from "next/link";
import { ArrowRight, BrainCircuit, Workflow, BarChart3, CloudCog } from "lucide-react";
import { motion } from "framer-motion";

const solutions = [
  {
    title: "AI-Powered Business Systems",
    description:
      "Build intelligent business platforms that combine automation, data and AI to help teams work faster and make better decisions.",
    icon: BrainCircuit,
  },
  {
    title: "Intelligent Automation",
    description:
      "Automate repetitive workflows, connect business processes and reduce manual effort with modern intelligent automation.",
    icon: Workflow,
  },
  {
    title: "Enterprise Applications",
    description:
      "Create scalable applications tailored to complex business operations, from internal systems to customer-facing platforms.",
    icon: CloudCog,
  },
  {
    title: "Data & Decision Intelligence",
    description:
      "Turn operational data into useful insights, dashboards and intelligent decision-support systems for growing organizations.",
    icon: BarChart3,
  },
];

export default function Solutions() {
  return (
    <section
      id="solutions"
      className="relative overflow-hidden bg-slate-950 px-6 py-28 text-white"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-20 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute bottom-10 right-1/4 h-72 w-72 rounded-full bg-cyan-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Solutions
          </p>

          <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
            Intelligent technology for modern business.
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            ROOTYM AI helps organizations design and implement
            intelligent software systems that connect people,
            processes, data and automation.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {solutions.map((solution, index) => {
            const Icon = solution.icon;

            return (
              <motion.article
                key={solution.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                className="group rounded-3xl border border-white/10 bg-white/[0.035] p-8 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/20 hover:bg-white/[0.06]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
                  <Icon className="h-6 w-6 text-emerald-400" />
                </div>

                <h3 className="mt-7 text-2xl font-semibold">
                  {solution.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-400">
                  {solution.description}
                </p>

                <div className="mt-7 flex items-center gap-2 text-sm font-semibold text-emerald-400 transition group-hover:gap-3">
                  Explore capability
                  <ArrowRight className="h-4 w-4" />
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-16 rounded-3xl border border-emerald-400/15 bg-gradient-to-r from-emerald-500/10 via-transparent to-cyan-500/10 p-8 md:flex md:items-center md:justify-between md:p-10">
          <div className="max-w-2xl">
            <h3 className="text-2xl font-semibold">
              Have a business challenge to solve?
            </h3>

            <p className="mt-3 leading-7 text-slate-400">
              Talk to us about your requirements and discover
              how ROOTYM AI can help design the right solution.
            </p>
          </div>

          <Link
            href="#contact"
            className="mt-7 inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-3.5 font-semibold text-white transition hover:scale-[1.02] md:ml-8 md:mt-0"
          >
            Book a Demo
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}