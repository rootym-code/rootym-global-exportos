/**
 * ============================================================
 * ROOTYM Global Export Platform
 * ============================================================
 * Module      : CMS
 * Feature     : Company Management
 * File        : api.ts
 * Purpose     : API communication for Company Management
 * Sprint      : Sprint 10.3
 * ============================================================
 */

import type {
    CompanySettings,
    CompanySettingsResponse,
  } from "./types";
  
  const API_ENDPOINT =
    "/api/admin/cms/settings/company";
  
  /* ============================================================
     Load Company Settings
  ============================================================ */
  
  export async function getCompanySettings(): Promise<CompanySettings> {
    const response = await fetch(API_ENDPOINT, {
      cache: "no-store",
      credentials: "include",
    });
  
    const result: CompanySettingsResponse =
      await response.json();
  
    if (!response.ok || !result.success) {
      throw new Error(
        result.message ??
          "Unable to load company settings."
      );
    }
  
    return result.data;
  }
  
  /* ============================================================
     Save Company Settings
  ============================================================ */
  
  export async function saveCompanySettings(
    settings: CompanySettings
  ): Promise<CompanySettings> {
    const response = await fetch(API_ENDPOINT, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    });
  
    const result: CompanySettingsResponse =
      await response.json();
  
    if (!response.ok || !result.success) {
      throw new Error(
        result.message ??
          "Unable to save company settings."
      );
    }
  
    return result.data;
  }