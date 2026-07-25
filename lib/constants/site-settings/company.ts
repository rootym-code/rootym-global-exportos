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
 * Company, Contact, Business and Social setting definitions.
 * ============================================================
 */

export const SITE_SETTING_KEY = {
    // Company
    COMPANY_NAME: "company.company_name",
    LEGAL_NAME: "company.legal_name",
    TAGLINE: "company.tagline",
    LOGO: "company.logo",
    FAVICON: "company.favicon",
  
    // Contact
    ADDRESS: "contact.address",
    PHONE: "contact.phone",
    WHATSAPP: "contact.whatsapp",
    EMAIL: "contact.email",
  
    // Business
    GST: "business.gst",
    IEC: "business.iec",
    APEDA: "business.apeda",
  
    // Social
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
  
  export type SiteSettingKey =
    (typeof SITE_SETTING_KEY)[keyof typeof SITE_SETTING_KEY];