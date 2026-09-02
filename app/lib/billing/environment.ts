/**
 * ============================================================
 * ROOTYM ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Resolves the active billing environment used by
 *          provider configuration and billing operations.
 * ============================================================
 */

import type { BillingEnvironment } from "@/lib/generated/prisma";

/**
 * Resolve the billing environment from the application runtime.
 *
 * Mapping:
 *   development → DEVELOPMENT
 *   test        → DEVELOPMENT
 *   staging     → STAGING
 *   production  → PRODUCTION
 *
 * BILLING_ENVIRONMENT can be explicitly supplied when the
 * deployment environment needs to be independent of NODE_ENV.
 */
export function getBillingEnvironment(): BillingEnvironment {
  const configuredEnvironment =
    process.env.BILLING_ENVIRONMENT?.trim().toUpperCase();

  if (configuredEnvironment === "DEVELOPMENT") {
    return "DEVELOPMENT";
  }

  if (configuredEnvironment === "STAGING") {
    return "STAGING";
  }

  if (configuredEnvironment === "PRODUCTION") {
    return "PRODUCTION";
  }

  if (process.env.NODE_ENV === "production") {
    return "PRODUCTION";
  }

  return "DEVELOPMENT";
}