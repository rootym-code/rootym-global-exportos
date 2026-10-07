/**

 &#xA0;* ============================================================

 &#xA0;* ROOTYM ExportOS

 &#xA0;* ============================================================

 &#xA0;* Author: Prem Singh

 &#xA0;* Purpose: Provides deterministic hostname-based separation,

 &#xA0;*          cryptographic admin JWT route protection, and

 &#xA0;*          application routing including verified customer

 &#xA0;*          Website custom-domain routing.

 &#xA0;*

 &#xA0;* Production:

 &#xA0;*   export.rootym.com

 &#xA0;*     → /marketing

 &#xA0;*

 &#xA0;*   app.export.rootym.com

 &#xA0;*     → /saas

 &#xA0;*

 &#xA0;*   Customer custom domains:

 &#xA0;*   verified primary domain

 &#xA0;*     → /website/{websiteSlug}/en

 &#xA0;*

 &#xA0;* Local development:

 &#xA0;*   export.localhost

 &#xA0;*     → /marketing

 &#xA0;*

 &#xA0;*   app.export.localhost

 &#xA0;*     → /saas

 &#xA0;*

 &#xA0;* Public SaaS routes:

 &#xA0;*   /login

 &#xA0;*     → app/login/page.tsx

 &#xA0;*

 &#xA0;*   /

 &#xA0;*     → /saas

 &#xA0;*

 &#xA0;*   /settings

 &#xA0;*     → /saas/settings

 &#xA0;*

 &#xA0;* The physical route structure intentionally uses explicit

 &#xA0;* "marketing" and "saas" directories to avoid ambiguity

 &#xA0;* between marketing pages, SaaS pages and administrative

 &#xA0;* functionality.

 &#xA0;* ============================================================

 &#xA0;*/



 import { NextRequest, NextResponse } from "next/server";



 import { isLocale } from "@/lib/i18n/config";
 
 
 
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
 
  &#xA0;    * ========================================================
 
  &#xA0;    * Proxy-level protection intentionally performs
 
  &#xA0;    * cryptographic JWT verification only.
 
  &#xA0;    *
 
  &#xA0;    * Database-level admin validation, including
 
  &#xA0;    * existence, active status and current role,
 
  &#xA0;    * remains the responsibility of authenticateAdmin().
 
  &#xA0;    * ========================================================
 
  &#xA0;    */
 
 
 
     await verifyAdminToken(token);
 
 
 
     return null;
 
   } catch {
 
     /**
 
  &#xA0;    * ========================================================
 
  &#xA0;    * Invalid or expired admin tokens must not be
 
  &#xA0;    * allowed to reach protected Admin pages.
 
  &#xA0;    * ========================================================
 
  &#xA0;    */
 
 
 
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
 
  &#xA0;* ============================================================
 
  &#xA0;* CUSTOMER WEBSITE CUSTOM-DOMAIN ROUTING
 
  &#xA0;* ============================================================
 
  &#xA0;*
 
  &#xA0;* A custom domain is considered routable only when:
 
  &#xA0;*
 
  &#xA0;*   1. WebsiteDomain exists for the incoming hostname
 
  &#xA0;*   2. DNS verification has completed successfully
 
  &#xA0;*   3. The domain has been published and is LIVE
 
  &#xA0;*
 
  &#xA0;* The Website is resolved through the WebsiteDomain relation.
 
  &#xA0;* No tenantId, websiteId or slug is accepted from the request.
 
  &#xA0;*
 
  &#xA0;* The existing public Website pages remain responsible for:
 
  &#xA0;*
 
  &#xA0;*   - Website active status
 
  &#xA0;*   - subscription access
 
  &#xA0;*   - CMS homepage resolution
 
  &#xA0;*   - locale fallback
 
  &#xA0;*   - Website rendering
 
  &#xA0;*
 
  &#xA0;* The browser URL remains the customer's custom domain because
 
  &#xA0;* this operation uses an internal rewrite rather than redirect.
 
  &#xA0;* ============================================================
 
  &#xA0;*/
 
 
 
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
 
  &#xA0;* ============================================================
 
  &#xA0;* CUSTOMER WEBSITE PATH RESOLUTION
 
  &#xA0;* ============================================================
 
  &#xA0;*
 
  &#xA0;* The incoming custom-domain pathname is preserved after the
 
  &#xA0;* internal Website prefix.
 
  &#xA0;*
 
  &#xA0;* Examples:
 
  &#xA0;*
 
  &#xA0;*   /
 
  &#xA0;*     → /website/{websiteSlug}/en
 
  &#xA0;*
 
  &#xA0;*   /en
 
  &#xA0;*     → /website/{websiteSlug}/en
 
  &#xA0;*
 
  &#xA0;*   /en/products
 
  &#xA0;*     → /website/{websiteSlug}/en/products
 
  &#xA0;*
 
  &#xA0;*   /en/products/example
 
  &#xA0;*     → /website/{websiteSlug}/en/products/example
 
  &#xA0;*
 
  &#xA0;*   /en/contact
 
  &#xA0;*     → /website/{websiteSlug}/en/contact
 
  &#xA0;*
 
  &#xA0;*   /en/request-quote
 
  &#xA0;*     → /website/{websiteSlug}/en/request-quote
 
  &#xA0;*
 
  &#xA0;*   /en/about
 
  &#xA0;*     → /website/{websiteSlug}/en/about
 
  &#xA0;*
 
  &#xA0;* The final route determines whether the path is a product,
 
  &#xA0;* CMS page, contact page, quote page, or another existing
 
  &#xA0;* Website route. No individual CMS slug is hard-coded here.
 
  &#xA0;* ============================================================
 
  &#xA0;*/
 
 
 
 function getCustomDomainWebsitePath(
 
   websiteSlug: string,
 
   pathname: string
 
 ) {
 
   if (pathname === "/" || pathname === "") {
 
     return `/website/${encodeURIComponent(
 
       websiteSlug
 
     )}/en`;
 
   }
 
 
 
   /**
 
  &#xA0;  * ----------------------------------------------------------
 
  &#xA0;  * Clean custom-domain paths
 
  &#xA0;  * ----------------------------------------------------------
 
  &#xA0;  *
 
  &#xA0;  * Customer Websites are exposed on clean URLs:
 
  &#xA0;  *
 
  &#xA0;  *   /products
 
  &#xA0;  *   /contact
 
  &#xA0;  *   /request-quote
 
  &#xA0;  *
 
  &#xA0;  * The internal Website route always requires a locale:
 
  &#xA0;  *
 
  &#xA0;  *   /website/{websiteSlug}/en/products
 
  &#xA0;  *   /website/{websiteSlug}/en/contact
 
  &#xA0;  *   /website/{websiteSlug}/en/request-quote
 
  &#xA0;  *
 
  &#xA0;  * If a supported locale is explicitly present in the public
 
  &#xA0;  * URL, preserve it:
 
  &#xA0;  *
 
  &#xA0;  *   /ar/products
 
  &#xA0;  *   /si/contact
 
  &#xA0;  * ----------------------------------------------------------
 
  &#xA0;  */
 
 
 
   const segments = pathname
 
     .split("/")
 
     .filter(Boolean);
 
 
 
   const firstSegment = segments[0];
 
 
 
   if (firstSegment && isLocale(firstSegment)) {
 
     return `/website/${encodeURIComponent(
 
       websiteSlug
 
     )}${pathname}`;
 
   }
 
 
 
   return `/website/${encodeURIComponent(
 
     websiteSlug
 
   )}/en${pathname}`;
 
 }
 
 
 
 export async function proxy(request: NextRequest) {
 
   const { pathname } = request.nextUrl;
 
   // API routes must bypass hostname-based page routing.
   // This keeps /api/* working consistently across rootym.in, rootym.com,
   // and verified customer domains.
   if (pathname.startsWith("/api/")) {
     return NextResponse.next();
   }
 
 
 
   const hostHeader =
 
     request.headers.get("host") ?? "";
 
 
 
   const hostname = hostHeader
 
     .split(":")[0]
 
     .toLowerCase();
 
 
 
   /**
 
  &#xA0;  * ==========================================================
 
  &#xA0;  * 1. STATIC ASSETS
 
  &#xA0;  * ==========================================================
 
  &#xA0;  *
 
  &#xA0;  * Shared assets must pass through without hostname routing.
 
  &#xA0;  * ==========================================================
 
  &#xA0;  */
 
 
 
   if (isStaticAsset(pathname)) {
 
     return NextResponse.next();
 
   }
 
 
 
   /**
 
  &#xA0;  * ==========================================================
 
  &#xA0;  * 2. SAAS HOST
 
  &#xA0;  * ==========================================================
 
  &#xA0;  *
 
  &#xA0;  * Public SaaS surface:
 
  &#xA0;  *
 
  &#xA0;  *   /          → /saas
 
  &#xA0;  *   /login     → /login
 
  &#xA0;  *   /settings  → /saas/settings
 
  &#xA0;  *
 
  &#xA0;  * Physical routes:
 
  &#xA0;  *
 
  &#xA0;  *   app/saas/page.tsx
 
  &#xA0;  *   app/login/page.tsx
 
  &#xA0;  *   app/saas/settings/page.tsx
 
  &#xA0;  *
 
  &#xA0;  * Admin routes remain on /admin.
 
  &#xA0;  * API routes remain on /api.
 
  &#xA0;  * ==========================================================
 
  &#xA0;  */
 
 
 
   if (SAAS_HOSTS.has(hostname)) {
 
     /**
 
  &#xA0;    * SaaS Control Page
 
  &#xA0;    *
 
  &#xA0;    * Public:
 
  &#xA0;    *   /
 
  &#xA0;    *
 
  &#xA0;    * Internal:
 
  &#xA0;    *   /saas
 
  &#xA0;    */
 
 
 
     if (pathname === "/") {
 
       return NextResponse.rewrite(
 
         new URL("/saas", request.url)
 
       );
 
     }
 
 
 
     /**
 
  &#xA0;    * SaaS Control Center
 
  &#xA0;    *
 
  &#xA0;    * Public:
 
  &#xA0;    *   /app
 
  &#xA0;    *
 
  &#xA0;    * Internal:
 
  &#xA0;    *   /saas
 
  &#xA0;    *
 
  &#xA0;    * The explicit rewrite prevents the marketing
 
  &#xA0;    * [locale] route from interpreting "app" as a
 
  &#xA0;    * marketing locale.
 
  &#xA0;    */
 
 
 
     if (pathname === "/app") {
 
       return NextResponse.rewrite(
 
         new URL("/saas", request.url)
 
       );
 
     }
 
 
 
     /**
 
  &#xA0;    * Customer Settings
 
  &#xA0;    *
 
  &#xA0;    * Public:
 
  &#xA0;    *   /settings
 
  &#xA0;    *
 
  &#xA0;    * Internal:
 
  &#xA0;    *   /saas/settings
 
  &#xA0;    *
 
  &#xA0;    * This keeps the customer-facing URL clean while
 
  &#xA0;    * preserving the explicit SaaS physical directory.
 
  &#xA0;    */
 
 
 
     if (pathname === "/settings") {
 
       return NextResponse.rewrite(
 
         new URL("/saas/settings", request.url)
 
       );
 
     }
 
 
 
     /**
 
  &#xA0;    * Admin protection remains independent from
 
  &#xA0;    * customer authentication.
 
  &#xA0;    *
 
  &#xA0;    * The proxy validates only the cryptographic
 
  &#xA0;    * integrity and expiry of the admin JWT.
 
  &#xA0;    *
 
  &#xA0;    * Full database authorization is handled by
 
  &#xA0;    * authenticateAdmin() inside protected APIs.
 
  &#xA0;    */
 
 
 
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
 
  &#xA0;  * ==========================================================
 
  &#xA0;  * 3. MARKETING HOST
 
  &#xA0;  * ==========================================================
 
  &#xA0;  *
 
  &#xA0;  * Public marketing surface:
 
  &#xA0;  *
 
  &#xA0;  *   / → /marketing
 
  &#xA0;  *
 
  &#xA0;  * Physical route:
 
  &#xA0;  *
 
  &#xA0;  *   app/marketing/page.tsx
 
  &#xA0;  *
 
  &#xA0;  * The legacy /en route redirects to the marketing root.
 
  &#xA0;  * ==========================================================
 
  &#xA0;  */
 
 
 
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
 
  &#xA0;  * ==========================================================
 
  &#xA0;  * 4. PLAIN LOCALHOST
 
  &#xA0;  * ==========================================================
 
  &#xA0;  *
 
  &#xA0;  * Development convenience:
 
  &#xA0;  *
 
  &#xA0;  *   localhost:3000/*
 
  &#xA0;  *     → /marketing
 
  &#xA0;  *
 
  &#xA0;  * ==========================================================
 
  &#xA0;  */
 
 
 
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
 
  &#xA0;  * ==========================================================
 
  &#xA0;  * 5. CUSTOMER WEBSITE CUSTOM DOMAIN
 
  &#xA0;  * ==========================================================
 
  &#xA0;  *
 
  &#xA0;  * Unknown hosts are checked against the verified primary
 
  &#xA0;  * WebsiteDomain records.
 
  &#xA0;  *
 
  &#xA0;  * Example:
 
  &#xA0;  *
 
  &#xA0;  *   https\://rootym.in/
 
  &#xA0;  *
 
  &#xA0;  * resolves to:
 
  &#xA0;  *
 
  &#xA0;  *   WebsiteDomain(rootym.in)
 
  &#xA0;  *        ↓
 
  &#xA0;  *   Website
 
  &#xA0;  *        ↓
 
  &#xA0;  *   Website.slug
 
  &#xA0;  *        ↓
 
  &#xA0;  *   /website/{websiteSlug}/en
 
  &#xA0;  *
 
  &#xA0;  * For non-root paths, the public pathname is preserved:
 
  &#xA0;  *
 
  &#xA0;  *   /en/products
 
  &#xA0;  *        ↓
 
  &#xA0;  *   /website/{websiteSlug}/en/products
 
  &#xA0;  *
 
  &#xA0;  * This is an internal rewrite. The browser continues to
 
  &#xA0;  * display the customer's custom domain.
 
  &#xA0;  * ==========================================================
 
  &#xA0;  */
 
 
 
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
 
  &#xA0;    * ========================================================
 
  &#xA0;    * A custom-domain lookup failure must not break
 
  &#xA0;    * ROOTYM's standard marketing or SaaS hosts.
 
  &#xA0;    *
 
  &#xA0;    * Unknown hosts continue through the normal Next.js
 
  &#xA0;    * routing path.
 
  &#xA0;    * ========================================================
 
  &#xA0;    */
 
 
 
     console.error(
 
       "[Custom Domain Routing]",
 
       error
 
     );
 
   }
 
 
 
   /**
 
  &#xA0;  * ==========================================================
 
  &#xA0;  * 6. UNKNOWN HOST
 
  &#xA0;  * ==========================================================
 
  &#xA0;  *
 
  &#xA0;  * No verified customer Website was resolved.
 
  &#xA0;  * ==========================================================
 
  &#xA0;  */
 
 
 
   return NextResponse.next();
 
 }
 
 
 
 export const config = {
 
   matcher: [
 
     "/",
 
     "/((?!_next/static|_next/image|favicon.ico).*)",
 
   ],
 
 };
 