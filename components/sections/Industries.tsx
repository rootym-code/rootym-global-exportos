/**
 * ============================================================
 * ROOTYM ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Presents the industries and business domains where
 *          ROOTYM AI solutions can deliver digital transformation.
 *
 * Primary SaaS destination:
 *   centralized SAAS_LOGIN_URL
 *
 * The SaaS destination is environment-aware and configured
 * through lib/config/urls.ts.
 * ============================================================
 */

"use client";

import {
  ArrowRight,
  Building2,
  Factory,
  Globe2,
  HeartPulse,
  Landmark,
  ShoppingCart,
  Truck,
} from "lucide-react";

import { motion } from "framer-motion";

import { SAAS_LOGIN_URL } from "@/lib/config/urls";

const industries = [
  {
    title: "Manufacturing",
    description:
      "Digitize production, operations and business workflows with intelligent applications built around complex industrial processes.",
    icon: Factory,
  },
  {
    title: "Logistics & Supply Chain",
    description:
      "Connect operational data, automate workflows and improve visibility across inventory, fulfillment and supply-chain operations.",
    icon: Truck,
  },
  {
    title: "Retail & Commerce",
    description:
      "Create smarter commerce experiences and business systems that connect customers, products, operations and data.",
    icon: ShoppingCart,
  },
  {
    title: "Financial Services",
    description:
      "Build secure digital workflows, intelligent automation and data-driven systems for modern financial operations.",
    icon: Landmark,
  },
  {
    title: "Healthcare",
    description:
      "Develop technology platforms that help organizations improve workflows, information access and operational efficiency.",
    icon: HeartPulse,
  },
  {
    title: "Enterprise & Professional Services",
    description:
      "Modernize internal operations with intelligent platforms designed around people, processes, knowledge and business data.",
    icon: Building2,
  },
  {
    title: "Global Businesses",
    description:
      "Support organizations operating across markets with scalable cloud applications, automation and intelligent business systems.",
    icon: Globe2,
  },
];

export default function Industries() {
  return (
    <section
      id="industries"
      className="relative overflow-hidden bg-slate-950 px-6 py-28 text-white"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/5 blur-3xl" />

        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-cyan-500/5 blur-3xl" />

        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.5fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
              Industries
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
              Technology that adapts to your industry.
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-400">
              Every industry has different processes, challenges
              and opportunities. ROOTYM AI builds technology
              around the way your organization actually works.
            </p>

            <a
              href={SAAS_LOGIN_URL}
              className="mt-8 inline-flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-6 py-3.5 font-semibold text-emerald-300 transition hover:bg-emerald-400/20"
            >
              Discuss your industry

              <ArrowRight className="h-5 w-5" />
            </a>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {industries.map((industry, index) => {
              const Icon = industry.icon;

              return (
                <motion.article
                  key={industry.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{
                    once: true,
                    amount: 0.15,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.06,
                  }}
                  className="group rounded-3xl border border-white/10 bg-white/[0.035] p-7 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/20 hover:bg-white/[0.06]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
                      <Icon className="h-6 w-6 text-emerald-400" />
                    </div>

                    <ArrowRight className="h-5 w-5 text-slate-600 transition duration-300 group-hover:translate-x-1 group-hover:text-emerald-400" />
                  </div>

                  <h3 className="mt-7 text-xl font-semibold">
                    {industry.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-slate-400">
                    {industry.description}
                  </p>
                </motion.article>
              );
            })}

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{
                once: true,
                amount: 0.15,
              }}
              transition={{
                duration: 0.5,
                delay: industries.length * 0.06,
              }}
              className="flex min-h-[220px] flex-col justify-center rounded-3xl border border-dashed border-emerald-400/20 bg-emerald-400/[0.03] p-7"
            >
              <p className="text-sm font-semibold text-emerald-400">
                Your industry
              </p>

              <h3 className="mt-3 text-xl font-semibold">
                Don't see your sector?
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-400">
                Our platforms are designed to adapt to different
                business models, workflows and operational needs.
              </p>

              <a
                href={SAAS_LOGIN_URL}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-400"
              >
                Talk to our team

                <ArrowRight className="h-4 w-4" />
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}