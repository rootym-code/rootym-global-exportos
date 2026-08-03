"use client";

import React from "react";
import NextLink from "next/link";
import { useTranslation } from "./context";

interface LinkProps extends React.ComponentProps<typeof NextLink> {}

export function Link({ href, ...props }: LinkProps) {
  const { locale } = useTranslation();
  
  let hrefStr = "";
  if (typeof href === "string") {
    hrefStr = href;
  } else if (href && typeof href === "object" && href.pathname) {
    hrefStr = href.pathname;
  }

  // Prepend locale to relative paths, excluding API routes, admin, external links, anchor links
  const isRelative = hrefStr.startsWith("/") && !hrefStr.startsWith("/api") && !hrefStr.startsWith("/admin");
  
  let finalHref = href;
  if (isRelative) {
    const cleanHref = hrefStr === "/" ? "" : hrefStr;
    const localizedPath = `/${locale}${cleanHref}`;
    if (typeof href === "string") {
      finalHref = localizedPath;
    } else if (href && typeof href === "object") {
      finalHref = {
        ...href,
        pathname: localizedPath,
      };
    }
  }

  return <NextLink href={finalHref} {...props} />;
}
export default Link;
