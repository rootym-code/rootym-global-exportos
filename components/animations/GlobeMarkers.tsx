/**
 * ============================================================
 * ROOTYM Motion Engine
 * File: components/animations/GlobeMarkers.tsx
 * ============================================================
 */
"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { EXPORT_HUBS, COLORS } from "./globe.constants";
import { pulse } from "@/lib/motion";

function GlobeMarkers() {
  return (
    <g aria-hidden="true">
      {EXPORT_HUBS.map((hub) => (
        <g key={hub.id}>
          <motion.circle
            {...pulse}
            cx={hub.x}
            cy={hub.y}
            r={(hub.radius ?? 6) + 10}
            fill={COLORS.glow}
            opacity={0.18}
          />
          <circle
            cx={hub.x}
            cy={hub.y}
            r={(hub.radius ?? 6) + 3}
            fill="none"
            stroke={COLORS.glow}
            strokeWidth="2"
            opacity={0.45}
          />
          <motion.circle
            cx={hub.x}
            cy={hub.y}
            r={hub.radius ?? 6}
            fill={hub.primary ? COLORS.primary : COLORS.dot}
            animate={{
              scale: hub.primary ? [1, 1.12, 1] : [1, 1.06, 1],
            }}
            transition={{
              duration: hub.primary ? 1.8 : 2.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </g>
      ))}
    </g>
  );
}

export default memo(GlobeMarkers);
