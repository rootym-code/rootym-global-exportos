export interface SiteSettingUpsertInput {
  key: string;
  value: string;
  category: string;
  description: string;
  valueType: string;
  isPublic: boolean;
}

export interface WhatsAppSettingsInput {
  metaAppId: string;
  metaAppSecret: string;
  businessAccountId: string;
  phoneNumberId: string;
  accessToken: string;
  verifyToken: string;
}

export interface GoogleSettingsInput {
  ga4MeasurementId: string;
  gtmContainerId: string;
  searchConsoleVerification: string;
  businessProfileUrl: string;
  recaptchaSiteKey: string;
  recaptchaSecretKey: string;
}

export interface CompanySettingsInput {
  company: {
    companyName: string;
    legalName: string;
    tagline: string;
    logo: string;
    favicon: string;
  };

  contact: {
    address: string;
    phone: string;
    whatsapp: string;
    email: string;
  };

  business: {
    gst: string;
    iec: string;
    apeda: string;
  };

  social: {
    facebook: string;
    linkedin: string;
    instagram: string;
    youtube: string;
    twitter: string;
  };
}