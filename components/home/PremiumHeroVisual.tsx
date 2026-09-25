/**
 * ============================================================
 * ROOTYM Global Export Platform
 * ============================================================
 * Author: Prem Singh
 * Module      : Home
 * Feature     : Premium Hero Visual
 * Purpose     : Displays the premium hero visual and passes
 *               Website-specific branding and content into the
 *               global export panel.
 * ============================================================
 */

"use client";

import { motion } from "framer-motion";

import AnimatedCard from "@/components/ui/animated-card";

import GlobalExportPanel from "@/components/animations/GlobalExportPanel";

export type PremiumHeroVisualProps = {
  /**
   * Website-specific business name.
   */
  websiteCompanyName?: string | null;

  /**
   * Website-specific tagline.
   */
  websiteTagline?: string | null;

  /**
   * Website-specific Website Description.
   *
   * This remains separate from the Company Description and
   * continues to represent the Website-level description.
   */
  websiteDescription?: string | null;

  /**
   * Website-specific Company Description.
   *
   * This is used specifically by the 3D/company panel.
   */
  companyDescription?: string | null;
};

function PremiumHeroVisual({
  websiteCompanyName,
  websiteTagline,
  websiteDescription,
  companyDescription,
}: PremiumHeroVisualProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.7,
      }}
      className="relative"
    >
      <AnimatedCard
        glow
        className="overflow-hidden rounded-[32px]"
      >
        <GlobalExportPanel
          websiteCompanyName={websiteCompanyName}
          websiteTagline={websiteTagline}
          websiteDescription={websiteDescription}
          companyDescription={companyDescription}
        />
      </AnimatedCard>
    </motion.div>
  );
}

export default PremiumHeroVisual;