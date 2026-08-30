/**
 * ============================================================
 * ROOTYM ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Configures Next.js image handling and server
 *          packages for the ROOTYM ExportOS application.
 * ============================================================
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
   * PDF generation uses @resvg/resvg-js,
   * which contains a platform-specific native binary.
   *
   * Keep these packages external to the Next.js/Turbopack
   * server bundle so Node.js can resolve the native module
   * at runtime.
   */
  serverExternalPackages: [
    "@resvg/resvg-js",
    "@resvg/resvg-js-win32-x64-msvc",
  ],
};

export default nextConfig;