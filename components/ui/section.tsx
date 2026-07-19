"use client";

import * as React from "react";
import { cn } from "@/lib/design/utils";
import Container from "./container";

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement> {
  /**
   * Optional section id for anchor navigation.
   */
  id?: string;

  /**
   * Background variant.
   */
  background?: "default" | "muted" | "gradient" | "dark";

  /**
   * Vertical spacing.
   */
  spacing?: "none" | "sm" | "md" | "lg" | "xl";

  /**
   * Container width.
   */
  container?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";

  /**
   * Horizontal padding.
   */
  padding?: "none" | "sm" | "md" | "lg";

  /**
   * Show top divider.
   */
  divider?: boolean;

  /**
   * Render as a different HTML element.
   */
  fluid?: boolean;

  /**
   * Render as a different HTML element.
   */
  as?: React.ElementType;
}

const backgrounds = {
  default: "bg-background",
  muted: "bg-muted/30",
  gradient:
    "bg-gradient-to-b from-background via-background to-muted/30",
  dark: "bg-slate-950 text-white",
};

const spacings = {
  none: "py-0",
  sm: "py-10 md:py-12",
  md: "py-14 md:py-16",
  lg: "py-20 md:py-24",
  xl: "py-24 md:py-32",
};

export function Section({
  as: Component = "section",
  id,
  className,
  children,
  background = "default",
  spacing = "lg",
  container = "2xl",
  padding = "md",
  divider = false,
  fluid = false,
  ...props
}: SectionProps) {
  const content = fluid ? (
    children
  ) : (
    <Container size={container} padding={padding}>
      {children}
    </Container>
  );

  return (
    <Component
      id={id}
      className={cn(
        "relative w-full overflow-hidden",
        backgrounds[background],
        spacings[spacing],
        divider && "border-t border-border/50",
        className
      )}
      {...props}
    >
      {content}
    </Component>
  );
}

export default Section;