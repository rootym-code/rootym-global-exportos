// ============================================================
// ROOTYM Motion Engine
// File: lib/motion/variants.ts
// Reusable Framer Motion variants
// ============================================================

import { Variants } from "framer-motion";
import { transitions, spring, stagger } from "./transitions";

/* -------------------------------------------------------------------------- */
/*                             Fade Variants                                  */
/* -------------------------------------------------------------------------- */

export const fade = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: transitions.fade,
  },
} satisfies Variants;

/* -------------------------------------------------------------------------- */
/*                              Fade Up                                       */
/* -------------------------------------------------------------------------- */

export const fadeUp = {
  hidden: {
    opacity: 0,
    y: 32,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.reveal,
  },
} satisfies Variants;

/* -------------------------------------------------------------------------- */
/*                             Fade Down                                      */
/* -------------------------------------------------------------------------- */

export const fadeDown = {
  hidden: {
    opacity: 0,
    y: -32,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.reveal,
  },
} satisfies Variants;

/* -------------------------------------------------------------------------- */
/*                             Fade Left                                      */
/* -------------------------------------------------------------------------- */

export const fadeLeft = {
  hidden: {
    opacity: 0,
    x: 32,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.slide,
  },
} satisfies Variants;

/* -------------------------------------------------------------------------- */
/*                             Fade Right                                     */
/* -------------------------------------------------------------------------- */

export const fadeRight = {
  hidden: {
    opacity: 0,
    x: -32,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.slide,
  },
} satisfies Variants;

/* -------------------------------------------------------------------------- */
/*                              Scale In                                      */
/* -------------------------------------------------------------------------- */

export const scaleIn = {
  hidden: {
    opacity: 0,
    scale: 0.94,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: spring.smooth,
  },
} satisfies Variants;

/* -------------------------------------------------------------------------- */
/*                              Zoom In                                       */
/* -------------------------------------------------------------------------- */

export const zoomIn = {
  hidden: {
    opacity: 0,
    scale: 0.85,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: spring.gentle,
  },
} satisfies Variants;

/* -------------------------------------------------------------------------- */
/*                             Rotate In                                      */
/* -------------------------------------------------------------------------- */

export const rotateIn = {
  hidden: {
    opacity: 0,
    rotate: -8,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: spring.smooth,
  },
} satisfies Variants;

/* -------------------------------------------------------------------------- */
/*                          Container Stagger                                 */
/* -------------------------------------------------------------------------- */

export const staggerContainer = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: stagger.normal,
      delayChildren: 0.1,
    },
  },
} satisfies Variants;

/* -------------------------------------------------------------------------- */
/*                          Fast Stagger                                      */
/* -------------------------------------------------------------------------- */

export const fastStagger = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: stagger.fast,
    },
  },
} satisfies Variants;

/* -------------------------------------------------------------------------- */
/*                          Slow Stagger                                      */
/* -------------------------------------------------------------------------- */

export const slowStagger = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: stagger.slow,
    },
  },
} satisfies Variants;

/* -------------------------------------------------------------------------- */
/*                            Card Reveal                                     */
/* -------------------------------------------------------------------------- */

export const cardReveal = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.96,
  },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,

    transition: {
      ...spring.gentle,
      duration: 0.45,
    },
  },
} satisfies Variants;

/* -------------------------------------------------------------------------- */
/*                          Section Reveal                                    */
/* -------------------------------------------------------------------------- */

export const sectionReveal = {
  hidden: {
    opacity: 0,
    y: 60,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      ...transitions.reveal,
      when: "beforeChildren",
      staggerChildren: stagger.normal,
    },
  },
} satisfies Variants;

/* -------------------------------------------------------------------------- */
/*                           Hero Content                                     */
/* -------------------------------------------------------------------------- */

export const heroReveal = {
  hidden: {
    opacity: 0,
    y: 40,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      ...spring.smooth,
      staggerChildren: stagger.normal,
    },
  },
} satisfies Variants;

/* -------------------------------------------------------------------------- */
/*                          Page Transition                                   */
/* -------------------------------------------------------------------------- */

export const pageTransition = {
  initial: {
    opacity: 0,
    y: 12,
  },

  animate: {
    opacity: 1,
    y: 0,

    transition: transitions.reveal,
  },

  exit: {
    opacity: 0,
    y: -12,

    transition: transitions.fade,
  },
} satisfies Variants;

/* -------------------------------------------------------------------------- */
/*                            List Item                                       */
/* -------------------------------------------------------------------------- */

export const listItem = {
  hidden: {
    opacity: 0,
    x: -12,
  },

  visible: {
    opacity: 1,
    x: 0,

    transition: spring.gentle,
  },
} satisfies Variants;

/* -------------------------------------------------------------------------- */
/*                           Empty Variant                                    */
/* -------------------------------------------------------------------------- */

export const none = {
  hidden: {},
  visible: {},
} satisfies Variants;