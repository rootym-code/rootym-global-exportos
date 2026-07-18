/**
 * ============================================================
 * ROOTYM Motion Engine
 * File: components/animations/CargoShip.tsx
 * ============================================================
 */
"use client";

import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface CargoShipProps {
  x?: number;
  y?: number;
  scale?: number;
}

function CargoShip({
  x = 0,
  y = 0,
  scale = 1,
}: CargoShipProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.g
      transform={`translate(${x} ${y}) scale(${scale})`}
      animate={
        reducedMotion
          ? undefined
          : {
              y: [-2, 2, -2],
              rotate: [-0.5, 0.5, -0.5],
            }
      }
      transition={{
        duration: 3.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      aria-hidden="true"
    >
      {/* Hull */}
      <path
        d="M0 16 L42 16 L36 24 L8 24 Z"
        fill="#0f172a"
      />

      {/* Deck */}
      <rect
        x="10"
        y="8"
        width="18"
        height="8"
        rx="1.5"
        fill="#ffffff"
      />
      <rect
        x="30"
        y="11"
        width="7"
        height="5"
        rx="1"
        fill="#d1d5db"
      />

      {/* Containers */}
      <rect x="12" y="2" width="7" height="6" fill="#16a34a" />
      <rect x="20" y="2" width="7" height="6" fill="#22c55e" />
      <rect x="28" y="2" width="7" height="6" fill="#15803d" />

      {/* Bow highlight */}
      <path
        d="M36 16 L42 16 L39 20 Z"
        fill="#334155"
      />
    </motion.g>
  );
}

export default memo(CargoShip);