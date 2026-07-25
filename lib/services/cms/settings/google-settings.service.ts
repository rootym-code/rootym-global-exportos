/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * Organization    : ROOTYM Agro Harvest Pvt. Ltd.
 *
 * Module          : CMS Settings
 * Feature         : Google Settings Service
 *
 * Description
 * ------------------------------------------------------------
 * Handles Google Integration settings.
 * ============================================================
 */

import {
    GOOGLE_SETTING_KEY,
    GOOGLE_SETTING_KEYS,
  } from "@/lib/constants/site-settings/google";
  
  import {
    getSettingsByKeys,
    saveSettings,
  } from "./helpers";
  
  import {
    GoogleSettingsInput,
    SiteSettingUpsertInput,
  } from "./types";
  
  class GoogleSettingsService {
    async getGoogleSettings() {
      const map = await getSettingsByKeys(
        GOOGLE_SETTING_KEYS
      );
  
      return {
        ga4MeasurementId:
          map.get(
            GOOGLE_SETTING_KEY.GA4_MEASUREMENT_ID
          ) ?? "",
  
        gtmContainerId:
          map.get(
            GOOGLE_SETTING_KEY.GTM_CONTAINER_ID
          ) ?? "",
  
        searchConsoleVerification:
          map.get(
            GOOGLE_SETTING_KEY.SEARCH_CONSOLE_VERIFICATION
          ) ?? "",
  
        businessProfileUrl:
          map.get(
            GOOGLE_SETTING_KEY.BUSINESS_PROFILE_URL
          ) ?? "",
  
        recaptchaSiteKey:
          map.get(
            GOOGLE_SETTING_KEY.RECAPTCHA_SITE_KEY
          ) ?? "",
  
        recaptchaSecretKey:
          map.get(
            GOOGLE_SETTING_KEY.RECAPTCHA_SECRET_KEY
          ) ?? "",
      };
    }
  
    async saveGoogleSettings(
      data: GoogleSettingsInput
    ) {
      const settings: SiteSettingUpsertInput[] = [
        {
          key: GOOGLE_SETTING_KEY.GA4_MEASUREMENT_ID,
          value: data.ga4MeasurementId,
          category: "google",
          description: "GA4 Measurement ID",
          valueType: "text",
          isPublic: true,
        },
        {
          key: GOOGLE_SETTING_KEY.GTM_CONTAINER_ID,
          value: data.gtmContainerId,
          category: "google",
          description:
            "Google Tag Manager Container ID",
          valueType: "text",
          isPublic: true,
        },
        {
          key:
            GOOGLE_SETTING_KEY.SEARCH_CONSOLE_VERIFICATION,
          value: data.searchConsoleVerification,
          category: "google",
          description:
            "Google Search Console Verification",
          valueType: "text",
          isPublic: true,
        },
        {
          key:
            GOOGLE_SETTING_KEY.BUSINESS_PROFILE_URL,
          value: data.businessProfileUrl,
          category: "google",
          description:
            "Google Business Profile URL",
          valueType: "url",
          isPublic: true,
        },
        {
          key:
            GOOGLE_SETTING_KEY.RECAPTCHA_SITE_KEY,
          value: data.recaptchaSiteKey,
          category: "google",
          description: "reCAPTCHA Site Key",
          valueType: "text",
          isPublic: true,
        },
        {
          key:
            GOOGLE_SETTING_KEY.RECAPTCHA_SECRET_KEY,
          value: data.recaptchaSecretKey,
          category: "google",
          description: "reCAPTCHA Secret Key",
          valueType: "password",
          isPublic: false,
        },
      ];
  
      await saveSettings(settings);
  
      return this.getGoogleSettings();
    }
  }
  
  export default new GoogleSettingsService();