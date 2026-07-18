/**
 * ============================================================
 * ROOTYM Motion Engine
 * File: components/animations/GlobeSvg.tsx
 * ============================================================
 */

"use client";

import { memo, ReactNode } from "react";
import { motion } from "framer-motion";
import {
  GLOBE_CENTER,
  GLOBE_RADIUS,
  GLOBE_SIZE,
  COLORS,
} from "./globe.constants";
import { rotateSlow } from "@/lib/motion";

export interface GlobeSvgProps {
  className?: string;
  children?: ReactNode;
}

function latitudePath(radius: number, scaleY: number) {
  const cy = GLOBE_CENTER;
  const cx = GLOBE_CENTER;

  return `M ${cx - radius} ${cy}
          a ${radius} ${radius * scaleY} 0 1 0 ${radius * 2} 0
          a ${radius} ${radius * scaleY} 0 1 0 -${radius * 2} 0`;
}

function longitudeEllipse(rx: number) {
  const c = GLOBE_CENTER;

  return `M ${c} ${c - GLOBE_RADIUS}
          C ${c - rx} ${c - GLOBE_RADIUS},
            ${c - rx} ${c + GLOBE_RADIUS},
            ${c} ${c + GLOBE_RADIUS}
          C ${c + rx} ${c + GLOBE_RADIUS},
            ${c + rx} ${c - GLOBE_RADIUS},
            ${c} ${c - GLOBE_RADIUS}`;
}

const LATITUDE_SCALE_FACTORS = [0.92, 0.76, 0.58, 0.36, 0.18] as const;
const LONGITUDE_SCALE_FACTORS = [0.15, 0.35, 0.55, 0.75] as const;

function GlobeSvg({ className, children }: GlobeSvgProps) {
  return (
    <motion.svg
      {...rotateSlow}
      className={className}
      viewBox={`0 0 ${GLOBE_SIZE} ${GLOBE_SIZE}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <radialGradient id="rootym-globe-fill" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="70%" stopColor="#15803d" />
          <stop offset="100%" stopColor="#052e16" />
        </radialGradient>

        <radialGradient id="rootym-glow">
          <stop offset="0%" stopColor={COLORS.glow} stopOpacity="0.55" />
          <stop offset="100%" stopColor={COLORS.glow} stopOpacity="0" />
        </radialGradient>

        <clipPath id="rootym-globe-clip">
          <circle
            cx={GLOBE_CENTER}
            cy={GLOBE_CENTER}
            r={GLOBE_RADIUS}
          />
        </clipPath>

        <filter
          id="rootym-shadow"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feGaussianBlur stdDeviation="18" />
        </filter>
      </defs>

      <circle
        cx={GLOBE_CENTER}
        cy={GLOBE_CENTER}
        r={GLOBE_RADIUS + 28}
        fill="url(#rootym-glow)"
        filter="url(#rootym-shadow)"
      />

      <circle
        cx={GLOBE_CENTER}
        cy={GLOBE_CENTER}
        r={GLOBE_RADIUS}
        fill="url(#rootym-globe-fill)"
      />

      <g clipPath="url(#rootym-globe-clip)">
        {LATITUDE_SCALE_FACTORS.map((scale) => (
          <path
            key={`lat-${scale}`}
            d={latitudePath(GLOBE_RADIUS, scale)}
            stroke={COLORS.grid}
            strokeOpacity="0.18"
            strokeWidth="2"
          />
        ))}

        {LATITUDE_SCALE_FACTORS.filter((scale) => scale !== 0.92).map(
          (scale) => (
            <path
              key={`latn-${scale}`}
              d={latitudePath(GLOBE_RADIUS, -scale)}
              stroke={COLORS.grid}
              strokeOpacity="0.18"
              strokeWidth="2"
            />
          )
        )}

        <path
          d={latitudePath(GLOBE_RADIUS, 0)}
          stroke={COLORS.grid}
          strokeOpacity="0.35"
          strokeWidth="2.5"
        />

        {LONGITUDE_SCALE_FACTORS.map((factor) => (
          <g key={factor}>
            <path
              d={longitudeEllipse(GLOBE_RADIUS * factor)}
              stroke={COLORS.grid}
              strokeOpacity="0.18"
              strokeWidth="2"
            />
            <path
              d={longitudeEllipse(-GLOBE_RADIUS * factor)}
              stroke={COLORS.grid}
              strokeOpacity="0.18"
              strokeWidth="2"
            />
          </g>
        ))}

        {children}
      </g>

      <circle
        cx={GLOBE_CENTER}
        cy={GLOBE_CENTER}
        r={GLOBE_RADIUS}
        stroke="rgba(255,255,255,.18)"
        strokeWidth="2"
      />
    </motion.svg>
  );
}

export default memo(GlobeSvg);