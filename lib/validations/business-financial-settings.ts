/**
 * ============================================================
 * ROOTYM Business Financial Settings Validation
 * ============================================================
 * Author: Prem Singh
 * Purpose: Validates tenant-scoped currency, payment terms,
 *          banking and foreign-remittance configuration.
 * ============================================================
 */

import { z } from "zod";

const optionalText = z.string().trim().optional().or(z.literal(""));

export const businessFinancialSettingsSchema = z.object({
  // ==========================================================
  // Currency
  // ==========================================================

  baseCurrency: optionalText,
  defaultInvoiceCurrency: optionalText,
  currencyNotes: optionalText,

  // ==========================================================
  // Payment Terms
  // ==========================================================

  defaultPaymentTermsDays: z
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
        (Number.isInteger(value) && value >= 0 && value <= 3650),
      {
        message: "Payment terms must be a whole number between 0 and 3650 days.",
      },
    ),

  defaultPaymentMethod: optionalText,
  paymentTermsNotes: optionalText,

  // ==========================================================
  // Beneficiary / Bank Details
  // ==========================================================

  beneficiaryName: optionalText,
  bankName: optionalText,
  branchName: optionalText,
  accountNumber: optionalText,
  accountCurrency: optionalText,
  ifscCode: optionalText,
  swiftBic: optionalText,
  iban: optionalText,
  bankAddress: optionalText,
  bankCountry: optionalText,

  // ==========================================================
  // Foreign Remittance Details
  // ==========================================================

  remittanceBankName: optionalText,
  remittanceBankSwiftBic: optionalText,

  correspondentBankName: optionalText,
  correspondentBankSwiftBic: optionalText,

  intermediaryBankName: optionalText,
  intermediaryBankSwiftBic: optionalText,

  foreignBankAccountNumber: optionalText,
  foreignBankIban: optionalText,
  routingOrSortCode: optionalText,

  remittanceCurrency: optionalText,
  rbiPurposeCode: optionalText,

  foreignRemittanceInstructions: optionalText,
  remittanceReferenceInstructions: optionalText,

  bankChargesArrangement: optionalText,

  foreignRemittanceNotes: optionalText,
});

export type BusinessFinancialSettingsInput = z.infer<
  typeof businessFinancialSettingsSchema
>;