/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * Organization    : ROOTYM Agro Harvest Pvt. Ltd.
 *
 * Feature         : CMS - Google Settings
 * Sprint          : CMS Settings Foundation
 *
 * Description
 * ------------------------------------------------------------
 * Google integration setting definitions.
 * ============================================================
 */

export const GOOGLE_SETTING_KEY = {
    GA4_MEASUREMENT_ID: "google.ga4_measurement_id",
    GTM_CONTAINER_ID: "google.gtm_container_id",
    SEARCH_CONSOLE_VERIFICATION:
      "google.search_console_verification",
    BUSINESS_PROFILE_URL:
      "google.business_profile_url",
    RECAPTCHA_SITE_KEY:
      "google.recaptcha_site_key",
    RECAPTCHA_SECRET_KEY:
      "google.recaptcha_secret_key",
  } as const;
  
  export const GOOGLE_SETTING_KEYS = [
    GOOGLE_SETTING_KEY.GA4_MEASUREMENT_ID,
    GOOGLE_SETTING_KEY.GTM_CONTAINER_ID,
    GOOGLE_SETTING_KEY.SEARCH_CONSOLE_VERIFICATION,
    GOOGLE_SETTING_KEY.BUSINESS_PROFILE_URL,
    GOOGLE_SETTING_KEY.RECAPTCHA_SITE_KEY,
    GOOGLE_SETTING_KEY.RECAPTCHA_SECRET_KEY,
  ] as const;
  
  export type GoogleSettingKey =
    (typeof GOOGLE_SETTING_KEY)[keyof typeof GOOGLE_SETTING_KEY];