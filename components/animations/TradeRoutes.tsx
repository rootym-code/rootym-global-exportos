/**
 * ============================================================
 * ROOTYM Motion Engine
 * File: components/animations/TradeRoutes.tsx
 * ============================================================
 */
"use client";

import { memo } from "react";
import { motion } from "framer-motion";

import { EXPORT_HUBS, COLORS } from "./globe.constants";

function curve(
  x1: number,
  y1: number,
  x2: number,
  y2: number
) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 - Math.abs(x2 - x1) * 0.12;

  return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
}

function TradeRoutes() {
  const india = EXPORT_HUBS.find((hub) => hub.id === "india");

  if (!india) return null;

  return (
    <g aria-hidden="true">
      {EXPORT_HUBS.filter((hub) => hub.id !== "india").map(
        (hub, index) => (
          <g key={hub.id}>
            <path
              d={curve(india.x, india.y, hub.x, hub.y)}
              fill="none"
              stroke={COLORS.route}
              strokeOpacity={0.18}
              strokeWidth="2"
            />

            <motion.path
              d={curve(india.x, india.y, hub.x, hub.y)}
              fill="none"
              stroke={COLORS.route}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="14 18"
              animate={{
                strokeDashoffset: [32, 0],
              }}
              transition={{
                duration: 2.5 + (index % 4) * 0.35,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </g>
        )
      )}
    </g>
  );
}

export default memo(TradeRoutes);