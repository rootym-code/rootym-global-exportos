// ============================================================
// ROOTYM Motion Engine
// File: lib/motion/utils.ts
// Motion utility helpers
// ============================================================

import type { Transition, Variants } from "framer-motion";

import { stagger, transitions } from "./transitions";

/* -------------------------------------------------------------------------- */
/*                               Delay Helpers                                */
/* -------------------------------------------------------------------------- */

export function withDelay(
  delay: number,
  transition: Transition = transitions.reveal,
): Transition {
  return {
    ...transition,
    delay,
  };
}

export function withDuration(
  duration: number,
  transition: Transition = transitions.reveal,
): Transition {
  return {
    ...transition,
    duration,
  };
}

/* -------------------------------------------------------------------------- */
/*                           Variant Factory                                  */
/* -------------------------------------------------------------------------- */

function createDirectionalFade(
  axis: "x" | "y",
  offset: number,
  duration = 0.5,
): Variants {
  const transition: Transition = {
    ...transitions.reveal,
    duration,
  };

  if (axis === "x") {
    return {
      hidden: {
        opacity: 0,
        x: offset,
      },
      visible: {
        opacity: 1,
        x: 0,
        transition,
      },
    };
  }

  return {
    hidden: {
      opacity: 0,
      y: offset,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition,
    },
  };
}

/* -------------------------------------------------------------------------- */
/*                            Stagger Generator                               */
/* -------------------------------------------------------------------------- */

export function createStagger(
  staggerChildren = stagger.normal,
  delayChildren = 0,
): Variants {
  return {
    hidden: {},

    visible: {
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };
}

/* -------------------------------------------------------------------------- */
/*                             Fade Generators                                */
/* -------------------------------------------------------------------------- */

export function createFadeUp(
  distance = 32,
  duration = 0.5,
): Variants {
  return createDirectionalFade("y", distance, duration);
}

export function createFadeDown(
  distance = 32,
  duration = 0.5,
): Variants {
  return createDirectionalFade("y", -distance, duration);
}

export function createFadeLeft(
  distance = 32,
  duration = 0.5,
): Variants {
  return createDirectionalFade("x", distance, duration);
}

export function createFadeRight(
  distance = 32,
  duration = 0.5,
): Variants {
  return createDirectionalFade("x", -distance, duration);
}

/* -------------------------------------------------------------------------- */
/*                              Delay Helpers                                 */
/* -------------------------------------------------------------------------- */

export const createFloatDelay = (
  index: number,
  step = 0.25,
): number => index * step;

/* -------------------------------------------------------------------------- */
/*                              Math Helpers                                  */
/* -------------------------------------------------------------------------- */

export const randomBetween = (
  min: number,
  max: number,
): number => Math.random() * (max - min) + min;

export const clamp = (
  value: number,
  min: number,
  max: number,
): number => Math.min(Math.max(value, min), max);