/**
 * ============================================================
 * ROOTYM Global Export Platform
 * ============================================================
 * Author: Prem Singh
 * Module      : CMS
 * Feature     : Company Settings
 * Purpose     : Provides a shared client-side source of truth
 *               for CMS-managed company settings used throughout
 *               the public-facing website.
 * ============================================================
 */

"use client";

import { useEffect, useState } from "react";

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

interface CompanySettingsResponse {
  success: boolean;
  message?: string;
  data?: CompanySettings;
}

/**
 * Shared in-memory cache.
 *
 * All components using useCompanySettings() on the same
 * client session can reuse the same loaded settings.
 */
let cachedCompanySettings: CompanySettings | null = null;

/**
 * Shared in-flight request.
 *
 * Prevents Navbar, Footer, Hero, CTA, etc. from creating
 * separate simultaneous requests when they mount together.
 */
let companySettingsPromise:
  | Promise<CompanySettings | null>
  | null = null;

async function fetchCompanySettings(): Promise<CompanySettings | null> {
  try {
    const response = await fetch(
      "/api/admin/cms/settings/company",
      {
        cache: "no-store",
        credentials: "include",
      }
    );

    const result: CompanySettingsResponse =
      await response.json();

    if (
      !response.ok ||
      !result.success ||
      !result.data
    ) {
      throw new Error(
        result.message ??
          "Unable to load company settings."
      );
    }

    cachedCompanySettings = result.data;

    return result.data;
  } catch (error) {
    console.error(
      "Company settings loading error:",
      error
    );

    return null;
  }
}

function getCompanySettingsPromise() {
  if (!companySettingsPromise) {
    companySettingsPromise =
      fetchCompanySettings();
  }

  return companySettingsPromise;
}

export function useCompanySettings() {
  const [settings, setSettings] =
    useState<CompanySettings | null>(
      cachedCompanySettings
    );

  const [loading, setLoading] = useState(
    !cachedCompanySettings
  );

  useEffect(() => {
    let mounted = true;

    if (cachedCompanySettings) {
      setSettings(cachedCompanySettings);
      setLoading(false);

      return () => {
        mounted = false;
      };
    }

    getCompanySettingsPromise().then((data) => {
      if (!mounted) {
        return;
      }

      setSettings(data);
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  return {
    /**
     * Complete nested CMS response.
     */
    settings,

    /**
     * Request state.
     */
    loading,

    /**
     * Company
     */
    companyName:
      settings?.company.companyName ||
      "ROOTYM",

    legalName:
      settings?.company.legalName ||
      "",

    tagline:
      settings?.company.tagline ||
      "",

    description:
      settings?.company.description ||
      "",

    logo:
      settings?.company.logo ||
      "",

    favicon:
      settings?.company.favicon ||
      "",

    /**
     * Contact
     */
    address:
      settings?.contact.address ||
      "",

    phone:
      settings?.contact.phone ||
      "",

    whatsapp:
      settings?.contact.whatsapp ||
      "",

    email:
      settings?.contact.email ||
      "",

    /**
     * Business
     */
    gst:
      settings?.business.gst ||
      "",

    iec:
      settings?.business.iec ||
      "",

    apeda:
      settings?.business.apeda ||
      "",

    /**
     * Social
     */
    social:
      settings?.social ?? {
        facebook: "",
        linkedin: "",
        instagram: "",
        youtube: "",
        twitter: "",
      },
  };
}