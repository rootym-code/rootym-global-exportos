/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * Organization    : ROOTYM Agro Harvest Pvt. Ltd.
 *
 * Feature         : CMS - Site Settings
 * Sprint          : CMS Settings Foundation
 *
 * Description
 * ------------------------------------------------------------
 * Central export for all Site Setting constants.
 * This file is the single entry point for importing all
 * Site Setting categories and keys across the application.
 * ============================================================
 */

export * from "./categories";

export {
  SITE_SETTING_KEY as COMPANY_SETTING_KEY,
  COMPANY_SETTING_KEYS,
  CONTACT_SETTING_KEYS,
  BUSINESS_SETTING_KEYS,
  SOCIAL_SETTING_KEYS,
  COMPANY_SETTINGS_KEYS,
} from "./company";

export {
  GOOGLE_SETTING_KEY,
  GOOGLE_SETTING_KEYS,
} from "./google";

export {
  WHATSAPP_SETTING_KEY,
  WHATSAPP_SETTING_KEYS,
} from "./whatsapp";

// Future modules
// export {
//   SEO_SETTING_KEY,
//   SEO_SETTING_KEYS,
// } from "./seo";

// export {
//   WEBSITE_SETTING_KEY,
//   WEBSITE_SETTING_KEYS,
// } from "./website";

// export {
//   BRANDING_SETTING_KEY,
//   BRANDING_SETTING_KEYS,
// } from "./branding";

// export {
//   EMAIL_SETTING_KEY,
//   EMAIL_SETTING_KEYS,
// } from "./email";

import { SITE_SETTING_KEY as COMPANY_SETTING_KEY } from "./company";
import { GOOGLE_SETTING_KEY } from "./google";
import { WHATSAPP_SETTING_KEY } from "./whatsapp";

/**
 * ============================================================
 * Unified Site Setting Keys
 * ------------------------------------------------------------
 * This object combines keys from all feature modules.
 * Consumers should import SITE_SETTING_KEY from this file
 * instead of importing individual module keys.
 * ============================================================
 */
export const SITE_SETTING_KEY = {
  ...COMPANY_SETTING_KEY,
  ...GOOGLE_SETTING_KEY,
  ...WHATSAPP_SETTING_KEY,

  // Future modules
  // ...SEO_SETTING_KEY,
  // ...WEBSITE_SETTING_KEY,
  // ...BRANDING_SETTING_KEY,
  // ...EMAIL_SETTING_KEY,
} as const;

/**
 * Unified Site Setting Key type.
 */
export type SiteSettingKey =
  (typeof SITE_SETTING_KEY)[keyof typeof SITE_SETTING_KEY];