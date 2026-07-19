"use client";

import * as React from "react";
import { cn } from "@/lib/design/utils";

export interface GlassCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  blur?: "sm" | "md" | "lg";
  padding?: "none" | "sm" | "md" | "lg";
  border?: boolean;
  shadow?: "sm" | "md" | "lg";
}

const blurClasses = {
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-xl",
};

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

const shadowClasses = {
  sm: "shadow-md",
  md: "shadow-xl",
  lg: "shadow-2xl",
};

export function GlassCard({
  hover = true,
  blur = "md",
  padding = "md",
  border = true,
  shadow = "md",
  className,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-3xl",
        "bg-white/70 dark:bg-slate-900/70",
        blurClasses[blur],
        paddingClasses[padding],
        shadowClasses[shadow],

        border &&
          "border border-white/40 dark:border-white/10",

        hover && "transition-all duration-300 ease-out",
        hover && "hover:-translate-y-2",
        hover && "hover:shadow-2xl",
        hover && "hover:border-primary/30",

        className
      )}
      {...props}
    >
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

export default GlassCard;