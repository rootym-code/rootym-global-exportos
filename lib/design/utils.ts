import { designTokens } from "./tokens";

type ClassValue =
  | string
  | undefined
  | null
  | false
  | Record<string, boolean>;

export function cn(...values: ClassValue[]): string {
  const classes: string[] = [];

  for (const value of values) {
    if (!value) continue;

    if (typeof value === "string") {
      classes.push(value);
      continue;
    }

    for (const [key, enabled] of Object.entries(value)) {
      if (enabled) classes.push(key);
    }
  }

  return classes.join(" ");
}

export function px(value: number): string {
  return `${value}px`;
}

export function rem(value: number): string {
  return `${value / 16}rem`;
}

export function clamp(
  min: number,
  preferred: number,
  max: number
): string {
  return `clamp(${rem(min)}, ${preferred}vw, ${rem(max)})`;
}

export function transition(
  properties: string | string[],
  duration: keyof typeof designTokens.transitions = "normal",
  easing: keyof typeof designTokens.easing = "standard"
): string {
  const props = Array.isArray(properties)
    ? properties.join(", ")
    : properties;

  return `${props} ${designTokens.transitions[duration]} ${designTokens.easing[easing]}`;
}

export function shadow(
  level: keyof typeof designTokens.shadows = "md"
): string {
  return designTokens.shadows[level];
}

export function radius(
  size: keyof typeof designTokens.radius = "lg"
): string {
  return designTokens.radius[size];
}

export function space(
  size: keyof typeof designTokens.spacing
): string {
  return designTokens.spacing[size];
}

export function z(
  level: keyof typeof designTokens.zIndex
): string | number {
  return designTokens.zIndex[level];
}

export function container(
  size: keyof typeof designTokens.containers = "xl"
): string {
  return designTokens.containers[size];
}

export function isBreakpoint(
  width: number,
  breakpoint: keyof typeof designTokens.breakpoints
): boolean {
  return width >= designTokens.breakpoints[breakpoint];
}

export function cardStyle(
  elevated = false
): React.CSSProperties {
  return {
    borderRadius: radius("2xl"),
    background: designTokens.colors.white,
    boxShadow: shadow(elevated ? "xl" : "md"),
    transition: transition([
      "transform",
      "box-shadow",
      "background-color",
    ]),
  };
}

export function glassStyle(
  opacity = 0.75
): React.CSSProperties {
  return {
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    background: `rgba(255,255,255,${opacity})`,
    border: "1px solid rgba(255,255,255,0.25)",
  };
}

export function focusRing(): React.CSSProperties {
  return {
    outline: "none",
    boxShadow: `0 0 0 4px rgba(47,168,79,0.18)`,
  };
}

export function hoverLiftStyle(): React.CSSProperties {
  return {
    transform: `translateY(${designTokens.motion.cardLift}px)`,
    transition: transition(["transform", "box-shadow"]),
  };
}

export function buttonTransition(): string {
  return transition(
    ["background-color", "color", "transform", "box-shadow"],
    "fast"
  );
}

export function sectionPadding(compact = false) {
  return compact
    ? {
        paddingTop: designTokens.spacing[12],
        paddingBottom: designTokens.spacing[12],
      }
    : {
        paddingTop: designTokens.spacing[20],
        paddingBottom: designTokens.spacing[20],
      };
}

export function responsiveHeading() {
  return {
    fontSize: clamp(36, 5, 72),
    lineHeight: designTokens.typography.lineHeight.tight,
    fontWeight: designTokens.typography.fontWeight.extrabold,
  };
}

export function responsiveSubHeading() {
  return {
    fontSize: clamp(18, 2.2, 24),
    lineHeight: designTokens.typography.lineHeight.relaxed,
    fontWeight: designTokens.typography.fontWeight.medium,
  };
}

export function responsiveContainer() {
  return {
    width: "100%",
    maxWidth: container("2xl"),
    marginInline: "auto",
    paddingInline: designTokens.spacing[6],
  };
}

export const DesignUtils = {
  cn,
  px,
  rem,
  clamp,
  transition,
  shadow,
  radius,
  space,
  z,
  container,
  isBreakpoint,
  cardStyle,
  glassStyle,
  focusRing,
  hoverLiftStyle,
  buttonTransition,
  sectionPadding,
  responsiveHeading,
  responsiveSubHeading,
  responsiveContainer,
};

export default DesignUtils;