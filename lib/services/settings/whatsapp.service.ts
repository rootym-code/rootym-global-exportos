/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * Organization    : ROOTYM Agro Harvest Pvt. Ltd.
 *
 * Module          : CMS Settings
 * Feature         : WhatsApp Settings Service
 *
 * Description
 * ------------------------------------------------------------
 * Handles loading and saving WhatsApp configuration
 * from Site Settings.
 * ============================================================
 */

import {
    WHATSAPP_SETTING_KEY,
    WHATSAPP_SETTING_KEYS,
  } from "@/lib/constants/site-settings/whatsapp";
  
  import { SettingsService } from "./settings.service";
  
  export interface WhatsAppSettings {
    metaAppId: string;
    metaAppSecret: string;
    businessAccountId: string;
    phoneNumberId: string;
    accessToken: string;
    verifyToken: string;
  }
  
  export class WhatsAppSettingsService {
    /**
     * Load WhatsApp settings.
     */
    static async getSettings(): Promise<WhatsAppSettings> {
      const values = await SettingsService.getValues([
        ...WHATSAPP_SETTING_KEYS,
      ]);
  
      return {
        metaAppId:
          values[WHATSAPP_SETTING_KEY.META_APP_ID] ?? "",
  
        metaAppSecret:
          values[WHATSAPP_SETTING_KEY.META_APP_SECRET] ?? "",
  
        businessAccountId:
          values[WHATSAPP_SETTING_KEY.BUSINESS_ACCOUNT_ID] ?? "",
  
        phoneNumberId:
          values[WHATSAPP_SETTING_KEY.PHONE_NUMBER_ID] ?? "",
  
        accessToken:
          values[WHATSAPP_SETTING_KEY.ACCESS_TOKEN] ?? "",
  
        verifyToken:
          values[WHATSAPP_SETTING_KEY.VERIFY_TOKEN] ?? "",
      };
    }
  
    /**
     * Save WhatsApp settings.
     */
    static async saveSettings(
      settings: WhatsAppSettings
    ): Promise<void> {
      await SettingsService.saveValues([
        {
          key: WHATSAPP_SETTING_KEY.META_APP_ID,
          value: settings.metaAppId,
        },
        {
          key: WHATSAPP_SETTING_KEY.META_APP_SECRET,
          value: settings.metaAppSecret,
        },
        {
          key: WHATSAPP_SETTING_KEY.BUSINESS_ACCOUNT_ID,
          value: settings.businessAccountId,
        },
        {
          key: WHATSAPP_SETTING_KEY.PHONE_NUMBER_ID,
          value: settings.phoneNumberId,
        },
        {
          key: WHATSAPP_SETTING_KEY.ACCESS_TOKEN,
          value: settings.accessToken,
        },
        {
          key: WHATSAPP_SETTING_KEY.VERIFY_TOKEN,
          value: settings.verifyToken,
        },
      ]);
    }
  }