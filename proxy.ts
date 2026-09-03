/**
 * ============================================================
 * ROOTYM ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides deterministic hostname-based separation,
 *          cryptographic admin JWT route protection, and
 *          application routing.
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
 * Public SaaS routes:
 *   /login
 *     → app/login/page.tsx
 *
 *   /
 *     → /saas
 *
 *   /settings
 *     → /saas/settings
 *
 * The physical route structure intentionally uses explicit
 * "marketing" and "saas" directories to avoid ambiguity
 * between marketing pages, SaaS pages and administrative
 * functionality.
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

import { verifyAdminToken } from "@/lib/jwt";

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

async function protectAdminRoute(
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

  if (!token) {
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

  try {
    /**
     * Proxy-level protection intentionally performs
     * cryptographic JWT verification only.
     *
     * Database-level admin validation, including
     * existence, active status and current role,
     * remains the responsibility of authenticateAdmin().
     */
    await verifyAdminToken(token);

    return null;
  } catch {
    /**
     * Invalid or expired admin tokens must not be
     * allowed to reach protected Admin pages.
     */
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
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hostHeader =
    request.headers.get("host") ?? "";

  const hostname = hostHeader
    .split(":")[0]
    .toLowerCase();

  /**
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

  /**
   * ==========================================================
   * 2. SAAS HOST
   * ==========================================================
   *
   * Public SaaS surface:
   *
   *   /          → /saas
   *   /login     → /login
   *   /settings  → /saas/settings
   *
   * Physical routes:
   *
   *   app/saas/page.tsx
   *   app/login/page.tsx
   *   app/saas/settings/page.tsx
   *
   * Admin routes remain on /admin.
   * API routes remain on /api.
   * ==========================================================
   */

  if (SAAS_HOSTS.has(hostname)) {
    /**
     * SaaS Control Page
     *
     * Public:
     *   /
     *
     * Internal:
     *   /saas
     */

    if (pathname === "/") {
      return NextResponse.rewrite(
        new URL("/saas", request.url)
      );
    }

    /**
     * SaaS Control Center
     *
     * Public:
     *   /app
     *
     * Internal:
     *   /saas
     *
     * The explicit rewrite prevents the marketing
     * [locale] route from interpreting "app" as a
     * marketing locale.
     */

    if (pathname === "/app") {
      return NextResponse.rewrite(
        new URL("/saas", request.url)
      );
    }

    /**
     * Customer Settings
     *
     * Public:
     *   /settings
     *
     * Internal:
     *   /saas/settings
     *
     * This keeps the customer-facing URL clean while
     * preserving the explicit SaaS physical directory.
     */

    if (pathname === "/settings") {
      return NextResponse.rewrite(
        new URL("/saas/settings", request.url)
      );
    }

    /**
     * Admin protection remains independent from
     * customer authentication.
     *
     * The proxy validates only the cryptographic
     * integrity and expiry of the admin JWT.
     *
     * Full database authorization is handled by
     * authenticateAdmin() inside protected APIs.
     */

    const adminResponse = await protectAdminRoute(
      request,
      pathname
    );

    if (adminResponse) {
      return adminResponse;
    }

    return NextResponse.next();
  }

  /**
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

  /**
   * ==========================================================
   * 4. PLAIN LOCALHOST
   * ==========================================================
   *
   * Development convenience:
   *
   *   localhost:3000/*
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

  /**
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