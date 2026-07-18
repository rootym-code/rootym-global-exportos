// ============================================================
// ROOTYM Motion Engine
// File: lib/motion/presets.ts
// Reusable interaction & looping animation presets
// ============================================================

import { MotionProps } from "framer-motion";
import { floating, rotation, spring, transitions } from "./transitions";

/* -------------------------------------------------------------------------- */
/*                               Hover Presets                                */
/* -------------------------------------------------------------------------- */

export const hoverLift: MotionProps = {
  whileHover: {
    y: -8,
    transition: transitions.hover,
  },
};

export const hoverScale: MotionProps = {
  whileHover: {
    scale: 1.03,
    transition: transitions.hover,
  },
};

export const hoverLiftScale: MotionProps = {
  whileHover: {
    y: -8,
    scale: 1.03,
    transition: transitions.hover,
  },
};

export const hoverPress: MotionProps = {
  whileTap: {
    scale: 0.97,
    transition: spring.snappy,
  },
};

export const hoverRotate: MotionProps = {
  whileHover: {
    rotate: 2,
    transition: transitions.hover,
  },
};

/* -------------------------------------------------------------------------- */
/*                            Floating Presets                                */
/* -------------------------------------------------------------------------- */

export const floatingSlow: MotionProps = {
  animate: { y: [-10, 10] },
  transition: floating.slow,
};

export const floatingMedium: MotionProps = {
  animate: { y: [-8, 8] },
  transition: floating.medium,
};

export const floatingFast: MotionProps = {
  animate: { y: [-5, 5] },
  transition: floating.fast,
};

/* -------------------------------------------------------------------------- */
/*                            Ship Bobbing                                    */
/* -------------------------------------------------------------------------- */

export const shipFloat: MotionProps = {
  animate: {
    y: [-4, 4],
    rotate: [-0.6, 0.6],
  },
  transition: {
    duration: 4,
    repeat: Infinity,
    repeatType: "mirror",
    ease: "easeInOut",
  },
};

/* -------------------------------------------------------------------------- */
/*                           Aircraft Flight                                  */
/* -------------------------------------------------------------------------- */

export const planeFloat: MotionProps = {
  animate: {
    y: [-8, 8],
    rotate: [-2, 2],
  },
  transition: {
    duration: 3,
    repeat: Infinity,
    repeatType: "mirror",
    ease: "easeInOut",
  },
};

/* -------------------------------------------------------------------------- */
/*                                Pulse                                       */
/* -------------------------------------------------------------------------- */

export const pulse: MotionProps = {
  animate: {
    scale: [1, 1.04, 1],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

export const softPulse: MotionProps = {
  animate: {
    opacity: [0.75, 1, 0.75],
  },
  transition: {
    duration: 2.5,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

/* -------------------------------------------------------------------------- */
/*                             Breathing                                      */
/* -------------------------------------------------------------------------- */

export const breathing: MotionProps = {
  animate: {
    scale: [1, 1.015, 1],
  },
  transition: {
    duration: 5,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

/* -------------------------------------------------------------------------- */
/*                              Wiggle                                        */
/* -------------------------------------------------------------------------- */

export const wiggle: MotionProps = {
  whileHover: {
    rotate: [-2, 2, -2, 0],
    transition: {
      duration: 0.45,
    },
  },
};

/* -------------------------------------------------------------------------- */
/*                          Continuous Rotation                               */
/* -------------------------------------------------------------------------- */

export const rotateSlow: MotionProps = {
  animate: { rotate: 360 },
  transition: rotation.slow,
};

export const rotateMedium: MotionProps = {
  animate: { rotate: 360 },
  transition: rotation.medium,
};

/* -------------------------------------------------------------------------- */
/*                              Orbit                                         */
/* -------------------------------------------------------------------------- */

export const orbit: MotionProps = {
  animate: { rotate: 360 },
  style: {
    transformOrigin: "center center",
  },
  transition: {
    duration: 18,
    repeat: Infinity,
    ease: "linear",
  },
};

/* -------------------------------------------------------------------------- */
/*                             Fade Pulse                                     */
/* -------------------------------------------------------------------------- */

export const fadePulse: MotionProps = {
  animate: {
    opacity: [0.4, 1, 0.4],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

/* -------------------------------------------------------------------------- */
/*                          Glass Card Hover                                  */
/* -------------------------------------------------------------------------- */

export const glassCard: MotionProps = {
  whileHover: {
    y: -10,
    scale: 1.02,
    transition: spring.smooth,
  },
  whileTap: {
    scale: 0.985,
  },
};

/* -------------------------------------------------------------------------- */
/*                          CTA Button Hover                                  */
/* -------------------------------------------------------------------------- */

export const ctaButton: MotionProps = {
  whileHover: {
    scale: 1.04,
    y: -2,
    transition: spring.snappy,
  },
  whileTap: {
    scale: 0.97,
  },
};

/* -------------------------------------------------------------------------- */
/*                             Icon Hover                                     */
/* -------------------------------------------------------------------------- */

export const iconHover: MotionProps = {
  whileHover: {
    scale: 1.15,
    rotate: 5,
    transition: spring.gentle,
  },
};

/* -------------------------------------------------------------------------- */
/*                           Export Group                                     */
/* -------------------------------------------------------------------------- */

export const presets = {
  hoverLift,
  hoverScale,
  hoverLiftScale,
  hoverPress,
  hoverRotate,
  floatingSlow,
  floatingMedium,
  floatingFast,
  shipFloat,
  planeFloat,
  pulse,
  softPulse,
  breathing,
  rotateSlow,
  rotateMedium,
  orbit,
  glassCard,
  ctaButton,
  fadePulse,
  wiggle,
  iconHover,
} as const;
