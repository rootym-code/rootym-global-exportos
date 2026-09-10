/**
 * ============================================================
 * ROOTYM Global ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Validates customer Inquiry submissions, including
 *          optional Website and Product context.
 * ============================================================
 */

import { z } from "zod";

/**
 * Basic international phone number validation.
 *
 * Allows:
 * +91XXXXXXXXXX
 * 9876543210
 * +1 555 555 5555
 * 020-12345678
 */
const phoneRegex = /^[+]?[0-9()\-\s]{7,20}$/;

export const inquirySchema = z.object({
  /**
   * Website context.
   *
   * Optional for backward compatibility with legacy/global
   * inquiry submissions. The server must validate ownership
   * before persisting this value.
   */
  websiteId: z
    .string()
    .cuid()
    .optional(),

  companyName: z
    .string()
    .trim()
    .min(2, "Company name is required.")
    .max(150, "Company name is too long."),

  contactPerson: z
    .string()
    .trim()
    .min(2, "Contact person is required.")
    .max(100, "Contact person is too long."),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(255),

  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Please enter a valid phone number.")
    .optional()
    .or(z.literal("")),

  country: z
    .string()
    .trim()
    .min(2, "Country is required.")
    .max(100),

  /**
   * Existing product name snapshot.
   *
   * Kept for backward compatibility and historical display.
   */
  product: z
    .string()
    .trim()
    .min(2, "Product is required.")
    .max(150),

  /**
   * Optional Product master reference.
   *
   * The server will validate that the Product belongs to the
   * resolved Website before creating the Inquiry.
   */
  productId: z
    .string()
    .cuid()
    .optional(),

  quantity: z
    .string()
    .trim()
    .max(50)
    .optional()
    .or(z.literal("")),

  unit: z
    .string()
    .trim()
    .max(50)
    .optional()
    .or(z.literal("")),

  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(5000),
});

export type InquiryInput = z.infer<typeof inquirySchema>;