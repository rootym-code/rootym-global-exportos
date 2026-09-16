/**
 * ============================================================
 * ROOTYM ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides deterministic hostname-based separation,
 *          cryptographic admin JWT route protection, and
 *          application routing including verified customer
 *          Website custom-domain routing.
 *
 * Production:
 *   export.rootym.com
 *     → /marketing
 *
 *   app.export.rootym.com
 *     → /saas
 *
 *   Customer custom domains:
 *   verified primary domain
 *     → /website/{websiteSlug}/en
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

import {
  WebsiteDomainDeploymentStatus,
  WebsiteDomainVerificationStatus,
} from "@/lib/generated/prisma";

import prisma from "@/lib/prisma";

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
     * ========================================================
     * Proxy-level protection intentionally performs
     * cryptographic JWT verification only.
     *
     * Database-level admin validation, including
     * existence, active status and current role,
     * remains the responsibility of authenticateAdmin().
     * ========================================================
     */

    await verifyAdminToken(token);

    return null;
  } catch {
    /**
     * ========================================================
     * Invalid or expired admin tokens must not be
     * allowed to reach protected Admin pages.
     * ========================================================
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

/**
 * ============================================================
 * CUSTOMER WEBSITE CUSTOM-DOMAIN ROUTING
 * ============================================================
 *
 * A custom domain is considered routable only when:
 *
 *   1. WebsiteDomain exists for the incoming hostname
 *   2. DNS verification has completed successfully
 *   3. The domain has been published and is LIVE
 *
 * The Website is resolved through the WebsiteDomain relation.
 * No tenantId, websiteId or slug is accepted from the request.
 *
 * The existing public Website pages remain responsible for:
 *
 *   - Website active status
 *   - subscription access
 *   - CMS homepage resolution
 *   - locale fallback
 *   - Website rendering
 *
 * The browser URL remains the customer's custom domain because
 * this operation uses an internal rewrite rather than redirect.
 * ============================================================
 */

async function resolveCustomDomainWebsite(
  hostname: string
) {
  const domain = await prisma.websiteDomain.findFirst({
    where: {
      domain: hostname,
      verificationStatus:
        WebsiteDomainVerificationStatus.VERIFIED,
      deploymentStatus:
        WebsiteDomainDeploymentStatus.LIVE,
    },
    select: {
      website: {
        select: {
          slug: true,
        },
      },
    },
  });

  return domain?.website ?? null;
}

/**
 * ============================================================
 * CUSTOMER WEBSITE PATH RESOLUTION
 * ============================================================
 *
 * The incoming custom-domain pathname is preserved after the
 * internal Website prefix.
 *
 * Examples:
 *
 *   /
 *     → /website/{websiteSlug}/en
 *
 *   /en
 *     → /website/{websiteSlug}/en
 *
 *   /en/products
 *     → /website/{websiteSlug}/en/products
 *
 *   /en/products/example
 *     → /website/{websiteSlug}/en/products/example
 *
 *   /en/contact
 *     → /website/{websiteSlug}/en/contact
 *
 *   /en/request-quote
 *     → /website/{websiteSlug}/en/request-quote
 *
 *   /en/about
 *     → /website/{websiteSlug}/en/about
 *
 * The final route determines whether the path is a product,
 * CMS page, contact page, quote page, or another existing
 * Website route. No individual CMS slug is hard-coded here.
 * ============================================================
 */

function getCustomDomainWebsitePath(
  websiteSlug: string,
  pathname: string
) {
  if (pathname === "/" || pathname === "") {
    return `/website/${encodeURIComponent(
      websiteSlug
    )}/en`;
  }

  return `/website/${encodeURIComponent(
    websiteSlug
  )}${pathname}`;
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
   * 5. CUSTOMER WEBSITE CUSTOM DOMAIN
   * ==========================================================
   *
   * Unknown hosts are checked against the verified primary
   * WebsiteDomain records.
   *
   * Example:
   *
   *   https://rootym.in/
   *
   * resolves to:
   *
   *   WebsiteDomain(rootym.in)
   *        ↓
   *   Website
   *        ↓
   *   Website.slug
   *        ↓
   *   /website/{websiteSlug}/en
   *
   * For non-root paths, the public pathname is preserved:
   *
   *   /en/products
   *        ↓
   *   /website/{websiteSlug}/en/products
   *
   * This is an internal rewrite. The browser continues to
   * display the customer's custom domain.
   * ==========================================================
   */

  try {
    const website =
      await resolveCustomDomainWebsite(hostname);

    if (website?.slug) {
      return NextResponse.rewrite(
        new URL(
          getCustomDomainWebsitePath(
            website.slug,
            pathname
          ),
          request.url
        )
      );
    }
  } catch (error) {
    /**
     * ========================================================
     * A custom-domain lookup failure must not break
     * ROOTYM's standard marketing or SaaS hosts.
     *
     * Unknown hosts continue through the normal Next.js
     * routing path.
     * ========================================================
     */

    console.error(
      "[Custom Domain Routing]",
      error
    );
  }

  /**
   * ==========================================================
   * 6. UNKNOWN HOST
   * ==========================================================
   *
   * No verified customer Website was resolved.
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