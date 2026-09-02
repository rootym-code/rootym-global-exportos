/**
 * ============================================================
 * ROOTYM ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Configures Prisma CLI to use the ROOTYM project
 *          schema, migrations and the existing local environment
 *          configuration.
 *
 * The project uses .env.local rather than .env, so Prisma must
 * explicitly load .env.local when running CLI commands.
 * ============================================================
 */

import { config } from "dotenv";
import { defineConfig } from "prisma/config";

/**
 * ============================================================
 * Load the existing ROOTYM local environment configuration.
 * ============================================================
 *
 * Next.js automatically understands .env.local, but Prisma CLI
 * does not automatically load .env.local when prisma.config.ts
 * is present.
 * ============================================================
 */

config({
  path: ".env.local",
});

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
  },

  datasource: {
    url: process.env.DATABASE_URL!,
  },
});