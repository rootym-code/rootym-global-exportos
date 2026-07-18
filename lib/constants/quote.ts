/**
 * ============================================================
 * ROOTYM
 * File: lib/constants/quote.ts
 * Sprint 8.1
 * ============================================================
 */

import type { QuoteStatus } from "@/lib/types/quote";

/**
 * Default Pagination
 */
export const DEFAULT_QUOTE_PAGE_SIZE = 10;

export const QUOTE_PAGE_SIZE_OPTIONS = [
  10,
  20,
  50,
  100,
] as const;

/**
 * Quote Number
 */
export const QUOTE_NUMBER_PREFIX = "RTM-QT";

/**
 * Quote Validity
 */
export const DEFAULT_QUOTE_VALIDITY_DAYS = 30;

/**
 * Commercial Terms
 */
export const DEFAULT_INCOTERM = "FOB";

export const INCOTERMS = [
  "EXW",
  "FCA",
  "FAS",
  "FOB",
  "CFR",
  "CIF",
  "CPT",
  "CIP",
  "DAP",
  "DPU",
  "DDP",
] as const;

export const PAYMENT_TERMS = [
  "100% Advance",
  "50% Advance / 50% Before Shipment",
  "30% Advance / 70% Against BL Copy",
  "LC At Sight",
  "Usance LC",
  "CAD",
  "Open Account",
] as const;

export const DELIVERY_TERMS = [
  "Immediate",
  "7 Days",
  "15 Days",
  "21 Days",
  "30 Days",
  "45 Days",
  "60 Days",
] as const;

/**
 * Currency
 */
export const SUPPORTED_CURRENCIES = [
  "INR",
  "USD",
  "EUR",
  "GBP",
  "AED",
] as const;

/**
 * Quote Status
 */
export const QUOTE_STATUSES: readonly QuoteStatus[] = [
  "DRAFT",
  "SENT",
  "VIEWED",
  "NEGOTIATION",
  "APPROVED",
  "REJECTED",
  "EXPIRED",
];

/**
 * Default Values
 */
export const DEFAULT_CURRENCY = "USD";

export const DEFAULT_TAX_RATE = 0;

export const DEFAULT_DISCOUNT = 0;

export const DEFAULT_FREIGHT = 0;

export const DEFAULT_INSURANCE = 0;

/**
 * Limits
 */
export const MAX_QUOTE_ITEMS = 100;

export const MIN_QUOTE_ITEMS = 1;

export const MAX_NOTE_LENGTH = 5000;

export const MAX_TERMS_LENGTH = 10000;

export const MAX_REMARKS_LENGTH = 1000;

/**
 * File Generation
 */
export const QUOTE_PDF_FILE_PREFIX = "ROOTYM-Quote";

export const QUOTE_EXPORT_FILENAME = "quotes";

/**
 * Email
 */
export const DEFAULT_QUOTE_SUBJECT =
  "Quotation from ROOTYM";

export const DEFAULT_QUOTE_EMAIL_SIGNATURE = `Regards,

Sales Team
ROOTYM Agro Harvest Pvt. Ltd.
Rooted in India. Trusted Worldwide.`;

/**
 * Quote Workflow
 */
export const AUTO_EXPIRE_AFTER_DAYS = 30;

export const ALLOW_DUPLICATE_QUOTES = true;

export const ENABLE_EMAIL_TRACKING = true;

export const ENABLE_PDF_PREVIEW = true;

/**
 * Dashboard
 */
export const RECENT_QUOTES_LIMIT = 10;

export const DASHBOARD_CHART_MONTHS = 12;