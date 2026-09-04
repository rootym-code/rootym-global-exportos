/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Validates tenant-scoped Business Profile input used
 *          by the customer Business Configuration module.
 * ============================================================
 */

import { z } from "zod";

export const businessProfileSchema = z.object({
  businessName: z
    .string()
    .trim()
    .min(1, "Business name is required")
    .max(200, "Business name must not exceed 200 characters"),

  legalName: z
    .string()
    .trim()
    .max(200, "Legal name must not exceed 200 characters")
    .optional()
    .or(z.literal("")),

  businessType: z
    .string()
    .trim()
    .max(100, "Business type must not exceed 100 characters")
    .optional()
    .or(z.literal("")),

  email: z
    .string()
    .trim()
    .email("Enter a valid business email")
    .max(254, "Email must not exceed 254 characters")
    .optional()
    .or(z.literal("")),

  phone: z
    .string()
    .trim()
    .max(30, "Phone number must not exceed 30 characters")
    .optional()
    .or(z.literal("")),

  country: z
    .string()
    .trim()
    .max(100, "Country must not exceed 100 characters")
    .optional()
    .or(z.literal("")),

  website: z
    .string()
    .trim()
    .url("Enter a valid website URL")
    .max(500, "Website URL must not exceed 500 characters")
    .optional()
    .or(z.literal("")),

  description: z
    .string()
    .trim()
    .max(2000, "Business description must not exceed 2000 characters")
    .optional()
    .or(z.literal("")),
});

export type BusinessProfileInput = z.infer<
  typeof businessProfileSchema
>;