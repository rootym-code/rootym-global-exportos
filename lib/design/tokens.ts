/**
 * ROOTYM Premium Design System
 * Sprint 9
 */

export const colors = {
    brand: {
      50: "#F3FBF5",
      100: "#DDF7E5",
      200: "#BEECCB",
      300: "#92DDA6",
      400: "#5EC57A",
      500: "#2FA84F",
      600: "#218A3D",
      700: "#1C6E35",
      800: "#19582D",
      900: "#154926",
      950: "#082714",
    },
  
    emerald: {
      50: "#ECFDF5",
      100: "#D1FAE5",
      200: "#A7F3D0",
      300: "#6EE7B7",
      400: "#34D399",
      500: "#10B981",
      600: "#059669",
      700: "#047857",
      800: "#065F46",
      900: "#064E3B",
    },
  
    slate: {
      50: "#F8FAFC",
      100: "#F1F5F9",
      200: "#E2E8F0",
      300: "#CBD5E1",
      400: "#94A3B8",
      500: "#64748B",
      600: "#475569",
      700: "#334155",
      800: "#1E293B",
      900: "#0F172A",
      950: "#020617",
    },
  
    success: "#22C55E",
    warning: "#F59E0B",
    danger: "#EF4444",
    info: "#0EA5E9",
  
    white: "#FFFFFF",
    black: "#000000",
  };
  
  export const spacing = {
    0: "0",
    1: "0.25rem",
    2: "0.5rem",
    3: "0.75rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    8: "2rem",
    10: "2.5rem",
    12: "3rem",
    16: "4rem",
    20: "5rem",
    24: "6rem",
    32: "8rem",
  };
  
  export const radius = {
    none: "0",
    sm: "0.125rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    "3xl": "1.5rem",
    full: "9999px",
  };
  
  export const typography = {
    fontFamily: {
      sans: [
        "Inter",
        "system-ui",
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
        "sans-serif",
      ],
    },
  
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "3.75rem",
      "7xl": "4.5rem",
    },
  
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
  
    lineHeight: {
      tight: 1.1,
      snug: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  };
  
  export const shadows = {
    xs: "0 1px 2px rgba(15,23,42,0.05)",
    sm: "0 2px 6px rgba(15,23,42,0.06)",
    md: "0 6px 18px rgba(15,23,42,0.08)",
    lg: "0 12px 28px rgba(15,23,42,0.10)",
    xl: "0 20px 48px rgba(15,23,42,0.12)",
    "2xl": "0 30px 60px rgba(15,23,42,0.16)",
  };
  
  export const transitions = {
    fast: "150ms",
    normal: "250ms",
    slow: "400ms",
  };
  
  export const easing = {
    standard: "cubic-bezier(0.4,0,0.2,1)",
    accelerate: "cubic-bezier(0.4,0,1,1)",
    decelerate: "cubic-bezier(0,0,0.2,1)",
  };
  
  export const zIndex = {
    hide: -1,
    auto: "auto",
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    overlay: 1200,
    modal: 1300,
    popover: 1400,
    toast: 1500,
    tooltip: 1600,
  };
  
  export const containers = {
    xs: "480px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1440px",
    "3xl": "1600px",
  };
  
  export const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
  };
  
  export const motion = {
    hoverScale: 1.02,
    pressScale: 0.98,
    cardLift: -6,
    fadeDuration: 0.35,
    spring: {
      stiffness: 260,
      damping: 24,
      mass: 1,
    },
  };
  
  export const designTokens = {
    colors,
    spacing,
    radius,
    typography,
    shadows,
    transitions,
    easing,
    zIndex,
    containers,
    breakpoints,
    motion,
  };
  
  export default designTokens;