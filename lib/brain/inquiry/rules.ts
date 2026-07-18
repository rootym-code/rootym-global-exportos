/**
 * ============================================================
 * ROOTYM Brain
 * File: lib/brain/inquiry/rules.ts
 *
 * Central Business Rules
 *
 * All Inquiry Intelligence modules must consume these rules.
 * Do NOT hardcode business logic inside engines.
 * ============================================================
 */

export type LeadTemperature =
  | "NEW"
  | "COLD"
  | "WARM"
  | "HOT";

export type InquiryPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "URGENT";

export interface CountryRule {
  countries: readonly string[];
  score: number;
}

export interface ThresholdRule<T> {
  minScore: number;
  value: T;
}

/* -------------------------------------------------------------------------- */
/*                           Country Priority Rules                           */
/* -------------------------------------------------------------------------- */

export const COUNTRY_PRIORITY_RULES: readonly CountryRule[] = [
  {
    countries: ["UAE", "United Arab Emirates"],
    score: 20,
  },
  {
    countries: ["Saudi Arabia", "KSA"],
    score: 20,
  },
  {
    countries: ["Qatar"],
    score: 18,
  },
  {
    countries: ["Oman"],
    score: 15,
  },
  {
    countries: ["Kuwait"],
    score: 15,
  },
  {
    countries: ["Bahrain"],
    score: 15,
  },
  {
    countries: ["United Kingdom", "UK"],
    score: 20,
  },
  {
    countries: ["United States", "USA"],
    score: 20,
  },
  {
    countries: ["Canada"],
    score: 18,
  },
  {
    countries: ["Australia"],
    score: 18,
  },
] as const;

/* -------------------------------------------------------------------------- */
/*                          Inquiry Scoring Rules                             */
/* -------------------------------------------------------------------------- */

export const INQUIRY_SCORE = {
  companyProvided: 10,

  contactPersonProvided: 5,

  businessEmail: 10,

  genericEmail: 4,

  phoneProvided: 5,

  messageProvided: 5,

  quantityProvided: 10,

  largeQuantity: 15,

  repeatBuyer: 25,

  productProvided: 10,
} as const;

/* -------------------------------------------------------------------------- */
/*                           Lead Temperature Rules                           */
/* -------------------------------------------------------------------------- */

export const LEAD_TEMPERATURE_RULES: readonly ThresholdRule<LeadTemperature>[] =
  [
    {
      minScore: 90,
      value: "HOT",
    },
    {
      minScore: 70,
      value: "WARM",
    },
    {
      minScore: 40,
      value: "COLD",
    },
    {
      minScore: 0,
      value: "NEW",
    },
  ] as const;

/* -------------------------------------------------------------------------- */
/*                             Priority Rules                                 */
/* -------------------------------------------------------------------------- */

export const PRIORITY_RULES: readonly ThresholdRule<InquiryPriority>[] = [
  {
    minScore: 81,
    value: "URGENT",
  },
  {
    minScore: 61,
    value: "HIGH",
  },
  {
    minScore: 31,
    value: "MEDIUM",
  },
  {
    minScore: 0,
    value: "LOW",
  },
] as const;

/* -------------------------------------------------------------------------- */
/*                         Duplicate Detection Rules                          */
/* -------------------------------------------------------------------------- */

export const DUPLICATE_RULES = {
  emailWeight: 45,

  phoneWeight: 35,

  companyWeight: 10,

  contactPersonWeight: 10,

  duplicateThreshold: 75,
} as const;

/* -------------------------------------------------------------------------- */
/*                      Follow-up Recommendation Rules                        */
/* -------------------------------------------------------------------------- */

export const FOLLOW_UP_RULES = [
  {
    minScore: 90,
    recommendation: "Contact within 15 minutes",
  },
  {
    minScore: 75,
    recommendation: "Contact within 1 hour",
  },
  {
    minScore: 60,
    recommendation: "Contact today",
  },
  {
    minScore: 40,
    recommendation: "Email and follow up tomorrow",
  },
  {
    minScore: 0,
    recommendation: "Automated acknowledgement only",
  },
] as const;

/* -------------------------------------------------------------------------- */
/*                            Email Classification                            */
/* -------------------------------------------------------------------------- */

export const GENERIC_EMAIL_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
  "proton.me",
  "protonmail.com",
  "live.com",
  "rediffmail.com",
] as const;

/* -------------------------------------------------------------------------- */
/*                              Quantity Rules                                */
/* -------------------------------------------------------------------------- */

export const LARGE_QUANTITY_THRESHOLD = 1000;

/* -------------------------------------------------------------------------- */
/*                         Exported Rule Collection                           */
/* -------------------------------------------------------------------------- */

export const InquiryRules = {
  COUNTRY_PRIORITY_RULES,
  INQUIRY_SCORE,
  LEAD_TEMPERATURE_RULES,
  PRIORITY_RULES,
  DUPLICATE_RULES,
  FOLLOW_UP_RULES,
  GENERIC_EMAIL_DOMAINS,
  LARGE_QUANTITY_THRESHOLD,
} as const;

export default InquiryRules;