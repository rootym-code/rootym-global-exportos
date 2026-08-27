/**
 * ============================================================
 * ROOTYM Global Export Platform
 * ============================================================
 * Author: Prem Singh
 * Module      : Motion Engine
 * Feature     : Global Export Panel
 * File        : components/animations/GlobalExportPanel.tsx
 * Purpose     : Displays the animated global export panel with
 *               CMS-managed company branding and translated
 *               export statistics.
 * ============================================================
 */

"use client";

import { memo } from "react";

import { motion } from "framer-motion";

import { useTranslation } from "@/lib/i18n/context";
import { useCompanySettings } from "@/lib/cms/company-settings";

import AnimatedGlobe from "./AnimatedGlobe";
import CargoPlane from "./CargoPlane";
import CargoShip from "./CargoShip";
import FloatingParticles from "./FloatingParticles";
import TradeRoutes from "./TradeRoutes";

import { EXPORT_HUBS } from "./globe.constants";

import {
  cardViewport,
  fadeUp,
} from "@/lib/motion";

function GlobalExportPanel() {
  const { t } = useTranslation();

  const {
    companyName,
    tagline,
  } = useCompanySettings();

  /* ============================================================
     Company Branding
     ============================================================ */

  const resolvedCompanyName =
    companyName || "ROOTYM";

  const resolvedTagline =
    tagline || t("hero.badge");

  /* ============================================================
     Statistics
     ============================================================ */

  const STATS = [
    {
      label: t("globalPanel.stats.exportHubs"),
      value: EXPORT_HUBS.length,
    },
    {
      label: t("globalPanel.stats.countries"),
      value: "25+",
    },
    {
      label: t("globalPanel.stats.products"),
      value: "50+",
    },
    {
      label: t("globalPanel.stats.availability"),
      value: "24×7",
    },
  ] as const;

  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={cardViewport}
      className="relative overflow-hidden rounded-3xl border border-emerald-500/15 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-8 shadow-2xl"
    >
      {/* ========================================================
          Floating Particles
          ======================================================== */}
      <FloatingParticles />

      <div className="relative grid items-center gap-10 lg:grid-cols-2">

        {/* ======================================================
            Content
            ====================================================== */}
        <div className="space-y-6">

          {/* Company Branding */}
          <div className="space-y-2">
            <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-300">
              {resolvedCompanyName}
            </span>

            <p className="text-sm font-medium text-emerald-200">
              {resolvedTagline}
            </p>
          </div>

          {/* Title */}
          <h2 className="text-4xl font-extrabold tracking-tight text-white">
            {t("globalPanel.title")}
          </h2>

          {/* Description */}
          <p className="max-w-xl text-slate-300">
            {t("globalPanel.description")}
          </p>

          {/* Statistics */}
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

        {/* ======================================================
            Globe
            ====================================================== */}
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