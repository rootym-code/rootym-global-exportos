/**
 * ============================================================
 * ROOTYM Motion Engine
 * File: components/animations/AnimatedGlobe.tsx
 * ============================================================
 */
"use client";

import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";

import GlobeSvg from "./GlobeSvg";
import GlobeMarkers from "./GlobeMarkers";

import { breathing } from "@/lib/motion";

export interface AnimatedGlobeProps {
  className?: string;
  size?: number | string;
}

function AnimatedGlobe({
  className,
  size = "100%",
}: AnimatedGlobeProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      style={{
        width: size,
        aspectRatio: "1 / 1",
        position: "relative",
      }}
      {...(!reduceMotion ? breathing : {})}
      role="img"
      aria-label="Animated globe showing ROOTYM global export network"
    >
      <GlobeSvg className="absolute inset-0 h-full w-full">
        <GlobeMarkers />
      </GlobeSvg>
    </motion.div>
  );
}

export default memo(AnimatedGlobe);