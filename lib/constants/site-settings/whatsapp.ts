/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * Organization    : ROOTYM Agro Harvest Pvt. Ltd.
 *
 * Feature         : CMS - WhatsApp Settings
 * Sprint          : CMS Settings Foundation
 *
 * Description
 * ------------------------------------------------------------
 * WhatsApp integration setting definitions.
 * ============================================================
 */

export const WHATSAPP_SETTING_KEY = {
  META_APP_ID: "whatsapp.meta_app_id",
  META_APP_SECRET: "whatsapp.meta_app_secret",
  BUSINESS_ACCOUNT_ID: "whatsapp.business_account_id",
  PHONE_NUMBER_ID: "whatsapp.phone_number_id",
  ACCESS_TOKEN: "whatsapp.access_token",
  VERIFY_TOKEN: "whatsapp.verify_token",
} as const;

export const WHATSAPP_SETTING_KEYS = [
  WHATSAPP_SETTING_KEY.META_APP_ID,
  WHATSAPP_SETTING_KEY.META_APP_SECRET,
  WHATSAPP_SETTING_KEY.BUSINESS_ACCOUNT_ID,
  WHATSAPP_SETTING_KEY.PHONE_NUMBER_ID,
  WHATSAPP_SETTING_KEY.ACCESS_TOKEN,
  WHATSAPP_SETTING_KEY.VERIFY_TOKEN,
] as const;

export type WhatsAppSettingKey =
  (typeof WHATSAPP_SETTING_KEY)[keyof typeof WHATSAPP_SETTING_KEY];