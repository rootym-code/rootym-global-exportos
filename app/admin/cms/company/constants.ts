/**
 * ============================================================
 * ROOTYM Global Export Platform
 * ============================================================
 * Module      : CMS
 * Feature     : Company Management
 * File        : constants.ts
 * Purpose     : Constants and default values
 * Sprint      : Sprint 10.3
 * ============================================================
 */

import type { CompanySettings } from "./types";

export const DEFAULT_COMPANY_SETTINGS: CompanySettings = {
  company: {
    companyName: "",
    legalName: "",
    tagline: "",
    description: "",
    logo: "",
    favicon: "",
  },

  contact: {
    address: "",
    phone: "",
    whatsapp: "",
    email: "",
  },

  business: {
    gst: "",
    iec: "",
    apeda: "",
  },

  social: {
    facebook: "",
    linkedin: "",
    instagram: "",
    youtube: "",
    twitter: "",
  },
};

export const COMPANY_SECTIONS = {
  COMPANY: "Company Details",
  CONTACT: "Contact Details",
  BUSINESS: "Business Details",
  BRANDING: "Branding",
  SOCIAL: "Social Media",
} as const;