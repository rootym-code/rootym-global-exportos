/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * Organization    : ROOTYM Agro Harvest Pvt. Ltd.
 *
 * Feature         : CMS - Site Settings
 * Sprint          : CMS 1 - Company Settings
 *
 * Description
 * ------------------------------------------------------------
 * Centralized definitions for Site Settings.
 * All setting keys and categories must be referenced from this
 * file to ensure consistency across the application.
 * ============================================================
 */

export const SITE_SETTING_CATEGORY = {
  COMPANY: "company",
  CONTACT: "contact",
  BUSINESS: "business",
  SOCIAL: "social",
  SEO: "seo",
  GOOGLE: "google",
} as const;

export const SITE_SETTING_KEY = {
  COMPANY_NAME: "company.company_name",
  LEGAL_NAME: "company.legal_name",
  TAGLINE: "company.tagline",
  DESCRIPTION: "company.description",
  LOGO: "company.logo",
  FAVICON: "company.favicon",

  ADDRESS: "contact.address",
  PHONE: "contact.phone",
  WHATSAPP: "contact.whatsapp",
  EMAIL: "contact.email",

  GST: "business.gst",
  IEC: "business.iec",
  APEDA: "business.apeda",

  FACEBOOK: "social.facebook",
  LINKEDIN: "social.linkedin",
  INSTAGRAM: "social.instagram",
  YOUTUBE: "social.youtube",
  TWITTER: "social.twitter",
} as const;

export const COMPANY_SETTING_KEYS = [
  SITE_SETTING_KEY.COMPANY_NAME,
  SITE_SETTING_KEY.LEGAL_NAME,
  SITE_SETTING_KEY.TAGLINE,
  SITE_SETTING_KEY.DESCRIPTION,
  SITE_SETTING_KEY.LOGO,
  SITE_SETTING_KEY.FAVICON,
] as const;

export const CONTACT_SETTING_KEYS = [
  SITE_SETTING_KEY.ADDRESS,
  SITE_SETTING_KEY.PHONE,
  SITE_SETTING_KEY.WHATSAPP,
  SITE_SETTING_KEY.EMAIL,
] as const;

export const BUSINESS_SETTING_KEYS = [
  SITE_SETTING_KEY.GST,
  SITE_SETTING_KEY.IEC,
  SITE_SETTING_KEY.APEDA,
] as const;

export const SOCIAL_SETTING_KEYS = [
  SITE_SETTING_KEY.FACEBOOK,
  SITE_SETTING_KEY.LINKEDIN,
  SITE_SETTING_KEY.INSTAGRAM,
  SITE_SETTING_KEY.YOUTUBE,
  SITE_SETTING_KEY.TWITTER,
] as const;

export const COMPANY_SETTINGS_KEYS = [
  ...COMPANY_SETTING_KEYS,
  ...CONTACT_SETTING_KEYS,
  ...BUSINESS_SETTING_KEYS,
  ...SOCIAL_SETTING_KEYS,
] as const;

export type SiteSettingCategory =
  (typeof SITE_SETTING_CATEGORY)[keyof typeof SITE_SETTING_CATEGORY];

export type SiteSettingKey =
  (typeof SITE_SETTING_KEY)[keyof typeof SITE_SETTING_KEY];