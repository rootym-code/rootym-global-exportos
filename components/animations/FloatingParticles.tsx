/**
 * ============================================================
 * ROOTYM Motion Engine
 * File: components/animations/FloatingParticles.tsx
 * ============================================================
 */
"use client";

import { memo, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface FloatingParticlesProps {
  count?: number;
  className?: string;
}

interface Particle {
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
}

function FloatingParticles({
  count = 18,
  className,
}: FloatingParticlesProps) {
  const reduced = useReducedMotion();

  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: ((i * 53) % 100),
        top: ((i * 37) % 100),
        size: 4 + ((i * 7) % 8),
        duration: 6 + (i % 5),
        delay: (i % 6) * 0.35,
        drift: 10 + (i % 4) * 6,
      })),
    [count]
  );

  return (
    <div
      className={className}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {particles.map((p, index) => (
        <motion.span
          key={index}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            borderRadius: "9999px",
            background: "rgba(255,255,255,0.55)",
            filter: "blur(0.5px)",
          }}
          animate={
            reduced
              ? undefined
              : {
                  y: [-p.drift, p.drift, -p.drift],
                  x: [-4, 4, -4],
                  opacity: [0.15, 0.7, 0.15],
                  scale: [0.9, 1.2, 0.9],
                }
          }
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default memo(FloatingParticles);
