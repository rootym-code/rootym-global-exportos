/**
 * ============================================================
 * ROOTYM Global Export Platform
 * ============================================================
 * Module      : CMS
 * Feature     : Company Management
 * File        : types.ts
 * Purpose     : Shared Company Management types aligned with
 *               the CMS CompanySettingsInput structure.
 * ============================================================
 */

export interface CompanySettings {
  company: {
    companyName: string;
    legalName: string;
    tagline: string;
    description: string;
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

export interface CompanySettingsResponse {
  success: boolean;
  message?: string;
  data: CompanySettings;
}