/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Validates tenant-scoped business address data
 *          submitted through the Customer Workspace.
 * ============================================================
 */

import { z } from "zod";

export const businessAddressSchema = z.object({
  addressLine1: z
    .string()
    .trim()
    .min(1, "Address line 1 is required")
    .max(300, "Address line 1 must not exceed 300 characters"),

  addressLine2: z
    .string()
    .trim()
    .max(300, "Address line 2 must not exceed 300 characters")
    .optional()
    .or(z.literal("")),

  city: z
    .string()
    .trim()
    .max(100, "City must not exceed 100 characters")
    .optional()
    .or(z.literal("")),

  state: z
    .string()
    .trim()
    .max(100, "State must not exceed 100 characters")
    .optional()
    .or(z.literal("")),

  postalCode: z
    .string()
    .trim()
    .max(30, "Postal code must not exceed 30 characters")
    .optional()
    .or(z.literal("")),

  country: z
    .string()
    .trim()
    .max(100, "Country must not exceed 100 characters")
    .optional()
    .or(z.literal("")),
});

export type BusinessAddressInput = z.infer<typeof businessAddressSchema>;