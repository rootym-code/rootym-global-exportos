/**
 * ============================================================
 * ROOTYM
 * File: lib/validators/quote.ts
 * Sprint 8.1
 * ============================================================
 */

import { z } from "zod";

import {
  SUPPORTED_CURRENCIES,
  QUOTE_STATUSES,
  MAX_NOTE_LENGTH,
  MAX_QUOTE_ITEMS,
  MIN_QUOTE_ITEMS,
} from "@/lib/constants/quote";

/**
 * ------------------------------------------------------------
 * Quote Item
 * ------------------------------------------------------------
 */

export const quoteItemSchema = z.object({
  id: z.string().optional(),

  productId: z
    .string()
    .trim()
    .min(1, "Product is required."),

  description: z
    .string()
    .max(1000)
    .optional()
    .nullable(),

  quantity: z
    .number()
    .positive("Quantity must be greater than zero."),

  unit: z
    .string()
    .trim()
    .min(1, "Unit is required.")
    .max(50),

  unitPrice: z
    .number()
    .min(0, "Unit price cannot be negative."),

  lineTotal: z
    .number()
    .min(0)
    .default(0),
});

/**
 * ------------------------------------------------------------
 * Quote
 * ------------------------------------------------------------
 */

export const quoteSchema = z.object({
  inquiryId: z
    .string()
    .optional()
    .nullable(),

  status: z
    .enum(QUOTE_STATUSES)
    .default("DRAFT"),

  companyName: z
    .string()
    .trim()
    .min(1, "Company name is required.")
    .max(200),

  contactPerson: z
    .string()
    .trim()
    .min(1, "Contact person is required.")
    .max(200),

  email: z
    .string()
    .trim()
    .email("Invalid email address."),

  phone: z
    .string()
    .max(50)
    .optional()
    .nullable(),

  country: z
    .string()
    .trim()
    .min(1, "Country is required.")
    .max(100),

  currency: z.enum(
    SUPPORTED_CURRENCIES
  ),

  validityDays: z
    .number()
    .int()
    .min(1)
    .max(365)
    .default(15),

  notes: z
    .string()
    .max(MAX_NOTE_LENGTH)
    .optional()
    .nullable(),

  subtotal: z
    .number()
    .min(0)
    .default(0),

  discount: z
    .number()
    .min(0)
    .default(0),

  freight: z
    .number()
    .min(0)
    .default(0),

  insurance: z
    .number()
    .min(0)
    .default(0),

  tax: z
    .number()
    .min(0)
    .default(0),

  grandTotal: z
    .number()
    .min(0)
    .default(0),

  items: z
    .array(quoteItemSchema)
    .min(
      MIN_QUOTE_ITEMS,
      "At least one line item is required."
    )
    .max(
      MAX_QUOTE_ITEMS,
      `Maximum ${MAX_QUOTE_ITEMS} line items allowed.`
    ),
});

/**
 * ------------------------------------------------------------
 * Quote Status
 * ------------------------------------------------------------
 */

export const quoteStatusSchema =
  z.object({
    status: z.enum(
      QUOTE_STATUSES
    ),

    remarks: z
      .string()
      .max(1000)
      .optional(),
  });

/**
 * ------------------------------------------------------------
 * Send Quote
 * ------------------------------------------------------------
 */

export const sendQuoteSchema =
  z.object({
    to: z.string().email(),

    cc: z
      .string()
      .optional(),

    subject: z
      .string()
      .trim()
      .min(1)
      .max(300),

    message: z
      .string()
      .trim()
      .min(1)
      .max(10000),
  });

/**
 * ------------------------------------------------------------
 * Types
 * ------------------------------------------------------------
 */

export type QuoteInput =
  z.infer<typeof quoteSchema>;

export type QuoteItemInput =
  z.infer<typeof quoteItemSchema>;

export type QuoteStatusInput =
  z.infer<typeof quoteStatusSchema>;

export type SendQuoteInput =
  z.infer<typeof sendQuoteSchema>;