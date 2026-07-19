"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Loader2 } from "lucide-react";
import {
  motion,
  type HTMLMotionProps,
} from "framer-motion";

import { cn } from "@/lib/design/utils";

export interface PremiumButtonProps
  extends Omit<
    HTMLMotionProps<"button">,
    "children" | "ref"
  > {
  /**
   * Button content
   */
  children?: React.ReactNode;

  /**
   * Render as child (Radix Slot)
   */
  asChild?: boolean;

  /**
   * Button variant
   */
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "gradient"
    | "danger";

  /**
   * Button size
   */
  size?: "sm" | "md" | "lg" | "xl";

  /**
   * Loading state
   */
  loading?: boolean;

  /**
   * Optional icons
   */
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;

  /**
   * Full width button
   */
  fullWidth?: boolean;
}

const variants = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl",

  secondary:
    "bg-slate-900 text-white hover:bg-slate-800 shadow-lg hover:shadow-xl dark:bg-slate-100 dark:text-slate-900",

    outline:
    "border border-border bg-transparent text-foreground hover:bg-muted/70",

  ghost:
    "bg-transparent hover:bg-muted text-foreground",

  gradient:
    "bg-gradient-to-r from-primary to-emerald-600 text-white shadow-xl hover:shadow-2xl",

  danger:
    "bg-red-600 text-white hover:bg-red-700 shadow-lg",
} as const;

const sizes = {
  sm: "h-9 px-4 text-sm rounded-lg",
  md: "h-11 px-6 text-sm rounded-xl",
  lg: "h-12 px-8 text-base rounded-xl",
  xl: "h-14 px-10 text-lg rounded-2xl",
} as const;

export const PremiumButton = React.forwardRef<
  HTMLButtonElement,
  PremiumButtonProps
>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const classes = cn(
      "group relative inline-flex items-center justify-center gap-2",
      "font-semibold transition-all duration-300",
      "focus-visible:outline-none",
      "focus-visible:ring-4 focus-visible:ring-primary/20",
      "disabled:pointer-events-none disabled:opacity-50",
      "select-none whitespace-nowrap overflow-hidden",
      variants[variant],
      sizes[size],
      fullWidth && "w-full",
      className
    );

    const content = (
      <>
        <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
          <span className="absolute left-[-120%] top-0 h-full w-1/2 bg-white/20 skew-x-[-25deg] transition-all duration-700 group-hover:left-[140%]" />
        </span>

        {loading ? (
          <>
            <Loader2 className="relative z-10 h-4 w-4 animate-spin" />
            <span className="relative z-10">{children}</span>
          </>
        ) : (
          <>
            {leftIcon && (
              <span className="relative z-10 flex items-center">
                {leftIcon}
              </span>
            )}

            <span className="relative z-10">
              {children}
            </span>

            {rightIcon && (
              <span className="relative z-10 flex items-center">
                {rightIcon}
              </span>
            )}
          </>
        )}
      </>
    );

    if (asChild) {
      return (
        <Slot className={classes}>
          {content}
        </Slot>
      );
    }

    return (
      <motion.button
        ref={ref}
        whileHover={!disabled ? { scale: 1.02 } : undefined}
        whileTap={!disabled ? { scale: 0.98 } : undefined}
        disabled={disabled || loading}
        className={classes}
        {...props}
      >
        {content}
      </motion.button>
    );
  }
);

PremiumButton.displayName = "PremiumButton";

export default PremiumButton;