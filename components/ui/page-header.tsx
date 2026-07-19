"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import Container from "@/components/ui/container";
import { cn } from "@/lib/design/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}
export interface PageHeaderProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;

  eyebrow?: React.ReactNode;

  breadcrumbs?: BreadcrumbItem[];

  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;

  illustration?: React.ReactNode;

  align?: "left" | "center";

  background?: "default" | "gradient" | "grid";
}

const backgrounds = {
  default: "bg-background",
  gradient:
    "bg-gradient-to-br from-primary/5 via-background to-emerald-500/5",
  grid:
    "bg-background bg-[linear-gradient(to_right,rgba(15,23,42,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.05)_1px,transparent_1px)] bg-[size:48px_48px]",
};

export function PageHeader({
  title,
  description,
  eyebrow,
  breadcrumbs,
  primaryAction,
  secondaryAction,
  illustration,
  align = "left",
  background = "gradient",
  className,
  ...props
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "relative overflow-hidden py-16 lg:py-24",
        backgrounds[background],
        className
      )}
      {...props}
    >
      {/* Decorative Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      <Container size="2xl">
        <div
          className={cn(
            "relative grid gap-12",
            illustration
              ? "lg:grid-cols-[1fr_420px] lg:items-center"
              : "grid-cols-1"
          )}
        >
          <div
            className={cn(
              "space-y-6",
              align === "center" &&
                "mx-auto max-w-3xl text-center"
            )}
          >
            {breadcrumbs && breadcrumbs.length > 0 && (
              <nav
                aria-label="Breadcrumb"
                className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
              >
                {breadcrumbs.map((item, index) => (
                  <React.Fragment key={`${item.label}-${index}`}>
                    {index > 0 && (
                      <ChevronRight className="h-4 w-4 opacity-50" />
                    )}

                    {item.href ? (
                      <Link
                        href={item.href}
                        className="transition-colors hover:text-primary"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span className="font-medium text-foreground">
                        {item.label}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </nav>
            )}

            {eyebrow && (
              <div className="inline-flex rounded-full border border-primary/15 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                {eyebrow}
              </div>
            )}

            <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {title}
            </h1>

            {description && (
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                {description}
              </p>
            )}

            {(primaryAction || secondaryAction) && (
              <div
                className={cn(
                  "flex flex-wrap gap-4",
                  align === "center" && "justify-center"
                )}
              >
                {primaryAction}
                {secondaryAction}
              </div>
            )}
          </div>

          {illustration && (
            <div className="relative flex items-center justify-center">
              {illustration}
            </div>
          )}
        </div>
      </Container>
    </header>
  );
}

export default PageHeader;