"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import HeroBackground from "@/components/hero/HeroBackground";

import HeroDashboard from "@/components/hero/HeroDashboard";

const trustItems = [
  "AI Powered",
  "Enterprise Ready",
  "Cloud Native",
  "24/7 Automation",
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 pt-40 pb-32 text-white">
      {/* Background Glow */}
      <HeroBackground />

      <div className="relative z-10 mx-auto max-w-7xl px-6">

        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* LEFT */}
          <div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300"
            >
              <Sparkles className="h-4 w-4" />
              AI-Powered Enterprise Solutions
            </motion.div>
            <motion.h1
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7 }}
  className="mt-8"
>
  <span className="block text-5xl font-black leading-[0.95] tracking-[-0.04em] md:text-7xl xl:text-8xl">
    Intelligence
  </span>

  <span className="mt-3 block text-5xl font-black leading-[0.95] tracking-[-0.04em] md:text-7xl xl:text-8xl">
    That
  </span>

  <motion.span
    animate={{
      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      ease: "linear",
    }}
    className="
      mt-3
      block
      bg-gradient-to-r
      from-emerald-400
      via-cyan-400
      via-blue-400
      to-emerald-400
      bg-[length:300%_300%]
      bg-clip-text
      text-5xl
      font-black
      leading-[0.95]
      tracking-[-0.04em]
      text-transparent
      md:text-7xl
      xl:text-8xl
    "
  >
    Powers Business
  </motion.span>
</motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            className="mt-10 max-w-2xl text-lg leading-9 text-slate-300 md:text-xl"
            >
              ROOTYM AI builds AI-powered SaaS platforms,
              enterprise software, intelligent automation,
              and modern business systems that help
              organizations scale faster and operate smarter.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
<Link
  href="#contact"
  className="group relative inline-flex overflow-hidden rounded-2xl"
>
  {/* Glow */}
  <span className="absolute inset-0 rounded-2xl bg-emerald-500/40 blur-xl transition duration-500 group-hover:bg-emerald-400/60" />

  {/* Animated Gradient */}
  <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-green-500 to-cyan-500 bg-[length:200%_100%] transition-all duration-700 group-hover:bg-[position:100%_0]" />

  {/* Shimmer */}
  <span className="absolute -left-32 top-0 h-full w-24 -skew-x-12 bg-white/20 transition-all duration-700 group-hover:left-[120%]" />

  {/* Content */}
  <span className="relative flex items-center gap-2 px-8 py-4 font-semibold text-white transition-transform duration-300 group-hover:-translate-y-0.5">
    Book a Demo
    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
  </span>
</Link>


              <Link
                href="#solutions"
                className="rounded-xl border border-white/15 px-7 py-4 font-semibold text-white transition hover:bg-white/10"
              >
                Explore Solutions
              </Link>
            </motion.div>

            {/* Trust Bar */}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-12 flex flex-wrap gap-6"
            >
              {trustItems.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2"
                >
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />

                  <span className="text-sm text-slate-300">
                    {item}
                  </span>
                </div>
              ))}
            </motion.div>

          </div>

          {/* RIGHT */}

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <HeroDashboard />
          </motion.div>

        </div>

      </div>
    </section>
  );
}