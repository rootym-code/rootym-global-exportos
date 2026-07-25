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
 * Central definition of all Site Setting categories.
 * Every settings module must reference categories from here.
 * ============================================================
 */

export const SITE_SETTING_CATEGORY = {
    COMPANY: "company",
    CONTACT: "contact",
    BUSINESS: "business",
    SOCIAL: "social",
  
    GOOGLE: "google",
    META: "meta",
    WHATSAPP: "whatsapp",
    EMAIL: "email",
  
    PAYMENT: "payment",
    SHIPPING: "shipping",
  
    SEO: "seo",
    AI: "ai",
  
    SECURITY: "security",
    SYSTEM: "system",
  } as const;
  
  export type SiteSettingCategory =
    (typeof SITE_SETTING_CATEGORY)[keyof typeof SITE_SETTING_CATEGORY];