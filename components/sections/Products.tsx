/**
 * ============================================================
 * ROOTYM ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Presents ROOTYM AI's product and platform
 *          capabilities on the public marketing website.
 *
 * Primary conversion:
 *   BOOK A DEMO
 *     → centralized SAAS_LOGIN_URL
 *
 * The SaaS destination is environment-aware and configured
 * through lib/config/urls.ts.
 * ============================================================
 */

"use client";

import Link from "next/link";

import {
  ArrowRight,
  Bot,
  Boxes,
  BrainCircuit,
  Cloud,
  Database,
  Workflow,
} from "lucide-react";

import { motion } from "framer-motion";

import { SAAS_LOGIN_URL } from "@/lib/config/urls";

const products = [
  {
    title: "ROOTYM AI",
    description:
      "Intelligent AI capabilities that help businesses automate work, understand information and build smarter customer experiences.",
    icon: BrainCircuit,
  },
  {
    title: "Enterprise Platforms",
    description:
      "Scalable business applications designed around your organization's processes, teams, data and operational requirements.",
    icon: Boxes,
  },
  {
    title: "Intelligent Automation",
    description:
      "Connect workflows, automate repetitive tasks and create reliable digital processes across your business operations.",
    icon: Workflow,
  },
  {
    title: "AI Agents & Assistants",
    description:
      "Build intelligent assistants and AI-powered agents that can support employees, customers and operational workflows.",
    icon: Bot,
  },
  {
    title: "Cloud Applications",
    description:
      "Modern cloud-native applications built for accessibility, scalability, security and continuous improvement.",
    icon: Cloud,
  },
  {
    title: "Data & Intelligence",
    description:
      "Transform business data into useful dashboards, insights and decision-support capabilities.",
    icon: Database,
  },
];

export default function Products() {
  return (
    <section
      id="products"
      className="relative overflow-hidden bg-slate-900 px-6 py-28 text-white"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-1/3 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl" />

        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Products & Platforms
          </p>

          <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
            Technology built around your business.
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            From AI-powered applications to enterprise automation,
            ROOTYM AI provides the technology foundation for
            organizations building the next generation of digital
            business.
          </p>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => {
            const Icon = product.icon;

            return (
              <motion.article
                key={product.title}
                initial={{
                  opacity: 0,
                  y: 24,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.15,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.06,
                }}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-7 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/25 hover:bg-white/[0.06]"
              >
                <div className="absolute right-0 top-0 h-32 w-32 translate-x-1/3 -translate-y-1/3 rounded-full bg-emerald-500/10 blur-3xl transition duration-500 group-hover:bg-emerald-400/20" />

                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
                    <Icon className="h-6 w-6 text-emerald-400" />
                  </div>

                  <h3 className="mt-7 text-xl font-semibold">
                    {product.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-slate-400">
                    {product.description}
                  </p>

                  <div className="mt-7 flex items-center gap-2 text-sm font-semibold text-emerald-400 transition-all duration-300 group-hover:gap-3">
                    Learn more
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center md:flex-row md:text-left">
          <div>
            <h3 className="text-2xl font-semibold">
              Looking for a solution tailored to your business?
            </h3>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Let's discuss your requirements and explore what
              can be built with ROOTYM AI.
            </p>
          </div>

          <a
            href={SAAS_LOGIN_URL}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-3.5 font-semibold text-white transition hover:scale-[1.02]"
            aria-label="Book a demo with ROOTYM ExportOS"
          >
            BOOK A DEMO

            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
}