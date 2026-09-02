/**
 * ============================================================
 * ROOTYM ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Centralizes environment-specific ROOTYM SaaS URLs
 *          so marketing and shared components do not hard-code
 *          local or production SaaS hosts.
 *
 * Local:
 *   NEXT_PUBLIC_SAAS_APP_URL=http://app.export.localhost:3000
 *
 * Production:
 *   NEXT_PUBLIC_SAAS_APP_URL=https://app.export.rootym.com
 * ============================================================
 */

const configuredSaasAppUrl =
  process.env.NEXT_PUBLIC_SAAS_APP_URL?.trim();

if (!configuredSaasAppUrl) {
  throw new Error(
    "NEXT_PUBLIC_SAAS_APP_URL is not configured.",
  );
}

/**
 * Remove trailing slashes so route composition remains
 * deterministic.
 */
export const SAAS_APP_URL =
  configuredSaasAppUrl.replace(/\/+$/, "");

/**
 * Public SaaS routes.
 *
 * These are intentionally centralized so changing the SaaS
 * hostname only requires an environment-variable change.
 */
export const SAAS_LOGIN_URL =
  `${SAAS_APP_URL}/login`;

export const SAAS_SETTINGS_URL =
  `${SAAS_APP_URL}/settings`;

export const SAAS_BILLING_URL =
  `${SAAS_APP_URL}/app/billing`;

export const SAAS_WORKSPACE_URL =
  `${SAAS_APP_URL}/`;