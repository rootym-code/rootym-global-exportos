/**
 * ============================================================
 * ROOTYM Business Export Credentials Validation
 * ============================================================
 * Author: Prem Singh
 * Purpose: Validates export, business registration,
 *          regulatory credential and license information.
 * ============================================================
 */

import { z } from "zod";

const optionalString = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""));

const optionalUrl = z
  .string()
  .trim()
  .url("Please enter a valid URL.")
  .max(500)
  .optional()
  .or(z.literal(""));

const optionalDate = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""));

export const businessExportCredentialsSchema = z.object({
  // IEC / DGFT
  iecNumber: optionalString(50),
  iecStatus: optionalString(50),
  iecIssueDate: optionalDate,
  dgftProfileUrl: optionalUrl,

  // GST
  gstin: optionalString(50),
  gstStatus: optionalString(50),
  gstRegistrationDate: optionalDate,

  // UDYAM / MSME
  udyamNumber: optionalString(50),
  udyamStatus: optionalString(50),
  udyamRegistrationDate: optionalDate,

  // Authorized Dealer Code
  adCode: optionalString(50),
  adCodeStatus: optionalString(50),
  adCodeBankName: optionalString(200),

  // ICEGATE
  icegateRegistrationId: optionalString(100),
  icegateStatus: optionalString(50),

  // RCMC
  rcmcNumber: optionalString(100),
  rcmcIssuingAuthority: optionalString(200),
  rcmcStatus: optionalString(50),
  rcmcIssueDate: optionalDate,
  rcmcExpiryDate: optionalDate,

  // Other License 1
  otherLicense1Name: optionalString(200),
  otherLicense1Number: optionalString(100),
  otherLicense1Status: optionalString(50),
  otherLicense1ExpiryDate: optionalDate,

  // Other License 2
  otherLicense2Name: optionalString(200),
  otherLicense2Number: optionalString(100),
  otherLicense2Status: optionalString(50),
  otherLicense2ExpiryDate: optionalDate,

  // Other License 3
  otherLicense3Name: optionalString(200),
  otherLicense3Number: optionalString(100),
  otherLicense3Status: optionalString(50),
  otherLicense3ExpiryDate: optionalDate,

  // Additional Information
  notes: optionalString(5000),
});

export type BusinessExportCredentialsInput = z.infer<
  typeof businessExportCredentialsSchema
>;