/**
 * ============================================================
 * ROOTYM Business Tax & Compliance Validation
 * ============================================================
 * Author: Prem Singh
 * Purpose: Validates tenant-scoped tax configuration, export
 *          tax treatment, LUT/Bond information and compliance
 *          settings for the ROOTYM business workspace.
 * ============================================================
 */

import { z } from "zod";

const optionalText = z.string().trim().optional().or(z.literal(""));

const optionalDate = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .refine(
    (value) => {
      if (!value) {
        return true;
      }

      return /^\d{4}-\d{2}-\d{2}$/.test(value);
    },
    {
      message: "Enter a valid date.",
    },
  );

export const businessTaxComplianceSchema = z.object({
  // GST Configuration
  gstRegistrationType: optionalText,
  gstExportTreatment: optionalText,
  defaultTaxRate: z
    .union([z.number(), z.string().trim()])
    .optional()
    .transform((value) => {
      if (value === "" || value === undefined) {
        return undefined;
      }

      return typeof value === "number" ? value : Number(value);
    })
    .refine(
      (value) =>
        value === undefined ||
        (Number.isFinite(value) && value >= 0 && value <= 100),
      {
        message: "Tax rate must be between 0 and 100.",
      },
    ),
  taxNotes: optionalText,

  // LUT / Bond
  lutBondStatus: optionalText,
  lutBondNumber: optionalText,
  lutBondFinancialYear: optionalText,
  lutBondIssueDate: optionalDate,
  lutBondExpiryDate: optionalDate,

  // TDS
  tdsApplicable: z.boolean(),
  tdsNotes: optionalText,

  // TCS
  tcsApplicable: z.boolean(),
  tcsNotes: optionalText,

  // Compliance
  complianceStatus: optionalText,
  nextComplianceDate: optionalDate,
  complianceNotes: optionalText,
});

export type BusinessTaxComplianceInput = z.infer<
  typeof businessTaxComplianceSchema
>;