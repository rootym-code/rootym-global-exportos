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
 * Handles WhatsApp Business settings.
 * ============================================================
 */

import {
    WHATSAPP_SETTING_KEY,
    WHATSAPP_SETTING_KEYS,
  } from "@/lib/constants/site-settings/whatsapp";
  
  import {
    getSettingsByKeys,
    saveSettings,
  } from "./helpers";
  
  import {
    SiteSettingUpsertInput,
    WhatsAppSettingsInput,
  } from "./types";
  
  class WhatsAppSettingsService {
    async getWhatsAppSettings() {


      const map = await getSettingsByKeys(
        WHATSAPP_SETTING_KEYS
      );
     
  
      return {
        metaAppId:
          map.get(
            WHATSAPP_SETTING_KEY.META_APP_ID
          ) ?? "",
  
        metaAppSecret:
          map.get(
            WHATSAPP_SETTING_KEY.META_APP_SECRET
          ) ?? "",
  
        businessAccountId:
          map.get(
            WHATSAPP_SETTING_KEY.BUSINESS_ACCOUNT_ID
          ) ?? "",
  
        phoneNumberId:
          map.get(
            WHATSAPP_SETTING_KEY.PHONE_NUMBER_ID
          ) ?? "",
  
        accessToken:
          map.get(
            WHATSAPP_SETTING_KEY.ACCESS_TOKEN
          ) ?? "",
  
        verifyToken:
          map.get(
            WHATSAPP_SETTING_KEY.VERIFY_TOKEN
          ) ?? "",
      };
    }
  
    async saveWhatsAppSettings(
      data: WhatsAppSettingsInput
    ) {
      const settings: SiteSettingUpsertInput[] = [
        {
          key: WHATSAPP_SETTING_KEY.META_APP_ID,
          value: data.metaAppId,
          category: "whatsapp",
          description: "Meta App ID",
          valueType: "text",
          isPublic: false,
        },
        {
          key: WHATSAPP_SETTING_KEY.META_APP_SECRET,
          value: data.metaAppSecret,
          category: "whatsapp",
          description: "Meta App Secret",
          valueType: "password",
          isPublic: false,
        },
        {
          key: WHATSAPP_SETTING_KEY.BUSINESS_ACCOUNT_ID,
          value: data.businessAccountId,
          category: "whatsapp",
          description: "Business Account ID",
          valueType: "text",
          isPublic: false,
        },
        {
          key: WHATSAPP_SETTING_KEY.PHONE_NUMBER_ID,
          value: data.phoneNumberId,
          category: "whatsapp",
          description: "Phone Number ID",
          valueType: "text",
          isPublic: false,
        },
        {
          key: WHATSAPP_SETTING_KEY.ACCESS_TOKEN,
          value: data.accessToken,
          category: "whatsapp",
          description: "Access Token",
          valueType: "password",
          isPublic: false,
        },
        {
          key: WHATSAPP_SETTING_KEY.VERIFY_TOKEN,
          value: data.verifyToken,
          category: "whatsapp",
          description: "Verify Token",
          valueType: "password",
          isPublic: false,
        },
      ];
  
      await saveSettings(settings);
  
      return this.getWhatsAppSettings();
    }
  }
  
  export default new WhatsAppSettingsService();