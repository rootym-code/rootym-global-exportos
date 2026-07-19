"use client";

import * as React from "react";
import { cn } from "@/lib/design/utils";

export interface SectionHeaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /**
   * Small label displayed above the title.
   */
  eyebrow?: React.ReactNode;

  /**
   * Main heading.
   */
  title: React.ReactNode;

  /**
   * Supporting description.
   */
  description?: React.ReactNode;

  /**
   * Optional content displayed on the right (button, link, etc.).
   */
  action?: React.ReactNode;

  /**
   * Alignment.
   */
  align?: "left" | "center" | "right";

  /**
   * Width constraint for the text block.
   */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
}

const alignments = {
  left: {
    wrapper: "items-start text-left",
    row: "justify-between",
  },
  center: {
    wrapper: "items-center text-center",
    row: "justify-center",
  },
  right: {
    wrapper: "items-end text-right",
    row: "justify-between",
  },
};

const widths = {
  sm: "max-w-xl",
  md: "max-w-2xl",
  lg: "max-w-3xl",
  xl: "max-w-4xl",
  full: "max-w-none",
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  align = "center",
  maxWidth = "lg",
  className,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-12 flex flex-col gap-6",
        alignments[align].wrapper,
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "flex w-full items-start gap-6",
          align === "center" ? "flex-col items-center" : "flex-col lg:flex-row",
          alignments[align].row
        )}
      >
        <div className={cn("space-y-5", widths[maxWidth])}>
          {eyebrow && (
            <div
              className={cn(
                "inline-flex w-fit items-center rounded-full",
                "border border-primary/15 bg-primary/5",
                "px-4 py-1.5",
                "text-xs font-semibold uppercase tracking-[0.22em]",
                "text-primary"
              )}
            >
              {eyebrow}
            </div>
          )}

          <h2
            className={cn(
              "text-balance",
              "text-3xl font-extrabold leading-tight",
              "sm:text-4xl",
              "lg:text-5xl"
            )}
          >
            {title}
          </h2>

          {description && (
            <p
              className={cn(
                "text-base leading-8 text-muted-foreground",
                "sm:text-lg"
              )}
            >
              {description}
            </p>
          )}
        </div>

        {action && (
          <div
            className={cn(
              "flex shrink-0 items-center",
              align === "center"
                ? "justify-center"
                : align === "right"
                ? "justify-end"
                : "justify-start"
            )}
          >
            {action}
          </div>
        )}
      </div>
    </div>
  );
}

export default SectionHeader;