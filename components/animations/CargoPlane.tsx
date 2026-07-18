/**
 * ============================================================
 * ROOTYM Motion Engine
 * File: components/animations/CargoPlane.tsx
 * ============================================================
 */
"use client";

import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface CargoPlaneProps {
  x?: number;
  y?: number;
  scale?: number;
  heading?: number;
}

function CargoPlane({
  x = 0,
  y = 0,
  scale = 1,
  heading = 0,
}: CargoPlaneProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.g
      transform={`translate(${x} ${y}) rotate(${heading}) scale(${scale})`}
      animate={
        reducedMotion
          ? undefined
          : {
              y: [-3, 3, -3],
            }
      }
      transition={{
        duration: 2.8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      aria-hidden="true"
    >
      {/* Fuselage */}
      <path
        d="M0 0 L24 8 L56 0 L24 -8 Z"
        fill="#f8fafc"
        stroke="#94a3b8"
        strokeWidth="1"
      />

      {/* Wings */}
      <path
        d="M20 0 L10 14 L16 14 L28 2 Z"
        fill="#cbd5e1"
      />
      <path
        d="M20 0 L10 -14 L16 -14 L28 -2 Z"
        fill="#cbd5e1"
      />

      {/* Tail */}
      <path
        d="M48 0 L60 10 L58 2 L64 0 L58 -2 L60 -10 Z"
        fill="#e2e8f0"
      />

      {/* Navigation light */}
      <circle
        cx="8"
        cy="0"
        r="1.5"
        fill="#16a34a"
      />
    </motion.g>
  );
}

export default memo(CargoPlane);