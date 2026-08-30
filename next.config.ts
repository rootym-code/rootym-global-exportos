/**
 * ============================================================
 * ROOTYM ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Configures Next.js image handling, development
 *          origins, and server packages for the ROOTYM
 *          ExportOS application.
 * ============================================================
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * ==========================================================
   * Development Hostnames
   * ==========================================================
   *
   * ExportOS uses separate local hostnames to mirror the
   * production architecture:
   *
   *   export.localhost
   *       → Marketing Website
   *
   *   app.export.localhost
   *       → ExportOS SaaS
   *
   * Next.js development resources such as HMR must explicitly
   * allow these origins.
   * ==========================================================
   */

  allowedDevOrigins: [
    "export.localhost",
    "app.export.localhost",
  ],

  /**
   * ==========================================================
   * Image Configuration
   * ==========================================================
   */

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "media.rootym.com",
      },
    ],
  },

  /**
   * ==========================================================
   * Server External Packages
   * ==========================================================
   *
   * PDF generation uses @resvg/resvg-js, which contains a
   * platform-specific native binary.
   *
   * Keep these packages external to the Next.js/Turbopack
   * server bundle so Node.js can resolve the native module
   * at runtime.
   * ==========================================================
   */

  serverExternalPackages: [
    "@resvg/resvg-js",
    "@resvg/resvg-js-win32-x64-msvc",
  ],
};

export default nextConfig;