// ============================================================
// ROOTYM Motion Engine
// File: lib/motion/transitions.ts
// Shared transition presets for Framer Motion
// ============================================================

import { Transition } from "framer-motion";

/* -------------------------------------------------------------------------- */
/*                                Durations                                   */
/* -------------------------------------------------------------------------- */

export const duration = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.35,
  medium: 0.5,
  slow: 0.8,
  slower: 1.2,
} as const;

/* -------------------------------------------------------------------------- */
/*                                  Easings                                   */
/* -------------------------------------------------------------------------- */

export const easing = {
  standard: [0.25, 0.1, 0.25, 1],
  smooth: [0.4, 0.0, 0.2, 1],
  accelerate: [0.4, 0.0, 1, 1],
  decelerate: [0.0, 0.0, 0.2, 1],
  anticipate: [0.34, 1.56, 0.64, 1],
} as const;

/* -------------------------------------------------------------------------- */
/*                               Spring Presets                               */
/* -------------------------------------------------------------------------- */

export const spring = {
  gentle: {
    type: "spring",
    stiffness: 120,
    damping: 18,
    mass: 1,
  } satisfies Transition,

  smooth: {
    type: "spring",
    stiffness: 180,
    damping: 22,
    mass: 0.9,
  } satisfies Transition,

  snappy: {
    type: "spring",
    stiffness: 260,
    damping: 24,
    mass: 0.8,
  } satisfies Transition,

  bounce: {
    type: "spring",
    stiffness: 300,
    damping: 18,
    mass: 0.75,
  } satisfies Transition,
} as const;

/* -------------------------------------------------------------------------- */
/*                           Common Transition Sets                           */
/* -------------------------------------------------------------------------- */

export const transitions = {
  fade: {
    duration: duration.normal,
    ease: easing.standard,
  } satisfies Transition,

  reveal: {
    duration: duration.medium,
    ease: easing.smooth,
  } satisfies Transition,

  slide: {
    duration: duration.medium,
    ease: easing.decelerate,
  } satisfies Transition,

  scale: {
    duration: duration.fast,
    ease: easing.standard,
  } satisfies Transition,

  hover: {
    type: "spring",
    stiffness: 260,
    damping: 18,
  } satisfies Transition,

  layout: {
    type: "spring",
    stiffness: 220,
    damping: 26,
  } satisfies Transition,

  card: {
    type: "spring",
    stiffness: 180,
    damping: 22,
  } satisfies Transition,

  button: {
    type: "spring",
    stiffness: 320,
    damping: 24,
  } satisfies Transition,

  modal: {
    duration: duration.medium,
    ease: easing.smooth,
  } satisfies Transition,

  drawer: {
    duration: duration.slow,
    ease: easing.decelerate,
  } satisfies Transition,

  tooltip: {
    duration: duration.fast,
    ease: easing.standard,
  } satisfies Transition,

  page: {
    duration: duration.medium,
    ease: easing.smooth,
  } satisfies Transition,
} as const;

/* -------------------------------------------------------------------------- */
/*                             Floating Animation                             */
/* -------------------------------------------------------------------------- */

export const floating = {
  slow: {
    duration: 8,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut",
  } satisfies Transition,

  medium: {
    duration: 6,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut",
  } satisfies Transition,

  fast: {
    duration: 4,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut",
  } satisfies Transition,
} as const;

/* -------------------------------------------------------------------------- */
/*                               Rotation Loop                                */
/* -------------------------------------------------------------------------- */

export const rotation = {
  slow: {
    duration: 40,
    repeat: Infinity,
    ease: "linear",
  } satisfies Transition,

  medium: {
    duration: 20,
    repeat: Infinity,
    ease: "linear",
  } satisfies Transition,
} as const;

/* -------------------------------------------------------------------------- */
/*                              Stagger Defaults                              */
/* -------------------------------------------------------------------------- */

export const stagger = {
  fast: 0.05,
  normal: 0.08,
  slow: 0.12,
} as const;
