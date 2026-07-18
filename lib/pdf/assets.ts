/**
 * ============================================================
 * ROOTYM PDF Assets
 * File: lib/pdf/assets.ts
 * Sprint 8
 * ============================================================
 */

import { rgb, RGB } from "pdf-lib";

export interface CompanyDetails {
  name: string;
  tagline: string;

  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;

  phone: string;
  email: string;
  website: string;

  gstin?: string;
  iec?: string;
  apeda?: string;
}

export interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  ifsc: string;
  swift?: string;
  branch?: string;
}

export interface PdfTheme {
  primary: RGB;
  secondary: RGB;
  border: RGB;
  text: RGB;
  muted: RGB;
  success: RGB;
}

export const PDF_THEME: PdfTheme = {
  primary: rgb(0.08, 0.45, 0.18),
  secondary: rgb(0.92, 0.96, 0.92),
  border: rgb(0.80, 0.80, 0.80),
  text: rgb(0.15, 0.15, 0.15),
  muted: rgb(0.45, 0.45, 0.45),
  success: rgb(0.00, 0.60, 0.20),
};

export const ROOTYM_COMPANY: CompanyDetails = {
  name: "ROOTYM AGRO HARVEST PRIVATE LIMITED",

  tagline: "Rooted in India. Trusted Worldwide.",

  address: "Registered Office",

  city: "Pune",

  state: "Maharashtra",

  country: "India",

  postalCode: "",

  phone: "",

  email: "info@rootym.in",

  website: "www.rootym.in",

  gstin: "",

  iec: "",

  apeda: "",
};

export const ROOTYM_BANK: BankDetails = {
  bankName: "",

  accountName: "ROOTYM AGRO HARVEST PRIVATE LIMITED",

  accountNumber: "",

  ifsc: "",

  swift: "",

  branch: "",
};

export const PDF_FOOTER = [
  "This quotation is confidential and intended only for the recipient.",
  "Prices are subject to change without prior notice unless otherwise agreed.",
  "Goods remain subject to availability.",
];

export const DEFAULT_PAYMENT_TERMS =
  "100% Advance against Proforma Invoice.";

export const DEFAULT_DELIVERY_TERMS =
  "As mutually agreed between buyer and seller.";

export const DEFAULT_INCOTERMS = "FOB";

export const DEFAULT_VALIDITY_DAYS = 30;

/**
 * Placeholder for the company logo.
 *
 * Future implementation:
 * - Read PNG/SVG from public/logo
 * - Convert to Uint8Array
 * - Embed using pdf-lib
 */
export async function loadCompanyLogo():
  Promise<Uint8Array | null> {
  return null;
}