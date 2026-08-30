/**
 * ============================================================
 * ROOTYM ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides hostname-based routing for the ROOTYM
 *          ExportOS marketing website and SaaS application.
 *
 *          Production domains:
 *
 *            export.rootym.com
 *              → ROOTYM AI Marketing Website
 *
 *            app.export.rootym.com
 *              → ROOTYM ExportOS SaaS
 *
 *          The legacy rootym.com website is deployed from a
 *          separate repository and is intentionally outside
 *          this application's routing architecture.
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

import {
  defaultLocale,
  isLocale,
} from "@/lib/i18n/config";

const MARKETING_HOST = "export.rootym.com";
const SAAS_HOST = "app.export.rootym.com";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hostname =
    request.nextUrl.hostname.toLowerCase();

  /*
   * ==========================================================
   * 1. STATIC ASSETS
   * ==========================================================
   *
   * Static resources must pass through without hostname or
   * locale processing.
   * ==========================================================
   */

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  /*
   * ==========================================================
   * 2. MARKETING DOMAIN
   * ==========================================================
   *
   * export.rootym.com
   *
   * The root route renders the ROOTYM AI marketing homepage
   * through app/page.tsx.
   *
   * Other public marketing routes are also allowed through
   * without locale processing.
   * ==========================================================
   */

  if (hostname === MARKETING_HOST) {
    return NextResponse.next();
  }

  /*
   * ==========================================================
   * 3. SAAS DOMAIN
   * ==========================================================
   *
   * app.export.rootym.com
   *
   * The root of the SaaS domain enters the authenticated
   * application workspace.
   *
   * Other SaaS routes such as:
   *
   *   /login
   *   /app
   *   /app/billing
   *   /api/*
   *
   * continue normally and are handled by their respective
   * application routes and authentication mechanisms.
   * ==========================================================
   */

  if (hostname === SAAS_HOST) {
    if (pathname === "/") {
      return NextResponse.rewrite(
        new URL("/app", request.url)
      );
    }

    return NextResponse.next();
  }

  /*
   * ==========================================================
   * 4. DEVELOPMENT / FALLBACK LOCALE
   * ==========================================================
   *
   * Local development and any non-production host retain the
   * existing locale detection behavior.
   * ==========================================================
   */

  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(`/${defaultLocale}`, request.url)
    );
  }

  const firstSegment = pathname.split("/")[1];

  const requestHeaders = new Headers(
    request.headers
  );

  if (isLocale(firstSegment)) {
    requestHeaders.set(
      "x-locale",
      firstSegment
    );
  } else {
    requestHeaders.set(
      "x-locale",
      defaultLocale
    );
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};