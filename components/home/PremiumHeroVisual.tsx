"use client";

import { motion } from "framer-motion";

import AnimatedCard from "@/components/ui/animated-card";
import GlobalExportPanel from "@/components/animations/GlobalExportPanel";

function PremiumHeroVisual() {
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
        <GlobalExportPanel />
      </AnimatedCard>
    </motion.div>
  );
}

export default PremiumHeroVisual;