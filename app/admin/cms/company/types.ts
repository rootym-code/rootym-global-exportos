/**
 * ============================================================
 * ROOTYM Global Export Platform
 * ============================================================
 * Module      : CMS
 * Feature     : Company Management
 * File        : types.ts
 * Purpose     : Type definitions for Company Management
 * Sprint      : Sprint 10.3
 * ============================================================
 */

export interface CompanySettings {
    companyName: string;
    legalName: string;
    tagline: string;
  
    address: string;
    phone: string;
    whatsapp: string;
    email: string;
  
    gst: string;
    iec: string;
    apeda: string;
  
    facebook: string;
    linkedin: string;
    instagram: string;
    youtube: string;
    twitter: string;
  
    logo: string;
    favicon: string;
  }
  
  export interface CompanySettingsResponse {
    success: boolean;
    message?: string;
    data: CompanySettings;
  }