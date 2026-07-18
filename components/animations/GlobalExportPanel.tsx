/**
 * ============================================================
 * ROOTYM Motion Engine
 * File: components/animations/GlobalExportPanel.tsx
 * ============================================================
 */
"use client";

import { memo } from "react";
import { motion } from "framer-motion";

import AnimatedGlobe from "./AnimatedGlobe";
import CargoPlane from "./CargoPlane";
import CargoShip from "./CargoShip";
import FloatingParticles from "./FloatingParticles";
import TradeRoutes from "./TradeRoutes";

import { EXPORT_HUBS } from "./globe.constants";
import { cardViewport, fadeUp } from "@/lib/motion";

const STATS = [
  { label: "Export Hubs", value: EXPORT_HUBS.length },
  { label: "Countries", value: "25+" },
  { label: "Products", value: "50+" },
  { label: "Availability", value: "24×7" },
] as const;

function GlobalExportPanel() {
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={cardViewport}
      className="relative overflow-hidden rounded-3xl border border-emerald-500/15 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-8 shadow-2xl"
    >
      <FloatingParticles />

      <div className="relative grid items-center gap-10 lg:grid-cols-2">
        {/* Content */}
        <div className="space-y-6">
          <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-300">
            Global Network
          </span>

          <h2 className="text-4xl font-extrabold tracking-tight text-white">
            Connecting Indian Farms to Global Markets
          </h2>

          <p className="max-w-xl text-slate-300">
            ROOTYM combines trusted sourcing, export expertise and modern
            logistics to deliver premium agricultural products worldwide.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {STATS.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
              >
                <div className="text-2xl font-bold text-emerald-300">
                  {item.value}
                </div>

                <div className="mt-1 text-sm text-slate-400">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Globe */}
        <div className="relative mx-auto w-full max-w-[560px]">
          <AnimatedGlobe />

          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 1000 1000"
            aria-hidden="true"
          >
            <TradeRoutes />

            <CargoShip
              x={610}
              y={455}
              scale={1}
            />

            <CargoPlane
              x={505}
              y={285}
              scale={0.9}
              heading={-18}
            />
          </svg>
        </div>
      </div>
    </motion.section>
  );
}

export default memo(GlobalExportPanel);