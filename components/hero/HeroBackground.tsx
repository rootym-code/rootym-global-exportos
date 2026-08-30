"use client";

import { motion } from "framer-motion";
import MouseSpotlight from "./MouseSpotlight";

export default function HeroBackground() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {/* Base Gradient */}
      <div className="absolute inset-0 bg-slate-950" />

      {/* Aurora Blob 1 */}
      <motion.div
        animate={{
          x: [0, 120, 0],
          y: [0, -80, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-32 left-1/4 h-[520px] w-[520px] rounded-full bg-emerald-500/20 blur-[140px]"
      />

      {/* Aurora Blob 2 */}
      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 80, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[-140px] top-20 h-[460px] w-[460px] rounded-full bg-cyan-500/15 blur-[150px]"
      />

      {/* Aurora Blob 3 */}
      <motion.div
        animate={{
          x: [0, 60, 0],
          y: [0, 100, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[-220px] left-1/2 h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[170px]"
      />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,.08) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial Fade */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#020617_95%)]" />
    
      <MouseSpotlight />
    </div>
  );
}