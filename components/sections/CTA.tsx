/**
 * ============================================================
 * ROOTYM ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the primary conversion and contact section
 *          for the public ROOTYM AI marketing website.
 *
 * Primary conversion:
 *   GET STARTED
 *     → centralized SAAS_LOGIN_URL
 *
 * Contact:
 *   Contact Us
 *     → sales@rootym.com
 *
 * The SaaS destination is environment-aware and configured
 * through lib/config/urls.ts.
 * ============================================================
 */

"use client";

import Link from "next/link";

import {
  ArrowRight,
  Mail,
  MessageSquare,
  Sparkles,
} from "lucide-react";

import { motion } from "framer-motion";

import { SAAS_LOGIN_URL } from "@/lib/config/urls";

export default function CTA() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-slate-950 px-6 py-28 text-white"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[140px]" />

        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-500/5 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        <motion.div
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
            amount: 0.2,
          }}
          transition={{
            duration: 0.7,
          }}
          className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl shadow-black/20 md:p-14"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
            <Sparkles className="h-7 w-7 text-emerald-400" />
          </div>

          <p className="mt-7 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Let's build what's next
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-black tracking-tight md:text-5xl lg:text-6xl">
            Turn your business challenge into an intelligent solution.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            Whether you are exploring AI, modernizing an existing
            application, automating a business process or building
            a new digital platform, let's talk about what you want
            to achieve.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={SAAS_LOGIN_URL}
              className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-cyan-500 px-8 py-4 font-semibold text-white transition hover:scale-[1.02]"
            >
              GET STARTED

              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>

            <a
              href="mailto:sales@rootym.com"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-8 py-4 font-semibold text-white transition hover:bg-white/10"
            >
              Contact Us

              <MessageSquare className="h-5 w-5" />
            </a>
          </div>

          <div className="mx-auto mt-10 flex items-center justify-center gap-2 text-sm text-slate-400">
            <Mail className="h-4 w-4 text-emerald-400" />

            <a
              href="mailto:sales@rootym.com"
              className="transition hover:text-emerald-400"
            >
              sales@rootym.com
            </a>
          </div>
        </motion.div>

        <div className="mt-8 text-center">
          <Link
            href="#top"
            className="text-sm text-slate-500 transition hover:text-emerald-400"
          >
            Back to top
          </Link>
        </div>
      </div>
    </section>
  );
}