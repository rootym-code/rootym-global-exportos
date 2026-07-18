// ============================================================
// ROOTYM Motion Engine
// File: lib/motion/index.ts
// Public API
// ============================================================

// -----------------------------------------------------------------------------
// Transitions
// -----------------------------------------------------------------------------

export {
    duration,
    easing,
    floating,
    rotation,
    spring,
    stagger,
    transitions,
  } from "./transitions";
  
  // -----------------------------------------------------------------------------
  // Variants
  // -----------------------------------------------------------------------------
  
  export {
    cardReveal,
    fade,
    fadeDown,
    fadeLeft,
    fadeRight,
    fadeUp,
    fastStagger,
    heroReveal,
    listItem,
    none,
    pageTransition,
    rotateIn,
    scaleIn,
    sectionReveal,
    slowStagger,
    staggerContainer,
    zoomIn,
  } from "./variants";
  
  // -----------------------------------------------------------------------------
  // Viewport
  // -----------------------------------------------------------------------------
  
  export {
    cardViewport,
    defaultViewport,
    earlyViewport,
    fullViewport,
    heroViewport,
    imageViewport,
    lateViewport,
    repeatViewport,
    sectionViewport,
    viewport,
  } from "./viewport";
  
  // -----------------------------------------------------------------------------
  // Motion Presets
  // -----------------------------------------------------------------------------
  
  export {
    breathing,
    ctaButton,
    fadePulse,
    floatingFast,
    floatingMedium,
    floatingSlow,
    glassCard,
    hoverLift,
    hoverLiftScale,
    hoverPress,
    hoverRotate,
    hoverScale,
    iconHover,
    orbit,
    planeFloat,
    presets,
    pulse,
    rotateMedium,
    rotateSlow,
    shipFloat,
    softPulse,
    wiggle,
  } from "./presets";
  
  // -----------------------------------------------------------------------------
  // Utilities
  // -----------------------------------------------------------------------------
  
  export {
    clamp,
    createFadeDown,
    createFadeLeft,
    createFadeRight,
    createFadeUp,
    createFloatDelay,
    createStagger,
    randomBetween,
    withDelay,
    withDuration,
  } from "./utils";