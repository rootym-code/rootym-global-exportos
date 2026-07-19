"use client";

import * as React from "react";
import { cn } from "@/lib/design/utils";

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Maximum width of the container.
   */
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";

  /**
   * Horizontal padding.
   */
  padding?: "none" | "sm" | "md" | "lg";

  /**
   * Render as a different HTML element.
   */
  as?: React.ElementType;

  /**
   * Center content vertically.
   */
  centered?: boolean;
}

const maxWidths = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  "2xl": "max-w-[1440px]",
  full: "max-w-none",
};

const paddings = {
  none: "",
  sm: "px-4 sm:px-6",
  md: "px-5 sm:px-8 lg:px-10",
  lg: "px-6 sm:px-10 lg:px-12",
};

export function Container({
  as: Component = "div",
  size = "2xl",
  padding = "md",
  centered = false,
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <Component
      className={cn(
        "mx-auto w-full",
        maxWidths[size],
        paddings[padding],
        centered && "flex items-center justify-center",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Container;