"use client";

import * as React from "react";
import {
  motion,
  type Variants,
  type HTMLMotionProps,
} from "framer-motion";

import { cn } from "@/lib/design/utils";

export interface AnimatedCardProps
  extends Omit<
    HTMLMotionProps<"div">,
    "children" | "onClick"
  > {
  children: React.ReactNode;

  /**
   * Delay before entrance animation.
   */
  delay?: number;

  /**
   * Disable entrance animation.
   */
  animate?: boolean;

  /**
   * Enable hover lift.
   */
  hover?: boolean;

  /**
   * Enable glow border on hover.
   */
  glow?: boolean;

  /**
   * Optional click handler.
   */
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const variants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 0.98,
  },

  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      delay,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export function AnimatedCard({
  children,
  className,
  delay = 0,
  animate = true,
  hover = true,
  glow = false,
  onClick,
  ...props
}: AnimatedCardProps) {
  return (
    <motion.div
      custom={delay}
      variants={variants}
      initial={animate ? "hidden" : false}
      whileInView={animate ? "visible" : undefined}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      whileHover={
        hover
          ? {
              y: -8,
              scale: 1.015,
            }
          : undefined
      }
      whileTap={
        hover
          ? {
              scale: 0.99,
            }
          : undefined
      }
      className={cn(
        "group relative overflow-hidden rounded-3xl",
        "transition-all duration-300",
        glow &&
          "before:absolute before:inset-0 before:rounded-3xl before:border before:border-primary/0 before:transition-all before:duration-300 hover:before:border-primary/40",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {glow && (
        <div
          className={cn(
            "pointer-events-none absolute inset-0 opacity-0",
            "transition-opacity duration-300",
            "group-hover:opacity-100"
          )}
        >
          <div className="absolute inset-x-10 -top-20 h-40 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute inset-x-16 -bottom-20 h-40 rounded-full bg-emerald-500/10 blur-3xl" />
        </div>
      )}

      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

export default AnimatedCard;