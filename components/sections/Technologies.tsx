/**
 * ============================================================
 * ROOTYM ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Presents ROOTYM AI's technology capabilities and
 *          engineering ecosystem on the public marketing website.
 * ============================================================
 */

"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  Cloud,
  Code2,
  Database,
  GitBranch,
  Globe2,
  Layers3,
  LockKeyhole,
  MessageSquare,
  Workflow,
} from "lucide-react";
import { motion } from "framer-motion";

const technologyGroups = [
  {
    title: "Artificial Intelligence",
    description:
      "AI capabilities designed to support intelligent applications, automation, assistants and decision-making.",
    icon: BrainCircuit,
    capabilities: [
      "Generative AI",
      "AI Assistants",
      "AI Agents",
      "Intelligent Automation",
    ],
  },
  {
    title: "Cloud & Applications",
    description:
      "Modern application architecture designed for scalable, reliable and maintainable digital platforms.",
    icon: Cloud,
    capabilities: [
      "Cloud Applications",
      "Web Platforms",
      "Scalable Architecture",
      "API-First Systems",
    ],
  },
  {
    title: "Data & Intelligence",
    description:
      "Technology for connecting operational data with analytics, dashboards and intelligent business insights.",
    icon: Database,
    capabilities: [
      "Data Platforms",
      "Business Intelligence",
      "Analytics",
      "Decision Support",
    ],
  },
  {
    title: "Automation & Integration",
    description:
      "Connect systems and automate processes across business applications and operational workflows.",
    icon: Workflow,
    capabilities: [
      "Workflow Automation",
      "System Integration",
      "API Integrations",
      "Process Orchestration",
    ],
  },
];

const capabilities = [
  {
    label: "AI & Machine Intelligence",
    icon: Bot,
  },
  {
    label: "Modern Web Applications",
    icon: Code2,
  },
  {
    label: "Cloud-Native Platforms",
    icon: Cloud,
  },
  {
    label: "Data & Analytics",
    icon: Database,
  },
  {
    label: "Enterprise Integration",
    icon: GitBranch,
  },
  {
    label: "Secure Architecture",
    icon: LockKeyhole,
  },
  {
    label: "Digital Experiences",
    icon: Globe2,
  },
  {
    label: "Conversational Interfaces",
    icon: MessageSquare,
  },
];

export default function Technologies() {
  return (
    <section
      id="technologies"
      className="relative overflow-hidden bg-slate-900 px-6 py-28 text-white"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/5 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Technologies
          </p>

          <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
            The technology behind intelligent business.
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            We combine AI, cloud, software engineering, data,
            automation and integrations to create technology
            platforms that solve real business challenges.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {technologyGroups.map((group, index) => {
            const Icon = group.icon;

            return (
              <motion.article
                key={group.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{
                  once: true,
                  amount: 0.15,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                className="group rounded-3xl border border-white/10 bg-white/[0.035] p-8 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/20 hover:bg-white/[0.06]"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
                    <Icon className="h-6 w-6 text-emerald-400" />
                  </div>

                  <Layers3 className="h-5 w-5 text-slate-700 transition group-hover:text-emerald-400/60" />
                </div>

                <h3 className="mt-7 text-2xl font-semibold">
                  {group.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-400">
                  {group.description}
                </p>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {group.capabilities.map((capability) => (
                    <div
                      key={capability}
                      className="rounded-xl border border-white/5 bg-white/[0.025] px-4 py-3 text-sm text-slate-300"
                    >
                      {capability}
                    </div>
                  ))}
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-12 rounded-3xl border border-white/10 bg-slate-950/60 p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-emerald-400">
                Technology capabilities
              </p>

              <h3 className="mt-3 text-2xl font-semibold">
                Flexible technology. Practical outcomes.
              </h3>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:w-[620px] lg:grid-cols-4">
              {capabilities.map((capability) => {
                const Icon = capability.icon;

                return (
                  <div
                    key={capability.label}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.025] px-3 py-3"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-emerald-400" />

                    <span className="text-xs leading-5 text-slate-400">
                      {capability.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-10 text-center md:flex-row md:text-left">
          <div>
            <h3 className="text-xl font-semibold">
              Have a technology challenge?
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Let's explore the right architecture and technology
              approach for your business.
            </p>
          </div>

          <Link
            href="#contact"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-3.5 font-semibold text-white transition hover:scale-[1.02]"
          >
            Book a Demo
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}