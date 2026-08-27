/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * Organization    : ROOTYM Agro Harvest Pvt. Ltd.
 *
 * Module          : CMS Settings
 * Feature         : Company Settings Service
 *
 * Description
 * ------------------------------------------------------------
 * Handles Company Information settings.
 * ============================================================
 */

import {
  COMPANY_SETTINGS_KEYS,
  SITE_SETTING_KEY,
} from "@/lib/constants/site-settings";

import {
  getSettingsByKeys,
  saveSettings,
} from "./helpers";

import {
  CompanySettingsInput,
  SiteSettingUpsertInput,
} from "./types";

class CompanySettingsService {
  async getCompanySettings() {
    const map = await getSettingsByKeys(
      COMPANY_SETTINGS_KEYS
    );

    return {
      company: {
        companyName:
          map.get(SITE_SETTING_KEY.COMPANY_NAME) ??
          "",

        legalName:
          map.get(SITE_SETTING_KEY.LEGAL_NAME) ??
          "",

        tagline:
          map.get(SITE_SETTING_KEY.TAGLINE) ??
          "",

        description:
          map.get(SITE_SETTING_KEY.DESCRIPTION) ??
          "",

        logo:
          map.get(SITE_SETTING_KEY.LOGO) ??
          "",

        favicon:
          map.get(SITE_SETTING_KEY.FAVICON) ??
          "",
      },

      contact: {
        address:
          map.get(SITE_SETTING_KEY.ADDRESS) ??
          "",

        phone:
          map.get(SITE_SETTING_KEY.PHONE) ??
          "",

        whatsapp:
          map.get(SITE_SETTING_KEY.WHATSAPP) ??
          "",

        email:
          map.get(SITE_SETTING_KEY.EMAIL) ??
          "",
      },

      business: {
        gst:
          map.get(SITE_SETTING_KEY.GST) ??
          "",

        iec:
          map.get(SITE_SETTING_KEY.IEC) ??
          "",

        apeda:
          map.get(SITE_SETTING_KEY.APEDA) ??
          "",
      },

      social: {
        facebook:
          map.get(SITE_SETTING_KEY.FACEBOOK) ??
          "",

        linkedin:
          map.get(SITE_SETTING_KEY.LINKEDIN) ??
          "",

        instagram:
          map.get(SITE_SETTING_KEY.INSTAGRAM) ??
          "",

        youtube:
          map.get(SITE_SETTING_KEY.YOUTUBE) ??
          "",

        twitter:
          map.get(SITE_SETTING_KEY.TWITTER) ??
          "",
      },
    };
  }

  async saveCompanySettings(
    data: CompanySettingsInput
  ) {
    const settings: SiteSettingUpsertInput[] = [
      {
        key: SITE_SETTING_KEY.COMPANY_NAME,
        value: data.company.companyName,
        category: "company",
        description: "Company Name",
        valueType: "text",
        isPublic: true,
      },

      {
        key: SITE_SETTING_KEY.LEGAL_NAME,
        value: data.company.legalName,
        category: "company",
        description: "Legal Company Name",
        valueType: "text",
        isPublic: true,
      },

      {
        key: SITE_SETTING_KEY.TAGLINE,
        value: data.company.tagline,
        category: "company",
        description: "Company Tagline",
        valueType: "text",
        isPublic: true,
      },

      {
        key: SITE_SETTING_KEY.DESCRIPTION,
        value: data.company.description,
        category: "company",
        description: "Company Description",
        valueType: "textarea",
        isPublic: true,
      },

      {
        key: SITE_SETTING_KEY.LOGO,
        value: data.company.logo,
        category: "company",
        description: "Company Logo",
        valueType: "text",
        isPublic: true,
      },

      {
        key: SITE_SETTING_KEY.FAVICON,
        value: data.company.favicon,
        category: "company",
        description: "Company Favicon",
        valueType: "text",
        isPublic: true,
      },

      {
        key: SITE_SETTING_KEY.ADDRESS,
        value: data.contact.address,
        category: "contact",
        description: "Company Address",
        valueType: "text",
        isPublic: true,
      },

      {
        key: SITE_SETTING_KEY.PHONE,
        value: data.contact.phone,
        category: "contact",
        description: "Phone Number",
        valueType: "text",
        isPublic: true,
      },

      {
        key: SITE_SETTING_KEY.WHATSAPP,
        value: data.contact.whatsapp,
        category: "contact",
        description: "WhatsApp Number",
        valueType: "text",
        isPublic: true,
      },

      {
        key: SITE_SETTING_KEY.EMAIL,
        value: data.contact.email,
        category: "contact",
        description: "Email Address",
        valueType: "text",
        isPublic: true,
      },

      {
        key: SITE_SETTING_KEY.GST,
        value: data.business.gst,
        category: "business",
        description: "GST Number",
        valueType: "text",
        isPublic: false,
      },

      {
        key: SITE_SETTING_KEY.IEC,
        value: data.business.iec,
        category: "business",
        description: "IEC Number",
        valueType: "text",
        isPublic: false,
      },

      {
        key: SITE_SETTING_KEY.APEDA,
        value: data.business.apeda,
        category: "business",
        description: "APEDA Registration",
        valueType: "text",
        isPublic: false,
      },

      {
        key: SITE_SETTING_KEY.FACEBOOK,
        value: data.social.facebook,
        category: "social",
        description: "Facebook URL",
        valueType: "text",
        isPublic: true,
      },

      {
        key: SITE_SETTING_KEY.LINKEDIN,
        value: data.social.linkedin,
        category: "social",
        description: "LinkedIn URL",
        valueType: "text",
        isPublic: true,
      },

      {
        key: SITE_SETTING_KEY.INSTAGRAM,
        value: data.social.instagram,
        category: "social",
        description: "Instagram URL",
        valueType: "text",
        isPublic: true,
      },

      {
        key: SITE_SETTING_KEY.YOUTUBE,
        value: data.social.youtube,
        category: "social",
        description: "YouTube URL",
        valueType: "text",
        isPublic: true,
      },

      {
        key: SITE_SETTING_KEY.TWITTER,
        value: data.social.twitter,
        category: "social",
        description: "Twitter / X URL",
        valueType: "text",
        isPublic: true,
      },
    ];

    await saveSettings(settings);

    return this.getCompanySettings();
  }
}

export default new CompanySettingsService();