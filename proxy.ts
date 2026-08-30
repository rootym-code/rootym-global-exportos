/**
 * ============================================================
 * ROOTYM ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides deterministic hostname-based separation
 *          between the ROOTYM marketing website and the
 *          ExportOS SaaS application.
 *
 * Production:
 *   export.rootym.com
 *     → /marketing
 *
 *   app.export.rootym.com
 *     → /saas
 *
 * Local development:
 *   export.localhost
 *     → /marketing
 *
 *   app.export.localhost
 *     → /saas
 *
 * Public SaaS login:
 *   /login
 *     → app/login/page.tsx
 *
 * The physical route structure intentionally uses explicit
 * "marketing" and "saas" directories to avoid ambiguity
 * between app/page.tsx and app/app/page.tsx.
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

const MARKETING_HOSTS = new Set([
  "export.rootym.com",
  "export.localhost",
]);

const SAAS_HOSTS = new Set([
  "app.export.rootym.com",
  "app.export.localhost",
]);

const PUBLIC_ADMIN_ROUTES = new Set([
  "/admin/login",
]);

function isStaticAsset(pathname: string) {
  return (
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname.includes(".")
  );
}

function protectAdminRoute(
  request: NextRequest,
  pathname: string
) {
  if (!pathname.startsWith("/admin")) {
    return null;
  }

  if (PUBLIC_ADMIN_ROUTES.has(pathname)) {
    return null;
  }

  const token = request.cookies.get(
    "rootym_admin_token"
  )?.value;

  if (token) {
    return null;
  }

  const loginUrl = new URL(
    "/admin/login",
    request.url
  );

  loginUrl.searchParams.set(
    "callbackUrl",
    pathname
  );

  return NextResponse.redirect(loginUrl);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hostHeader =
  request.headers.get("host") ?? "";

const hostname =
  hostHeader
    .split(":")[0]
    .toLowerCase();

  /*
   * ==========================================================
   * 1. STATIC ASSETS
   * ==========================================================
   *
   * Shared assets must pass through without hostname routing.
   * ==========================================================
   */

  if (isStaticAsset(pathname)) {
    return NextResponse.next();
  }

  /*
   * ==========================================================
   * 2. SAAS HOST
   * ==========================================================
   *
   * Public SaaS surface:
   *
   *   /        → /saas
   *   /login   → /login
   *
   * Physical routes:
   *
   *   app/saas/page.tsx
   *   app/login/page.tsx
   *
   * Admin routes remain on /admin.
   * API routes remain on /api.
   * ==========================================================
   */

  if (SAAS_HOSTS.has(hostname)) {
    if (pathname === "/") {
      return NextResponse.rewrite(
        new URL("/saas", request.url)
      );
    }

    const adminResponse = protectAdminRoute(
      request,
      pathname
    );

    if (adminResponse) {
      return adminResponse;
    }

    return NextResponse.next();
  }

  /*
   * ==========================================================
   * 3. MARKETING HOST
   * ==========================================================
   *
   * Public marketing surface:
   *
   *   / → /marketing
   *
   * Physical route:
   *
   *   app/marketing/page.tsx
   *
   * The legacy /en route redirects to the marketing root.
   * ==========================================================
   */

  if (MARKETING_HOSTS.has(hostname)) {
    if (
      pathname === "/en" ||
      pathname === "/en/"
    ) {
      return NextResponse.redirect(
        new URL("/", request.url)
      );
    }

    if (pathname === "/") {
      return NextResponse.rewrite(
        new URL("/marketing", request.url)
      );
    }

    return NextResponse.next();
  }

  /*
   * ==========================================================
   * 4. PLAIN LOCALHOST
   * ==========================================================
   *
   * Development convenience:
   *
   *   localhost:3000/
   *     → /marketing
   *
   * ==========================================================
   */

  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1"
  ) {
    if (
      pathname === "/en" ||
      pathname === "/en/"
    ) {
      return NextResponse.redirect(
        new URL("/", request.url)
      );
    }

    if (pathname === "/") {
      return NextResponse.rewrite(
        new URL("/marketing", request.url)
      );
    }

    return NextResponse.next();
  }

  /*
   * ==========================================================
   * 5. UNKNOWN HOST
   * ==========================================================
   *
   * No application-specific hostname routing.
   * ==========================================================
   */

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};